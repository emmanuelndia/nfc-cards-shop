// components/layout/UserProfile.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  UserCircleIcon, 
  CogIcon,
  ChevronDownIcon,
  BoxCubeIcon,
  ShieldIcon 
} from '@/icons';

function renderIcon(
  icon: any,
  className: string,
  fallbackSize: number,
) {
  if (!icon) return null;

  if (React.isValidElement(icon)) return icon;

  if (typeof icon === 'function') {
    return React.createElement(icon, { className });
  }

  if (typeof icon === 'object' && icon !== null && 'src' in icon) {
    const src = (icon as any).src;
    const width = (icon as any).width ?? fallbackSize;
    const height = (icon as any).height ?? fallbackSize;

    return (
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return null;
}

interface UserProfileProps {
  user: any;
  loading: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  onLogout: () => void;
}

export function UserProfile({
  user,
  loading,
  isExpanded,
  isHovered,
  isMobileOpen,
  onLogout,
}: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isIconOnly = !isExpanded && !isHovered && !isMobileOpen;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className={`flex ${isIconOnly ? 'justify-center' : 'justify-start'}`}>
        <Link
          href="/auth/signin"
          className="menu-item group flex items-center justify-center"
        >
          {renderIcon(UserCircleIcon, 'menu-item-icon-inactive', 24)}
          {!isIconOnly && <span className="menu-item-text ml-3">Se connecter</span>}
        </Link>
      </div>
    );
  }
  
  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  const isAdmin = user?.role === 'ADMIN' || isSuperAdmin;

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`menu-item group flex items-center w-full ${
          isIconOnly ? 'justify-center' : 'justify-between'
        }`}
      >
        <div className="flex items-center">
          <div className="relative">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
            )}
            {isSuperAdmin && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                {renderIcon(ShieldIcon, 'w-3 h-3 text-white', 12)}
              </div>
            )}
            {isAdmin && !isSuperAdmin && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                {renderIcon(ShieldIcon, 'w-3 h-3 text-white', 12)}
              </div>
            )}
          </div>
          
          {!isIconOnly && (
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]">
                {user.name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                {isSuperAdmin && (
                  <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                    Super Admin
                  </span>
                )}
                {isAdmin && !isSuperAdmin && (
                  <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    Admin
                  </span>
                )}
                {!isAdmin && !isSuperAdmin && (
                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded">
                    User
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
        
        {!isIconOnly && (
          renderIcon(
            ChevronDownIcon,
            `w-5 h-5 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`,
            20,
          )
        )}
      </button>
      
      {!isIconOnly && isDropdownOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <Link
            href={isAdmin || isSuperAdmin ? "/admin/profile" : "/user/profile"}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsDropdownOpen(false)}
          >
            {renderIcon(UserCircleIcon, 'w-4 h-4 mr-3', 16)}
            Mon profil
          </Link>
          <Link
            href={isAdmin || isSuperAdmin ? "/admin/settings" : "/user/settings"}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsDropdownOpen(false)}
          >
            {renderIcon(CogIcon, 'w-4 h-4 mr-3', 16)}
            Paramètres
          </Link>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              onLogout();
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {renderIcon(BoxCubeIcon, 'w-4 h-4 mr-3', 16)}
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}