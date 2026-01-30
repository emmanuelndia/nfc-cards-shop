"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import OrdersFiltersCard from '@/components/features/admin/orders/OrdersFiltersCard';
import OrdersExportButtons from '@/components/features/admin/orders/OrdersExportButtons';
import OrdersTable from '@/components/features/admin/orders/OrdersTable';
import OrdersPagination from '@/components/features/admin/orders/OrdersPagination';
import { getSortDir, getSortKey, type OrdersResponse, type SortDir, type SortKey, type OrderDTO } from '@/components/features/admin/orders/types';
import AdminPageHeader from '@/components/shared/admin/AdminPageHeader';
import AdminCard from '@/components/shared/admin/AdminCard';
import AdminSection from '@/components/shared/admin/AdminSection';

export default function AdminOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const q = (searchParams.get('q') || '').trim();
  const status = 'PAID';
  const cardType = (searchParams.get('cardType') || '').trim().toUpperCase();
  const period = (searchParams.get('period') || '').trim().toLowerCase();
  const start = (searchParams.get('start') || '').trim();
  const end = (searchParams.get('end') || '').trim();
  const sort = getSortKey(searchParams.get('sort'));
  const dir = getSortDir(searchParams.get('dir'));
  const page = Math.max(1, Number(searchParams.get('page') || '1') || 1);
  const pageSize = Math.min(100, Math.max(5, Number(searchParams.get('pageSize') || '20') || 20));

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setSearchInput(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    }
    router.replace(`${pathname}?${next.toString()}`);
  };

  const toggleSort = (key: SortKey) => {
    const nextDir: SortDir = sort === key ? (dir === 'asc' ? 'desc' : 'asc') : 'desc';
    setParams({ sort: key, dir: nextDir, page: '1' });
  };

  const pagination = useMemo(() => {
    const totalPages = data?.totalPages ?? 1;
    const current = data?.page ?? page;
    const windowSize = 5;
    const start = Math.max(1, current - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    const realStart = Math.max(1, end - windowSize + 1);
    const pages = [];
    for (let p = realStart; p <= end; p++) pages.push(p);
    return { totalPages, current, pages };
  }, [data?.page, data?.totalPages, page]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiParams = new URLSearchParams();
        if (q) apiParams.set('q', q);
        apiParams.set('status', status);
        if (cardType) apiParams.set('cardType', cardType);
        if (period) apiParams.set('period', period);
        if (period === 'custom') {
          if (start) apiParams.set('start', start);
          if (end) apiParams.set('end', end);
        }
        apiParams.set('sort', sort);
        apiParams.set('dir', dir);
        apiParams.set('page', String(page));
        apiParams.set('pageSize', String(pageSize));

        const res = await fetch(`/api/admin/orders?${apiParams.toString()}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Erreur de chargement');
        if (cancelled) return;
        setData(json as OrdersResponse);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || 'Erreur inconnue');
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };  
  }, [q, status, cardType, period, start, end, sort, dir, page, pageSize]);

  const items = data?.items ?? [];

  const exportUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    p.set('status', status);
    if (cardType) p.set('cardType', cardType);
    if (period) p.set('period', period);
    if (period === 'custom') {
      if (start) p.set('start', start);
      if (end) p.set('end', end);
    }
    p.set('sort', sort);
    p.set('dir', dir);
    return `/api/admin/orders/export?${p.toString()}`;
  }, [q, status, cardType, period, start, end, sort, dir]);

  const exportXlsxUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    p.set('status', status);
    if (cardType) p.set('cardType', cardType);
    if (period) p.set('period', period);
    if (period === 'custom') {
      if (start) p.set('start', start);
      if (end) p.set('end', end);
    }
    p.set('sort', sort);
    p.set('dir', dir);
    return `/api/admin/orders/export-xlsx?${p.toString()}`;
  }, [q, status, cardType, period, start, end, sort, dir]);

  return (
    <AdminSection>
      <AdminPageHeader
        title="Commandes"
        description="Commandes payées. Recherche, filtres et tri."
      />

      <OrdersFiltersCard
        value={{ q, cardType, period, start, end }}
        searchInput={searchInput}
        onSearchInputChange={(value) => {
          setSearchInput(value);
          if (debounceRef.current) window.clearTimeout(debounceRef.current);
          debounceRef.current = window.setTimeout(() => {
            setParams({ q: value.trim() || null, page: '1' });
          }, 300);
        }}
        onReset={() => {
          setSearchInput('');
          setParams({
            q: null,
            cardType: null,
            period: null,
            start: null,
            end: null,
            sort: 'createdAt',
            dir: 'desc',
            page: '1',
          });
        }}
        onChange={(patch) => {
          if (patch.cardType !== undefined) setParams({ cardType: patch.cardType || null, page: '1' });
          if (patch.period !== undefined) {
            const v = patch.period;
            setParams({ period: v || null, page: '1', ...(v !== 'custom' ? { start: null, end: null } : {}) });
          }
          if (patch.start !== undefined) setParams({ start: patch.start || null, page: '1' });
          if (patch.end !== undefined) setParams({ end: patch.end || null, page: '1' });
        }}
      />

      <AdminCard>
        <div className="flex flex-col gap-3 border-b border-zinc-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-zinc-900">Résultats ({data?.total ?? 0})</div>
          <div className="flex flex-wrap gap-2">
            <OrdersExportButtons exportUrl={exportUrl} exportXlsxUrl={exportXlsxUrl} />
          </div>
        </div>

        {error ? <div className="px-6 py-6 text-sm text-red-600">{error}</div> : null}

        <OrdersTable
          items={items}
          sort={sort}
          dir={dir}
          onToggleSort={toggleSort}
        />

        <OrdersPagination
          current={pagination.current}
          totalPages={pagination.totalPages}
          pages={pagination.pages}
          loading={loading}
          pageSize={pageSize}
          onSetPage={(p) => setParams({ page: String(p) })}
          onSetPageSize={(ps) => setParams({ pageSize: String(ps), page: '1' })}
        />

        {!loading && !error && items.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-600">Aucune commande.</div>
        ) : null}
      </AdminCard>
    </AdminSection>
  );
}
