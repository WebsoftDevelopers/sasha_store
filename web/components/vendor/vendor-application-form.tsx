"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { uploadVendorAsset } from "@/lib/api/storage-api";
import {
  shopsApi,
  type CreateShopInput,
  type Shop,
} from "@/lib/api/shops-api";

type Props = {
  existing?: Shop | null;
  defaults?: Partial<Values>;
  mode?: "apply" | "store";
  onSaved?: (shop: Shop) => void;
};

type Values = {
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  category: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhone: string;
  alternativePhone: string;
  identificationType: string;
  identificationNumber: string;
  legalName: string;
  registeredBusinessName: string;
  cacNumber: string;
  businessRegistrationType: string;
  tin: string;
  registrationDate: string;
  country: string;
  state: string;
  city: string;
  lga: string;
  streetAddress: string;
  businessAddress: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  businessPhone: string;
  businessEmail: string;
  website: string;
  socialLinks: string;
  cacDocumentUrl: string;
  idDocumentUrl: string;
  proofOfAddressUrl: string;
  businessRegistrationDocumentUrl: string;
  taxCertificateUrl: string;
  additionalDocumentUrls: string[];
};

const inputClass = "auth-input";
const fieldClass = "grid gap-1";

function initialValues(existing?: Shop | null, defaults: Partial<Values> = {}): Values {
  const values = {
    name: existing?.name ?? "",
    description: existing?.description ?? "",
    logoUrl: existing?.logoUrl ?? "",
    bannerUrl: existing?.bannerUrl ?? "",
    category: existing?.category ?? "Fragrance",
    ownerFirstName: existing?.ownerFirstName ?? "",
    ownerLastName: existing?.ownerLastName ?? "",
    ownerEmail: existing?.ownerEmail ?? existing?.email ?? "",
    ownerPhone: existing?.ownerPhone ?? existing?.phone ?? "",
    alternativePhone: existing?.alternativePhone ?? "",
    identificationType: existing?.identificationType ?? "National ID",
    identificationNumber: existing?.identificationNumber ?? "",
    legalName: existing?.legalName ?? "",
    registeredBusinessName:
      existing?.registeredBusinessName ?? existing?.legalName ?? "",
    cacNumber: existing?.cacNumber ?? "",
    businessRegistrationType:
      existing?.businessRegistrationType ?? "Business Name",
    tin: existing?.tin ?? "",
    registrationDate: existing?.registrationDate?.slice(0, 10) ?? "",
    country: existing?.country ?? "Nigeria",
    state: existing?.state ?? "",
    city: existing?.city ?? "",
    lga: existing?.lga ?? "",
    streetAddress: existing?.streetAddress ?? existing?.businessAddress ?? "",
    businessAddress: existing?.businessAddress ?? "",
    postalCode: existing?.postalCode ?? "",
    latitude: existing?.latitude == null ? "" : String(existing.latitude),
    longitude: existing?.longitude == null ? "" : String(existing.longitude),
    phone: existing?.phone ?? "",
    email: existing?.email ?? "",
    businessPhone: existing?.businessPhone ?? existing?.phone ?? "",
    businessEmail: existing?.businessEmail ?? existing?.email ?? "",
    website: existing?.website ?? "",
    socialLinks: (existing?.socialLinks ?? []).join("\n"),
    cacDocumentUrl: existing?.cacDocumentUrl ?? "",
    idDocumentUrl: existing?.idDocumentUrl ?? "",
    proofOfAddressUrl: existing?.proofOfAddressUrl ?? "",
    businessRegistrationDocumentUrl:
      existing?.businessRegistrationDocumentUrl ?? "",
    taxCertificateUrl: existing?.taxCertificateUrl ?? "",
    additionalDocumentUrls: existing?.additionalDocumentUrls ?? [],
  };
  return { ...values, ...defaults };
}

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className={fieldClass} htmlFor={id}>
      <span className="auth-label">{label}</span>
      <input
        id={id}
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
      />
    </label>
  );
}

export function VendorApplicationForm({
  existing,
  defaults,
  mode = "apply",
  onSaved,
}: Props) {
  const [values, setValues] = useState<Values>(() =>
    initialValues(existing, defaults),
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const update = (key: keyof Values, value: string | string[]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const upload =
    (key: keyof Values, kind: string, multiple = false) =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      if (files.length === 0) return;
      setUploading(kind);
      setError(null);
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id || !session.access_token) {
          throw new Error("Sign in to upload files");
        }

        const uploaded = [];
        for (const file of files) {
          const result = await uploadVendorAsset(
            file,
            session.user.id,
            kind,
            session.access_token,
          );
          uploaded.push(result.url);
        }
        if (multiple) {
          update("additionalDocumentUrls", [
            ...values.additionalDocumentUrls,
            ...uploaded,
          ]);
        } else {
          update(key, uploaded[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading("");
        event.target.value = "";
      }
    };

  const payload = (): CreateShopInput => {
    const address =
      values.businessAddress.trim() || values.streetAddress.trim();
    return {
      name: values.name.trim(),
      description: optional(values.description),
      logoUrl: optional(values.logoUrl),
      bannerUrl: optional(values.bannerUrl),
      category: optional(values.category),
      ownerFirstName: values.ownerFirstName.trim(),
      ownerLastName: values.ownerLastName.trim(),
      ownerEmail: values.ownerEmail.trim(),
      ownerPhone: values.ownerPhone.trim(),
      alternativePhone: optional(values.alternativePhone),
      identificationType: values.identificationType.trim(),
      identificationNumber: values.identificationNumber.trim(),
      legalName: values.legalName.trim(),
      registeredBusinessName: optional(values.registeredBusinessName),
      cacNumber: values.cacNumber.trim(),
      businessRegistrationType: optional(values.businessRegistrationType),
      tin: optional(values.tin),
      registrationDate: optional(values.registrationDate),
      businessAddress: address,
      country: optional(values.country),
      city: values.city.trim(),
      state: values.state.trim(),
      lga: optional(values.lga),
      streetAddress: optional(values.streetAddress),
      postalCode: optional(values.postalCode),
      latitude: optional(values.latitude) ? Number(values.latitude) : undefined,
      longitude: optional(values.longitude)
        ? Number(values.longitude)
        : undefined,
      phone: values.phone.trim(),
      email: values.email.trim(),
      businessPhone: optional(values.businessPhone),
      businessEmail: optional(values.businessEmail),
      website: optional(values.website),
      socialLinks: values.socialLinks
        .split(/\n|,/)
        .map((link) => link.trim())
        .filter(Boolean),
      cacDocumentUrl: optional(values.cacDocumentUrl),
      idDocumentUrl: optional(values.idDocumentUrl),
      proofOfAddressUrl: optional(values.proofOfAddressUrl),
      businessRegistrationDocumentUrl: optional(
        values.businessRegistrationDocumentUrl,
      ),
      taxCertificateUrl: optional(values.taxCertificateUrl),
      additionalDocumentUrls: values.additionalDocumentUrls,
    };
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
      if (!session?.access_token) throw new Error("Sign in to continue");

      const data = payload();
      const saved =
        existing?.vendorStatus === "REJECTED"
          ? await shopsApi.resubmit(session.access_token, data)
          : existing
            ? await shopsApi.updateMine(session.access_token, data)
            : await shopsApi.create(session.access_token, data);
      setMessage(
        mode === "store"
          ? "Store profile updated."
          : "Vendor application submitted for review.",
      );
      onSaved?.(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save vendor");
    } finally {
      setBusy(false);
    }
  };

  const fileLabel = uploading ? `Uploading ${uploading}...` : "Upload";

  return (
    <form onSubmit={submit} className="grid gap-7">
      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="m-0 font-[var(--font-display)] text-[22px] font-normal md:col-span-2">
          Owner Information
        </h3>
        <Field id="owner-first" label="First name" value={values.ownerFirstName} onChange={(v) => update("ownerFirstName", v)} required />
        <Field id="owner-last" label="Last name" value={values.ownerLastName} onChange={(v) => update("ownerLastName", v)} required />
        <Field id="owner-email" label="Email" value={values.ownerEmail} onChange={(v) => update("ownerEmail", v)} required type="email" />
        <Field id="owner-phone" label="Phone number" value={values.ownerPhone} onChange={(v) => update("ownerPhone", v)} required />
        <Field id="owner-alt-phone" label="Alternative phone" value={values.alternativePhone} onChange={(v) => update("alternativePhone", v)} />
        <Field id="owner-id-type" label="Identification type" value={values.identificationType} onChange={(v) => update("identificationType", v)} required />
        <Field id="owner-id-number" label="Identification number" value={values.identificationNumber} onChange={(v) => update("identificationNumber", v)} required />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="m-0 font-[var(--font-display)] text-[22px] font-normal md:col-span-2">
          Store Information
        </h3>
        <Field id="store-name" label="Store name" value={values.name} onChange={(v) => update("name", v)} required />
        <Field id="store-category" label="Store category" value={values.category} onChange={(v) => update("category", v)} />
        <Field id="store-email" label="Business email" value={values.email} onChange={(v) => update("email", v)} required type="email" />
        <Field id="store-phone" label="Business phone" value={values.phone} onChange={(v) => update("phone", v)} required />
        <Field id="business-email" label="Alternate business email" value={values.businessEmail} onChange={(v) => update("businessEmail", v)} type="email" />
        <Field id="business-phone" label="Alternate business phone" value={values.businessPhone} onChange={(v) => update("businessPhone", v)} />
        <Field id="website" label="Website" value={values.website} onChange={(v) => update("website", v)} type="url" />
        <label className={`${fieldClass} md:col-span-2`} htmlFor="description">
          <span className="auth-label">Store description</span>
          <textarea id="description" className={`${inputClass} min-h-[96px] py-2`} value={values.description} onChange={(event) => update("description", event.target.value)} />
        </label>
        <label className={`${fieldClass} md:col-span-2`} htmlFor="social-links">
          <span className="auth-label">Social media links</span>
          <textarea id="social-links" className={`${inputClass} min-h-[76px] py-2`} value={values.socialLinks} onChange={(event) => update("socialLinks", event.target.value)} placeholder="One link per line" />
        </label>
        <label className={fieldClass}>
          <span className="auth-label">Store logo</span>
          <input type="file" accept="image/png,image/jpeg" onChange={upload("logoUrl", "logo")} disabled={busy || Boolean(uploading)} />
          {values.logoUrl ? <a className="auth-link text-[12px]" href={values.logoUrl} target="_blank" rel="noopener noreferrer">Logo uploaded</a> : null}
        </label>
        <label className={fieldClass}>
          <span className="auth-label">Store banner</span>
          <input type="file" accept="image/png,image/jpeg" onChange={upload("bannerUrl", "banner")} disabled={busy || Boolean(uploading)} />
          {values.bannerUrl ? <a className="auth-link text-[12px]" href={values.bannerUrl} target="_blank" rel="noopener noreferrer">Banner uploaded</a> : null}
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="m-0 font-[var(--font-display)] text-[22px] font-normal md:col-span-2">
          Business Information
        </h3>
        <Field id="legal-name" label="Registered business name" value={values.legalName} onChange={(v) => update("legalName", v)} required />
        <Field id="display-legal-name" label="Business trading name" value={values.registeredBusinessName} onChange={(v) => update("registeredBusinessName", v)} />
        <Field id="cac-number" label="CAC registration number" value={values.cacNumber} onChange={(v) => update("cacNumber", v)} required />
        <Field id="registration-type" label="Business registration type" value={values.businessRegistrationType} onChange={(v) => update("businessRegistrationType", v)} />
        <Field id="tin" label="Tax identification number" value={values.tin} onChange={(v) => update("tin", v)} />
        <Field id="registration-date" label="Registration date" value={values.registrationDate} onChange={(v) => update("registrationDate", v)} type="date" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="m-0 font-[var(--font-display)] text-[22px] font-normal md:col-span-2">
          Store Location
        </h3>
        <Field id="country" label="Country" value={values.country} onChange={(v) => update("country", v)} />
        <Field id="state" label="State" value={values.state} onChange={(v) => update("state", v)} required />
        <Field id="city" label="City" value={values.city} onChange={(v) => update("city", v)} required />
        <Field id="lga" label="LGA" value={values.lga} onChange={(v) => update("lga", v)} />
        <Field id="street" label="Street address" value={values.streetAddress} onChange={(v) => update("streetAddress", v)} required />
        <Field id="postal" label="Postal code" value={values.postalCode} onChange={(v) => update("postalCode", v)} />
        <Field id="latitude" label="Latitude" value={values.latitude} onChange={(v) => update("latitude", v)} type="number" />
        <Field id="longitude" label="Longitude" value={values.longitude} onChange={(v) => update("longitude", v)} type="number" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="m-0 font-[var(--font-display)] text-[22px] font-normal md:col-span-2">
          Documents
        </h3>
        {[
          ["CAC certificate", "cacDocumentUrl", "cac"],
          ["Government ID", "idDocumentUrl", "government-id"],
          ["Proof of address", "proofOfAddressUrl", "proof-of-address"],
          ["Business registration document", "businessRegistrationDocumentUrl", "business-registration"],
          ["Tax certificate", "taxCertificateUrl", "tax-certificate"],
        ].map(([label, key, kind]) => (
          <label key={key} className={fieldClass}>
            <span className="auth-label">{label}</span>
            <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={upload(key as keyof Values, kind)} disabled={busy || Boolean(uploading)} />
            {values[key as keyof Values] ? <span className="text-[12px] text-[var(--color-success)]">Uploaded</span> : null}
          </label>
        ))}
        <label className={`${fieldClass} md:col-span-2`}>
          <span className="auth-label">Additional supporting documents</span>
          <input type="file" accept="application/pdf,image/png,image/jpeg" multiple onChange={upload("additionalDocumentUrls", "additional", true)} disabled={busy || Boolean(uploading)} />
          {values.additionalDocumentUrls.length ? (
            <span className="text-[12px] text-[var(--color-success)]">
              {values.additionalDocumentUrls.length} additional document(s)
            </span>
          ) : null}
        </label>
      </section>

      {uploading ? <p className="text-[13px] text-[var(--color-muted)]">{fileLabel}</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}
      {message ? <p className="text-[14px] text-[var(--color-success)]">{message}</p> : null}
      <button type="submit" className="auth-button max-w-[280px]" disabled={busy || Boolean(uploading)}>
        {busy ? "Saving..." : existing?.vendorStatus === "REJECTED" ? "Resubmit application" : mode === "store" ? "Update store" : "Submit application"}
      </button>
    </form>
  );
}
