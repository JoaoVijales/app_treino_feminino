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
    <AuthScreen title="Login">
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <button onClick={handleLogin} className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button onClick={onRegister} className="btn btn-link w-full mt-2">
        Não tem uma conta? Registre-se
      </button>
      <button onClick={onForgotPassword} className="btn btn-link w-full mt-2">
        Esqueceu a senha?
      </button>
    </AuthScreen>
  );
};

export default LoginScreen;