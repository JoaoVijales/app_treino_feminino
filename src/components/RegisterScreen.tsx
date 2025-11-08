import React, { useState } from 'react';
import AuthScreen from './AuthScreen';

interface RegisterScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ setCurrentScreen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // For now, just navigate to home screen
    console.log('Register attempt:', { name, email, password });
    setCurrentScreen('home');
  };

  return (
    <AuthScreen title="Crie sua conta" subtitle="Junte-se ao FlowFit AI!">
      <input
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-rose-400 outline-none text-lg"
      />
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
      >
        Cadastrar
      </button>
      <div className="text-center text-gray-600 text-sm mt-4">
        Já tem uma conta?{' '}
        <button onClick={() => setCurrentScreen('login')} className="text-rose-500 hover:underline">
          Faça login
        </button>
      </div>
    </AuthScreen>
  );
};

export default RegisterScreen;
