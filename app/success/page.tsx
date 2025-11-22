"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFlowFit } from '@/src/context/FlowFitContext';

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { fetchUserProfile } = useFlowFit();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSuccess = async () => {
      if (sessionId) {
        try {
          // You might want to verify the session on your backend here
          // For now, we'll just refetch user profile to update subscription status
          await fetchUserProfile();
          setLoading(false);
        } catch (err: any) {
          setError('Failed to verify session: ' + err.message);
          setLoading(false);
        }
      } else {
        setError('No session ID found.');
        setLoading(false);
      }
    };

    handleSuccess();
  }, [sessionId, fetchUserProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Processando seu pagamento...</h1>
        <p className="text-gray-600">Por favor, aguarde.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Erro no Processamento</h1>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Pagamento Concluído com Sucesso!</h1>
      <p className="text-gray-600 mb-6">Sua assinatura foi ativada. Obrigado!</p>
      <button
        onClick={() => router.push('/')}
        className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Ir para o Aplicativo
      </button>
    </div>
  );
};

export default SuccessPage;
