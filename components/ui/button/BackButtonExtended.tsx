"use client";

import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react";

interface BackButtonExtendedProps {
  /** Texte ou contenu du bouton */
  children?: ReactNode;
  /** Classe CSS personnalisée */
  className?: string;
  /** Fonction de callback */
  onBack?: () => void;
  /** URL alternative */
  href?: string;
  /** Désactiver le bouton */
  disabled?: boolean;
  /** Afficher un indicateur de chargement */
  loading?: boolean;
  /** Icône personnalisée */
  icon?: ReactNode;
  /** Position de l'icône */
  iconPosition?: "left" | "right";
}

export const BackButtonExtended: FC<BackButtonExtendedProps> = ({
  children = "Retour",
  className = "",
  onBack,
  href,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (disabled || loading) return;
    
    if (onBack) {
      onBack();
    }
    
    if (href) {
      router.push(href);
      return;
    }
    
    router.back();
  };

  const defaultIcon = (
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M15 19l-7-7 7-7" 
      />
    </svg>
  );

  const displayIcon = icon || defaultIcon;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={typeof children === 'string' ? children : 'Retour'}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin w-4 h-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Chargement...
        </>
      ) : (
        <>
          {iconPosition === "left" && displayIcon && (
            <span className="mr-1">{displayIcon}</span>
          )}
          {children}
          {iconPosition === "right" && displayIcon && (
            <span className="ml-1">{displayIcon}</span>
          )}
        </>
      )}
    </button>
  );
};