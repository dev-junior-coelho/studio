"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import type { Usuario as AppUsuario } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { useUser as useFirebaseUser, useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { isMaintenanceMode } from '@/lib/maintenance';

interface AuthContextType {
  user: AppUsuario | null;
  loading: boolean;
  login: (role: 'agente' | 'supervisor') => Promise<void>; // Mantido para compatibilidade
  loginWithZ: (zLogin: string, pin: string, mode: 'login' | 'register', role?: 'agente' | 'supervisor', nome?: string, supervisor?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constante para o domínio fictício
const AUTH_DOMAIN = "@interno.studioclaro.app";

function AuthProviderContent({ children }: { children: ReactNode }) {
  const { user: firebaseUser, isUserLoading: firebaseLoading } = useFirebaseUser();
  const { auth, firestore } = useFirebase();
  const [appUser, setAppUser] = useState<AppUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isTestUser = !!appUser?.isTest || appUser?.zLogin === "000000" || appUser?.zLogin === "000001";

  // Periodic lastSeen update for active monitoring
  useEffect(() => {
    if (!appUser || appUser.role !== 'agente' || !firestore || isTestUser) return;

    const updateLastSeen = async () => {
      try {
        await setDoc(doc(firestore, "usuarios", appUser.uid), {
          lastSeen: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Error updating heart-beat:", err);
      }
    };

    updateLastSeen(); // Initial update
    const interval = setInterval(updateLastSeen, 5 * 60 * 1000); // Every 5 mins
    return () => clearInterval(interval);
  }, [appUser?.uid, appUser?.role, firestore]);

  useEffect(() => {
    const syncUser = async () => {
      if (!firebaseLoading) {
        if (firebaseUser && firestore) {
          const userDocRef = doc(firestore, "usuarios", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as AppUsuario;

            // SEGURANÇA: Se for agente e não tiver Z-Login, força o logout automático
            if (userData.role === 'agente' && !userData.zLogin) {
              console.warn("Usuário sem Z-Login detectado. Forçando logout por segurança.");
              await auth?.signOut();
              setAppUser(null);
            } else {
              setAppUser(userData);
              // Update lastSeen on sync if agent
              const shouldUpdateLastSeen =
                userData.role === "agente" &&
                !userData.isTest &&
                userData.zLogin !== "000000" &&
                userData.zLogin !== "000001";
              if (shouldUpdateLastSeen) {
                await setDoc(userDocRef, { lastSeen: new Date().toISOString() }, { merge: true });
              }
            }
          } else {
            // Se o usuário está no Auth mas não no Firestore com Z-Login, desloga
            console.warn("Perfil não encontrado no Firestore. Forçando logout.");
            await auth?.signOut();
            setAppUser(null);
          }
        } else {
          setAppUser(null);
        }
        setLoading(false);
      }
    };

    syncUser();
  }, [firebaseUser, firebaseLoading, firestore, auth]);

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

      // Se for agente tentando entrar no admin, volta para a home dos agentes
      if (isAdminRoute && appUser.role !== 'supervisor') {
        router.push('/');
      }

      // Se for supervisor fora do admin e não estiver no login, vai para o admin
      if (!isAdminRoute && !isAuthRoute && appUser.role === 'supervisor') {
        router.push('/admin');
      }
    }
  }, [appUser, loading, pathname, router]);

  const loginWithZ = async (zLogin: string, pin: string, mode: 'login' | 'register', roleArg: 'agente' | 'supervisor' = 'agente', nome?: string, supervisor?: string) => {
    if (!auth || !firestore) return;
    
    // Verificar se o sistema está em manutenção
    if (isMaintenanceMode()) {
      throw new Error("MANUTENÇÃO: O sistema está em manutenção no momento. Por favor, tente novamente mais tarde.");
    }
    
    setLoading(true);

    const email = `z${zLogin}${AUTH_DOMAIN}`;
    const firebasePassword = `SCApp-${pin}`;

    try {
      let userCredential;

      if (mode === 'register') {
        if (roleArg !== 'agente') {
          throw new Error("Cadastro de supervisor deve ser feito por um administrador.");
        }

        userCredential = await createUserWithEmailAndPassword(auth, email, firebasePassword);
        const user = userCredential.user;

        // Criar perfil no Firestore
        const newUser: AppUsuario = {
          uid: user.uid,
          email: email,
          role: 'agente',
          nome: nome || '', // Nome completo do agente
          zLogin: zLogin, // Número Z sem o prefixo
          supervisor: supervisor, // Supervisor (GILVAN, HELIO, MARIANA PAIXÃO)
          lastSeen: new Date().toISOString(),
          isTest: zLogin === "000000" || zLogin === "000001"
        };

        await setDoc(doc(firestore, "usuarios", user.uid), newUser);
        setAppUser(newUser);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, firebasePassword);
        const userDocRef = doc(firestore, "usuarios", userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await auth.signOut();
          setAppUser(null);
          throw new Error("Perfil não encontrado. Contate um supervisor.");
        }

        const userData = userDoc.data() as AppUsuario;
        setAppUser(userData);
        router.push(userData.role === 'supervisor' ? '/admin' : '/');
        return;
      }

      router.push('/');
    } catch (error) {
      console.error("Z-Login failed:", error);
      throw error; // Re-throw para a UI mostrar o erro
    } finally {
      setLoading(false);
    }
  };

  const login = async (role: 'agente' | 'supervisor') => {
    console.warn(`Legacy ${role} login is disabled. Use Z-Login instead.`);
    throw new Error("Login legado desativado. Use o Login Z.");
  };

  const logout = async () => {
    if (!auth || !firestore || !appUser) return;

    // Set lastSeen to null/old to signal offline
    try {
      await setDoc(doc(firestore, "usuarios", appUser.uid), {
        lastSeen: null
      }, { merge: true });
    } catch (e) { }

    await auth.signOut();
    setAppUser(null);
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const value = { user: appUser, loading, login, loginWithZ, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="flex h-screen items-center justify-center">Carregando...</div> : children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthProviderContent>{children}</AuthProviderContent>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
