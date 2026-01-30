import {
  GridIcon,
  UserCircleIcon,
  ListIcon,
  ClockIcon,
  CheckCircleIcon,
  UsersIcon,
  SettingsIcon,
  DocsIcon,
  DashboardIcon,
  ChartBarIcon,
  CogIcon,
  LocationIcon,
} from '@/icons';
import { SidebarItem } from '@/types/components/sidebar';
import { BlocksIcon } from 'lucide-react';

// Navigation pour les administrateurs (ADMIN) - NFC Cards Management
export const adminNavigation: SidebarItem[] = [
  {
    icon: DashboardIcon,
    name: 'Tableau de bord',
    path: '/admin',
  },
  {
    icon: DocsIcon, 
    name: 'Commandes',
    subItems: [
      { icon: ListIcon, name: 'Toutes les commandes', path: '/admin/orders' },
      { icon: ClockIcon, name: 'En attente', path: '/admin/orders?status=PENDING' },
      { icon: CheckCircleIcon, name: 'Payées', path: '/admin/orders?status=PAID' },
    ],
  },
  {
    icon: ChartBarIcon,
    name: 'Statistiques',
    path: '/admin/statistics',
  },
  {
    icon: SettingsIcon,
    name: 'Paramètres',
    path: '/admin/settings',
  },
];

export const superAdminNavigation: SidebarItem[] = [
  ...adminNavigation,
  {
    icon: UsersIcon,
    name: 'Utilisateurs',
    path: '/admin/users',
  },
];

// Navigation pour les utilisateurs normaux (USER) - Clients
export const userNavigation: SidebarItem[] = [
  {
    icon: DashboardIcon,
    name: 'Tableau de bord',
    path: '/user',
  },
  {
    icon: DocsIcon,
    name: 'Mes commandes',
    subItems: [
      { 
        icon: ListIcon, 
        name: 'Historique', 
        path: '/user/orders'
      },
      { 
        icon: ClockIcon, 
        name: 'En cours', 
        path: '/user/orders/pending'
      },
      { 
        icon: CheckCircleIcon, 
        name: 'Terminées', 
        path: '/user/orders/completed'
      },
    ],
  },
  {
    icon: BlocksIcon,
    name: 'Mes cartes',
    subItems: [
      { 
        icon: GridIcon, 
        name: 'Actives', 
        path: '/user/cards/active'
      },
      { 
        icon: CogIcon, 
        name: 'Personnaliser', 
        path: '/user/cards/customize'
      },
    ],
  },
  {
    icon: UserCircleIcon,
    name: 'Mon compte',
    subItems: [
      { 
        icon: UserCircleIcon, 
        name: 'Profil', 
        path: '/user/account/profile'
      },
      { 
        icon: LocationIcon, 
        name: 'Adresses', 
        path: '/user/account/addresses'
      },
      { 
        icon: ListIcon, 
        name: 'Moyens de paiement', 
        path: '/user/account/payment-methods'
      },
    ],
  },
];

// Fonction utilitaire pour obtenir la navigation selon le rôle
export const getNavigationByRole = (role?: string): SidebarItem[] => {
  switch (role?.toUpperCase()) {
    case 'SUPERADMIN':
      return superAdminNavigation;
    case 'ADMIN':
      return adminNavigation;
    case 'USER':
      return userNavigation;
    default:
      return userNavigation; // Par défaut, navigation utilisateur
  }
};

// Fonction pour vérifier si un chemin est accessible par un rôle
export const isPathAccessibleByRole = (path: string, role?: string): boolean => {
  const navigation = getNavigationByRole(role);
  
  const checkPath = (items: SidebarItem[]): boolean => {
    for (const item of items) {
      if (item.path === path) return true;
      if (item.subItems && checkPath(item.subItems)) return true;
    }
    return false;
  };
  
  return checkPath(navigation);
};

// Fonction pour obtenir le chemin par défaut selon le rôle
export const getDefaultPathByRole = (role?: string): string => {
  switch (role?.toUpperCase()) {
    case 'SUPERADMIN':
      return '/admin';
    case 'ADMIN':
      return '/admin';
    case 'USER':
      return '/user';
    default:
      return '/auth/signin';
  }
};