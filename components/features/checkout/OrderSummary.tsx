import React from "react";
import { Package, Truck } from "lucide-react";
import { formatEUR } from "@/lib/format";

export type OrderSummaryItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type OrderSummaryProps = {
  items: OrderSummaryItem[];
  total: number;
};

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center">
            <Package className="h-5 w-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.quantity} × {formatEUR(item.unitPrice)}
              </div>
            </div>
            <div className="font-bold">{formatEUR(item.lineTotal)}</div>
          </div>
        ))}

        <div className="flex items-center">
          <Truck className="h-5 w-5 text-gray-400 mr-3" />
          <div className="flex-1">
            <div className="font-medium">Livraison</div>
            <div className="text-sm text-gray-500">Standard (5-7 jours)</div>
          </div>
          <div className="font-bold">Gratuite</div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatEUR(total)}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">TVA incluse</div>
        </div>
      </div>
    </div>
  );
}
