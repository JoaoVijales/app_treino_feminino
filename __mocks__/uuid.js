'use strict';

// __mocks__/uuid.js
// This file is a manual mock for the 'uuid' package.
// Jest will automatically use this mock when 'uuid' is imported in tests.

module.exports = {
  v4: jest.fn(() => 'mock-uuid-v4'),
};
