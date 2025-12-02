"use client";
import { useState, useEffect, useCallback } from 'react';
import { UserData, TodayWorkout } from '../types';
import { UserProfile, Workout, UserWorkoutSession, MenstrualCycle, UserPlan } from '../types/supabase'; // Import UserPlan
import { supabase } from '../utils/supabaseClient'; // Import supabase instance
import { getUserProfile, getWorkouts, getUserWorkoutSessions, getMenstrualCycles, getWorkoutDetails, getWorkouExercises, addMenstrualCycle, updateUserProfile } from '../utils/api';
import { getCyclePhase } from '../utils/cycle_phase';


export const useFlowFitData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null); // New state for user plan
  const [userWorkoutSessions, setUserWorkoutSessions] = useState<UserWorkoutSession[]>([]);
  const [menstrualCycles, setMenstrualCycles] = useState<MenstrualCycle[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<TodayWorkout | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | null>(null);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPlan = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user plan:', error);
        return null;
      }
      setUserPlan(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profile = await getUserProfile(user.id);
        setUserProfile(profile);
        if (profile) {
          await fetchUserPlan(user.id);

          let phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | null = null;
          let currentCycleDay: number | null = null;
          if (profile.last_period && profile.cycle_regular) {
            const lastPeriodDate = new Date(profile.last_period);
            const cycleLength = 28; // Assuming a fixed cycle length for now
            phase = getCyclePhase(lastPeriodDate, cycleLength);
            setCurrentPhase(phase);

            const daysSinceLastPeriod = Math.floor((new Date().getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
            currentCycleDay = (daysSinceLastPeriod % cycleLength) + 1;
            setCycleDay(currentCycleDay);
          } else {
            setCurrentPhase(null);
            setCycleDay(null);
          }

          const newUserData: UserData = {
            name: profile.name,
            goal: profile.goal,
            equipment: profile.equipment,
            cycle_regular: profile.cycle_regular,
            last_period: profile.last_period,
            currentPhase: phase,
            cycleDay: currentCycleDay,
          };
          setUserData(newUserData);

          // Fetch workout based on phase and equipment
          if (phase && profile.equipment) {
            // Ensure equipment is an array for the 'in' filter
            const equipmentList = Array.isArray(profile.equipment) ? profile.equipment : [profile.equipment];
            const possibleWorkouts = await getWorkouts(phase, equipmentList, profile.training_level || 'beginner');
            
            if (possibleWorkouts && possibleWorkouts.length > 0) {
              const selectedWorkout = possibleWorkouts[0]; // Simple selection strategy: take the first one
              const exercises = await getWorkoutDetails(selectedWorkout.id);

              if (exercises) {
                const todayWorkout: TodayWorkout = {
                  id: selectedWorkout.id,
                  title: selectedWorkout.title || 'Treino do Dia',
                  duration: `${selectedWorkout.time_predicted || 30} min`,
                  intensity: selectedWorkout.intensity || 'Moderado',
                  reason: selectedWorkout.workout_description || 'Um ótimo treino para sua fase atual.',
                  exercises: exercises,
                };
                setCurrentWorkout(todayWorkout);
              } else {
                 setCurrentWorkout(null);
              }
            } else {
              setCurrentWorkout(null); // No workout found for this criteria
            }
          } else {
             setCurrentWorkout(null);
          }
        }
      } else {
        setUserProfile(null);
        setCurrentWorkout(null);
      }
    } catch (err: any) {
      setError(err.message);
      setCurrentWorkout(null);
    } finally {
      setLoading(false);
    }
  }, [fetchUserPlan]);

  const fetchUserWorkoutSessions = useCallback(async (userId: string) => {
    try {
      const sessions = await getUserWorkoutSessions(userId);
      setUserWorkoutSessions(sessions || []); // Provide an empty array as fallback if sessions is null
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchMenstrualCycles = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const cycles = await getMenstrualCycles(user.id);
        setMenstrualCycles(cycles || []); // Provide an empty array as fallback if cycles is null
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile();
      } else {
        setUserProfile(null);
        setUserPlan(null); // Clear user plan on sign out
        setUserData(null);
        setMenstrualCycles([]);
        setUserWorkoutSessions([]);
        setCurrentWorkout(null);
        setCurrentPhase(null);
        setCycleDay(null);
        setLoading(false); // Ensure loading is false after sign out/session loss
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);


  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prev) => (prev ? { ...prev, ...newData } : null));
  };

  const selectWorkout = (workout: TodayWorkout) => {
    setCurrentWorkout(workout);
  };

  const initiateCheckoutSession = useCallback(async (userId: string) => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!priceId) {
      console.error('Stripe Price ID is not configured.');
      setError('Stripe Price ID is not configured.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ userId, priceId }),
      });

      const { sessionId, url, error: checkoutError } = await response.json();
      if (checkoutError) {
        throw new Error(checkoutError);
      }
      if (url) {
        window.location.href = url;
      } else {
        console.error('Stripe checkout URL not received.');
        setError('Failed to get Stripe checkout URL.');
      }
    } catch (err: any) {
      console.error('Failed to initiate checkout:', err.message);
      setError('Failed to initiate checkout: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(()=>{console.log(userProfile)}, [userProfile])
  useEffect(()=>{console.log(userData)}, [userData])
  return {
    userData,
    userProfile,
    userPlan, // Return userPlan
    userWorkoutSessions,
    menstrualCycles,
    currentWorkout,
    currentPhase,
    cycleDay,
    loading,
    error,
    updateUserData,
    fetchUserProfile,
    fetchUserWorkoutSessions,
    fetchMenstrualCycles,
    selectWorkout,
    updateUserProfile, // Added updateUserProfile
    initiateCheckoutSession, // Add this line
  };
};