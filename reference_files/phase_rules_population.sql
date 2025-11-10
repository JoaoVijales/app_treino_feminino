UPDATE cycle_phase_rules SET duration_days_base = 5 WHERE phase = 'menstrual';
UPDATE cycle_phase_rules SET duration_days_base = 9 WHERE phase = 'folicular'; -- 28 - 14 - 5 = 9 (ajustável)
UPDATE cycle_phase_rules SET duration_days_base = 2 WHERE phase = 'ovulatoria';
UPDATE cycle_phase_rules SET duration_days_base = 14 WHERE phase = 'lutea';