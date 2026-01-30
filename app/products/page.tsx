"use client";

import { useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Container from '@/components/ui/layout/Container';
import ButtonLink from '@/components/ui/button/ButtonLink';
import { productsCatalog } from '@/components/features/products/catalog';
import ProductCard from '@/components/features/products/ProductCard';

export default function ProductsPage() {
  const { addItem, totalItems } = useCart();
  const [qtyById, setQtyById] = useState<Record<string, number>>({});

  const getQty = (id: string) => {
    const v = qtyById[id];
    if (!Number.isFinite(v)) return 1;
    if (v < 1) return 1;
    if (v > 99) return 99;
    return Math.floor(v);
  };

  const cartLabel = useMemo(() => {
    if (totalItems <= 0) return 'Panier';
    return `Panier (${totalItems})`;
  }, [totalItems]);

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Container className="max-w-6xl py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Produits</h1>
            <p className="mt-1 text-sm text-zinc-600">Choisis ton modèle de carte NFC et passe commande.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/cart" variant="outline">
              {cartLabel}
            </ButtonLink>
            <ButtonLink href="/" variant="outline">
              Retour à l’accueil
            </ButtonLink>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {productsCatalog.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              quantity={getQty(p.id)}
              onChangeQuantity={(raw) => setQtyById((prev) => ({ ...prev, [p.id]: raw }))}
              onAddToCart={() => addItem(p.id, getQty(p.id))}
              checkoutHref={`/checkout?product=${p.id}&qty=${encodeURIComponent(String(getQty(p.id)))}`}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
