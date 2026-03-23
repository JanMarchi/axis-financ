'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Configurações" description="Personalize sua experiência" />

      <div className="max-w-2xl">
        {/* Profile Section */}
        <div className="bg-bg-elevated border border-border-subtle rounded-card p-6 mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Perfil</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary">Nome Completo</label>
              <input
                type="text"
                defaultValue="João Silva"
                className="w-full mt-2 px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary"
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary">Email</label>
              <input
                type="email"
                defaultValue="joao@example.com"
                disabled
                className="w-full mt-2 px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-tertiary"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-bg-elevated border border-border-subtle rounded-card p-6 mb-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Preferências</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-text-primary">Receber notificações por email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-text-primary">WhatsApp habilitado</span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-card p-6">
          <h3 className="text-lg font-bold text-red-500 mb-4">Zona de Risco</h3>
          <button className="px-6 py-2 rounded-btn border border-red-500 text-red-500 hover:bg-red-500/10 transition-all">
            Deletar Conta
          </button>
        </div>
      </div>
    </div>
  );
}
