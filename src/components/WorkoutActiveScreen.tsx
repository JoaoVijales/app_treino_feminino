import React from 'react';
import { X, ChevronRight, Pause, Play } from 'lucide-react';
import { TodayWorkout } from '../types';

interface WorkoutActiveScreenProps {
  setCurrentScreen: (screen: string) => void;
  setWorkoutInProgress: (inProgress: boolean) => void;
  currentExercise: number;
  todayWorkout: TodayWorkout;
  progress: number;
  timer: number;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  nextExercise: () => void;
}

const WorkoutActiveScreen: React.FC<WorkoutActiveScreenProps> = ({
  setCurrentScreen,
  setWorkoutInProgress,
  currentExercise,
  todayWorkout,
  progress,
  timer,
  isPaused,
  setIsPaused,
  nextExercise,
}) => {
  const exercise = todayWorkout.exercises[currentExercise];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja sair do treino?')) {
                setCurrentScreen('home');
                setWorkoutInProgress(false);
              }
            }}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="text-sm text-gray-400">Exercício</div>
            <div className="text-xl font-bold">{currentExercise + 1}/{todayWorkout.exercises.length}</div>
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-purple-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="bg-gradient-to-br from-rose-500/20 to-purple-500/20 rounded-3xl aspect-video mb-8 flex items-center justify-center">
          <div className="text-6xl">{exercise.video}</div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{exercise.name}</h2>
          <div className="flex items-center justify-center gap-4 text-lg text-gray-300">
            <span>{exercise.sets}</span>
            <span>•</span>
            <span>Descanso: {exercise.rest}</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-3xl p-8 mb-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{timer}s</div>
            <div className="text-gray-400">Tempo restante</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 py-4 bg-white/10 backdrop-blur rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            {isPaused ? 'Continuar' : 'Pausar'}
          </button>
          <button
            onClick={nextExercise}
            className="flex-1 py-4 bg-gradient-to-r from-rose-400 to-purple-400 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            {currentExercise < todayWorkout.exercises.length - 1 ? 'Próximo' : 'Finalizar'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutActiveScreen;
