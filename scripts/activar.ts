// Prende los productos que ya están completos.
//
//   npm run activar               simula y lista
//   npm run activar -- --escribir aplica
//
// Un producto se muestra cuando `activo: true`. Ese flag se puso a mano desde
// que existe el catálogo, y a mano es donde se cuela el que todavía no tiene
// foto: la card sale con un recuadro vacío y nadie lo ve hasta que alguien
// abre la página.
//
// QUÉ CUENTA COMO COMPLETO
//
// Las cinco cosas que la card y la página necesitan para no salir rotas:
// link que monetiza, imagen, `por_que`, `como_usar` y banda de precio. No se
// pide `precio_ars`: el sitio publica la banda y no el número — ver
// `docs/PRECIO.md`.
//
// LO QUE ESTO CAMBIA, Y NO ES POCO
//
// Prender un producto no sólo agrega una página: lo mete en el pool del motor
// de recomendación, así que las rutinas que el quiz arma hoy salen distintas
// mañana. Por eso conviene correr `npm run auditar` y `npm run cobertura`
// antes y después, y mirar el diff en vez de confiar.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import { monetiza } from "../src/lib/links";

const ESCRIBIR = process.argv.includes("--escribir");

const CATALOGOS = [
  "src/niches/skincare/productos.ts",
  "src/niches/skincare/productos.organize.ts",
].map((p) => resolve(process.cwd(), p));

interface Falta {
  ml_id: string;
  etiqueta: string;
  falta: string[];
}

const listos: { ml_id: string; etiqueta: string }[] = [];
const incompletos: Falta[] = [];

for (const p of productos) {
  if (p.activo) continue;
  const ml_id = p.ml_id ?? "";
  const etiqueta = `${p.marca ?? ""} ${p.nombre}`.trim();

  const falta: string[] = [];
  if (!monetiza(p.link_afiliado)) falta.push("link");
  if (!p.imagen_url) falta.push("imagen");
  if (!p.por_que) falta.push("por_que");
  if (!p.como_usar) falta.push("como_usar");
  if (!p.rango_precio) falta.push("banda");

  if (falta.length) incompletos.push({ ml_id, etiqueta, falta });
  else listos.push({ ml_id, etiqueta });
}

const yaActivos = productos.filter((p) => p.activo).length;

console.log(`\n${productos.length} productos · ${yaActivos} ya activos`);
console.log(`  ${listos.length} completos y apagados`);
console.log(`  ${incompletos.length} todavía incompletos\n`);

if (listos.length) {
  console.log("SE PRENDEN:");
  for (const l of listos) console.log(`  ${l.ml_id.padEnd(16)} ${l.etiqueta.slice(0, 58)}`);
}

if (incompletos.length) {
  console.log("\nQUEDAN APAGADOS:");
  for (const i of incompletos)
    console.log(`  ${i.ml_id.padEnd(16)} falta ${i.falta.join(" + ").padEnd(22)} ${i.etiqueta.slice(0, 40)}`);
}

if (!listos.length) {
  console.log("\nNo hay nada para prender.\n");
  process.exit(0);
}

if (!ESCRIBIR) {
  console.log(`\n(simulación — nada se escribió. Agregá --escribir para aplicarlo)\n`);
  process.exit(0);
}

// Se cambia `activo: false` dentro del bloque de cada ml_id, y sólo ahí. Acotar
// la búsqueda al bloque es lo que evita prender al vecino.
let prendidos = 0;
for (const archivo of CATALOGOS) {
  let s = readFileSync(archivo, "utf8");
  let tocado = false;

  for (const { ml_id } of listos) {
    const i = s.indexOf(`ml_id: "${ml_id}"`);
    if (i === -1) continue;
    const fin = s.indexOf("\n  },", i);
    const bloque = s.slice(i, fin === -1 ? undefined : fin);
    const j = bloque.indexOf("activo: false");
    if (j === -1) continue;
    s = s.slice(0, i + j) + bloque.slice(j).replace("activo: false", "activo: true") + s.slice(fin);
    tocado = true;
    prendidos++;
  }

  if (tocado) writeFileSync(archivo, s, "utf8");
}

console.log(`\n${prendidos} producto(s) prendidos.`);
console.log("Siguiente: npm run auditar && npm run cobertura && npm run gen-seed\n");
