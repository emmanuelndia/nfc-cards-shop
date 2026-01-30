"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

interface BackButtonProps {
  /** Texte du bouton */
  label?: string;
  /** Classe CSS personnalisée */
  className?: string;
  /** Fonction de callback après le retour */
  onBack?: () => void;
  /** URL alternative si on ne veut pas utiliser router.back() */
  href?: string;
  /** Afficher l'icône */
  showIcon?: boolean;
  /** Variante de style */
  variant?: "default" | "ghost" | "outline";
  /** Taille du bouton */
  size?: "sm" | "md" | "lg";
}

export const BackButton: FC<BackButtonProps> = ({
  label = "Retour",
  className = "",
  onBack,
  href,
  showIcon = true,
  variant = "default",
  size = "md",
}) => {
  const router = useRouter();

  const handleClick = () => {
    // Exécute le callback si fourni
    if (onBack) {
      onBack();
    }
    
    // Si une URL alternative est fournie, on y navigue
    if (href) {
      router.push(href);
      return;
    }
    
    // Sinon, retour en arrière
    router.back();
  };

  // Classes de base
  const baseClasses = "inline-flex items-center transition-colors focus:outline-none  ";
  
  // Classes pour les variants
  const variantClasses = {
    default: "text-gray-500 dark:text-gray-400 dark:hover:text-gray-300",
    ghost: "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md",
    outline: "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 px-3 py-2 rounded-md",
  };
  
  // Classes pour les tailles
  const sizeClasses = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
  };
  
  // Classes pour l'icône selon la taille
  const iconSizeClasses = {
    sm: "w-3 h-3 mr-1",
    md: "w-4 h-4 mr-1",
    lg: "w-5 h-5 mr-1.5",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={label}
    >
      {showIcon && (
        <svg 
          className={iconSizeClasses[size]} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      )}
      {label}
    </button>
  );
};

export default BackButton;