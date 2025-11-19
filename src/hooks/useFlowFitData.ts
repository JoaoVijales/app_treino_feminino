import { useState, useEffect } from 'react';
import { UserData, TodayWorkout } from '../types';
import { UserProfile, Workout, UserWorkoutSession, MenstrualCycle } from '../types/supabase';
import { getUserProfile, getWorkouts, getUserWorkoutSessions, getWorkoutDetails, getMenstrualCycles, getWorkouExercises } from '../utils/api';
import { differenceInDays, getCyclePhase } from '../utils/cycle_phase';
import { selectWorkoutPlan } from '../utils/workout_select';

export const useFlowFitData = () => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    goal: '',
    equipment: '',
    cycleRegular: '',
    lastPeriod: '',
    currentPhase: 'menstrual',
    cycleDay: 5,
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayWorkoutState, setTodayWorkoutState] = useState<TodayWorkout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<UserWorkoutSession[]>([]);
  const [menstrualCycles, setMenstrualCycles] = useState<MenstrualCycle[]>([]);
  
const userId = 'test_user_001';

useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      const profile = await getUserProfile(userId);
      setUserProfile(profile);

      const history = await getUserWorkoutSessions(userId);
      if (history) setWorkoutHistory(history);

      const cycles = await getMenstrualCycles(userId);
      if (cycles) setMenstrualCycles(cycles);

      setLoading(false);
    };

    fetchInitialData();
  }, []);

  // -----------------------------------------------------
  // 2️⃣ Segundo efeito: roda SOMENTE depois que userProfile existir
  // -----------------------------------------------------
  useEffect(() => {
    const processUserProfile = async () => {
      if (!userProfile) return;  // evita execução precoce
      if (!userProfile.last_period) return;

      // 2.1 Calcular ciclo
      const cycleDay = differenceInDays(
        new Date(),
        new Date(userProfile.last_period)
      );

      const phase = getCyclePhase(new Date(userProfile.last_period), 28);

      // 2.2 Atualizar userData
      setUserData({
        name: userProfile.name,
        goal: userProfile.goal || '',
        equipment: userProfile.equipment || 'none',
        cycleRegular: userProfile.cycle_regular || '',
        lastPeriod: userProfile.last_period,
        currentPhase: phase,
        cycleDay: cycleDay,
      });

      // -----------------------------------------------------
      // 2.3 Buscar workout SOMENTE agora
      // -----------------------------------------------------
      const primaryEquipment =
        Array.isArray(userProfile.equipment)
          ? userProfile.equipment[0] || 'none'
          : userProfile.equipment || 'none';

      const Workout = await selectWorkoutPlan(
        phase || '',
        userId,
        primaryEquipment
      );

      if (!Workout) {
        setTodayWorkoutState(null);
        return;
      }

      // 2.4 Detalhes dos exercícios
      const workouExercises = await getWorkoutDetails(Workout.id);

      if (workouExercises) {
        setTodayWorkoutState({
          id: Workout.id,
          title: Workout.title,
          duration: `${Workout.time_predicted} min`,
          intensity: Workout.intensity,
          reason: Workout.workout_description || '',
          exercises: workouExercises.map((wd) => ({
            id: wd.id,
            name: wd.name,
            series: wd.series,
            reps: wd.reps,
            video: wd.video || '🎥',
            order: wd.order,
          })),
        });
      }
    };

    processUserProfile();
  }, [userProfile]); // 🔥 dispara apenas quando userProfile vem do supabase

  useEffect(() => {
      console.log('todayWorkoutState updated:', todayWorkoutState);
    }, [todayWorkoutState]);

  return { userData, todayWorkoutState, loading, userProfile, workoutHistory, menstrualCycles, setUserData };
};
