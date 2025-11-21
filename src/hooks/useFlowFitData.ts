import { useState, useEffect } from 'react';
import { UserData, TodayWorkout } from '../types';
import { UserProfile, Workout, UserWorkoutSession, MenstrualCycle } from '../types/supabase';
import { getUserProfile, getWorkouts, getUserWorkoutSessions, getWorkoutDetails, getMenstrualCycles, getWorkouExercises, addMenstrualCycle, updateUserProfile } from '../utils/api';
import { differenceInDays, getCyclePhase } from '../utils/cycle_phase';
import { selectWorkoutPlan } from '../utils/workout_select';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

export const useFlowFitData = () => {
  const [session, setSession] = useState<Session | null>(null);
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
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])
  
  const refetchFlowFitData = async () => {
    if (!session) return; // Only fetch data if a session exists
    setLoading(true);

    const profile = await getUserProfile(session);
    setUserProfile(profile);

    const history = await getUserWorkoutSessions();
    if (history) setWorkoutHistory(history);

    const cycles = await getMenstrualCycles();
    if (cycles) setMenstrualCycles(cycles);

    setLoading(false);
  };
  
  // Fetch data when session changes
  useEffect(() => {
    if (session) {
      refetchFlowFitData();
    }
  }, [session]);

  // -----------------------------------------------------
  // 2️⃣ Segundo efeito: roda SOMENTE depois que userProfile existir
  // -----------------------------------------------------
  useEffect(() => {
    const processUserProfile = async () => {
      if (!userProfile || !session || !menstrualCycles) return; // Guard clause
      if (!userProfile.last_period) return;

      let currentCycles = [...menstrualCycles];

      // 1. Handle cycle creation for new users
      if (currentCycles.length === 0) {
        const cycleDay = differenceInDays(new Date(), new Date(userProfile.last_period));
        if (cycleDay > 0) {
          const newCycle: Omit<MenstrualCycle, 'id' | 'created_at'> = {
            user_id: session.user.id,
            start_date_log: userProfile.last_period,
            end_date_log: null,
            cycle_length: null,
          };
          const createdCycle = await addMenstrualCycle(newCycle);
          if (createdCycle) {
            currentCycles = [createdCycle, ...currentCycles];
          }
        }
      }

      if (currentCycles.length === 0) {
        setTodayWorkoutState(null);
        return;
      }
      
      // 2. Calculate phase and day from the latest cycle
      const lastCycle = currentCycles[0];
      const cycleDay = differenceInDays(new Date(), new Date(lastCycle.start_date_log));
      const phase = getCyclePhase(new Date(lastCycle.start_date_log), 28);

      // 3. Prepare new user data object
      const newUserData: UserData = {
        name: userProfile.name,
        goal: userProfile.goal || '',
        equipment: userProfile.equipment || 'none',
        cycleRegular: userProfile.cycle_regular || '',
        lastPeriod: lastCycle.start_date_log, // FIX: Use the latest cycle start date
        currentPhase: phase,
        cycleDay: cycleDay,
      };

      // 4. Select workout plan based on the new phase
      const primaryEquipment = Array.isArray(userProfile.equipment)
        ? userProfile.equipment[0] || 'none'
        : userProfile.equipment || 'none';

      const workout = await selectWorkoutPlan(phase || '', session.user.id, primaryEquipment);

      // 5. Update all states atomically
      if (!workout) {
        setTodayWorkoutState(null);
      } else {
        const workoutExercises = await getWorkoutDetails(workout.id);
        if (workoutExercises) {
          setTodayWorkoutState({
            id: workout.id,
            title: workout.title,
            duration: `${workout.time_predicted} min`,
            intensity: workout.intensity,
            reason: workout.workout_description || '',
            exercises: workoutExercises.map((wd) => ({
              id: wd.id,
              name: wd.name,
              series: wd.series,
              equipment: wd.equipment,
              reps: wd.reps,
              video: wd.video || '🎥',
              order: wd.order,
            })),
          });
        } else {
          setTodayWorkoutState(null);
        }
      }
      
      setUserData(newUserData); // Set the consistent user data
    };

    processUserProfile();
  }, [userProfile, session, menstrualCycles]);

  return { session, userData, todayWorkoutState, loading, userProfile, workoutHistory, menstrualCycles, setUserData, refetchFlowFitData, userId: session?.user?.id };
};
