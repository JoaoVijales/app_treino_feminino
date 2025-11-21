import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home, Calendar, BarChart3, Settings } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';
import { updateUserProfile } from '../utils/api';
import { UserProfile } from '../types/supabase';
import { supabase } from '../utils/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface SettingsScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ setCurrentScreen }) => {
  const { userProfile, session } = useFlowFit(); // Include session in destructuring
  const [localProfile, setLocalProfile] = useState<Partial<UserProfile>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userProfile) {
      setLocalProfile(userProfile);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (userProfile) {
      const { error } = await updateUserProfile(userProfile.user_id, localProfile);
      if (error) {
        setMessage('Erro ao salvar as alterações.');
      } else {
        setMessage('Alterações salvas com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // No need to setCurrentScreen('login') here, FlowFitApp will handle navigation based on session change
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => setCurrentScreen('home')}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Ajustes</h1>
        </div>
        <p className="text-gray-600 text-sm ml-9">Personalize seu treino e perfil</p>
      </div>

      <div className="p-6 space-y-6">
        {message && <p className="text-center text-green-500">{message}</p>}
        
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Seu Perfil</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nome</label>
              <input
                type="text"
                value={localProfile.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-xl border-2 border-gray-200 focus:border-rose-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Idade</label>
              <input
                type="number"
                value={localProfile.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className="w-full px-4 py-2 mt-1 rounded-xl border-2 border-gray-200 focus:border-rose-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={localProfile.body_weight || ''}
                onChange={(e) => handleInputChange('body_weight', parseFloat(e.target.value))}
                className="w-full px-4 py-2 mt-1 rounded-xl border-2 border-gray-200 focus:border-rose-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Altura (cm)</label>
              <input
                type="number"
                value={localProfile.body_height || ''}
                onChange={(e) => handleInputChange('body_height', parseInt(e.target.value))}
                className="w-full px-4 py-2 mt-1 rounded-xl border-2 border-gray-200 focus:border-rose-400 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Preferências de Treino</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nível de Treino</label>
              <select
                value={localProfile.training_level || ''}
                onChange={(e) => handleInputChange('training_level', e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-xl border-2 border-gray-200 focus:border-rose-400 outline-none bg-white"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Objetivo Principal</label>
              <select
                value={localProfile.goal || ''}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-xl border-2 border-gray-200 focus:border-rose-400 outline-none bg-white"
              >
                <option value="forca">Ganhar Força</option>
                <option value="cardio">Melhorar Condicionamento</option>
                <option value="flexibilidade">Aumentar Flexibilidade</option>
                <option value="geral">Bem-estar Geral</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Dados do Ciclo</h3>
          <div className="space-y-3">
            <div className="w-full p-4 bg-gray-50 rounded-xl text-left">
              <label className="font-semibold text-gray-800">Última menstruação</label>
              <input
                type="date"
                value={localProfile.last_period || ''}
                onChange={(e) => handleInputChange('last_period', e.target.value)}
                className="w-full text-sm text-gray-600 bg-transparent outline-none mt-1"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Salvar Alterações
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-all"
        >
          Sair (Logout)
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around max-w-md mx-auto">
          <button onClick={() => setCurrentScreen('home')} className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Início</span>
          </button>
          <button onClick={() => setCurrentScreen('calendar')} className="flex flex-col items-center gap-1">
            <Calendar className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Ciclo</span>
          </button>
          <button onClick={() => setCurrentScreen('history')} className="flex flex-col items-center gap-1">
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
