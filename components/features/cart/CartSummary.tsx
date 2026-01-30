import React from "react";
import { formatEUR } from "@/lib/format";
import ButtonLink from "@/components/ui/button/ButtonLink";

type CartSummaryProps = {
  total: number;
};

export default function CartSummary({ total }: CartSummaryProps) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm h-fit">
      <div className="text-sm font-semibold text-zinc-900">Récapitulatif</div>
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
        <span>Total</span>
        <span className="font-semibold text-zinc-900">{formatEUR(total)}</span>
      </div>

      <div className="mt-6">
        <ButtonLink href="/checkout" variant="primary" className="w-full">
          Passer au paiement
        </ButtonLink>
      </div>
    </div>
  );
}
