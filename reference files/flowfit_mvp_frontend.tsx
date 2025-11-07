import React, { useState } from 'react';
import { Activity, Home, BarChart3, Settings, ChevronRight, Play, Check, X, Calendar, Zap, Moon, Sun, Droplet, Heart, TrendingUp, Clock, Target, Info, ChevronLeft, Pause } from 'lucide-react';

const FlowFitApp = () => {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    goal: '',
    equipment: [],
    cycleRegular: '',
    lastPeriod: '',
    currentPhase: 'folicular',
    cycleDay: 10
  });
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timer, setTimer] = useState(45);
  const [isPaused, setIsPaused] = useState(false);

  const cyclePhases = {
    menstrual: { name: 'Menstrual', icon: Droplet, color: 'rose', emoji: '🩸' },
    folicular: { name: 'Folicular', icon: Zap, color: 'green', emoji: '⚡' },
    ovulatoria: { name: 'Ovulatória', icon: Sun, color: 'amber', emoji: '☀️' },
    lutea: { name: 'Lútea', icon: Moon, color: 'purple', emoji: '🌙' }
  };

  const todayWorkout = {
    title: 'Força + Cardio Moderado',
    duration: '35 min',
    intensity: 'Moderada-Alta',
    reason: 'Sua energia está no pico! Seu corpo responde super bem a treinos intensos agora.',
    exercises: [
      { name: 'Agachamento', sets: '3x12', rest: '45s', video: '🎥' },
      { name: 'Flexão Inclinada', sets: '3x10', rest: '45s', video: '🎥' },
      { name: 'Afundo Alternado', sets: '3x10', rest: '45s', video: '🎥' },
      { name: 'Prancha', sets: '3x30s', rest: '30s', video: '🎥' },
      { name: 'Burpees', sets: '3x8', rest: '60s', video: '🎥' }
    ]
  };

  const weekProgress = [
    { day: 'Seg', completed: true, intensity: 8 },
    { day: 'Ter', completed: true, intensity: 7 },
    { day: 'Qua', completed: false, intensity: 0 },
    { day: 'Qui', completed: true, intensity: 9 },
    { day: 'Sex', completed: true, intensity: 6 },
    { day: 'Sáb', completed: false, intensity: 0 },
    { day: 'Dom', completed: false, intensity: 0 }
  ];

  const onboardingScreens = [
    {
      title: 'Bem-vinda ao FlowFit! 💪',
      subtitle: 'Treinos que se adaptam ao seu ciclo',
      field: 'name',
      type: 'text',
      placeholder: 'Como você se chama?',
      question: 'Primeiro, vamos nos conhecer:'
    },
    {
      title: 'Qual seu objetivo principal?',
      field: 'goal',
      type: 'options',
      options: [
        { value: 'forca', label: 'Ganhar força', icon: '💪' },
        { value: 'cardio', label: 'Melhorar condicionamento', icon: '❤️' },
        { value: 'flexibilidade', label: 'Aumentar flexibilidade', icon: '🧘‍♀️' },
        { value: 'geral', label: 'Bem-estar geral', icon: '✨' }
      ]
    },
    {
      title: 'Quais equipamentos você tem?',
      field: 'equipment',
      type: 'multiple',
      options: [
        { value: 'peso-corporal', label: 'Só peso corporal', icon: '🏃‍♀️' },
        { value: 'halteres', label: 'Halteres', icon: '🏋️‍♀️' },
        { value: 'faixas', label: 'Faixas elásticas', icon: '🎗️' },
        { value: 'academia', label: 'Academia completa', icon: '🏢' }
      ]
    },
    {
      title: 'Seu ciclo é regular?',
      subtitle: 'Isso nos ajuda a fazer previsões mais precisas',
      field: 'cycleRegular',
      type: 'options',
      options: [
        { value: 'sim', label: 'Sim, geralmente regular', icon: '✅' },
        { value: 'irregular', label: 'Irregular', icon: '🔄' },
        { value: 'nao-sei', label: 'Não tenho certeza', icon: '🤔' }
      ]
    },
    {
      title: 'Quando foi sua última menstruação?',
      subtitle: 'Usamos isso para identificar sua fase atual',
      field: 'lastPeriod',
      type: 'date',
      placeholder: 'DD/MM/AAAA'
    }
  ];

  const CurrentPhaseIcon = cyclePhases[userData.currentPhase]?.icon || Activity;

  const handleOnboardingNext = () => {
    if (onboardingStep < onboardingScreens.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const startWorkout = () => {
    setWorkoutInProgress(true);
    setCurrentScreen('workout-active');
    setCurrentExercise(0);
  };

  const nextExercise = () => {
    if (currentExercise < todayWorkout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimer(45);
    } else {
      setCurrentScreen('feedback');
    }
  };

  const renderOnboarding = () => {
    const screen = onboardingScreens[onboardingStep];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-amber-50 p-6 flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full flex flex-col">
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              {onboardingScreens.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    idx <= onboardingStep ? 'bg-gradient-to-r from-rose-400 to-purple-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Passo {onboardingStep + 1} de {onboardingScreens.length}
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{screen.title}</h1>
              {screen.subtitle && (
                <p className="text-gray-600">{screen.subtitle}</p>
              )}
            </div>

            <div className="space-y-4">
              {screen.type === 'text' && (
                <input
                  type="text"
                  placeholder={screen.placeholder}
                  value={userData[screen.field]}
                  onChange={(e) => setUserData({...userData, [screen.field]: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
                />
              )}

              {screen.type === 'date' && (
                <input
                  type="date"
                  value={userData[screen.field]}
                  onChange={(e) => setUserData({...userData, [screen.field]: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
                />
              )}

              {screen.type === 'options' && (
                <div className="space-y-3">
                  {screen.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setUserData({...userData, [screen.field]: option.value})}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                        userData[screen.field] === option.value
                          ? 'border-rose-400 bg-rose-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-3xl">{option.icon}</span>
                      <span className="font-semibold text-gray-800">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {screen.type === 'multiple' && (
                <div className="space-y-3">
                  {screen.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = userData[screen.field] || [];
                        const newValue = current.includes(option.value)
                          ? current.filter(v => v !== option.value)
                          : [...current, option.value];
                        setUserData({...userData, [screen.field]: newValue});
                      }}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                        (userData[screen.field] || []).includes(option.value)
                          ? 'border-rose-400 bg-rose-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-3xl">{option.icon}</span>
                      <span className="font-semibold text-gray-800 flex-1">{option.label}</span>
                      {(userData[screen.field] || []).includes(option.value) && (
                        <Check className="w-6 h-6 text-rose-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            {onboardingStep > 0 && (
              <button
                onClick={handleOnboardingBack}
                className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleOnboardingNext}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {onboardingStep === onboardingScreens.length - 1 ? 'Começar!' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHome = () => {
    const phase = cyclePhases[userData.currentPhase];
    const PhaseIcon = phase.icon;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-rose-400 to-purple-400 text-white p-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Olá, {userData.name || 'Ana'}!</h2>
              <p className="text-rose-100 text-sm">Quinta, 6 de Novembro</p>
            </div>
            <button className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                <PhaseIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Fase {phase.name}</h3>
                <p className="text-sm text-rose-100">Dia {userData.cycleDay} do ciclo</p>
              </div>
            </div>
            <div className="flex gap-1 mt-3">
              {[...Array(28)].map((_, i) => (
                <div 
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${
                    i < userData.cycleDay ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 -mt-12 pb-24">
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Seu treino hoje</h3>
                <p className="text-gray-600 text-sm">{todayWorkout.title}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-400 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {todayWorkout.duration}
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {todayWorkout.intensity}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{todayWorkout.reason}</p>
              </div>
            </div>

            <button
              onClick={startWorkout}
              className="w-full py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Começar Treino
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <div className="text-2xl font-bold text-gray-800">4</div>
              <div className="text-xs text-gray-600">Esta semana</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <div className="text-2xl font-bold text-gray-800">87%</div>
              <div className="text-xs text-gray-600">Consistência</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-xs text-gray-600">Sequência</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border-2 border-purple-100">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              Dica do dia
            </h4>
            <p className="text-sm text-gray-700">
              Na fase folicular, seu corpo está preparado para novos desafios. 
              Tente aumentar a carga ou fazer mais uma série!
            </p>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-around max-w-md mx-auto">
            <button className="flex flex-col items-center gap-1">
              <Home className="w-6 h-6 text-rose-500" />
              <span className="text-xs font-medium text-rose-500">Início</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('history')}
              className="flex flex-col items-center gap-1"
            >
              <BarChart3 className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Progresso</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1"
            >
              <Settings className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Ajustes</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkoutActive = () => {
    const exercise = todayWorkout.exercises[currentExercise];
    const progress = ((currentExercise + 1) / todayWorkout.exercises.length) * 100;

    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => {
                if (window.confirm('Tem certeza que deseja sair do treino?')) {
                  setCurrentScreen('home');
                  setWorkoutInProgress(false);
                }
              }}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="text-sm text-gray-400">Exercício</div>
              <div className="text-xl font-bold">{currentExercise + 1}/{todayWorkout.exercises.length}</div>
            </div>
            <div className="w-10 h-10" />
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-400 to-purple-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6">
          <div className="bg-gradient-to-br from-rose-500/20 to-purple-500/20 rounded-3xl aspect-video mb-8 flex items-center justify-center">
            <div className="text-6xl">{exercise.video}</div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{exercise.name}</h2>
            <div className="flex items-center justify-center gap-4 text-lg text-gray-300">
              <span>{exercise.sets}</span>
              <span>•</span>
              <span>Descanso: {exercise.rest}</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-3xl p-8 mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{timer}s</div>
              <div className="text-gray-400">Tempo restante</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex-1 py-4 bg-white/10 backdrop-blur rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Continuar' : 'Pausar'}
            </button>
            <button
              onClick={nextExercise}
              className="flex-1 py-4 bg-gradient-to-r from-rose-400 to-purple-400 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              {currentExercise < todayWorkout.exercises.length - 1 ? 'Próximo' : 'Finalizar'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFeedback = () => {
    const [rpe, setRpe] = useState(5);
    const [symptoms, setSymptoms] = useState([]);
    const [notes, setNotes] = useState('');

    const symptomOptions = [
      { value: 'energizada', label: 'Energizada', icon: '⚡' },
      { value: 'cansada', label: 'Cansada', icon: '😴' },
      { value: 'forte', label: 'Me senti forte', icon: '💪' },
      { value: 'dor', label: 'Alguma dor', icon: '🤕' },
      { value: 'colica', label: 'Cólica', icon: '🩹' },
      { value: 'otima', label: 'Ótima!', icon: '✨' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 flex flex-col">
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="text-center mb-8 mt-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Treino concluído! 🎉</h1>
            <p className="text-gray-600">Que tal nos contar como foi?</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-2">Como foi a intensidade?</h3>
              <p className="text-sm text-gray-600 mb-4">De 1 (muito fácil) a 10 (exaustivo)</p>
              
              <div className="flex gap-2 mb-3">
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRpe(i + 1)}
                    className={`flex-1 aspect-square rounded-xl font-bold transition-all ${
                      rpe === i + 1
                        ? 'bg-gradient-to-br from-rose-400 to-purple-400 text-white shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Muito fácil</span>
                <span>Exaustivo</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4">Como você está se sentindo?</h3>
              <div className="grid grid-cols-2 gap-3">
                {symptomOptions.map((symptom) => (
                  <button
                    key={symptom.value}
                    onClick={() => {
                      setSymptoms(symptoms.includes(symptom.value)
                        ? symptoms.filter(s => s !== symptom.value)
                        : [...symptoms, symptom.value]
                      );
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      symptoms.includes(symptom.value)
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{symptom.icon}</div>
                    <div className="text-sm font-medium text-gray-800">{symptom.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-2">Quer adicionar algo? (opcional)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Adorei os agachamentos hoje!"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 outline-none resize-none"
                rows={3}
              />
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('home')}
            className="w-full mt-6 py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Salvar e Finalizar
          </button>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => setCurrentScreen('home')}>
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Seu Progresso</h1>
          </div>
          <p className="text-gray-600 text-sm ml-9">Últimos 7 dias</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4">Semana Atual</h3>
            <div className="flex gap-2 mb-4">
              {weekProgress.map((day, idx) => (
                <div key={idx} className="flex-1">
                  <div className={`aspect-square rounded-2xl mb-2 flex items-center justify-center ${
                    day.completed 
                      ? 'bg-gradient-to-br from-rose-400 to-purple-400' 
                      : 'bg-gray-100'
                  }`}>
                    {day.completed && <Check className="w-6 h-6 text-white" />}
                  </div>
                  <div className="text-xs text-gray-600 text-center">{day.day}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="text-2xl font-bold text-gray-800">4</div>
                <div className="text-xs text-gray-600">Treinos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">140</div>
                <div className="text-xs text-gray-600">Minutos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">7.5</div>
                <div className="text-xs text-gray-600">RPE médio</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4">Insights do Ciclo</h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Pico de Performance</h4>
                    <p className="text-sm text-gray-700">
                      Seus melhores treinos acontecem na fase folicular (dias 8-12). 
                      RPE médio de 8.5!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Padrão Identificado</h4>
                    <p className="text-sm text-gray-700">
                      Na fase lútea, você prefere treinos mais leves. 
                      Ajustamos automaticamente! 💜
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4">Histórico de Treinos</h3>
            <div className="space-y-3">
              {[
                { date: 'Hoje', name: 'Força + Cardio', duration: '35 min', rpe: 8 },
                { date: 'Ontem', name: 'HIIT Intervalado', duration: '25 min', rpe: 9 },
                { date: '2 dias atrás', name: 'Mobilidade', duration: '20 min', rpe: 4 },
                { date: '3 dias atrás', name: 'Força Superior', duration: '40 min', rpe: 7 }
              ].map((workout, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{workout.name}</div>
                    <div className="text-xs text-gray-600">{workout.date} • {workout.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">RPE {workout.rpe}</div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1.5 h-3 rounded-full ${
                            i < workout.rpe ? 'bg-rose-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-around max-w-md mx-auto">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="flex flex-col items-center gap-1"
            >
              <Home className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Início</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <BarChart3 className="w-6 h-6 text-rose-500" />
              <span className="text-xs font-medium text-rose-500">Progresso</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className="flex flex-col items-center gap-1"
            >
              <Settings className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Ajustes</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => setCurrentScreen('home')}>
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Ajustes</h1>
          </div>
          <p className="text-gray-600 text-sm ml-9">Personalize seu treino</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4">Preferências de Treino</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Bloquear HIIT</div>
                  <div className="text-sm text-gray-600">Durante fase menstrual</div>
                </div>
                <button className="w-12 h-6 bg-rose-400 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Preferir peso corporal</div>
                  <div className="text-sm text-gray-600">Exercícios sem equipamento</div>
                </div>
                <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow"></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Treinos curtos</div>
                  <div className="text-sm text-gray-600">Máximo 30 minutos</div>
                </div>
                <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4">Dados do Ciclo</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-gray-50 rounded-xl text-left flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">Última menstruação</div>
                  <div className="text-sm text-gray-600">28 de Outubro</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full p-4 bg-gray-50 rounded-xl text-left flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">Duração média do ciclo</div>
                  <div className="text-sm text-gray-600">28 dias</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4">Notificações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Lembrete de treino</div>
                  <div className="text-sm text-gray-600">Todos os dias às 18h</div>
                </div>
                <button className="w-12 h-6 bg-rose-400 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Previsão de período</div>
                  <div className="text-sm text-gray-600">2 dias antes</div>
                </div>
                <button className="w-12 h-6 bg-rose-400 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4">Conta</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-gray-50 rounded-xl text-left flex items-center justify-between">
                <div className="font-semibold text-gray-800">Perfil</div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full p-4 bg-gray-50 rounded-xl text-left flex items-center justify-between">
                <div className="font-semibold text-gray-800">Privacidade</div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full p-4 bg-red-50 rounded-xl text-left">
                <div className="font-semibold text-red-600">Sair</div>
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-around max-w-md mx-auto">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="flex flex-col items-center gap-1"
            >
              <Home className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Início</span>
            </button>
            <button 
              onClick={() => setCurrentScreen('history')}
              className="flex flex-col items-center gap-1"
            >
              <BarChart3 className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Progresso</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Settings className="w-6 h-6 text-rose-500" />
              <span className="text-xs font-medium text-rose-500">Ajustes</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {currentScreen === 'onboarding' && renderOnboarding()}
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'workout-active' && renderWorkoutActive()}
      {currentScreen === 'feedback' && renderFeedback()}
      {currentScreen === 'history' && renderHistory()}
      {currentScreen === 'settings' && renderSettings()}
    </div>
  );
};

export default FlowFitApp;