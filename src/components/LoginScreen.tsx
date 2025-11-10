import React, { useState } from 'react';
import AuthScreen from './AuthScreen';

interface LoginScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setCurrentScreen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // For now, just navigate to home screen
    console.log('Login attempt:', { email, password });
    setCurrentScreen('home');
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
      >
        Entrar
      </button>
      <button
        onClick={() => console.log('Login with Google clicked')}
        className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all mt-3 flex items-center justify-center gap-2"
      >
        {/* Placeholder for Google Icon */}
        Login com Google
      </button>
      <div className="text-center text-gray-600 text-sm mt-4">
        <button onClick={() => setCurrentScreen('forgot-password')} className="text-rose-500 hover:underline">
          Esqueceu sua senha?
        </button>
      </div>
      <div className="text-center text-gray-600 text-sm mt-2">
        Não tem uma conta?{' '}
        <button onClick={() => setCurrentScreen('register')} className="text-rose-500 hover:underline">
          Cadastre-se
        </button>
      </div>
    </AuthScreen>
  );
};

export default LoginScreen;
