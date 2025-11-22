create table if not exists user_plans (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    stripe_customer_id text unique not null,
    stripe_subscription_id text unique,
    stripe_product_id text,
    stripe_price_id text,
    status text not null default 'inactive' check (status in ('active', 'trialing', 'past_due', 'unpaid', 'canceled', 'incomplete', 'inactive')),
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    trial_start timestamp with time zone,
    trial_end timestamp with time zone,
    cancel_at_period_end boolean default false,
    canceled_at timestamp with time zone,
    ended_at timestamp with time zone,
    last_payment_date timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table user_plans enable row level security;

create policy "Users can view their own plan."
  on user_plans for select
  using (auth.uid() = user_id);