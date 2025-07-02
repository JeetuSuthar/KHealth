import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../shared/types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user: loggedInUser, error } = await authService.signIn(email, password);
      
      if (error) {
        toast.error(error);
        return false;
      }
      
      if (loggedInUser) {
        setUser(loggedInUser);
        toast.success('Welcome back!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { user: newUser, error } = await authService.signUp(email, password, name);
      
      if (error) {
        toast.error(error);
        return false;
      }
      
      if (newUser) {
        setUser(newUser);
        toast.success('Account created successfully!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error('Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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