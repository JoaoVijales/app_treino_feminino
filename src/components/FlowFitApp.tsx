import React, { useState, useEffect } from 'react';
import { Droplet, Zap, Sun, Moon } from 'lucide-react';
import FeedbackScreen from './FeedbackScreen';
import CalendarScreen from './CalendarScreen';
import OnboardingScreen from './OnboardingScreen';
import HomeScreen from './HomeScreen';
import WorkoutActiveScreen from './WorkoutActiveScreen';
import HistoryScreen from './HistoryScreen';
import SettingsScreen from './SettingsScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { UserData, CyclePhases, TodayWorkout, WeekProgressItem, OnboardingScreenConfig } from '../types';
import { FlowFitProvider, useFlowFit } from '../context/FlowFitContext';
import { updateUserProfile, addUserWorkoutSession } from '../utils/api';
import { supabase } from '../utils/supabaseClient'; // Import supabase
import { Session } from '@supabase/supabase-js';

const AppContent = () => {
  const { userData, todayWorkoutState, loading, setUserData, userProfile, session } = useFlowFit();
  const [currentScreen, setCurrentScreen] = useState('loading'); // Initial state set to loading
  const [onboardingStep, setOnboardingStep] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timer, setTimer] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [showEmailVerificationBanner, setShowEmailVerificationBanner] = useState(false);


  useEffect(() => {
    if (!loading) { // Once initial data loading from useFlowFit is complete
      if (session) {
        // If there's a session and userProfile is loaded, check onboarding status
        if (!session.user.email_confirmed_at) {
          setShowEmailVerificationBanner(true);
        } else {
          setShowEmailVerificationBanner(false);
        }

        if (userProfile && userProfile.onboarding_completed) {
          setCurrentScreen('home');
        } else {
          // If session exists but onboarding not complete, go to onboarding
          setCurrentScreen('onboarding');
        }
      } else {
        // No session, go to login
        setCurrentScreen('login');
      }
    }
  }, [session, loading, userProfile]);

  const handleResendVerificationEmail = async () => {
    if (session?.user?.email) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: session.user.email,
      });

      if (error) {
        alert(`Erro ao reenviar e-mail de verificação: ${error.message}`);
      } else {
        alert('E-mail de verificação reenviado! Por favor, verifique sua caixa de entrada.');
      }
    }
  };

  const cyclePhases: CyclePhases = {
    menstrual: { name: 'Menstrual', icon: Droplet, color: 'rose', emoji: '🩸' },
    follicular: { name: 'Folicular', icon: Zap, color: 'green', emoji: '⚡' },
    ovulatory: { name: 'Ovulatória', icon: Sun, color: 'amber', emoji: '☀️' },
    luteal: { name: 'Lútea', icon: Moon, color: 'purple', emoji: '🌙' }
  };


  const weekProgress: WeekProgressItem[] = [
    { day: 'Seg', completed: true, intensity: 8 },
    { day: 'Ter', completed: true, intensity: 7 },
    { day: 'Qua', completed: false, intensity: 0 },
    { day: 'Qui', completed: true, intensity: 9 },
    { day: 'Sex', completed: true, intensity: 6 },
    { day: 'Sáb', completed: false, intensity: 0 },
    { day: 'Dom', completed: false, intensity: 0 }
  ];

  const onboardingScreens: OnboardingScreenConfig[] = [
    {
      title: 'Bem-vinda ao FlowFit AI! 💪',
      subtitle: 'Treinos que se adaptam ao seu ciclo',
      field: 'name',
      type: 'text',
      placeholder: 'Como você se chama?',
      question: 'Primeiro, vamos nos conhecer:'
    },
    {
      title: 'Qual seu objetivo principal?',
      field: 'goal',
      type: 'options',
      options: [
        { value: 'forca', label: 'Ganhar força', icon: '💪' },
        { value: 'cardio', label: 'Melhorar condicionamento', icon: '❤️' },
        { value: 'flexibilidade', label: 'Aumentar flexibilidade', icon: '🧘‍♀️' },
        { value: 'geral', label: 'Bem-estar geral', icon: '✨' }
      ]
    },
    {
      title: 'Quais equipamentos você tem?',
      field: 'equipment',
      type: 'multiple',
      options: [
        { value: 'none', label: 'Só peso corporal', icon: '🏃‍♀️' },
        // { value: 'dumbbell', label: 'Halteres', icon: '🏋️‍♀️' },
        { value: 'elastic', label: 'Faixas elásticas', icon: '🎗️' },
        { value: 'dumbbell', label: 'Academia completa', icon: '🏢' }
      ]
    },
    {
      title: 'Seu ciclo é regular?',
      subtitle: 'Isso nos ajuda a fazer previsões mais precisas',
      field: 'cycleRegular',
      type: 'options',
      options: [
        { value: 'sim', label: 'Sim, geralmente regular', icon: '✅' },
        { value: 'irregular', label: 'Irregular', icon: '🔄' },
        { value: 'nao-sei', label: 'Não tenho certeza', icon: '🤔' }
      ]
    },
    {
      title: 'Quando foi sua última menstruação?',
      subtitle: 'Usamos isso para identificar sua fase atual',
      field: 'lastPeriod',
      type: 'date',
      placeholder: 'DD/MM/AAAA'
    }
  ];

  const handleOnboardingNext = async () => {
    if (onboardingStep < onboardingScreens.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      if (session?.user?.id) {
        const profileUpdateData = {
          name: userData.name,
          goal: userData.goal,
          equipment: userData.equipment, // Pass the array directly as Supabase expects TEXT[]
          cycle_regular: userData.cycleRegular,
          last_period: userData.lastPeriod,
          onboarding_completed: true,
        };
        await updateUserProfile(session.user.id, profileUpdateData);
        setCurrentScreen('home');
      } else {
        console.error("User not authenticated during onboarding completion.");
        setCurrentScreen('login'); // Fallback to login if session somehow lost
      }
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const startWorkout = () => {
    setCurrentScreen('workout-active');
    setCurrentExercise(0);
    //console.log(currentExercise)
  };

  

  if (loading || currentScreen === 'loading') { // Show loading until auth state and user profile are determined
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div>
      {showEmailVerificationBanner && (
        <div className="bg-yellow-400 text-white p-3 text-center text-sm flex items-center justify-between">
          <span>Por favor, verifique seu e-mail para confirmar sua conta.</span>
          <button onClick={handleResendVerificationEmail} className="underline font-bold ml-2">Reenviar</button>
        </div>
      )}

      {currentScreen === 'login' && (
        <LoginScreen setCurrentScreen={setCurrentScreen} />
      )}
      {currentScreen === 'register' && (
        <RegisterScreen setCurrentScreen={setCurrentScreen} />
      )}
      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen setCurrentScreen={setCurrentScreen} />
      )}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen
          setCurrentScreen={setCurrentScreen}
          userData={userData}
          setUserData={setUserData}
          onboardingStep={onboardingStep}
          setOnboardingStep={setOnboardingStep}
          handleOnboardingNext={handleOnboardingNext}
          handleOnboardingBack={handleOnboardingBack}
          onboardingScreens={onboardingScreens}
        />
      )}
      {currentScreen === 'home' && (
        <HomeScreen
          setCurrentScreen={setCurrentScreen}
          startWorkout={startWorkout}
        />
      )}
      {currentScreen === 'workout-active' && (
        <WorkoutActiveScreen
          setCurrentScreen={setCurrentScreen}
          setCurrentExercise={setCurrentExercise}
          currentExercise={currentExercise}
          todayWorkout={todayWorkoutState}
          progress={todayWorkoutState ? ( (currentExercise + 1) / todayWorkoutState.exercises.length) * 100 : 0}
          timer={timer}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
        />
      )}
      {currentScreen === 'feedback' && <FeedbackScreen setCurrentScreen={setCurrentScreen} />}
      {currentScreen === 'calendar' && (
        <CalendarScreen
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === 'history' && (
        <HistoryScreen
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === 'settings' && <SettingsScreen setCurrentScreen={setCurrentScreen} />}
    </div>
  );
}


const FlowFitApp = () => {
  return (
    <FlowFitProvider>
      <AppContent />
    </FlowFitProvider>
  );
};

export default FlowFitApp;