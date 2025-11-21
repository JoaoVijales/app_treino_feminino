"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronRight, Pause, Play } from 'lucide-react';
import { TodayWorkout } from '../types';
import { FullWorkoutSession, Workout } from '../types/supabase';
import { useWorkoutSession } from '../hooks/useWorkoutSession';

interface WorkoutActiveScreenProps {
    setCurrentScreen: (screen: string) => void;
    setCurrentExercise: (index: number) => void;
    currentExercise: number;
    todayWorkout: TodayWorkout | null;
    progress: number;
    timer: number;
    isPaused: boolean;
    setIsPaused: (isPaused: boolean) => void;
}

const WorkoutActiveScreen: React.FC<WorkoutActiveScreenProps> = ({
    setCurrentScreen,
    setCurrentExercise,
    currentExercise,
    todayWorkout,
    progress,
    timer,
    isPaused,
    setIsPaused,
}) => {

    // Sempre seguro — não mutável

    const exercise = todayWorkout?.exercises?.[currentExercise];
    const { workoutSession, updateExerciseSet, updatePRExerciseSession, updateExerciseLoad, updateWokoutLoad } = useWorkoutSession();

    const nextExercise = async () => {
        updatePRExerciseSession(currentExercise);
        updateExerciseLoad(currentExercise);

        if (todayWorkout && currentExercise < todayWorkout.exercises.length - 1) {
            setCurrentExercise(currentExercise + 1);
        } else {
            updateWokoutLoad();
            setCurrentScreen('feedback');
        }
    };

    // Gera as séries de forma estável
    const seriesElements = useMemo(() => {
        if (!exercise || !exercise.series) return [];
        
        const exerciseSession = workoutSession.exerciseSessions[currentExercise];

        return Array.from({ length: exercise.series }, (_, index) => {
            const setData = exerciseSession?.sets?.[index];
            const repsValue = setData?.reps_done || '';
            const weightValue = setData?.weight_done || '';

            return (
            <div className="flex justify-around items-center mb-4" key={index}>
                <div className="text-center">
                    <label htmlFor={`reps-${index}`} className="text-gray-400 text-sm block mb-1">
                        Repetições
                    </label>
                    <input
                        id={`reps-${index}`}
                        type="number"
                        value={repsValue}
                        onChange={(e) => updateExerciseSet(index, currentExercise, Number(e.target.value))}
                        className="w-24 p-2 bg-white/10 rounded-lg text-center text-xl font-bold"
                    />
                </div>

                {exercise.equipment !== 'peso corporal' && (
                    <div className="text-center">
                        <label htmlFor={`weight-${index}`} className="text-gray-400 text-sm block mb-1">
                            Peso (kg)
                        </label>
                        <input
                            id={`weight-${index}`}
                            type="number"
                            value={weightValue}
                            onChange={(e) => updateExerciseSet(index, currentExercise, undefined, Number(e.target.value))}
                            className="w-24 p-2 bg-white/10 rounded-lg text-center text-xl font-bold"
                        />
                    </div>
                )}
            </div>
        )});
    }, [exercise, workoutSession, currentExercise, updateExerciseSet]);

    if (!exercise) {
        return (
            <div className="text-white p-10 text-center">
                <h2 className="text-2xl font-bold">Erro ao carregar exercício</h2>
                <p className="text-gray-400 mt-4">Nenhum exercício encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => {
                            if (window.confirm('Tem certeza que deseja sair do treino?')) {
                                setCurrentScreen('home');
                            }
                        }}
                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="text-center">
                        <div className="text-sm text-gray-400">Exercício</div>
                        <div className="text-xl font-bold">
                            {currentExercise + 1}/{todayWorkout.exercises.length}
                        </div>
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
                        {exercise.video && exercise.video.includes('youtube.com/embed') ? (
                            <iframe
                                width="350"
                                height="200"
                                src={exercise.video}
                                title="YouTube video player"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <span className="text-6xl">{exercise.video || '🎥'}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{exercise.name}</h2>
                    <div className="flex items-center justify-center gap-4 text-lg text-gray-300">
                        <span>{exercise.series}</span>
                        <span>•</span>
                        <span>Descanso: 60s</span>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-3xl py-6 mb-6">

                    {/* Series */}
                    {seriesElements}

                    {/* PR */}
                    {exercise.prReps !== undefined && exercise.prWeight !== undefined && (
                        <div className="text-center text-gray-400 text-sm">
                            PR Anterior: {exercise.prReps} reps @ {exercise.prWeight} kg (
                            {exercise.prDate || 'N/A'})
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
                        onClick={() => nextExercise()}
                        className="flex-1 py-4 bg-gradient-to-r from-rose-400 to-purple-400 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                        {currentExercise < todayWorkout.exercises.length - 1
                            ? 'Próximo'
                            : 'Finalizar'}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutActiveScreen;
