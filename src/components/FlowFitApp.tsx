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
  const { userProfile, signOut, currentPhase, loading, fetchUserProfile, supabase, currentWorkout, userPlan, updateUserProfile, initiateCheckoutSession } = useFlowFit();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'history' | 'calendar' | 'settings' | 'feedback' | 'login' | 'register' | 'forgot-password' | 'onboarding' | 'workout-active' | 'subscription-required'>(
    'login'
  );
  const [session, setSession] = useState<Session | null>(null);

  // Onboarding specific states
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingUserData, setOnboardingUserData] = useState<UserData>({
    name: '',
    goal: '',
    equipment: '',
    cycle_regular: '',
    last_period: '',
    currentPhase: null,
    cycleDay: 0,
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
        } else { // User is not an active subscriber (either no plan, or plan is inactive)
          setCurrentScreen('subscription-required'); // Redirect to subscription notice page
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
        setCurrentScreen('subscription-required'); // Redirect to subscription notice page
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

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow">
        {renderScreen()}
      </main>

      {session && userProfile?.onboarding_completed && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-around max-w-md mx-auto">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="flex flex-col items-center gap-1"
            >
              <Home className={`w-6 h-6 ${currentScreen === 'home' ? 'text-rose-500' : 'text-gray-400'}`} />
              <span className={`text-xs ${currentScreen === 'home' ? 'font-medium text-rose-500' : 'text-gray-400'}`}>Início</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('calendar')}
              className="flex flex-col items-center gap-1"
            >
              <Calendar className={`w-6 h-6 ${currentScreen === 'calendar' ? 'text-rose-500' : 'text-gray-400'}`} />
              <span className={`text-xs ${currentScreen === 'calendar' ? 'font-medium text-rose-500' : 'text-gray-400'}`}>Ciclo</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('history')}
              className="flex flex-col items-center gap-1"
            >
              <BarChart3 className={`w-6 h-6 ${currentScreen === 'history' ? 'text-rose-500' : 'text-gray-400'}`} />
              <span className={`text-xs ${currentScreen === 'history' ? 'font-medium text-rose-500' : 'text-gray-400'}`}>Progresso</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1"
            >
              <Settings className={`w-6 h-6 ${currentScreen === 'settings' ? 'text-rose-500' : 'text-gray-400'}`} />
              <span className={`text-xs ${currentScreen === 'settings' ? 'font-medium text-rose-500' : 'text-gray-400'}`}>Ajustes</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default FlowFitApp;
