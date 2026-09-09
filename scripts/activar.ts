// Prende los productos que ya están completos.
//
//   npm run activar                    simula y lista
//   npm run activar -- --escribir      aplica
//   npm run activar -- --sin-acidos    sólo los que no suman carga exfoliante
//   npm run activar -- --solo-catalogo prende los que quedan, para vender pero
//                                      no recomendar (`en_rutina: false`)
//
// VENDER SIN RECOMENDAR
//
// El catálogo tiene dos trabajos que no son el mismo: recomendar y vender. Un
// producto que choca con media docena de rutinas no debería entrar al motor,
// pero eso no es razón para esconderlo: si alguien llega buscándolo y lo
// tenemos, se le vende. `--solo-catalogo` prende esos con `en_rutina: false`,
// así aparecen en el catálogo con su página, su foto y su link, y el motor no
// los ve.
//
// LAS TANDAS
//
// Prender los 46 completos de una vez rompe el invariante de compatibilidad:
// aparecen rutinas con un conflicto de severidad "separar", que el proyecto
// garantiza que no existan. Por eso se prende de a tandas, midiendo con
// `npm run auditar` entre una y otra.
//
// El corte natural es la carga exfoliante. El grupo "exfoliante" de activos.ts
// junta AHA, BHA **y retinoides** —los tres suman a la misma cuenta— y es esa
// suma la que dispara pila-exfoliante y retinoide-x-acidos. Un producto que no
// aporta nada a esa cuenta no puede crear ninguno de los dos.
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
import { ACTIVOS, ACTIVOS_POR_PRODUCTO } from "../src/niches/skincare/activos";

const ESCRIBIR = process.argv.includes("--escribir");
const SIN_ACIDOS = process.argv.includes("--sin-acidos");
const SOLO_CATALOGO = process.argv.includes("--solo-catalogo");

/** Cuánto suma un producto a la cuenta exfoliante: AHA + BHA + retinoides. */
function cargaExfoliante(ml_id: string): number {
  const suyos = (ACTIVOS_POR_PRODUCTO as Record<string, string[]>)[ml_id] ?? [];
  return suyos.reduce((n, id) => {
    const a = (ACTIVOS as Record<string, { grupos?: string[]; carga?: number }>)[id];
    return n + (a?.grupos?.includes("exfoliante") ? (a.carga ?? 0) : 0);
  }, 0);
}

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
const postergados: { ml_id: string; etiqueta: string; carga: number }[] = [];

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

  if (falta.length) {
    incompletos.push({ ml_id, etiqueta, falta });
    continue;
  }
  if (!SOLO_CATALOGO && SIN_ACIDOS && cargaExfoliante(ml_id) > 0) {
    postergados.push({ ml_id, etiqueta, carga: cargaExfoliante(ml_id) });
    continue;
  }
  listos.push({ ml_id, etiqueta });
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
    // En modo catálogo el producto se prende PERO se marca fuera de rutinas, en
    // la misma línea: si se escribieran por separado, un producto quedaría
    // prendido y recomendable durante el rato que hay entre las dos escrituras.
    const reemplazo = SOLO_CATALOGO
      ? "en_rutina: false, // se vende, no se recomienda\n    activo: true"
      : "activo: true";
    s = s.slice(0, i + j) + bloque.slice(j).replace("activo: false", reemplazo) + s.slice(fin);
    tocado = true;
    prendidos++;
  }

  if (tocado) writeFileSync(archivo, s, "utf8");
}

console.log(`\n${prendidos} producto(s) prendidos.`);
console.log("Siguiente: npm run auditar && npm run cobertura && npm run gen-seed\n");
