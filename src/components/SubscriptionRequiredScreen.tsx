"use client";
import React, { useState } from 'react';
import { useFlowFit } from '../context/FlowFitContext';
import { UserPlan } from '../types/supabase';
import { useRouter } from 'next/navigation'; // Using useRouter for navigation

interface SubscriptionRequiredScreenProps {
  onNavigate: (screen: 'home' | 'history' | 'calendar' | 'settings' | 'feedback' | 'login' | 'register' | 'forgot-password' | 'onboarding' | 'workout-active' | 'subscription-required') => void;
}

const SubscriptionRequiredScreen: React.FC<SubscriptionRequiredScreenProps> = ({ onNavigate }) => {
  const { userPlan, userProfile, supabase, fetchUserProfile } = useFlowFit();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleManageSubscription = async () => {
    if (!userProfile?.id) {
      setError('User not authenticated.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (userPlan?.status === 'active' || userPlan?.status === 'trialing') {
        // User has an active subscription, go to customer portal
        // Call your API route for customer portal
        const response = await fetch('/api/create-customer-portal-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ stripeCustomerId: userPlan.stripe_customer_id }),
        });

        const { url, error: portalError } = await response.json();
        if (portalError) throw new Error(portalError);
        window.location.href = url;
      } else {
        // User does not have an active subscription, go to checkout
        // This assumes a default priceId or a mechanism to select one
        const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID; // TODO: Define NEXT_PUBLIC_STRIPE_PRICE_ID in your .env.local

        if (!priceId) {
          setError('Stripe Price ID is not configured.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ userId: userProfile.id, priceId }),
        });

        const { sessionId, url, error: checkoutError } = await response.json();
        if (checkoutError) throw new Error(checkoutError);
        window.location.href = url;
      }
    } catch (err: any) {
      setError('Failed to manage subscription: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Assinatura Necessária</h2>
      <p className="text-gray-700 text-center mb-6">
        Para acessar o conteúdo completo do aplicativo, por favor, assine ou renove sua assinatura.
      </p>

      {userPlan && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full max-w-sm">
          <h3 className="text-lg font-semibold mb-2">Status da Assinatura:</h3>
          <p>Status: <span className="font-semibold capitalize">{userPlan.status || 'inactive'}</span></p>
          {userPlan.current_period_end && userPlan.status !== 'canceled' && (
            <p>Renova em: {new Date(userPlan.current_period_end).toLocaleDateString()}</p>
          )}
          {userPlan.trial_end && userPlan.status === 'trialing' && (
            <p>Teste termina em: {new Date(userPlan.trial_end).toLocaleDateString()}</p>
          )}
          {userPlan.status === 'canceled' && (
            <p className="text-red-500">Sua assinatura foi cancelada.</p>
          )}
          {userPlan.status === 'past_due' && (
            <p className="text-yellow-600">Seu pagamento está atrasado.</p>
          )}
        </div>
      )}

      <button
        onClick={handleManageSubscription}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full max-w-sm"
        disabled={loading}
      >
        {loading ? 'Processando...' : (userPlan?.status === 'active' || userPlan?.status === 'trialing' ? 'Gerenciar Assinatura' : 'Assinar Agora / Renovar')}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default SubscriptionRequiredScreen;