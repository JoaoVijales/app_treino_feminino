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
        if (profile) { // Fetch user plan only if profile exists
          await fetchUserPlan(user.id);
        }

        // Calculate menstrual cycle phase
        if (profile?.last_period && profile?.cycle_regular) {
          const lastPeriodDate = new Date(profile.last_period);
          // Assuming an average cycle length if not dynamically determined
          const cycleLength = parseInt(profile.cycle_regular) || 28;
          const phase = getCyclePhase(lastPeriodDate, cycleLength);
          setCurrentPhase(phase);

          const daysSinceLastPeriod = Math.floor((new Date().getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
          const currentCycleDay = (daysSinceLastPeriod % cycleLength) + 1;
          setCycleDay(currentCycleDay);
        } else {
          setCurrentPhase(null);
          setCycleDay(null);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchUserPlan]); // Add fetchUserPlan to dependencies

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
    fetchUserProfile();

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
  };
};