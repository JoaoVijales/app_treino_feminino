"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const CancelPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-4">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Pagamento Cancelado</h1>
      <p className="text-gray-600 mb-6">Sua transação foi cancelada ou não foi concluída.</p>
      <button
        onClick={() => router.push('/')}
        className="mt-6 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Voltar para o Aplicativo
      </button>
    </div>
  );
};

export default CancelPage;
