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
  const { stripeCustomerId } = await req.json(); // Read JSON body from Request object

  if (!stripeCustomerId) {
    return NextResponse.json({ error: 'Missing Stripe customer ID' }, { status: 400 });
  }

  // 2. Authorize: Ensure the requested stripeCustomerId belongs to the authenticated user
  // Fetch stripe_customer_ids associated with the authenticated user from user_plans
  const { data: userPlans, error: userPlansError } = await supabaseAdmin
    .from('user_plans')
    .select('stripe_customer_id')
    .eq('user_id', authenticatedUserId);

  if (userPlansError) {
    console.error('Authorization error: Error fetching user plans:', userPlansError.message);
    return NextResponse.json({ error: 'Could not fetch user plan data' }, { status: 500 });
  }

  const authorizedStripeCustomerIds = userPlans.map(plan => plan.stripe_customer_id);

  if (!authorizedStripeCustomerIds.includes(stripeCustomerId)) {
    console.error(`Authorization error: Requested stripeCustomerId ${stripeCustomerId} not found for user ${authenticatedUserId}.`);
    return NextResponse.json({ error: 'Unauthorized access to customer ID' }, { status: 403 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.BASE_URL}/settings`, // User returns to settings page after portal
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// NOTE: BASE_URL needs to be defined in your .env.local and Vercel environment variables.
// This should be the base URL of your deployed application (e.g., https://your-app.vercel.app)
// For local development, it might be http://localhost:3000
