import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';
import { storageUtils } from '../utils/storage';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = await transformSupabaseUser(session.user);
        setUser(user);
      }
      setIsLoading(false);
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = await transformSupabaseUser(session.user);
          setUser(user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const transformSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    const [rentalGoal, monthlySalaries] = await Promise.all([
      storageUtils.getUserRentalGoal(supabaseUser.id),
      storageUtils.getUserMonthlySalaries(supabaseUser.id)
    ]);
    return {
      id: supabaseUser.id,
      username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'Utilisateur',
      email: supabaseUser.email || '',
      createdAt: new Date(supabaseUser.created_at),
      rentalGoal,
      monthlySalaries
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentative de connexion avec:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erreur de connexion:', error.message);
        console.error('Détails de l\'erreur:', error);
        return false;
      }

      console.log('Connexion réussie:', data);
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentative d\'inscription avec:', { username, email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (error) {
        console.error('Erreur d\'inscription:', error.message);
        console.error('Détails de l\'erreur:', error);
        return false;
      }

      console.log('Inscription réussie:', data);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

