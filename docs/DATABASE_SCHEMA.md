# Database Schema

The FlowFit application utilizes a PostgreSQL database managed by Supabase. The schema is designed to support user profiles, subscription management, menstrual cycle tracking, exercise catalog, workout plans, and detailed workout session logging.

## Core Tables

### `user_profiles`

Stores core profile information for each user.
| Column                      | Type                        | Description                                                         |
| :-------------------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`                        | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the user profile.                           |
| `user_id`                   | `uuid` (FK to `auth.users`) | Foreign key linking to the Supabase `auth.users` table.             |
| `age`                       | `integer`                   | User's age.                                                         |
| `name`                      | `TEXT`                      | User's full name.                                                   |
| `goal`                      | `TEXT`                      | User's fitness goal.                                                |
| `equipment`                 | `TEXT[]`                    | Array of equipment the user has available.                          |
| `cycle_regular`             | `TEXT`                      | Indicates if the user's menstrual cycle is regular.                 |
| `last_period`               | `DATE`                      | Date of the user's last menstrual period.                           |
| `flux_level`                | `TEXT`                      | User's perceived menstrual flux level.                              |
| `training_level`            | `TEXT`                      | User's current training level (e.g., beginner, intermediate, advanced). |
| `last_menstrual_cycle_date` | `DATE`                      | The date of the last recorded menstrual cycle.                      |
| `body_weight`               | `NUMERIC`                   | User's body weight.                                                 |
| `body_height`               | `NUMERIC`                   | User's body height.                                                 |
| `onboarding_completed`      | `BOOLEAN` (default `FALSE`) | Flag indicating if the user has completed the onboarding process.   |
| `created_at`                | `timestamp with time zone` (default `now()`) | Timestamp when the profile was created.                             |

### `user_plans`

Manages user subscription information and status with Stripe integration.
| Column                   | Type                                      | Description                                                         |
| :----------------------- | :---------------------------------------- | :------------------------------------------------------------------ |
| `id`                     | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the user's plan record.                       |
| `user_id`                | `uuid` (FK to `auth.users`)             | Foreign key linking to the Supabase `auth.users` table.             |
| `stripe_customer_id`     | `TEXT` (Unique)                           | The unique identifier for the customer in Stripe.                   |
| `stripe_subscription_id` | `TEXT` (Unique)                           | The unique identifier for the subscription in Stripe.               |
| `stripe_product_id`      | `TEXT`                                    | The Stripe Product ID associated with the subscription.             |
| `stripe_price_id`        | `TEXT`                                    | The Stripe Price ID for the subscribed plan.                        |
| `status`                 | `TEXT` (Enum)                             | Current status of the subscription (`active`, `trialing`, `past_due`, `unpaid`, `canceled`, `incomplete`, `inactive`). |
| `current_period_start`   | `timestamp with time zone`              | Start of the current billing period.                                |
| `current_period_end`     | `timestamp with time zone`              | End of the current billing period.                                  |
| `trial_start`            | `timestamp with time zone`              | Start date of the trial period.                                     |
| `trial_end`              | `timestamp with time zone`              | End date of the trial period.                                       |
| `cancel_at_period_end`   | `BOOLEAN` (default `FALSE`)             | True if the subscription is set to cancel at the end of the current period. |
| `canceled_at`            | `timestamp with time zone`              | Timestamp when the subscription was canceled.                       |
| `ended_at`               | `timestamp with time zone`              | Timestamp when the subscription finally ended.                      |
| `last_payment_date`      | `timestamp with time zone`              | Date of the last successful payment.                                |
| `created_at`             | `timestamp with time zone` (default `now()`) | Timestamp when the plan record was created.                         |
| `updated_at`             | `timestamp with time zone` (default `now()`) | Timestamp of the last update to the plan record.                    |

### `stripe_events`

Records processed Stripe webhook event IDs to ensure idempotency.
| Column       | Type                       | Description                                                         |
| :----------- | :------------------------- | :------------------------------------------------------------------ |
| `event_id`   | `TEXT` (PK)                | Unique identifier for the Stripe event.                             |
| `processed_at` | `timestamptz` (default `now()`) | Timestamp when the event was processed by the webhook.              |

### `stripe_unmatched_sessions`

Logs Stripe checkout sessions that could not be matched to a `user_id` for manual review.
| Column               | Type                        | Description                                                         |
| :------------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`                 | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the unmatched session record.                 |
| `session_id`         | `TEXT`                      | The Stripe Checkout Session ID.                                     |
| `stripe_customer_id` | `TEXT`                      | The Stripe Customer ID associated with the session.                 |
| `metadata`           | `JSONB` (default `{}::jsonb`) | Metadata from the Stripe session.                                   |
| `received_at`        | `timestamp with time zone` (default `now()`) | Timestamp when the unmatched session event was received.            |

### `cycle_phase_rules`

Defines the characteristics and rules for each phase of the menstrual cycle.
| Column             | Type                        | Description                                                         |
| :----------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`               | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the cycle phase rule.                         |
| `phase`            | `TEXT` (Enum)               | Name of the cycle phase (`menstrual`, `follicular`, `ovulatory`, `luteal`). |
| `duration_days_base` | `integer`                   | Base duration in days for this phase.                               |
| `intensity_modifier` | `TEXT`                      | Modifier for workout intensity during this phase.                   |
| `notes`            | `TEXT`                      | General notes about the phase.                                      |

### `menstrual_cycles`

Stores records of users' menstrual cycles.
| Column           | Type                        | Description                                                         |
| :--------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`             | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the menstrual cycle record.                   |
| `user_id`        | `uuid` (FK to `auth.users`) | Foreign key linking to the Supabase `auth.users` table.             |
| `start_date_log` | `DATE`                      | The recorded start date of the menstrual cycle.                     |
| `end_date_log`   | `DATE`                      | The recorded end date of the menstrual cycle.                       |
| `cycle_length`   | `integer`                   | The calculated length of the cycle in days.                         |
| `created_at`     | `timestamp with time zone` (default `now()`) | Timestamp when the cycle record was created.                        |

### `cycle_logs`

Detailed daily logs within a specific menstrual cycle.
| Column              | Type                        | Description                                                         |
| :------------------ | :-------------------------- | :------------------------------------------------------------------ |
| `id`                | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the cycle log entry.                          |
| `cycle_id`          | `uuid` (FK to `menstrual_cycles`) | Foreign key linking to the `menstrual_cycles` table.                |
| `log_date`          | `DATE`                      | The date for which this log entry is recorded.                      |
| `symptoms`          | `TEXT[]`                    | Array of symptoms experienced on this date.                         |
| `symptoms_severity` | `integer` (1-10)            | Severity of symptoms.                                               |
| `mood`              | `TEXT[]`                    | Array of mood states experienced.                                   |
| `energy_level`      | `integer` (1-10)            | User's energy level.                                                |
| `local_pain`        | `TEXT[]`                    | Array of local pain areas.                                          |
| `local_pain_level`  | `integer` (1-10)            | Severity of local pain.                                             |
| `flux_level`        | `TEXT`                      | Perceived menstrual flux level for the day.                         |
| `notes`             | `TEXT`                      | Any additional notes for the day.                                   |
| `created_at`        | `timestamp with time zone` (default `now()`) | Timestamp when the log entry was created.                           |

### `exercises`

A catalog of available exercises with their properties.
| Column           | Type                        | Description                                                         |
| :--------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`             | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the exercise.                                 |
| `name`           | `TEXT`                      | Name of the exercise.                                               |
| `primary_muscle` | `TEXT`                      | The primary muscle group targeted.                                  |
| `equipment`      | `TEXT`                      | Required equipment for the exercise.                                |
| `level_difficulty` | `TEXT`                      | Perceived difficulty level of the exercise.                         |
| `training_level` | `TEXT`                      | Suitable training level for the exercise.                           |
| `training_type`  | `TEXT`                      | Type of training (e.g., strength, cardio).                        |
| `video_url`      | `TEXT`                      | URL to an instructional video for the exercise.                     |
| `no_indicate`    | `TEXT[]`                    | Array of conditions or reasons why the exercise might not be indicated. |

### `workouts`

Pre-defined workout plans or templates.
| Column              | Type                        | Description                                                         |
| :------------------ | :-------------------------- | :------------------------------------------------------------------ |
| `id`                | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the workout plan.                             |
| `phase`             | `TEXT` (Enum)               | Menstrual cycle phase for which the workout is designed (`menstrual`, `follicular`, `ovulatory`, `luteal`). |
| `intensity`         | `TEXT` (Enum)               | Intensity level of the workout (`low`, `moderate`, `high`).         |
| `title`             | `TEXT`                      | Title of the workout.                                               |
| `training_level`    | `TEXT`                      | Recommended training level for this workout.                        |
| `training_type`     | `TEXT`                      | Type of training for this workout.                                  |
| `equipment`         | `TEXT` (Enum)               | Required equipment for the workout (`none`, `elastic`, `dumbbell`). |
| `workout_description` | `TEXT`                      | Detailed description of the workout.                                |
| `time_predicted`    | `integer`                   | Predicted duration of the workout in minutes.                       |
| `created_at`        | `timestamp with time zone` (default `now()`) | Timestamp when the workout plan was created.                        |

### `workout_exercises`

Links exercises to specific workout plans, including parameters like reps and series.
| Column       | Type                        | Description                                                         |
| :----------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`         | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the workout-exercise link.                    |
| `workout_id` | `uuid` (FK to `workouts`)   | Foreign key linking to the `workouts` table.                        |
| `exercise_id` | `uuid` (FK to `exercises`) | Foreign key linking to the `exercises` table.                       |
| `reps`       | `integer`                   | Number of repetitions for the exercise in this workout.             |
| `series`     | `integer`                   | Number of sets (series) for the exercise in this workout.           |
| `order`      | `integer`                   | The order in which the exercise appears in the workout.             |

### `user_workout_sessions`

Records instances of users completing a workout.
| Column             | Type                        | Description                                                         |
| :----------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`               | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the workout session.                          |
| `user_id`          | `uuid` (FK to `auth.users`) | Foreign key linking to the Supabase `auth.users` table.             |
| `workout_id`       | `uuid` (FK to `workouts`, ON DELETE SET NULL) | Foreign key linking to the `workouts` table (can be null if workout is deleted). |
| `session_date`     | `DATE` (default `current_date`) | The date the workout session occurred.                              |
| `duration`         | `NUMERIC`                   | Actual duration of the workout session.                             |
| `actual_phase`     | `TEXT` (Enum)               | The actual menstrual cycle phase during the workout session.        |
| `intensity_rating` | `integer` (1-10)            | User's rating of the workout intensity.                             |
| `feeling`          | `TEXT` (Enum)               | User's feeling after the workout (`energized`, `tired`, `strong`, `pain`, `cramps`, `great`). |
| `notes`            | `TEXT`                      | Any notes the user added about the session.                         |
| `load_workout_total` | `NUMERIC`                   | Total load (e.g., volume) calculated for the workout session.       |
| `created_at`       | `timestamp with time zone` (default `now()`) | Timestamp when the workout session record was created.              |

### `user_workout_exercise_sessions`

Records the details of each exercise performed within a user's specific workout session.
| Column                | Type                        | Description                                                         |
| :-------------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`                  | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the exercise session within a workout.        |
| `user_id`             | `uuid` (FK to `auth.users`) | Foreign key linking to the Supabase `auth.users` table.             |
| `session_id`          | `uuid` (FK to `user_workout_sessions`) | Foreign key linking to the parent `user_workout_sessions` table.    |
| `exercise_session_id` | `uuid` (FK to `workout_exercises`) | Foreign key linking to the specific exercise definition in a workout. |
| `load_exercise_session` | `NUMERIC`                   | Total load (e.g., volume) calculated for this exercise session.     |
| `created_at`          | `timestamp with time zone` (default `now()`) | Timestamp when the exercise session record was created.             |

### `user_workout_exercise_sessions_sets`

Records the details of individual sets performed within an exercise session.
| Column                | Type                        | Description                                                         |
| :-------------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`                  | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the individual set record.                    |
| `user_id`             | `uuid` (FK to `auth.users`) | Foreign key linking to the Supabase `auth.users` table.             |
| `exercise_session_id` | `uuid` (FK to `user_workout_exercise_sessions`) | Foreign key linking to the parent `user_workout_exercise_sessions` table. |
| `load_set`            | `NUMERIC`                   | Load (e.g., weight * reps) for this specific set.                   |
| `weight_done`         | `NUMERIC`                   | Weight used for this set.                                           |
| `reps_done`           | `integer`                   | Repetitions completed in this set.                                  |
| `ref_set`             | `integer`                   | Reference number for the set (e.g., 1st set, 2nd set).              |
| `created_at`          | `timestamp with time zone` (default `now()`) | Timestamp when the set record was created.                          |

### `user_workout_records`

Stores personal bests or significant performance records for entire workouts.
| Column        | Type                        | Description                                                         |
| :------------ | :-------------------------- | :------------------------------------------------------------------ |
| `id`          | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the workout record.                           |
| `user_id`     | `uuid` (FK to `auth.users`) | Foreign key linking to the Supabase `auth.users` table.             |
| `workout_id`  | `uuid` (FK to `workouts`)   | Foreign key linking to the `workouts` table.                        |
| `record_load` | `NUMERIC`                   | The recorded performance metric (e.g., max volume, max weight).     |
| `record_date` | `DATE` (default `current_date`) | The date when this record was achieved.                             |
| `created_at`  | `timestamp with time zone` (default `now()`) | Timestamp when the record was created.                              |

### `user_exercise_records`

Stores personal bests or significant performance records for individual exercises.
| Column                | Type                        | Description                                                         |
| :-------------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`                  | `uuid` (PK, default `uuid_generate_v4()`) | Unique identifier for the exercise record.                          |
| `user_id`             | `uuid` (FK to `auth.users`) | Foreign key linking to the Supabase `auth.users` table.             |
| `workout_id`          | `uuid` (FK to `workouts`)   | Foreign key linking to the `workouts` table.                        |
| `exercise_id`         | `uuid` (FK to `exercises`) | Foreign key linking to the `exercises` table.                       |
| `exercise_session_id` | `uuid` (FK to `workout_exercises`) | Foreign key linking to the specific exercise definition in a workout. |
| `record_load`         | `NUMERIC`                   | The recorded performance metric for the exercise.                   |
| `record_date`         | `DATE` (default `current_date`) | The date when this record was achieved.                             |
| `created_at`          | `timestamp with time zone` (default `now()`) | Timestamp when the record was created.                              |

---

## Row Level Security (RLS) Policies

Row Level Security is enabled for most user-facing tables to ensure that users can only access and modify their own data. Policies are defined in `reference_files/policy.sql`.

*   **User-Specific Data (`user_profiles`, `menstrual_cycles`, `cycle_logs`, `user_workout_sessions`, `user_workout_exercise_sessions`, `user_workout_exercise_sessions_sets`, `user_workout_records`, `user_exercise_records`, `user_plans`)**:
    *   Users can `SELECT`, `INSERT`, `UPDATE` (and for some, `DELETE`) their own records where `user_id = auth.uid()`.
    *   Access to `cycle_logs` and workout session-related tables is further restricted to records belonging to the user's cycles or sessions.
    *   `user_plans` records are `INSERT`/`UPDATE`/`DELETE` controlled by the `service_role` (e.g., Stripe webhooks) but `SELECT`able by the authenticated user.

*   **Public/Shared Catalogs (`exercises`, `workouts`, `workout_exercises`, `cycle_phase_rules`)**:
    *   `SELECT` access is granted to all authenticated users (`true`), as these tables contain general information like exercise definitions, workout templates, and cycle phase rules.

*   **Internal System Tables (`stripe_events`, `stripe_unmatched_sessions`)**:
    *   Access to these tables is generally restricted or limited to `service_role` to maintain data integrity and for internal webhook processing. `stripe_events` prevents all public `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

---

## Database Triggers

Triggers are used to automate certain database operations, ensuring data consistency and simplifying application logic.

### `on_auth_user_created`

*   **Purpose:** Automatically creates a corresponding entry in the `public.user_profiles` table whenever a new user registers through Supabase authentication (`auth.users`).
*   **Definition:**
    ```sql
    create or replace function public.handle_new_auth_user()
    returns trigger as $$
    begin
      insert into public.user_profiles (user_id, name)
      values (new.id, ''); -- Initializes with user_id and an empty name.
      return new;
    end;
    $$ language plpgsql security definer;

    create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_auth_user();
    ```
*   **Impact:** Ensures that every authenticated user has an associated profile in the `user_profiles` table, which can then be populated with additional details during onboarding.