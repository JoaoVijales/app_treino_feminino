import React, { useState } from 'react';
import AuthScreen from './AuthScreen';
import { supabase } from '../utils/supabaseClient'; // Import supabase

interface RegisterScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ setCurrentScreen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin, // Redirect to the app's root after email confirmation
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      console.error('Error registering:', signUpError.message);
    } else if (signUpData.user) {
      // User registered successfully, now attempt to sign them in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        console.error('Error signing in after registration:', signInError.message);
        alert('Cadastro realizado, mas o login falhou. Por favor, tente fazer login.');
        setCurrentScreen('login'); // Send them to login page if immediate sign-in fails
      } else {
        // Sign-in successful. App.tsx will navigate based on session state to onboarding.
        alert('Cadastro e login realizados com sucesso! Verifique seu e-mail para confirmar sua conta.');
      }
    }
    setLoading(false);
  };

  return (
    <AuthScreen title="Crie sua conta" subtitle="Junte-se ao FlowFit AI!">
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
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
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
