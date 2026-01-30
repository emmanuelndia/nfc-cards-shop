/* 'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { User } from '@/types/api/interface/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      setUser(authService.getCurrentUser()); // Récupérer depuis localStorage
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userData = await authService.getProfile();
      setUser(userData);
      setError(null);
      // Mettre à jour localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userData.role);
    } catch (err: any) {
      console.error('useAuth error:', err);
      setError(err?.message || 'Erreur de chargement du profil');
      // Nettoyer le localStorage si token invalide
      if (err.message.includes('401') || err.message.includes('Unauthenticated')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: { name: string; password: string }) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      setUser(result.user);
      setError(null);
      return { success: true, user: result.user };
    } catch (err: any) {
      setError(err?.message || 'Échec de la connexion');
      return { success: false, error: err?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser: fetchUser,
    hasPermission: authService.hasPermission.bind(authService),
    isAdmin: authService.isAdmin.bind(authService),
    isUser: authService.isUser.bind(authService),
  };
} */