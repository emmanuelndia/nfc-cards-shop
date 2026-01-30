import React from "react";
import AdminCard from "@/components/shared/admin/AdminCard";

type KpiCardProps = {
  label: string;
  value: string;
  deltaLabel?: string;
  deltaClassName?: string;
  footer?: string;
};

export default function KpiCard({
  label,
  value,
  deltaLabel,
  deltaClassName,
  footer,
}: KpiCardProps) {
  return (
    <AdminCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-zinc-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{value}</div>
        </div>
        {deltaLabel && deltaClassName ? (
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${deltaClassName}`}>
            {deltaLabel}
          </span>
        ) : null}
      </div>
      {footer ? <div className="mt-2 text-xs text-zinc-500">{footer}</div> : null}
    </AdminCard>
  );
}
