import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error(
      "Missing auth env. Set NEXT_PUBLIC_AUTH_URL and NEXT_PUBLIC_AUTH_PUBLIC_KEY, or the compatible NEXT_PUBLIC_SUPABASE_* variables.",
    );
  }

  return createBrowserClient(url, key);
}
