import React from "react";
import Container from "@/components/ui/layout/Container";

type SiteHeaderProps = {
  rightSlot?: React.ReactNode;
};

export default function SiteHeader({ rightSlot }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-sm" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">NFC.PRO</div>
            <div className="text-xs text-zinc-500">Cartes NFC professionnelles</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          <a className="hover:text-zinc-900" href="/products">Produits</a>
          <a className="hover:text-zinc-900" href="#what">Qu’est-ce que c’est</a>
          <a className="hover:text-zinc-900" href="#benefits">Avantages</a>
          <a className="hover:text-zinc-900" href="#pricing">Packs</a>
          <a className="hover:text-zinc-900" href="#faq">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">{rightSlot}</div>
      </Container>
    </header>
  );
}
