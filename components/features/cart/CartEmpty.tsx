import React from "react";
import EmptyState from "@/components/ui/feedback/EmptyState";
import ButtonLink from "@/components/ui/button/ButtonLink";

export default function CartEmpty() {
  return (
    <EmptyState
      title="Ton panier est vide."
      description="Ajoute un produit depuis la page produits."
      action={
        <ButtonLink href="/products" variant="primary">
          Voir les produits
        </ButtonLink>
      }
    />
  );
}
