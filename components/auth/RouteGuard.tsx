// src/components/auth/RouteGuard.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    try {
      const rawUser = localStorage.getItem('user');
      const role = localStorage.getItem('role');

      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        setUser({ ...parsed, role: role ?? parsed?.role });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hasPermission = (_permission: string) => {
    const perms = user?.permissions;
    if (!Array.isArray(perms)) return true;
    return perms.includes(_permission);
  };

  return { user, loading, hasPermission, refresh };
};

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'agent';
  requiredPermissions?: string[];
}

export function RouteGuard({ 
  children, 
  requiredRole, 
  requiredPermissions = [] 
}: RouteGuardProps) {
  const { user, loading, hasPermission, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onPageShow = () => refresh();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'user' || e.key === 'role' || e.key === 'token' || e.key === 'auth:event') {
        refresh();
      }
    };
    const onAuthLogout = () => refresh();

    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth:logout', onAuthLogout as EventListener);

    return () => {
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth:logout', onAuthLogout as EventListener);
    };
  }, [refresh]);

  useEffect(() => {
    if (!loading) {
      // Vérifier si l'utilisateur est connecté
      if (!user) {
        router.replace('/login');
        return;
      }

      // Vérifier le rôle si spécifié
      if (requiredRole && String(user.role || '').toLowerCase() !== requiredRole) {
        Swal.fire({
          icon: 'error',
          title: 'Permission refusée',
          text: `Vous devez être ${requiredRole} pour accéder à cette page.`,
          confirmButtonColor: '#465fff',
        }).then(() => {
          router.replace(String(user.role || '').toLowerCase() === 'admin' ? '/admin' : '/user');
        });
        return;
      }

      // Vérifier les permissions si spécifiées
      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission => 
          hasPermission(permission)
        );
        
        if (!hasAllPermissions) {
          Swal.fire({
            icon: 'error',
            title: 'Permissions insuffisantes',
            text: 'Vous ne disposez pas des permissions nécessaires.',
            confirmButtonColor: '#465fff',
          }).then(() => {
            router.replace(String(user.role || '').toLowerCase() === 'admin' ? '/admin' : '/user');
          });
          return;
        }
      }
    }
  }, [user, loading, requiredRole, requiredPermissions, router, hasPermission, refresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirection en cours
  }

  return <>{children}</>;
}