import React from "react";
import type { UserRow } from "./types";
import { roleLabel } from "./types";
import RoleBadge from "./RoleBadge";

type UsersTableProps = {
  users: UserRow[];
  onEdit: (user: UserRow) => void;
  onDelete: (userId: string) => void;
};

export default function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="bg-zinc-50">
          <tr className="border-b border-zinc-200">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Nom</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Login</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Rôle</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Créé le</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-zinc-50/60">
              <td className="px-6 py-4 text-sm font-semibold text-zinc-900">{u.name || "—"}</td>
              <td className="px-6 py-4 text-sm text-zinc-600">{u.login || "—"}</td>
              <td className="px-6 py-4 text-sm text-zinc-600">{u.email || "—"}</td>
              <td className="px-6 py-4">
                <RoleBadge role={roleLabel(u.role)} />
              </td>
              <td className="px-6 py-4 text-sm text-zinc-600">{new Date(u.createdAt).toLocaleString("fr-FR")}</td>
              <td className="px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(u)}
                  className="mr-2 inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(u.id)}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
