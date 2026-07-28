'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/src/lib/api';
import type { Usuario, LoginData, RegisterData, AuthResponse } from '@/src/types';

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('usuario');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (data: LoginData) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    const { access_token, usuario: user } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('usuario', JSON.stringify(user));
    setCookie('access_token', access_token);
    setToken(access_token);
    setUsuario(user);
    router.push('/dashboard');
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    const { access_token, usuario: user } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('usuario', JSON.stringify(user));
    setCookie('access_token', access_token);
    setToken(access_token);
    setUsuario(user);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');
    removeCookie('access_token');
    setToken(null);
    setUsuario(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
