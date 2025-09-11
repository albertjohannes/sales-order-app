import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  validateEmail: (email: string) => { isValid: boolean; error?: string };
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

  const validateEmail = (email: string) => {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!email.endsWith('@fairbanc.app')) {
      return { 
        isValid: false, 
        error: 'Email must be from @fairbanc.app domain' 
      };
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    return { isValid: true };
  };

  const login = async (email: string) => {
    const validation = validateEmail(email);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
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
    validateEmail,
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
