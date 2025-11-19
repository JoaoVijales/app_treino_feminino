export interface UserProfile {
  id: string;
  user_id: string;
  age: number | null;
  name: string;
  goal: string | null;
  equipment: string | null;
  cycle_regular: string | null;
  last_period: string | null;
  flux_level: string | null;
  training_level: string | null;
  last_menstrual_cycle_date: string | null;
  body_weight: number | null;
  body_height: number | null;
  onboarding_completed: boolean;
  created_at: string;
}

export interface MenstrualCycle {
  id: string;
  user_id: string;
  start_date_log: string;
  end_date_log: string | null;
  cycle_length: number | null;
  created_at: string;
}

export interface CycleLog {
  id: string;
  cycle_id: string;
  log_date: string;
  symptoms: string[] | null;
  symptoms_severity: number | null;
  mood: string[] | null;
  energy_level: number | null;
  local_pain: string[] | null;
  local_pain_level: number | null;
  flux_level: string | null;
  notes: string | null;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  primary_muscle: string | null;
  equipment: string | null;
  level_difficulty: string | null;
  training_level: string | null;
  training_type: string | null;
  video_url: string | null;
  no_indicate: string[] | null;
    series: number | null;
    reps: number | null
}

export interface Workout {
  id: string;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  intensity: 'low' | 'moderate' | 'high';
  title: string;
  training_level: string | null;
  training_type: string | null;
  equipment: 'none' | 'elastic' | 'dumbbell';
  workout_description: string | null;
  time_predicted: number | null;
  created_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  reps: number | null;
  series: number | null;
  order: number | null;
  exercise: Exercise; // For joining data
}


export interface UserWorkoutSession {
  id: string;
  user_id: string;
  workout_id: string | null;
  session_date: string;
  duration: number | null;
  actual_phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | null;
  intensity_rating: number | null;
  feeling: 'energized' | 'tired' | 'strong' | 'pain' | 'cramps' | 'great' | null;
  notes: string | null;
  load_workout_total: number | null;
  created_at: string;
}

export interface UserWorkoutExerciseSessions {
  id: string;
  session_id: string;
  exercise_session_id: string;
  load_exercise_session: number | null;
  created_at: string;
}

export interface UserWorkoutExerciseSets {
  id: string;
  exercise_session_id: string;
  load_set: number | null;
  weight_done: number | null;
  reps_done: number | null;
  ref_set: number;
  created_at: string;
  
}

export interface FullWorkoutSession {
  workoutSession: UserWorkoutSession;
  exerciseSessions: {
    exercise: UserWorkoutExerciseSessions;
    sets?: UserWorkoutExerciseSets[];
  }[];
}

export interface UserWorkoutRecord {
  id?: string;
  user_id: string;
  workout_id: string;
  record_load: number | null;
  record_date: string;
  created_at: string;
}

export interface UserExerciseRecord {
  id?: string;
  user_id: string;
  workout_id: string;
  exercise_id: string;
  record_load: number | null;
  exercise_session_id : string;
  created_at: string;
}