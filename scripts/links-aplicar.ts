// Lee docs/links-pendientes.md ya completado y escribe los links en el catálogo.
//
// La otra mitad de links-pendientes. Se hace con un script y no a mano porque
// pegar 40 links en un archivo de TypeScript es exactamente donde se cuela uno
// en la fila equivocada, y un link en el producto equivocado no se nota: la
// página funciona y la comisión se le paga a otra publicación.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { clasificar, ETIQUETA } from "../src/lib/links";

const MD = resolve(process.cwd(), "docs/links-pendientes.md");
// Los tres archivos donde puede vivir un `link_afiliado`. El de organize es el
// que trae lo importado del vault, y es justo donde están los que faltan cargar:
// olvidarlo hacía que el script dijera "el ml_id no existe en el catálogo" sobre
// productos que sí estaban, sólo que en otro archivo.
const CATALOGOS = [
  resolve(process.cwd(), "src/niches/skincare/productos.ts"),
  resolve(process.cwd(), "src/niches/skincare/productos.organize.ts"),
  resolve(process.cwd(), "src/niches/skincare/kits.ts"),
];

if (!existsSync(MD)) {
  console.error(`No existe ${MD}. Corré primero: npm run links-pendientes`);
  process.exit(1);
}

// | `MLA123` | Producto | estado | [ML](…) | https://meli.la/xxx |
const FILA = /^\|\s*`?(MLAU?\d+)`?\s*\|(.*)\|\s*$/;

interface Pegado {
  ml_id: string;
  link: string;
}

const pegados: Pegado[] = [];
const rechazados: { ml_id: string; link: string; motivo: string }[] = [];

for (const linea of readFileSync(MD, "utf8").split("\n")) {
  const m = FILA.exec(linea.trim());
  if (!m) continue;
  const [, ml_id, resto] = m;

  // La última celda es donde se pega. Se toma el último trozo no vacío para
  // tolerar que alguien agregue o saque una columna del medio.
  const celdas = resto.split("|").map((c) => c.trim());
  const link = celdas[celdas.length - 1];
  if (!link) continue; // fila sin completar: se ignora, se puede ir de a poco

  const veredicto = clasificar(link);
  if (veredicto !== "afiliado") {
    rechazados.push({ ml_id, link, motivo: ETIQUETA[veredicto] });
    continue;
  }
  pegados.push({ ml_id, link });
}

if (!pegados.length && !rechazados.length) {
  console.log("\nNo hay ningún link pegado en el archivo. Nada que hacer.\n");
  process.exit(0);
}

// Reemplaza `link_afiliado` dentro del bloque que tiene ese ml_id, y sólo ahí.
function aplicar(fuente: string, ml_id: string, link: string): string | null {
  const i = fuente.indexOf(`ml_id: "${ml_id}"`);
  if (i === -1) return null;

  // El link_afiliado del mismo producto es el primero que aparece después del
  // ml_id. Acotar la búsqueda al bloque es lo que evita pisar el del vecino.
  const desde = fuente.indexOf("link_afiliado:", i);
  const finBloque = fuente.indexOf("\n  },", i);
  if (desde === -1 || (finBloque !== -1 && desde > finBloque)) return null;

  const fin = fuente.indexOf("\n", desde);
  const sangria = "    ";
  return fuente.slice(0, desde) + `link_afiliado: "${link}",` + fuente.slice(fin);
  void sangria;
}

let aplicados = 0;
const noEncontrados: string[] = [];
const pisados: string[] = [];

for (const archivo of CATALOGOS) {
  let s = readFileSync(archivo, "utf8");
  let tocado = false;
  for (const { ml_id, link } of pegados) {
    const previo = /link_afiliado: "([^"]*)"/.exec(
      s.slice(s.indexOf(`ml_id: "${ml_id}"`)),
    )?.[1];
    const nuevo = aplicar(s, ml_id, link);
    if (nuevo) {
      if (previo && previo !== link) pisados.push(`${ml_id}  ${previo} → ${link}`);
      s = nuevo;
      tocado = true;
      aplicados++;
    }
  }
  if (tocado) writeFileSync(archivo, s, "utf8");
}

for (const { ml_id } of pegados) {
  const estaEnAlguno = CATALOGOS.some((a) => readFileSync(a, "utf8").includes(`ml_id: "${ml_id}"`));
  if (!estaEnAlguno) noEncontrados.push(ml_id);
}

console.log(`\n${aplicados} link(s) aplicados al catálogo.\n`);

if (rechazados.length) {
  console.log("RECHAZADOS — no monetizan, no se escribieron:");
  for (const r of rechazados) console.log(`  ${r.ml_id}  ${r.motivo}\n      ${r.link}`);
  console.log("");
}

if (noEncontrados.length) {
  console.log("SIN PRODUCTO — el ml_id del archivo no existe en el catálogo:");
  for (const id of noEncontrados) console.log(`  ${id}`);
  console.log("");
}

if (aplicados) {
  console.log("Siguiente: npm run check-links && npm run gen-seed\n");
}

if (rechazados.length || noEncontrados.length) process.exit(1);
