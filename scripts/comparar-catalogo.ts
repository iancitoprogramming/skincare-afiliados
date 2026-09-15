// Compara, sin escribir nada, el catálogo del repo con la tabla `productos` de
// Supabase. Es lo que conviene correr ANTES de `npm run sync`: el sync hace
// upsert de todos los campos por id y desactiva lo que no esté en el archivo, así
// que un dato que alguien cambió sólo en Supabase se pisa sin aviso.
//
// Muestra, producto por producto, qué campos cambiaría el upsert y qué filas
// desactivaría. Usa el mismo mapeo que el sync (filaDeProducto) y nunca imprime
// las claves.
// Uso: npm run comparar   (necesita .env con la service_role key, igual que sync)

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { productos } from "../src/niches/skincare/productos";
import { filaDeProducto } from "../src/engine/catalogo";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

/** numeric de Postgres llega como string por la API: se compara como número. */
function igual(a: unknown, b: unknown): boolean {
  const x = a ?? null;
  const y = b ?? null;
  if (typeof x === "number" || typeof y === "number") return Number(x) === Number(y);
  return JSON.stringify(x) === JSON.stringify(y);
}

async function main() {
  const { data, error } = await supabase.from("productos").select("*");
  if (error) {
    console.error("Error al leer productos:", error.message);
    process.exit(1);
  }
  const actuales = (data ?? []) as Record<string, unknown>[];
  const filas = productos.map(filaDeProducto) as unknown as Record<string, unknown>[];
  const porId = new Map(actuales.map((r) => [String(r.id), r]));

  let cambiarian = 0;
  for (const fila of filas) {
    const actual = porId.get(String(fila.id));
    const quien = `${fila.ml_id ?? fila.id} · ${fila.nombre}`;
    if (!actual) {
      cambiarian++;
      console.log(`nuevo: ${quien}`);
      continue;
    }
    const campos = Object.keys(fila).filter((k) => !igual(fila[k], actual[k]));
    if (campos.length === 0) continue;
    cambiarian++;
    console.log(quien);
    for (const k of campos) console.log(`  ${k}: ${JSON.stringify(actual[k])} → ${JSON.stringify(fila[k])}`);
  }

  const ids = new Set(filas.map((f) => String(f.id)));
  const desactivaria = actuales.filter((r) => !ids.has(String(r.id)) && r.activo);
  for (const r of desactivaria) console.log(`se desactivaría: ${r.ml_id ?? r.id} · ${r.nombre}`);

  console.log(`\n${filas.length} en el repo · ${actuales.length} en Supabase`);
  console.log(`el sync cambiaría ${cambiarian} y desactivaría ${desactivaria.length}`);
}

main();
