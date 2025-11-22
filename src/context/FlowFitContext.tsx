"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useFlowFitData } from '../hooks/useFlowFitData';
import { UserData, TodayWorkout } from '../types';
import { UserProfile, UserWorkoutSession, MenstrualCycle, UserPlan } from '../types/supabase'; // Import UserPlan
import { supabase } from '../utils/supabaseClient'; // Import supabase instance

interface FlowFitContextType {
  userData: UserData | null;
  userProfile: UserProfile | null;
  userPlan: UserPlan | null; // Add userPlan
  userWorkoutSessions: UserWorkoutSession[];
  workoutHistory: UserWorkoutSession[];
  menstrualCycles: MenstrualCycle[];
  currentWorkout: TodayWorkout | null;
  todayWorkoutState: TodayWorkout | null;
  currentPhase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | null;
  cycleDay: number | null;
  loading: boolean;
  error: string | null;
  updateUserData: (newData: Partial<UserData>) => void;
  fetchUserProfile: () => Promise<void>;
  fetchUserWorkoutSessions: (userId: string) => Promise<void>;
  fetchMenstrualCycles: () => Promise<void>;
  selectWorkout: (workout: TodayWorkout) => void;
  signOut: () => Promise<void>;
  supabase: any; // Add supabase instance to context
}

const FlowFitContext = createContext<FlowFitContextType | undefined>(undefined);

export const FlowFitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    userData,
    userProfile,
    userPlan, // Destructure userPlan
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
  } = useFlowFitData();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <FlowFitContext.Provider
      value={{
        userData,
        userProfile,
        userPlan, // Provide userPlan in context value
        userWorkoutSessions,
        workoutHistory: userWorkoutSessions, // Pass userWorkoutSessions as workoutHistory
        menstrualCycles,
        currentWorkout,
        todayWorkoutState: currentWorkout,
        currentPhase,
        cycleDay,
        loading,
        error,
        updateUserData,
        fetchUserProfile,
        fetchUserWorkoutSessions,
        fetchMenstrualCycles,
        selectWorkout,
        signOut,
        supabase,
      }}
    >
      {children}
    </FlowFitContext.Provider>
  );
};

export const useFlowFit = () => {
  const context = useContext(FlowFitContext);
  if (context === undefined) {
    throw new Error('useFlowFit must be used within a FlowFitProvider');
  }
  return context;
};