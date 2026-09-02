import { createClient } from "@supabase/supabase-js";
import type { Producto } from "./recomendacion";

// Lee el catálogo activo desde Supabase. Se pensó para usarse con ISR a nivel de
// página (revalidate 3600): la landing sirve el último catálogo cacheado aunque
// Supabase esté lento o caído. Si no hay config o falla la lectura, devuelve el
// catálogo de fallback que le pasa el nicho (productos.ts local), para que la
// página nunca quede sin rutina.
export async function getCatalogo(fallback: Producto[]): Promise<Producto[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallback;

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase.from("productos").select("*").eq("activo", true);
    if (error || !data || data.length === 0) return fallback;
    return data as Producto[];
  } catch {
    return fallback;
  }
}
