// src/utils/__mocks__/supabaseClient.ts
import { jest } from '@jest/globals';

// Factory function to create a new mock query builder instance
const createMockQueryBuilder = () => {
  const qb: any = {
    // Chainable methods
    select: jest.fn(function() { return this; }),
    eq: jest.fn(function() { return this; }),
    order: jest.fn(function() { return this; }),
    in: jest.fn(function() { return this; }),
    insert: jest.fn(function() { return this; }),
    update: jest.fn(function() { return this; }),
    delete: jest.fn(function() { return this; }),

    // Terminating methods - These will be mocked directly in tests using .mockResolvedValue
    maybeSingle: jest.fn(),
    single: jest.fn(),
    then: jest.fn(),
  };
  return qb;
};

// Main mock for supabase.from
const mockFrom = jest.fn((tableName: string) => createMockQueryBuilder());

const mockAuth = {
  getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
  signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
  signUp: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
  signOut: jest.fn(() => Promise.resolve({ error: null })),
  onAuthStateChange: jest.fn((callback) => {
    // Simulate initial state
    callback('INITIAL', { event: 'INITIAL', session: null });
    return { data: { subscription: { unsubscribe: jest.fn() } } };
  }),
  updateUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
  resetPasswordForEmail: jest.fn(() => Promise.resolve({ error: null })),
};

// Export the main supabase object
export const supabase = {
  from: mockFrom,
  auth: mockAuth,
};

// Helper to reset all mocks on the supabase object
export const resetAllSupabaseMocks = () => {
  // Clear the mock history of supabase.from itself
  mockFrom.mockClear();

  // Reset the mock implementations of the methods on the default query builder.
  // This is important because createMockQueryBuilder returns a *new* object every time,
  // but if the test directly manipulates `supabase.from().select()`, we need to clear
  // that specific `jest.fn()` instance's history.
  // However, since `mockFrom` returns a NEW query builder each time, we don't need to deep clear.
  // We just need to make sure `mockFrom` itself is clear, and the methods it returns are fresh `jest.fn()`s.

  // Clear auth mocks
  mockAuth.getSession.mockClear();
  mockAuth.getUser.mockClear();
  mockAuth.signInWithPassword.mockClear();
  mockAuth.signUp.mockClear();
  mockAuth.signOut.mockClear();
  mockAuth.onAuthStateChange.mockClear();
  mockAuth.updateUser.mockClear();
  mockAuth.resetPasswordForEmail.mockClear();
};