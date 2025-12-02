import * as api from '../api'; // Import actual functions
import { PostgrestError } from '@supabase/supabase-js';
import {
  UserProfile,
  MenstrualCycle,
  CycleLog,
  Workout,
  WorkoutExercise,
  UserWorkoutSession,
  Exercise,
  UserWorkoutRecord,
  UserExerciseRecord,
  UserWorkoutExerciseSessions,
  UserWorkoutExerciseSets,
} from '../../types/supabase';
import { TodayWorkoutExercise } from '../../types';

// Mock the supabaseClient module, which api.ts depends on
jest.mock('../supabaseClient');
import { supabase, resetAllSupabaseMocks } from '../supabaseClient';


describe('API functions', () => {
  const MOCK_EXERCISE_ID = 'ex-1';
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    resetAllSupabaseMocks(); // Clear call history for all mocks
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks(); // Clear all mocks after each test to ensure isolation
  });

  // ===========================
  // USER PROFILES
  // ===========================
  describe('USER PROFILES', () => {
    const MOCK_USER_ID = 'user-123';
    const MOCK_PROFILE: UserProfile = { id: 'profile-1', user_id: MOCK_USER_ID, name: 'Test User', email: 'test@example.com' };

    describe('getUserProfile', () => {
      it('should fetch a user profile successfully', async () => {
        // Mock supabase response for getUserProfile's internal call
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({ data: MOCK_PROFILE, error: null }),
        });

        const result = await api.getUserProfile(MOCK_USER_ID);
        expect(result).toEqual(MOCK_PROFILE);
        expect(supabase.from).toHaveBeenCalledWith('user_profiles');
        expect(supabase.from('user_profiles').select).toHaveBeenCalledWith('*');
        expect(supabase.from('user_profiles').select().eq).toHaveBeenCalledWith('user_id', MOCK_USER_ID);
        expect(supabase.from('user_profiles').select().eq().maybeSingle).toHaveBeenCalled();
      });

      it('should return null if fetching fails', async () => {
        const mockError: PostgrestError = { code: '100', details: 'error', hint: 'hint', message: 'Failed to fetch' };
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        });

        const result = await api.getUserProfile(MOCK_USER_ID);
        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user profile:', mockError);
      });

      it('should return null if no profile is found', async () => {
        (supabase.from as jest.Mock).mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
        });

        const result = await api.getUserProfile(MOCK_USER_ID);
        expect(result).toBeNull();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });
    });

    describe('updateUserProfile', () => {
      const PROFILE_UPDATE_DATA: Partial<UserProfile> = { name: 'Updated Name' };

      it('should update an existing user profile successfully', async () => {
        const updatedProfile = { ...MOCK_PROFILE, ...PROFILE_UPDATE_DATA };

        const mockSelectUserIdChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({ data: { user_id: MOCK_USER_ID }, error: null }),
        };
        const mockUpdateOperationChain = {
          update: jest.fn((data) => ({
            eq: jest.fn().mockReturnThis(),
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({ data: updatedProfile, error: null }),
            })),
          })),
        };

        // Mock two sequential calls to supabase.from
        (supabase.from as jest.Mock)
          .mockReturnValueOnce(mockSelectUserIdChain) // First call for existing check
          .mockReturnValueOnce(mockUpdateOperationChain); // Second call for update operation
        
        const result = await api.updateUserProfile(MOCK_USER_ID, PROFILE_UPDATE_DATA);
        expect(result.data).toEqual(updatedProfile);
        expect(result.error).toBeNull();
        expect(supabase.from).toHaveBeenCalledWith('user_profiles');
        expect(mockUpdateOperationChain.update).toHaveBeenCalledWith(PROFILE_UPDATE_DATA);
        expect(mockUpdateOperationChain.eq).toHaveBeenCalledWith('user_id', MOCK_USER_ID);
        expect(mockUpdateOperationChain.select).toHaveBeenCalled();
        expect(mockUpdateOperationChain.single).toHaveBeenCalled();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('should create a new user profile if none exists', async () => {
        const newProfile = { ...MOCK_PROFILE, ...PROFILE_UPDATE_DATA };

        const mockSelectUserIdChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
        const mockInsertOperationChain = {
          insert: jest.fn((data) => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({ data: newProfile, error: null }),
            })),
          })),
        };

        // Mock two sequential calls to supabase.from
        (supabase.from as jest.Mock)
          .mockReturnValueOnce(mockSelectUserIdChain) // First call for existing check
          .mockReturnValueOnce(mockInsertOperationChain); // Second call for insert operation

        const result = await api.updateUserProfile(MOCK_USER_ID, PROFILE_UPDATE_DATA);
        expect(result.data).toEqual(newProfile);
        expect(result.error).toBeNull();
        expect(supabase.from).toHaveBeenCalledWith('user_profiles');
        expect(mockInsertOperationChain.insert).toHaveBeenCalledWith({ user_id: MOCK_USER_ID, ...PROFILE_UPDATE_DATA });
        expect(mockInsertOperationChain.insert().select).toHaveBeenCalled();
        expect(mockInsertOperationChain.insert().select().single).toHaveBeenCalled();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
      });

      it('should return error if updating fails', async () => {
        const mockError: PostgrestError = { code: '101', details: 'error', hint: 'hint', message: 'Failed to update' };
        
        const mockSelectUserIdChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({ data: { user_id: MOCK_USER_ID }, error: null }),
        };
        const mockUpdateOperationChain = {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        };

        // Mock two sequential calls to supabase.from
        (supabase.from as jest.Mock)
          .mockReturnValueOnce(mockSelectUserIdChain) // First call for existing check
          .mockReturnValueOnce(mockUpdateOperationChain); // Second call for update operation

        const result = await api.updateUserProfile(MOCK_USER_ID, PROFILE_UPDATE_DATA);
        expect(result.data).toBeNull();
        expect(result.error).toEqual(mockError);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating user profile:', mockError);
      });

      it('should return error if creating fails', async () => {
        const mockError: PostgrestError = { code: '102', details: 'error', hint: 'hint', message: 'Failed to create' };
        
        const mockSelectUserIdChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
        const mockInsertOperationChain = {
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
            })),
          })),
        };

        // Mock two sequential calls to supabase.from
        (supabase.from as jest.Mock)
          .mockReturnValueOnce(mockSelectUserIdChain) // First call for existing check
          .mockReturnValueOnce(mockInsertOperationChain); // Second call for insert operation

        const result = await api.updateUserProfile(MOCK_USER_ID, PROFILE_UPDATE_DATA);
        expect(result.data).toBeNull();
        expect(result.error).toEqual(mockError);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating user profile:', mockError);
      });
    });
  });
});