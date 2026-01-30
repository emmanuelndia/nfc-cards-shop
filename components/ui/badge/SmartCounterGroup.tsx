import { ReactNode } from "react";
import CounterBadge from "./CounterBadge";

interface CounterItem {
  /** Étiquette du compteur */
  label: string;
  /** Valeur du compteur */
  count: number;
  /** Variante de couleur */
  variant?: "default" | "success" | "warning" | "error" | "info" | "gray";
  /** Icône personnalisée */
  icon?: ReactNode;
}

interface SmartCounterGroupProps {
  /** Tableau des compteurs à afficher */
  counters: CounterItem[];
  /** Taille des compteurs */
  size?: "sm" | "md" | "lg";
  /** Disposition des compteurs */
  layout?: "horizontal" | "vertical";
  /** Espacement entre les compteurs */
  spacing?: number;
  /** Classe CSS supplémentaire */
  className?: string;
}

const SmartCounterGroup: React.FC<SmartCounterGroupProps> = ({
  counters,
  size = "md",
  layout = "horizontal",
  spacing = 3,
  className = "",
}) => {
  const layoutClasses = layout === "horizontal" 
    ? "flex flex-wrap items-center gap-3" 
    : "flex flex-col items-start gap-2";

  return (
    <div className={`${layoutClasses} ${className}`}>
      {counters.map((counter, index) => (
        <CounterBadge
          key={index}
          label={counter.label}
          count={counter.count}
          variant={counter.variant}
          icon={counter.icon}
          size={size}
          className={spacing ? `gap-${spacing}` : ""}
        />
      ))}
    </div>
  );
};

export default SmartCounterGroup;