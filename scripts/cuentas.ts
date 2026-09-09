// Audita que todos los links de afiliado salgan de la cuenta principal.
//
//   npm run cuentas                 sólo reporta · sale 1 si hay alguno fuera
//   npm run cuentas -- --guardar    además escribe `cuenta` en el catálogo
//
// Existe porque un shortlink meli.la no dice a quién le paga: hay que seguir el
// redirect hasta /social/<cuenta>. Un link de otra cuenta monetiza igual, la
// página funciona igual y nadie lo nota — lo que falla es más arriba, en que la
// comisión se acredita a una cuenta que no declaró este sitio como Medio.
//
// ANTES ESTE SCRIPT MEDÍA OTRA COSA. Reportaba el reparto entre dos cuentas y
// aconsejaba cómo emparejarlas. Esa pregunta murió el 8/9/2026: soporte del
// Programa indicó que un mismo proyecto opera con una sola cuenta afiliada, así
// que no hay reparto que medir, y el consejo viejo —"mover N de una a otra"—
// pasó a ser exactamente al revés de lo que hay que hacer. Ver 07-AFILIADOS.md.
//
// Ya pasó que 8 productos cambiaran de cuenta al recargar los links sin que
// nadie lo viera hasta contarlos; por eso el chequeo sigue existiendo, sólo que
// ahora tiene una respuesta correcta en vez de un reparto deseable.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import { KITS_UNICOS } from "../src/niches/skincare/kits";
import { CUENTA_PRINCIPAL } from "../src/lib/links";

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

  const fuera = items.filter((it) => {
    const c = resueltas.get(it.ml_id);
    return c !== undefined && c !== CUENTA_PRINCIPAL;
  });

  console.log(`
${items.length} links · ${total} resueltos
`);

  if (!fuera.length) {
    console.log(`Los ${total} salen de ${CUENTA_PRINCIPAL}. No hay nada que corregir.`);
  } else {
    console.log(`  ${CUENTA_PRINCIPAL.padEnd(18)} ${String(total - fuera.length).padStart(3)}`);
    for (const [c, xs] of [...porCuenta].filter(([c]) => c !== CUENTA_PRINCIPAL)) {
      console.log(`  ${c.padEnd(18)} ${String(xs.length).padStart(3)}  <- regenerar`);
    }

    console.log(`
FUERA DE ${CUENTA_PRINCIPAL.toUpperCase()} — ${fuera.length}:`);
    for (const it of fuera)
      console.log(`  ${it.ml_id}  paga a ${resueltas.get(it.ml_id)}
      ${it.etiqueta}`);

    console.log(
      `
Se regeneran en el panel de Afiliados de ${CUENTA_PRINCIPAL} y se aplican con:` +
        `
  npm run links-pendientes && npm run links-aplicar`,
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


  // Sale 1 para que sirva de compuerta, igual que check-links. Un link que no
  // se pudo resolver cuenta como problema: no saber a quién le paga es lo mismo
  // que saber que le paga mal.
  if (fuera.length || sinResolver.length) process.exit(1);
}

main();
