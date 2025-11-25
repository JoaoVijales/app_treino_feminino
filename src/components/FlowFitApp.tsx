"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Droplet, Zap, Sun, Moon, Home, Calendar, BarChart3, Settings } from 'lucide-react'; // Import missing icons
import FeedbackScreen from './FeedbackScreen';
import CalendarScreen from './CalendarScreen';
import HistoryScreen from './HistoryScreen';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import OnboardingScreen from './OnboardingScreen';
import WorkoutActiveScreen from './WorkoutActiveScreen';
import { useFlowFit } from '../context/FlowFitContext';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { OnboardingScreenConfig, UserData, TodayWorkout } from '../types';
import { UserProfile, UserPlan } from '../types/supabase'; // Import UserPlan
import SubscriptionRequiredScreen from './SubscriptionRequiredScreen'; // Import the new screen

const onboardingScreensConfig: OnboardingScreenConfig[] = [
  {
    title: "Qual seu nome?",
    field: "name",
    type: "text",
    placeholder: "Seu nome",
  },
  {
    title: "Qual seu objetivo principal?",
    subtitle: "Isso nos ajudará a personalizar seu treino.",
    field: "goal",
    type: "options",
    options: [
      { value: "perder-peso", label: "Perder Peso", icon: "🔥" },
      { value: "ganhar-massa", label: "Ganhar Massa Muscular", icon: "💪" },
      { value: "condicionamento", label: "Condicionamento Físico", icon: "🏃‍♀️" },
    ],
  },
  {
    title: "Quais equipamentos você tem acesso?",
    subtitle: "Selecione todos que se aplicam.",
    field: "equipment",
    type: "multiple",
    options: [
      { value: "peso-corporal", label: "Apenas Peso Corporal", icon: "🤸‍♀️" },
      { value: "halteres", label: "Halteres", icon: "🏋️‍♀️" },
      { value: "elasticos", label: "Elásticos de Resistência", icon: "🪢" },
    ],
  },
  {
    title: "Seu ciclo menstrual é regular?",
    field: "cycle_regular",
    type: "options",
    options: [
      { value: "yes", label: "Sim, é regular", icon: "✅" },
      { value: "no", label: "Não, é irregular", icon: "❌" },
    ],
  },
  {
    title: "Quando foi sua última menstruação?",
    field: "last_period",
    type: "date",
  },
];


const FlowFitApp: React.FC = () => {
  const { userProfile, signOut, currentPhase, loading, fetchUserProfile, supabase, currentWorkout, userPlan, updateUserProfile, initiateCheckoutSession } = useFlowFit(); // Access userPlan and updateUserProfile
  const [currentScreen, setCurrentScreen] = useState<'home' | 'history' | 'calendar' | 'settings' | 'feedback' | 'login' | 'register' | 'forgot-password' | 'onboarding' | 'workout-active' | 'subscription-required'>(
    'login'
  );
  const [showMenu, setShowMenu] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Onboarding specific states
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingUserData, setOnboardingUserData] = useState<UserData>({
    name: '',
    goal: '',
    equipment: '',
    cycle_regular: '', // Updated to snake_case
    last_period: '',    // Updated to snake_case
    currentPhase: null, // Initialize
    cycleDay: 0, // Initialize
  });

  // WorkoutActiveScreen specific states
  const [workoutCurrentExercise, setWorkoutCurrentExercise] = useState<number>(0);
  const [workoutProgress, setWorkoutProgress] = useState<number>(0);
  const [workoutTimer, setWorkoutTimer] = useState<number>(0);
  const [workoutIsPaused, setWorkoutIsPaused] = useState<boolean>(false);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
    });
  }, [supabase]);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    } else {
      setCurrentScreen('login');
    }
  }, [session, fetchUserProfile]);

  useEffect(() => {
    if (!loading) { // Once loading is finished
      if (!session) {
        setCurrentScreen('login');
      } else if (!userProfile) {
        // Authenticated but no user profile found/created.
        // This is a critical state for a user that is logged in.
        // It implies they need to complete onboarding to create their profile.
        setCurrentScreen('onboarding');
      } else if (!userProfile.onboarding_completed) {
        setCurrentScreen('onboarding');
      } else {
        // Check subscription status
        const isActiveSubscriber = userPlan && (userPlan.status === 'active' || userPlan.status === 'trialing');
        if (isActiveSubscriber) {
          setCurrentScreen('home');
        } else if (userPlan) {
          setCurrentScreen('subscription-required');
        } else { // No active plan and no userPlan object (never subscribed, but completed onboarding)
          // Initiate checkout for users who completed onboarding before subscription was implemented
          // This ensures they are directed to subscribe if they haven't already.
          if (userProfile?.user_id) { // Ensure userProfile and its ID are available
            initiateCheckoutSession(userProfile.user_id);
          } else {
            console.error("User profile or user ID not available to initiate checkout after onboarding.");
            setCurrentScreen('home'); // Fallback
          }
        }
      }
    }
  }, [loading, session, userProfile, userPlan]);

  const handleOnboardingNext = useCallback(async () => {
    const currentScreenConfig = onboardingScreensConfig[onboardingStep];
    if (userProfile && currentScreenConfig) {
      // Logic to save data to userProfile and update Supabase
      const updatedProfile: Partial<UserProfile> = {
        [currentScreenConfig.field]: onboardingUserData[currentScreenConfig.field],
      };
      // For simplicity, we'll save step by step. A bulk save could be implemented later.
      await updateUserProfile(userProfile.user_id, updatedProfile);
    }

    if (onboardingStep < onboardingScreensConfig.length - 1) {
      setOnboardingStep((prev) => prev + 1);
    } else {
      // Last step, mark onboarding as complete
      if (userProfile?.user_id) {
        await updateUserProfile(userProfile.user_id, { onboarding_completed: true });
        fetchUserProfile(); // Re-fetch profile to update onboarding_completed status

        // Initiate Stripe Checkout
        const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
        if (!priceId) {
          console.error('Stripe Price ID is not configured. Falling back to home screen.');
          setCurrentScreen('home'); // Fallback to home if priceId is missing
          return;
        }

        try {
          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
            body: JSON.stringify({ userId: userProfile.user_id, priceId }),
          });

          const { sessionId, url, error: checkoutError } = await response.json();
          if (checkoutError) {
            throw new Error(checkoutError);
          }
          if (url) {
            window.location.href = url; // Redirect to Stripe Checkout
          } else {
            console.error('Stripe checkout URL not received. Falling back to home screen.');
            setCurrentScreen('home'); // Fallback
          }
        } catch (err: any) {
          console.error('Failed to initiate checkout after onboarding:', err.message);
          setCurrentScreen('home'); // Fallback
        }
      }
    }
  }, [onboardingStep, onboardingUserData, userProfile, fetchUserProfile, updateUserProfile]);

  const handleOnboardingBack = useCallback(() => {
    if (onboardingStep > 0) {
      setOnboardingStep((prev) => prev - 1);
    }
  }, [onboardingStep]);


  const renderScreen = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      );
    }

    if (!session) {
      switch (currentScreen) {
        case 'register':
          return <RegisterScreen onLogin={() => setCurrentScreen('login')} />;
        case 'forgot-password':
          return <ForgotPasswordScreen onLogin={() => setCurrentScreen('login')} />;
        default:
          return <LoginScreen onRegister={() => setCurrentScreen('register')} onForgotPassword={() => setCurrentScreen('forgot-password')} />;
      }
    }

    if (!userProfile?.onboarding_completed && currentScreen !== 'onboarding') {
      return (
        <OnboardingScreen
          onboardingScreens={onboardingScreensConfig}
          onboardingStep={onboardingStep}
          setOnboardingStep={setOnboardingStep}
          userData={onboardingUserData}
          setUserData={setOnboardingUserData}
          handleOnboardingNext={handleOnboardingNext}
          handleOnboardingBack={handleOnboardingBack}
          onComplete={() => {
            fetchUserProfile();
            setCurrentScreen('home');
          }}
          setCurrentScreen={setCurrentScreen}
        />
      );
    }

    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
      case 'history':
        return <HistoryScreen onBack={() => setCurrentScreen('home')} />;
      case 'calendar':
        return <CalendarScreen onClose={() => setCurrentScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('home')} />;
      case 'feedback':
        return <FeedbackScreen onClose={() => setCurrentScreen('home')} />;
      case 'onboarding':
        return (
            <OnboardingScreen
            onboardingScreens={onboardingScreensConfig}
            onboardingStep={onboardingStep}
            setOnboardingStep={setOnboardingStep}
            userData={onboardingUserData}
            setUserData={setOnboardingUserData}
            handleOnboardingNext={handleOnboardingNext}
            handleOnboardingBack={handleOnboardingBack}
            onComplete={() => {
              fetchUserProfile();
              setCurrentScreen('home');
            }}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'subscription-required':
        return <SubscriptionRequiredScreen onNavigate={setCurrentScreen} />;
      case 'workout-active':
        return (
          <WorkoutActiveScreen
            todayWorkout={currentWorkout}
            currentExercise={workoutCurrentExercise}
            setCurrentExercise={setWorkoutCurrentExercise}
            progress={workoutProgress}
            timer={workoutTimer}
            isPaused={workoutIsPaused}
            setIsPaused={setWorkoutIsPaused}
            onFinish={() => setCurrentScreen('feedback')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
      default:
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
    }
  };

  const cyclePhaseIcon = () => {
    switch (currentPhase) {
      case 'menstrual':
        return <Droplet size={20} color="#EF4444" />; // Red
      case 'follicular':
        return <Zap size={20} color="#3B82F6" />; // Blue
      case 'ovulatory':
        return <Sun size={20} color="#F59E0B" />; // Yellow/Orange
      case 'luteal':
        return <Moon size={20} color="#8B5CF6" />; // Purple
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {session && userProfile?.onboarding_completed && (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">FlowFit</h1>
          <div className="flex items-center space-x-4">
            {currentPhase && (
              <div className="flex items-center">
                {cyclePhaseIcon()}
                <span className="ml-2 capitalize">{currentPhase}</span>
              </div>
            )}
            <button onClick={() => setShowMenu(!showMenu)} className="focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
          {showMenu && (
            <div className="absolute top-16 right-4 bg-white text-gray-800 shadow-lg rounded-md p-4 z-10">
              <button onClick={() => { setCurrentScreen('home'); setShowMenu(false); }} className="block w-full text-left py-2 hover:bg-gray-100">Home</button>
              <button onClick={() => { setCurrentScreen('history'); setShowMenu(false); }} className="block w-full text-left py-2 hover:bg-gray-100">Histórico</button>
              <button onClick={() => { setCurrentScreen('calendar'); setShowMenu(false); }} className="block w-full text-left py-2 hover:bg-gray-100">Calendário</button>
              <button onClick={() => { setCurrentScreen('settings'); setShowMenu(false); }} className="block w-full text-left py-2 hover:bg-gray-100">Configurações</button>
              <button onClick={() => { signOut(); setShowMenu(false); }} className="block w-full text-left py-2 hover:bg-gray-100 text-red-500">Sair</button>
            </div>
          )}
        </header>
      )}

      <main className="flex-grow">
        {renderScreen()}
      </main>

      {session && userProfile?.onboarding_completed && (
        <footer className="bg-gray-800 text-white p-4 flex justify-around items-center">
          <button onClick={() => setCurrentScreen('home')} className="flex flex-col items-center">
            <Home size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setCurrentScreen('history')} className="flex flex-col items-center">
            <BarChart3 size={24} />
            <span className="text-xs">Histórico</span>
          </button>
          <button onClick={() => setCurrentScreen('calendar')} className="flex flex-col items-center">
            <Calendar size={24} />
            <span className="text-xs">Calendário</span>
          </button>
          <button onClick={() => setCurrentScreen('settings')} className="flex flex-col items-center">
            <Settings size={24} />
            <span className="text-xs">Configurações</span>
          </button>
        </footer>
      )}
    </div>
  );
};

export default FlowFitApp;
