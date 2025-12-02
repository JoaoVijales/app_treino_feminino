// __mocks__/@supabase/supabase-js.ts
import { jest } from '@jest/globals';

const mockSelect = jest.fn(() => ({
  eq: jest.fn(() => ({
    single: jest.fn(() => ({ data: {}, error: null })),
    maybeSingle: jest.fn(() => ({ data: {}, error: null })),
    data: [], // Default empty data
    error: null,
  })),
  returns: jest.fn(() => ({ data: [], error: null })),
  order: jest.fn(() => ({ data: [], error: null })),
  limit: jest.fn(() => ({ data: [], error: null })),
  // Add other methods as needed, e.g., gt, lt, in, etc.
}));

const mockFrom = jest.fn(() => ({
  select: mockSelect,
  insert: jest.fn(() => ({ data: {}, error: null })),
  update: jest.fn(() => ({ data: {}, error: null })),
  delete: jest.fn(() => ({ data: {}, error: null })),
  // Add other table operations as needed
}));

const mockSignInWithPassword = jest.fn(() => ({ data: { user: { id: 'mock-user-id', email: 'test@example.com' }, session: { access_token: 'mock-token' } }, error: null }));
const mockSignUp = jest.fn(() => ({ data: { user: null, session: null }, error: null }));
const mockSignOut = jest.fn(() => ({ error: null }));
const mockGetUser = jest.fn(() => ({ data: { user: { id: 'mock-user-id', email: 'test@example.com' } }, error: null }));
const mockOnAuthStateChange = jest.fn(() => {
  const unsubscribe = jest.fn();
  const data = { subscription: { unsubscribe } };
  return { data, error: null };
});
const mockUpdateUser = jest.fn(() => ({ data: { user: { id: 'mock-user-id', email: 'test@example.com' } }, error: null }));
const mockResetPasswordForEmail = jest.fn(() => ({ error: null }));

const mockAuth = jest.fn(() => ({
  signInWithPassword: mockSignInWithPassword,
  signUp: mockSignUp,
  signOut: mockSignOut,
  getUser: mockGetUser,
  onAuthStateChange: mockOnAuthStateChange,
  updateUser: mockUpdateUser,
  resetPasswordForEmail: mockResetPasswordForEmail,
  getSession: jest.fn(() => ({ data: { session: { access_token: 'mock-token' } }, error: null })),
  setSession: jest.fn(() => ({ data: { session: { access_token: 'mock-token' } }, error: null })),
  // Add other auth methods as needed
}));

const mockStorage = jest.fn(() => ({
  from: jest.fn(() => ({
    upload: jest.fn(() => ({ data: { path: 'mock/path' }, error: null })),
    download: jest.fn(() => ({ data: new Blob(), error: null })),
    getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://mock.url/path' }, error: null })),
  })),
}));

export const createClient = jest.fn(() => ({
  from: mockFrom,
  auth: mockAuth(), // Call auth() to get the mock object
  storage: mockStorage(), // Call storage() to get the mock object
  // Add other top-level Supabase client methods as needed
}));

// Export specific mocks so tests can reset them or assert against them
export {
  mockFrom,
  mockSelect,
  mockAuth,
  mockSignInWithPassword,
  mockSignUp,
  mockSignOut,
  mockGetUser,
  mockOnAuthStateChange,
  mockUpdateUser,
  mockResetPasswordForEmail,
  mockStorage,
};
