"use client";
import React, { useState } from 'react';
import AuthScreen from './AuthScreen';
import { supabase } from '../utils/supabaseClient'; // Import supabase

interface LoginScreenProps {
  onRegister: () => void;
  onForgotPassword: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen title="Bem-vindo(a) de volta!" subtitle="Faça login para continuar">
      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
      />
      <input
        type="password"
        placeholder="Sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
      />
      <button
        onClick={handleLogin}
        className="w-full px-6 py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="text-center text-gray-600 text-sm mt-4">
        <button onClick={onForgotPassword} className="text-rose-500 hover:underline">
          Esqueceu sua senha?
        </button>
      </div>
      <div className="text-center text-gray-600 text-sm mt-2">
        Não tem uma conta?{' '}
        <button onClick={onRegister} className="text-rose-500 hover:underline">
          Cadastre-se
        </button>
      </div>
    </AuthScreen>
  );
};

export default LoginScreen;