// Inyecta el copy de src/niches/skincare/copy-productos.ts en el catálogo.
//
//   npm run copy-aplicar            · muestra qué haría, sin escribir
//   npm run copy-aplicar -- --escribir
//
// ─────────────────────────────────────────────────────────────────────────────
// POR QUÉ UN SCRIPT Y NO REGENERAR
//
// El camino natural sería poner el copy en el overlay y correr
// `importar-organize`. Hoy no se puede: el vault y el catálogo divergieron —hay
// cinco productos en el catálogo que no existen en los .md— y el importador
// aborta antes que borrarlos. Ver el mensaje que tira.
//
// Así que esto hace una sola cosa y la hace sin tocar nada más: por cada ml_id,
// escribe `por_que` y `como_usar` justo antes de `prioridad`. No reordena, no
// recalcula, no toca links. Es el mismo patrón que `links-aplicar`.
//
// Es idempotente: si el producto ya tiene copy, lo reemplaza en su lugar.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { COPY_PRODUCTOS } from "../src/niches/skincare/copy-productos";

const ESCRIBIR = process.argv.includes("--escribir");
const ARCHIVO = resolve(process.cwd(), "src/niches/skincare/productos.organize.ts");

const original = readFileSync(ARCHIVO, "utf8");
// El archivo está en CRLF en Windows. Normalizar para razonar, y devolverlo al
// final tal como estaba: no queremos un diff de 900 líneas por finales de línea.
const usaCRLF = original.includes("\r\n");
let texto = original.replace(/\r\n/g, "\n");

const linksAntes = (texto.match(/link_afiliado:\s*"https/g) ?? []).length;

const esc = (s: string) => JSON.stringify(s);
const aplicados: string[] = [];
const sinEncontrar: string[] = [];
const yaTenian: string[] = [];

for (const [mlId, copy] of Object.entries(COPY_PRODUCTOS)) {
  // El bloque del producto: desde su ml_id hasta el cierre del objeto.
  const inicio = texto.indexOf(`ml_id: "${mlId}"`);
  if (inicio === -1) {
    sinEncontrar.push(mlId);
    continue;
  }
  const fin = texto.indexOf("\n  },", inicio);
  if (fin === -1) {
    sinEncontrar.push(mlId);
    continue;
  }
  const bloque = texto.slice(inicio, fin);

  // Se ancla en `prioridad:`, que existe en todos y va después del copy en el
  // orden del tipo Producto.
  const anclaRe = /\n(\s*)prioridad:/;
  const ancla = anclaRe.exec(bloque);
  if (!ancla) {
    sinEncontrar.push(mlId);
    continue;
  }
  const sangria = ancla[1];

  // Si ya tenía copy, se saca antes de volver a escribirlo.
  let limpio = bloque
    .replace(/\n\s*por_que:\s*(?:"(?:[^"\\]|\\.)*"|\s*\n?\s*"(?:[^"\\]|\\.)*")\s*,/g, "")
    .replace(/\n\s*como_usar:\s*(?:"(?:[^"\\]|\\.)*"|\s*\n?\s*"(?:[^"\\]|\\.)*")\s*,/g, "");
  if (limpio !== bloque) yaTenian.push(mlId);

  const nuevo = limpio.replace(
    anclaRe,
    `\n${sangria}por_que: ${esc(copy.porQue)},` +
      `\n${sangria}como_usar: ${esc(copy.comoUsar)},` +
      `\n${sangria}prioridad:`,
  );

  texto = texto.slice(0, inicio) + nuevo + texto.slice(fin);
  aplicados.push(mlId);
}

// ── Guardas ─────────────────────────────────────────────────────────────────
const linksDespues = (texto.match(/link_afiliado:\s*"https/g) ?? []).length;
if (linksDespues !== linksAntes) {
  console.error(
    `\n⛔ ABORTA. Los links de afiliado pasaron de ${linksAntes} a ${linksDespues}.\n` +
      `   Este script no debería tocarlos. No se escribió nada.\n`,
  );
  process.exit(1);
}

const conCopy = (texto.match(/\n\s*por_que:/g) ?? []).length;

console.log(`Copy definido para ${Object.keys(COPY_PRODUCTOS).length} productos.`);
console.log(`  aplicados:        ${aplicados.length}`);
console.log(`  ya tenían (se reemplazó): ${yaTenian.length}`);
console.log(`  links intactos:   ${linksDespues}`);
console.log(`  productos con copy tras aplicar: ${conCopy}`);
if (sinEncontrar.length) {
  console.log(`\n  ⚠️  ${sinEncontrar.length} ml_id del copy no están en el catálogo:`);
  for (const id of sinEncontrar) console.log(`      · ${id}`);
  console.log("     (copy escrito para un producto que ya no existe, o cambió de publicación)");
}

// Productos del catálogo que quedaron SIN copy: es el pendiente real.
const todosLosIds = [...texto.matchAll(/ml_id: "([^"]+)"/g)].map((m) => m[1]);
const sinCopy = todosLosIds.filter((id) => !(id in COPY_PRODUCTOS));
if (sinCopy.length) {
  console.log(`\n  ${sinCopy.length} productos del catálogo siguen sin copy:`);
  for (const id of sinCopy) console.log(`      · ${id}`);
}

if (!ESCRIBIR) {
  console.log("\n(simulación — nada se escribió. Agregá --escribir para aplicarlo)");
  process.exit(0);
}

writeFileSync(ARCHIVO, usaCRLF ? texto.replace(/\n/g, "\r\n") : texto, "utf8");
console.log(`\nEscrito: src/niches/skincare/productos.organize.ts`);
