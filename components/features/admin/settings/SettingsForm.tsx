import React from "react";
import AdminCard from "@/components/shared/admin/AdminCard";

type FormState = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type SettingsFormProps = {
  form: FormState;
  errors: Partial<Record<keyof FormState, string>>;
  loading: boolean;
  canSubmit: boolean;
  onChange: (patch: Partial<FormState>) => void;
  onSubmit: (ev: React.FormEvent) => void;
};

export default function SettingsForm({
  form,
  errors,
  loading,
  canSubmit,
  onChange,
  onSubmit,
}: SettingsFormProps) {
  return (
    <AdminCard>
      <form onSubmit={onSubmit} className="p-6">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Nouvel email (optionnel)</label>
            <input
              value={form.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="admin@exemple.com"
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
                errors.email ? "border-red-300 focus:ring-red-500" : "border-zinc-300 focus:ring-accent-500"
              }`}
            />
            {errors.email ? <div className="mt-1 text-xs text-red-600">{errors.email}</div> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Mot de passe actuel</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => onChange({ currentPassword: e.target.value })}
              placeholder="••••••••"
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
                errors.currentPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-zinc-300 focus:ring-accent-500"
              }`}
              required
            />
            {errors.currentPassword ? (
              <div className="mt-1 text-xs text-red-600">{errors.currentPassword}</div>
            ) : null}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Nouveau mot de passe (optionnel)</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => onChange({ newPassword: e.target.value })}
                placeholder="Min. 8 caractères"
                className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
                  errors.newPassword
                    ? "border-red-300 focus:ring-red-500"
                    : "border-zinc-300 focus:ring-accent-500"
                }`}
              />
              {errors.newPassword ? (
                <div className="mt-1 text-xs text-red-600">{errors.newPassword}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => onChange({ confirmPassword: e.target.value })}
                placeholder="Répéter le mot de passe"
                className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-red-500"
                    : "border-zinc-300 focus:ring-accent-500"
                }`}
              />
              {errors.confirmPassword ? (
                <div className="mt-1 text-xs text-red-600">{errors.confirmPassword}</div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </AdminCard>
  );
}
