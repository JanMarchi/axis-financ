import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  status: string;
  categoryId?: string;
  accountId: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useTransactions(filters?: Record<string, any>) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const { request, isLoading, error } = useApi();

  const fetchTransactions = async () => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });
    }
    const response = await request<Transaction[]>(
      `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    );
    if (response) {
      setTransactions(response.data || []);
      if (response.meta) {
        setMeta(response.meta);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return { transactions, meta, isLoading, error, refetch: fetchTransactions };
}
