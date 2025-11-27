"use client";
import { useFlowFit } from "../context/FlowFitContext";
import { useEffect, useState, useCallback } from "react";
import { FullWorkoutSession, UserWorkoutSession, UserWorkoutExerciseSessions, UserWorkoutExerciseSets } from "../types/supabase";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating IDs
import {
    addUserWorkoutSession,
    addUserWorkoutExerciseSessions,
    addUserWorkoutExerciseSets,
    updateUserWorkoutExerciseSets,
    getUserWorkoutExerciseSessions,
    getUserWorkoutExerciseSets,
    updateUserWorkoutSession,
    getExerciseById,
    getWorkouExercises
} from "../utils/api";

interface WorkoutSessionState {
    currentWorkoutSession: FullWorkoutSession | null;
    startWorkoutSession: (workoutId: string) => Promise<void>;
    addExerciseSet: (
        exerciseSessionId: string,
        weight: number,
        reps: number
    ) => Promise<void>;
    updateExerciseSet: (
        exerciseSessionId: string, // Changed from setId: string
        setId: string,
        newWeight: number | undefined,
        newReps: number | undefined
    ) => Promise<void>;
    finishWorkoutSession: (
        intensity: number,
        feeling: string,
        notes: string
    ) => Promise<void>;
    updateExerciseLoad: (exerciseIndex: number) => Promise<void>;
    updateWorkoutLoad: () => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const useWorkoutSession = (): WorkoutSessionState => {
    const { userProfile, currentWorkout, currentPhase, loading: contextLoading, error: contextError } = useFlowFit();
    const [currentWorkoutSession, setCurrentWorkoutSession] = useState<FullWorkoutSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startWorkoutSession = useCallback(async (workoutId: string) => {
        if (!userProfile?.id || !currentPhase) {
            setError("User not logged in or cycle phase not determined.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Corrected call to addUserWorkoutSession
            const newSession = await addUserWorkoutSession({
                id: uuidv4(), // Generate UUID for the new session
                user_id: userProfile.id,
                workout_id: workoutId,
                session_date: new Date().toISOString(),
                actual_phase: currentPhase,
                duration: 0, // Default value
                intensity_rating: 0, // Default value
                feeling: null, // Default value
                notes: null, // Default value
                load_workout_total: 0, // Default value
                created_at: new Date().toISOString(), // Default value
            });

            if (!newSession) {
                throw new Error("Failed to create new workout session.");
            }

            // Fetch workout details to pre-populate exercises
            const exercises = await getWorkouExercises(workoutId);

            if (!exercises) {
                throw new Error("Failed to fetch exercises for workout.");
            }

            const exerciseSessionsData = exercises.map(ex => ({
                id: uuidv4(), // Generate UUID for UserWorkoutExerciseSessions
                session_id: newSession.id,
                exercise_session_id: ex.exercise_id, // Map ex.exercise_id to exercise_session_id
                load_exercise_session: 0, // Default value
                created_at: new Date().toISOString(), // Default value
            }));

            // Corrected call to addUserWorkoutExerciseSessions
            const newExerciseSessions = await addUserWorkoutExerciseSessions(exerciseSessionsData);

            if (!newExerciseSessions) {
                throw new Error("Failed to add exercise sessions.");
            }

            const exerciseSessionsWithSets = newExerciseSessions.map(newEs => ({
                exercise: newEs,
                sets: [],
            }));


            setCurrentWorkoutSession({
                workoutSession: newSession,
                exerciseSessions: exerciseSessionsWithSets,
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userProfile, currentPhase]);

    const addExerciseSet = useCallback(async (exerciseSessionId: string, weight: number, reps: number) => {
        setLoading(true);
        setError(null);
        try {
            const newSet = await addUserWorkoutExerciseSets([{
                id: uuidv4(), // Generate UUID for UserWorkoutExerciseSets
                exercise_session_id: exerciseSessionId,
                load_set: 0, // Default value
                weight_done: weight,
                reps_done: reps,
                ref_set: 0, // Need to determine ref_set based on existing sets for this exercise_session_id
                created_at: new Date().toISOString(), // Default value
            }]);

            if (!newSet || newSet.length === 0) {
                throw new Error("Failed to add exercise set.");
            }

            setCurrentWorkoutSession((prev) => {
                if (!prev) return null;
                const updatedExerciseSessions = prev.exerciseSessions.map((es) => {
                    if (es.exercise.id === exerciseSessionId) {
                        return {
                            ...es,
                            sets: [...es.sets || [], newSet[0]],
                        };
                    }
                    return es;
                });
                return { ...prev, exerciseSessions: updatedExerciseSessions };
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExerciseSet = useCallback(async (exerciseSessionId: string, setId: string, newWeight: number | undefined, newReps: number | undefined) => {
        setLoading(true);
        setError(null);
        try {
            // Call updateUserWorkoutExerciseSets with partial update object
            const updatedSet = await updateUserWorkoutExerciseSets(setId, { weight_done: newWeight, reps_done: newReps });

            if (!updatedSet) {
                throw new Error("Failed to update exercise set.");
            }

            setCurrentWorkoutSession((prev) => {
                if (!prev) return null;
                const updatedExerciseSessions = prev.exerciseSessions.map((es) => {
                    if (es.exercise.id === exerciseSessionId) {
                        const updatedSets = es.sets?.map((set) =>
                            set.id === setId ? updatedSet : set
                        );
                        return { ...es, sets: updatedSets };
                    }
                    return es;
                });
                return { ...prev, exerciseSessions: updatedExerciseSessions };
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const finishWorkoutSession = useCallback(async (intensity: number, feeling: string, notes: string) => {
        console.log('finishWorkoutSession called');
        console.log('currentWorkoutSession:', currentWorkoutSession);

        if (!currentWorkoutSession?.workoutSession.id) {
            console.log('Condition !currentWorkoutSession?.workoutSession.id met. currentWorkoutSession is null or missing id.');
            setError("No active workout session to finish.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const updatedSession = await updateUserWorkoutSession(currentWorkoutSession.workoutSession.id, intensity, feeling, notes);
            console.log('updateUserWorkoutSession result:', updatedSession);
            if (updatedSession) {
                setCurrentWorkoutSession(null); // Clear the active session
                console.log('currentWorkoutSession cleared.');
            } else {
                console.log('updateUserWorkoutSession returned null, not clearing session.');
                setError("Failed to update workout session in DB.");
            }
        } catch (err: any) {
            console.error('Error during finishWorkoutSession:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            console.log('finishWorkoutSession finished.');
        }
    }, [currentWorkoutSession]);

    const updateExerciseLoad = useCallback(async (exerciseIndex: number) => {
        // Placeholder implementation
        console.log(`Updating load for exercise at index: ${exerciseIndex}`);
        // Here you would typically calculate and update the load for the specific exercise
        // based on sets, reps, weight, and then call an API to persist it.
        // For now, just a placeholder.
    }, []);

    const updateWorkoutLoad = useCallback(async () => {
        // Placeholder implementation
        console.log('Updating total workout load.');
        // Here you would typically calculate the total load for the entire workout session
        // and then call an API to persist it.
        // For now, just a placeholder.
    }, []);


    return {
        currentWorkoutSession,
        startWorkoutSession,
        addExerciseSet,
        updateExerciseSet,
        finishWorkoutSession,
        updateExerciseLoad,
        updateWorkoutLoad,
        loading,
        error,
    };
};