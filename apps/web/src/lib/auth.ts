import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const router = useRouter();

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Erro ao registrar');
      }

      const data = await res.json();
      router.push('/onboarding/step-1');
      return data;
    },
    [router],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Erro ao fazer login');
      }

      const data = await res.json();
      router.push('/dashboard');
      return data;
    },
    [router],
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/login');
  }, [router]);

  return { register, login, logout };
}
