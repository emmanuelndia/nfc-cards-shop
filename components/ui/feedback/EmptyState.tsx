import React from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm ${className}`.trim()}>
      <div className="text-sm font-semibold text-zinc-900">{title}</div>
      {description ? <div className="mt-2 text-sm text-zinc-600">{description}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
