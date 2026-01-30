export type SortKey = "createdAt" | "amount" | "status";
export type SortDir = "asc" | "desc";

export type OrderDTO = {
  id: string;
  createdAt: string;
  amount: number;
  currency: string;
  status: string;
  customerName: string;
  customerEmail: string;
  cardType: string;
  nfcLink: string;
  nfcNameOnCard?: string | null;
};

export type OrdersResponse = {
  items: OrderDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sort: SortKey;
  dir: SortDir;
  status: string | null;
  cardType?: string | null;
  period?: string | null;
  start?: string | null;
  end?: string | null;
  q: string | null;
};

export function getSortKey(value: string | null): SortKey {
  if (value === "amount") return "amount";
  if (value === "status") return "status";
  return "createdAt";
}

export function getSortDir(value: string | null): SortDir {
  if (value === "asc") return "asc";
  return "desc";
}
