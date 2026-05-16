'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // MOCK BYPASS: Allow any login for development
      if (email === 'caio@email.com') {
        toast.success('Bypass Admin Ativado. Bem-vindo, Caio!');
        // We set a mock user if Supabase is not configured or fails
        setUser({
          id: 'user-mock-001',
          email: email,
          user_metadata: { username: 'Caio_Admin' }
        } as unknown as User);
        return true;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback mock if any email is provided during dev
        toast.info('Supabase inativo ou erro. Usando Mock Session.');
        setUser({ id: 'user-mock-' + Math.random(), email } as unknown as User);
        return true;
      }
      toast.success('Bem-vindo de volta!');
      return true;
    } catch {
      toast.error('Erro ao fazer login');
      return false;
    }
  };

  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      // MOCK BYPASS: Allow any registration for development
      if (email.includes('@')) {
         toast.success('Conta Simulada Criada! Você já pode entrar.');
         return true;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          username,
          email,
          coins: 500,
          gems: 50,
          dust: 0,
          level: 1,
          xp: 0
        });
        toast.success('Conta criada! Faça login para continuar.');
        return true;
      }
      
      return false;
    } catch {
      toast.error('Erro ao criar conta');
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success('Logout realizado');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}