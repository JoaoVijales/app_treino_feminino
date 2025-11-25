import { renderHook, waitFor, act } from '@testing-library/react';
import { useFlowFitData } from '../useFlowFitData';
import { supabase } from '../../utils/supabaseClient';
import * as api from '../../utils/api';
import { getCyclePhase } from '../../utils/cycle_phase';
import { UserProfile } from '../../types/supabase';
import { TodayWorkout } from '../../types';

// Mock the dependencies
jest.mock('../../utils/supabaseClient');
jest.mock('../../utils/api');
jest.mock('../../utils/cycle_phase');

const mockGetUser = supabase.auth.getUser as jest.Mock;
const mockGetUserProfile = api.getUserProfile as jest.Mock;
const mockGetCyclePhase = getCyclePhase as jest.Mock;

// Store original Date constructor
const RealDate = Date;

describe('useFlowFitData', () => {
  const MOCK_USER = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const MOCK_USER_PROFILE: UserProfile = {
    id: 'profile-1',
    user_id: MOCK_USER.id,
    name: 'Test User',
    email: MOCK_USER.email,
    last_period: '2023-10-20T12:00:00.000Z',
    cycle_regular: '28',
  };

  const mockUserPlan = {
    id: 'plan-1',
    user_id: MOCK_USER.id,
    plan_name: 'Basic',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default mock implementation for supabase auth
    mockGetUser.mockResolvedValue({
      data: { user: MOCK_USER },
      error: null,
    });

    // Default mock for user profile
    mockGetUserProfile.mockResolvedValue(MOCK_USER_PROFILE);

    // Default mock for cycle phase
    mockGetCyclePhase.mockReturnValue('follicular');

    // Default mock for onAuthStateChange
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
  });

  it('should be in a loading state initially', () => {
    const { result } = renderHook(() => useFlowFitData());
    expect(result.current.loading).toBe(true);
  });

  it('should fetch user profile and plan on initial load', async () => {
    // Mock for user plan, specific to this test
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: mockUserPlan, error: null }),
    });

    const { result } = renderHook(() => useFlowFitData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockGetUserProfile).toHaveBeenCalledWith(MOCK_USER.id);
    expect(supabase.from).toHaveBeenCalledWith('user_plans');
    expect(supabase.from('user_plans').select().eq).toHaveBeenCalledWith('user_id', MOCK_USER.id);
    expect(result.current.userProfile).toEqual(MOCK_USER_PROFILE);
        expect(result.current.userPlan).toEqual(mockUserPlan);
        expect(result.current.error).toBeNull();
      });
    
      it('should calculate cycle phase and day for a user with cycle data', async () => {
        // Mock the current date to be 2023-11-01 for predictable calculations
        const mockCurrentDate = new Date('2023-11-01T12:00:00.000Z');
        jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
                if (args.length === 0) {
                  return mockCurrentDate;
                }
                return new RealDate(...args);        });
    
        const { result } = renderHook(() => useFlowFitData());
    
        await waitFor(() => expect(result.current.loading).toBe(false));
    
        // Verify getCyclePhase was called correctly
        const expectedLastPeriodDate = new Date(MOCK_USER_PROFILE.last_period!);
        const expectedCycleLength = parseInt(MOCK_USER_PROFILE.cycle_regular!, 10);
        expect(mockGetCyclePhase).toHaveBeenCalledWith(expectedLastPeriodDate, expectedCycleLength);
    
        // Verify state was updated
        expect(result.current.currentPhase).toBe('follicular'); // As per the default mock
    
        // Verify cycle day calculation
        // last_period: 2023-10-20, current_date: 2023-11-01 -> 12 days difference
        // (12 % 28) + 1 = 13
        expect(result.current.cycleDay).toBe(13);
    
            // Restore original Date object
            jest.restoreAllMocks();
          });
        
          it('should handle authenticated user with no profile', async () => {
            mockGetUserProfile.mockResolvedValue(null);
        
            const { result } = renderHook(() => useFlowFitData());
        
            await waitFor(() => expect(result.current.loading).toBe(false));
        
            expect(result.current.userProfile).toBeNull();
            expect(result.current.userPlan).toBeNull(); // Plan fetch depends on profile
            expect(result.current.currentPhase).toBeNull();
                expect(result.current.cycleDay).toBeNull();
                expect(mockGetCyclePhase).not.toHaveBeenCalled();
              });
            
              it('should handle unauthenticated user on initial load', async () => {
                // Mock getUser to return no user
                mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
            
                const { result } = renderHook(() => useFlowFitData());
            
                await waitFor(() => expect(result.current.loading).toBe(false));
            
                expect(result.current.userProfile).toBeNull();
                expect(result.current.userPlan).toBeNull();
                expect(result.current.currentPhase).toBeNull();
                    expect(result.current.cycleDay).toBeNull();
                    expect(mockGetUserProfile).not.toHaveBeenCalled();
                  });
                
                  it('should set error state if fetching profile fails', async () => {
                    const errorMessage = 'Failed to fetch profile';
                    mockGetUserProfile.mockRejectedValue(new Error(errorMessage));
                
                    const { result } = renderHook(() => useFlowFitData());
                
                    await waitFor(() => expect(result.current.loading).toBe(false));
                
                        expect(result.current.error).toBe(errorMessage);
                        expect(result.current.userProfile).toBeNull();
                      });
                    
                      it('should clear user data on sign-out', async () => {
                        let authStateCallback: (event: any, session: any) => void = () => {};
                    
                        // Mock onAuthStateChange to capture its callback
                        (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
                          authStateCallback = callback;
                          return {
                            data: { subscription: { unsubscribe: jest.fn() } },
                          };
                        });
                    
                        const { result } = renderHook(() => useFlowFitData());
                    
                        // Wait for initial data load
                        await waitFor(() => expect(result.current.loading).toBe(false));
                    
                        // Ensure data is loaded initially
                        expect(result.current.userProfile).not.toBeNull();
                        expect(result.current.userPlan).not.toBeNull();
                    
                        // Act: Simulate a 'SIGNED_OUT' event by calling the callback with a null session
                        act(() => {
                          authStateCallback('SIGNED_OUT', null);
                        });
                    
                        // Assert: Check that all user-related state is cleared
                        expect(result.current.userProfile).toBeNull();
                        expect(result.current.userPlan).toBeNull();
                        expect(result.current.userData).toBeNull();
                        expect(result.current.menstrualCycles).toEqual([]);
                        expect(result.current.userWorkoutSessions).toEqual([]);
                        expect(result.current.currentWorkout).toBeNull();
                            expect(result.current.currentPhase).toBeNull();
                            expect(result.current.cycleDay).toBeNull();
                          });
                        
                          it('should update the current workout when selectWorkout is called', () => {
                            const { result } = renderHook(() => useFlowFitData());
                        
                            const MOCK_WORKOUT: TodayWorkout = {
                              id: 'workout-1',
                              name: 'Full Body Blast',
                              phase: 'follicular',
                              exercises: [],
                            };
                        
                            act(() => {
                              result.current.selectWorkout(MOCK_WORKOUT);
                            });
                        
                            expect(result.current.currentWorkout).toEqual(MOCK_WORKOUT);
                          });
                        });
                        