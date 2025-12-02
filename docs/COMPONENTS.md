# Frontend Components Overview

This document provides a high-level overview of the main React components used in the FlowFit application, located in the `src/components` directory. These components are the building blocks of the user interface, each responsible for a specific part of the application's functionality or a particular screen.

## Core Screens and Functionalities

### `AuthScreen.tsx`
*   **Description:** A wrapper or orchestrator component for authentication-related flows. It might handle displaying `LoginScreen`, `RegisterScreen`, or `ForgotPasswordScreen` based on the application's authentication state.

### `CalendarScreen.tsx`
*   **Description:** Displays a calendar interface, likely for users to view, schedule, or log their workout sessions and track menstrual cycle dates. Integrates with `react-calendar` and backend data.

### `FeedbackScreen.tsx`
*   **Description:** Provides an interface for users to submit feedback, report issues, or provide ratings within the application.

### `FlowFitApp.tsx`
*   **Description:** The main application wrapper component, likely responsible for setting up global contexts, routing, and overall application layout. It acts as the top-level orchestrator for different parts of the app.

### `ForgotPasswordScreen.tsx`
*   **Description:** Handles the user interface and logic for password recovery, allowing users to request a password reset for their account.

### `HistoryScreen.tsx`
*   **Description:** Displays a historical overview of the user's activities, such as past workout sessions, progress over time, or cycle logs.

### `HomeScreen.tsx`
*   **Description:** The primary landing screen after a user logs in. It typically provides an overview of the user's current status, upcoming workouts, quick links, or personalized content.

### `LoginScreen.tsx`
*   **Description:** Provides the user interface for existing users to log into their FlowFit account.

### `OnboardingScreen.tsx`
*   **Description:** Guides new users through an initial setup process, collecting necessary information like fitness goals, equipment availability, and menstrual cycle details to personalize their experience.

### `RegisterScreen.tsx`
*   **Description:** Provides the user interface for new users to create a FlowFit account.

### `SettingsScreen.tsx`
*   **Description:** Allows users to manage their profile information, application preferences, subscription details, and other configurable options.

### `SubscriptionRequiredScreen.tsx`
*   **Description:** A screen displayed to users when they try to access premium features or content for which they do not have an active subscription. It typically provides options to subscribe.

### `WorkoutActiveScreen.tsx`
*   **Description:** The screen displayed when a user is actively performing a workout session. It includes timers, exercise instructions, progress tracking, and logging capabilities.
