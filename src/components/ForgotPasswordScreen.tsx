import React, { useState } from 'react';
import AuthScreen from './AuthScreen';
import { supabase } from '../utils/supabaseClient'; // Import supabase

interface ForgotPasswordScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ setCurrentScreen }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    setMessage(null); // Clear previous messages

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password', // TODO: Replace with your actual reset password URL
    });

    if (error) {
      setError(error.message);
      console.error('Error resetting password:', error.message);
    } else {
      setMessage('Verifique seu e-mail para o link de redefinição de senha!');
    }
    setLoading(false);
  };

  return (
    <AuthScreen title="Recuperar Senha" subtitle="Informe seu e-mail para redefinir sua senha" onBack={() => setCurrentScreen('login')}>
      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
      />
      <button
        onClick={handleResetPassword}
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        {loading ? 'Enviando...' : 'Redefinir Senha'}
      </button>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      {message && <p className="text-green-500 text-center mt-2">{message}</p>}
    </AuthScreen>
  );
};

export default ForgotPasswordScreen;
