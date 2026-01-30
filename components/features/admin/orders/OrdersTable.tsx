import Link from "next/link";
import React from "react";
import type { OrderDTO, SortDir, SortKey } from "./types";
import { statusBadge } from "./status";

type OrdersTableProps = {
  items: OrderDTO[];
  sort: SortKey;
  dir: SortDir;
  onToggleSort: (key: SortKey) => void;
};

export default function OrdersTable({
  items,
  sort,
  dir,
  onToggleSort,
}: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="bg-zinc-50">
          <tr className="border-b border-zinc-200">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Client</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Carte</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Lien</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <button
                type="button"
                onClick={() => onToggleSort("amount")}
                className="inline-flex items-center gap-1 hover:text-zinc-900"
              >
                Montant
                {sort === "amount" ? (dir === "asc" ? "↑" : "↓") : ""}
              </button>
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <button
                type="button"
                onClick={() => onToggleSort("status")}
                className="inline-flex items-center gap-1 hover:text-zinc-900"
              >
                Statut
                {sort === "status" ? (dir === "asc" ? "↑" : "↓") : ""}
              </button>
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <button
                type="button"
                onClick={() => onToggleSort("createdAt")}
                className="inline-flex items-center gap-1 hover:text-zinc-900"
              >
                Date
                {sort === "createdAt" ? (dir === "asc" ? "↑" : "↓") : ""}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {items.map((order) => (
            <tr key={order.id} className="hover:bg-zinc-50/60">
              <td className="px-6 py-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-sm font-semibold text-zinc-900 hover:underline"
                >
                  {order.customerName}
                </Link>
                <div className="text-sm text-zinc-500">{order.customerEmail}</div>
                <div className="mt-1 text-xs text-zinc-400">{order.id}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-zinc-900">{order.cardType}</div>
                {order.nfcNameOnCard ? (
                  <div className="text-sm text-zinc-500">{order.nfcNameOnCard}</div>
                ) : null}
              </td>
              <td className="px-6 py-4">
                <code className="inline-flex max-w-[460px] truncate rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
                  {order.nfcLink}
                </code>
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
              <td className="px-6 py-4 text-sm text-zinc-600">{new Date(order.createdAt).toLocaleString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
