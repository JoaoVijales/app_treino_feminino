-- ===========================
-- USERS (USANDO FIREBASE AUTH)
-- Aqui guardamos apenas dados extras
-- id = firebase uid (string)
-- ===========================
create table if not exists users (
    id TEXT PRIMARY KEY,             
    email TEXT UNIQUE NOT NULL,      
    plan TEXT CHECK (plan IN ('free', 'premium')) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- USER PROFILES
-- ===========================
create table if not exists user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id text not null references users(id) on delete cascade,
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
)
-- ===========================
-- CYCLE PHASE RULES
-- ===========================
create table if not exists cycle_phase_rules (
    id uuid primary key default uuid_generate_v4(),
    phase text not null check (phase in ('menstrual', 'follicular', 'ovulatory', 'luteal')),
    duration_days_base integer not null,
    intensity_modifier text,
    notes text;
);

-- ===========================
-- MENSTRUAL CYCLES
-- ===========================
create table if not exists menstrual_cycles (
    id uuid primary key default uuid_generate_v4(),
    user_id text not null references users(id) on delete cascade,
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
    video_url text
    no_indicate text[],
);

-- ===========================
-- WORKOUT PRESETS (por fase)
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
-- (Inclui FEEDBACK)
-- ===========================
create table if not exists user_workout_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id text not null references users(id) on delete cascade,
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
-- (Inclui FEEDBACK)
-- =========================== 
create table if not exists user_workout_exercise_sessions (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references user_workout_sessions(id) on delete cascade,
    exercise_session_id uuid not null references workout_exercises(id),
    load_exercise_session numeric,
    created_at timestamp with time zone default now()
);

create table if not exists user_workout_exercise_sessions_sets (
    id uuid primary key default uuid_generate_v4(),
    exercise_session_id uuid not null references user_workout_exercise_sessions(id),
    load_set numeric,
    weight_done numeric,
    reps_done integer,
    ref_set integer not null references workout_exercises(order),
    created_at timestamp with time zone default now()
);
