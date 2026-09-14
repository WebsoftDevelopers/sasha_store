export function getAuthProvider() {
  return process.env.NEXT_PUBLIC_AUTH_PROVIDER?.trim() || "supabase";
}

export function getAuthUrl() {
  return (
    process.env.NEXT_PUBLIC_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    ""
  );
}

export function getAuthPublicKey() {
  return (
    process.env.NEXT_PUBLIC_AUTH_PUBLIC_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

export function getSupabaseUrl() {
  return getAuthUrl();
}

export function getSupabaseAnonKey() {
  return getAuthPublicKey();
}

export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
}

export function hasSupabaseEnv() {
  return Boolean(getAuthUrl() && getAuthPublicKey());
}
