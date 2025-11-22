"use client";
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Check, Home, Calendar, BarChart3, Settings, Zap, Moon } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';
import { getWorkoutById, getUserWorkoutExerciseSessions, getUserWorkoutExerciseSets, getExerciseById } from '../utils/api';
import { UserWorkoutSession, WorkoutExercise, Exercise, UserWorkoutExerciseSets } from '../types/supabase';

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const { userProfile, userWorkoutSessions, fetchUserWorkoutSessions } = useFlowFit();
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

        const exerciseSessions = await getUserWorkoutExerciseSessions(sessionId);

        if (exerciseSessions) { // Add null check here

        const resolvedExercises = await Promise.all(
          exerciseSessions.map(async (es: any) => {
            const exerciseData = await getExerciseById(es.exercise_id);
            if (!exerciseData) {
                console.warn(`Exercise with ID ${es.exercise_id} not found.`);
                return null;
            }
            const setsData = await getUserWorkoutExerciseSets(es.id);
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

          setSessionDetails([]); // Set to empty array if no sessions

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

  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading details...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <ChevronLeft className="cursor-pointer" onClick={onBack} />
        <h2 className="text-xl font-bold">Histórico de Treinos</h2>
        {selectedSession && <Check className="opacity-0" />} {/* Placeholder for alignment */}
      </div>

      {selectedSession ? (
        <div>
          <button onClick={() => setSelectedSession(null)} className="btn btn-sm mb-4">Voltar para a Lista</button>
          <h3 className="text-lg font-bold mb-2">Sessão em {new Date(selectedSession.session_date).toLocaleDateString()}</h3>
          <p>Duração: {selectedSession.duration} min</p>
          <p>Intensidade: {selectedSession.intensity_rating}/10</p>
          <p>Sentimento: {selectedSession.feeling}</p>
          <p>Notas: {selectedSession.notes || 'Nenhuma'}</p>
          <h4 className="text-md font-bold mt-4 mb-2">Exercícios:</h4>
          {sessionDetails.map((exerciseDetail, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
              <p className="font-semibold">{exerciseDetail.exercise?.name}</p>
              {exerciseDetail.sets.map((set: UserWorkoutExerciseSets, setIndex: number) => (
                <p key={setIndex} className="ml-2 text-sm">
                  Set {set.ref_set}: {set.weight_done || 0} kg x {set.reps_done || 0} reps (Carga: {calculateTotalLoad([set])})
                </p>
              ))}
              <p className="ml-2 text-sm font-medium">Carga Total do Exercício: {calculateTotalLoad(exerciseDetail.sets)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {userWorkoutSessions.map((session) => (
            <div
              key={session.id}
              className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-200"
              onClick={() => handleSessionClick(session)}
            >
              <p className="font-bold">Treino em {new Date(session.session_date).toLocaleDateString()}</p>
              <p>Fase: {session.actual_phase}</p>
              <p>Intensidade: {session.intensity_rating}/10</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;