import React, { useEffect, useState } from 'react';
import { ChevronLeft, Check, Home, Calendar, BarChart3, Settings, Zap, Moon } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';
import { getWorkoutById, getUserWorkoutExerciseSessions, getUserWorkoutExerciseSets, getExerciseById } from '../utils/api';
import { UserWorkoutExerciseSessions, UserWorkoutExerciseSets } from '../types/supabase';
import { Session } from '@supabase/supabase-js';

interface HistoryScreenProps {
  setCurrentScreen: (screen: string) => void;
}

interface DetailedWorkoutHistory {
  id: string;
  date: string;
  name: string;
  duration: string;
  rpe: number;
}

interface ExerciseDetails {
  name: string;
  sets: UserWorkoutExerciseSets[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ setCurrentScreen }) => {
  const { workoutHistory, userProfile } = useFlowFit();
  const [detailedHistory, setDetailedHistory] = useState<DetailedWorkoutHistory[]>([]);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [workoutDetails, setWorkoutDetails] = useState<Record<string, ExerciseDetails[]>>({});

  const handleWorkoutClick = async (sessionId: string) => {
    if (expandedWorkoutId === sessionId) {
      setExpandedWorkoutId(null);
    } else {
      setExpandedWorkoutId(sessionId);
      if (!workoutDetails[sessionId]) {
        const exerciseSessions = await getUserWorkoutExerciseSessions(sessionId);
        if (exerciseSessions) {
          const details: ExerciseDetails[] = await Promise.all(
            exerciseSessions.map(async (exSession: UserWorkoutExerciseSessions) => {
              const sets = await getUserWorkoutExerciseSets(exSession.id);
              const exercise = await getExerciseById(exSession.exercise_session_id);
              return {
                name: exercise?.name || 'Unknown Exercise',
                sets: sets || [],
              };
            })
          );
          setWorkoutDetails((prev) => ({ ...prev, [sessionId]: details }));
        }
      }
    }
  };
  
  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      const detailedHistoryPromises = workoutHistory.map(async (session) => {
        if (!session.workout_id) return null;
        const workout = await getWorkoutById(session.workout_id);
        if (!workout) return null;

        return {
          id: session.id,
          date: new Date(session.session_date + 'T00:00:00').toLocaleDateString(),
          name: workout.title,
          duration: `${session.duration || 0} min`,
          rpe: session.intensity_rating || 0,
        };
      });

      const resolvedHistory = await Promise.all(detailedHistoryPromises);
      setDetailedHistory(resolvedHistory.filter((item): item is DetailedWorkoutHistory => item !== null));
    };

    fetchWorkoutDetails();
  }, [workoutHistory]);

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to make Monday the first day
    return new Date(d.setDate(diff));
  };

  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const weekProgress = weekDays.map((dayName, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    const workoutOnDay = workoutHistory.find(session => {
      const sessionDate = new Date(session.session_date + 'T00:00:00');
      return sessionDate.toDateString() === date.toDateString();
    });

    return {
      day: dayName,
      completed: !!workoutOnDay,
      intensity: workoutOnDay?.intensity_rating || 0,
      duration: workoutOnDay?.duration || 0,
    };
  });

  const weeklyWorkouts = weekProgress.filter(d => d.completed);
  const totalWorkouts = weeklyWorkouts.length;
  const totalMinutes = weeklyWorkouts.reduce((sum, d) => sum + d.duration, 0);
  const averageRPE = totalWorkouts > 0 ? (weeklyWorkouts.reduce((sum, d) => sum + d.intensity, 0) / totalWorkouts).toFixed(1) : 0;


  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => setCurrentScreen('home')}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Seu Progresso</h1>
        </div>
        <p className="text-gray-600 text-sm ml-9">Últimos 7 dias</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Semana Atual</h3>
          <div className="flex gap-2 mb-4">
            {weekProgress.map((day, idx) => (
              <div key={idx} className="flex-1">
                <div className={`aspect-square rounded-2xl mb-2 flex items-center justify-center ${
                  day.completed
                    ? 'bg-gradient-to-br from-rose-400 to-purple-400'
                    : 'bg-gray-100'
                }`}>
                  {day.completed && <Check className="w-6 h-6 text-white" />}
                </div>
                <div className="text-xs text-gray-600 text-center">{day.day}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalWorkouts}</div>
              <div className="text-xs text-gray-600">Treinos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalMinutes}</div>
              <div className="text-xs text-gray-600">Minutos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{averageRPE}</div>
              <div className="text-xs text-gray-600">RPE médio</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Insights do Ciclo</h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Pico de Performance</h4>
                  <p className="text-sm text-gray-700">
                    Seus melhores treinos acontecem na fase folicular (dias 8-12).
                    RPE médio de 8.5!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Padrão Identificado</h4>
                  <p className="text-sm text-gray-700">
                    Na fase lútea, você prefere treinos mais leves.
                    Ajustamos automaticamente! 💜
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Histórico de Treinos</h3>
          <div className="space-y-3">
          {detailedHistory.map((workout, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl">
                <div 
                  className="flex items-center gap-4 p-3"
                  onClick={() => handleWorkoutClick(workout.id)}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{workout.name}</div>
                    <div className="text-xs text-gray-600">{workout.date} • {workout.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">RPE {workout.rpe}</div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-3 rounded-full ${
                            i < workout.rpe ? 'bg-rose-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {expandedWorkoutId === workout.id && (
                  <div className="p-3">
                    {workoutDetails[workout.id]?.map((exercise, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-semibold text-gray-700">{exercise.name}</p>
                        {exercise.sets.map((set, setIndex) => (
                          <p key={setIndex} className="text-xs text-gray-600">
                            Série {setIndex + 1}: {set.reps_done} reps com {set.weight_done} kg
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around max-w-md mx-auto">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex flex-col items-center gap-1"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Início</span>
          </button>
          <button
            onClick={() => setCurrentScreen('calendar')}
            className="flex flex-col items-center gap-1"
          >
            <Calendar className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Ciclo</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <BarChart3 className="w-6 h-6 text-rose-500" />
            <span className="text-xs font-medium text-rose-500">Progresso</span>
          </button>
          <button
            onClick={() => setCurrentScreen('settings')}
            className="flex flex-col items-center gap-1"
          >
            <Settings className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
