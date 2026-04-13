// hooks/useAuth.ts
'use client'

import { useState, useEffect } from 'react';

export interface User {
  id: number;
  uuid: string;
  phone: string;
  name?: string;
  role: 'admin' | 'viewer';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';
  const isViewer = user?.role === 'viewer';

  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isViewer,
    isAuthenticated: !!user
  };
};