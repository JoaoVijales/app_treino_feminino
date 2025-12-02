import { renderHook, waitFor, act } from '@testing-library/react';
import { useWorkoutSession } from '../useWorkoutSession';
import { useFlowFit } from '../../context/FlowFitContext';
import * as api from '../../utils/api';
import { v4 as uuidv4 } from 'uuid';

// Mock dependencies
jest.mock('../../context/FlowFitContext');
jest.mock('../../utils/api');

const mockUseFlowFit = useFlowFit as jest.Mock;

// Mock all functions from the api module
const mockAddUserWorkoutSession = api.addUserWorkoutSession as jest.Mock;
const mockGetWorkouExercises = api.getWorkouExercises as jest.Mock;
const mockAddUserWorkoutExerciseSessions = api.addUserWorkoutExerciseSessions as jest.Mock;
const mockAddUserWorkoutExerciseSets = api.addUserWorkoutExerciseSets as jest.Mock;
const mockUpdateUserWorkoutExerciseSets = api.updateUserWorkoutExerciseSets as jest.Mock;
const mockUpdateUserWorkoutSession = api.updateUserWorkoutSession as jest.Mock;


describe('useWorkoutSession', () => {
  const MOCK_USER_PROFILE = { id: 'user-123', name: 'Test User' };
  const MOCK_CURRENT_PHASE = 'follicular';
  const MOCK_WORKOUT_ID = 'workout-abc';
  
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for useFlowFit context
    mockUseFlowFit.mockReturnValue({
      userProfile: MOCK_USER_PROFILE,
      currentPhase: MOCK_CURRENT_PHASE,
      loading: false,
      error: null,
    });
  });

  it('should have a null initial state', () => {
    const { result } = renderHook(() => useWorkoutSession());
    expect(result.current.currentWorkoutSession).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should start a workout session successfully', async () => {
    // --- Mocks ---
    const newSessionId = 'session-uuid-1';
    const exerciseId1 = 'ex-1';
    const exerciseId2 = 'ex-2';
    const exerciseSessionId1 = 'ex-session-uuid-1';
    const exerciseSessionId2 = 'ex-session-uuid-2';

    // Mock uuidv4 to return predictable IDs
    (uuidv4 as jest.Mock)
      .mockReturnValueOnce(newSessionId)
      .mockReturnValueOnce(exerciseSessionId1)
      .mockReturnValueOnce(exerciseSessionId2);

    const mockNewSession = { id: newSessionId, user_id: MOCK_USER_PROFILE.id, workout_id: MOCK_WORKOUT_ID, session_date: expect.any(String), actual_phase: MOCK_CURRENT_PHASE, duration: 0, intensity_rating: 0, feeling: null, notes: null, load_workout_total: 0, created_at: expect.any(String) };
    const mockExercises = [{ exercise_id: exerciseId1 }, { exercise_id: exerciseId2 }];
    const mockNewExerciseSessions = [{ id: exerciseSessionId1, session_id: newSessionId, exercise_session_id: exerciseId1, load_exercise_session: 0, created_at: expect.any(String) }, { id: exerciseSessionId2, session_id: newSessionId, exercise_session_id: exerciseId2, load_exercise_session: 0, created_at: expect.any(String) }];

    mockAddUserWorkoutSession.mockResolvedValue(mockNewSession);
    mockGetWorkouExercises.mockResolvedValue(mockExercises);
    mockAddUserWorkoutExerciseSessions.mockResolvedValue(mockNewExerciseSessions);

    const { result } = renderHook(() => useWorkoutSession());

    // --- Action ---
    await act(async () => {
      await result.current.startWorkoutSession(MOCK_WORKOUT_ID);
    });

    // --- Assertions ---
    // Check API calls
    expect(mockAddUserWorkoutSession).toHaveBeenCalledWith(expect.objectContaining({
      id: newSessionId,
      user_id: MOCK_USER_PROFILE.id,
      workout_id: MOCK_WORKOUT_ID,
      actual_phase: MOCK_CURRENT_PHASE,
    }));
    expect(mockGetWorkouExercises).toHaveBeenCalledWith(MOCK_WORKOUT_ID);
    expect(mockAddUserWorkoutExerciseSessions).toHaveBeenCalledWith([
      expect.objectContaining({ id: exerciseSessionId1, session_id: newSessionId, exercise_session_id: exerciseId1 }),
      expect.objectContaining({ id: exerciseSessionId2, session_id: newSessionId, exercise_session_id: exerciseId2 }),
    ]);

    // Check final state
    expect(result.current.error).toBeNull();
    expect(result.current.currentWorkoutSession).not.toBeNull();
    expect(result.current.currentWorkoutSession?.workoutSession).toEqual(mockNewSession);
    expect(result.current.currentWorkoutSession?.exerciseSessions.length).toBe(2);
    expect(result.current.currentWorkoutSession?.exerciseSessions[0].exercise).toEqual(mockNewExerciseSessions[0]);
    expect(result.current.currentWorkoutSession?.exerciseSessions[0].sets).toEqual([]);
  });

  it('should fail to start a session if user is not logged in', async () => {
    // --- Mocks ---
    mockUseFlowFit.mockReturnValue({
      userProfile: null, // No user
      currentPhase: MOCK_CURRENT_PHASE,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useWorkoutSession());

    // --- Action ---
    await act(async () => {
      await result.current.startWorkoutSession(MOCK_WORKOUT_ID);
    });

    // --- Assertions ---
    expect(result.current.error).toBe("User not logged in or cycle phase not determined.");
    expect(result.current.currentWorkoutSession).toBeNull();
    expect(mockAddUserWorkoutSession).not.toHaveBeenCalled();
    expect(mockGetWorkouExercises).not.toHaveBeenCalled();
    expect(mockAddUserWorkoutExerciseSessions).not.toHaveBeenCalled();
  });

  it('should set an error if starting a session fails at the API level', async () => {
    // --- Mocks ---
    const errorMessage = "Network Error";
    mockAddUserWorkoutSession.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useWorkoutSession());

    // --- Action ---
    await act(async () => {
      await result.current.startWorkoutSession(MOCK_WORKOUT_ID);
    });

    // --- Assertions ---
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.currentWorkoutSession).toBeNull();
  });

  it('should add an exercise set to the current session', async () => {
    // --- Setup: Start a session first ---
    const newSessionId = 'session-uuid-1';
    const exerciseId1 = 'ex-1';
    const exerciseSessionId1 = 'ex-session-uuid-1';
    (uuidv4 as jest.Mock).mockReturnValueOnce(newSessionId).mockReturnValueOnce(exerciseSessionId1);
    const mockNewSession = { id: newSessionId, user_id: MOCK_USER_PROFILE.id, workout_id: MOCK_WORKOUT_ID, session_date: 'date', actual_phase: MOCK_CURRENT_PHASE, duration: 0, intensity_rating: 0, feeling: null, notes: null, load_workout_total: 0, created_at: 'date' };
    const mockExercises = [{ exercise_id: exerciseId1 }];
    const mockNewExerciseSessions = [{ id: exerciseSessionId1, session_id: newSessionId, exercise_session_id: exerciseId1, load_exercise_session: 0, created_at: 'date' }];
    mockAddUserWorkoutSession.mockResolvedValue(mockNewSession);
    mockGetWorkouExercises.mockResolvedValue(mockExercises);
    mockAddUserWorkoutExerciseSessions.mockResolvedValue(mockNewExerciseSessions);

    const { result } = renderHook(() => useWorkoutSession());
    await act(async () => {
      await result.current.startWorkoutSession(MOCK_WORKOUT_ID);
    });

    // --- Mocks for addExerciseSet ---
    const newSetId = 'set-uuid-1';
    (uuidv4 as jest.Mock).mockReturnValueOnce(newSetId);
    const newSetData = { id: newSetId, exercise_session_id: exerciseSessionId1, weight_done: 50, reps_done: 10, load_set: 0, ref_set: 0, created_at: 'date' };
    mockAddUserWorkoutExerciseSets.mockResolvedValue([newSetData]);

    // --- Action ---
    await act(async () => {
      await result.current.addExerciseSet(exerciseSessionId1, 50, 10);
    });

    // --- Assertions ---
    expect(mockAddUserWorkoutExerciseSets).toHaveBeenCalledWith([
      expect.objectContaining({
        id: newSetId,
        exercise_session_id: exerciseSessionId1,
        weight_done: 50,
        reps_done: 10,
      }),
    ]);

    const updatedExerciseSession = result.current.currentWorkoutSession?.exerciseSessions.find(
      (es) => es.exercise.id === exerciseSessionId1
    );
    expect(updatedExerciseSession?.sets.length).toBe(1);
    expect(updatedExerciseSession?.sets[0]).toEqual(newSetData);
  });

  it('should update an exercise set', async () => {
    // --- Setup: Start a session and add a set ---
    const sessionId = 'session-uuid-1';
    const exerciseId = 'ex-1';
    const exerciseSessionId = 'ex-session-uuid-1';
    const setId = 'set-uuid-1';

    // Mock the session start
    (uuidv4 as jest.Mock).mockReturnValueOnce(sessionId).mockReturnValueOnce(exerciseSessionId);
    mockAddUserWorkoutSession.mockResolvedValue({ id: sessionId, user_id: MOCK_USER_PROFILE.id, workout_id: MOCK_WORKOUT_ID });
    mockGetWorkouExercises.mockResolvedValue([{ exercise_id: exerciseId }]);
    mockAddUserWorkoutExerciseSessions.mockResolvedValue([{ id: exerciseSessionId, session_id: sessionId, exercise_session_id: exerciseId }]);

    const { result } = renderHook(() => useWorkoutSession());
    await act(async () => {
      await result.current.startWorkoutSession(MOCK_WORKOUT_ID);
    });

    // Mock the set addition
    const initialSet = { id: setId, exercise_session_id: exerciseSessionId, weight_done: 50, reps_done: 10 };
    (uuidv4 as jest.Mock).mockReturnValueOnce(setId);
    mockAddUserWorkoutExerciseSets.mockResolvedValue([initialSet]);
    await act(async () => {
      await result.current.addExerciseSet(exerciseSessionId, 50, 10);
    });

    // --- Mocks for updateExerciseSet ---
    const updatedSetData = { ...initialSet, weight_done: 55, reps_done: 8 };
    mockUpdateUserWorkoutExerciseSets.mockResolvedValue(updatedSetData);

    // --- Action ---
    await act(async () => {
      await result.current.updateExerciseSet(exerciseSessionId, setId, 55, 8);
    });

    // --- Assertions ---
    expect(mockUpdateUserWorkoutExerciseSets).toHaveBeenCalledWith(setId, {
      weight_done: 55,
      reps_done: 8,
    });
    
    const updatedExerciseSession = result.current.currentWorkoutSession?.exerciseSessions[0];
    expect(updatedExerciseSession?.sets.length).toBe(1);
    expect(updatedExerciseSession?.sets[0]).toEqual(updatedSetData);
  });

  it('should finish a workout session', async () => {
    // --- Setup: Start a session ---
    const sessionId = 'session-uuid-1';
    (uuidv4 as jest.Mock).mockReturnValueOnce(sessionId);
    mockAddUserWorkoutSession.mockResolvedValue({ id: sessionId });
    mockGetWorkouExercises.mockResolvedValue([]);
    mockAddUserWorkoutExerciseSessions.mockResolvedValue([]);
    
    const { result } = renderHook(() => useWorkoutSession());
    await act(async () => {
      await result.current.startWorkoutSession(MOCK_WORKOUT_ID);
    });

    // Ensure session is active before finishing
    expect(result.current.currentWorkoutSession).not.toBeNull();

    mockUpdateUserWorkoutSession.mockResolvedValue({}); // Mock successful update

    // --- Action ---
    await act(async () => {
      await result.current.finishWorkoutSession(8, 'great', 'Felt strong');
    });

    // --- Assertions ---
    expect(mockUpdateUserWorkoutSession).toHaveBeenCalledWith(sessionId, 8, 'great', 'Felt strong');
    expect(result.current.currentWorkoutSession).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should call placeholder functions without error', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const { result } = renderHook(() => useWorkoutSession());

    await act(async () => {
      await result.current.updateExerciseLoad(0);
      await result.current.updateWorkoutLoad();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Updating load for exercise at index: 0');
    expect(consoleSpy).toHaveBeenCalledWith('Updating total workout load.');

    consoleSpy.mockRestore();
  });
});
