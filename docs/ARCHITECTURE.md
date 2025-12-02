# Architecture Overview

The FlowFit application is built as a modern full-stack web application leveraging the Next.js framework. It follows a client-server architecture with a clear separation of concerns, utilizing various cloud services for robust and scalable functionality.

## 1. Overall Architecture

The application primarily operates as a Next.js application, which allows for both server-side rendering (SSR), static site generation (SSG), and API routes within a single codebase.

```
+-------------------+      +-----------------------+      +------------------+
|                   |      |                       |      |                  |
|   Client (Browser)| <--> |   Next.js Application | <--> |   Cloud Services |
|                   |      | (Frontend & API Routes) |      |                  |
+-------------------+      +-----------------------+      +------------------+
                                   |                       |
                                   |                       |
                                   |                       |
                                   V                       V
                           +--------------+        +---------------+
                           |    Supabase  |        |    Stripe     |
                           | (DB & Auth)  |        | (Payments)    |
                           +--------------+        +---------------+
                                   |
                                   |
                                   V
                           +--------------+
                           |    Firebase  |
                           | (Optional/Hybrid)|
                           +--------------+
```

## 2. Frontend

*   **Framework:** Built with **React** and orchestrated by **Next.js**. This provides a component-based UI, efficient updates, and powerful routing capabilities.
*   **Language:** Developed entirely in **TypeScript** for type safety and improved developer experience.
*   **Styling:** Utilizes **Tailwind CSS** for a utility-first approach to styling, enabling rapid UI development and consistent design. PostCSS and Autoprefixer are used for CSS processing.
*   **Components:** The `src/components` directory houses reusable UI components, including various screens for authentication, workout management, and user settings.
*   **Context Management:** React Context (`src/context`) is used for global state management, such as user session data or workout plans.
*   **Custom Hooks:** `src/hooks` contains custom React hooks to encapsulate reusable logic, improving code organization and readability.

## 3. Backend (Next.js API Routes)

Next.js API routes (`app/api`) serve as the application's backend layer, handling server-side logic and interactions with external services. This includes:

*   **Stripe Integration:** Securely processing payments, creating checkout sessions, managing subscriptions, and handling webhooks.
*   **Supabase Interaction:** Server-side operations that might require elevated privileges or complex data manipulation, abstracting direct client-to-Supabase interactions for certain scenarios.

## 4. Database & Authentication (Supabase)

*   **Database:** **Supabase** provides a PostgreSQL database, offering robust data storage and querying capabilities.
*   **Authentication:** User authentication (sign-up, login, password reset) is managed through **Supabase Auth**, integrating seamlessly with the application's user flows.
*   **Client Integration:** The `@supabase/supabase-js` client library is used for interacting with Supabase services from both the frontend and API routes.

## 5. Payment Gateway (Stripe)

*   **Subscription Management:** **Stripe** is used for handling all aspects of subscriptions, including recurring billing, plan management, and customer portals.
*   **Secure Transactions:** All payment-related operations are securely managed through Stripe's API, ensuring PCI compliance.
*   **Webhooks:** Stripe webhooks are crucial for asynchronous event handling, such as confirming successful payments or subscription changes, which are processed by the Next.js API routes.

## 6. Potential Hybrid Backend Services (Firebase)

The presence of `firebase` in `package.json` suggests a potential hybrid approach or future integration with Firebase services. While Supabase handles core database and authentication, Firebase could be used for:

*   **Realtime Features:** Firestore for real-time data synchronization.
*   **Cloud Functions:** Serverless functions for specific backend tasks.
*   **Analytics:** Firebase Analytics for user behavior insights.
*   **Push Notifications:** Firebase Cloud Messaging for sending notifications to users.

Further investigation would be needed to determine its exact current role, but it indicates flexibility in backend service choices.

## 7. Data Flow

1.  **User Interaction:** User interacts with the Next.js frontend (e.g., logs in, starts a workout, subscribes).
2.  **Client-Side Logic:** Frontend components manage UI state and trigger actions.
3.  **API Calls:** For sensitive operations (e.g., payment, authentication), the frontend makes calls to Next.js API routes. For direct data interaction (e.g., fetching workout data), the frontend might directly interact with Supabase client (with appropriate RLS).
4.  **Next.js API Routes:** Process requests, interact with Stripe (for payments) or Supabase (for complex server-side data operations), and return responses to the client.
5.  **Supabase:** Stores and manages all application data (user profiles, workouts, subscription status) and handles user authentication.
6.  **Stripe:** Manages subscription plans, payment processing, and customer billing information, notifying the application via webhooks.