import { productsCatalog } from "@/components/features/products/catalog";

export const productCatalog: Record<
  string,
  {
    name: string;
    unitPrice: number;
  }
> = Object.fromEntries(
  productsCatalog.map((p) => [p.id, { name: p.name, unitPrice: p.unitPrice }]),
);
