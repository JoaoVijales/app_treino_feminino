import { useFlowFit } from "../context/FlowFitContext";
import { useEffect, useState, useCallback } from "react";
import { FullWorkoutSession } from "../types/supabase";
import { 
    addUserWorkoutSession, 
    addUserWorkoutExerciseSessions, 
    addUserWorkoutExerciseSets 
} from "../utils/api";
import { v4 as uuidv4 } from 'uuid'; // ✅ ADICIONADO

export const useWorkoutSession = () => {
    const { userProfile, todayWorkoutState, userData, session } = useFlowFit();
    
    const [workoutSession, setWorkoutSession] = useState<FullWorkoutSession>({
        workoutSession: {} as unknown as FullWorkoutSession['workoutSession'],
        exerciseSessions: [
            {
                exercise: {} as unknown as FullWorkoutSession['exerciseSessions'][0]['exercise'],
                sets: [] as unknown as FullWorkoutSession['exerciseSessions'][0]['sets'],
            }
        ],
    });

    const submitWorkoutSession = async () => {
        if (!session?.user?.id) return;

        try {
            await addUserWorkoutSession({ 
                ...workoutSession.workoutSession, 
                user_id: session.user.id 
            });
            
            await addUserWorkoutExerciseSessions(
                workoutSession.exerciseSessions.map(exSession => ({ 
                    ...exSession.exercise, 
                    user_id: session.user.id 
                }))
            );
            
            await addUserWorkoutExerciseSets(
                workoutSession.exerciseSessions
                    .flatMap(exSession => exSession.sets || [])
                    .map(set => ({ 
                        ...set, 
                        user_id: session.user.id 
                    }))
            );
        } catch (error) {
            console.error("Error submitting workout session:", error);
            throw error;
        }
    };

    const updateWorkoutFeedBack = (
        intensity_rating: number | null,
        feeling: 'energized' | 'tired' | 'strong' | 'pain' | 'cramps' | 'great' | null,
        notes: string | null
    ) => {
        if (!todayWorkoutState || !userProfile) return;

        setWorkoutSession((prevSession) => ({
            ...prevSession,
            workoutSession: {
                ...prevSession.workoutSession,
                intensity_rating,
                feeling,
                notes,
            },
        }));
    };

    const updateWorkoutLoad = () => {
        if (!todayWorkoutState || !userProfile) return;

        setWorkoutSession((prevSession) => {
            const totalLoad = prevSession.exerciseSessions.reduce((totalEx, exSession) => {
                const exerciseLoad = exSession.sets?.reduce((totalSet, set) => {
                    return totalSet + (set.load_set || 0);
                }, 0) || 0;
                return totalEx + exerciseLoad;
            }, 0);

            return {
                ...prevSession,
                workoutSession: {
                    ...prevSession.workoutSession,
                    load_workout_total: totalLoad,
                },
            };
        });
    };

    const updateExerciseLoad = (currentExercise: number) => {
        if (!todayWorkoutState || !userProfile) return;

        setWorkoutSession((prevSession) => {
            const updatedExerciseSessions = [...prevSession.exerciseSessions];
            const currentExSession = updatedExerciseSessions[currentExercise];

            if (!currentExSession) return prevSession;

            const totalLoad = currentExSession.sets?.reduce((total, set) => {
                return total + (set.load_set || 0);
            }, 0) || 0;

            currentExSession.exercise.load_exercise_session = totalLoad;
            updatedExerciseSessions[currentExercise] = currentExSession;

            return {
                ...prevSession,
                exerciseSessions: updatedExerciseSessions,
            };
        });
    };

    const updateExerciseSet = (
        set: number, 
        currentExercise: number, 
        reps?: number, 
        weight?: number
    ) => {
        if (!todayWorkoutState || !userProfile || !session?.user?.id) return;

        setWorkoutSession((prevSession) => {
            const updatedExerciseSessions = [...prevSession.exerciseSessions];
            const currentExSession = updatedExerciseSessions[currentExercise];
            
            if (!currentExSession?.sets) return prevSession;

            const currentSet = currentExSession.sets[set];
            const exerciseId = todayWorkoutState.exercises[currentExercise]?.id;

            if (!exerciseId) return prevSession;

            // Preservar valores existentes e calcular load_set corretamente
            const updatedReps = reps !== undefined ? reps : (currentSet?.reps_done || 0);
            const updatedWeight = weight !== undefined ? weight : (currentSet?.weight_done || 0);
            const calculatedLoad = updatedReps * updatedWeight;

            // ✅ CORRIGIDO: Usar UUID v4 para garantir unicidade
            currentExSession.sets[set] = {
                id: currentSet?.id || uuidv4(), // ✅ Preserva ID existente ou cria novo UUID
                exercise_session_id: currentExSession.exercise.id,
                load_set: calculatedLoad,
                weight_done: updatedWeight,
                reps_done: updatedReps,
                ref_set: set + 1,
                created_at: currentSet?.created_at || new Date().toISOString(), // ✅ Preserva timestamp original
            };

            updatedExerciseSessions[currentExercise] = currentExSession;

            return {
                ...prevSession,
                exerciseSessions: updatedExerciseSessions,
            };
        });

        // Recalcular cargas automaticamente
        setTimeout(() => {
            updateExerciseLoad(currentExercise);
            updateWorkoutLoad();
        }, 0);
    };

    const fetchWorkoutSession = useCallback(async () => {
        if (!todayWorkoutState?.id || !userProfile || !userData.currentPhase || !session?.user?.id) {
            return;
        }

        try {
            const timestamp = new Date().toISOString();

            setWorkoutSession((prevState) => ({
                workoutSession: {
                    id: uuidv4(), // ✅ UUID para workout session
                    user_id: session.user.id,
                    workout_id: todayWorkoutState.id,
                    session_date: timestamp,
                    duration: prevState.workoutSession.duration || null,
                    actual_phase: userData.currentPhase,
                    intensity_rating: prevState.workoutSession.intensity_rating || null,
                    feeling: prevState.workoutSession.feeling || null,
                    notes: prevState.workoutSession.notes || null,
                    load_workout_total: prevState.workoutSession.load_workout_total || null,
                    created_at: timestamp,
                },
                exerciseSessions: todayWorkoutState.exercises.map((exercise) => {
                    const existingSession = prevState.exerciseSessions.find(
                        es => es.exercise.exercise_session_id === exercise.id
                    );

                    return {
                        exercise: {
                            id: uuidv4(), // ✅ UUID para exercise session
                            session_id: todayWorkoutState.id,
                            exercise_session_id: exercise.id,
                            load_exercise_session: existingSession?.exercise.load_exercise_session || null,
                            created_at: timestamp,
                        },
                        sets: [], // ✅ Sets serão criados com UUID quando atualizados
                    };
                }),
            }));
        } catch (error) {
            console.error("Error fetching workout session:", error);
        }
    }, [todayWorkoutState, userProfile, userData.currentPhase, session]);

    useEffect(() => {
        fetchWorkoutSession();
    }, [fetchWorkoutSession]);

    return { 
        workoutSession, 
        setWorkoutSession, 
        updateExerciseSet, 
        updateExerciseLoad, 
        updateWorkoutFeedBack,
        updateWorkoutLoad,
        submitWorkoutSession 
    };
};
