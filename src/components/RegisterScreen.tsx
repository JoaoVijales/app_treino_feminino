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
    <AuthScreen title="Registrar" onBack={onLogin}>
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
      <button onClick={handleRegister} className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </AuthScreen>
  );
};

export default RegisterScreen;