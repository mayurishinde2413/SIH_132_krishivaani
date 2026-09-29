import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export type UserRole = 'FARMER' | 'BUYER';

export interface FarmerProfile {
  id: number;
  userId: number;
  state: string | null;
  district: string | null;
  taluka: string | null;
  village: string | null;
  landHolding: number | null;
  primaryCrop: string | null;
}

export interface BuyerProfile {
  id: number;
  userId: number;
  companyName: string | null;
  contactPerson: string | null;
  businessType: string | null;
  gstNumber: string | null;
  warehouseLocation: string | null;
  state: string | null;
  district: string | null;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  farmer?: FarmerProfile | null;
  buyer?: BuyerProfile | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('krishi_token');
    const savedUser = localStorage.getItem('krishi_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with /api/auth/me in background
        api.get('/auth/me')
          .then((res) => {
            if (res.data?.data) {
              setUser(res.data.data);
              localStorage.setItem('krishi_user', JSON.stringify(res.data.data));
            }
          })
          .catch(() => {
            // Token expired or invalid
            logout();
          })
          .finally(() => {
            setIsLoading(false);
          });
        return;
      } catch (e) {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('krishi_token', newToken);
    localStorage.setItem('krishi_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('krishi_user', JSON.stringify(res.data.data));
      }
    } catch (e) {
      console.error('Failed to refresh user profile', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
