// Arma docs/links-pendientes.md con todo lo que todavía no monetiza.
//
// El archivo está pensado para ir y volver: Ian lo abre, genera cada link en el
// panel de Afiliados de ML, pega el `meli.la` en la última columna, y después
// `npm run links-aplicar` lo lee y lo escribe en el catálogo. Por eso el formato
// es una tabla con el ml_id adelante — es la clave con la que se vuelve a
// encontrar cada producto, y no cambia aunque cambie el nombre.

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import { KITS_UNICOS } from "../src/niches/skincare/kits";
import { clasificar, urlPublicacion, ETIQUETA, type Veredicto } from "../src/lib/links";

interface Fila {
  ml_id: string;
  etiqueta: string;
  estado: Veredicto;
  activo: boolean;
}

const filas: Fila[] = [
  ...productos.map((p) => ({
    ml_id: p.ml_id ?? "",
    etiqueta: `${p.marca ?? ""} ${p.nombre}`.trim(),
    estado: clasificar(p.link_afiliado, p.activo),
    activo: p.activo,
  })),
  ...KITS_UNICOS.map((k) => ({
    ml_id: k.ml_id,
    etiqueta: `[kit] ${k.marca} ${k.nombre}`,
    estado: clasificar(k.link_afiliado, true),
    activo: true,
  })),
];

const pendientes = filas.filter((f) => f.estado !== "afiliado");
const listos = filas.length - pendientes.length;

// Los activos primero: son los que están publicados sin cobrar comisión.
pendientes.sort((a, b) => Number(b.activo) - Number(a.activo) || a.etiqueta.localeCompare(b.etiqueta));

const md = [
  "# Links de afiliado pendientes",
  "",
  "> Generado por `npm run links-pendientes`. **Se puede editar**: pegá cada link",
  "> en la última columna y después corré `npm run links-aplicar`.",
  "",
  `${filas.length} ítems en el catálogo · **${listos} ya monetizan** · **${pendientes.length} pendientes**`,
  "",
  "## Cómo se completa",
  "",
  "1. Abrí la publicación con el link de la columna *abrir*.",
  "2. Generá el link de afiliado en el panel de Afiliados de Mercado Libre.",
  "3. Pegá el `https://meli.la/…` en la columna *pegar acá*.",
  "4. Guardá el archivo y corré `npm run links-aplicar`.",
  "",
  "No toques la columna `ml_id`: es con lo que el script vuelve a encontrar cada",
  "producto. Las filas que dejes vacías se ignoran, así que se puede ir de a poco.",
  "",
].join("\n");

const tabla = pendientes.length
  ? [
      "## Pendientes",
      "",
      "| ml_id | producto | estado | abrir | pegar acá |",
      "|---|---|---|---|---|",
      ...pendientes.map(
        (f) =>
          `| \`${f.ml_id}\` | ${f.activo ? "" : "_(inactivo)_ "}${f.etiqueta} | ${ETIQUETA[f.estado]} | [ML](${urlPublicacion(f.ml_id)}) | |`,
      ),
      "",
    ].join("\n")
  : "## Pendientes\n\nNinguno. Todo el catálogo monetiza.\n";

const destino = resolve(process.cwd(), "docs/links-pendientes.md");
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, md + tabla, "utf8");

console.log(`\n${filas.length} ítems · ${listos} monetizan · ${pendientes.length} pendientes`);
console.log(`→ ${destino}\n`);

if (pendientes.length) {
  const porEstado = new Map<Veredicto, number>();
  for (const f of pendientes) porEstado.set(f.estado, (porEstado.get(f.estado) ?? 0) + 1);
  for (const [estado, n] of porEstado) console.log(`  ${ETIQUETA[estado]} — ${n}`);
  console.log("");
}
