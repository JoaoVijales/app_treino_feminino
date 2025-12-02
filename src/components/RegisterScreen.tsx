"use client";
import React, { useState } from 'react';
import AuthScreen from './AuthScreen';
import { supabase } from '../utils/supabaseClient'; // Import supabase

interface RegisterScreenProps {
  onLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        // Optionally, redirect to a confirmation screen or login
        onLogin();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen title="Crie sua conta" subtitle="Junte-se ao FlowFit AI!" onBack={onLogin}>
      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
      />
      <input
        type="password"
        placeholder="Crie uma senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
      />
      <button
        onClick={handleRegister}
        className="w-full px-6 py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Cadastrar'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="text-center text-gray-600 text-sm mt-4">
        Já tem uma conta?{' '}
        <button onClick={onLogin} className="text-rose-500 hover:underline">
          Faça login
        </button>
      </div>
    </AuthScreen>
  );
};

export default RegisterScreen;