import { Activity, Clock, Target, Info, Play, Settings, Calendar, BarChart3, Zap, Droplet, Sun, Moon } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';
import { CyclePhases } from '../types';
import { getWorkoutsThisWeek, getConsistency, getStreak } from '../utils/stats';
import { useWorkoutSession } from '../hooks/useWorkoutSession'; // Import useWorkoutSession

interface HomeScreenProps {
  onNavigate: (screen: 'home' | 'history' | 'calendar' | 'settings' | 'feedback' | 'login' | 'register' | 'forgot-password' | 'onboarding' | 'workout-active') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { userData, todayWorkoutState, workoutHistory, loading } = useFlowFit();
  const { startWorkoutSession } = useWorkoutSession(); // Destructure startWorkoutSession

  console.log('loading:', loading);
  console.log('userData:', userData);
  console.log('todayWorkoutState:', todayWorkoutState);

  if (loading || !userData || !userData.currentPhase || userData.cycleDay === null || !todayWorkoutState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }
  const currentPhase = userData.currentPhase;

  const stats = useMemo(() => {
    if (!workoutHistory) return { workoutsThisWeek: 0, consistency: 0, streak: 0 };
    return {
      workoutsThisWeek: getWorkoutsThisWeek(workoutHistory),
      consistency: getConsistency(workoutHistory),
      streak: getStreak(workoutHistory),
    };
  }, [workoutHistory]);

  const cyclePhases: CyclePhases = {
    menstrual: { name: 'Menstrual', icon: Droplet, color: 'rose', emoji: '🩸',},
    follicular: { name: 'Folicular', icon: Zap, color: 'green', emoji: '⚡' },
    ovulatory: { name: 'Ovulatória', icon: Sun, color: 'amber', emoji: '☀️' },
    luteal: { name: 'Lútea', icon: Moon, color: 'purple', emoji: '🌙' }
  };

  const cyclePhasesText = {
    menstrual: 'Durante a fase menstrual, é importante ouvir seu corpo. Foque em exercícios leves e alongamentos para aliviar o desconforto.',
    follicular: 'Na fase folicular, seu corpo está preparado para novos desafios. Tente aumentar a carga ou fazer mais uma série!',
    ovulatory: 'Durante a fase ovulatória, você pode sentir um pico de energia. Aproveite para realizar treinos mais intensos!',
    luteal: 'Na fase lútea, o foco deve ser na recuperação e no alongamento. Considere incluir sessões de yoga ou pilates.'
  };

  function getPhaseText(){
    if (!currentPhase) return '';
    const phase = cyclePhasesText[currentPhase];
    return phase;
  }

  const phase = cyclePhases[currentPhase];
  const PhaseIcon = phase.icon;
  
  function get_date_today() {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('pt-BR', options);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-rose-400 to-purple-400 text-white p-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Olá, {userData.name || 'Ana'}!</h2>
            <p className="text-rose-100 text-sm">{get_date_today()}</p>
          </div>
          <button className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Settings className="w-6 h-6" 
                onClick={() => onNavigate('settings')}/>
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
                  i < userData.cycleDay! ? 'bg-white' : 'bg-white/20'
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
              <p className="text-gray-600 text-sm">{todayWorkoutState.title}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-400 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {todayWorkoutState.duration}
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {todayWorkoutState.intensity}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{todayWorkoutState.reason}</p>
            </div>
          </div>

          <button
            onClick={async () => {
              if (todayWorkoutState) {
                await startWorkoutSession(todayWorkoutState.id); // Call startWorkoutSession
                onNavigate('workout-active');
              }
            }}
            className="w-full py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Começar Treino
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow">
            <div className="text-2xl font-bold text-gray-800">{stats.workoutsThisWeek}</div>
            <div className="text-xs text-gray-600">Esta semana</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow">
            <div className="text-2xl font-bold text-gray-800">{stats.consistency}%</div>
            <div className="text-xs text-gray-600">Consistência</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow">
            <div className="text-2xl font-bold text-gray-800">{stats.streak}</div>
            <div className="text-xs text-gray-600">Sequência</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border-2 border-purple-100">
          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Dica do dia
          </h4>
          <p className="text-sm text-gray-700">
            {getPhaseText()}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1">
            <Activity className="w-6 h-6 text-rose-500" />
            <span className="text-xs font-medium text-rose-500">Início</span>
          </button>
          <button
            onClick={() => onNavigate('calendar')}
            className="flex flex-col items-center gap-1"
          >
            <Calendar className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Ciclo</span>
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="flex flex-col items-center gap-1"
          >
            <BarChart3 className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Progresso</span>
          </button>
          <button
            onClick={() => onNavigate('settings')}
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

export default HomeScreen;
