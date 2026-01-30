import React from "react";

type SuperAdminGateProps = {
  isSuperAdmin: boolean | null;
  children: React.ReactNode;
};

export default function SuperAdminGate({ isSuperAdmin, children }: SuperAdminGateProps) {
  if (isSuperAdmin === null) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Administration</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">Utilisateurs</h1>
          <p className="mt-1 text-sm text-zinc-600">Chargement…</p>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-600">
          Vérification des droits…
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Administration</div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Utilisateurs</h1>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-600">
          Accès réservé au Super Admin.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
