import React, { createContext, useContext } from 'react';
import { useFlowFitData } from '../hooks/useFlowFitData';
import { UserData, TodayWorkout } from '../types';
import { UserProfile, UserWorkoutSession, MenstrualCycle } from '../types/supabase';

interface FlowFitContextType {
  userData: UserData;
  todayWorkoutState: TodayWorkout | null;
  loading: boolean;
  userProfile: UserProfile | null;
  workoutHistory: UserWorkoutSession[];
  menstrualCycles: MenstrualCycle[];
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const FlowFitContext = createContext<FlowFitContextType | undefined>(undefined);

export const FlowFitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const flowFitData = useFlowFitData();

  return (
    <FlowFitContext.Provider value={flowFitData}>
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
