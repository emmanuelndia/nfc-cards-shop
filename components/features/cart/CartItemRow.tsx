import React from "react";
import { formatEUR } from "@/lib/format";

type CartItemRowProps = {
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  onChangeQuantity: (nextQuantity: number) => void;
  onRemove: () => void;
};

export default function CartItemRow({
  name,
  unitPrice,
  quantity,
  lineTotal,
  onChangeQuantity,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-semibold text-zinc-900">{name}</div>
        <div className="text-sm text-zinc-600">{formatEUR(unitPrice)} / unité</div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => onChangeQuantity(Number(e.target.value || 1))}
          className="w-20 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900"
        />
        <div className="min-w-[110px] text-right text-sm font-semibold text-zinc-900">
          {formatEUR(lineTotal)}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
