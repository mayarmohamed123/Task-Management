import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/index.js';
import { loginApi, registerApi, getMeApi } from '../features/auth/api/authApi.js';
import { LoginFormValues, RegisterFormValues } from '../features/auth/schemas/authSchema.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormValues) => Promise<void>;
  register: (data: RegisterFormValues) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('taskflow_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token');
    setToken(null);
    setUser(null);
  }, []);

  // Fetch current user if token exists on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getMeApi();
        setUser(userData);
        setToken(storedToken);
      } catch (err) {
        console.error('Failed to restore auth session:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  // Listen for unauthorized 401 response events
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  const login = async (data: LoginFormValues) => {
    const res = await loginApi(data);
    localStorage.setItem('taskflow_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: RegisterFormValues) => {
    const res = await registerApi(data);
    localStorage.setItem('taskflow_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
