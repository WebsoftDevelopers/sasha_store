"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { ordersApi, type Order, type OrderStatus } from "@/lib/api/orders-api";

const statuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function money(value: string | number) {
  return `₦${Number(value).toLocaleString("en-NG")}`;
}

export default function OrdersPage() {
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [tab, setTab] = useState<"purchases" | "sales">("purchases");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sign in to view orders");
      setToken(session.access_token);
      const [myPurchases, mySales] = await Promise.all([
        ordersApi.purchases(session.access_token),
        ordersApi.sales(session.access_token),
      ]);
      setPurchases(myPurchases);
      setSales(mySales);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    if (!token) return;
    await ordersApi.updateSaleStatus(token, orderId, status);
    await load();
  };

  const list = tab === "purchases" ? purchases : sales;

  return (
    <>
      <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px] font-normal">
        Orders
      </h2>
      <p className="m-0 mb-6 text-[14px] leading-6 text-[var(--color-muted)]">
        Track what you bought and what your shop has sold. Sellers manage
        fulfillment outside Shasha Fragrance for now.
      </p>
      <div className="mb-5 inline-flex border border-[var(--color-border)]">
        <button type="button" className={`px-4 py-2 text-[13px] ${tab === "purchases" ? "brand-fill" : "bg-transparent"}`} onClick={() => setTab("purchases")}>
          Purchases ({purchases.length})
        </button>
        <button type="button" className={`px-4 py-2 text-[13px] ${tab === "sales" ? "brand-fill" : "bg-transparent"}`} onClick={() => setTab("sales")}>
          Sales ({sales.length})
        </button>
      </div>
      {loading ? <p className="text-[var(--color-muted)]">Loading orders...</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}
      {!loading && list.length === 0 ? (
        <p className="border border-dashed border-[var(--color-border)] p-5 text-[14px] text-[var(--color-muted)]">
          No {tab} yet.
        </p>
      ) : null}
      <ul className="m-0 grid list-none gap-4 p-0">
        {list.map((order) => (
          <li key={order.id} className="border border-[var(--color-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="m-0 text-[11px] tracking-[0.08em] text-[var(--color-muted)] uppercase">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.status}
                </p>
                <h3 className="m-0 mt-1 text-[16px]">
                  {tab === "purchases"
                    ? order.shop?.name || "Shop"
                    : order.buyer?.fullName || order.buyer?.email || "Buyer"}
                </h3>
              </div>
              <strong className="brand-text text-[18px]">{money(order.totalAmount)}</strong>
            </div>
            <ul className="mt-3 list-none border-t border-[var(--color-border)] p-0 pt-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-[13px] text-[var(--color-muted)]">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{money(Number(item.unitPrice) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            {tab === "sales" ? (
              <label className="auth-label max-w-[220px]">
                Status
                <select className="auth-input mt-1" value={order.status} onChange={(e) => void updateStatus(order.id, e.target.value as OrderStatus)}>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
