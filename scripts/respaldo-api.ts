// Trae `rating` y `opiniones` de Mercado Libre para los productos que no los tienen.
//
//   npm run respaldo-api                simula y lista qué cambiaría
//   npm run respaldo-api -- --escribir  aplica
//
// POR QUÉ ESTE SCRIPT EXISTE
//
// Los productos que vinieron del vault no traen rating ni opiniones, así que su
// ficha queda muda donde otras muestran estrellas. Un Anthelios con 1.998
// opiniones y 4,7 se ve igual que un coreano con una sola.
//
// Es un dato de Mercado Libre, no una calificación nuestra. Desde que la
// popularidad salió del criterio, esto NO cambia qué se recomienda ni en qué
// orden: sólo completa lo que la ficha muestra, atribuido a ML.
//
// DE DÓNDE SALE EL DATO
//
// Dos llamadas por producto: `/products/{ml_id}/items` para conseguir un
// `item_id`, y `/reviews/item/{item_id}` para el promedio y el total. Las
// opiniones son del producto y no del listado —los 9 listados de un mismo
// Anthelios devuelven los mismos 1.998— así que alcanza con el primero.
//
// `sold_quantity` NO se puede: `/items/{id}` responde 403 para items ajenos. O
// sea que `vendidos` se sigue cargando a mano.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import { tokenML, cabeceras } from "../src/lib/ml-api";

const ESCRIBIR = process.argv.includes("--escribir");

const CATALOGOS = [
  "src/niches/skincare/productos.ts",
  "src/niches/skincare/productos.organize.ts",
].map((p) => resolve(process.cwd(), p));

interface Hallazgo {
  ml_id: string;
  etiqueta: string;
  rating: number;
  opiniones: number;
}

async function main() {
  const sinDatos = productos.filter(
    (p) => p.ml_id && (p.rating == null || p.opiniones == null),
  );
  const porApi = sinDatos.filter((p) => !p.ml_id!.startsWith("MLAU"));
  const aMano = sinDatos.filter((p) => p.ml_id!.startsWith("MLAU"));

  console.log(`\n${sinDatos.length} productos sin respaldo cargado · ${porApi.length} por API · ${aMano.length} a mano\n`);
  if (!porApi.length) return;

  const H = cabeceras(await tokenML());
  const hallazgos: Hallazgo[] = [];
  const fallaron: { ml_id: string; etiqueta: string; motivo: string }[] = [];

  for (const p of porApi) {
    const ml_id = p.ml_id!;
    const etiqueta = `${p.marca ?? ""} ${p.nombre}`.trim();
    try {
      const rItems = await fetch(`https://api.mercadolibre.com/products/${ml_id}/items`, { headers: H });
      if (!rItems.ok) {
        fallaron.push({ ml_id, etiqueta, motivo: `/items HTTP ${rItems.status}` });
        continue;
      }
      const items = (await rItems.json()) as { results?: { item_id?: string }[] };
      const itemId = items.results?.[0]?.item_id;
      if (!itemId) {
        fallaron.push({ ml_id, etiqueta, motivo: "el producto no tiene listados" });
        continue;
      }

      const rRev = await fetch(`https://api.mercadolibre.com/reviews/item/${itemId}`, { headers: H });
      if (!rRev.ok) {
        fallaron.push({ ml_id, etiqueta, motivo: `/reviews HTTP ${rRev.status}` });
        continue;
      }
      const rev = (await rRev.json()) as { rating_average?: number; paging?: { total?: number } };
      const rating = rev.rating_average;
      const opiniones = rev.paging?.total;

      // Sin opiniones no hay promedio que valga: se deja el producto como está
      // en vez de escribir un rating de cero opiniones, que miente hacia abajo.
      if (typeof rating !== "number" || typeof opiniones !== "number" || opiniones === 0) {
        fallaron.push({ ml_id, etiqueta, motivo: "todavía sin opiniones en ML" });
        continue;
      }

      hallazgos.push({ ml_id, etiqueta, rating, opiniones });
      console.log(
        `  ${String(opiniones).padStart(5)} op · ${rating.toFixed(1)} ★  ${etiqueta.slice(0, 44)}`,
      );
    } catch (e) {
      fallaron.push({ ml_id, etiqueta, motivo: String((e as Error).message).slice(0, 50) });
    }
  }

  // ── Resumen de lo que cambia ─────────────────────────────────────────────
  console.log(`
${hallazgos.length} productos con rating y opiniones para escribir`);

  if (fallaron.length) {
    console.log(`\nSIN DATO — ${fallaron.length}:`);
    for (const f of fallaron) console.log(`  ${f.ml_id.padEnd(16)} ${f.motivo.padEnd(26)} ${f.etiqueta.slice(0, 34)}`);
  }
  if (aMano.length) {
    console.log(`\nA MANO — ${aMano.length} user-products, la API no los deja leer:`);
    for (const p of aMano) console.log(`  ${p.ml_id}`);
  }

  if (!ESCRIBIR) {
    console.log("\n(simulación — nada se escribió. Agregá --escribir para aplicarlo)\n");
    return;
  }

  // Se escriben dentro del bloque de cada ml_id, después de `nombre`, y sólo si
  // no estaban ya.
  let escritos = 0;
  for (const archivo of CATALOGOS) {
    let s = readFileSync(archivo, "utf8");
    let tocado = false;

    for (const h of hallazgos) {
      const i = s.indexOf(`ml_id: "${h.ml_id}"`);
      if (i === -1) continue;
      const fin = s.indexOf("\n  },", i);
      if (s.slice(i, fin).includes("opiniones:")) continue;
      const finLinea = s.indexOf("\n", i);
      s =
        s.slice(0, finLinea) +
        `\n    rating: ${h.rating},\n    opiniones: ${h.opiniones},` +
        s.slice(finLinea);
      tocado = true;
      escritos++;
    }

    if (tocado) writeFileSync(archivo, s, "utf8");
  }

  console.log(`\n${escritos} producto(s) con respaldo cargado.`);
  console.log("Siguiente: npm run gen-seed && npm run auditar\n");
}

main();
