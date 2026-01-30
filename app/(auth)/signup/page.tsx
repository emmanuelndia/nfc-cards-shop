import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
  // other metadata
};

export default function SignUp() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Inscription
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            Création de compte désactivée
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Les comptes sont créés par un Super Admin. Contactez l’administrateur pour obtenir un accès.
          </p>
          <a
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Aller à la connexion
          </a>
        </div>
      </div>
    </div>
  );
}
