import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: string;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { request, isLoading, error } = useApi();

  const fetchGoals = async () => {
    const response = await request<Goal[]>('/goals');
    if (response?.data) {
      setGoals(response.data);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, isLoading, error, refetch: fetchGoals };
}
