import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper: raw body from Request (App Router)
async function getRawBody(req: Request): Promise<Buffer> {
  return Buffer.from(await req.arrayBuffer());
}

// Helper: get user_id by stripe_customer_id from user_plans
async function getSupabaseUserId(stripeCustomerId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('user_plans')
    .select('user_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Erro ao obter user_id:', error);
    return null;
  }
  // data may be null if none found
  return (data as any)?.user_id ?? null;
}

// Helper: mark event id processed (very simple idempotency)
// You should create a table stripe_events(event_id primary key, processed_at timestamp)
async function markEventProcessed(eventId: string) {
  const { error } = await supabaseAdmin
    .from('stripe_events')
    .insert({ event_id: eventId, processed_at: new Date().toISOString() })
    .select();
  if (error) {
    // log but don't fail the webhook; duplicate inserts may cause conflict if primary key exists
    console.warn('Could not mark event processed (maybe duplicate):', error.message);
  }
}

async function isEventProcessed(eventId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('stripe_events')
    .select('event_id')
    .eq('event_id', eventId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('Error checking event processed:', error.message);
    return false; // be conservative: if DB fails, allow processing (or you may prefer to reject)
  }
  return !!data;
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET env var');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await getRawBody(req);
    // Construct and verify signature
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Erro na validação do webhook:', err?.message ?? err);
    return new Response(`Webhook Error: ${err?.message ?? 'invalid signature'}`, { status: 400 });
  }

  // Idempotency: don't reprocess events
  try {
    const already = await isEventProcessed(event.id);
    if (already) {
      console.log(`Event ${event.id} already processed — ignoring.`);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }
  } catch (e) {
    console.warn('Erro ao checar idempotência:', (e as Error).message);
    // Continue processing (or return 500 to be safe). Here we continue.
  }

  console.log(`📩 Evento recebido: ${event.type}`);

  try {
    // -----------------------
    // checkout.session.completed
    // -----------------------
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id as string | undefined;
      const customerId = typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : (session.subscription as any)?.id;

      if (!userId || !customerId) {
        console.warn('⚠️ Missing user_id or customerId on metadata/session');
        // Mark event processed to avoid retrying repeatedly (you may want a different strategy)
        await markEventProcessed(event.id);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // Fetch line items explicitly (checkout.session.* webhooks normally não incluem line_items)
      let stripeProductId: string | null = null;
      let stripePriceId: string | null = null;
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id as string, { limit: 1 });
        const first = lineItems.data[0];
        if (first) {
          stripeProductId = typeof first.price?.product === 'string' ? first.price.product as string :  null;
          stripePriceId = typeof first.price?.id === 'string' ? first.price.id : null;
        }
      } catch (liErr: any) {
        console.warn('Could not fetch line items:', liErr?.message ?? liErr);
      }

      // Optional: you could fetch the subscription to get accurate trial/current_period dates
      let subscriptionObj: Stripe.Subscription | null = null;
      if (subscriptionId) {
        try {
          subscriptionObj = await stripe.subscriptions.retrieve(subscriptionId);
        } catch (subErr: any) {
          console.warn('Could not retrieve subscription:', subErr?.message ?? subErr);
        }
      }

      // Check that user exists in user_profiles (or whatever source of truth)
      const { data: userProfile, error: userProfileError } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (userProfileError) {
        console.error('Error fetching user profile:', userProfileError.message);
        // Decide whether to continue or abort. We'll mark processed and return 200 to avoid retries,
        // but you could also alert/devOps or schedule a retry workflow.
        await markEventProcessed(event.id);
        return new Response(JSON.stringify({ error: 'Error fetching user profile' }), { status: 200 });
      }

      if (!userProfile) {
        // User not found — dangerous to auto-refund. Instead: create a record for manual review.
        console.warn(`User ${userId} not found in user_profiles. Flagging for review.`);
        await supabaseAdmin.from('stripe_unmatched_sessions').insert({
          session_id: session.id,
          stripe_customer_id: customerId,
          metadata: session.metadata ?? {},
          received_at: new Date().toISOString(),
        });

        // OPTIONAL: automatic refund (commented — use with care)
        // if (session.payment_intent) {
        //   await stripe.refunds.create({ payment_intent: session.payment_intent as string, reason: 'requested_by_customer' });
        // }

        await markEventProcessed(event.id);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // Build user_plans object (use subscriptionObj if available for accurate fields)
      const userPlanRecord: any = {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId ?? null,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
        status: subscriptionObj ? subscriptionObj.status : (session.mode === 'subscription' ? 'incomplete' : 'unknown'),
        current_period_start: subscriptionObj ? new Date(subscriptionObj.current_period_start * 1000).toISOString() : null,
        current_period_end: subscriptionObj ? new Date(subscriptionObj.current_period_end * 1000).toISOString() : null,
        trial_start: subscriptionObj && subscriptionObj.trial_start ? new Date(subscriptionObj.trial_start * 1000).toISOString() : null,
        trial_end: subscriptionObj && subscriptionObj.trial_end ? new Date(subscriptionObj.trial_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabaseAdmin
        .from('user_plans')
        .upsert(userPlanRecord, { onConflict: 'user_id' });

      if (upsertErr) {
        console.error('Erro upserting user_plans:', upsertErr.message);
        // mark processed to avoid retries or decide to not mark to retry
        await markEventProcessed(event.id);
        return new Response(JSON.stringify({ error: 'Failed to upsert user_plans' }), { status: 500 });
      }

      await markEventProcessed(event.id);
      console.log(`✅ user_plans atualizado para user ${userId} (checkout.session.completed).`);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    // -----------------------
    // checkout.session.async_payment_succeeded / failed
    // -----------------------
    if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`💸 Pagamento assíncrono OK para sessão ${session.id}`);
      await markEventProcessed(event.id);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }
    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`❌ Pagamento assíncrono FALHOU para sessão ${session.id}`);
      await markEventProcessed(event.id);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    // -----------------------
    // customer.subscription.* (create, updated, deleted)
    // -----------------------
    if (event.type.startsWith('customer.subscription.')) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : (subscription.customer as any)?.id;
      const userId = await getSupabaseUserId(customerId);
      if (!userId) {
        console.warn(`Nenhum user associado ao customer ${customerId}`);
        await markEventProcessed(event.id);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // Upsert subscription info
      const priceItem = subscription.items?.data?.[0]?.price;
      const productId = priceItem && typeof priceItem.product === 'string' ? priceItem.product : null;
      const priceId = priceItem?.id ?? null;

      const upsertObj: any = {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        stripe_price_id: priceId,
        stripe_product_id: productId,
        current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
        current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: !!subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabaseAdmin.from('user_plans').upsert(upsertObj, { onConflict: 'stripe_subscription_id' });
      if (upsertErr) {
        console.error('Erro ao atualizar assinatura no user_plans:', upsertErr.message);
      } else {
        console.log(`✅ Assinatura sincronizada: ${subscription.id}`);
      }

      await markEventProcessed(event.id);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    // -----------------------
    // invoice.payment_succeeded / failed
    // -----------------------
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`💳 invoice.payment_succeeded: ${invoice.id}`);
      // Você pode atualizar faturas, registrar cobranças, etc.
      await markEventProcessed(event.id);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`⚠️ invoice.payment_failed: ${invoice.id}`);
      // Marcar o usuário, enviar e-mail, etc.
      await markEventProcessed(event.id);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    // -----------------------
    // price/product changes (opcional)
    // -----------------------
    if (event.type.startsWith('price.') || event.type.startsWith('product.')) {
      console.log(`ℹ️ Evento de catálogo: ${event.type}`);
      await markEventProcessed(event.id);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    // -----------------------
    // default: evento não tratado
    // -----------------------
    console.log(`🤷 Evento ignorado: ${event.type}`);
    await markEventProcessed(event.id);
    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (err: any) {
    console.error('❌ Erro ao processar webhook:', err);
    // Não envie stack traces ao Stripe. Retorne 500 para tentar novamente (dependendo do erro).
    return new Response(JSON.stringify({ error: 'Internal webhook error' }), { status: 500 });
  }
}
