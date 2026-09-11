import { createClient } from "@supabase/supabase-js";
import type { Producto } from "./recomendacion";

// Lee el catálogo activo desde Supabase. Se pensó para usarse con ISR a nivel de
// página (revalidate 3600): la landing sirve el último catálogo cacheado aunque
// Supabase esté lento o caído. Si no hay config o falla la lectura, devuelve el
// catálogo de fallback que le pasa el nicho (productos.ts local), para que la
// página nunca quede sin rutina.
//
// `preparar` completa los campos derivados —hoy `calidad_formula` y
// `respaldo_orden`— que el nicho calcula y la tabla no guarda. Va como parámetro
// obligatorio a propósito: el fallback local ya viene preparado, así que si esto
// fuera opcional el sitio andaría igual y sólo ordenaría peor cuando Supabase
// responde. Un error que sólo aparece en producción y no rompe nada es el peor
// tipo de error; con el parámetro obligatorio, olvidarse no compila.
/**
 * Campos que el nicho calcula al armar el catálogo y la tabla NO guarda.
 *
 * `npm run sync` los saca antes de subir y `getCatalogo` los vuelve a calcular al
 * leer, con `preparar`. Si un campo nuevo es derivado, va en esta lista; si es
 * dato, necesita su columna en una migración, y `esquema-supabase.test.ts` lo
 * exige.
 */
export const CAMPOS_DERIVADOS = ["calidad_formula", "respaldo_orden"] as const;

/**
 * La fila tal cual se sube a `productos`: el producto sin sus campos derivados.
 *
 * La usan `sync` y el test de esquema, así el test prueba exactamente lo que se
 * manda y no una reconstrucción que podría no coincidir.
 */
export function filaDeProducto(p: Producto): Record<string, unknown> {
  const fila: Record<string, unknown> = { ...p };
  for (const campo of CAMPOS_DERIVADOS) delete fila[campo];
  return fila;
}

export async function getCatalogo(
  fallback: Producto[],
  preparar: (productos: Producto[]) => Producto[],
): Promise<Producto[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallback;

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase.from("productos").select("*").eq("activo", true);
    if (error || !data || data.length === 0) return fallback;
    return preparar(data as Producto[]);
  } catch {
    return fallback;
  }
}
