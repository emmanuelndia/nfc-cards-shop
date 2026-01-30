import React from "react";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export default function AdminPageHeader({
  eyebrow = "Administration",
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{eyebrow}</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
