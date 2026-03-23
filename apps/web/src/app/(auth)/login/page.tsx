'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { login: loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-bg-elevated border border-border-subtle rounded-card p-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">Axis Finance</h1>
        <p className="text-center text-text-secondary mb-8">Organize. Economize. Invista.</p>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-2 block">Senha</label>
            <div className="flex items-center gap-3 px-4 py-2 rounded-input bg-bg-subtle border border-border-default">
              <Lock className="w-5 h-5 text-text-tertiary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-text-primary placeholder-text-tertiary outline-none text-sm"
                placeholder="Sua senha"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button className="w-full py-2 rounded-btn border border-border-default text-text-primary font-medium hover:bg-bg-subtle transition-all mb-6">
          Entrar com Google
        </button>

        <div className="text-center text-sm space-y-2">
          <p className="text-text-tertiary">
            Não tem conta?{' '}
            <Link href="/register" className="text-brand-500 hover:text-brand-400 transition-colors">
              Criar conta
            </Link>
          </p>
          <Link href="/forgot-password" className="block text-text-tertiary hover:text-text-secondary transition-colors">
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </div>
  );
}
