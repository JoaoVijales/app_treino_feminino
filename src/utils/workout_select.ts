function selectWorkoutPlan(phase: string) {
    workouts_phase = api.getWorkoutPlan(phase);
    workout_lasted = api.getWorkoutLasted();
    for (workout in  workouts_phase) {
        if (workout not in workout_lasted) {
            return workout;
        }
    }
    return null;
}