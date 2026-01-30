import Link from "next/link";
import React from "react";

type ButtonLinkVariant = "primary" | "outline" | "ghost";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: ButtonLinkVariant;
};

const variants: Record<ButtonLinkVariant, string> = {
  primary:
    "rounded-2xl bg-accent-600 px-5 py-3 text-sm font-semibold text-white hover:bg-accent-700",
  outline:
    "rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50",
  ghost:
    "rounded-2xl px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50",
};

export default function ButtonLink({
  href,
  children,
  className = "",
  variant = "outline",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
