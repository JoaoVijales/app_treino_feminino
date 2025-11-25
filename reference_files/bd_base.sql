-- ===========================
-- USER PROFILES
-- ===========================
create table if not exists user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    age integer,
    name TEXT NOT NULL,
    goal TEXT,
    equipment TEXT[] DEFAULT ARRAY[]::TEXT[],
    cycle_regular TEXT,
    last_period DATE,
    flux_level TEXT,
    training_level TEXT,
    last_menstrual_cycle_date DATE,
    body_weight NUMERIC,
    body_height NUMERIC,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at timestamp with time zone default now()
);

create table if not exists user_plans (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
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

create table if not exists stripe_events (
  event_id text primary key,
  processed_at timestamptz default now()
);

create table if not exists stripe_unmatched_sessions (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null,
  stripe_customer_id text not null,
  metadata jsonb default '{}'::jsonb,
  received_at timestamp with time zone default now()
);


-- ===========================
-- CYCLE PHASE RULES
-- ===========================
create table if not exists cycle_phase_rules (
    id uuid primary key default uuid_generate_v4(),
    phase text not null check (phase in ('menstrual', 'follicular', 'ovulatory', 'luteal')),
    duration_days_base integer not null,
    intensity_modifier text,
    notes text
);

-- ===========================
-- MENSTRUAL CYCLES
-- ===========================
create table if not exists menstrual_cycles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    start_date_log date not null,
    end_date_log date,
    cycle_length integer,
    created_at timestamp with time zone default now()
);

-- ===========================
-- MENSTRUAL CYCLES LOGS
-- ===========================
create table if not exists cycle_logs (
    id uuid primary key default uuid_generate_v4(),
    cycle_id uuid not null references menstrual_cycles(id) on delete cascade,
    log_date date not null,
    symptoms text[],
    symptoms_severity integer check (symptoms_severity between 1 and 10),
    mood text[],
    energy_level integer check (energy_level between 1 and 10),
    local_pain text[],
    local_pain_level integer check (local_pain_level between 1 and 10),
    flux_level text,
    notes text,
    created_at timestamp with time zone default now()
);

-- ===========================
-- EXERCISES CATALOG
-- ===========================
create table if not exists exercises (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    primary_muscle text,
    equipment text,
    level_difficulty text,
    training_level text,
    training_type text,
    video_url text,
    no_indicate text[]
);

-- ===========================
-- WORKOUT PRESETS
-- ===========================
create table if not exists workouts (
    id uuid primary key default uuid_generate_v4(),
    phase text not null check (phase in ('menstrual', 'follicular', 'ovulatory', 'luteal')),
    intensity text check (intensity in ('low', 'moderate', 'high')),
    title text not null,
    training_level text,
    training_type text,
    equipment text not null check (equipment in ('none', 'elastic', 'dumbbell')),
    workout_description text,
    time_predicted integer,
    created_at timestamp with time zone default now()
);

-- ===========================
-- WORKOUT EXERCISES LINK
-- ===========================
create table if not exists workout_exercises (
    id uuid primary key default uuid_generate_v4(),
    workout_id uuid not null references workouts(id) on delete cascade,
    exercise_id uuid not null references exercises(id) on delete cascade,
    reps integer,
    series integer,
    "order" integer
);

-- ===========================
-- USER WORKOUT SESSIONS
-- ===========================
create table if not exists user_workout_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    workout_id uuid references workouts(id) on delete set null,
    session_date date default current_date,
    duration numeric,
    actual_phase text check (actual_phase in ('menstrual', 'follicular', 'ovulatory', 'luteal')),
    intensity_rating integer check (intensity_rating between 1 and 10),
    feeling text check (feeling in ('energized', 'tired', 'strong', 'pain', 'cramps', 'great')),
    notes text,
    load_workout_total numeric,
    created_at timestamp with time zone default now()
);

-- ===========================
-- USER Exercise SESSIONS
-- ===========================
create table if not exists user_workout_exercise_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    session_id uuid not null references user_workout_sessions(id) on delete cascade,
    exercise_session_id uuid not null references workout_exercises(id),
    load_exercise_session numeric,
    created_at timestamp with time zone default now()
);

-- ===========================
-- SETS
-- ===========================
create table if not exists user_workout_exercise_sessions_sets (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    exercise_session_id uuid not null references user_workout_exercise_sessions(id),
    load_set numeric,
    weight_done numeric,
    reps_done integer,
    ref_set integer,
    created_at timestamp with time zone default now()
);

-- ===========================
-- RECORDS
-- ===========================
create table if not exists user_workout_records (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    workout_id uuid not null references workouts(id),
    record_load numeric,
    record_date date default current_date,
    created_at timestamp with time zone default now()
);

create table if not exists user_exercise_records (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    workout_id uuid not null references workouts(id),
    exercise_id uuid not null references exercises(id),
    exercise_session_id uuid not null references workout_exercises(id),
    record_load numeric,
    record_date date default current_date,
    created_at timestamp with time zone default now()
);
