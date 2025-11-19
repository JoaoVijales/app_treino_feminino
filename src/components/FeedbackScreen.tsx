import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useWorkoutSession } from '../hooks/useWorkoutSession';

interface FeedbackScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ setCurrentScreen }) => {
  const {updateWokoutFeedBack, submitWorkoutSession} = useWorkoutSession();
  const [rpe, setRpe] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const symptomOptions = [
    { value: 'energized', label: 'Energizada', icon: '⚡' },
    { value: 'tired', label: 'Cansada', icon: '😴' },
    { value: 'strong', label: 'Me senti forte', icon: '💪' },
    { value: 'pain', label: 'Alguma dor', icon: '🤕' },
    { value: 'cramps', label: 'Cólica', icon: '🩹' },
    { value: 'great', label: 'Ótima!', icon: '✨' }
  ];

  const handleSubmitFeedback = async() => {
    if (!rpe && symptoms.length && !notes) {
      alert('Por favor, forneça pelo menos uma forma de feedback antes de continuar.');
      return;
    }
    updateWokoutFeedBack(
      rpe,
      symptoms.length ? symptoms[0] as 'energized' | 'tired' | 'strong' | 'pain' | 'cramps' | 'great' : null,
      notes
    );

    try {
      await submitWorkoutSession();
    } catch (error) {
      console.error('Erro ao salvar o feedback:', error);
      alert('Houve um erro ao salvar seu feedback. Por favor, tente novamente.');
      return
    }

    setCurrentScreen('home');
  }

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

export default FeedbackScreen;