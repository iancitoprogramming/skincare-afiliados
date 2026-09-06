// Lee docs/relevar-pendientes.md ya completado y escribe precio e imagen en el
// catálogo.
//
//   npm run relevar-aplicar              · muestra qué haría, sin escribir
//   npm run relevar-aplicar -- --escribir
//
// La otra mitad de `relevar-pendientes`. Se hace con un script y no a mano por
// lo mismo que los links: pegar 45 precios en un archivo de TypeScript es
// exactamente donde se cuela uno en la fila equivocada. Un precio en el producto
// equivocado no se nota — la página funciona igual y el número se ve razonable.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import { normalizarPrecio, normalizarImagen, hoy, MOTIVO } from "../src/lib/relevamiento";

const ESCRIBIR = process.argv.includes("--escribir");
const MD = resolve(process.cwd(), "docs/relevar-pendientes.md");
// Los dos archivos donde puede vivir un producto. `kits.ts` no entra: los kits
// tienen su propio precio y su propia foto, cargados aparte.
const CATALOGOS = [
  resolve(process.cwd(), "src/niches/skincare/productos.ts"),
  resolve(process.cwd(), "src/niches/skincare/productos.organize.ts"),
];

if (!existsSync(MD)) {
  console.error(`No existe ${MD}. Corré primero: npm run relevar-pendientes`);
  process.exit(1);
}

// | `MLA123` | Producto | falta | [ML](…) | 24.693 | https://http2… |
const FILA = /^\|\s*`?(MLAU?\d+)`?\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|\s*$/;

interface Pegado {
  ml_id: string;
  precio?: number;
  imagen?: { url: string; hd: string };
}

const pegados: Pegado[] = [];
const rechazados: { ml_id: string; campo: string; valor: string; motivo: string }[] = [];

for (const linea of readFileSync(MD, "utf8").split("\n")) {
  const m = FILA.exec(linea.trim());
  if (!m) continue;
  const [, ml_id, , , , precioCrudo, imagenCruda] = m;

  const entrada: Pegado = { ml_id };

  const p = precioCrudo.trim();
  if (p) {
    const r = normalizarPrecio(p);
    if ("error" in r) rechazados.push({ ml_id, campo: "precio", valor: p, motivo: MOTIVO[r.error] });
    else entrada.precio = r.precio;
  }

  const i = imagenCruda.trim();
  if (i) {
    const r = normalizarImagen(i);
    if ("error" in r) rechazados.push({ ml_id, campo: "imagen", valor: i.slice(0, 60), motivo: MOTIVO[r.error] });
    else entrada.imagen = r;
  }

  if (entrada.precio !== undefined || entrada.imagen) pegados.push(entrada);
}

// ── Escritura ───────────────────────────────────────────────────────────────
//
// Se inserta cada campo justo después de `url_referencia`, que existe en todos
// los productos. Si el campo ya estaba, se reemplaza en su lugar.

const conocidos = new Set(productos.map((p) => p.ml_id));
const desconocidos = pegados.filter((x) => !conocidos.has(x.ml_id)).map((x) => x.ml_id);

const aplicados: string[] = [];
const archivosTocados = new Map<string, string>();

for (const archivo of CATALOGOS) {
  const original = readFileSync(archivo, "utf8");
  const usaCRLF = original.includes("\r\n");
  let texto = original.replace(/\r\n/g, "\n");
  const linksAntes = (texto.match(/link_afiliado:\s*"https/g) ?? []).length;

  for (const item of pegados) {
    const inicio = texto.indexOf(`ml_id: "${item.ml_id}"`);
    if (inicio === -1) continue;
    const fin = texto.indexOf("\n  },", inicio);
    if (fin === -1) continue;

    let bloque = texto.slice(inicio, fin);
    const sangria = /\n(\s*)url_referencia:/.exec(bloque)?.[1];
    if (!sangria) continue;

    const set = (campo: string, valor: string) => {
      const re = new RegExp(`\\n\\s*${campo}:\\s*(?:"(?:[^"\\\\]|\\\\.)*"|[\\d.]+),`);
      bloque = bloque.replace(re, "");
      bloque = bloque.replace(
        /\n(\s*)url_referencia:/,
        `\n${sangria}${campo}: ${valor},\n$1url_referencia:`,
      );
    };

    if (item.precio !== undefined) set("precio_ars", String(item.precio));
    if (item.imagen) {
      set("imagen_url", JSON.stringify(item.imagen.url));
      set("imagen_hd", JSON.stringify(item.imagen.hd));
    }
    // Si se relevó algo, la fecha de relevamiento se actualiza: es lo que hace
    // que `npm run frescura` sepa qué está viejo.
    set("relevado", JSON.stringify(hoy()));

    texto = texto.slice(0, inicio) + bloque + texto.slice(fin);
    aplicados.push(item.ml_id);
  }

  const linksDespues = (texto.match(/link_afiliado:\s*"https/g) ?? []).length;
  if (linksDespues !== linksAntes) {
    console.error(
      `\n⛔ ABORTA en ${archivo}: los links pasaron de ${linksAntes} a ${linksDespues}.\n` +
        `   Este script no debería tocarlos. No se escribió nada.\n`,
    );
    process.exit(1);
  }
  archivosTocados.set(archivo, usaCRLF ? texto.replace(/\n/g, "\r\n") : texto);
}

// ── Reporte ─────────────────────────────────────────────────────────────────
console.log(`\nFilas con algo pegado: ${pegados.length}`);
console.log(`  aplicados: ${aplicados.length}`);

if (desconocidos.length) {
  console.log(`\n  ⚠️  ${desconocidos.length} ml_id que no están en el catálogo:`);
  for (const d of desconocidos) console.log(`      · ${d}`);
}

if (rechazados.length) {
  console.log(`\n  ⛔ ${rechazados.length} valores rechazados (esas filas no se escribieron):`);
  for (const r of rechazados) {
    console.log(`      · ${r.ml_id} · ${r.campo}: "${r.valor}" — ${r.motivo}`);
  }
}

if (!ESCRIBIR) {
  console.log("\n(simulación — nada se escribió. Agregá --escribir para aplicarlo)\n");
  process.exit(0);
}

for (const [archivo, contenido] of archivosTocados) writeFileSync(archivo, contenido, "utf8");
console.log(`\nEscrito. Corré \`npm run relevar-pendientes\` para ver qué queda.\n`);
