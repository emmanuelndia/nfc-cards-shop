'use client';

import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import AdminPageHeader from '@/components/shared/admin/AdminPageHeader';
import SettingsForm from '@/components/features/admin/settings/SettingsForm';

type FormState = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (form.email && !isValidEmail(form.email)) e.email = 'Email invalide.';

    if (!form.currentPassword.trim()) e.currentPassword = 'Mot de passe actuel requis.';

    if (form.newPassword) {
      if (form.newPassword.length < 8) e.newPassword = 'Min. 8 caractères.';
      if (form.confirmPassword && form.confirmPassword !== form.newPassword) {
        e.confirmPassword = 'Les mots de passe ne correspondent pas.';
      }
    }

    if (form.confirmPassword && form.confirmPassword !== form.newPassword) {
      e.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0;

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email || undefined,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Impossible de sauvegarder.');
      }

      Swal.fire({
        icon: 'success',
        title: 'Paramètres mis à jour',
        text: 'Vos informations ont été mises à jour.',
        confirmButtonColor: '#465fff',
      });

      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err?.message || 'Erreur inconnue',
        confirmButtonColor: '#465fff',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Paramètres"
        description="Modifiez l'email et/ou le mot de passe de votre compte admin."
      />

      <SettingsForm
        form={form}
        errors={errors}
        loading={loading}
        canSubmit={canSubmit}
        onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
