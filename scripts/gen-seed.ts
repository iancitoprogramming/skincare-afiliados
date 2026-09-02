// Genera supabase/seed.sql a partir de content del nicho (productos.ts).
// Así el seed SQL nunca queda desincronizado del catálogo tipado.
// Uso: npm run gen-seed

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import type { Producto } from "../src/engine/recomendacion";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const txt = (v: string | undefined) => (v == null ? "null" : q(v));
const num = (v: number | undefined) => (v == null ? "null" : String(v));
const bool = (v: boolean) => (v ? "true" : "false");
const arr = (a: string[]) => `array[${a.map(q).join(", ")}]`;

const cols = [
  "id",
  "nombre",
  "marca",
  "categoria",
  "paso",
  "momento",
  "tipos_piel",
  "preocupaciones",
  "rango_precio",
  "precio_ars",
  "imagen_url",
  "link_afiliado",
  "por_que",
  "como_usar",
  "prioridad",
  "comodin",
  "activo",
];

function fila(p: Producto): string {
  return [
    q(p.id),
    txt(p.nombre),
    txt(p.marca),
    txt(p.categoria),
    num(p.paso),
    txt(p.momento),
    arr(p.tipos_piel),
    arr(p.preocupaciones),
    num(p.rango_precio),
    num(p.precio_ars),
    txt(p.imagen_url),
    txt(p.link_afiliado),
    txt(p.por_que),
    txt(p.como_usar),
    num(p.prioridad),
    bool(p.comodin),
    bool(p.activo),
  ].join(", ");
}

const sql =
  `-- Seed de ${productos.length} productos de ejemplo. Generado por scripts/gen-seed.ts.\n` +
  `-- No editar a mano: cambiá src/niches/skincare/productos.ts y corré npm run gen-seed.\n\n` +
  productos
    .map((p) => `insert into productos (${cols.join(", ")})\nvalues (${fila(p)})\non conflict (id) do nothing;`)
    .join("\n\n") +
  "\n";

const out = resolve(process.cwd(), "supabase/seed.sql");
writeFileSync(out, sql, "utf8");
console.log(`seed.sql generado con ${productos.length} productos → ${out}`);
