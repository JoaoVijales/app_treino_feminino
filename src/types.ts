import React from 'react';
import { LucideProps } from 'lucide-react';

export interface UserData {
  name: string;
  goal: string;
  equipment: string[];
  cycleRegular: string;
  lastPeriod: string;
  currentPhase: 'menstrual' | 'folicular' | 'ovulatoria' | 'lutea';
  cycleDay: number;
}

export interface CyclePhase {
  name: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  color: string;
  emoji: string;
}

export interface CyclePhases {
  [key: string]: CyclePhase;
}

export interface TodayWorkoutExercise {
  name: string;
  sets: {set: number , reps: number, }[];
  rest: string;
  video: string;
  reps?: number;
  weight?: number;
  prReps?: number;
  prWeight?: number;
  prDate?: string;
}

export interface TodayWorkout {
  title: string;
  duration: string;
  intensity: string;
  reason: string;
  exercises: TodayWorkoutExercise[];
}

export interface WeekProgressItem {
  day: string;
  completed: boolean;
  intensity: number;
}

export interface OnboardingScreenConfig {
  title: string;
  subtitle?: string;
  field: keyof UserData;
  type: 'text' | 'date' | 'options' | 'multiple';
  placeholder?: string;
  question?: string;
  options?: { value: string; label: string; icon: string; }[];
}
