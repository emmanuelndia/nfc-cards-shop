'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDownIcon } from '@/icons';
import { SidebarItem } from '@/types/components/sidebar';

function renderSidebarIcon(
  icon: SidebarItem['icon'],
  className: string,
  fallbackSize: number,
) {
  if (!icon) return null;

  if (React.isValidElement(icon)) return icon;

  if (typeof icon === 'function') {
    return React.createElement(icon as any, { className });
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

interface MenuItemProps {
  item: SidebarItem;
  isActive: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  openSubmenu: { type: string; index: number } | null;
  itemIndex: number;
  menuType: 'main' | 'others';
  onSubmenuToggle: (index: number, menuType: 'main' | 'others') => void;
  subMenuRef?: (el: HTMLDivElement | null) => void;
  subMenuHeight?: number;
}

export function MenuItem({
  item,
  isActive,
  isExpanded,
  isHovered,
  isMobileOpen,
  openSubmenu,
  itemIndex,
  menuType,
  onSubmenuToggle,
  subMenuRef,
  subMenuHeight,
}: MenuItemProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSubmenuOpen =
    openSubmenu?.type === menuType && openSubmenu?.index === itemIndex;

  const normalizePath = (p: string) => {
    if (!p) return '';
    if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
    return p;
  };

  // Déterminez si le menu est en mode "icône seulement" (fermé)
  const isIconOnly = !isExpanded && !isHovered && !isMobileOpen;

  if (item.subItems) {
    return (
      <>
        <button
          onClick={() => onSubmenuToggle(itemIndex, menuType)}
          className={`menu-item group ${
            isSubmenuOpen ? 'menu-item-active' : 'menu-item-inactive'
          } cursor-pointer flex items-center ${
            isIconOnly ? 'justify-center px-0' : 'justify-start'
          }`}
        >
          <span
            className={`${
              isActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
            } ${isIconOnly ? 'mx-0' : ''} flex items-center justify-center`}
          >
            {renderSidebarIcon(item.icon, 'w-5 h-5', 20)}
          </span>
          {!isIconOnly && (
            <>
              <span className="menu-item-text ml-3">{item.name}</span>
              <span className="ml-auto">
                {renderSidebarIcon(
                  ChevronDownIcon as any,
                  `w-5 h-5 transition-transform duration-200 ${
                    isSubmenuOpen ? 'rotate-180 text-brand-500' : ''
                  }`,
                  20,
                )}
              </span>
            </>
          )}
        </button>
        {item.subItems && !isIconOnly && (
          <div
            ref={subMenuRef}
            className="overflow-hidden transition-all duration-300"
            style={{
              height: isSubmenuOpen ? `${subMenuHeight}px` : '0px',
            }}
          >
            <ul className="mt-2 space-y-1 ml-9">
              {item.subItems.map((subItem) => {
                const raw = String(subItem.path || '');
                const [base, query] = raw.split('?');
                const basePath = normalizePath(base);
                const currentPath = normalizePath(pathname);

                const isSameBase = currentPath === basePath;
                const isNested = currentPath.startsWith(`${basePath}/`);

                let isSubItemActive = false;
                if (isSameBase) {
                  if (!query) {
                    // "Toutes les commandes" actif seulement si pas de filtre status
                    const status = (searchParams.get('status') || '').trim();
                    isSubItemActive = status === '';
                  } else {
                    const expected = new URLSearchParams(query);
                    isSubItemActive = true;
                    for (const [k, v] of expected.entries()) {
                      if ((searchParams.get(k) || '').trim() !== v) {
                        isSubItemActive = false;
                        break;
                      }
                    }
                  }
                } else if (isNested) {
                  // sur une page enfant (/admin/orders/[id]), on n'active pas un subitem spécifique
                  isSubItemActive = false;
                }
                return (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path || '#'}
                      className={`menu-dropdown-item flex items-center ${
                        isSubItemActive
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {/* Icône du subItem */}
                      <span className="mr-3 flex-shrink-0 flex items-center justify-center">
                        {subItem.icon ? (
                          renderSidebarIcon(subItem.icon, 'w-4 h-4', 16)
                        ) : (
                          <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                        )}
                      </span>
                      {/* Texte du subItem */}
                      <span className="flex-1 truncate">{subItem.name}</span>
                      {/* Badges */}
                      <span className="flex items-center gap-1 ml-2 flex-shrink-0">
                        {subItem.new && (
                          <span className="menu-dropdown-badge">new</span>
                        )}
                        {subItem.pro && (
                          <span className="menu-dropdown-badge">pro</span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </>
    );
  }

  return (
    item.path && (
      <Link
        href={item.path}
        className={`menu-item group flex items-center ${
          isActive ? 'menu-item-active' : 'menu-item-inactive'
        } ${isIconOnly ? 'justify-center px-0' : 'justify-start'}`}
      >
        <span
          className={`${
            isActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
          } ${isIconOnly ? 'mx-0' : ''} flex items-center justify-center`}
        >
          {renderSidebarIcon(item.icon, 'w-5 h-5', 20)}
        </span>
        {!isIconOnly && (
          <span className="menu-item-text ml-3">{item.name}</span>
        )}
      </Link>
    )
  );
}