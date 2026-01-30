export function statusBadge(status: string) {
  const s = String(status || "").toUpperCase();
  if (s === "PAID") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (s === "PENDING") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  if (s === "SHIPPED") return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
  return "bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200";
}

export function statusDot(status: string) {
  const s = String(status || "").toUpperCase();
  if (s === "PAID") return "bg-emerald-500";
  if (s === "PENDING") return "bg-amber-500";
  if (s === "SHIPPED") return "bg-blue-500";
  return "bg-zinc-400";
}
