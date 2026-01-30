"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totalItems: number;
};

const STORAGE_KEY = "nfc:cart:v1";

const CartContext = createContext<CartContextValue | null>(null);

const clampQty = (value: number) => {
  if (!Number.isFinite(value)) return 1;
  const v = Math.floor(value);
  if (v < 1) return 1;
  if (v > 99) return 99;
  return v;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const safe = parsed
            .filter((x) => x && typeof x === "object")
            .map((x) => ({
              productId: String((x as any).productId ?? ""),
              quantity: clampQty(Number((x as any).quantity ?? 1)),
            }))
            .filter((x) => x.productId);
          setItems(safe);
        }
      }
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    const pid = String(productId || "").trim();
    if (!pid) return;
    const q = clampQty(quantity);

    setItems((prev) => {
      const existing = prev.find((x) => x.productId === pid);
      if (existing) {
        return prev.map((x) => (x.productId === pid ? { ...x, quantity: clampQty(x.quantity + q) } : x));
      }
      return [...prev, { productId: pid, quantity: q }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const pid = String(productId || "").trim();
    if (!pid) return;
    const q = clampQty(quantity);

    setItems((prev) => prev.map((x) => (x.productId === pid ? { ...x, quantity: q } : x)));
  }, []);

  const removeItem = useCallback((productId: string) => {
    const pid = String(productId || "").trim();
    if (!pid) return;
    setItems((prev) => prev.filter((x) => x.productId !== pid));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      setQuantity,
      removeItem,
      clear,
      totalItems,
    }),
    [items, addItem, setQuantity, removeItem, clear, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
