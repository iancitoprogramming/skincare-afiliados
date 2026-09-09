// Completa las imágenes de docs/relevar-pendientes.md pidiéndoselas a la API de
// Mercado Libre, en vez de copiarlas a mano una por una.
//
//   npm run relevar-api        llena el .md
//   npm run relevar-aplicar    lo escribe en el catálogo, como siempre
//
// POR QUÉ LLENA EL .MD Y NO EL CATÁLOGO DIRECTO
//
// Podría escribir el catálogo de una. No lo hace por dos razones: `relevar-aplicar`
// ya valida cada URL y deriva las dos variantes, y duplicar esa lógica es como
// se cuela una miniatura de 40 píxeles en producción; y deja un paso revisable
// en el medio, con diff, antes de tocar 39 productos de una sentada.
//
// LA TRANSFORMACIÓN DE LA URL, QUE NO ES OPCIONAL
//
// La API devuelve `D_NQ_NP_<id>-F.jpg`: sin `2X` y en jpg. El validador de
// `relevamiento.ts` rechaza cualquier URL sin `_2X_` —lo considera miniatura— y
// trabaja sobre `.webp`. Hay que convertir a `D_NQ_NP_2X_<id>-F.webp`, que es la
// misma foto en alta. No se asume que exista: se le pide antes de escribirla.
//
// LOS QUE NO SE PUEDEN
//
// Los ml_id que empiezan con `MLAU` son user-products, de alcance del vendedor:
// la API responde 403 "caller is not allowed to access this user product".
// Probado también contra /user-products/ y /items/, los tres cerrados. Esos van
// a mano. Hoy son 6 de 45.
//
// EL PRECIO NO VIENE, Y NO HACE FALTA
//
// `buy_box_winner` llega en `null` en todos los productos que probamos. Da igual:
// el sitio publica la banda cualitativa y no el número — ver `docs/PRECIO.md`.
// Este script no toca la columna de precio.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { productos } from "../src/niches/skincare/productos";

const MD = resolve(process.cwd(), "docs/relevar-pendientes.md");

// ── Credenciales ────────────────────────────────────────────────────────────
// tsx no carga .env.local solo, así que se lee a mano. Se acepta también el
// entorno, para que corra igual en un runner donde las variables ya estén.
function credenciales(): { id: string; secret: string } {
  let id = process.env.ML_CLIENT_ID ?? "";
  let secret = process.env.ML_CLIENT_SECRET ?? "";

  const local = resolve(process.cwd(), ".env.local");
  if ((!id || !secret) && existsSync(local)) {
    for (const linea of readFileSync(local, "utf8").split("\n")) {
      const t = linea.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const clave = t.slice(0, i).trim();
      const valor = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (clave === "ML_CLIENT_ID" && !id) id = valor;
      if (clave === "ML_CLIENT_SECRET" && !secret) secret = valor;
    }
  }

  if (!id || !secret) {
    console.error(
      "\nFaltan ML_CLIENT_ID y ML_CLIENT_SECRET.\n" +
        "Van en .env.local, que ya está en .gitignore. Los da\n" +
        "developers.mercadolibre.com.ar en la app registrada.\n",
    );
    process.exit(1);
  }
  return { id, secret };
}

async function token(): Promise<string> {
  const { id, secret } = credenciales();
  const r = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret }),
  });
  const j = (await r.json().catch(() => ({}))) as { access_token?: string; message?: string };
  if (!r.ok || !j.access_token) {
    console.error(`\nNo se pudo obtener el token (HTTP ${r.status}). ${j.message ?? ""}\n`);
    process.exit(1);
  }
  return j.access_token;
}

/** `D_NQ_NP_<id>-F.jpg` de la API → la variante en alta que el validador acepta. */
function enAlta(url: string): string {
  return url.replace(/D_NQ_NP_/, "D_NQ_NP_2X_").replace(/-[A-Z]\.(jpg|jpeg|png|webp)$/i, "-F.webp");
}

/** Que la URL derivada exista de verdad. Escribir una que da 404 es peor que no escribirla. */
async function carga(url: string): Promise<boolean> {
  try {
    // El CDN de ML no acepta HEAD: responde 405. Hay que pedirla entera.
    const r = await fetch(url);
    if (!r.ok) return false;
    const tipo = r.headers.get("content-type") ?? "";
    const bytes = (await r.arrayBuffer()).byteLength;
    return tipo.startsWith("image/") && bytes > 3000;
  } catch {
    return false;
  }
}

async function main() {
  if (!existsSync(MD)) {
    console.error(`\nNo existe ${MD}. Corré primero: npm run relevar-pendientes\n`);
    process.exit(1);
  }

  const sinImagen = productos.filter((p) => !p.imagen_url && p.ml_id);
  const porApi = sinImagen.filter((p) => !p.ml_id!.startsWith("MLAU"));
  const aMano = sinImagen.filter((p) => p.ml_id!.startsWith("MLAU"));

  console.log(`\n${sinImagen.length} productos sin imagen · ${porApi.length} por API · ${aMano.length} a mano (MLAU)\n`);
  if (!porApi.length) {
    console.log("Nada que pedirle a la API.\n");
    return;
  }

  const t = await token();
  const H = { Authorization: `Bearer ${t}`, accept: "application/json" };

  const encontradas = new Map<string, string>();
  const fallaron: { ml_id: string; etiqueta: string; motivo: string }[] = [];

  for (const p of porApi) {
    const ml_id = p.ml_id!;
    const etiqueta = `${p.marca ?? ""} ${p.nombre}`.trim();
    try {
      const r = await fetch(`https://api.mercadolibre.com/products/${ml_id}`, { headers: H });
      if (!r.ok) {
        fallaron.push({ ml_id, etiqueta, motivo: `HTTP ${r.status}` });
        continue;
      }
      const j = (await r.json()) as { pictures?: { url?: string }[] };
      const cruda = j.pictures?.[0]?.url;
      if (!cruda) {
        fallaron.push({ ml_id, etiqueta, motivo: "la respuesta no trae fotos" });
        continue;
      }
      const alta = enAlta(cruda);
      if (!(await carga(alta))) {
        fallaron.push({ ml_id, etiqueta, motivo: "la variante en alta no carga" });
        continue;
      }
      encontradas.set(ml_id, alta);
      console.log(`  ok   ${ml_id.padEnd(15)} ${etiqueta.slice(0, 52)}`);
    } catch (e) {
      fallaron.push({ ml_id, etiqueta, motivo: String((e as Error).message).slice(0, 50) });
    }
  }

  // ── Escribir la columna de imagen en el .md ───────────────────────────────
  // Por celdas y no por regex sobre la fila entera: la tabla se puede reformatear
  // (un editor que alinea las columnas ya la tocó una vez) y el conteo de celdas
  // sobrevive a eso mejor que un patrón con anchos fijos.
  const lineas = readFileSync(MD, "utf8").split("\n");
  let escritas = 0;

  for (let i = 0; i < lineas.length; i++) {
    const m = /^\|\s*`?(MLAU?\d+)`?\s*\|/.exec(lineas[i].trim());
    if (!m) continue;
    const url = encontradas.get(m[1]);
    if (!url) continue;

    const celdas = lineas[i].split("|");
    if (celdas.length < 3) continue;
    const ultima = celdas.length - 2; // la última real: después va el cierre vacío
    if (celdas[ultima].trim()) continue; // ya tenía algo: no se pisa
    celdas[ultima] = ` ${url} `;
    lineas[i] = celdas.join("|");
    escritas++;
  }

  writeFileSync(MD, lineas.join("\n"), "utf8");

  console.log(`\n${escritas} imagen(es) escritas en ${MD}`);
  if (fallaron.length) {
    console.log(`\nNO SE PUDO — ${fallaron.length}:`);
    for (const f of fallaron) console.log(`  ${f.ml_id.padEnd(15)} ${f.motivo}\n      ${f.etiqueta}`);
  }
  if (aMano.length) {
    console.log(`\nA MANO — ${aMano.length} user-products, la API no los deja leer:`);
    for (const p of aMano) console.log(`  ${p.ml_id!.padEnd(15)} ${`${p.marca ?? ""} ${p.nombre}`.trim().slice(0, 52)}`);
  }
  if (escritas) console.log("\nSiguiente: npm run relevar-aplicar\n");
}

main();
