import prisma from '@/lib/db';
import AdminPageHeader from '@/components/shared/admin/AdminPageHeader';
import KpiCard from '@/components/features/admin/statistics/KpiCard';
import TrendChart30Days from '@/components/features/admin/statistics/TrendChart30Days';
import { formatEUR } from '@/lib/format';

const formatInt = (value: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value);

const clampPct = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  if (value < -999) return -999;
  if (value > 999) return 999;
  return value;
};

export default async function AdminStatisticsPage() {
  const now = Date.now();
  const start30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const start60 = new Date(now - 60 * 24 * 60 * 60 * 1000);

  const [
    totalCount,
    pendingCount,
    paidCount,
    shippedCount,
    paidTotalAgg,
    last60DaysOrders,
    paid30Agg,
    paidPrev30Agg,
    customersDistinct,
    customers30Distinct,
    itemsPaid30,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.count({ where: { status: 'SHIPPED' } }),
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: start60,
        },
      },
      select: { createdAt: true, amount: true, status: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.order.aggregate({
      where: { status: 'PAID', createdAt: { gte: start30 } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { status: 'PAID', createdAt: { gte: start60, lt: start30 } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.order.findMany({
      distinct: ['customerEmail'],
      select: { customerEmail: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: start30 } },
      distinct: ['customerEmail'],
      select: { customerEmail: true },
    }),
    prisma.orderItem.findMany({
      where: {
        order: { status: 'PAID', createdAt: { gte: start30 } },
      },
      select: { cardType: true, quantity: true, unitAmount: true },
    }),
  ]);

  const revenueTotalPaid = paidTotalAgg._sum.amount ?? 0;
  const revenue30 = paid30Agg._sum.amount ?? 0;
  const revenuePrev30 = paidPrev30Agg._sum.amount ?? 0;
  const paidOrders30 = paid30Agg._count._all ?? 0;
  const paidOrdersPrev30 = paidPrev30Agg._count._all ?? 0;

  const revenueDeltaPct = revenuePrev30 > 0 ? ((revenue30 - revenuePrev30) / revenuePrev30) * 100 : revenue30 > 0 ? 100 : 0;
  const paidOrdersDeltaPct = paidOrdersPrev30 > 0 ? ((paidOrders30 - paidOrdersPrev30) / paidOrdersPrev30) * 100 : paidOrders30 > 0 ? 100 : 0;

  const customersTotal = customersDistinct.length;
  const customers30 = customers30Distinct.length;

  const aov30 = paidOrders30 > 0 ? revenue30 / paidOrders30 : 0;
  const fulfillmentRate = paidCount > 0 ? (shippedCount / paidCount) * 100 : 0;

  const itemsByType = new Map<string, { qty: number; revenue: number }>();
  for (const it of itemsPaid30) {
    const key = String(it.cardType || 'UNKNOWN');
    const prev = itemsByType.get(key) ?? { qty: 0, revenue: 0 };
    itemsByType.set(key, {
      qty: prev.qty + (it.quantity ?? 0),
      revenue: prev.revenue + (it.unitAmount ?? 0) * (it.quantity ?? 0),
    });
  }
  const topProducts = Array.from(itemsByType.entries())
    .map(([cardType, v]) => ({ cardType, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const totalItemsQty30 = topProducts.reduce((sum, x) => sum + x.qty, 0);

  const byDay30 = new Map<string, { orders: number; revenue: number }>();
  for (const o of last60DaysOrders) {
    if (o.createdAt < start30) continue;
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    const prev = byDay30.get(key) ?? { orders: 0, revenue: 0 };
    byDay30.set(key, {
      orders: prev.orders + 1,
      revenue: prev.revenue + (String(o.status).toUpperCase() === 'PAID' ? o.amount : 0),
    });
  }

  const series30 = Array.from(byDay30.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const maxOrders30 = Math.max(1, ...series30.map(([, v]) => v.orders));
  const maxRevenue30 = Math.max(1, ...series30.map(([, v]) => v.revenue));

  const statDelta = (pct: number) => {
    const v = clampPct(pct);
    const up = v >= 0;
    return {
      label: `${up ? '+' : ''}${v.toFixed(0)}%` ,
      className: up
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
        : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    };
  };

  const deltaRevenue = statDelta(revenueDeltaPct);
  const deltaPaidOrders = statDelta(paidOrdersDeltaPct);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Statistiques"
        description="Vue d'ensemble business (commandes, clients, produits, chiffre d'affaires)."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="CA payé (30 jours)"
          value={formatEUR(revenue30)}
          deltaLabel={deltaRevenue.label}
          deltaClassName={deltaRevenue.className}
          footer="Vs 30 jours précédents"
        />

        <KpiCard
          label="Commandes payées (30 jours)"
          value={formatInt(paidOrders30)}
          deltaLabel={deltaPaidOrders.label}
          deltaClassName={deltaPaidOrders.className}
          footer="Vs 30 jours précédents"
        />

        <KpiCard
          label="Panier moyen (30 jours)"
          value={formatEUR(aov30)}
          footer="CA / commandes payées"
        />

        <KpiCard
          label="Clients"
          value={formatInt(customersTotal)}
          footer={`Nouveaux sur 30 jours: ${formatInt(customers30)}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TrendChart30Days
            title="Tendance 30 jours"
            subtitle="Barres: commandes / Ligne: CA payé"
            updatedAtLabel={`Mise à jour: ${new Date().toLocaleString('fr-FR')}`}
            points={series30.map(([day, v]) => ({ day, orders: v.orders, revenue: v.revenue }))}
            maxOrders={maxOrders30}
            maxRevenue={maxRevenue30}
            footerLeft={`${formatInt(totalCount)} commandes (total) • ${formatInt(pendingCount)} en attente • ${formatInt(paidCount)} payées • ${formatInt(shippedCount)} expédiées`}
            footerRight={`CA payé (total): ${formatEUR(revenueTotalPaid)}`}
            formatTooltip={(day, orders, revenue) => `${day} : ${orders} commandes, ${formatEUR(revenue)} payé`}
          />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Opérations</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-medium text-zinc-500">Taux d’expédition</div>
                <div className="mt-2 text-lg font-semibold text-zinc-900">{clampPct(fulfillmentRate).toFixed(0)}%</div>
                <div className="mt-2 text-xs text-zinc-500">expédiées / payées</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-medium text-zinc-500">Commandes en attente</div>
                <div className="mt-2 text-lg font-semibold text-zinc-900">{formatInt(pendingCount)}</div>
                <div className="mt-2 text-xs text-zinc-500">à traiter</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Top produits (30 jours)</div>
                <div className="mt-1 text-sm text-zinc-500">Basé sur les commandes payées</div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {topProducts.length === 0 ? (
                <div className="text-sm text-zinc-600">Aucune donnée.</div>
              ) : (
                topProducts.map((p) => {
                  const pct = totalItemsQty30 > 0 ? (p.qty / totalItemsQty30) * 100 : 0;
                  return (
                    <div key={p.cardType} className="rounded-2xl border border-zinc-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-zinc-900">{p.cardType}</div>
                        <div className="text-sm font-semibold text-zinc-900">{formatEUR(p.revenue)}</div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
                        <span>{formatInt(p.qty)} unités</span>
                        <span>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div className="h-full rounded-full bg-accent-600/60" style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
