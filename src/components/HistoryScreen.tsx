"use client";
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Check, Home, Calendar, BarChart3, Settings, Zap, Moon } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';
import { getWorkoutById, getUserWorkoutExerciseSessions, getUserWorkoutExerciseSets, getExerciseById } from '../utils/api';
import { UserWorkoutSession, WorkoutExercise, Exercise, UserWorkoutExerciseSets } from '../types/supabase';
import { supabase } from '../utils/supabaseClient'; // Import supabase client

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const { userProfile, userWorkoutSessions, fetchUserWorkoutSessions, loading } = useFlowFit();
  const [selectedSession, setSelectedSession] = useState<UserWorkoutSession | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (userProfile?.id) {
      fetchUserWorkoutSessions(userProfile.id);
    }
  }, [userProfile, fetchUserWorkoutSessions]);

  const fetchDetailsForSession = async (sessionId: string) => {
    setLoadingDetails(true);
    try {
      const { data: exerciseSessionsData, error: exerciseSessionsError } = await supabase
        .from('user_workout_exercise_sessions')
        .select('*')
        .eq('session_id', sessionId);
        
      if (exerciseSessionsError) {
        console.error('Error fetching exercise sessions:', exerciseSessionsError);
        return;
      }

      if (exerciseSessionsData) {
        const resolvedExercises = await Promise.all(
          exerciseSessionsData.map(async (es: any) => {
            const { data: workoutExercise, error: workoutExerciseError } = await supabase
              .from('workout_exercises')
              .select('exercise_id')
              .eq('id', es.workout_exercise_id) // Corrected column name
              .single();

            if (workoutExerciseError || !workoutExercise) {
              console.warn(`Workout exercise link with ID ${es.workout_exercise_id} not found.`);
              return null;
            }

            const exerciseData = await getExerciseById(workoutExercise.exercise_id);
            if (!exerciseData) {
              console.warn(`Exercise with ID ${workoutExercise.exercise_id} not found.`);
              return null;
            }
            
            const { data: setsData, error: setsError } = await supabase
              .from('user_workout_exercise_sets')
              .select('*')
              .eq('exercise_session_id', es.id);
            
            if (setsError) {
              console.error('Error fetching sets data:', setsError);
              return null;
            }

            return {
              ...es,
              exercise: exerciseData,
              sets: setsData || [],
            };
          })
        );
        const detailedExercises = resolvedExercises.filter(Boolean);
        setSessionDetails(detailedExercises);
      } else {
        setSessionDetails([]);
      }
    } catch (e: any) {
      console.error('Error fetching session details:', e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSessionClick = (session: UserWorkoutSession) => {
    setSelectedSession(session);
    fetchDetailsForSession(session.id);
  };

  const calculateTotalLoad = (sets: UserWorkoutExerciseSets[]) => {
    return sets.reduce((total, set) => total + (set.weight_done || 0) * (set.reps_done || 0), 0);
  };

  const getWeekProgress = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return weekDays.map((dayName, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      const sessionForDay = userWorkoutSessions.find(session => 
        new Date(session.session_date).toDateString() === dayDate.toDateString()
      );

      let totalIntensity = 0;
      if (sessionForDay && sessionForDay.intensity_rating) {
        totalIntensity = sessionForDay.intensity_rating;
      }

      return {
        day: dayName,
        completed: !!sessionForDay,
        intensity: totalIntensity,
      };
    });
  };

  const weekProgress = getWeekProgress();

  const calculateOverallStats = () => {
    const totalWorkouts = userWorkoutSessions.length;
    const totalMinutes = userWorkoutSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const totalRpe = userWorkoutSessions.reduce((sum, session) => sum + (session.intensity_rating || 0), 0);
    const avgRpe = totalWorkouts > 0 ? (totalRpe / totalWorkouts).toFixed(1) : '0.0';
    return { totalWorkouts, totalMinutes, avgRpe };
  };

  const overallStats = calculateOverallStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Seu Progresso</h1>
        </div>
        <p className="text-gray-600 text-sm ml-9">Últimos 7 dias</p>
      </div>

      <div className="p-6 space-y-6">
        {selectedSession ? (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Sessão em {new Date(selectedSession.session_date).toLocaleDateString()}</h3>
              <button onClick={() => setSelectedSession(null)} className="text-sm text-rose-500">Voltar</button>
            </div>
            <p className="text-gray-600 text-sm mb-2">Duração: {selectedSession.duration || 'N/A'} min</p>
            <p className="text-gray-600 text-sm mb-2">Intensidade: {selectedSession.intensity_rating || 'N/A'}/10</p>
            <p className="text-gray-600 text-sm mb-2">Sentimento: {selectedSession.feeling || 'N/A'}</p>
            <p className="text-gray-600 text-sm mb-4">Notas: {selectedSession.notes || 'Nenhuma'}</p>
            <h4 className="text-md font-bold mt-4 mb-2">Exercícios:</h4>
            {loadingDetails ? (
              <p>Carregando detalhes dos exercícios...</p>
            ) : sessionDetails.length > 0 ? (
              sessionDetails.map((exerciseDetail, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
                  <p className="font-semibold">{exerciseDetail.exercise?.name}</p>
                  {exerciseDetail.sets && exerciseDetail.sets.map((set: UserWorkoutExerciseSets, setIndex: number) => (
                    <p key={setIndex} className="ml-2 text-sm">
                      Set {set.ref_set}: {set.weight_done || 0} kg x {set.reps_done || 0} reps
                      {set.weight_done && set.reps_done ? ` (Carga: ${(set.weight_done * set.reps_done).toFixed(0)})` : ''}
                    </p>
                  ))}
                  <p className="ml-2 text-sm font-medium">Carga Total do Exercício: {calculateTotalLoad(exerciseDetail.sets)}</p>
                </div>
              ))
            ) : (
              <p>Nenhum detalhe de exercício encontrado para esta sessão.</p>
            )}
          </div>
        ) : (
          <>
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
                  <div className="text-2xl font-bold text-gray-800">{overallStats.totalWorkouts}</div>
                  <div className="text-xs text-gray-600">Treinos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{overallStats.totalMinutes}</div>
                  <div className="text-xs text-gray-600">Minutos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{overallStats.avgRpe}</div>
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
                {userWorkoutSessions && userWorkoutSessions.length > 0 ? (
                  userWorkoutSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          Treino em {new Date(session.session_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {session.duration || 'N/A'} min • {session.actual_phase || 'N/A'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-800">RPE {session.intensity_rating || 'N/A'}</div>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(10)].map((_, i) => (
                            <div 
                              key={i}
                              className={`w-1.5 h-3 rounded-full ${
                                i < (session.intensity_rating || 0) ? 'bg-rose-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Nenhum histórico de treino encontrado.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around max-w-md mx-auto">
          <button 
            onClick={() => onBack()} // Assuming onBack navigates to home or similar
            className="flex flex-col items-center gap-1"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Início</span>
          </button>
          <button 
            onClick={() => { /* navigate to calendar */ }}
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
            onClick={() => { /* navigate to settings */ }}
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