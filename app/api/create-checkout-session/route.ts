import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client with service role key for RLS bypass
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // 1. Authenticate the user
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization header missing or malformed' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

  if (userError || !userData?.user) {
    console.error('Authentication error:', userError?.message);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }

  const authenticatedUserId = userData.user.id;
  const { userId, priceId } = await req.json(); // Read JSON body from Request object

  if (!userId || !priceId) {
    return NextResponse.json({ error: 'Missing userId or priceId' }, { status: 400 });
  }

  // 2. Authorize: Ensure the requested userId belongs to the authenticated user
  if (authenticatedUserId !== userId) {
    return NextResponse.json({ error: 'Unauthorized: userId mismatch' }, { status: 403 });
  }

  try {
    // Fetch email from authenticated user data
    const customerEmail = userData.user.email;

    // Fetch existing stripe_customer_id from user_plans table
    const { data: userPlanData, error: userPlanError } = await supabaseAdmin
      .from('user_plans')
      .select('stripe_customer_id')
      .eq('user_id', authenticatedUserId)
      .limit(1)
      .single();

    if (userPlanError && userPlanError.code !== 'PGRST116') {
        console.error('Error fetching existing user plan for Stripe customer ID:', userPlanError?.message);
        return NextResponse.json({ error: 'Could not fetch user plan data' }, { status: 500 });
    }

    const existingStripeCustomerId = userPlanData?.stripe_customer_id;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
      },
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    };

    // Pre-fill customer email if available from auth
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    // Link to existing Stripe customer if available from user_plans
    if (existingStripeCustomerId) {
      sessionConfig.customer = existingStripeCustomerId;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
