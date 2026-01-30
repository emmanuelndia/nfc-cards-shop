// app/admin/page.tsx
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from 'next/link';

// Type pour les orders retournés par Prisma
type DashboardOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: string;
  cardType: string;
  nfcNameOnCard: string | null;
  createdAt: Date;
};

// Cette fonction va forcer l'écriture dans Supabase
async function createFakeOrder() {
  "use server"
  try {
    await prisma.order.create({
      data: {
        customerName: "Test Emmanuel ",
        customerEmail: "emmanuel@test.com",
        amount: 29.90,
        quantity: 1,
        nfcLink: "https://google.com",
        status: "PAID",
        stripeSessionId: "fake_id_" + Math.random(),
        cardType: "PVC_PRO"
      }
    });
    console.log(" Commande créée avec succès !");
    revalidatePath("/admin");
  } catch (error) {
    console.error(" Erreur d'insertion :", error);
  }
}

export default async function AdminDashboard() {
  const [orders, totalCount, pendingCount, paidCount, shippedCount, paidSum] =
    await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PAID' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
    ]);

  const revenue = paidSum._sum.amount ?? 0;

  const statusBadge = (status: string) => {
    const s = String(status || '').toUpperCase();
    if (s === 'PAID') return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    if (s === 'PENDING') return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
    if (s === 'SHIPPED') return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200';
    return 'bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Administration
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Suivi des ventes, commandes et expéditions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Voir toutes les commandes
          </Link>
          <form action={createFakeOrder}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Simuler une commande
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-zinc-500">Commandes (total)</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{totalCount}</div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-zinc-500">En attente</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{pendingCount}</div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-zinc-500">Payées</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{paidCount}</div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-zinc-500">Expédiées</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{shippedCount}</div>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-zinc-500">CA (payé)</div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900">{revenue.toFixed(2)}€</div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-zinc-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Dernières commandes</div>
            <div className="text-sm text-zinc-500">Toutes (PENDING inclus)</div>
          </div>
          <div className="text-xs text-zinc-500">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Client</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Carte</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Montant</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((order: DashboardOrder) => (
                <tr key={order.id} className="hover:bg-zinc-50/60">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-zinc-900">{order.customerName}</div>
                    <div className="text-sm text-zinc-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-zinc-900">{order.cardType}</div>
                    {order.nfcNameOnCard ? (
                      <div className="text-sm text-zinc-500">{order.nfcNameOnCard}</div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-zinc-900">{order.amount.toFixed(2)}€</div>
                    <div className="text-xs text-zinc-500">{order.currency.toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">
                    {new Date(order.createdAt).toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-600">Aucune commande.</div>
        ) : null}
      </div>
    </div>
  );
}