'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';

type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  stripeSessionId?: string | null;
  amount: number;
  currency: string;
  status: string;
  customerName: string;
  customerEmail: string;
  address?: string | null;
  cardType: string;
  nfcLink: string;
  nfcNameOnCard?: string | null;
  logoUrl?: string | null;
};

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<string>('');

  const statusOptions = useMemo(() => ['PENDING', 'PAID', 'SHIPPED'], []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/orders/${id}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Erreur de chargement');
        if (cancelled) return;
        setOrder(json.order);
        setNextStatus(String(json.order?.status || '').toUpperCase());
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || 'Erreur inconnue');
        setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        icon: 'success',
        title: 'Copié',
        text: 'Copié dans le presse-papiers',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top',
        customClass: { container: 'z-[999999]' },
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de copier.',
        confirmButtonColor: '#465fff',
      });
    }
  };

  const saveStatus = async () => {
    if (!order) return;
    const status = nextStatus.trim().toUpperCase();
    if (!status) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Impossible de mettre à jour');

      setOrder(json.order);

      Swal.fire({
        icon: 'success',
        title: 'Statut mis à jour',
        text: `Nouveau statut: ${status}`,
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top',
        customClass: { container: 'z-[999999]' },
      });
    } catch (e: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: e?.message || 'Erreur inconnue',
        confirmButtonColor: '#465fff',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Administration</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">Commande</h1>
          <p className="mt-1 text-sm text-zinc-600">Détails et actions sur la commande.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Retour à la liste
          </Link>
        </div>
      </div>

      {loading ? <div className="text-sm text-zinc-600">Chargement...</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      {order ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">ID</div>
                  <div className="mt-1 font-mono text-sm text-zinc-900 break-all">{order.id}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copy(order.id)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Copier
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Client</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">{order.customerName}</div>
                  <div className="text-sm text-zinc-600">{order.customerEmail}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Créée</div>
                  <div className="mt-1 text-sm text-zinc-900">{new Date(order.createdAt).toLocaleString('fr-FR')}</div>
                  <div className="text-xs text-zinc-500">MAJ: {new Date(order.updatedAt).toLocaleString('fr-FR')}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Montant</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">{order.amount.toFixed(2)}€</div>
                  <div className="text-xs text-zinc-500">{order.currency.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Statut</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">{order.status}</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Lien NFC</div>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <code className="inline-flex w-full truncate rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
                    {order.nfcLink}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(order.nfcLink)}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                  >
                    Copier
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Type de carte</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">{order.cardType}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Nom sur la carte</div>
                  <div className="mt-1 text-sm text-zinc-900">{order.nfcNameOnCard || '-'}</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Adresse</div>
                <div className="mt-1 text-sm text-zinc-900 whitespace-pre-wrap">{order.address || '-'}</div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Stripe session</div>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <code className="inline-flex w-full truncate rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
                    {order.stripeSessionId || '-'}
                  </code>
                  {order.stripeSessionId ? (
                    <button
                      type="button"
                      onClick={() => copy(order.stripeSessionId || '')}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                    >
                      Copier
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">Actions</div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-zinc-700">Changer le statut</label>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveStatus}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {saving ? 'Enregistrement...' : 'Mettre à jour'}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">Raccourcis</div>
              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={() => copy(order.customerEmail)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Copier email
                </button>
                <button
                  type="button"
                  onClick={() => copy(order.customerName)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Copier nom
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
