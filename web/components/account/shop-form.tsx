"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { shopsApi, type Shop } from "@/lib/api/shops-api";

type Props = {
  existing?: Shop | null;
  onSaved?: (shop: Shop) => void;
};

export function ShopForm({ existing, onSaved }: Props) {
  const [values, setValues] = useState({
    name: existing?.name ?? "",
    legalName: existing?.legalName ?? "",
    cacNumber: existing?.cacNumber ?? "",
    tin: existing?.tin ?? "",
    email: existing?.email ?? "",
    phone: existing?.phone ?? "",
    city: existing?.city ?? "",
    state: existing?.state ?? "",
    businessAddress: existing?.businessAddress ?? "",
    description: existing?.description ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const update = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sign in to manage a shop");

      const payload = {
        name: values.name.trim(),
        legalName: values.legalName.trim(),
        cacNumber: values.cacNumber.trim(),
        tin: values.tin.trim() || undefined,
        email: values.email.trim(),
        phone: values.phone.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        businessAddress: values.businessAddress.trim(),
        description: values.description.trim() || undefined,
      };

      const shop = existing
        ? await shopsApi.updateMine(session.access_token, payload)
        : await shopsApi.create(session.access_token, payload);
      setMessage(existing ? "Shop updated." : "Shop created. You can now add products.");
      onSaved?.(shop);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save shop");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-x-4 md:grid-cols-2">
      <div>
        <label className="auth-label" htmlFor="shop-name">Shop name</label>
        <input id="shop-name" className="auth-input" value={values.name} onChange={(e) => update("name", e.target.value)} disabled={busy} required />
      </div>
      <div>
        <label className="auth-label" htmlFor="shop-legal">Legal name</label>
        <input id="shop-legal" className="auth-input" value={values.legalName} onChange={(e) => update("legalName", e.target.value)} disabled={busy} required />
      </div>
      <div>
        <label className="auth-label" htmlFor="shop-cac">CAC number</label>
        <input id="shop-cac" className="auth-input" value={values.cacNumber} onChange={(e) => update("cacNumber", e.target.value)} disabled={busy} required />
      </div>
      <div>
        <label className="auth-label" htmlFor="shop-tin">TIN</label>
        <input id="shop-tin" className="auth-input" value={values.tin} onChange={(e) => update("tin", e.target.value)} disabled={busy} />
      </div>
      <div>
        <label className="auth-label" htmlFor="shop-email">Shop email</label>
        <input id="shop-email" type="email" className="auth-input" value={values.email} onChange={(e) => update("email", e.target.value)} disabled={busy} required />
      </div>
      <div>
        <label className="auth-label" htmlFor="shop-phone">Phone</label>
        <input id="shop-phone" className="auth-input" value={values.phone} onChange={(e) => update("phone", e.target.value)} disabled={busy} required />
      </div>
      <div>
        <label className="auth-label" htmlFor="shop-city">City</label>
        <input id="shop-city" className="auth-input" value={values.city} onChange={(e) => update("city", e.target.value)} disabled={busy} required />
      </div>
      <div>
        <label className="auth-label" htmlFor="shop-state">State</label>
        <input id="shop-state" className="auth-input" value={values.state} onChange={(e) => update("state", e.target.value)} disabled={busy} required />
      </div>
      <div className="md:col-span-2">
        <label className="auth-label" htmlFor="shop-address">Business address</label>
        <input id="shop-address" className="auth-input" value={values.businessAddress} onChange={(e) => update("businessAddress", e.target.value)} disabled={busy} required />
      </div>
      <div className="md:col-span-2">
        <label className="auth-label" htmlFor="shop-description">Shop description</label>
        <textarea id="shop-description" className="auth-input min-h-[96px] py-2" value={values.description} onChange={(e) => update("description", e.target.value)} disabled={busy} />
      </div>
      {error ? <p className="auth-error md:col-span-2">{error}</p> : null}
      {message ? <p className="mt-3 text-[14px] text-[var(--color-success)] md:col-span-2">{message}</p> : null}
      <div className="md:col-span-2">
        <button type="submit" className="auth-button max-w-[260px]" disabled={busy}>
          {busy ? "Saving..." : existing ? "Update shop" : "Create shop"}
        </button>
      </div>
    </form>
  );
}
