// Resuelve cada link de afiliado a la cuenta que cobra, y reporta el reparto.
//
//   npm run cuentas            sólo reporta
//   npm run cuentas -- --guardar   además escribe `cuenta` en el catálogo
//
// Existe porque un shortlink meli.la no dice a quién le paga: hay que seguir el
// redirect hasta /social/<cuenta>. Sin esto, el reparto entre las dos cuentas es
// invisible, y regenerar un link puede moverlo de una a otra sin que se note.
//
// Ya pasó: 8 productos cambiaron de goldenvalhalla a maurobilat al recargar los
// links, y nadie lo vio hasta contarlos.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import { KITS_UNICOS } from "../src/niches/skincare/kits";

const GUARDAR = process.argv.includes("--guardar");

const CATALOGOS = [
  "src/niches/skincare/productos.ts",
  "src/niches/skincare/productos.organize.ts",
  "src/niches/skincare/kits.ts",
].map((p) => resolve(process.cwd(), p));

/** Sigue el redirect del shortlink hasta el perfil, sin descargar el cuerpo. */
async function cuentaDe(url: string): Promise<string | null> {
  try {
    // Sin User-Agent, meli.la responde distinto y el Location no llega.
    const r = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    const loc = r.headers.get("location") ?? "";
    return /\/social\/([a-z0-9]+)/i.exec(loc)?.[1]?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

interface Item {
  ml_id: string;
  etiqueta: string;
  link: string;
  cuentaGuardada?: string;
}

const items: Item[] = [
  ...productos
    .filter((p) => p.link_afiliado?.includes("meli.la"))
    .map((p) => ({
      ml_id: p.ml_id ?? "",
      etiqueta: `${p.marca ?? ""} ${p.nombre}`.trim(),
      link: p.link_afiliado,
      cuentaGuardada: p.cuenta,
    })),
  ...KITS_UNICOS.filter((k) => k.link_afiliado?.includes("meli.la")).map((k) => ({
    ml_id: k.ml_id,
    etiqueta: `[kit] ${k.marca} ${k.nombre}`,
    link: k.link_afiliado,
    cuentaGuardada: k.cuenta,
  })),
];

async function main() {
  const resueltas = new Map<string, string>();
  const sinResolver: string[] = [];

  for (const it of items) {
    const c = await cuentaDe(it.link);
    if (c) resueltas.set(it.ml_id, c);
    else sinResolver.push(`${it.ml_id} · ${it.etiqueta}`);
  }

  const porCuenta = new Map<string, Item[]>();
  for (const it of items) {
    const c = resueltas.get(it.ml_id);
    if (!c) continue;
    porCuenta.set(c, [...(porCuenta.get(c) ?? []), it]);
  }

  const total = [...porCuenta.values()].reduce((n, xs) => n + xs.length, 0);

  console.log(`\n${items.length} links · ${total} resueltos\n`);
  console.log("REPARTO");
  for (const [c, xs] of [...porCuenta].sort((a, b) => b[1].length - a[1].length)) {
    const pct = Math.round((xs.length / total) * 100);
    console.log(`  ${c.padEnd(18)} ${String(xs.length).padStart(3)}  ${pct}%  ${"█".repeat(Math.round(pct / 3))}`);
  }

  // Con dos cuentas, parejo es la mitad para cada una. La diferencia es cuántos
  // links habría que pasar de la que tiene de más a la que tiene de menos.
  if (porCuenta.size === 2) {
    const [[c1, a], [c2, b]] = [...porCuenta].sort((x, y) => y[1].length - x[1].length);
    const mover = Math.floor((a.length - b.length) / 2);
    console.log(
      mover > 0
        ? `\nPara emparejar: pasar ${mover} link(s) de ${c1} a ${c2}.`
        : "\nEstá parejo.",
    );
  }

  // Cambios respecto de lo guardado en el catálogo: es lo que delata que un link
  // se regeneró en la otra cuenta.
  const cambios = items.filter(
    (it) => it.cuentaGuardada && resueltas.get(it.ml_id) && it.cuentaGuardada !== resueltas.get(it.ml_id),
  );
  if (cambios.length) {
    console.log(`\nCAMBIARON DE CUENTA — ${cambios.length}:`);
    for (const it of cambios)
      console.log(`  ${it.ml_id}  ${it.cuentaGuardada} → ${resueltas.get(it.ml_id)}\n      ${it.etiqueta}`);
  }

  if (sinResolver.length) {
    console.log(`\nNO SE PUDO RESOLVER — ${sinResolver.length}:`);
    for (const s of sinResolver) console.log(`  ${s}`);
  }

  if (GUARDAR) {
    let escritos = 0;
    for (const archivo of CATALOGOS) {
      let s = readFileSync(archivo, "utf8");
      for (const [ml_id, cuenta] of resueltas) {
        const i = s.indexOf(`ml_id: "${ml_id}"`);
        if (i === -1) continue;
        const fin = s.indexOf("\n", i);
        const yaTiene = s.slice(i, s.indexOf("\n  },", i)).includes("cuenta:");
        if (yaTiene) {
          s = s.replace(new RegExp(`(ml_id: "${ml_id}",[\\s\\S]{0,900}?cuenta: ")[a-z0-9]+(")`), `$1${cuenta}$2`);
        } else {
          s = s.slice(0, fin) + `\n    cuenta: "${cuenta}",` + s.slice(fin);
        }
        escritos++;
      }
      writeFileSync(archivo, s, "utf8");
    }
    console.log(`\n${escritos} campo(s) \`cuenta\` escritos en el catálogo.\n`);
  } else {
    console.log("\n(sólo lectura — para escribirlo en el catálogo: npm run cuentas -- --guardar)\n");
  }

}

main();
