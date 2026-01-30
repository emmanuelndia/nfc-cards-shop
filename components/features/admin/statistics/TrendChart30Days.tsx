import React from "react";
import AdminCard from "@/components/shared/admin/AdminCard";

export type TrendPoint = {
  day: string;
  orders: number;
  revenue: number;
};

type TrendChart30DaysProps = {
  title: string;
  subtitle: string;
  updatedAtLabel: string;
  points: TrendPoint[];
  maxOrders: number;
  maxRevenue: number;
  footerLeft: string;
  footerRight: string;
  formatTooltip: (day: string, orders: number, revenue: number) => string;
};

export default function TrendChart30Days({
  title,
  subtitle,
  updatedAtLabel,
  points,
  maxOrders,
  maxRevenue,
  footerLeft,
  footerRight,
  formatTooltip,
}: TrendChart30DaysProps) {
  return (
    <AdminCard className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          <div className="mt-1 text-sm text-zinc-500">{subtitle}</div>
        </div>
        <div className="text-xs text-zinc-500">{updatedAtLabel}</div>
      </div>

      <div className="mt-6 grid grid-cols-30 items-end gap-1">
        {points.map((p) => {
          const hOrders = Math.max(6, Math.round((p.orders / maxOrders) * 120));
          const hRevenue = Math.max(2, Math.round((p.revenue / maxRevenue) * 90));
          return (
            <div key={p.day} className="relative flex flex-col items-center">
              <div
                className="w-full rounded-md bg-accent-600/15 ring-1 ring-accent-600/25"
                style={{ height: `${hOrders}px` }}
                title={formatTooltip(p.day, p.orders, p.revenue)}
              />
              <div
                className="absolute bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-emerald-500"
                style={{ height: `${hRevenue}px` }}
                title={formatTooltip(p.day, p.orders, p.revenue)}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </div>
    </AdminCard>
  );
}
