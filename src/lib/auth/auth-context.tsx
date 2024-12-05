// src/lib/auth/auth-context.tsx

'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getOptimizationState, clearOptimizationState, getReturnPath, clearReturnPath } from '@/lib/utils/state-preservation';

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  isTestAccount: boolean;
  pendingOptimization: boolean;
  login: (email: string, isTestAccount?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setPendingOptimization: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isTestAccount, setIsTestAccount] = useState(false);
  const [pendingOptimization, setPendingOptimization] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (data.authenticated) {
          setIsLoggedIn(true);
          setUserEmail(data.email);
          setIsTestAccount(data.isTestAccount || false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, isTestAccount: boolean = false) => {
    console.log('[Auth] Login started');
    
    const storedState = getOptimizationState();
    const returnPath = getReturnPath();
    console.log('[Auth] Stored state:', storedState);
    console.log('[Auth] Return path:', returnPath);
  
    if (storedState) {
      console.log('[Auth] Found stored state');
      // Set auth state
      setIsLoggedIn(true);
      setUserEmail(email);
      setIsTestAccount(isTestAccount);
      
      // Use stored return path or construct default, ensuring fromAuth is included
      let redirectPath = returnPath || '/optimize?restore=true&showPayment=true';
      if (!redirectPath.includes('fromAuth=true')) {
        redirectPath += (redirectPath.includes('?') ? '&' : '?') + 'fromAuth=true';
      }
      console.log('[Auth] Redirecting to:', redirectPath);
      
      // Clear return path before navigation
      clearReturnPath();
      
      // Navigate with replace to prevent back button issues
      await router.replace(redirectPath);
    } else {
      console.log('[Auth] No stored state, navigating to dashboard');
      setIsLoggedIn(true);
      setUserEmail(email);
      setIsTestAccount(isTestAccount);
      await router.replace('/dashboard');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setUserEmail(null);
      setIsTestAccount(false);
      setPendingOptimization(false);
      clearOptimizationState();
      clearReturnPath();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        userEmail,
        isTestAccount, 
        pendingOptimization,
        setPendingOptimization, 
        login, 
        logout 
      }}
    >
      {children}
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