"use client";
import React, { useState } from 'react';
import AuthScreen from './AuthScreen';
import { supabase } from '../utils/supabaseClient'; // Import supabase

interface ForgotPasswordScreenProps {
  onLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Redirect to a page where user can update password
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Verifique seu e-mail para as instruções de redefinição de senha.');
        setError('');
      }
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <AuthScreen title="Recuperar Senha" onBack={onLogin}>
      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      <button onClick={handleResetPassword} className="btn btn-primary w-full">
        Enviar Link de Redefinição
      </button>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </AuthScreen>
  );
};

export default ForgotPasswordScreen;