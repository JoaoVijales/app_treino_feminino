import { UserWorkoutSession } from '../types/supabase';

// Helper to get the start of the week for a given date
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

export const getWorkoutsThisWeek = (workoutHistory: UserWorkoutSession[]): number => {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return workoutHistory.filter(session => {
    const sessionDate = new Date(session.session_date);
    return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
  }).length;
};

export const getConsistency = (workoutHistory: UserWorkoutSession[]): number => {
  const today = new Date();
  let weeksWithWorkouts = 0;

  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (i * 7));
    const startOfWeek = getStartOfWeek(weekStart);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekEnd = new Date(startOfWeek);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const hasWorkoutThisWeek = workoutHistory.some(session => {
      const sessionDate = new Date(session.session_date);
      return sessionDate >= startOfWeek && sessionDate <= weekEnd;
    });

    if (hasWorkoutThisWeek) {
      weeksWithWorkouts++;
    }
  }

  return (weeksWithWorkouts / 4) * 100;
};

export const getStreak = (workoutHistory: UserWorkoutSession[]): number => {
  if (workoutHistory.length === 0) {
    return 0;
  }

  const sortedHistory = [...workoutHistory].sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());

  let streak = 0;
  let currentWeek = getStartOfWeek(new Date());
  currentWeek.setHours(0, 0, 0, 0);

  // Check if there is a workout in the current week
  const hasWorkoutThisWeek = sortedHistory.some(session => {
    const sessionDate = new Date(session.session_date);
    const startOfSessionWeek = getStartOfWeek(sessionDate);
    startOfSessionWeek.setHours(0, 0, 0, 0);
    return startOfSessionWeek.getTime() === currentWeek.getTime();
  });

  if (!hasWorkoutThisWeek) {
    // If no workout this week, check if there was a workout last week
    const lastWeek = new Date(currentWeek);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const hasWorkoutLastWeek = sortedHistory.some(session => {
        const sessionDate = new Date(session.session_date);
        const startOfSessionWeek = getStartOfWeek(sessionDate);
        startOfSessionWeek.setHours(0, 0, 0, 0);
        return startOfSessionWeek.getTime() === lastWeek.getTime();
    });

    if(!hasWorkoutLastWeek) {
        return 0;
    }
  }
  
  const uniqueWeeksWithWorkouts = new Set<number>();
  sortedHistory.forEach(session => {
    const sessionDate = new Date(session.session_date);
    const startOfWeek = getStartOfWeek(sessionDate);
    startOfWeek.setHours(0, 0, 0, 0);
    uniqueWeeksWithWorkouts.add(startOfWeek.getTime());
  });

  const sortedWeeks = Array.from(uniqueWeeksWithWorkouts).sort((a, b) => b - a);

  let today = new Date();
  // Adjust for the case where today is Sunday, so the "current week" is correct
  if (today.getDay() === 0) {
      today.setDate(today.getDate() - 1);
  }

  let weekOfLatestWorkout = getStartOfWeek(new Date(sortedWeeks[0]));
  let currentWeekStart = getStartOfWeek(today);

  // If the latest workout is not in the current or last week, streak is 0
  if (currentWeekStart.getTime() - weekOfLatestWorkout.getTime() > 7 * 24 * 60 * 60 * 1000) {
      return 0;
  }
  
  for (let i = 0; i < sortedWeeks.length; i++) {
    const week = new Date(sortedWeeks[i]);
    const expectedWeek = new Date(currentWeekStart);
    expectedWeek.setDate(expectedWeek.getDate() - i * 7);

    const startOfExpectedWeek = getStartOfWeek(expectedWeek);
    startOfExpectedWeek.setHours(0, 0, 0, 0);

    if (week.getTime() === startOfExpectedWeek.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
