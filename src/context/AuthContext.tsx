import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, User, signInWithEmail, signUpWithEmail, signOut as authSignOut, getCurrentUser, getUserProfile } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await getUserProfile(userId);

      if (error) {
        console.error('Error fetching user profile:', error);
        // If user doesn't exist in our users table, create them
        if (error.code === 'PGRST116') {
          const authUser = await getCurrentUser();
          if (authUser) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: authUser.id,
                email: authUser.email!,
                full_name: authUser.user_metadata?.full_name || authUser.email,
                role: 'user',
                is_verified: false,
                wallet_balance: 0.00
              });
            
            if (!insertError) {
              // Retry fetching the profile
              const { data: newData } = await getUserProfile(userId);
              setUser(newData);
            }
          }
        }
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await signInWithEmail(email, password);

    if (!error) {
      setShowAuthModal(false);
    } else {
      setLoading(false);
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    const { error } = await signUpWithEmail(email, password, fullName);

    if (!error) {
      setShowAuthModal(false);
    } else {
      setLoading(false);
    }

    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await authSignOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'No user logged in' };

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, ...updates });
    }

    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      showAuthModal,
      setShowAuthModal,
      signIn,
      signUp,
      signOut,
      updateProfile,
      refreshUser
    }}>
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