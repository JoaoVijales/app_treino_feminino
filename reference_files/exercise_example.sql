INSERT INTO exercise_catalog
(name, primary_muscle, equipment, level_difficulty, training_level, training_type, video_url, no_indicate)
VALUES

-- ========================
-- PESO CORPORAL
-- ========================
('Agachamento Livre', 'Quadríceps', 'peso-corporal', 'médio', 'iniciante', 'força', NULL, ARRAY['dor no joelho']),
('Agachamento Sumô', 'Glúteo / Adutores', 'peso-corporal', 'médio', 'iniciante', 'força', NULL, ARRAY[]),
('Avanço (Lunge)', 'Quadríceps', 'peso-corporal', 'médio', 'iniciante', 'força', NULL, ARRAY['dor no joelho']),
('Elevação de Quadril (Hip Thrust)', 'Glúteo', 'peso-corporal', 'leve', 'iniciante', 'força', NULL, ARRAY[]),
('Ponte de Glúteo Unilateral', 'Glúteo', 'peso-corporal', 'médio', 'intermediario', 'força', NULL, ARRAY['dor lombar']),
('Flexão de Braço', 'Peitoral / Tríceps', 'peso-corporal', 'médio', 'iniciante', 'força', NULL, ARRAY[]),
('Prancha', 'Core', 'peso-corporal', 'leve', 'iniciante', 'core', NULL, ARRAY['dor lombar']),
('Prancha Lateral', 'Core', 'peso-corporal', 'leve', 'iniciante', 'core', NULL, ARRAY[]),
('Polichinelo', 'Corpo inteiro', 'peso-corporal', 'médio', 'iniciante', 'cardio', NULL, ARRAY['cólica forte']),
('Mountain Climber', 'Core / Ombros', 'peso-corporal', 'alto', 'intermediario', 'cardio', NULL, ARRAY['cansaço extremo']),

-- ========================
-- COM PESO (HALTERES)
-- ========================
('Agachamento com Halteres', 'Quadríceps / Glúteo', 'halteres', 'médio', 'iniciante', 'força', NULL, ARRAY['dor no joelho']),
('Afundo com Halteres', 'Quadríceps / Glúteo', 'halteres', 'médio', 'intermediario', 'força', NULL, ARRAY[]),
('Levantamento Terra com Halteres', 'Posterior / Glúteo', 'halteres', 'alto', 'intermediario', 'força', NULL, ARRAY['dor lombar']),
('Elevação de Quadril com Halteres', 'Glúteo', 'halteres', 'médio', 'iniciante', 'força', NULL, ARRAY[]),
('Remada Curvada com Halteres', 'Dorsal / Bíceps', 'halteres', 'médio', 'iniciante', 'força', NULL, ARRAY['dor lombar']),
('Desenvolvimento de Ombros com Halteres', 'Ombros', 'halteres', 'médio', 'iniciante', 'força', NULL, ARRAY['dor no ombro']),
('Supino com Halteres', 'Peitoral', 'halteres', 'médio', 'iniciante', 'força', NULL, ARRAY[]),

-- ========================
-- ELÁSTICOS / FAIXAS
-- ========================
('Cadeira Abdutora com Faixa', 'Glúteo Médio', 'elastico', 'leve', 'iniciante', 'ativação', NULL, ARRAY[]),
('Glute Bridge com Faixa', 'Glúteo', 'elastico', 'leve', 'iniciante', 'ativação', NULL, ARRAY[]),
('Remada com Faixa', 'Dorsal / Bíceps', 'elastico', 'leve', 'iniciante', 'força', NULL, ARRAY[]),
('Puxada Frontal com Faixa', 'Dorsal / Ombros', 'elastico', 'médio', 'iniciante', 'força', NULL, ARRAY[]),
('Elevação Lateral com Faixa', 'Ombros', 'elastico', 'médio', 'iniciante', 'força', NULL, ARRAY['dor no ombro']),
('Kickback de Glúteo com Faixa', 'Glúteo Máximo', 'elastico', 'médio', 'iniciante', 'força', NULL, ARRAY[])
;





-- ================================
-- POPULAR TABELA exercises (75 itens)
-- ================================

INSERT INTO exercises (name, primary_muscle, equipment, level_difficulty, training_level, training_type, video_url, no_indicate) VALUES
-- FORÇA

--FORÇA (peso corporal) iniciante

--inferiores
('Agachamento sumô', 'adutores', 'peso corporal', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Agachamento com salto', 'quadríceps', 'peso corporal', 'alta', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Avanço alternado', 'glúteos', 'peso corporal', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Elevação de quadril (glute bridge)', 'glúteos', 'peso corporal', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Ponte de glúteo dupla', 'glúteos', 'peso corporal', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),

--superiores
('Flexão de braço tradicional', 'peito', 'peso corporal', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Flexão de braço com joelhos apoiados', 'peito', 'peso corporal', 'baixa', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Flexão de braço inclinada (mãos em superfície elevada)', 'peito', 'peso corporal', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Prancha frontal com apoio de joelhos', 'core', 'peso corporal', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),
('Prancha lateral com apoio de joelhos', 'core', 'peso corporal', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),

-- FORÇA (peso corporal) intermediario
--inferiores
('Agachamento búlgaro assistido', 'quadríceps', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY['dor joelho']),
('Avanço reverso', 'glúteos', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),
('Levantamento terra unilateral (single-leg deadlift)', 'posterior de coxa', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY['dor lombar']),
('Step-up em superfície elevada', 'quadríceps', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY['dor joelho']),
('Ponte de glúteo com uma perna elevada', 'glúteos', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),


-- FORÇA (peso corporal) intemediario
--inferiores
('Agachamento com salto pliométrico', 'quadríceps', 'peso corporal', 'alta', 'intermediario', 'força', NULL, ARRAY[]::text[]),
('Avanço com salto', 'glúteos', 'peso corporal', 'alta', 'intermediario', 'força', NULL, ARRAY[]::text[]),
('Levantamento terra unilateral com toque no chão', 'posterior de coxa', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY['dor lombar']),
('Step-up com salto', 'quadríceps', 'peso corporal', 'alta', 'intermediario', 'força', NULL, ARRAY['dor joelho']),
('Ponte de glúteo com elevação de pernas alternadas', 'glúteos', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),
('Afundo búlgaro unilateral (bodyweight)', 'glúteos', 'peso corporal', 'alta', 'intermediario', 'força', NULL, ARRAY['dor joelho']),
('Ponte de glúteo unilateral', 'glúteos', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),

--superiores
('Flexão de braço declinada', 'peito', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),
('Flexão de braço diamante', 'tríceps', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),






('Flexão de braço com elevação de pernas', 'peito', 'peso corporal', 'alta', 'avancado', 'força', NULL, ARRAY[]::text[]),
('Flexão de braço arqueiro', 'peito', 'peso corporal', 'alta', 'avancado', 'força', NULL, ARRAY[]::text[]),

('Flexão de braço com palmas', 'peito', 'peso corporal', 'alta', 'avancado', 'força', NULL, ARRAY[]::text[]),
('Agachamento pistol assistido', 'glúteos', 'peso corporal', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),
('Agachamento salto', 'quadríceps', 'peso corporal', 'alta', 'avancado', 'força', NULL, ARRAY[]::text[]),

('Elevação de quadril unilateral (bodyweight)', 'glúteos', 'peso corporal', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),






-- FORÇA (halteres)
('Agachamento com halteres', 'quadríceps', 'halteres', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Agachamento frontal com halteres', 'quadríceps', 'halteres', 'alta', 'avancado', 'força', NULL, ARRAY[]::text[]),
('Levantamento terra romano com halteres', 'posterior de coxa', 'halteres', 'alta', 'intermediario', 'força', NULL, ARRAY['dor lombar']),
('Elevacao de quadril com halteres', 'glúteos', 'halteres', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),
('Passada com halteres', 'glúteos', 'halteres', 'média', 'iniciante', 'força', NULL, ARRAY['dor joelho']),

-- FORÇA (elásticos)
('Agachamento com elástico (resistance band)', 'quadríceps', 'elásticos', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Good morning com elástico', 'posterior de coxa', 'elásticos', 'média', 'intermediario', 'força', NULL, ARRAY['dor lombar']),
('Glute bridge com elástico', 'glúteos', 'elásticos', 'média', 'iniciante', 'força', NULL, ARRAY[]::text[]),
('Stiff com elástico', 'posterior de coxa', 'elásticos', 'alta', 'avancado', 'força', NULL, ARRAY['dor lombar']),
('Avanço com elástico', 'quadríceps', 'elásticos', 'média', 'intermediario', 'força', NULL, ARRAY[]::text[]),

-- CONDICIONAMENTO (peso corporal)
('Burpee', 'corpo inteiro', 'peso corporal', 'alta', 'intermediario', 'condicionamento', NULL, ARRAY[]::text[]),
('Polichinelo', 'corpo inteiro', 'peso corporal', 'média', 'iniciante', 'condicionamento', NULL, ARRAY[]::text[]),
('Mountain climber', 'core', 'peso corporal', 'alta', 'intermediario', 'condicionamento', NULL, ARRAY[]::text[]),
('Corrida estacionária com elevação de joelhos', 'corpo inteiro', 'peso corporal', 'alta', 'avancado', 'condicionamento', NULL, ARRAY[]::text[]),
('Sprint curto (no lugar)', 'corpo inteiro', 'peso corporal', 'alta', 'avancado', 'condicionamento', NULL, ARRAY[]::text[]),

-- CONDICIONAMENTO (halteres)
('Swing com halteres', 'corpo inteiro', 'halteres', 'alta', 'intermediario', 'condicionamento', NULL, ARRAY['dor lombar']),
('Thruster com halteres', 'ombros', 'halteres', 'alta', 'avancado', 'condicionamento', NULL, ARRAY[]::text[]),
('Remada renegade (com halteres)', 'costas', 'halteres', 'alta', 'intermediario', 'condicionamento', NULL, ARRAY[]::text[]),
('Farmer carry com halteres', 'corpo inteiro', 'halteres', 'média', 'iniciante', 'condicionamento', NULL, ARRAY[]::text[]),
('Burpee com halteres leves', 'corpo inteiro', 'halteres', 'alta', 'avancado', 'condicionamento', NULL, ARRAY[]::text[]),

-- CONDICIONAMENTO (elásticos)
('Sprint com resistência elástica (puxando banda)', 'corpo inteiro', 'elásticos', 'alta', 'intermediario', 'condicionamento', NULL, ARRAY[]::text[]),
('Pular corda com elástico (simulação)', 'corpo inteiro', 'elásticos', 'alta', 'iniciante', 'condicionamento', NULL, ARRAY[]::text[]),
('Remada com elástico em alta repetição', 'costas', 'elásticos', 'média', 'iniciante', 'condicionamento', NULL, ARRAY[]::text[]),
('Kettlebell swing simulado com elástico', 'posterior de coxa', 'elásticos', 'alta', 'intermediario', 'condicionamento', NULL, ARRAY['dor lombar']),
('Agachamento com salto e banda', 'quadríceps', 'elásticos', 'alta', 'avancado', 'condicionamento', NULL, ARRAY[]::text[]),

-- ESTABILIDADE (peso corporal)
('Prancha frontal', 'core', 'peso corporal', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),
('Prancha lateral', 'core', 'peso corporal', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),
('Dead bug', 'core', 'peso corporal', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),
('Bird dog', 'core', 'peso corporal', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),
('Single leg balance (apoio)', 'core', 'peso corporal', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),

-- ESTABILIDADE (halteres)
('Farmer carry unilateral', 'core', 'halteres', 'média', 'intermediario', 'estabilidade', NULL, ARRAY[]::text[]),
('Prancha com haltere no lado (offset)', 'core', 'halteres', 'média', 'intermediario', 'estabilidade', NULL, ARRAY[]::text[]),
('Overhead carry com halteres', 'ombros', 'halteres', 'média', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),
('Turkish get-up (modificado com halteres)', 'core', 'halteres', 'alta', 'avancado', 'estabilidade', NULL, ARRAY['dor lombar']),
('Single-leg Romanian deadlift com halteres', 'posterior de coxa', 'halteres', 'alta', 'intermediario', 'estabilidade', NULL, ARRAY['dor lombar']),

-- ESTABILIDADE (elásticos)
('Pallof press com elástico', 'core', 'elásticos', 'média', 'intermediario', 'estabilidade', NULL, ARRAY[]::text[]),
('Marcha lateral com banda (mini-band)', 'glúteos', 'elásticos', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),
('Resistive single-leg stand', 'core', 'elásticos', 'média', 'intermediario', 'estabilidade', NULL, ARRAY[]::text[]),
('Clamshell com banda', 'glúteos', 'elásticos', 'baixa', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),
('Quadruped band row (estabilidade)', 'costas', 'elásticos', 'média', 'iniciante', 'estabilidade', NULL, ARRAY[]::text[]),

-- POTÊNCIA (peso corporal)
('Salto vertical (countermovement)', 'corpo inteiro', 'peso corporal', 'alta', 'avancado', 'potência', NULL, ARRAY[]::text[]),
('Salto em profundidade (box jump progressivo)', 'corpo inteiro', 'peso corporal', 'alta', 'avancado', 'potência', NULL, ARRAY['joelho']),
('Skater hop', 'corpo inteiro', 'peso corporal', 'alta', 'intermediario', 'potência', NULL, ARRAY[]::text[]),
('Jump squat', 'quadríceps', 'peso corporal', 'alta', 'intermediario', 'potência', NULL, ARRAY[]::text[]),
('Broad jump (progres.)', 'corpo inteiro', 'peso corporal', 'alta', 'avancado', 'potência', NULL, ARRAY[]::text[]),

-- POTÊNCIA (halteres)
('Power clean modificado com halteres', 'corpo inteiro', 'halteres', 'alta', 'avancado', 'potência', NULL, ARRAY['dor lombar']),
('Swing explosivo com halteres', 'posterior de coxa', 'halteres', 'alta', 'intermediario', 'potência', NULL, ARRAY['dor lombar']),
('Push press com halteres', 'ombros', 'halteres', 'alta', 'avancado', 'potência', NULL, ARRAY[]::text[]),
('Jump lunge com halteres leves', 'quadríceps', 'halteres', 'alta', 'avancado', 'potência', NULL, ARRAY['joelho']),
('Kettlebell swing (com halteres substit.)', 'posterior de coxa', 'halteres', 'alta', 'intermediario', 'potência', NULL, ARRAY['dor lombar']),

-- POTÊNCIA (elásticos)
('Sprint com elástico de resistência', 'corpo inteiro', 'elásticos', 'alta', 'intermediario', 'potência', NULL, ARRAY[]::text[]),
('Saltos laterais com banda', 'corpo inteiro', 'elásticos', 'alta', 'intermediario', 'potência', NULL, ARRAY[]::text[]),
('Explosão de cadeira (band assisted jump)', 'quadríceps', 'elásticos', 'alta', 'avancado', 'potência', NULL, ARRAY['joelho']),
('Band resisted broad jump', 'corpo inteiro', 'elásticos', 'alta', 'avancado', 'potência', NULL, ARRAY[]::text[]),
('Band squat jump (assisted)', 'quadríceps', 'elásticos', 'alta', 'intermediario', 'potência', NULL, ARRAY[]::text[]),

-- RECUPERAÇÃO ATIVA (peso corporal)
('Caminhada leve', 'corpo inteiro', 'peso corporal', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Yoga flow suave', 'corpo inteiro', 'peso corporal', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Alongamento de isquiotibiais', 'posterior de coxa', 'peso corporal', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Mobilidade de quadril dinâmica', 'quadril', 'peso corporal', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Rolamento miofascial leve (self-massage)', 'corpo inteiro', 'peso corporal', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),

-- RECUPERAÇÃO ATIVA (halteres)
('Dead bug com halteres leves (mobilidade ativa)', 'core', 'halteres', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Farmer carry leve (descompressão)', 'corpo inteiro', 'halteres', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Pullover leve com halteres (mobilidade torácica)', 'peito', 'halteres', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Good morning leve com halteres (mobilidade posterior)', 'posterior de coxa', 'halteres', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY['dor lombar']),
('Elevacao de ombro controlada com halteres leves', 'ombros', 'halteres', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),

-- RECUPERAÇÃO ATIVA (elásticos)
('Alongamento com banda (ombros e peitoral)', 'ombros', 'elásticos', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Caminhada com banda para suporte (assistida)', 'corpo inteiro', 'elásticos', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Mobilidade de quadril com elástico', 'quadril', 'elásticos', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Alongamento dinâmico com banda (posterior de coxa)', 'posterior de coxa', 'elásticos', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]),
('Ativação de glúteo com mini-band', 'glúteos', 'elásticos', 'baixa', 'iniciante', 'recuperação ativa', NULL, ARRAY[]::text[]);

