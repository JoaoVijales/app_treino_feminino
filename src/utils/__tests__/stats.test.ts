import { getWorkoutsThisWeek, getConsistency, getStreak } from '../stats';
import { UserWorkoutSession } from '../../types/supabase'; // Assuming this path is correct

// Define a mock UserWorkoutSession type for testing
type MockUserWorkoutSession = UserWorkoutSession; // Use the actual type for better type safety

// Helper to create a workout session object
const createWorkout = (dateString: string): MockUserWorkoutSession => ({
  id: Math.random().toString(),
  session_date: dateString,
  // Add other properties if UserWorkoutSession requires them and are relevant for stats
  user_id: 'mock-user-id',
  created_at: new Date().toISOString(),
  workout_plan_id: 'mock-plan-id',
  status: 'completed',
  duration_minutes: 60,
});

describe('stats utilities', () => {
  let mockDate: Date;
  let RealDate: typeof Date;

  beforeAll(() => {
    // Store the original Date constructor
    RealDate = Date;
  });

  beforeEach(() => {
    // Reset mockDate for each test
    mockDate = new RealDate('2023-10-26T12:00:00.000Z'); // A Thursday, for predictable week calculations
    // Mock the global Date object to control 'today'
    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        return mockDate;
      }
      // @ts-ignore - TS doesn't like spreading args to Date constructor in this way
      return new RealDate(...args);
    });
  });

  afterEach(() => {
    // Restore the original Date object after each test
    jest.restoreAllMocks();
  });

  describe('getWorkoutsThisWeek', () => {
    it('should return 0 if no workouts are in the current week', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-10T10:00:00.000Z'), // Previous week
      ];
      expect(getWorkoutsThisWeek(workoutHistory)).toBe(0);
    });

    it('should return the correct count for workouts in the current week', () => {
      // Current week: 2023-10-23 (Monday) to 2023-10-29 (Sunday) (assuming start of week is Monday)
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-24T10:00:00.000Z'), // Tuesday
        createWorkout('2023-10-26T10:00:00.000Z'), // Thursday (mockDate's day)
        createWorkout('2023-10-28T10:00:00.000Z'), // Saturday
      ];
      expect(getWorkoutsThisWeek(workoutHistory)).toBe(3);
    });

    it('should not count workouts outside the current week', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-10T10:00:00.000Z'), // Previous week
        createWorkout('2023-11-01T10:00:00.000Z'), // Next week
        createWorkout('2023-10-26T10:00:00.000Z'), // Current week
      ];
      expect(getWorkoutsThisWeek(workoutHistory)).toBe(1);
    });

    it('should handle empty workout history', () => {
      const workoutHistory: MockUserWorkoutSession[] = [];
      expect(getWorkoutsThisWeek(workoutHistory)).toBe(0);
    });

    it('should correctly determine start and end of week (Monday as start)', () => {
      // MockDate is Thursday 2023-10-26
      // Start of week should be Monday 2023-10-23
      // End of week should be Sunday 2023-10-29
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-23T00:00:00.000Z'), // Monday, start of week
        createWorkout('2023-10-29T23:59:59.999Z'), // Sunday, end of week
        createWorkout('2023-10-22T23:59:59.999Z'), // Sunday, previous week - should not count
        createWorkout('2023-10-30T00:00:00.000Z'), // Monday, next week - should not count
      ];
      expect(getWorkoutsThisWeek(workoutHistory)).toBe(2);
    });
  });

  describe('getConsistency', () => {
    it('should return 0% if no workouts in the last 4 weeks', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-09-01T10:00:00.000Z'), // Older than 4 weeks
      ];
      expect(getConsistency(workoutHistory)).toBe(0);
    });

    it('should return 25% for 1 week with workouts in the last 4 weeks', () => {
      // MockDate is 2023-10-26 (Week 4: 23-29 Oct)
      // Week 3: 16-22 Oct
      // Week 2: 09-15 Oct
      // Week 1: 02-08 Oct
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-24T10:00:00.000Z'), // Current week (Week 4)
      ];
      expect(getConsistency(workoutHistory)).toBe(25);
    });

    it('should return 50% for 2 weeks with workouts in the last 4 weeks', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-24T10:00:00.000Z'), // Week 4
        createWorkout('2023-10-17T10:00:00.000Z'), // Week 3
      ];
      expect(getConsistency(workoutHistory)).toBe(50);
    });

    it('should return 75% for 3 weeks with workouts in the last 4 weeks', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-24T10:00:00.000Z'), // Week 4
        createWorkout('2023-10-17T10:00:00.000Z'), // Week 3
        createWorkout('2023-10-10T10:00:00.000Z'), // Week 2
      ];
      expect(getConsistency(workoutHistory)).toBe(75);
    });

    it('should return 100% for 4 weeks with workouts in the last 4 weeks', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-24T10:00:00.000Z'), // Week 4
        createWorkout('2023-10-17T10:00:00.000Z'), // Week 3
        createWorkout('2023-10-10T10:00:00.000Z'), // Week 2
        createWorkout('2023-10-03T10:00:00.000Z'), // Week 1
      ];
      expect(getConsistency(workoutHistory)).toBe(100);
    });

    it('should handle multiple workouts in the same week correctly (only counts as one week)', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-24T10:00:00.000Z'), // Week 4
        createWorkout('2023-10-25T10:00:00.000Z'), // Also Week 4
        createWorkout('2023-10-17T10:00:00.000Z'), // Week 3
      ];
      expect(getConsistency(workoutHistory)).toBe(50);
    });
  });

  describe('getStreak', () => {
    it('should return 0 for empty workout history', () => {
      const workoutHistory: MockUserWorkoutSession[] = [];
      expect(getStreak(workoutHistory)).toBe(0);
    });

    it('should return 1 for a single workout in the current week', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-26T10:00:00.000Z'), // Current week
      ];
      expect(getStreak(workoutHistory)).toBe(1);
    });

    it('should return 0 if the latest workout is not in the current or last week', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-10T10:00:00.000Z'), // Two weeks ago
      ];
      expect(getStreak(workoutHistory)).toBe(0);
    });

    it('should return 1 for a workout in the immediate previous week', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-19T10:00:00.000Z'), // Last week
      ];
      // MockDate (2023-10-26) -> Current week
      // A workout from 2023-10-19 is in the previous week.
      // The current logic of getStreak might need to be adjusted if it only looks for *current* week first.
      // Based on the code, if no workout in current week, it checks last week and returns 0 unless it IS current or last.
      // This test case will fail with the existing logic because it's only looking for a gap.
      // Let's re-read the getStreak logic carefully.
      // The `getStreak` logic:
      // 1. Checks current week. If no workout, checks last week. If no workout there, returns 0.
      // 2. Builds `uniqueWeeksWithWorkouts`.
      // 3. Compares `currentWeekStart` with `weekOfLatestWorkout`.
      // The `if (!hasWorkoutThisWeek)` block:
      // if no workout this week AND no workout last week, return 0.
      // So if there's a workout last week, and NOT this week, it should return 1.
      // The `getStreak` logic is slightly complex here.
      // Let's set mockDate to a Sunday so the `currentWeek` check logic is more clear.
      mockDate = new RealDate('2023-10-29T12:00:00.000Z'); // Sunday of Week 4
      expect(getStreak(workoutHistory)).toBe(1);
    });

    it('should return correct streak for consecutive weeks including current week', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-26T10:00:00.000Z'), // Current week (Week 4)
        createWorkout('2023-10-19T10:00:00.000Z'), // Week 3
        createWorkout('2023-10-12T10:00:00.000Z'), // Week 2
      ];
      expect(getStreak(workoutHistory)).toBe(3);
    });

    it('should return correct streak for consecutive weeks ending last week', () => {
      // MockDate = 2023-10-26 (Current Week 4). No workouts in current week.
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-19T10:00:00.000Z'), // Week 3 (last week)
        createWorkout('2023-10-12T10:00:00.000Z'), // Week 2
      ];
      expect(getStreak(workoutHistory)).toBe(2);
    });

    it('should break streak if a week is missed', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-26T10:00:00.000Z'), // Current week (Week 4)
        // Missed Week 3 (2023-10-16 to 2023-10-22)
        createWorkout('2023-10-12T10:00:00.000Z'), // Week 2
      ];
      expect(getStreak(workoutHistory)).toBe(1); // Only current week counts
    });

    it('should return 0 if latest workout is too old', () => {
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-09-01T10:00:00.000Z'), // Too old
      ];
      expect(getStreak(workoutHistory)).toBe(0);
    });

    it('should correctly handle current date being Sunday for streak', () => {
      // If today is Sunday, `getStartOfWeek` needs to correctly get the start of the current week (Monday).
      // The `getStreak` function has an adjustment for `today.getDay() === 0`.
      // Let's set mockDate to Sunday 2023-10-29.
      mockDate = new RealDate('2023-10-29T12:00:00.000Z'); // Sunday
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-27T10:00:00.000Z'), // Friday (Current week)
        createWorkout('2023-10-20T10:00:00.000Z'), // Previous Friday (Last week)
        createWorkout('2023-10-13T10:00:00.000Z'), // Week before last (2 weeks ago)
      ];
      expect(getStreak(workoutHistory)).toBe(3);
    });

    it('should correctly handle empty current week but workout in previous week for streak', () => {
      // MockDate is 2023-10-26 (Thursday). Current week: Oct 23-29.
      // Workout only in previous week: Oct 16-22.
      const workoutHistory: MockUserWorkoutSession[] = [
        createWorkout('2023-10-17T10:00:00.000Z'), // Week 3 (last week)
      ];
      // According to the `getStreak` logic:
      // `hasWorkoutThisWeek` will be false.
      // `hasWorkoutLastWeek` will be true.
      // So the initial check passes, and then the main loop should count the previous week.
      expect(getStreak(workoutHistory)).toBe(1);
    });
  });
});