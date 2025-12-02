"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';

import { Activity, Settings, Calendar, BarChart3 } from 'lucide-react';

interface SettingsScreenProps {
  onNavigate: (screen: 'home' | 'history' | 'calendar' | 'settings' | 'feedback' | 'login' | 'register' | 'forgot-password' | 'onboarding' | 'workout-active') => void;
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate }) => {
  const { userProfile, signOut } = useFlowFit();

  // Mock state for toggles as their state is not in the hook
  const [blockHiit, setBlockHiit] = useState(true);
  const [preferBodyweight, setPreferBodyweight] = useState(false);
  const [shortWorkouts, setShortWorkouts] = useState(false);
  const [trainingReminder, setTrainingReminder] = useState(true);
  const [periodPrediction, setPeriodPrediction] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack}>
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
              <button
                onClick={() => setBlockHiit(!blockHiit)}
                className={`w-12 h-6 rounded-full relative transition-colors ${blockHiit ? 'bg-rose-400' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${blockHiit ? 'transform translate-x-full' : 'transform translate-x-0.5'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-semibold text-gray-800">Preferir peso corporal</div>
                <div className="text-sm text-gray-600">Exercícios sem equipamento</div>
              </div>
              <button
                onClick={() => setPreferBodyweight(!preferBodyweight)}
                className={`w-12 h-6 rounded-full relative transition-colors ${preferBodyweight ? 'bg-rose-400' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${preferBodyweight ? 'transform translate-x-full' : 'transform translate-x-0.5'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-semibold text-gray-800">Treinos curtos</div>
                <div className="text-sm text-gray-600">Máximo 30 minutos</div>
              </div>
              <button
                onClick={() => setShortWorkouts(!shortWorkouts)}
                className={`w-12 h-6 rounded-full relative transition-colors ${shortWorkouts ? 'bg-rose-400' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${shortWorkouts ? 'transform translate-x-full' : 'transform translate-x-0.5'}`}></div>
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
                <div className="text-sm text-gray-600">{userProfile?.last_period ? new Date(userProfile.last_period).toLocaleDateString() : 'Não informado'}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full p-4 bg-gray-50 rounded-xl text-left flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">Regularidade do ciclo</div>
                <div className="text-sm text-gray-600">{userProfile?.cycle_regular === 'yes' ? 'Regular' : 'Irregular'}</div>
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
              <button
                onClick={() => setTrainingReminder(!trainingReminder)}
                className={`w-12 h-6 rounded-full relative transition-colors ${trainingReminder ? 'bg-rose-400' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${trainingReminder ? 'transform translate-x-full' : 'transform translate-x-0.5'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-semibold text-gray-800">Previsão de período</div>
                <div className="text-sm text-gray-600">2 dias antes</div>
              </div>
              <button
                onClick={() => setPeriodPrediction(!periodPrediction)}
                className={`w-12 h-6 rounded-full relative transition-colors ${periodPrediction ? 'bg-rose-400' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${periodPrediction ? 'transform translate-x-full' : 'transform translate-x-0.5'}`}></div>
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

            <button onClick={signOut} className="w-full p-4 bg-red-50 rounded-xl text-left">
              <div className="font-semibold text-red-600">Sair</div>
            </button>
          </div>
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

export default SettingsScreen;