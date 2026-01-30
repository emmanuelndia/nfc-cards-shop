// src/hooks/ui/useSubmenu.ts
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarItem } from '@/types/components/sidebar';

export function useSubmenu(
  mainNavItems: SidebarItem[],
  othersNavItems: SidebarItem[] = []
) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fonction pour vérifier si un chemin est actif
  const isActive = useCallback(
    (path: string) => {
      return pathname === path || pathname.startsWith(path + '/');
    },
    [pathname]
  );

  // Nouvelle fonction : vérifie si un item (ou ses enfants) est actif
  const isItemActive = useCallback((item: SidebarItem): boolean => {
    // Si l'item a un path direct, vérifier s'il est actif
    if (item.path) {
      return pathname === item.path || pathname.startsWith(item.path + '/');
    }
    
    // Si l'item a des sous-items, vérifier si l'un d'eux est actif
    if (item.subItems) {
      return item.subItems.some(subItem => 
        subItem.path ? (pathname === subItem.path || pathname.startsWith(subItem.path + '/')) : false
      );
    }
    
    return false;
  }, [pathname]); 

  // Gérer l'ouverture/fermeture des sous-menus
  const handleSubmenuToggle = (index: number, type: 'main' | 'others') => {
    setOpenSubmenu((prev) => {
      // Si on clique sur le même menu, on le ferme
      if (prev?.type === type && prev?.index === index) {
        return null;
      }
      // Sinon, on ouvre le nouveau menu
      return { type, index };
    });
  };

  // Ouvrir automatiquement le sous-menu si un enfant est actif (UNIQUEMENT au chargement initial)
  useEffect(() => {
    // Vérifier les items principaux
    mainNavItems.forEach((item, index) => {
      if (item.subItems && isItemActive(item) && !openSubmenu) {
        // Ouvrir le sous-menu seulement s'il n'est pas déjà ouvert
        setOpenSubmenu({ type: 'main', index });
      }
    });

    // Vérifier les autres items
    othersNavItems.forEach((item, index) => {
      if (item.subItems && isItemActive(item) && !openSubmenu) {
        setOpenSubmenu({ type: 'others', index });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuté une seule fois au chargement

  // Recalculer la hauteur des sous-menus quand ils sont ouverts
  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const subMenuElement = subMenuRefs.current[key];
      
      if (subMenuElement) {
        const height = subMenuElement.scrollHeight;
        setSubMenuHeight((prev) => ({ ...prev, [key]: height }));
      }
    }
  }, [openSubmenu]);

  return {
    openSubmenu,
    subMenuHeight,
    subMenuRefs,
    handleSubmenuToggle,
    isActive,
    isItemActive,
  };
}