import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export type OrdersFiltersValue = {
  q: string;
  cardType: string;
  period: string;
  start: string;
  end: string;
};

type OrdersFiltersCardProps = {
  value: OrdersFiltersValue;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onReset: () => void;
  onChange: (patch: Partial<OrdersFiltersValue>) => void;
};

export default function OrdersFiltersCard({
  value,
  searchInput,
  onSearchInputChange,
  onReset,
  onChange,
}: OrdersFiltersCardProps) {
  return (
    <div className="w-full rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
          Recherche & filtres
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Réinitialiser
        </button>
      </div>

      <div className="grid gap-4 px-5 py-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <label className="block text-xs font-medium text-zinc-600">Recherche</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm ring-0 focus-within:ring-2 focus-within:ring-accent-500">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="ID, client, email, lien, type..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <label className="block text-xs font-medium text-zinc-600">Période</label>
          <select
            value={value.period}
            onChange={(e) => onChange({ period: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
          >
            <option value="">Toutes</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="custom">Personnalisée</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-zinc-600">Type de carte</label>
          <select
            value={value.cardType}
            onChange={(e) => onChange({ cardType: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
          >
            <option value="">Tous</option>
            <option value="PVC">PVC</option>
            <option value="PVC_PRO">PVC Pro</option>
            <option value="METAL">Metal</option>
            <option value="METAL_PREMIUM">Metal Premium</option>
            <option value="BAMBOO">Bambou</option>
            <option value="BAMBOO_ECO">Bambou Eco</option>
          </select>
        </div>

        {value.period === "custom" ? (
          <div className="lg:col-span-4">
            <label className="block text-xs font-medium text-zinc-600">Dates (start/end)</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="date"
                value={value.start}
                onChange={(e) => onChange({ start: e.target.value })}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
              />
              <input
                type="date"
                value={value.end}
                onChange={(e) => onChange({ end: e.target.value })}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
