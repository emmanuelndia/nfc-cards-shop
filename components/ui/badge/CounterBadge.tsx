import { ReactNode } from "react";

interface CounterBadgeProps {
  /** Étiquette du compteur */
  label: string;
  /** Valeur du compteur */
  count: number;
  /** Variante de couleur */
  variant?: "default" | "success" | "warning" | "error" | "info" | "gray";
  /** Icône à afficher */
  icon?: ReactNode;
  /** Position de l'icône */
  iconPosition?: "left" | "right";
  /** Classe CSS supplémentaire */
  className?: string;
  /** Afficher le compteur en format compact (ex: 1K) */
  compact?: boolean;
  /** Taille du badge */
  size?: "sm" | "md" | "lg";
  /** Afficher un indicateur d'animation */
  animated?: boolean;
}

const CounterBadge: React.FC<CounterBadgeProps> = ({
  label,
  count,
  variant = "default",
  icon,
  iconPosition = "left",
  className = "",
  compact = false,
  size = "md",
  animated = false,
}) => {
  // Classes de base
  const baseClasses = "flex items-center gap-2 px-3 py-2 border rounded-xl";
  
  // Classes de taille
  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-2 gap-2",
    lg: "text-base px-4 py-3 gap-3",
  };
  
  // Classes de variante
  const variantClasses = {
    default: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
    gray: "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100",
  };
  
  // Classes du compteur (nombre)
  const countClasses = {
    default: "bg-blue-600 text-white",
    success: "bg-green-600 text-white",
    warning: "bg-amber-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
    gray: "bg-gray-600 text-white",
  };

  // Formater le nombre pour l'affichage compact
  const formatCount = (num: number): string => {
    if (compact) {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Icône par défaut selon la variante
  const getDefaultIcon = () => {
    const iconClasses = "w-4 h-4";
    
    switch (variant) {
      case "success":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "warning":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "error":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const displayIcon = icon || getDefaultIcon();

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        animated ? "animate-pulse" : ""
      }`}
    >
      {iconPosition === "left" && displayIcon && (
        <div className="flex-shrink-0">{displayIcon}</div>
      )}
      
      <span className="font-medium whitespace-nowrap">{label}</span>
      
      <span className={`ml-1 px-2 py-1 rounded-full text-sm font-bold ${countClasses[variant]} ${
        animated ? "animate-bounce" : ""
      }`}>
        {formatCount(count)}
      </span>
      
      {iconPosition === "right" && displayIcon && (
        <div className="flex-shrink-0">{displayIcon}</div>
      )}
    </div>
  );
};

export default CounterBadge;