import React, { useState } from 'react';
import { Droplet, Zap, Sun, Moon } from 'lucide-react';
import FeedbackScreen from './FeedbackScreen';
import CalendarScreen from './CalendarScreen';
import OnboardingScreen from './OnboardingScreen';
import HomeScreen from './HomeScreen';
import WorkoutActiveScreen from './WorkoutActiveScreen';
import HistoryScreen from './HistoryScreen';
import SettingsScreen from './SettingsScreen';
import { UserData, CyclePhases, TodayWorkout, WeekProgressItem, OnboardingScreenConfig } from '../types';

const FlowFitApp = () => {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    goal: '',
    equipment: [],
    cycleRegular: '',
    lastPeriod: '',
    currentPhase: 'folicular',
    cycleDay: 10
  });
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timer, setTimer] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [periodDates, setPeriodDates] = useState<Array<{ start: string; end: string }>>([
    { start: '2024-10-28', end: '2024-11-02' },
    { start: '2024-11-25', end: '2024-11-30' }
  ]);


  const cyclePhases: CyclePhases = {
    menstrual: { name: 'Menstrual', icon: Droplet, color: 'rose', emoji: '🩸' },
    folicular: { name: 'Folicular', icon: Zap, color: 'green', emoji: '⚡' },
    ovulatoria: { name: 'Ovulatória', icon: Sun, color: 'amber', emoji: '☀️' },
    lutea: { name: 'Lútea', icon: Moon, color: 'purple', emoji: '🌙' }
  };

  const todayWorkout: TodayWorkout = {
    title: 'Força + Cardio Moderado',
    duration: '35 min',
    intensity: 'Moderada-Alta',
    reason: 'Sua energia está no pico! Seu corpo responde super bem a treinos intensos agora.',
    exercises: [
      { name: 'Agachamento', sets: '3x12', rest: '45s', video: '🎥' },
      { name: 'Flexão Inclinada', sets: '3x10', rest: '45s', video: '🎥' },
      { name: 'Afundo Alternado', sets: '3x10', rest: '45s', video: '🎥' },
      { name: 'Prancha', sets: '3x30s', rest: '30s', video: '🎥' },
      { name: 'Burpees', sets: '3x8', rest: '60s', video: '🎥' }
    ]
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













  const handleOnboardingNext = () => {
    if (onboardingStep < onboardingScreens.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const startWorkout = () => {
    setWorkoutInProgress(true);
    setCurrentScreen('workout-active');
    setCurrentExercise(0);
  };

  const nextExercise = () => {
    if (currentExercise < todayWorkout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimer(45);
    } else {
      setCurrentScreen('feedback');
    }
  };

  return (
    <div>
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
          userData={userData}
          cyclePhases={cyclePhases}
          todayWorkout={todayWorkout}
          startWorkout={startWorkout}
        />
      )}
      {currentScreen === 'workout-active' && (
        <WorkoutActiveScreen
          setCurrentScreen={setCurrentScreen}
          setWorkoutInProgress={setWorkoutInProgress}
          currentExercise={currentExercise}
          todayWorkout={todayWorkout}
          progress={((currentExercise + 1) / todayWorkout.exercises.length) * 100}
          timer={timer}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          nextExercise={nextExercise}
        />
      )}
      {currentScreen === 'feedback' && <FeedbackScreen setCurrentScreen={setCurrentScreen} />}
      {currentScreen === 'calendar' && (
        <CalendarScreen
          setCurrentScreen={setCurrentScreen}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          periodDates={periodDates}
          setPeriodDates={setPeriodDates}
          userData={userData}
          cyclePhases={cyclePhases}
        />
      )}
      {currentScreen === 'history' && (
        <HistoryScreen
          setCurrentScreen={setCurrentScreen}
          weekProgress={weekProgress}
        />
      )}
      {currentScreen === 'settings' && <SettingsScreen setCurrentScreen={setCurrentScreen} />}
    </div>
  );
};

export default FlowFitApp;