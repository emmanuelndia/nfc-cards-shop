export type Product = {
  id: string;
  name: string;
  unitPrice: number;
  description: string;
  image: string;
  variant?: "primary" | "outline";
};

export const productsCatalog: Product[] = [
  {
    id: "1",
    name: "Carte PVC Pro",
    unitPrice: 29.9,
    description: "Le meilleur rapport qualité/prix pour un usage pro.",
    image: "/cards/nfc-pvc.jpg",
    variant: "primary",
  },
  {
    id: "2",
    name: "Carte Métal Premium",
    unitPrice: 79.9,
    description: "Finition premium, effet wow garanti.",
    image: "/cards/nfc-premium.jpg",
    variant: "outline",
  },
  {
    id: "3",
    name: "Carte Bambou Éco",
    unitPrice: 49.9,
    description: "Un rendu naturel, durable et élégant.",
    image: "/cards/nfc-bois.jpg",
    variant: "outline",
  },
];

export const getProductById = (id: string) => productsCatalog.find((p) => p.id === id) ?? null;
