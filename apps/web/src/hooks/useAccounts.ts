import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution?: string;
  currency: string;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { request, isLoading, error } = useApi();

  const fetchAccounts = async () => {
    const response = await request<Account[]>('/accounts');
    if (response?.data) {
      setAccounts(response.data);
    }
  };

  const createAccount = async (data: Omit<Account, 'id'>) => {
    const response = await request<Account>('/accounts', 'POST', data);
    if (response?.data) {
      setAccounts([...accounts, response.data]);
      return response.data;
    }
    return null;
  };

  const updateAccount = async (id: string, data: Partial<Account>) => {
    const response = await request<Account>(`/accounts/${id}`, 'PATCH', data);
    if (response?.data) {
      setAccounts(accounts.map(a => (a.id === id ? response.data! : a)));
      return response.data;
    }
    return null;
  };

  const deleteAccount = async (id: string) => {
    const response = await request(`/accounts/${id}`, 'DELETE');
    if (response) {
      setAccounts(accounts.filter(a => a.id !== id));
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return { accounts, isLoading, error, createAccount, updateAccount, deleteAccount, refetch: fetchAccounts };
}
