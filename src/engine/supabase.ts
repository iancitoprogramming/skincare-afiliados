import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente para usar en el servidor (API routes, server components). Usa la anon key:
// las inserciones pasan por las policies de RLS (insert público). La service_role key
// nunca se usa acá; solo en scripts locales (npm run sync).
// Si no hay config (ej. dev sin Supabase), devuelve null y quien lo llame hace no-op.
export function serverClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
