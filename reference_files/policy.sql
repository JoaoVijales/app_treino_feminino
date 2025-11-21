

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_cycles ON user_profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY insert_cycles ON user_profiles
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY update_cycles ON user_profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY delete_cycles ON user_profiles
FOR DELETE TO public USING (false);



ALTER TABLE menstrual_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_cycles ON menstrual_cycles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY insert_cycles ON menstrual_cycles
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY update_cycles ON menstrual_cycles
FOR UPDATE USING (user_id = auth.uid());



ALTER TABLE cycle_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_cycle_logs ON cycle_logs
FOR SELECT USING (
  cycle_id IN (SELECT id FROM menstrual_cycles WHERE user_id = auth.uid())
);

CREATE POLICY insert_cycle_logs ON cycle_logs
FOR INSERT WITH CHECK (
  cycle_id IN (SELECT id FROM menstrual_cycles WHERE user_id = auth.uid())
);

CREATE POLICY update_cycle_logs ON cycle_logs
FOR UPDATE USING (
  cycle_id IN (SELECT id FROM menstrual_cycles WHERE user_id = auth.uid())
);



ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_exercises ON exercises
FOR SELECT USING (true);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_workouts ON workouts
FOR SELECT USING (true);



ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_workout_exercises ON workout_exercises
FOR SELECT USING (true);



ALTER TABLE user_workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_user_sessions ON user_workout_sessions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY insert_user_sessions ON user_workout_sessions
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY update_user_sessions ON user_workout_sessions
FOR UPDATE USING (user_id = auth.uid());



ALTER TABLE user_workout_exercise_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_user_exercise_sessions ON user_workout_exercise_sessions
FOR SELECT USING (
  session_id IN (SELECT id FROM user_workout_sessions WHERE user_id = auth.uid())
);

CREATE POLICY insert_user_exercise_sessions ON user_workout_exercise_sessions
FOR INSERT WITH CHECK (
  session_id IN (SELECT id FROM user_workout_sessions WHERE user_id = auth.uid())
);



ALTER TABLE user_workout_exercise_sessions_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_user_sets ON user_workout_exercise_sessions_sets
FOR SELECT USING (
  exercise_session_id IN (
    SELECT id FROM user_workout_exercise_sessions
    WHERE session_id IN (
      SELECT id FROM user_workout_sessions WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY insert_user_sets ON user_workout_exercise_sessions_sets
FOR INSERT WITH CHECK (
  exercise_session_id IN (
    SELECT id FROM user_workout_exercise_sessions
    WHERE session_id IN (
      SELECT id FROM user_workout_sessions WHERE user_id = auth.uid()
    )
  )
);


ALTER TABLE user_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_client_insert" ON user_plan
FOR INSERT
TO authenticated, anon
USING (false)
WITH CHECK (false);

CREATE POLICY "server_insert" ON user_plan
FOR INSERT
TO service_role
USING (true)
WITH CHECK (true);


