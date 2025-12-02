# FlowFit Next.js Application

A modern fitness application built with Next.js, React, and TypeScript, leveraging Supabase for backend services (authentication, database) and Stripe for subscription management. It features user authentication, personalized workout tracking, a calendar to manage fitness schedules, and tailored content, primarily focusing on women's fitness.

## Features

*   **User Authentication:** Secure sign-up, login, and password recovery powered by Supabase Auth.
*   **Personalized Workout Tracking:** Track and manage custom workout routines and progress.
*   **Subscription Management:** Handle premium content and features through Stripe-powered subscriptions.
*   **Fitness Calendar:** Schedule and visualize your workout plans.
*   **User Profiles & Settings:** Manage personal information and application preferences.
*   **Responsive Design:** Optimized for various devices, from mobile to desktop.

## Technologies Used

*   **Framework:** Next.js 16.0.3 (React 19.2.0)
*   **Language:** TypeScript 5
*   **Styling:** Tailwind CSS, PostCSS, Autoprefixer
*   **Backend Services:** Supabase (Auth, Database)
*   **Payment Processing:** Stripe
*   **Icons:** Lucide React
*   **Date Management:** React Calendar
*   **Testing:** Jest, React Testing Library
*   **Environment Variables:** Dotenv
*   **Linting:** ESLint
*   **Build Tool:** Web-vitals

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/flowfit-next.git
    cd flowfit-next
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables. Obtain these from your Supabase and Stripe dashboards.

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
# Optionally, if Firebase is used:
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### Running the Application

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
.
├── app/                  # Next.js App Router root
│   ├── api/              # API routes (e.g., Stripe webhooks, checkout sessions)
│   ├── cancel/           # Page for cancelled payments
│   ├── success/          # Page for successful payments
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx        # Root layout for the application
│   └── page.tsx          # Main entry page
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable React components (Auth, Home, Workout, etc.)
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions (API calls, Supabase client, etc.)
├── reference_files/      # Contains SQL schema, design documents, and examples
├── jest.config.js        # Jest test configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── ...                   # Other configuration files
```

## API Endpoints

The application exposes several API endpoints under `app/api` for server-side operations:

*   `/api/create-checkout-session`: Handles the creation of new Stripe checkout sessions for subscriptions.
*   `/api/create-customer-portal-session`: Manages redirecting users to the Stripe customer portal for subscription management.
*   `/api/stripe-webhook`: Endpoint for Stripe webhooks to handle asynchronous events (e.g., successful payments, subscription changes).

## Testing

To run the unit and integration tests:

```bash
npm test
# or
yarn test
```