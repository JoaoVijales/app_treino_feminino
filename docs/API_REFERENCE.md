# API Reference

This document provides a reference for the API endpoints exposed by the FlowFit Next.js application. These endpoints are primarily used for handling integrations with third-party services like Stripe and managing server-side logic that requires elevated privileges or direct interaction with the backend.

All API routes are located under the `app/api` directory and are handled by Next.js API Routes.

## 1. `POST /api/create-checkout-session`

### Description

Creates a new Stripe Checkout Session for a user to initiate a subscription to a premium plan. This endpoint performs user authentication, authorizes the request, and generates a secure URL for the Stripe-hosted checkout page.

### Authentication

Requires a `Bearer` token in the `Authorization` header. This token is used to authenticate the user against Supabase.

### Request

*   **Method:** `POST`
*   **Headers:**
    *   `Authorization`: `Bearer <supabase_auth_token>`
*   **Body (JSON):**
    ```json
    {
      "userId": "string",  // The Supabase user ID of the authenticated user.
      "priceId": "string"  // The Stripe Price ID of the subscription plan.
    }
    ```

### Responses

*   **`200 OK`**
    ```json
    {
      "sessionId": "cs_test_...",      // The ID of the created Stripe Checkout Session.
      "url": "https://checkout.stripe.com/..." // The URL to redirect the user for checkout.
    }
    ```
*   **`400 Bad Request`**
    ```json
    {
      "error": "Missing userId or priceId"
    }
    ```
*   **`401 Unauthorized`**
    ```json
    {
      "error": "Authorization header missing or malformed"
    }
    // or
    {
      "error": "Authentication failed"
    }
    ```
*   **`403 Forbidden`**
    ```json
    {
      "error": "Unauthorized: userId mismatch" // If the provided userId does not match the authenticated user.
    }
    ```
*   **`500 Internal Server Error`**
    ```json
    {
      "error": "Error message" // Generic error during session creation.
    }
    ```

## 2. `POST /api/create-customer-portal-session`

### Description

Generates a URL for the Stripe Customer Portal, allowing authenticated users to manage their billing information, subscriptions, and invoices directly through Stripe's hosted interface. The request is authorized to ensure the `stripeCustomerId` belongs to the authenticated user.

### Authentication

Requires a `Bearer` token in the `Authorization` header. This token is used to authenticate the user against Supabase.

### Request

*   **Method:** `POST`
*   **Headers:**
    *   `Authorization`: `Bearer <supabase_auth_token>`
*   **Body (JSON):**
    ```json
    {
      "stripeCustomerId": "string" // The Stripe Customer ID associated with the user.
    }
    ```

### Responses

*   **`200 OK`**
    ```json
    {
      "url": "https://billing.stripe.com/p/..." // The URL to redirect the user to the Stripe Customer Portal.
    }
    ```
*   **`400 Bad Request`**
    ```json
    {
      "error": "Missing Stripe customer ID"
    }
    ```
*   **`401 Unauthorized`**
    ```json
    {
      "error": "Authorization header missing or malformed"
    }
    // or
    {
      "error": "Authentication failed"
    }
    ```
*   **`403 Forbidden`**
    ```json
    {
      "error": "Unauthorized access to customer ID" // If the provided stripeCustomerId does not belong to the authenticated user.
    }
    ```
*   **`500 Internal Server Error`**
    ```json
    {
      "error": "Error message" // Generic error during session creation.
    }
    ```

## 3. `POST /api/stripe-webhook`

### Description

This endpoint serves as the receiver for webhook events from Stripe. It is crucial for maintaining synchronization between Stripe and the application's database regarding subscription statuses, payments, and customer information. It includes signature verification for security and idempotency checks to prevent duplicate processing.

### Authentication

This endpoint relies on Stripe's webhook signature verification using the `STRIPE_WEBHOOK_SECRET` environment variable, rather than bearer token authentication.

### Request

*   **Method:** `POST`
*   **Headers:**
    *   `Stripe-Signature`: Contains the signature for verifying the authenticity of the webhook event.
*   **Body:** Raw JSON payload of the Stripe event.

### Responses

*   **`200 OK`**
    ```json
    {
      "received": true
    }
    ```
    Indicates that the webhook event was successfully received and processed (or intentionally ignored due to idempotency or an unhandled event type).

*   **`400 Bad Request`**
    ```json
    {
      "error": "Webhook Error: [message]" // E.g., "Missing stripe-signature header", "invalid signature"
    }
    ```
    Returned if the `Stripe-Signature` header is missing or if the webhook signature verification fails.

*   **`500 Internal Server Error`**
    ```json
    {
      "error": "Webhook secret not configured"
    }
    // or
    {
      "error": "Internal webhook error"
    }
    ```
    Returned if the `STRIPE_WEBHOOK_SECRET` environment variable is not set, or if an unhandled error occurs during the processing of the webhook event.

### Handled Event Types

The webhook processes the following Stripe event types, updating the Supabase `user_plans` table and other related entities:

*   **`checkout.session.completed`**:
    *   Triggered upon successful completion of a Stripe Checkout Session.
    *   Extracts user, customer, subscription, product, and price IDs.
    *   Validates the user against `user_profiles` and handles cases where the user is not found (flagging for manual review).
    *   Upserts (inserts or updates) comprehensive subscription details into the `user_plans` table.

*   **`checkout.session.async_payment_succeeded` / `checkout.session.async_payment_failed`**:
    *   Handles the final outcome of asynchronous payments initiated via Checkout Sessions.

*   **`customer.subscription.created` / `updated` / `deleted`**:
    *   Fired when a customer's subscription changes state (created, updated, or canceled).
    *   Retrieves the associated Supabase user ID based on the Stripe Customer ID.
    *   Upserts the `user_plans` table with the latest subscription status, current billing period, and cancellation information.

*   **`invoice.payment_succeeded` / `invoice.payment_failed`**:
    *   Indicates the success or failure of an invoice payment. These events are logged and can be extended to trigger further application-specific actions (e.g., sending payment confirmation emails).

*   **`price.*` / `product.*`**:
    *   Events related to changes in Stripe's product or pricing catalog. These are currently logged but not processed further.

#### Idempotency

A basic idempotency mechanism is implemented using a `stripe_events` table in Supabase. This helps prevent the reprocessing of the same Stripe webhook event in case of retries, ensuring data consistency.
