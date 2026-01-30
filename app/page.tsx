import Image from 'next/image';
import { createCheckoutSession } from "./actions/stripe";
import AnimatedCardsHero from '@/components/landing/AnimatedCardsHero';
import SiteHeader from '@/components/shared/SiteHeader';
import Container from '@/components/ui/layout/Container';

async function landingCheckoutAction(formData: FormData) {
  'use server';
  await createCheckoutSession(formData);
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-25 via-white to-white text-zinc-900 font-sans">
      <SiteHeader
        rightSlot={
          <a
            href="/login"
            className="group relative inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200/80 bg-white/60 backdrop-blur transition hover:bg-white hover:ring-accent-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-accent-200/40 via-transparent to-accent-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            Connexion
          </a>
        }
      />

      <main>
        <section className="border-b border-zinc-200 bg-gradient-to-b from-accent-25 to-white">
          <Container className="py-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="text-sm text-accent-700">Guide</div>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                  Cartes de visite NFC : est-ce que vous en avez vraiment besoin ?
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-zinc-600">
                  Comprendre les cartes NFC, leurs avantages, et choisir un modèle premium pour partager vos infos
                  en un tap.
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                  <span>Temps de lecture : 6 min</span>
                  <span className="hidden sm:inline">·</span>
                  <span>Mis à jour : {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="hidden lg:col-span-5 lg:block">
                <AnimatedCardsHero />
              </div>
            </div>
          </Container>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <article className="lg:col-span-8">
              <div className="rounded-3xl bg-gradient-to-br from-accent-25 to-white p-8 ring-1 ring-accent-100">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <div className="text-sm font-semibold">Tap NFC + QR</div>
                    <div className="mt-1 text-sm text-zinc-600">Compatible iPhone & Android</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Matériaux premium</div>
                    <div className="mt-1 text-sm text-zinc-600">PVC, métal, bambou</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Paiement Stripe</div>
                    <div className="mt-1 text-sm text-zinc-600">Sécurisé, sans stockage CB</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-10">
                <section id="what" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold tracking-tight">Qu’est-ce qu’une carte de visite NFC ?</h2>
                  <p className="mt-3 text-zinc-700 leading-relaxed">
                    Une carte NFC est une carte de visite moderne : elle contient une puce qui, au contact d’un
                    smartphone, ouvre un lien (profil, site, portfolio, Linktree…). On ajoute généralement un QR
                    code comme alternative.
                  </p>
                </section>

                <section id="benefits" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold tracking-tight">Pourquoi c’est utile (vraiment)</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-accent-200 hover:bg-accent-25/40">
                      <div className="text-sm font-semibold">Vous êtes mémorable</div>
                      <div className="mt-2 text-sm text-zinc-600">Une expérience premium en rendez-vous ou en salon.</div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-accent-200 hover:bg-accent-25/40">
                      <div className="text-sm font-semibold">Zéro friction</div>
                      <div className="mt-2 text-sm text-zinc-600">Un tap, vos infos sont déjà dans le téléphone.</div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-accent-200 hover:bg-accent-25/40">
                      <div className="text-sm font-semibold">Toujours à jour</div>
                      <div className="mt-2 text-sm text-zinc-600">Vous changez le lien sans réimprimer.</div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-accent-200 hover:bg-accent-25/40">
                      <div className="text-sm font-semibold">Meilleur suivi</div>
                      <div className="mt-2 text-sm text-zinc-600">Vous envoyez vers une page optimisée conversion.</div>
                    </div>
                  </div>
                </section>

                <section id="pricing" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold tracking-tight">Packs disponibles</h2>
                  <p className="mt-3 text-zinc-700 leading-relaxed">
                    Même technologie NFC, rendu différent. Choisissez surtout le matériau adapté à votre image.
                  </p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-3">
                    <div className="rounded-3xl border border-accent-200/70 bg-white p-6 shadow-sm">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-accent-100 to-accent-25">
                        <Image
                          src="/cards/nfc-pvc.jpg"
                          alt="Carte NFC PVC Pro"
                          fill
                          className="object-cover"
                          sizes="(min-width: 640px) 33vw, 100vw"
                          priority
                        />
                      </div>
                      <div className="mt-4 text-sm font-semibold">PVC Pro</div>
                      <div className="mt-1 text-2xl font-semibold">29,90€</div>
                      <a href="/checkout?product=1" className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-700">
                        Commander
                      </a>
                    </div>
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100">
                        <Image
                          src="/cards/nfc-premium.jpg"
                          alt="Carte NFC Métal Premium"
                          fill
                          className="object-cover"
                          sizes="(min-width: 640px) 33vw, 100vw"
                        />
                      </div>
                      <div className="mt-4 text-sm font-semibold">Métal Premium</div>
                      <div className="mt-1 text-2xl font-semibold">79,90€</div>
                      <a href="/checkout?product=2" className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-accent-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-accent-25">
                        Commander
                      </a>
                    </div>
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100">
                        <Image
                          src="/cards/nfc-bois.jpg"
                          alt="Carte NFC Bambou Éco"
                          fill
                          className="object-cover"
                          sizes="(min-width: 640px) 33vw, 100vw"
                        />
                      </div>
                      <div className="mt-4 text-sm font-semibold">Bambou Éco</div>
                      <div className="mt-1 text-2xl font-semibold">49,90€</div>
                      <a href="/checkout?product=3" className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-accent-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-accent-25">
                        Commander
                      </a>
                    </div>
                  </div>
                </section>

                <section id="faq" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
                  <div className="mt-4 space-y-3">
                    <details className="rounded-2xl border border-zinc-200 bg-white p-5">
                      <summary className="cursor-pointer text-sm font-semibold">Ça marche sur iPhone et Android ?</summary>
                      <div className="mt-3 text-sm text-zinc-600">
                        Oui. La plupart des smartphones récents supportent NFC. On ajoute aussi un QR en fallback.
                      </div>
                    </details>
                    <details className="rounded-2xl border border-zinc-200 bg-white p-5">
                      <summary className="cursor-pointer text-sm font-semibold">Puis-je changer le lien plus tard ?</summary>
                      <div className="mt-3 text-sm text-zinc-600">
                        Oui, le plus simple est d’utiliser un lien que vous contrôlez (ex: Linktree, page profil).
                      </div>
                    </details>
                    <details className="rounded-2xl border border-zinc-200 bg-white p-5">
                      <summary className="cursor-pointer text-sm font-semibold">Le paiement est sécurisé ?</summary>
                      <div className="mt-3 text-sm text-zinc-600">
                        Paiement géré par Stripe. Nous ne stockons jamais vos informations bancaires.
                      </div>
                    </details>
                  </div>
                </section>

                <div className="rounded-3xl bg-gradient-to-br from-accent-25 to-white p-8 ring-1 ring-accent-100">
                  <div className="text-xl font-semibold tracking-tight">Prêt à tester une carte NFC ?</div>
                  <div className="mt-2 text-sm text-zinc-600">Commander en 2 minutes, redirection Stripe.</div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a href="/products" className="inline-flex items-center justify-center rounded-2xl border border-accent-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-accent-25">
                      Voir les produits
                    </a>
                    <a href="/checkout?product=1" className="inline-flex items-center justify-center rounded-2xl bg-accent-600 px-5 py-3 text-sm font-semibold text-white hover:bg-accent-700">
                      Commander maintenant
                    </a>
                    <a href="#pricing" className="inline-flex items-center justify-center rounded-2xl border border-accent-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-accent-25">
                      Voir les packs
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-3xl border border-accent-200/70 bg-white shadow-sm">
                  <div className="border-b border-accent-200/70 px-6 py-5">
                    <div className="text-lg font-semibold">Commande express</div>
                    <div className="mt-1 text-sm text-zinc-500">PVC Pro — 29,90€</div>
                  </div>
                  <div className="p-6">
                    <form action={landingCheckoutAction} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Nom complet</label>
                        <input
                          name="customerName"
                          required
                          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                          name="email"
                          type="email"
                          required
                          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
                          placeholder="jean@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Lien à encoder (URL)</label>
                        <input
                          name="nfcLink"
                          required
                          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>

                      <input type="hidden" name="productId" value="1" />
                      <input type="hidden" name="amount" value="29.9" />

                      <button
                        type="submit"
                        className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-accent-600 px-4 py-3 text-sm font-semibold text-white hover:bg-accent-700"
                      >
                        Passer au paiement
                      </button>

                      <div className="text-center text-xs text-zinc-500">Redirection Stripe. Aucun stockage de CB.</div>
                    </form>
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <div className="text-sm font-semibold">Livraison & support</div>
                  <div className="mt-2 text-sm text-zinc-600">Expédition 48–72h. Support 7j/7.</div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} NFC.PRO</div>
          <div className="flex gap-4">
            <a href="/legal/terms" className="hover:text-zinc-900">CGV</a>
            <a href="/legal/privacy" className="hover:text-zinc-900">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}