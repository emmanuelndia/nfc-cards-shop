import React from "react";

type OrdersPaginationProps = {
  current: number;
  totalPages: number;
  pages: number[];
  loading: boolean;
  pageSize: number;
  onSetPage: (page: number) => void;
  onSetPageSize: (pageSize: number) => void;
};

export default function OrdersPagination({
  current,
  totalPages,
  pages,
  loading,
  pageSize,
  onSetPage,
  onSetPageSize,
}: OrdersPaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-zinc-600">
        Page {current} / {totalPages}
        {loading ? " — Chargement…" : ""}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSetPage(Math.max(1, current - 1))}
          disabled={current <= 1 || loading}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50"
        >
          Précédent
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onSetPage(p)}
            disabled={loading}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
              p === current
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onSetPage(Math.min(totalPages, current + 1))}
          disabled={current >= totalPages || loading}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50"
        >
          Suivant
        </button>

        <select
          value={String(pageSize)}
          onChange={(e) => onSetPageSize(Number(e.target.value))}
          disabled={loading}
          className="ml-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
          <option value="100">100 / page</option>
        </select>
      </div>
    </div>
  );
}
