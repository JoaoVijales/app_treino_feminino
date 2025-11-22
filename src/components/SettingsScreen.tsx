"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home, Calendar, BarChart3, Settings } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';
import { updateUserProfile } from '../utils/api';
import { UserProfile } from '../types/supabase'; // Import UserProfile type

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { userProfile, updateUserData, fetchUserProfile } = useFlowFit();
  const [name, setName] = useState(userProfile?.name || '');
  const [goal, setGoal] = useState(userProfile?.goal || '');
  const [equipment, setEquipment] = useState(userProfile?.equipment || '');
  const [cycleRegular, setCycleRegular] = useState(userProfile?.cycle_regular || '');
  const [lastPeriod, setLastPeriod] = useState(userProfile?.last_period || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setGoal(userProfile.goal || '');
      setEquipment(userProfile.equipment || '');
      setCycleRegular(userProfile.cycle_regular || '');
      setLastPeriod(userProfile.last_period || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile?.id) {
      setError('User profile not loaded.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const updatedProfile: Partial<UserProfile> = {
        name,
        goal,
        equipment,
        cycle_regular: cycleRegular,
        last_period: lastPeriod,
      };

      await updateUserProfile(userProfile.id, updatedProfile);
      setMessage('Perfil atualizado com sucesso!');
      fetchUserProfile(); // Re-fetch to ensure context is updated
    } catch (err: any) {
      setError('Erro ao atualizar perfil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <ChevronLeft className="cursor-pointer" onClick={onBack} />
        <h2 className="text-xl font-bold">Configurações</h2>
        <Home className="opacity-0" /> {/* Placeholder for alignment */}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Objetivo:</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Equipamento:</label>
          <input
            type="text"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Ciclo Regular?</label>
          <select
            value={cycleRegular}
            onChange={(e) => setCycleRegular(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione</option>
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Última Menstruação:</label>
          <input
            type="date"
            value={lastPeriod}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default SettingsScreen;