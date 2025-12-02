import '@testing-library/jest-dom/extend-expect';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// You can add global mocks or setup here if needed
// For example, to mock a specific module or global function
// jest.mock('next/router', () => require('next-router-mock'));
