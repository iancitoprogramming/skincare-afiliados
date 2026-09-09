// Busca, para cada producto atado a un solo vendedor, su equivalente de catálogo.
//
//   npm run listados
//
// EL PROBLEMA
//
// Una entrada del catálogo puede apuntar a dos cosas distintas:
//
//   /p/MLAxxx    página de PRODUCTO. Tiene buy box: los vendedores compiten y
//                Mercado Libre le muestra al comprador el que gana. Nosotros no
//                elegimos, y está bien que no elijamos.
//   /up/MLAUxxx  publicación de UN vendedor. Si ese vendedor está caro, se queda
//                sin stock o baja la publicación, perdemos la venta entera.
//
// La dispersión de precios entre listados del mismo producto es enorme —mediana
// del 96%, máximo 300% medido sobre los activos— así que quedar atado al
// vendedor equivocado no es un detalle.
//
// Y hay un segundo costo: los ml_id `MLAU` son de alcance del vendedor, así que
// la API responde 403 para todo. Son justo los productos a los que no les
// podemos traer ni imagen ni opiniones. Migrarlos a `/p/` arregla las dos cosas
// de una.
//
// POR QUÉ NO LO APLICA SOLO
//
// Dos razones. La búsqueda de catálogo devuelve ruido —para "cerave gel
// limpiador espumoso" el primer resultado es un pack de 2— así que el match lo
// tiene que confirmar una persona. Y cambiar de publicación obliga a regenerar
// el link de afiliado a mano en el panel, que es trabajo de Alex igual.

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import { tokenML, cabeceras } from "../src/lib/ml-api";

interface Candidato {
  id: string;
  nombre: string;
  vendedores: number;
  desde: number | null;
  volumen: string;
}

/** Los términos con los que buscar: marca + nombre, sin la morralla del título de ML. */
function consulta(marca: string | undefined, nombre: string): string {
  return `${marca ?? ""} ${nombre}`
    .replace(/\b\d+\s?(ml|g|gr|grs|gramos)\b/gi, " ") // el tamaño confunde más de lo que ayuda
    .replace(/tipo de piel.*$/i, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 70);
}

/**
 * Cuántos vendedores tiene una ficha de catálogo, y desde qué precio.
 *
 * Es el dato que decide todo. Una ficha de catálogo SIN vendedores es una
 * página donde no se puede comprar: migrar ahí es peor que quedarse atado.
 * Pasó de verdad — los candidatos de Vanicream y del Haruharu Airyfit tienen
 * cero vendedores, porque son marcas importadas que casi nadie lista bajo
 * catálogo. Para esos, la publicación del vendedor no es la opción mala: es la
 * única.
 */
async function listados(id: string, H: Record<string, string>) {
  const r = await fetch(`https://api.mercadolibre.com/products/${id}/items`, { headers: H });
  if (!r.ok) return { vendedores: 0, desde: null as number | null };
  const j = (await r.json()) as { results?: { price?: number }[] };
  const precios = (j.results ?? []).map((x) => x.price).filter((x): x is number => x != null).sort((a, b) => a - b);
  return { vendedores: precios.length, desde: precios[0] ?? null };
}

async function buscar(q: string, H: Record<string, string>): Promise<Candidato[]> {
  const url = `https://api.mercadolibre.com/products/search?status=active&site_id=MLA&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: H });
  if (!r.ok) return [];
  const j = (await r.json()) as { results?: { catalog_product_id?: string; id?: string; name?: string }[] };
  const crudos = (j.results ?? []).slice(0, 5).map((x) => ({ id: x.catalog_product_id ?? x.id ?? "", nombre: x.name ?? "" })).filter((x) => x.id);

  const out: Candidato[] = [];
  for (const c of crudos) {
    const { vendedores, desde } = await listados(c.id, H);
    // El volumen es lo que distingue al producto de su pack de 2 y de la
    // presentación de viaje. Sin eso el match es una corazonada.
    const d = await fetch(`https://api.mercadolibre.com/products/${c.id}`, { headers: H });
    const ficha = d.ok ? ((await d.json()) as { attributes?: { id?: string; value_name?: string }[] }) : {};
    const vol = (ficha.attributes ?? []).find((a) => /VOLUME|CONTENT|WEIGHT/i.test(a.id ?? ""));
    out.push({ ...c, vendedores, desde, volumen: vol?.value_name ?? "?" });
  }
  // Los que no tienen vendedores van al final: no son candidatos de verdad.
  return out.sort((a, b) => b.vendedores - a.vendedores);
}

async function main() {
  const atados = productos.filter(
    (p) => p.activo && (p.ml_id?.startsWith("MLAU") || /\/up\//.test(p.url_referencia ?? "")),
  );
  const libres = productos.filter((p) => p.activo).length - atados.length;

  console.log(`\n${libres} productos apuntan a página de producto: Mercado Libre elige al vendedor.`);
  console.log(`${atados.length} están atados a un solo vendedor.\n`);
  if (!atados.length) return;

  const H = cabeceras(await tokenML());
  const filas: string[] = [];

  for (const p of atados) {
    const q = consulta(p.marca, p.nombre);
    const cands = await buscar(q, H);
    console.log(`  ${p.ml_id}  ${p.nombre.slice(0, 44)}`);
    if (!cands.length) console.log(`      sin candidatos para "${q}"`);
    for (const c of cands)
      console.log(
        `      ${c.id.padEnd(14)} ${c.vendedores ? `${String(c.vendedores).padStart(2)} vend · desde $${Math.round(c.desde!).toLocaleString("es-AR")}`.padEnd(24) : "SIN VENDEDORES".padEnd(24)} ${c.volumen.padEnd(9)} ${c.nombre.slice(0, 44)}`,
      );
    if (cands.length && !cands[0].vendedores)
      console.log(`      → ninguna ficha de catálogo tiene vendedores. Se queda como está.`);

    filas.push(
      `### ${p.nombre}\n\n` +
        `Hoy: \`${p.ml_id}\` · ${p.url_referencia}\n\n` +
        (cands.length
          ? `| candidato | vendedores | desde | tamaño | nombre en ML | abrir |\n|---|---|---|---|---|---|\n` +
            cands
              .map(
                (c) =>
                  `| \`${c.id}\` | ${c.vendedores || "**ninguno**"} | ${c.desde ? "$" + Math.round(c.desde).toLocaleString("es-AR") : "—"} | ${c.volumen} | ${c.nombre.replace(/\|/g, "/")} | [ML](https://www.mercadolibre.com.ar/p/${c.id}) |`,
              )
              .join("\n") +
            (cands[0].vendedores
              ? ""
              : "\n\n_Ninguna ficha de catálogo tiene vendedores: no se puede comprar ahí. Este producto se queda donde está._")
          : `_La búsqueda no devolvió candidatos para «${q}». Hay que buscarlo a mano en ML._`) +
        "\n",
    );
  }

  const destino = resolve(process.cwd(), "docs/listados-atados.md");
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(
    destino,
    [
      "# Productos atados a un solo vendedor",
      "",
      "> Generado por `npm run listados`.",
      "",
      "Estos productos apuntan a la publicación de **un** vendedor (`/up/`) en vez de",
      "a la página de producto (`/p/`), donde los vendedores compiten y Mercado Libre",
      "le muestra al comprador el que gana. Quedar atado cuesta de tres formas: si el",
      "vendedor está caro se pierde la conversión, si se queda sin stock se pierde la",
      "venta entera, y la API no puede leer nada de un `MLAU` — ni imagen ni opiniones.",
      "",
      "**Cómo se resuelve.** Elegí el candidato correcto de cada lista, abrilo para",
      "confirmar que es el mismo producto y el mismo tamaño, generá el link de",
      "afiliado desde esa página y pasámelo. Yo repunto la entrada.",
      "",
      "**Mirá la columna de vendedores antes que nada.** Una ficha de catálogo sin",
      "vendedores es una página donde no se puede comprar: migrar ahí es peor que",
      "quedarse atado. Pasa con las marcas importadas que casi nadie lista bajo",
      "catálogo — Vanicream, Haruharu, CeraVe.",
      "",
      "Y ojo con el ruido: la búsqueda mezcla packs de 2 y presentaciones de viaje.",
      "El tamaño hay que mirarlo.",
      "",
      "---",
      "",
      ...filas,
    ].join("\n"),
    "utf8",
  );
  console.log(`\n→ ${destino}\n`);
}

main();
