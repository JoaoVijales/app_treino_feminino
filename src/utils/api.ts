import { supabase, withUserHeader } from './supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';
import {
    UserProfile,
    MenstrualCycle,
    CycleLog,
    Workout,
    WorkoutExercise,
    UserWorkoutSession,
    Exercise,
    UserWorkoutRecord,
    UserExerciseRecord,
    UserWorkoutExerciseSessions,
    UserWorkoutExerciseSets
} from '../types/supabase';
import { TodayWorkoutExercise } from '../types';

// ===========================
// USER PROFILES
// ===========================

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const client = withUserHeader(userId)
    const { data, error } = await client
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
    return data;
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<{ data: UserProfile | null, error: PostgrestError | null }> => {
    const result = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select()
        .single();

    if (result.error) {
        console.error('Error updating user profile:', result.error);
    }

    return result;
};


// ===========================
// MENSTRUAL CYCLES
// ===========================

export const getMenstrualCycles = async (userId: string): Promise<MenstrualCycle[] | null> => {
    const { data, error } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .eq('user_id', userId)
        .order('start_date_log', { ascending: false });

    if (error) {
        console.error('Error fetching menstrual cycles:', error);
        return null;
    }

    return data;
};

export const addMenstrualCycle = async (cycleData: Partial<MenstrualCycle>): Promise<MenstrualCycle | null> => {
    const { data, error } = await supabase
        .from('menstrual_cycles')
        .insert([cycleData])
        .select()
        .single();

    if (error) {
        console.error('Error adding menstrual cycle:', error);
        return null;
    }

    return data;
}

// ===========================
// CYCLE LOGS
// ===========================

export const getCycleLogs = async (cycleId: string): Promise<CycleLog[] | null> => {
    const { data, error } = await supabase
        .from('cycle_logs')
        .select('*')
        .eq('cycle_id', cycleId)
        .order('log_date', { ascending: false });

    if (error) {
        console.error('Error fetching cycle logs:', error);
        return null;
    }

    return data;
};

// ===========================
// WORKOUTS
// ===========================

export const getWorkouts = async (
    phase: string,
    equipment: string[],
    training_level: string
): Promise<Workout[] | null> => {
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('phase', phase)
        .in('equipment', equipment)
    //.eq('training_level', training_level);

    if (error) {
        console.error('Error fetching workouts:', error);
        return null;
    }

    return data;
};

export const getWorkoutDetails = async (workoutId: string): Promise<TodayWorkoutExercise[] | null> => {
    const WorkouExercises = await getWorkouExercises(workoutId)

    if (!WorkouExercises) return null;

    const results = await Promise.all(
        WorkouExercises.map(async (exc) => {
            if (exc.order == null) {
                throw new Error('exercicio sem ordem definida');
            }

            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .eq('id', exc.exercise_id)
                .single();

            if (error) {
                console.error('Error fetching workout details:', error);
                return null;
            }

            const exercise = data as Exercise | null;

            // Build a TodayWorkoutExercise entry; cast to TodayWorkoutExercise to satisfy the return type.
            // Adjust fields here if TodayWorkoutExercise has a different shape.
            const entry = {
                id: exc.id,
                order: exc.order,
                name: exercise?.name ?? null,
                series: exc.series,
                reps: exc.reps,
                video: exercise?.video_url
            } as unknown as TodayWorkoutExercise;

            return entry;
        })
    );

    const todayWorkoutExercise = results.filter(Boolean) as TodayWorkoutExercise[];

    return todayWorkoutExercise;
};

export const getWorkouExercises = async (workoutId: string): Promise<WorkoutExercise[] | null> => {
    const { data, error } = await supabase
        .from('workout_exercises')
        .select('*')
        .eq('workout_id', workoutId)
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching workout details:', error);
        return null;
    }

    return data;
};


export const getWorkoutById = async (workoutId: string): Promise<Workout | null> => {
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

    if (error) {
        console.error('Error fetching workout by id:', error);
        return null;
    }

    return data;
}

export const getWorkoutByPhase = async (phase: string, equipment: string): Promise<Workout[] | null> => {
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('phase', phase)
        .eq('equipment', equipment)

    if (error) {
        console.error('Error fetching workouts by phase:', error);
        return null;
    }

    return data;
};

// ===========================
// EXERCISES
// ===========================

export const getExercises = async (): Promise<Exercise[] | null> => {
    const { data, error } = await supabase.from('exercises').select('*');

    if (error) {
        console.error('Error fetching exercises:', error);
        return null;
    }

    return data;
};

export const getExerciseById = async (exerciseId: string): Promise<Exercise | null> => {
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', exerciseId)
        .single();

    if (error) {
        console.error('Error fetching exercise by id:', error);
        return null;
    }

    return data;
}



// ===========================
// USER WORKOUT SESSIONS
// ===========================

export const getUserWorkoutSessions = async (userId: string): Promise<UserWorkoutSession[] | null> => {
    const { data, error } = await supabase
        .from('user_workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false });

    if (error) {
        console.error('Error fetching user workout sessions:', error);
        return null;
    }

    return data;
};

export const getUserWorkoutSessionlasted = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('user_workout_sessions')
    .select('workout_id')
    .eq('user_id', userId)
    .order('session_date', { ascending: false });

  if (error) {
    console.error('Error fetching workout sessions:', error);
    return [];
  }

  if (!data || data.length === 0) return [];

  return data.map((session) => session.workout_id);
};



export const addUserWorkoutSession = async (sessionData: UserWorkoutSession): Promise<UserWorkoutSession | null> => {
    const { data, error } = await supabase
        .from('user_workout_sessions')
        .insert([sessionData])
        .select()
        .single();

    if (error) {
        console.error('Error adding user workout session:', error);
        return null;
    }

    return data;
};

export const addUserWorkoutExerciseSessions = async (exerciseSessionData: UserWorkoutExerciseSessions[]): Promise<UserWorkoutExerciseSessions | null> => {
    exerciseSessionData.forEach(async (exerciseSessionData) => {
        const { data, error } = await supabase
            .from('user_workout_exercise_sessions')
            .insert([exerciseSessionData])
            .select()
            .single();

        if (error) {
            console.error('Error adding user workout exercise session:', error);
            return null;
        }

        return data;
    });
    return null;
}

export const addUserWorkoutExerciseSets = async (exerciseSetData: UserWorkoutExerciseSets[]): Promise<UserWorkoutExerciseSets | null> => {
    exerciseSetData.forEach(async (exerciseSetData) => {
    const { data, error } = await supabase
        .from('user_workout_exercise_sets')
        .insert([exerciseSetData])
        .select()
        .single();

    if (error) {
        console.error('Error adding user workout exercise set:', error);
        return null;
    }

    return data;
});
return null;
}


export const getUserWorkoutExerciseSessions = async (sessionId: string): Promise<UserWorkoutExerciseSessions[] | null> => {
    const { data, error } = await supabase
        .from('user_workout_exercise_sessions')
        .select('*')
        .eq('session_id', sessionId);

    if (error) {
        console.error('Error fetching user workout exercise sessions:', error);
        return null;
    }

    return data;
}

export const getUserWorkoutExerciseSets = async (userWorkoutExerciseSessionId: string): Promise<UserWorkoutExerciseSets[] | null> => {
    const { data, error } = await supabase
        .from('user_workout_exercise_sets')
        .select('*')
        .eq('user_workout_exercise_session_id', userWorkoutExerciseSessionId);

    if (error) {
        console.error('Error fetching user workout exercise sets:', error);
        return null;
    }

    return data;
}

// ===========================
// USER RECORDS
// ===========================

export const getUserWorkoutRecords = async (userId: string): Promise<UserWorkoutRecord[] | null>  => {
    const { data, error } = await supabase
        .from('user_workout_records')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user workout records:', error);
        return null;
    }

    return data;
}

export const addUserWorkoutRecord = async (recordData: Partial<UserWorkoutRecord>): Promise<UserWorkoutRecord | null> => {
    const { data, error } = await supabase
        .from('user_workout_records')
        .insert([recordData])
        .select()
        .single();

    if (error) {
        console.error('Error adding user workout record:', error);
        return null;
    }

    return data;
}

export const updateUserWorkoutRecord = async (userId: string, workoutId: string, recordData: Partial<UserWorkoutRecord>): Promise<UserWorkoutRecord | null> => {
    const { data, error } = await supabase
        .from('user_workout_records')
        .update(recordData)
        .eq('user_id', userId)
        .eq('workout_id', workoutId)
        .select()
        .single();

    if (error) {
        console.error('Error updating user workout record:', error);
        return null;
    }

    return data;
}

// ===========================
// USER EXERCISE RECORDS
// ===========================

export const getUserExerciseRecords = async (userId: string): Promise<UserExerciseRecord[] | null> => {
    const { data, error } = await supabase
        .from('user_exercise_records')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user exercise records:', error);
        return null;
    }

    return data;
}

export const addUserExerciseRecord = async (recordData: Partial<UserExerciseRecord>): Promise<UserExerciseRecord | null> => {
    const { data, error } = await supabase
        .from('user_exercise_records')
        .insert([recordData])
        .select()
        .single();

    if (error) {
        console.error('Error adding user exercise record:', error);
        return null;
    }

    return data;
}

export const updateUserExerciseRecord = async (userId: string, exerciseId: string, recordData: Partial<UserExerciseRecord>): Promise<UserExerciseRecord | null> => {
    const { data, error } = await supabase
        .from('user_exercise_records')
        .update(recordData)
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId)
        .select()
        .single();

    if (error) {
        console.error('Error updating user exercise record:', error);
        return null;
    }

    return data;
}