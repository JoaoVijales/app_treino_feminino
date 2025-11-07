import React from 'react';
import { Activity, Clock, Target, Info, Play, Settings, Calendar, BarChart3, Zap } from 'lucide-react';
import { UserData, CyclePhases, TodayWorkout } from '../types';

interface HomeScreenProps {
  userData: UserData;
  cyclePhases: CyclePhases;
  todayWorkout: TodayWorkout;
  startWorkout: () => void;
  setCurrentScreen: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userData, cyclePhases, todayWorkout, startWorkout, setCurrentScreen }) => {
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
            <Activity className="w-6 h-6 text-rose-500" />
            <span className="text-xs font-medium text-rose-500">Início</span>
          </button>
          <button
            onClick={() => setCurrentScreen('calendar')}
            className="flex flex-col items-center gap-1"
          >
            <Calendar className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Ciclo</span>
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

export default HomeScreen;
