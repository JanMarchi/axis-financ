'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
}

export function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { request } = useApi();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await request<{ data: Plan[] }>('/api/billing?action=plans', 'GET');
        if (response?.data) {
          setPlans(response.data);
        }

        const currentResponse = await request<any>('/api/billing?action=current', 'GET');
        if (currentResponse?.data?.plan) {
          setCurrentPlan(currentResponse.data.plan);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [request]);

  const handleCheckout = async (priceId: string) => {
    setCheckoutLoading(priceId);
    try {
      const response = await request<any>('/api/billing?action=checkout', 'POST', { priceId });
      if (response?.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Carregando planos...</div>;
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Planos de Assinatura</h1>
          <p className="text-xl text-gray-400">Escolha o melhor plano para suas necessidades</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="border border-gray-700 rounded-lg p-8 bg-gray-900 hover:bg-gray-800 transition">
            <h3 className="text-2xl font-bold text-white mb-2">Plano Gratuito</h3>
            <p className="text-gray-400 mb-6">Para começar</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">R$ 0</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Até 50 transações/mês
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>1 conta bancária
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Categorização manual
              </li>
            </ul>
            <Button
              disabled={currentPlan === 'free'}
              className={`w-full py-2 ${
                currentPlan === 'free' ? 'bg-gray-600 text-gray-300' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {currentPlan === 'free' ? 'Plano Atual' : 'Downgrade'}
            </Button>
          </div>

          {/* Premium Monthly */}
          <div className="border-2 border-green-500 rounded-lg p-8 bg-gray-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-500 text-black px-4 py-1 text-sm font-bold">
              Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 mt-4">Premium Mensal</h3>
            <p className="text-gray-400 mb-6">Mais controle</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">R$ 29,99</span>
              <span className="text-gray-400">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Sincronização de 5 bancos
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Categorização com IA
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Lembretes via WhatsApp
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Sem limite de transações
              </li>
            </ul>
            <Button
              disabled={checkoutLoading === plans[1]?.id}
              onClick={() => handleCheckout(plans[1]?.id)}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold"
            >
              {checkoutLoading === plans[1]?.id ? 'Processando...' : 'Assinar Agora'}
            </Button>
          </div>

          {/* Premium Annual */}
          <div className="border border-gray-700 rounded-lg p-8 bg-gray-900 hover:bg-gray-800 transition">
            <div className="mb-4 inline-block bg-amber-500 text-black px-3 py-1 rounded text-sm font-bold">
              Economize 2 meses
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium Anual</h3>
            <p className="text-gray-400 mb-6">Melhor valor</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">R$ 299,99</span>
              <span className="text-gray-400">/ano</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Tudo do plano mensal
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Desconto de 16%
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="mr-3">✓</span>Suporte prioritário
              </li>
            </ul>
            <Button
              disabled={checkoutLoading === plans[2]?.id}
              onClick={() => handleCheckout(plans[2]?.id)}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold"
            >
              {checkoutLoading === plans[2]?.id ? 'Processando...' : 'Assinar Agora'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
