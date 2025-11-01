"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Usuario as AppUsuario } from '@/lib/types'; // Renomeando para evitar conflito
import { useRouter, usePathname } from 'next/navigation';
import { FirebaseClientProvider, useUser as useFirebaseUser } from '@/firebase'; // Importando o provider e o hook de user do firebase

interface AuthContextType {
  user: AppUsuario | null;
  loading: boolean;
  login: (role: 'agente' | 'supervisor') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data para simular perfis locais
const mockUsers: { [key in 'agente' | 'supervisor']: AppUsuario } = {
  agente: { uid: 'agente-123', email: 'agente@claro.com.br', role: 'agente' },
  supervisor: { uid: 'supervisor-456', email: 'supervisor@claro.com.br', role: 'supervisor' },
};

function AuthProviderContent({ children }: { children: ReactNode }) {
  const { user: firebaseUser, isUserLoading: firebaseLoading } = useFirebaseUser();
  const [appUser, setAppUser] = useState<AppUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sincroniza o usuário local com o estado do Firebase Auth ou localStorage
    if (!firebaseLoading) {
      const storedUserRole = localStorage.getItem('userRole') as 'agente' | 'supervisor' | null;
      if (firebaseUser) {
        // Se há um usuário firebase, tentamos mapear para um usuário da aplicação
        const role = localStorage.getItem('userRole') as 'agente' | 'supervisor' || 'agente';
         setAppUser({
           uid: firebaseUser.uid,
           email: firebaseUser.email || 'desconhecido',
           role: role
         });
      } else if (storedUserRole && mockUsers[storedUserRole]) {
        // Fallback para o mock se não houver usuário firebase (cenário de simulação)
        setAppUser(mockUsers[storedUserRole]);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    }
  }, [firebaseUser, firebaseLoading]);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname === '/login';
    const isAdminRoute = pathname.startsWith('/admin');

    if (!appUser && !isAuthRoute) {
      router.push('/login');
    } else if (appUser) {
      if (isAuthRoute) {
        router.push(appUser.role === 'supervisor' ? '/admin' : '/');
      }
      if (isAdminRoute && appUser.role !== 'supervisor') {
        router.push('/');
      }
    }
  }, [appUser, loading, pathname, router]);

  const login = (role: 'agente' | 'supervisor') => {
    setLoading(true);
    const userToLogin = mockUsers[role];
    setAppUser(userToLogin);
    localStorage.setItem('userRole', role);
    if (role === 'supervisor') {
      router.push('/admin');
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const logout = () => {
    setAppUser(null);
    localStorage.removeItem('userRole');
    // Aqui também deveria ter a lógica de logout do Firebase
    router.push('/login');
  };

  const value = { user: appUser, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="flex h-screen items-center justify-center">Carregando...</div> : children}
    </AuthContext.Provider>
  );
}


export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </FirebaseClientProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
