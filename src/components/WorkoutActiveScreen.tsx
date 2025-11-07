import React, { useState } from 'react';
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
  nextExercise: (reps: number, weight: number) => void;
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
  
  const [currentReps, setCurrentReps] = useState<number>(exercise.reps || 0);
  const [currentWeight, setCurrentWeight] = useState<number>(exercise.weight || 0);

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
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <iframe 
              width="350" 
              height="200" 
              src="https://www.youtube.com/embed/iwSDZnziPOI?si=uXtoIFu-yfQ0zyzL" 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="absolute top-0 left-0 w-full h-full object-cover"
            ></iframe>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{exercise.name}</h2>
          <div className="flex items-center justify-center gap-4 text-lg text-gray-300">
            <span>{exercise.sets.length}</span>
            <span>•</span>
            <span>Descanso: {exercise.rest}</span>
          </div>
        </div>

        {/* <div className="bg-white/5 backdrop-blur rounded-3xl p-8 mb-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{timer}s</div>
            <div className="text-gray-400">Tempo restante</div>
          </div>
        </div> */}

        <div className="bg-white/5 backdrop-blur rounded-3xl py-6 mb-6">
          {exercise.sets.map((set) => (
          <div className="flex justify-around items-center mb-4" key={set.set}>
            <div className="text-center">
              <label htmlFor={`reps-${set.set}`} className="text-gray-400 text-sm block mb-1">Repetições</label>
              <input
                id={`reps-${set.set}`}
                type="number"
                value={currentReps}
                onChange={(e) => setCurrentReps(Number(e.target.value))}
                className="w-24 p-2 bg-white/10 rounded-lg text-center text-xl font-bold"
                />
            </div>
            <div className="text-center">
              <label htmlFor={`weight-${set.set}`} className="text-gray-400 text-sm block mb-1">Peso (kg)</label>
              <input
                id={`weight-${set.set}`}
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-24 p-2 bg-white/10 rounded-lg text-center text-xl font-bold"
              />
            </div>
          </div>
        ))}
          {exercise.prReps !== undefined && exercise.prWeight !== undefined && (
            <div className="text-center text-gray-400 text-sm">
              PR Anterior: {exercise.prReps} reps @ {exercise.prWeight} kg ({exercise.prDate || 'N/A'})
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 py-4 bg-white/10 backdrop-blur rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            {isPaused ? 'Continuar' : 'Pausar'}
          </button>
          <button
            onClick={() => nextExercise(currentReps, currentWeight)}
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
