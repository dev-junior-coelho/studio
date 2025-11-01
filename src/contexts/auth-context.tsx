"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Usuario } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (role: 'agente' | 'supervisor') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers: { [key in 'agente' | 'supervisor']: Usuario } = {
  agente: { uid: 'agente-123', email: 'agente@claro.com.br', role: 'agente' },
  supervisor: { uid: 'supervisor-456', email: 'supervisor@claro.com.br', role: 'supervisor' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking for a logged-in user in localStorage
    const storedUserRole = localStorage.getItem('userRole') as 'agente' | 'supervisor' | null;
    if (storedUserRole && mockUsers[storedUserRole]) {
      setUser(mockUsers[storedUserRole]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname === '/login';
    const isAdminRoute = pathname.startsWith('/admin');

    if (!user && !isAuthRoute) {
      router.push('/login');
    } else if (user) {
      if (isAuthRoute) {
        router.push('/');
      }
      if (isAdminRoute && user.role !== 'supervisor') {
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  const login = (role: 'agente' | 'supervisor') => {
    setLoading(true);
    const userToLogin = mockUsers[role];
    setUser(userToLogin);
    localStorage.setItem('userRole', role); // Persist role for simulation
    if (role === 'supervisor') {
      router.push('/admin');
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="flex h-screen items-center justify-center">Carregando...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
