import React, { useState } from 'react';
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

const AppContent = () => {
  const { userData, todayWorkoutState, loading, setUserData, userProfile } = useFlowFit();
  const [currentScreen, setCurrentScreen] = useState('login');
  const [onboardingStep, setOnboardingStep] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timer, setTimer] = useState(45);
  const [isPaused, setIsPaused] = useState(false);


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
        { value: 'peso-corporal', label: 'Só peso corporal', icon: '🏃‍♀️' },
        { value: 'halteres', label: 'Halteres', icon: '🏋️‍♀️' },
        { value: 'faixas', label: 'Faixas elásticas', icon: '🎗️' },
        { value: 'academia', label: 'Academia completa', icon: '🏢' }
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
      const userId = 'test_user_001'; // Hardcoded user ID
      await updateUserProfile(userId, { ...userData, onboarding_completed: true });
      setCurrentScreen('home');
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

  

  if (loading && currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
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