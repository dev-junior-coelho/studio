"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import type { Usuario as AppUsuario } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { useUser as useFirebaseUser, useFirebase } from '@/firebase';
import { signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

interface AuthContextType {
  user: AppUsuario | null;
  loading: boolean;
  login: (role: 'agente' | 'supervisor') => void; // Mantendo para compatibilidade se precisar
  loginWithZ: (zLogin: string, pin: string, mode: 'login' | 'register', role?: 'agente' | 'supervisor', nome?: string) => Promise<void>;
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

  // Periodic lastSeen update for active monitoring
  useEffect(() => {
    if (!appUser || appUser.role !== 'agente' || !firestore) return;

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
              if (userData.role === 'agente') {
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
    setLoading(true);

    const role = roleArg; // Explicitly use the argument
    const email = `z${zLogin}${AUTH_DOMAIN}`;
    // A senha/PIN deve ter 6 caracteres no Firebase Auth no mínimo?
    // Firebase exige senha de 6 caracteres.
    // O usuário pediu "senha numérica de 4 dígitos".
    // SOLUÇÃO: Vamos adicionar um "sal fixo" ou prefixo interno para completar 6 chars se for < 6.
    // Ou simplesmente duplicar o pin? Não, inseguro.
    // Vamos usar um prefixo interno fixo: "SCApp-" + pin => "SCApp-1234" (10 chars).
    const firebasePassword = `SCApp-${pin}`;

    console.log(`Tentativa de ${mode} como ${role}:`, { email, passwordLength: firebasePassword.length });

    try {
      let userCredential;

      if (mode === 'register') {
        userCredential = await createUserWithEmailAndPassword(auth, email, firebasePassword);
        const user = userCredential.user;

        // Criar perfil no Firestore
        const newUser: AppUsuario = {
          uid: user.uid,
          email: email,
          role: role,
          nome: nome || '', // Nome completo do agente
          zLogin: zLogin, // Número Z sem o prefixo
          supervisor: supervisor, // Supervisor (GILVAN, HELIO, MARIANA PAIXÃO)
          lastSeen: new Date().toISOString()
        };

        await setDoc(doc(firestore, "usuarios", user.uid), newUser);
        setAppUser(newUser);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, firebasePassword);
        // lastSeen will be updated by the syncUser useEffect
      }

      // REDIRECIONAMENTO CORRETO:
      // Se o syncUser ainda não terminou, usamos o role argument ou esperamos
      // Mas para garantir o fluxo imediato:
      if (role === 'supervisor') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error("Z-Login failed:", error);
      throw error; // Re-throw para a UI mostrar o erro
    } finally {
      setLoading(false);
    }
  };

  // Mantido para compatibilidade ou uso de Supervisor (poderia ser adaptado)
  const login = async (role: 'agente' | 'supervisor') => {
    // Deprecated implementation for now, or fallback
    if (!auth || !firestore) return;
    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      const newUser: AppUsuario = {
        uid: user.uid,
        email: `${role}@anon.com`,
        role: role,
        lastSeen: new Date().toISOString()
      };
      await setDoc(doc(firestore, "usuarios", user.uid), newUser);
      setAppUser(newUser);
      router.push(role === 'supervisor' ? '/admin' : '/');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
