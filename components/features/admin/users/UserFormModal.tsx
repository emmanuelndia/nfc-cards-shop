import React from "react";
import type { UserRole } from "./types";

type UserFormModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  name: string;
  setName: (v: string) => void;
  login: string;
  setLogin: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  role: UserRole;
  setRole: (v: UserRole) => void;
  password: string;
  setPassword: (v: string) => void;
  passwordPlaceholder: string;
  passwordHint?: string;
};

export default function UserFormModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  submitLabel,
  name,
  setName,
  login,
  setLogin,
  email,
  setEmail,
  role,
  setRole,
  password,
  setPassword,
  passwordPlaceholder,
  passwordHint,
}: UserFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="text-lg font-semibold text-zinc-900">{title}</div>
        <div className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
          />
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Login (identifiant)"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={passwordPlaceholder}
            type="password"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPERADMIN">SUPERADMIN</option>
          </select>
          {passwordHint ? <div className="text-xs text-zinc-500">{passwordHint}</div> : null}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
