import * as api from './api';
import { Workout } from '../types/supabase';


export async function selectWorkoutPlan(phase: string, userId: string, equipment:string): Promise<Workout | null> {
    try {
        const workouts_phase = await api.getWorkoutByPhase(phase, equipment );
        const workout_lasted_id = await api.getUserWorkoutSessionlasted(userId);
        if (!workouts_phase) return null;
        for (const workout of workouts_phase) {
            if (!workout_lasted_id.includes(workout.id)) {
                //console.log(workout)
                return workout;
            }
        }
        return workouts_phase[0];
    } catch (error) {
        console.error("Error selecting workout plan:", error);
        return null;
    }
}