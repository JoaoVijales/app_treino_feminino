// __mocks__/stripe.ts
import { jest } from '@jest/globals';

const mockCheckoutSessionsCreate = jest.fn((params) =>
  Promise.resolve({
    id: 'mock_session_id',
    url: 'https://mock-checkout-url.com',
    ...params,
  })
);

const mockBillingPortalSessionsCreate = jest.fn((params) =>
  Promise.resolve({
    id: 'mock_portal_session_id',
    url: 'https://mock-portal-url.com',
    ...params,
  })
);

const mockWebhooksConstructEvent = jest.fn((payload, signature, secret) => {
  // Simulate successful construction by returning a mock event object
  return {
    id: 'evt_mock',
    object: 'event',
    type: 'checkout.session.completed', // Default mock event type
    data: {
      object: {
        id: 'cs_mock_checkout_session',
        customer: 'cus_mock_customer',
        subscription: 'sub_mock_subscription',
        client_reference_id: 'mock-user-id',
        metadata: {
          userId: 'mock-user-id',
        },
      },
    },
  };
});

// Mock the Stripe object itself
const mockStripe = jest.fn((apiKey) => ({
  checkout: {
    sessions: {
      create: mockCheckoutSessionsCreate,
      retrieve: jest.fn((id) => Promise.resolve({ id, status: 'complete', customer: 'cus_mock_customer' })),
    },
  },
  billingPortal: {
    sessions: {
      create: mockBillingPortalSessionsCreate,
    },
  },
  webhooks: {
    constructEvent: mockWebhooksConstructEvent,
  },
  customers: {
    retrieve: jest.fn((id) => Promise.resolve({ id, email: 'mock_customer@example.com' })),
  },
  subscriptions: {
    retrieve: jest.fn((id) => Promise.resolve({ id, status: 'active', customer: 'cus_mock_customer' })),
  },
  // Add other Stripe services and methods as needed
}));

// We need to export a default function because the stripe package is typically imported
// like `import Stripe from 'stripe';` and then initialized `new Stripe(apiKey)`.
// Our mock needs to replicate this behavior.
module.exports = mockStripe;

// Export specific mocks so tests can reset them or assert against them
export {
  mockCheckoutSessionsCreate,
  mockBillingPortalSessionsCreate,
  mockWebhooksConstructEvent,
};
