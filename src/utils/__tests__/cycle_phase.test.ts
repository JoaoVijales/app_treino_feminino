import { getCyclePhase, differenceInDays } from '../cycle_phase';

describe('differenceInDays', () => {
  it('should return 0 for the same date', () => {
    const date1 = new Date('2023-01-01T12:00:00.000Z');
    const date2 = new Date('2023-01-01T12:00:00.000Z');
    expect(differenceInDays(date1, date2)).toBe(0);
  });

  it('should return the correct positive difference in days', () => {
    const date1 = new Date('2023-01-01T12:00:00.000Z');
    const date2 = new Date('2023-01-05T12:00:00.000Z');
    expect(differenceInDays(date1, date2)).toBe(4);
  });

  it('should return the correct positive difference regardless of date order', () => {
    const date1 = new Date('2023-01-05T12:00:00.000Z');
    const date2 = new Date('2023-01-01T12:00:00.000Z');
    expect(differenceInDays(date1, date2)).toBe(4);
  });

  it('should handle dates spanning across months', () => {
    const date1 = new Date('2023-01-30T12:00:00.000Z');
    const date2 = new Date('2023-02-05T12:00:00.000Z');
    expect(differenceInDays(date1, date2)).toBe(6);
  });

  it('should handle dates spanning across years', () => {
    const date1 = new Date('2022-12-25T12:00:00.000Z');
    const date2 = new Date('2023-01-05T12:00:00.000Z');
    expect(differenceInDays(date1, date2)).toBe(11);
  });

  it('should correctly calculate difference with time component variations', () => {
    const date1 = new Date('2023-01-01T00:00:00.000Z');
    const date2 = new Date('2023-01-01T23:59:59.999Z');
    expect(differenceInDays(date1, date2)).toBe(0); // Less than 24 hours
    const date3 = new Date('2023-01-02T00:00:00.000Z');
    expect(differenceInDays(date1, date3)).toBe(1); // Exactly 24 hours apart
  });
});

describe('getCyclePhase', () => {
  const CYCLE_LENGTH = 28; // Standard cycle length for testing

  it('should return "menstrual" phase', () => {
    const lastPeriodDate = new Date('2023-01-01T12:00:00.000Z');
    // Day 1 to Day 5
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-01T12:00:00.000Z'))).toBe('menstrual'); // Day 1
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-05T12:00:00.000Z'))).toBe('menstrual'); // Day 5
  });

  it('should return "follicular" phase', () => {
    const lastPeriodDate = new Date('2023-01-01T12:00:00.000Z');
    // Day 6 to Day 12
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-06T12:00:00.000Z'))).toBe('follicular'); // Day 6
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-12T12:00:00.000Z'))).toBe('follicular'); // Day 12
  });

  it('should return "ovulatory" phase', () => {
    const lastPeriodDate = new Date('2023-01-01T12:00:00.000Z');
    // Day 13 to Day 16
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-13T12:00:00.000Z'))).toBe('ovulatory'); // Day 13
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-16T12:00:00.000Z'))).toBe('ovulatory'); // Day 16
  });

  it('should return "luteal" phase', () => {
    const lastPeriodDate = new Date('2023-01-01T12:00:00.000Z');
    // Day 17 to end of cycle (Day 28 for a 28-day cycle)
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-17T12:00:00.000Z'))).toBe('luteal'); // Day 17
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-28T12:00:00.000Z'))).toBe('luteal'); // Day 28
  });

  it('should handle cycling correctly (e.g., Day 29 becomes Day 1 of next cycle)', () => {
    const lastPeriodDate = new Date('2023-01-01T12:00:00.000Z'); // Cycle start
    // Day 29 should be Day 1 of the next cycle
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-01-29T12:00:00.000Z'))).toBe('menstrual');
    // Day 35 should be Day 7 (Day 35 % 28 = 7) -> follicular
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH, new Date('2023-02-06T12:00:00.000Z'))).toBe('follicular');
  });

  it('should work with a different cycle length (e.g., 21 days)', () => {
    const shortCycleLength = 21;
    const lastPeriodDate = new Date('2023-01-01T12:00:00.000Z');

    // Day 1-5 menstrual
    expect(getCyclePhase(lastPeriodDate, shortCycleLength, new Date('2023-01-05T12:00:00.000Z'))).toBe('menstrual');
    // Day 6-12 follicular
    expect(getCyclePhase(lastPeriodDate, shortCycleLength, new Date('2023-01-10T12:00:00.000Z'))).toBe('follicular');
    // Day 13-16 ovulatory
    expect(getCyclePhase(lastPeriodDate, shortCycleLength, new Date('2023-01-15T12:00:00.000Z'))).toBe('ovulatory');
    // Day 17-21 luteal
    expect(getCyclePhase(lastPeriodDate, shortCycleLength, new Date('2023-01-20T12:00:00.000Z'))).toBe('luteal');
    // Day 22 (cycle restart for a 21-day cycle)
    expect(getCyclePhase(lastPeriodDate, shortCycleLength, new Date('2023-01-22T12:00:00.000Z'))).toBe('menstrual');
  });

  it('should use current date if targetDate is not provided', () => {
    // Mock the current date to ensure predictable results
    const mockDate = new Date('2023-01-10T12:00:00.000Z');
    const RealDate = Date; // Store original Date constructor
    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        return mockDate;
      }
      // @ts-ignore - TS doesn't like spreading args to Date constructor in this way
      return new RealDate(...args);
    });

    const lastPeriodDate = new Date('2023-01-01T12:00:00.000Z');
    // With mocked current date (Day 10) and lastPeriodDate (Day 1), difference is 9 days.
    // Day 9 is follicular (6-12)
    expect(getCyclePhase(lastPeriodDate, CYCLE_LENGTH)).toBe('follicular');

    jest.restoreAllMocks(); // Clean up the mock
  });
});
