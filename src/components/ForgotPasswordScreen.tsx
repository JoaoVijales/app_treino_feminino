import React, { useState } from 'react';
import AuthScreen from './AuthScreen';

interface ForgotPasswordScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ setCurrentScreen }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // For now, just navigate to login screen
    console.log('Password reset attempt for:', email);
    setCurrentScreen('login');
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
        className="w-full px-6 py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        Redefinir Senha
      </button>
    </AuthScreen>
  );
};

export default ForgotPasswordScreen;
