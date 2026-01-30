import Image from "next/image";
import Link from "next/link";
import React from "react";
import { formatEUR } from "@/lib/format";
import type { Product } from "./catalog";
import QuantitySelector from "./QuantitySelector";

type ProductCardProps = {
  product: Product;
  quantity: number;
  onChangeQuantity: (next: number) => void;
  onAddToCart: () => void;
  checkoutHref: string;
};

export default function ProductCard({
  product,
  quantity,
  onChangeQuantity,
  onAddToCart,
  checkoutHref,
}: ProductCardProps) {
  const ctaStyle =
    product.variant === "primary"
      ? "bg-accent-600 text-white hover:bg-accent-700"
      : "border border-accent-200 bg-white text-zinc-900 hover:bg-accent-25";

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>

      <div className="mt-4 text-sm font-semibold text-zinc-900">{product.name}</div>
      <div className="mt-1 text-2xl font-semibold text-zinc-900">{formatEUR(product.unitPrice)}</div>
      <div className="mt-2 text-sm text-zinc-600">{product.description}</div>

      <div className="mt-5 flex items-center gap-3">
        <QuantitySelector value={quantity} onChange={onChangeQuantity} />

        <button
          type="button"
          onClick={onAddToCart}
          className={`inline-flex flex-1 items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${ctaStyle}`}
        >
          Ajouter au panier
        </button>
      </div>

      <Link
        href={checkoutHref}
        className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
      >
        Acheter maintenant
      </Link>
    </div>
  );
}
