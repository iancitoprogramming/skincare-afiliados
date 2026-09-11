// Sube el catálogo (productos.ts) a Supabase. El archivo es la fuente de verdad:
// hace upsert por id y desactiva lo que ya no esté en el archivo.
// Uso: npm run sync   (necesita .env con la service_role key)

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

async function main() {
  const { error: errUpsert } = await supabase
    .from("productos")
    // Sin los campos derivados: la tabla no los guarda y el upsert fallaba entero.
    .upsert(productos.map(filaDeProducto), { onConflict: "id" });
  if (errUpsert) {
    console.error("Error al hacer upsert:", errUpsert.message);
    process.exit(1);
  }

  const ids = productos.map((p) => p.id);
  const { error: errBaja } = await supabase
    .from("productos")
    .update({ activo: false })
    .not("id", "in", `(${ids.join(",")})`);
  if (errBaja) {
    console.error("Error al desactivar productos viejos:", errBaja.message);
    process.exit(1);
  }

  console.log(`Sincronizados ${productos.length} productos.`);
}

main();
