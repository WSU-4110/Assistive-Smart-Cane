import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/AuthService';
import { AuthUser, LoginFormData, SignUpFormData } from '../types/auth';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  initializing: boolean;
  signIn: (formData: LoginFormData) => Promise<void>;
  signUp: (formData: Pick<SignUpFormData, 'email' | 'password'>) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const authUser = AuthService.convertToAuthUser(firebaseUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
      
      // Mark initialization as complete after first auth state check
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [initializing]);

  /**
   * Sign in an existing user
   */
  const signIn = async (formData: LoginFormData): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.signIn(formData);
      // Auth state will be updated via onAuthStateChanged listener
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up a new user
   * Returns the Firebase user so the caller can save profile data
   */
  const signUp = async (
    formData: Pick<SignUpFormData, 'email' | 'password'>
  ): Promise<FirebaseUser> => {
    setLoading(true);
    try {
      const firebaseUser = await AuthService.signUp(formData);
      // Auth state will be updated via onAuthStateChanged listener
      return firebaseUser;
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.signOut();
      // Auth state will be updated via onAuthStateChanged listener
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    initializing,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the AuthContext
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

