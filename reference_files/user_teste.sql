-- ================
-- USUÁRIO DE TESTE
-- ================
-- Firebase UID fictício: 'test_user_001'
INSERT INTO users (id, email, created_at) VALUES (
  'test_user_001',
    'teste.flowfit@example.com',
    now()
);

INSERT INTO user_profiles (
  id, name, goal, equipment, cycle_regular, last_period, cycle_length, onboarding_completed, created_at, updated_at
) VALUES (
  'test_user_001',
  'Mariana Teste',
  'força',
  ARRAY['halteres', 'peso corporal'],
  'sim',
  -- último período registrado (use esse para calcular fase atual)
  '2025-11-02',
  28,
  true,
  now() - interval '60 days',
  now()
);

-- =========================
-- HISTÓRICO DE CICLOS (ex.: últimos 4 ciclos)
-- =========================
INSERT INTO menstrual_cycles (id, user_id, start_date, end_date, cycle_length, symptoms, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'test_user_001', '2025-11-02', NULL, 28, ARRAY['leve cólica','sono alterado'], now() - interval '8 days'),
  ('22222222-2222-2222-2222-222222222222', 'test_user_001', '2025-10-05', '2025-10-11', 30, ARRAY['fluxo intenso','cansaço'], now() - interval '35 days'),
  ('33333333-3333-3333-3333-333333333333', 'test_user_001', '2025-09-05', '2025-09-11', 28, ARRAY['náusea leve'], now() - interval '65 days'),
  ('44444444-4444-4444-4444-444444444444', 'test_user_001', '2025-08-07', '2025-08-13', 28, ARRAY[]::text[], now() - interval '95 days');

-- =========================
-- SESSÕES DE TREINO (histórico)  -- 3 sessões exemplo (você pode adicionar mais)
-- =========================
-- NOTA: workout_id pode ser NULL se quiser apenas testar feedback pipeline.
INSERT INTO user_workout_sessions (
  id, user_id, workout_id, session_date, intensity_rating, feeling, notes, created_at
) VALUES
  ('aaaaaaa1-0000-4000-8000-aaaaaaaaaaa1', 'test_user_001', NULL, '2025-11-04', 6, 'energized', 'Consegui seguir tudo, senti um pouco de tensão no final.', now() - interval '6 days'),
  ('aaaaaaa2-0000-4000-8000-aaaaaaaaaaa2', 'test_user_001', NULL, '2025-10-28', 8, 'tired', 'Treino pesado, senti mais cansaço que o normal.', now() - interval '13 days'),
  ('aaaaaaa3-0000-4000-8000-aaaaaaaaaaa3', 'test_user_001', NULL, '2025-10-21', 4, 'strong', 'Treino tranquilo, pude aumentar um pouco a carga.', now() - interval '20 days');

-- =========================
-- LOGS DETALHADOS DE EXERCÍCIOS (opcional) -- vinculados às sessões acima
-- =========================
INSERT INTO user_workout_exercise_logs (
  id, session_id, exercise_id, load, reps_done, created_at
) VALUES
  ('bbb11111-0000-4000-8000-bbbbbbbbbbb1', 'aaaaaaa1-0000-4000-8000-aaaaaaaaaaa1', NULL, NULL, NULL, now() - interval '6 days'),
  ('bbb22222-0000-4000-8000-bbbbbbbbbbb2', 'aaaaaaa2-0000-4000-8000-aaaaaaaaaaa2', NULL, NULL, NULL, now() - interval '13 days'),
  ('bbb33333-0000-4000-8000-bbbbbbbbbbb3', 'aaaaaaa3-0000-4000-8000-aaaaaaaaaaa3', NULL, NULL, NULL, now() - interval '20 days');

-- =========================
-- EXEMPLO DE USO: consulta para ver o usuário + últimos ciclos + últimos feedbacks
-- =========================
-- Usuário:
SELECT * FROM user_profiles WHERE id = 'test_user_001';

-- Últimos ciclos:
SELECT * FROM menstrual_cycles WHERE user_id = 'test_user_001' ORDER BY start_date DESC;

-- Últimas sessões / feedbacks:
SELECT * FROM user_workout_sessions WHERE user_id = 'test_user_001' ORDER BY session_date DESC;
