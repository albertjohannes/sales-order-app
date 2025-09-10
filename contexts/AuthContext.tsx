import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredEmail();
  }, []);

  const loadStoredEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('user_email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error('Error loading stored email:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string) => {
    try {
      await AsyncStorage.setItem('user_email', email);
      setEmail(email);
    } catch (error) {
      console.error('Error storing email:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_email');
      setEmail(null);
    } catch (error) {
      console.error('Error removing email:', error);
    }
  };

  const value = {
    email,
    isAuthenticated: !!email,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
