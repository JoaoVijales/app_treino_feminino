import * as api from './api';
import { Workout } from '../types/supabase';

export async function selectWorkoutPlan(
  phase: string,
  userId: string,
  equipment: string
): Promise<Workout | null> {
  try {
    const workoutsPhase = await api.getWorkoutByPhase(phase, equipment || 'none');
    console.log("Workouts encontrados para", phase, equipment, ":", workoutsPhase); 

    if (!workoutsPhase || workoutsPhase.length === 0) {
      console.warn("Nenhum treino encontrado para:", phase, equipment);
      return null;
    }

    const lastWorkoutIds = await api.getUserWorkoutSessionlasted();

    // 1º treino que ainda não foi feito
    for (const workout of workoutsPhase) {
      if (!lastWorkoutIds.includes(workout.id)) {
        return workout;
      }
    }

    // fallback: retorna o primeiro da fase
    return workoutsPhase[0];

  } catch (error) {
    console.error("Erro ao selecionar plano de treino:", error);
    return null;
  }
}
