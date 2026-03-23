import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data?: T;
  error?: { code: string; message: string };
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T extends any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    body?: Record<string, any>,
  ): Promise<ApiResponse<T> | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok) {
        setError(data.error?.message || 'An error occurred');
        return null;
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { request, isLoading, error };
}
