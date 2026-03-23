'use client';

import React, { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';

export function PluggyConnectWidget({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectUrl, setConnectUrl] = useState<string | null>(null);
  const { request } = useApi();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await request<any>(
        '/pluggy',
        'POST',
        { action: 'get-connect-token' },
      );

      if (response?.data) {
        const connectToken = response.data as any;
        setConnectUrl(connectToken.url);
        // Abrir em nova aba
        if (connectToken.url) {
          window.open(connectToken.url, '_blank', 'width=500,height=700');
        }
        // Polling para verificar se completou
        const checkInterval = setInterval(async () => {
          const items = await request<any[]>('/pluggy', 'GET');
          if (items?.data && items.data.length > 0) {
            clearInterval(checkInterval);
            setIsOpen(false);
            onSuccess?.();
          }
        }, 3000);

        // Parar polling após 5 minutos
        setTimeout(() => clearInterval(checkInterval), 5 * 60 * 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)} disabled={isLoading}>
        {isLoading ? 'Conectando...' : 'Conectar Banco'}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Conectar Conta Bancária</h2>
            <p className="text-sm text-gray-600 mb-4">
              Ao conectar sua conta, suas transações serão importadas automaticamente.
            </p>
            <Button onClick={handleConnect} disabled={isLoading} className="w-full mb-2">
              {isLoading ? 'Abrindo...' : 'Abrir Pluggy Connect'}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
