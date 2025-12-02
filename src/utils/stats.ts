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

  const uniqueWeeksWithWorkouts = new Set<number>();
  workoutHistory.forEach(session => {
    const sessionDate = new Date(session.session_date);
    const startOfWeek = getStartOfWeek(sessionDate);
    startOfWeek.setHours(0, 0, 0, 0);
    uniqueWeeksWithWorkouts.add(startOfWeek.getTime());
  });

  const sortedUniqueWeeks = Array.from(uniqueWeeksWithWorkouts).sort((a, b) => b - a); // Newest first

  let today = new Date();
  let currentWeekStart = getStartOfWeek(today);
  currentWeekStart.setHours(0, 0, 0, 0);

  let streak = 0;
  let expectedWeekToCheck = new Date(currentWeekStart); // Start checking from current week

  // First, check if there's a workout in the current week or the immediate last week to start a streak
  let foundValidStart = false;
  if (sortedUniqueWeeks.includes(currentWeekStart.getTime())) {
    foundValidStart = true;
  } else {
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    if (sortedUniqueWeeks.includes(lastWeekStart.getTime())) {
      foundValidStart = true;
      expectedWeekToCheck = lastWeekStart; // Start counting from last week if current week is empty
    }
  }

  if (!foundValidStart) {
    return 0; // No workout in current or last week, so no streak
  }
  
  // Now, iterate backwards from the `expectedWeekToCheck`
  for (let i = 0; ; i++) { // Infinite loop, will break internally
    const targetWeekTimestamp = expectedWeekToCheck.getTime();
    
    if (sortedUniqueWeeks.includes(targetWeekTimestamp)) {
      streak++;
    } else {
      break; // Streak broken
    }
    
    // Move to the previous week for the next iteration
    expectedWeekToCheck.setDate(expectedWeekToCheck.getDate() - 7);
  }

  return streak;
};
