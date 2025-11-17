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

  useEffect(() => {
    const fetchData = async () => {
      // Hardcoded user ID for now
      const userId = 'test_user_001';
      setLoading(true);

      const profile = await getUserProfile(userId);
      setUserProfile(profile);

      const history = await getUserWorkoutSessions(userId);
      if (history) {
        setWorkoutHistory(history);
      }

      const cycles = await getMenstrualCycles(userId);
      if (cycles) {
        setMenstrualCycles(cycles);
      }

      if (profile && profile.last_period && profile.equipment) {
        const cycleDay = differenceInDays(new Date(), new Date(profile.last_period));
        const phase = getCyclePhase(new Date(profile.last_period), 28); // Assuming 28 day cycle for now
        //console.log(phase, cycleDay)
        setUserData({
          name: profile.name,
          goal: profile.goal || '',
          equipment: profile.equipment || 'none',
          cycleRegular: profile.cycle_regular || '',
          lastPeriod: profile.last_period || '',
          currentPhase: phase,
          cycleDay: cycleDay,
        });

        const Workout = await selectWorkoutPlan(userData.currentPhase || '', userId, profile.equipment[1]);
        //console.log(Workout)
        if (Workout) {
            const workouExercises = await getWorkoutDetails(Workout.id);
            //console.log(workouExercises)
            if (workouExercises) {
              setTodayWorkoutState({
                id: Workout.id,
                title: Workout.title,
                duration: `${Workout.time_predicted} min`,
                intensity: Workout.intensity,
                reason: Workout.workout_description || '',
                exercises: workouExercises.map((wd) => ({
                  name: wd.name,
                  series: wd.series,
                  reps: wd.reps,
                  video: wd.video || '🎥',
                  order: wd.order
                })),
              });
              console.log(todayWorkoutState)
            }
          }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return { userData, todayWorkoutState, loading, userProfile, workoutHistory, menstrualCycles, setUserData };
};
