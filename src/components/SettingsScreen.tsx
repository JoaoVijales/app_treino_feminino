import React from 'react';
import { ChevronLeft, ChevronRight, Home, Calendar, BarChart3, Settings } from 'lucide-react';

interface SettingsScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ setCurrentScreen }) => {
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
          <button className="flex flex-col items-center gap-1">
            <Settings className="w-6 h-6 text-rose-500" />
            <span className="text-xs font-medium text-rose-500">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
