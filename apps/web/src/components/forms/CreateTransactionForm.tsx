'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAccounts } from '@/hooks/useAccounts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const TRANSACTION_TYPES = [
  { value: 'income', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
  { value: 'transfer', label: 'Transferência' },
];

interface CreateTransactionFormProps {
  onSuccess?: () => void;
}

export function CreateTransactionForm({ onSuccess }: CreateTransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    description: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });
  const { request, isLoading } = useApi();
  const { accounts } = useAccounts();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await request('/transactions', 'POST', {
      ...formData,
      amount: parseFloat(formData.amount),
    });
    if (response?.data) {
      setFormData({
        accountId: '',
        amount: '',
        description: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
      setOpen(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Transação</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Conta</label>
            <Select value={formData.accountId} onValueChange={(value: string) => setFormData({ ...formData, accountId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Tipo</label>
            <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Valor</label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Data</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Criando...' : 'Criar Transação'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
