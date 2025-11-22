"use client";
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useWorkoutSession } from '../hooks/useWorkoutSession';

interface FeedbackScreenProps {
  onClose: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ onClose }) => {
  const { currentWorkoutSession, finishWorkoutSession } = useWorkoutSession();
  const [intensity, setIntensity] = useState<number>(0);
  const [feeling, setFeeling] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleFinish = async () => {
    if (currentWorkoutSession) {
      await finishWorkoutSession(intensity, feeling, notes);
      onClose();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Feedback do Treino</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Intensidade (0-10):</label>
        <input
          type="range"
          min="0"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-center">{intensity}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Como você se sentiu?</label>
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Notas (opcional):</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <button
        onClick={handleFinish}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center w-full"
      >
        <Check className="mr-2" />
        Finalizar Treino
      </button>
    </div>
  );
};

export default FeedbackScreen;
