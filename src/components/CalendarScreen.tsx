import React, { useState } from 'react';
import { ChevronLeft, Calendar, X, Home, BarChart3, Settings, ChevronRight, Droplet, Zap, Sun, Moon } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';
import { addMenstrualCycle } from '../utils/api';
import { CyclePhases } from '../types';
import { getCyclePhase } from '../utils/cycle_phase';

interface CalendarScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ setCurrentScreen }) => {
  const { userData, menstrualCycles, userProfile, loading } = useFlowFit();
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const cyclePhases: CyclePhases = {
    menstrual: { name: 'Menstrual', icon: Droplet, color: 'rose', emoji: '🩸' },
    folicular: { name: 'Folicular', icon: Zap, color: 'green', emoji: '⚡' },
    ovulatoria: { name: 'Ovulatória', icon: Sun, color: 'amber', emoji: '☀️' },
    lutea: { name: 'Lútea', icon: Moon, color: 'purple', emoji: '🌙' }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const getDayPhaseForDate = (day: number) => {
    const dateForPhase = new Date(currentYear, currentMonth, day);
    // This logic should be improved to find the most recent cycle start date
    const lastPeriodDate = menstrualCycles.length > 0 ? new Date(menstrualCycles[0].start_date_log) : new Date(userData.lastPeriod);
    return getCyclePhase(lastPeriodDate, 28);
  };

  const isPeriodDay = (day: number) => {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return menstrualCycles.some(period => {
      // Adjust for timezone issues by only comparing dates
      const startDate = new Date(period.start_date_log + 'T00:00:00');
      const targetDate = new Date(dateStr + 'T00:00:00');

      if (!period.end_date_log) {
        return startDate.toDateString() === targetDate.toDateString();
      }
      const endDate = new Date(period.end_date_log + 'T00:00:00');
      return targetDate >= startDate && targetDate <= endDate;
    });
  };

  const handleAddPeriod = async () => {
    if (userProfile) {
      const today = new Date();
      const newCycle = {
        user_id: userProfile.user_id,
        start_date_log: today.toISOString().split('T')[0],
      };
      await addMenstrualCycle(newCycle);
      // Ideally, we should refetch the menstrual cycles data here.
      // For now, we can give a visual feedback.
      alert("Seu novo ciclo foi marcado para hoje!");
    }
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
    const phase = getDayPhaseForDate(day);
    const hasPeriod = isPeriodDay(day);

    days.push(
      <button
        key={day}
        onClick={() => setSelectedDate(day)}
        className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative transition-all ${
          isToday
            ? 'ring-2 ring-rose-500 ring-offset-2'
            : ''
        } ${
          selectedDate === day
            ? 'bg-rose-100 shadow-lg scale-105'
            : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <span className={`font-semibold ${isToday ? 'text-rose-600' : 'text-gray-800'}`}>
          {day}
        </span>
        <div className="flex gap-0.5 mt-1">
          {hasPeriod && (
            <div className={`w-1.5 h-1.5 rounded-full bg-${cyclePhases[phase].color}-400`} />
          )}
        </div>
      </button>
    );
  }

  const handlePrevMonth = () => {
    setDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Carregando...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-br from-rose-400 to-purple-400 text-white p-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCurrentScreen('home')}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Meu Ciclo</h1>
        </div>

        <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold mb-1">Dia {userData.cycleDay}</div>
            <div className="text-sm text-rose-100">do seu ciclo</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(cyclePhases).map(([key, phase]) => {
              const PhaseIcon = phase.icon;
              const isActive = userData.currentPhase === key;
              return (
                <div
                  key={key}
                  className={`text-center p-2 rounded-xl ${
                    isActive ? 'bg-white/30' : 'bg-white/10'
                  }`}
                >
                  <PhaseIcon className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                  <div className="text-xs">{phase.emoji}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth}><ChevronLeft/></button>
            <h2 className="text-xl font-bold text-gray-800">{monthNames[currentMonth]} {currentYear}</h2>
            <button onClick={handleNextMonth}><ChevronRight/></button>
            <button
              onClick={handleAddPeriod}
              className="text-sm bg-rose-100 text-rose-600 px-4 py-2 rounded-full font-semibold"
            >
              + Marcar Período
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Legenda</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
              <span className="text-sm text-gray-700">Menstruação confirmada</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-rose-200 rounded-full"></div>
              <span className="text-sm text-gray-700">Previsão de menstruação</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-700">Fase folicular</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-sm text-gray-700">Fase ovulatória</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-gray-700">Fase lútea</span>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">Dia {selectedDate}</h3>
              <button onClick={() => setSelectedDate(null)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Fase:</strong> {cyclePhases[getDayPhaseForDate(selectedDate)].name}</p>
              <p><strong>Status:</strong> {isPeriodDay(selectedDate) ? 'Menstruação' : 'Normal'}</p>
            </div>
            {!isPeriodDay(selectedDate) && (
              <button onClick={handleAddPeriod} className="w-full mt-4 py-3 bg-rose-400 text-white font-semibold rounded-xl">
                Marcar início do ciclo
              </button>
            )}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">Próxima Menstruação</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">25 de Nov</div>
              <div className="text-sm text-gray-600">Em aproximadamente 18 dias</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-700">
              💡 Baseado no seu ciclo médio de 28 dias. Atualize quando sua menstruação começar para melhorar a precisão!
            </p>
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
            <Calendar className="w-6 h-6 text-rose-500" />
            <span className="text-xs font-medium text-rose-500">Ciclo</span>
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

export default CalendarScreen;