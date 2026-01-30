// src/components/layout/AppSidebar.tsx
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { useToast } from '@/hooks/ui/useToast';

// Importez les icônes nécessaires de react-icons
import { HiDotsHorizontal } from 'react-icons/hi';

// Importez les composants nécessaires
import { MenuItem } from './MenuItem';
import { UserProfile } from './UserProfile';

// Importez la navigation depuis les constantes
import { getNavigationByRole } from '@/constants/navigation-by-role';

// Créez un hook useAuth simplifié si vous n'en avez pas
const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      const role = localStorage.getItem('role');
      
      if (userData && role) {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          role
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      document.cookie = 'user=; path=/; max-age=0';
      document.cookie = 'role=; path=/; max-age=0';
      document.cookie = 'token=; path=/; max-age=0';
      
      setUser(null);
      return true;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  };

  return { user, loading, logout };
};

// Créez un hook useSubmenu simplifié
const normalizePath = (p: string) => {
  if (!p) return '';
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
};

const useSubmenu = ({
  pathname,
  searchParams,
}: {
  pathname: string;
  searchParams: URLSearchParams;
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<any>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    if (openSubmenu?.type === menuType && openSubmenu?.index === index) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu({ type: menuType, index });
    }
  };

  const isItemActive = (item: any) => {
    const currentPath = normalizePath(pathname);
    const itemPath = normalizePath(String(item?.path || ''));

    if (itemPath) {
      if (itemPath === '/admin') return currentPath === '/admin';
      if (itemPath === '/user') return currentPath === '/user';
      if (currentPath === itemPath) return true;
      if (currentPath.startsWith(`${itemPath}/`)) return true;
    }

    if (item?.subItems) {
      return item.subItems.some((subItem: any) => {
        const raw = String(subItem?.path || '');
        const [base, query] = raw.split('?');
        const basePath = normalizePath(base);
        if (!basePath) return false;

        // Activer le parent même sur les routes enfants (ex: /admin/orders/[id])
        const isSameBase = currentPath === basePath;
        const isNested = currentPath.startsWith(`${basePath}/`);
        if (!isSameBase && !isNested) return false;

        // Si on est sur une route enfant, on considère le parent actif sans matcher les query params
        if (isNested) return true;

        if (!query) {
          // exemple: "Toutes les commandes" => actif seulement si pas de filtre status
          const status = (searchParams.get('status') || '').trim();
          return status === '';
        }

        const expected = new URLSearchParams(query);
        for (const [k, v] of expected.entries()) {
          if ((searchParams.get(k) || '').trim() !== v) return false;
        }
        return true;
      });
    }

    return false;
  };

  useEffect(() => {
    if (!openSubmenu) return;
    const key = `${openSubmenu.type}-${openSubmenu.index}`;
    const el = subMenuRefs.current?.[key];
    if (!el) return;
    setSubMenuHeight((prev) => ({
      ...prev,
      [key]: el.scrollHeight,
    }));
  }, [openSubmenu]);

  return {
    openSubmenu,
    subMenuHeight,
    subMenuRefs,
    handleSubmenuToggle,
    isItemActive,
    setOpenSubmenu,
  };
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Récupérer la navigation selon le rôle depuis les constantes
  const navigationItems = getNavigationByRole(user?.role);

  // Pour useSubmenu, on passe seulement mainNavItems
  const {
    openSubmenu,
    subMenuHeight,
    subMenuRefs,
    handleSubmenuToggle,
    isItemActive,
    setOpenSubmenu,
  } = useSubmenu({ pathname, searchParams });

  const activeSubmenuIndex = useMemo(() => {
    return navigationItems.findIndex((item: any) => item?.subItems && isItemActive(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationItems, pathname, searchParams]);

  useEffect(() => {
    if (activeSubmenuIndex >= 0) {
      setOpenSubmenu({ type: 'main', index: activeSubmenuIndex });
    }
  }, [activeSubmenuIndex, setOpenSubmenu]);

  const handleLogout = async () => {
    try {
      await logout();

      try {
        window.dispatchEvent(new Event('auth:logout'));
        localStorage.setItem('auth:event', JSON.stringify({ type: 'logout', ts: Date.now() }));
      } catch {
        // ignore
      }

      showToast({
        type: 'success',
        title: 'Déconnexion réussie',
        message: 'Vous avez été déconnecté avec succès.',
      });

      setTimeout(() => {
        router.replace('/login');
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error('Logout error:', err);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de se déconnecter. Réessayez.',
      });
    }
  };

  const renderMenuItems = (items: any[]) => (
    <ul className="flex flex-col gap-4">
      {items && items.map((item, index) => {
        // Sécurité : si l'item n'existe pas ou n'a pas de nom, on passe
        if (!item || !item.name) return null;

        return (
          <li key={`${item.name}-${index}`}>
            <MenuItem
              item={item}
              isActive={isItemActive(item)}
              isExpanded={isExpanded}
              isHovered={isHovered}
              isMobileOpen={isMobileOpen}
              openSubmenu={openSubmenu}
              itemIndex={index}
              menuType="main"
              onSubmenuToggle={handleSubmenuToggle}
              // On s'assure que subMenuRefs.current existe
              subMenuRef={(el) => {
                if (subMenuRefs.current) {
                  subMenuRefs.current[`main-${index}`] = el;
                }
              }}
              subMenuHeight={subMenuHeight[`main-${index}`] ?? 0}
            />
          </li>
        );
      })}
    </ul>
  );

  // Si l'utilisateur n'est pas connecté, ne pas afficher la sidebar
  if (!user && !loading) {
    return null;
  }

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
            ? 'w-[290px]'
            : 'w-[90px]'
        }
        ${
          isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-center'
        }`}
      >
        <Link href={user?.role === 'ADMIN' ? '/admin' : '/user'}>
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="dark:hidden">
              <div className="text-2xl font-bold text-accent-500">
                NFC Cards
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-accent-500 text-white rounded-lg font-bold">
              NFC
            </div>
          )}
        </Link>
      </div>

      {/* Menu principal */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HiDotsHorizontal className="w-4 h-4" />
                )}
              </h2>
              {renderMenuItems(navigationItems)}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer utilisateur */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 pb-6 px-2">
        <UserProfile
          user={user}
          loading={loading}
          isExpanded={isExpanded}
          isHovered={isHovered}
          isMobileOpen={isMobileOpen}
          onLogout={handleLogout}
        />
      </div>
    </aside>
  );
};

export default AppSidebar;