import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: string;
}

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const { request, isLoading, error } = useApi();

  const fetchBills = async () => {
    const response = await request<Bill[]>('/bills');
    if (response?.data) {
      setBills(response.data);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return { bills, isLoading, error, refetch: fetchBills };
}
