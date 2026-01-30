import React from "react";

type QuantitySelectorProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}: QuantitySelectorProps) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value || min))}
      className={`w-20 rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 ${className}`.trim()}
    />
  );
}
