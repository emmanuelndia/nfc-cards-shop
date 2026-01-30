"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** Valeur de recherche */
  value: string;
  /** Fonction de changement */
  onChange: (value: string) => void;
  /** Texte du placeholder */
  placeholder?: string;
  /** Classe CSS supplémentaire */
  className?: string;
  /** Désactiver la barre de recherche */
  disabled?: boolean;
  /** Afficher un indicateur de chargement */
  loading?: boolean;
  /** Fonction pour vider la recherche */
  onClear?: () => void;
  /** Taille du composant */
  size?: "sm" | "md" | "lg";
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      placeholder = "Rechercher...",
      className = "",
      disabled = false,
      loading = false,
      onClear,
      size = "md",
      ...props
    },
    ref
  ) => {
    const handleClear = () => {
      onChange("");
      onClear?.();
    };

    const sizeClasses = {
      sm: "pl-8 pr-8 py-1.5 text-sm",
      md: "pl-10 pr-10 py-2.5",
      lg: "pl-12 pr-12 py-3 text-lg",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const iconPositionClasses = {
      sm: "left-2",
      md: "left-3",
      lg: "left-4",
    };

    return (
      <div className={`relative max-w-md w-full ${className}`}>
        {/* Icône de recherche */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${iconPositionClasses[size]} text-gray-400`}>
          {loading ? (
            <svg 
              className={`${iconSizeClasses[size]} animate-spin`} 
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
          ) : (
            <svg 
              className={iconSizeClasses[size]} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          )}
        </div>

        {/* Champ de recherche */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={`w-full border border-gray-300 dark:border-gray-600 
                     rounded-lg bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-accent-500 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     ${sizeClasses[size]}`}
          {...props}
        />

        {/* Bouton pour effacer la recherche */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute top-1/2 -translate-y-1/2 right-3 
                       text-gray-400 hover:text-gray-600 
                       dark:text-gray-500 dark:hover:text-gray-300
                       transition-colors`}
            aria-label="Effacer la recherche"
          >
            <svg 
              className={iconSizeClasses[size]} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;