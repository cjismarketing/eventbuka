import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, User, signInWithEmail, signUpWithEmail, signOut as authSignOut, getCurrentUser, getUserProfile, testDatabaseFunctions } from '../lib/supabase';
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
  testDatabase: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Test database connection first
      console.log('🔄 Initializing authentication...');
      
      // Get initial session
      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
      } else {
        console.log('✅ Session retrieved:', initialSession ? 'Active' : 'None');
        setSession(initialSession);
        
        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id);
        } else {
          setLoading(false);
        }
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔄 Fetching user profile for:', userId);
      
      // Retry mechanism to handle race conditions with database triggers
      let retries = 0;
      const maxRetries = 5;
      const retryDelay = 1000; // 1 second
      
      while (retries < maxRetries) {
        const { data, error } = await getUserProfile(userId);
        
        if (data) {
          console.log('✅ User profile fetched:', data.email, data.role);
          setUser(data);
          return;
        }
        
        if (error && error.code !== 'PGRST116') {
          // If it's not a "row not found" error, don't retry
          console.error('❌ Error fetching user profile:', error);
          break;
        }
        
        // If user profile not found, wait and retry (database trigger might still be processing)
        retries++;
        console.log(`🔄 User profile not found, retrying... (${retries}/${maxRetries})`);
        
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
      
      console.error('❌ Failed to fetch user profile after retries');
    } catch (error) {
      console.error('❌ Exception fetching user profile:', error);
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
    console.log('🔄 Signing in user:', email);
    
    const { data, error } = await signInWithEmail(email, password);

    if (!error && data) {
      console.log('✅ Sign in successful');
      setShowAuthModal(false);
    } else {
      console.error('❌ Sign in failed:', error);
      setLoading(false);
    }

    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    console.log('🔄 Signing up user:', email);
    
    const { data, error } = await signUpWithEmail(email, password, fullName);

    if (!error && data) {
      console.log('✅ Sign up successful');
      setShowAuthModal(false);
    } else {
      console.error('❌ Sign up failed:', error);
      setLoading(false);
    }

    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    console.log('🔄 Signing out user');
    
    await authSignOut();
    setUser(null);
    setSession(null);
    setLoading(false);
    
    console.log('✅ Sign out successful');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'No user logged in' };

    console.log('🔄 Updating user profile:', updates);

    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, ...updates });
      console.log('✅ Profile updated successfully');
    } else {
      console.error('❌ Profile update failed:', error);
    }

    return { error };
  };

  const testDatabase = async () => {
    console.log('🧪 Testing database from AuthContext...');
    return await testDatabaseFunctions();
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
      refreshUser,
      testDatabase
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