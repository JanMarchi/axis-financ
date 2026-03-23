'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Conta Corrente' },
  { value: 'savings', label: 'Poupança' },
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'investment', label: 'Investimento' },
  { value: 'cash', label: 'Dinheiro em Caixa' },
  { value: 'wallet', label: 'Carteira Digital' },
];

interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    institution: '',
  });
  const { request, isLoading } = useApi();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await request('/accounts', 'POST', formData);
    if (response?.data) {
      setFormData({ name: '', type: 'checking', institution: '' });
      setOpen(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Conta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome da Conta</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Tipo</label>
            <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Instituição (opcional)</label>
            <Input
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Criando...' : 'Criar Conta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
