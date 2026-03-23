'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="bg-bg-elevated border border-border-subtle rounded-card p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2 text-center">Recuperar Senha</h1>
        <p className="text-center text-text-secondary mb-8">Digite seu email para receber um link de recuperação</p>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-text-secondary mb-2 block">Email</label>
              <div className="flex items-center gap-3 px-4 py-2 rounded-input bg-bg-subtle border border-border-default">
                <Mail className="w-5 h-5 text-text-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-text-primary placeholder-text-tertiary outline-none text-sm"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <button className="w-full py-2 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all">
              Enviar Link
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-text-secondary mb-6">Link de recuperação enviado para {email}</p>
            <p className="text-sm text-text-tertiary mb-6">Verifique seu email e siga as instruções</p>
          </div>
        )}

        <p className="text-center text-sm text-text-tertiary mt-6">
          <Link href="/login" className="text-brand-500 hover:text-brand-400 transition-colors">
            Voltar para login
          </Link>
        </p>
      </div>
    </div>
  );
}
