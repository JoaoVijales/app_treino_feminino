"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, X, Home, BarChart3, Settings, ChevronRight, Droplet, Zap, Sun, Moon } from 'lucide-react';
import { useFlowFit } from '../context/FlowFitContext';
import { addMenstrualCycle } from '../utils/api';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarScreenProps {
  onClose: () => void;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ onClose }) => {
  const { userProfile, updateUserData, menstrualCycles, fetchMenstrualCycles } = useFlowFit();
  const [date, setDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMenstrualCycles();
  }, []);

  const handleDateChange = (newDate: any) => {
    setDate(newDate);
    setShowModal(true);
  };

  const handleAddMenstrualCycle = async () => {
    if (userProfile?.id) {
      try {
        await addMenstrualCycle({
          user_id: userProfile.id,
          start_date_log: date.toISOString(),
        });
        fetchMenstrualCycles();
        setShowModal(false);
      } catch (error) {
        console.error('Error adding menstrual cycle:', error);
      }
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const cycleStart = menstrualCycles.find(
        (cycle) => new Date(cycle.start_date_log).toDateString() === date.toDateString()
      );
      if (cycleStart) {
        return <p className="text-red-500 font-bold">●</p>;
      }
    }
    return null;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <ChevronLeft className="cursor-pointer" onClick={onClose} />
        <h2 className="text-xl font-bold">Calendário Menstrual</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      <CalendarComponent
        onChange={handleDateChange}
        value={date}
        locale="pt-BR"
        tileContent={tileContent}
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Registrar Ciclo Menstrual</h3>
            <p>Deseja registrar o início do ciclo menstrual em {date.toLocaleDateString()}?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleAddMenstrualCycle}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarScreen;
