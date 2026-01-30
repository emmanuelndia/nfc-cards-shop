"use client";

import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { productCatalog } from "@/components/features/cart/productCatalog";
import CartEmpty from "@/components/features/cart/CartEmpty";
import CartItemRow from "@/components/features/cart/CartItemRow";
import CartSummary from "@/components/features/cart/CartSummary";
import ButtonLink from "@/components/ui/button/ButtonLink";
import Container from "@/components/ui/layout/Container";
import { Card, CardHeader } from "@/components/ui/surface/Card";

export default function CartPage() {
  const { items, setQuantity, removeItem, clear } = useCart();

  const rows = useMemo(() => {
    return items
      .map((i) => {
        const p = productCatalog[i.productId];
        if (!p) return null;
        return {
          ...i,
          name: p.name,
          unitPrice: p.unitPrice,
          lineTotal: p.unitPrice * i.quantity,
        };
      })
      .filter(Boolean) as Array<{
      productId: string;
      quantity: number;
      name: string;
      unitPrice: number;
      lineTotal: number;
    }>;
  }, [items]);

  const total = useMemo(() => rows.reduce((sum, r) => sum + r.lineTotal, 0), [rows]);

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Container className="max-w-5xl py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Panier</h1>
            <p className="mt-1 text-sm text-zinc-600">Gère les quantités avant de passer commande.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/products" variant="outline">
              Continuer les achats
            </ButtonLink>
            {rows.length > 0 ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Vider le panier
              </button>
            ) : null}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-8">
            <CartEmpty />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="text-sm font-semibold text-zinc-900">Articles</div>
                  <div className="text-sm text-zinc-500">Quantité modifiable (1 à 99)</div>
                </CardHeader>

                <div className="divide-y divide-zinc-100">
                  {rows.map((r) => (
                    <CartItemRow
                      key={r.productId}
                      name={r.name}
                      unitPrice={r.unitPrice}
                      quantity={r.quantity}
                      lineTotal={r.lineTotal}
                      onChangeQuantity={(q) => setQuantity(r.productId, q)}
                      onRemove={() => removeItem(r.productId)}
                    />
                  ))}
                </div>
              </Card>
            </div>

            <CartSummary total={total} />
          </div>
        )}
      </Container>
    </div>
  );
}
