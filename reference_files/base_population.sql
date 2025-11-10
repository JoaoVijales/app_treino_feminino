-- FASE 1 — Menstruação (Dias 1–5)
INSERT INTO exercises (name, primary_muscle, equipment, level_difficulty, training_level, training_type, video_url, no_indicate) VALUES
-- Peso Corporal — Dia 1: Mobilidade + Core
('Respiração profunda (2 min)', 'respiração', 'peso corporal', 'leve', 'iniciante', 'respiração', NULL, 'Evitar se houver dificuldade respiratória ou tontura.'),
('Glute bridge', 'glúteos', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco ativa.'),
('Bird dog', 'core', 'peso corporal', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar se houver dor lombar ou instabilidade na coluna.'),
('Prancha com joelho', 'core', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor nos ombros ou no quadril.'),
('Alongamento lombar e quadril', 'mobilidade', 'peso corporal', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar movimentos bruscos se houver dor lombar ou hérnia.'),
-- Peso Corporal — Dia 2: Movimento leve
('Agachamento parcial', 'quadríceps', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou lesão meniscal.'),
('Elevação de panturrilha', 'panturrilhas', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no tornozelo ou tendinite aquileana.'),
('Ponte de glúteo com apoio', 'glúteos', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou lesão na coluna.'),
('Prancha lateral com apoio', 'core', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor nos ombros ou instabilidade lateral do tronco.'),
('Alongamento costas e pescoço', 'mobilidade', 'peso corporal', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar movimentos bruscos se houver dor cervical ou lombar.'),
-- Peso Corporal — Dia 3: Recuperação ativa
('Caminhada leve 20min ou alongamento guiado', 'cardio', 'peso corporal', 'leve', 'iniciante', 'cardio', NULL, 'Evitar se houver tontura intensa, sangramento abundante ou dor abdominal intensa.'),
('Mobilidade de coluna (cat-cow, rotação)', 'mobilidade', 'peso corporal', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar se houver dor lombar aguda ou hérnia de disco.'),
('Postura da criança (yoga)', 'mobilidade', 'peso corporal', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar se houver dor nos joelhos ou quadris.'),
-- Elásticos — Dia 1: Glúteos e quadril
('Glute bridge com banda leve', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco ativa.'),
('Marcha lateral', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no quadril ou joelho.'),
('Abdução de quadril', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no quadril ou lesão labral.'),
('Alongamento posterior', 'mobilidade', 'elásticos', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar movimentos bruscos se houver dor lombar.'),
-- Elásticos — Dia 2: Costas e braços
('Remada elástica', 'costas', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou síndrome do impacto.'),
('Pull apart', 'ombros', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor nos ombros ou tendinite.'),
('Curl bíceps elástico', 'bíceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no cotovelo ou tendinite.'),
('Alongamento ombros', 'mobilidade', 'elásticos', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar movimentos bruscos se houver dor ou lesão nos ombros.'),
-- Elásticos — Dia 3: Corpo todo leve
('Agachamento banda leve', 'quadríceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou lesão meniscal.'),
('Elevação de braços frontal banda', 'ombros', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor nos ombros ou instabilidade articular.'),
('Glute kickback', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou quadril.'),
('Respiração + relaxamento', 'respiração', 'elásticos', 'leve', 'iniciante', 'respiração', NULL, 'Evitar se houver dificuldade respiratória ou tontura.'),
-- Halteres — Dia 1: Corpo inferior leve
('Agachamento goblet leve', 'quadríceps', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou lombar.'),
('Passada no lugar', 'quadríceps', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou instabilidade articular.'),
('Elevação de quadril com haltere', 'glúteos', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
('Alongamento posterior', 'mobilidade', 'halteres', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar se houver dor lombar.'),
-- Halteres — Dia 2: Corpo superior leve
('Remada leve', 'costas', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou síndrome do impacto.'),
('Desenvolvimento leve', 'ombros', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor nos ombros ou instabilidade articular.'),
('Rosca bíceps', 'bíceps', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no cotovelo ou tendinite.'),
('Alongamento braço/peito', 'mobilidade', 'halteres', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar movimentos bruscos se houver dor nos ombros ou cotovelos.'),
-- Halteres — Dia 3: Mobilidade + respiração
('Alongamentos dinâmicos', 'mobilidade', 'halteres', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar se houver dor lombar ou articular.'),
('Caminhada 20min', 'cardio', 'halteres', 'leve', 'iniciante', 'cardio', NULL, 'Evitar se houver tontura intensa ou dor abdominal.'),
('Prancha leve (2x20s)', 'core', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou instabilidade no tronco.');



-- FASE 2 — Folicular (Dias 6–12)
INSERT INTO exercises (name, primary_muscle, equipment, level_difficulty, training_level, training_type, video_url, no_indicate) VALUES
-- Peso Corporal — Dia 1: Força leve (inferior)
('Agachamento completo', 'quadríceps', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho, lesão meniscal ou instabilidade articular.'),
('Afundo alternado', 'quadríceps/glúteos', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho, instabilidade ou lesão lombar.'),
('Ponte de glúteo', 'glúteos', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
('Prancha', 'core', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar, ombros ou instabilidade no tronco.'),
-- Peso Corporal — Dia 2: Core + Superior
('Flexão inclinada', 'peito', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou instabilidade articular.'),
('Superman', 'costas', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
('Prancha lateral', 'core', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor nos ombros ou instabilidade lateral do tronco.'),
('Abdominal invertido', 'core', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
-- Peso Corporal — Dia 3: Condicionamento leve
('Jumping jacks', 'cardio', 'peso corporal', 'leve', 'iniciante', 'cardio', NULL, 'Evitar se houver dor no joelho, tornozelo ou hipertensão descompensada.'),
('Agachamento', 'quadríceps', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou instabilidade articular.'),
('Prancha', 'core', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar, ombros ou instabilidade no tronco.'),
-- Elásticos — Dia 1: Glúteos e pernas
('Agachamento banda média', 'quadríceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou instabilidade articular.'),
('Extensão de quadril', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou quadril.'),
('Ponte de glúteo', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
('Abdução lateral', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no quadril ou instabilidade lateral.'),
-- Elásticos — Dia 2: Costas e braços
('Remada elástica', 'costas', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou síndrome do impacto.'),
('Tríceps overhead', 'tríceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou cotovelo.'),
('Curl bíceps', 'bíceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no cotovelo ou tendinite.'),
('Core: prancha banda', 'core', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou instabilidade no tronco.'),
-- Elásticos — Dia 3: Full Body
('Agachamento banda', 'quadríceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou instabilidade articular.'),
('Remada', 'costas', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou síndrome do impacto.'),
('Glute kickback', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou quadril.'),
('Alongamento geral', 'mobilidade', 'elásticos', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar movimentos bruscos se houver dor lombar ou articular.'),
-- Halteres — Dia 1: Inferior
('Agachamento goblet', 'quadríceps', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou lombar.'),
('Afundo reverso', 'quadríceps/glúteos', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou lombar.'),
('Elevação de quadril com haltere', 'glúteos', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
('Panturrilha', 'panturrilhas', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no tornozelo ou tendinite aquileana.'),
-- Halteres — Dia 2: Superior
('Remada unilateral', 'costas', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou instabilidade articular.'),
('Desenvolvimento', 'ombros', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor nos ombros ou instabilidade articular.'),
('Rosca bíceps', 'bíceps', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no cotovelo ou tendinite.'),
('Tríceps testa', 'tríceps', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou cotovelo.'),
-- Halteres — Dia 3: Full Body
('Agachamento + press', 'quadríceps/ombros', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho, lombar ou ombro.'),
('Deadlift romeno leve', 'posterior de coxa', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
('Prancha', 'core', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou instabilidade no tronco.');


-- FASE 3 — Ovulação (Dias 13–15)
INSERT INTO exercises (name, primary_muscle, equipment, level_difficulty, training_level, training_type, video_url, no_indicate) VALUES
-- Peso Corporal — Dia 1: Força + Potência
('Agachamento salto', 'quadríceps/glúteos', 'peso corporal', 'moderada', 'intermediário', 'força/potência', NULL, 'Evitar se houver dor no joelho, tornozelo, instabilidade articular ou hipertensão não controlada.'),
('Flexão', 'peito/ombros', 'peso corporal', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no ombro, punho ou instabilidade articular.'),
('Afundo saltando', 'quadríceps/glúteos', 'peso corporal', 'moderada', 'intermediário', 'força/potência', NULL, 'Evitar se houver dor no joelho, lombar ou instabilidade articular.'),
('Prancha com toque', 'core', 'peso corporal', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar ou instabilidade no tronco.'),
-- Peso Corporal — Dia 2: Core dinâmico
('Mountain climbers', 'core/cardia', 'peso corporal', 'moderada', 'intermediário', 'força/cardio', NULL, 'Evitar se houver dor no ombro, punho, joelho ou hipertensão não controlada.'),
('Prancha lateral', 'core', 'peso corporal', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor nos ombros ou instabilidade lateral do tronco.'),
('Abdominal bicicleta', 'core', 'peso corporal', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
('Ponte de glúteo', 'glúteos', 'peso corporal', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
-- Peso Corporal — Dia 3: HIIT leve (curto)
('Agachamento salto', 'quadríceps/glúteos', 'peso corporal', 'moderada', 'intermediário', 'força/potência', NULL, 'Evitar se houver dor no joelho, tornozelo, instabilidade articular ou hipertensão não controlada.'),
('Flexão', 'peito/ombros', 'peso corporal', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no ombro, punho ou instabilidade articular.'),
('Prancha', 'core', 'peso corporal', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar ou instabilidade no tronco.'),
-- Elásticos — Dia 1: Força inferior
('Agachamento banda forte', 'quadríceps/glúteos', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no joelho, quadril ou instabilidade articular.'),
('Stiff banda', 'posterior de coxa/glúteos', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
('Ponte de glúteo', 'glúteos', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
('Abdução', 'glúteos', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no quadril ou instabilidade lateral.'),
-- Elásticos — Dia 2: Upper Power
('Remada banda forte', 'costas', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no ombro ou síndrome do impacto.'),
('Push press elástico', 'ombros', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor nos ombros, instabilidade articular ou hipertensão descontrolada.'),
('Curl + overhead press', 'bíceps/ombros', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor nos ombros ou cotovelos.'),
-- Elásticos — Dia 3: Circuito Full
('Agachamento banda', 'quadríceps/glúteos', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no joelho ou instabilidade articular.'),
('Remada banda', 'costas', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no ombro ou síndrome do impacto.'),
('Ponte glúteo', 'glúteos', 'elásticos', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
-- Halteres — Dia 1: Inferior força
('Agachamento goblet moderado', 'quadríceps/glúteos', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no joelho ou lombar.'),
('Stiff halteres', 'posterior de coxa/glúteos', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
('Passada', 'quadríceps/glúteos', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no joelho, quadril ou lombar.'),
('Panturrilha', 'panturrilhas', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no tornozelo ou tendinite aquileana.'),
-- Halteres — Dia 2: Superior forte
('Remada unilateral', 'costas', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no ombro ou instabilidade articular.'),
('Desenvolvimento', 'ombros', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor nos ombros ou instabilidade articular.'),
('Rosca direta', 'bíceps', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no cotovelo ou tendinite.'),
('Tríceps testa', 'tríceps', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor no ombro ou cotovelo.'),
-- Halteres — Dia 3: Full Power
('Agachamento + press', 'quadríceps/ombros', 'halteres', 'moderada', 'intermediário', 'força/potência', NULL, 'Evitar se houver dor no joelho, lombar ou ombro.'),
('Deadlift leve', 'posterior de coxa', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
('Prancha com haltere', 'core', 'halteres', 'moderada', 'intermediário', 'força', NULL, 'Evitar se houver dor lombar ou instabilidade no tronco.');


-- FASE 4 — Lútea (Dias 16–28)
INSERT INTO exercises (name, primary_muscle, equipment, level_difficulty, training_level, training_type, video_url, no_indicate) VALUES
-- Peso Corporal — Dia 1: Controle
('Agachamento lento (3s descida)', 'quadríceps/glúteos', 'peso corporal', 'leve', 'iniciante', 'força/controle', NULL, 'Evitar se houver dor no joelho ou lombar, instabilidade articular ou fadiga intensa.'),
('Glute bridge', 'glúteos', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
('Bird dog', 'core/glúteos', 'peso corporal', 'leve', 'iniciante', 'força/estabilidade', NULL, 'Evitar se houver dor lombar ou instabilidade do tronco.'),
('Alongamento', 'flexibilidade geral', 'peso corporal', 'leve', 'iniciante', 'alongamento', NULL, 'Evitar movimentos que causem dor ou desconforto articular.'),
-- Peso Corporal — Dia 2: Core e postura
('Prancha', 'core', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar intensa ou instabilidade do tronco.'),
('Superman', 'costas/glúteos', 'peso corporal', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou hérnia de disco.'),
('Círculo de quadril', 'quadril/core', 'peso corporal', 'leve', 'iniciante', 'mobilidade', NULL, 'Evitar movimentos que causem dor no quadril ou lombar.'),
('Alongamento costas', 'flexibilidade costas', 'peso corporal', 'leve', 'iniciante', 'alongamento', NULL, 'Evitar movimentos que aumentem dor ou tensão na lombar.'),
-- Peso Corporal — Dia 3: Mobilidade geral
('Sequência yoga leve (15–20min)', 'flexibilidade geral', 'peso corporal', 'leve', 'iniciante', 'mobilidade/relaxamento', NULL, 'Evitar posturas que causem dor ou tontura.'),
-- Elásticos — Dia 1: Inferior leve
('Agachamento banda leve', 'quadríceps/glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho, quadril ou lombar.'),
('Ponte glúteo', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
('Marcha lateral', 'glúteos/quadríceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no quadril ou instabilidade lateral.'),
('Alongamento posterior', 'posterior de coxa/glúteos', 'elásticos', 'leve', 'iniciante', 'alongamento', NULL, 'Evitar movimentos que causem dor ou lesão muscular.'),
-- Elásticos — Dia 2: Superior leve
('Remada elástica', 'costas/braços', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou síndrome do impacto.'),
('Tríceps banda leve', 'tríceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou cotovelo.'),
('Curl leve', 'bíceps', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no cotovelo ou tendinite.'),
-- Elásticos — Dia 3: Corpo inteiro fluido
('Agachamento + remada', 'quadríceps/costas', 'elásticos', 'leve', 'iniciante', 'força/full body', NULL, 'Evitar se houver dor em joelho, ombro ou lombar.'),
('Glute kickback', 'glúteos', 'elásticos', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar ou instabilidade do quadril.'),
('Respiração guiada', 'relaxamento', 'elásticos', 'leve', 'iniciante', 'relaxamento', NULL, 'Evitar se houver problemas respiratórios agudos.'),
-- Halteres — Dia 1: Inferior leve
('Agachamento goblet leve', 'quadríceps/glúteos', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho ou lombar.'),
('Passada', 'quadríceps/glúteos', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no joelho, quadril ou lombar.'),
('Ponte glúteo', 'glúteos', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor lombar intensa ou hérnia de disco.'),
-- Halteres — Dia 2: Superior leve
('Remada leve', 'costas', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou instabilidade articular.'),
('Rosca leve', 'bíceps', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no cotovelo ou tendinite.'),
('Elevação lateral', 'ombros', 'halteres', 'leve', 'iniciante', 'força', NULL, 'Evitar se houver dor no ombro ou instabilidade articular.'),
-- Halteres — Dia 3: Mobilidade + alongamento
('Alongamento ativo + respiração', 'flexibilidade/relaxamento', 'halteres', 'leve', 'iniciante', 'alongamento/relaxamento', NULL, 'Evitar movimentos que causem dor ou tontura.'),
('Caminhada 20–25min', 'cardio leve', 'peso corporal', 'leve', 'iniciante', 'condicionamento', NULL, 'Evitar se houver fadiga extrema, dor nas articulações ou problemas cardíacos agudos.');
