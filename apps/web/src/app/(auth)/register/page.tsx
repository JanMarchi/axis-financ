'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(formData.name, formData.email, formData.password, formData.phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-bg-elevated border border-border-subtle rounded-card p-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">Criar Conta</h1>
        <p className="text-center text-text-secondary mb-8">Comece sua jornada financeira</p>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-text-secondary mb-2 block">Nome Completo</label>
            <div className="flex items-center gap-3 px-4 py-2 rounded-input bg-bg-subtle border border-border-default">
              <User className="w-5 h-5 text-text-tertiary" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex-1 bg-transparent text-text-primary outline-none text-sm"
                placeholder="Seu nome"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-2 block">Email</label>
            <div className="flex items-center gap-3 px-4 py-2 rounded-input bg-bg-subtle border border-border-default">
              <Mail className="w-5 h-5 text-text-tertiary" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="flex-1 bg-transparent text-text-primary outline-none text-sm"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-2 block">WhatsApp</label>
            <div className="flex items-center gap-3 px-4 py-2 rounded-input bg-bg-subtle border border-border-default">
              <Phone className="w-5 h-5 text-text-tertiary" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="flex-1 bg-transparent text-text-primary outline-none text-sm"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-2 block">Senha</label>
            <div className="flex items-center gap-3 px-4 py-2 rounded-input bg-bg-subtle border border-border-default">
              <Lock className="w-5 h-5 text-text-tertiary" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="flex-1 bg-transparent text-text-primary outline-none text-sm"
                placeholder="Sua senha"
              />
            </div>

            {/* Password Strength */}
            {formData.password && (
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      i < passwordStrength ? 'bg-brand-500' : 'bg-bg-muted'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" required />
            <span className="text-sm text-text-secondary">
              Concordo com os{' '}
              <Link href="#" className="text-brand-500 hover:text-brand-400">
                termos de serviço
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center text-sm text-text-tertiary">
          Já tem conta?{' '}
          <Link href="/login" className="text-brand-500 hover:text-brand-400 transition-colors">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
