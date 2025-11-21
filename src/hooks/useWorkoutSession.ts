import { useFlowFit } from "../context/FlowFitContext";
import { useEffect, useState } from "react";
import { FullWorkoutSession, UserWorkoutRecord, UserExerciseRecord } from "../types/supabase";
import { getUserWorkoutSessions, getUserWorkoutRecords, getUserExerciseRecords, getUserWorkoutExerciseSessions,  addUserWorkoutSession, addUserWorkoutExerciseSessions, addUserWorkoutExerciseSets} from "../utils/api";
import { Session } from "@supabase/supabase-js";

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
    const [workoutRecords, setWorkoutRecords] = useState<UserWorkoutRecord>();
    const [exerciseRecords, setExerciseRecords] = useState<UserExerciseRecord>();   

    const submitWorkoutSession = async () => {
    if (!session?.user?.id) return;
    // Implement submission logic here
    await addUserWorkoutSession({ ...workoutSession.workoutSession, user_id: session.user.id });
    await addUserWorkoutExerciseSessions(workoutSession.exerciseSessions.map(exSession => ({ ...exSession.exercise, user_id: session.user.id })));
    await addUserWorkoutExerciseSets(workoutSession.exerciseSessions.flatMap(exSession => exSession.sets || []).map(set => ({ ...set, user_id: session.user.id })));
}



    const updatePRworkoutSession = async () => {
        if (!session?.user?.id || !userProfile?.id) return;
        if (!workoutSession.workoutSession.load_workout_total) return;

        const workoutRecordsListAll = await getUserWorkoutRecords();
        const workoutRecordsList = workoutRecordsListAll?.filter(record => record.workout_id === todayWorkoutState?.id);
        const workoutRecords = workoutRecordsList && workoutRecordsList.length > 0 ? workoutRecordsList[0] : null;
        if (!workoutRecords) {
            const history = await getUserWorkoutSessions();
            const todayWorkoutHistory = history?.filter(item => item.workout_id === todayWorkoutState?.id);

            if (todayWorkoutHistory && todayWorkoutHistory.length > 0) {
                todayWorkoutHistory.sort((a, b) => (b.load_workout_total || 0) - (a.load_workout_total || 0))
                const bestSession = todayWorkoutHistory[0];

                if (!bestSession.load_workout_total) return;

                if (bestSession.load_workout_total > workoutSession.workoutSession.load_workout_total) {
                    setWorkoutRecords(() => ({
                        user_id: session.user.id,
                        workout_id: bestSession.workout_id || '',
                        record_load: bestSession.load_workout_total,
                        record_date: bestSession.session_date,
                        created_at: bestSession.created_at,
                    }));
                } else {
                    setWorkoutRecords(() => ({
                        user_id: session.user.id,
                        workout_id: workoutSession.workoutSession.workout_id || '',
                        record_load: workoutSession.workoutSession.load_workout_total,
                        record_date: workoutSession.workoutSession.session_date,
                        created_at: workoutSession.workoutSession.created_at,
                    }));
                }

            } else {
                setWorkoutRecords(() => ({
                    user_id: session.user.id,
                    workout_id: workoutSession.workoutSession.workout_id || '',
                    record_load: workoutSession.workoutSession.load_workout_total,
                    record_date: workoutSession.workoutSession.session_date,
                    created_at: workoutSession.workoutSession.created_at,
                }));

            }
        } else {
            if (workoutRecords.record_load && workoutRecords.record_load < workoutSession.workoutSession.load_workout_total) {
                setWorkoutRecords(() => ({
                    user_id: session.user.id,
                    workout_id: workoutSession.workoutSession.workout_id || '',
                    record_load: workoutSession.workoutSession.load_workout_total,
                    record_date: workoutSession.workoutSession.session_date,
                    created_at: workoutSession.workoutSession.created_at,
                }));
            } else {
                setWorkoutRecords(() => ({
                    user_id: workoutRecords.user_id,
                    workout_id: workoutRecords.workout_id,
                    record_load: workoutRecords.record_load,
                    record_date: workoutRecords.record_date,
                    created_at: workoutRecords.created_at,
                }));
            }
        }


    }

    const updatePRExerciseSession = async (currentExercise: number) => {
        // Lógica para atualizar PRs (Personal Records) pode ser implementada aqui
        if (!session?.user?.id || !userProfile?.id) return;

        const exercise = workoutSession.exerciseSessions[currentExercise];
        if (!exercise) return;

        // pegar ultimo recorde do usuário para o exercício atual
        const exerciseRecordsListAll = await getUserExerciseRecords();
        const exerciseRecordsList = exerciseRecordsListAll?.filter(record => record.exercise_id === exercise.exercise.exercise_session_id);
        const exerciseRecords = exerciseRecordsList && exerciseRecordsList.length > 0 ? exerciseRecordsList[0] : null;

        if (!exerciseRecords) {
            const history = await getUserWorkoutExerciseSessions( exercise.exercise.exercise_session_id);
            const exerciseHistory = history?.flatMap(item =>
                item.exercise_session_id === exercise.exercise.exercise_session_id ? [item] : []
            );

            if (exerciseHistory && exerciseHistory.length > 0) {
                // ordenar a lista por load_exercise_session em ordem decrescente
                exerciseHistory.sort((a, b) => (b.load_exercise_session || 0) - (a.load_exercise_session || 0))
                const bestExerciseSession = exerciseHistory[0];

                if (!bestExerciseSession.load_exercise_session || !exercise.exercise.load_exercise_session) return;

                if (bestExerciseSession.load_exercise_session > exercise.exercise.load_exercise_session) {
                    setExerciseRecords(() => ({
                        user_id: session.user.id,
                        workout_id: workoutSession.workoutSession.workout_id || '',
                        exercise_id: bestExerciseSession.exercise_session_id,
                        record_load: bestExerciseSession.load_exercise_session,
                        exercise_session_id: bestExerciseSession.id,
                        created_at: bestExerciseSession.created_at,
                    }));
                }

            } else {
                setExerciseRecords(() => ({
                    user_id: session.user.id,
                    workout_id: workoutSession.workoutSession.workout_id || '',
                    exercise_id: exercise.exercise.exercise_session_id,
                    record_load: exercise.exercise.load_exercise_session,
                    exercise_session_id: exercise.exercise.id,
                    created_at: exercise.exercise.created_at,
                }));
            }
        } else {
            if (exerciseRecords.record_load && exerciseRecords.record_load < exercise.exercise.load_exercise_session!) {
                setExerciseRecords(() => ({
                    user_id: session.user.id,
                    workout_id: workoutSession.workoutSession.workout_id || '',
                    exercise_id: exercise.exercise.exercise_session_id,
                    record_load: exercise.exercise.load_exercise_session,
                    exercise_session_id: exercise.exercise.id,
                    created_at: exercise.exercise.created_at,
                }));
            } else {
                setExerciseRecords(() => ({
                    user_id: exerciseRecords.user_id,
                    workout_id: exerciseRecords.workout_id,
                    exercise_id: exerciseRecords.exercise_id,
                    record_load: exerciseRecords.record_load,
                    exercise_session_id: exerciseRecords.exercise_session_id,
                    created_at: exerciseRecords.created_at,
                }));
            }
        }
    }


    const updateWokoutFeedBack = (
        intensity_rating: number | null,
        feeling: 'energized' | 'tired' | 'strong' | 'pain' | 'cramps' | 'great' | null,
        notes: string | null,) => {

        if (!todayWorkoutState || !userProfile) return;
        setWorkoutSession((prevSession) => ({
            ...prevSession,
            workoutSession: {
                ...prevSession.workoutSession,
                intensity_rating: intensity_rating,
                feeling: feeling,
                notes: notes,
            },
        }));
    }

    const updateWokoutLoad = () => {
        if (!todayWorkoutState || !userProfile) return;

        const totalLoad = workoutSession.exerciseSessions.reduce((totalEx, exSession) => {
            const exerciseLoad = exSession.sets?.reduce((totalSet, set) => {
                return totalSet + (set.load_set || 0);
            }, 0) || 0;
            return totalEx + exerciseLoad;
        }, 0);

        setWorkoutSession((prevSession) => ({
            ...prevSession,
            workoutSession: {
                ...prevSession.workoutSession,
                load_workout_total: totalLoad,
            },
        }));
    }

    const updateExerciseLoad = (currentExercise: number) => {
        if (!todayWorkoutState || !userProfile) return;

        setWorkoutSession((prevSession) => {
            const updatedExerciseSessions = [...prevSession.exerciseSessions];
            const currentExSession = updatedExerciseSessions[currentExercise];

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
    }

    const updateExerciseSet = (set: number, currentExercise: number, reps?: number, weight?: number,) => {

        if (!todayWorkoutState || !userProfile || !session?.user?.id) return;

        setWorkoutSession((prevSession) => {
            const updatedExerciseSessions = [...prevSession.exerciseSessions];
            const currentExSession = updatedExerciseSessions[currentExercise];
            if (!currentExSession.sets) return prevSession;
            if (reps) {
                currentExSession.sets[set] = {
                    id: session.user.id + "-" + todayWorkoutState?.exercises[currentExercise].id + "-" + new Date().toISOString() + "-set-" + set, // Gerar ou obter ID conforme necessário
                    exercise_session_id: currentExSession.exercise.id,
                    load_set: reps * (currentExSession.sets[set]?.weight_done || 0),
                    weight_done: currentExSession.sets[set]?.weight_done || 0,
                    reps_done: reps,
                    ref_set: set + 1,
                    created_at: new Date().toISOString(),
                };
            } else if (weight) {
                currentExSession.sets[set] = {
                    id: session.user.id + "-" + todayWorkoutState?.exercises[currentExercise].id + "-" + new Date().toISOString() + "-set-" + set, // Gerar ou obter ID conforme necessário
                    exercise_session_id: currentExSession.exercise.id,
                    load_set: weight * (currentExSession.sets[set]?.reps_done || 0),
                    weight_done: weight,
                    reps_done: currentExSession.sets[set]?.reps_done || 0,
                    ref_set: set + 1,
                    created_at: new Date().toISOString(),
                };
            }

            updatedExerciseSessions[currentExercise] = currentExSession;

            return {
                ...prevSession,
                exerciseSessions: updatedExerciseSessions,
            };
        });
    };

    const fetchWorkoutSession = async () => {
        if (!todayWorkoutState || !todayWorkoutState.id) return;

        try {
            if (!userProfile || !userData.currentPhase || !session?.user?.id) return;

            setWorkoutSession((prevState) => {
                prevState = {
                    workoutSession: {
                        id: session.user.id + "-" + todayWorkoutState.id + "-" + new Date().toISOString(), // Gerar ou obter ID conforme necessário
                        user_id: session.user.id, // Substitua conforme necessário
                        workout_id: todayWorkoutState.id,
                        session_date: new Date().toISOString(),
                        duration: prevState.workoutSession.duration || null,
                        actual_phase: userData.currentPhase,
                        intensity_rating: prevState.workoutSession.intensity_rating || null,
                        feeling: prevState.workoutSession.feeling || null,
                        notes: prevState.workoutSession.notes || null,
                        load_workout_total: prevState.workoutSession.load_workout_total || null,
                        created_at: new Date().toISOString(),
                    },
                    exerciseSessions: todayWorkoutState.exercises.map((exercise) => ({
                        exercise: {
                            id: session.user.id + "-" + exercise.id + "-" + new Date().toISOString(), // Gerar ou obter ID conforme necessário
                            session_id: todayWorkoutState.id,
                            exercise_session_id: exercise.id,
                            load_exercise_session: prevState.exerciseSessions.find(es => es.exercise.exercise_session_id === exercise.id)?.exercise.load_exercise_session || null,
                            created_at: new Date().toISOString(),
                        },
                        sets: [], // Inicialmente vazio; será preenchido conforme o usuário completa os sets
                    })),
                };
                return prevState
            });

        } catch (error) {
            console.error("Error fetching workout session:", error);
        }
    }

        useEffect(() => {
            fetchWorkoutSession();
        }, [todayWorkoutState]);

    return { exerciseRecords, workoutRecords, workoutSession, setWorkoutSession, updateExerciseSet, updatePRworkoutSession, updatePRExerciseSession, updateExerciseLoad, updateWokoutFeedBack, updateWokoutLoad, submitWorkoutSession  };
}
