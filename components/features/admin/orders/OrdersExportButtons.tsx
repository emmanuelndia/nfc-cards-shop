import React from "react";
import { Download } from "lucide-react";

type OrdersExportButtonsProps = {
  exportUrl: string;
  exportXlsxUrl: string;
};

export default function OrdersExportButtons({ exportUrl, exportXlsxUrl }: OrdersExportButtonsProps) {
  return (
    <>
      <a
        href={exportUrl}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
      >
        <Download className="h-4 w-4 text-zinc-500" />
        Export CSV
      </a>
      <a
        href={exportXlsxUrl}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
      >
        <Download className="h-4 w-4 text-zinc-500" />
        Export Excel
      </a>
    </>
  );
}
