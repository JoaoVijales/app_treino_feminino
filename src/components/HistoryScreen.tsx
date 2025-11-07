import React from 'react';
import { ChevronLeft, Check, Home, Calendar, BarChart3, Settings, Zap, Moon } from 'lucide-react';
import { WeekProgressItem } from '../types';

interface HistoryScreenProps {
  setCurrentScreen: (screen: string) => void;
  weekProgress: WeekProgressItem[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ setCurrentScreen, weekProgress }) => {
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
          <button
            onClick={() => setCurrentScreen('calendar')}
            className="flex flex-col items-center gap-1"
          >
            <Calendar className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Ciclo</span>
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

export default HistoryScreen;
