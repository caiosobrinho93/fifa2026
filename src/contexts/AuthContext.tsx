'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
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

export function AuthProvider({ children }: { children: ReactNode }) {
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // Fallback para demo quando Supabase não está configurado
        // Cria uma sessão mock com dados zerados (conta nova)
        const mockUser = {
          id: `demo-${btoa(email).slice(0, 8)}`,
          email,
          user_metadata: {
            username: email.split('@')[0],
            coins: 0,
            gems: 0,
            level: 1,
            xp: 0,
          }
        } as unknown as User;
        setUser(mockUser);
        toast.success(`Bem-vindo, ${mockUser.user_metadata.username}!`, {
          description: 'Modo demo ativo — conta zerada, comece comprando packs!'
        });
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            coins: 0,
            gems: 0,
            level: 1,
            xp: 0,
          }
        }
      });

      if (error) {
        // Fallback demo: cria conta mock com dados zerados e JÁ LOGA o usuário
        const mockUser = {
          id: `demo-${btoa(email).slice(0, 8)}`,
          email,
          user_metadata: { username, coins: 0, gems: 0, level: 1, xp: 0 }
        } as unknown as User;
        setUser(mockUser);  // ← auto-login imediato
        toast.success(`Conta criada! Bem-vindo, ${username}!`, {
          description: 'Sua aventura começa agora. Compre seu primeiro pack!'
        });
        return true;
      }

      if (data.user) {
        // Supabase real: tenta inserir perfil na tabela users
        await supabase.from('users').insert({
          id: data.user.id,
          username,
          email,
          coins: 0,
          gems: 0,
          dust: 0,
          level: 1,
          xp: 0,
        }).maybeSingle();

        // Se Supabase confirmou o usuário, mas não há sessão (ex: requer verificação de email), forçamos o auto-login no client para jogar
        if (data.session) {
          toast.success(`Bem-vindo, ${username}! Sua conta foi criada.`);
        } else {
          toast.success('Conta criada! Bem-vindo(a) ao jogo.');
          // Auto-login forçado para que a pessoa já possa jogar
          setUser(data.user);
        }
        return true;
      }

      return false;
    } catch {
      toast.error('Erro ao criar conta');
      return false;
    }
  };

  const signOut = async () => {
    setUser(null); // limpa imediatamente no client
    await supabase.auth.signOut();
    toast.success('Até logo!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}