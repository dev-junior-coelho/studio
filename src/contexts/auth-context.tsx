"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import type { Usuario as AppUsuario } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import { useUser as useFirebaseUser, useFirebase } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

interface AuthContextType {
  user: AppUsuario | null;
  loading: boolean;
  login: (role: 'agente' | 'supervisor') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: ReactNode }) {
  const { user: firebaseUser, isUserLoading: firebaseLoading } = useFirebaseUser();
  const { auth, firestore } = useFirebase();
  const [appUser, setAppUser] = useState<AppUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const syncUser = async () => {
      if (!firebaseLoading) {
        if (firebaseUser && firestore) {
          const userDocRef = doc(firestore, "usuarios", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setAppUser(userDoc.data() as AppUsuario);
          } else {
            // User is authenticated in Firebase Auth, but no user document in Firestore.
            // This can happen during first login. Let's rely on localStorage for role.
             const storedRole = localStorage.getItem('userRole') as 'agente' | 'supervisor';
             if (storedRole) {
                const newUser: AppUsuario = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || `${storedRole}@claro.com.br`,
                    role: storedRole,
                };
                await setDoc(userDocRef, newUser);
                setAppUser(newUser);
             } else {
                setAppUser(null); // No role info, treat as logged out
             }
          }
        } else {
          setAppUser(null);
        }
        setLoading(false);
      }
    };

    syncUser();
  }, [firebaseUser, firebaseLoading, firestore]);

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

  const login = async (role: 'agente' | 'supervisor') => {
    if (!auth || !firestore) return;
    setLoading(true);
    localStorage.setItem('userRole', role);

    try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
        const userDocRef = doc(firestore, "usuarios", user.uid);

        const newUser: AppUsuario = {
            uid: user.uid,
            email: user.email || `${role}@claro.com.br`,
            role: role,
        };

        await setDoc(userDocRef, newUser);
        setAppUser(newUser);
        
        if (role === 'supervisor') {
            router.push('/admin');
        } else {
            router.push('/');
        }
    } catch (error) {
        console.error("Login failed:", error);
        localStorage.removeItem('userRole');
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;
    await auth.signOut();
    setAppUser(null);
    localStorage.removeItem('userRole');
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
  // FirebaseClientProvider is already in the root layout, no need to wrap again.
  return <AuthProviderContent>{children}</AuthProviderContent>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
