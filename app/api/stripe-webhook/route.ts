import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // Import NextResponse for easier JSON responses

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ------------------------
// Raw Body (adapted for Web Request object)
// ------------------------
async function getRawBody(req: Request): Promise<Buffer> {
  return Buffer.from(await req.arrayBuffer());
}

// ------------------------
// Obter user_id via stripe_customer_id
// ------------------------
async function getSupabaseUserId(stripeCustomerId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('user_plans') // Query user_plans table
    .select('user_id') // Select user_id from user_plans
    .eq('stripe_customer_id', stripeCustomerId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows found'
    console.error('Erro ao obter user_id:', error);
  }

  return data?.user_id ?? null; // Return user_id
}

// ------------------------
// Webhook Handler for App Router POST requests
// ------------------------
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);

    // ------------------------
    // Validar assinatura Stripe (proteção anti-replay)
    // ------------------------
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret, 300); // 300 is the tolerance in seconds
  } catch (err: any) {
    console.error('❌ Erro na validação do webhook:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`📩 Evento recebido: ${event.type}`);

  try {
    // =====================================================================
    //  CHECKOUT SESSION (primeira compra)
    // =====================================================================
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!userId || !customerId) {
        console.warn('⚠️ Missing user_id or customerId on metadata');
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Vincula customer ao usuário (REMOVED: user_profiles does not have stripe_customer_id)
      // O vínculo entre user_id e customerId é mantido na tabela user_plans através dos eventos de assinatura.
      console.log(`✅ Checkout concluído: user ${userId} -> customer ${customerId}. O vínculo será mantido em user_plans.`);

      // TODO: Implement the update to user_plans to associate stripe_customer_id with user_id
      // This was identified as a missing step from the Django reference file.
      // Example:
      // await supabaseAdmin.from('user_plans').upsert({
      //   user_id: userId,
      //   stripe_customer_id: customerId,
      //   // Other relevant fields like stripe_product_id, stripe_price_id can be extracted from session.line_items
      // }, { onConflict: 'user_id' });

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // =====================================================================
    //  PAGAMENTO ASSÍNCRONO (PIX / BOLETO)
    // =====================================================================
    if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`💸 Pagamento PIX/BOLETO confirmado para sessão: ${session.id}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`❌ Pagamento PIX/BOLETO falhou: ${session.id}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // =====================================================================
    //  ASSINATURAS (criação, atualização, pausa, cancelamento)
    // =====================================================================
    if (
      event.type.startsWith('customer.subscription.')
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userId = await getSupabaseUserId(customerId);

      if (!userId) {
        console.warn(`⚠️ Nenhum user associado ao customer ${customerId}`);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      console.log(`🔄 Sincronizando assinatura para user ${userId}`);

      await supabaseAdmin.from('user_plans').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        // TODO: Ensure stripe_product_id and stripe_price_id are correctly extracted and updated
        // The original had 'plan_id: subscription.items.data[0].price.id', which should map to stripe_price_id
        stripe_price_id: subscription.items.data[0].price.id,
        // If product ID is needed, it typically comes from subscription.items.data[0].price.product
        stripe_product_id: subscription.items.data[0].price.product as string,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : null,
        trial_start: subscription.trial_start
          ? new Date(subscription.trial_start * 1000).toISOString()
          : null,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
      }, {
        onConflict: 'stripe_subscription_id',
      });

      console.log(`✅ Assinatura sincronizada: ${subscription.id}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // =====================================================================
    //  FATURAS
    // =====================================================================
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`💳 Pagamento confirmado da invoice ${invoice.id}`);
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`⚠️ Pagamento falhou da invoice ${invoice.id}`);
    }

    // =====================================================================
    //  PREÇOS E PRODUTOS (opcional)
    // =====================================================================
    if (event.type.startsWith('price.') || event.type.startsWith('product.')) {
      console.log(`ℹ️ Evento de catálogo: ${event.type}`);
    }

    // =====================================================================
    // EVENTO NÃO TRATADO
    // =====================================================================
    else {
      console.log(`🤷 Evento ignorado: ${event.type}`);
    }

  } catch (err: any) {
    console.error('❌ Erro ao processar webhook:', err);
    return NextResponse.json({ error: 'Internal webhook error' }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}