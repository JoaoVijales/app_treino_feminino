import { selectWorkoutPlan } from '../workout_select';
import { getWorkoutByPhase, getUserWorkoutSessionlasted } from '../../utils/api'; // This will import the mocked version if it's in __mocks__ or explicitly mocked

// Mock the API module
jest.mock('../../utils/api'); // The path is relative to the test file

// Define a mock Workout type
type MockWorkout = {
  id: string;
  name: string;
  phase: string;
  equipment: string;
  // Add other properties as needed
};

describe('selectWorkoutPlan', () => {
  const MOCK_USER_ID = 'user123';
  const MOCK_PHASE = 'menstrual';
  const MOCK_EQUIPMENT = 'home';

  const mockWorkouts: MockWorkout[] = [
    { id: 'w1', name: 'Workout 1', phase: 'menstrual', equipment: 'home' },
    { id: 'w2', name: 'Workout 2', phase: 'menstrual', equipment: 'home' },
    { id: 'w3', name: 'Workout 3', phase: 'menstrual', equipment: 'home' },
  ];

  // Cast the mocked functions to Jest mock functions
  const mockGetWorkoutByPhase = getWorkoutByPhase as jest.Mock;
  const mockGetUserWorkoutSessionlasted = getUserWorkoutSessionlasted as jest.Mock;

  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks before each test
    mockGetWorkoutByPhase.mockReset();
    mockGetUserWorkoutSessionlasted.mockReset();

    // Mock console.warn and console.error to prevent output during tests
    // and to allow asserting if they were called.
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console methods
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should select the first workout that has not been done before', async () => {
    mockGetWorkoutByPhase.mockResolvedValue(mockWorkouts);
    mockGetUserWorkoutSessionlasted.mockResolvedValue(['w1']); // w1 has been done

    const result = await selectWorkoutPlan(MOCK_PHASE, MOCK_USER_ID, MOCK_EQUIPMENT);

    expect(result).toEqual(mockWorkouts[1]); // Expect w2
    expect(mockGetWorkoutByPhase).toHaveBeenCalledWith(MOCK_PHASE, MOCK_EQUIPMENT);
    expect(mockGetUserWorkoutSessionlasted).toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should fallback to the first workout if all workouts in phase have been done', async () => {
    mockGetWorkoutByPhase.mockResolvedValue(mockWorkouts);
    mockGetUserWorkoutSessionlasted.mockResolvedValue(['w1', 'w2', 'w3']); // All workouts done

    const result = await selectWorkoutPlan(MOCK_PHASE, MOCK_USER_ID, MOCK_EQUIPMENT);

    expect(result).toEqual(mockWorkouts[0]); // Expect w1 as fallback
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should return null if no workouts are found for the given phase and equipment', async () => {
    mockGetWorkoutByPhase.mockResolvedValue([]); // No workouts found
    mockGetUserWorkoutSessionlasted.mockResolvedValue([]); // Not relevant in this case

    const result = await selectWorkoutPlan(MOCK_PHASE, MOCK_USER_ID, MOCK_EQUIPMENT);

    expect(result).toBeNull();
    expect(mockGetWorkoutByPhase).toHaveBeenCalledWith(MOCK_PHASE, MOCK_EQUIPMENT);
    expect(mockGetUserWorkoutSessionlasted).not.toHaveBeenCalled(); // getUserWorkoutSessionlasted should not be called
    expect(consoleWarnSpy).toHaveBeenCalledWith("Nenhum treino encontrado para:", MOCK_PHASE, MOCK_EQUIPMENT);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should return null and log an error if getWorkoutByPhase throws an error', async () => {
    const errorMessage = 'API error during getWorkoutByPhase';
    mockGetWorkoutByPhase.mockRejectedValue(new Error(errorMessage));

    const result = await selectWorkoutPlan(MOCK_PHASE, MOCK_USER_ID, MOCK_EQUIPMENT);

    expect(result).toBeNull();
    expect(mockGetWorkoutByPhase).toHaveBeenCalledWith(MOCK_PHASE, MOCK_EQUIPMENT);
    expect(mockGetUserWorkoutSessionlasted).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao selecionar plano de treino:", expect.any(Error));
  });

  it('should return null and log an error if getUserWorkoutSessionlasted throws an error', async () => {
    const errorMessage = 'API error during getUserWorkoutSessionlasted';
    mockGetWorkoutByPhase.mockResolvedValue(mockWorkouts);
    mockGetUserWorkoutSessionlasted.mockRejectedValue(new Error(errorMessage));

    const result = await selectWorkoutPlan(MOCK_PHASE, MOCK_USER_ID, MOCK_EQUIPMENT);

    expect(result).toBeNull();
    expect(mockGetWorkoutByPhase).toHaveBeenCalledWith(MOCK_PHASE, MOCK_EQUIPMENT);
    expect(mockGetUserWorkoutSessionlasted).toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao selecionar plano de treino:", expect.any(Error));
  });

  it('should select a workout when only one workout is available and not done', async () => {
    const singleWorkout = [mockWorkouts[0]];
    mockGetWorkoutByPhase.mockResolvedValue(singleWorkout);
    mockGetUserWorkoutSessionlasted.mockResolvedValue([]); // No workouts done

    const result = await selectWorkoutPlan(MOCK_PHASE, MOCK_USER_ID, MOCK_EQUIPMENT);

    expect(result).toEqual(singleWorkout[0]);
  });
});
