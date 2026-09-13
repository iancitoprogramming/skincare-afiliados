// Contraste de texto: WCAG 2.2, criterio 1.4.3, nivel AA. Pide 4,5:1 para texto
// normal. El sitio usa texto de 11 y 12 px en mono, así que el umbral de texto
// grande (3:1) no se aplica en ningún lado.
//
// Tiene dos partes:
//
//   1. La matriz. Con los hex de PALETA calcula que cada combinación que el
//      sistema permite pasa 4,5. Si cambia un color, dice qué regla dejó de valer.
//   2. El escaneo. Recorre las clases de src/ y marca lo que se sale de esas
//      reglas. Es estático: no ve qué fondo queda debajo de cada texto, así que no
//      reemplaza medir la página renderizada. Ataja las regresiones que ya
//      pasaron una vez: texto con opacidad baja, texto de color sobre su propio
//      tinte y tarjetas de gel demasiado cargadas debajo de un CTA terracota.
//
// Las opacidades de Tailwind son alfa: el color se compone en sRGB sobre lo que
// tiene debajo, y así se calcula acá. La medición en el navegador dio los mismos
// valores.
//
// Texto EXIMIDO por 1.4.3: el de un control deshabilitado. Por eso el escaneo
// deja bajar el contraste sólo con la variante `disabled:` (o `group-disabled:`),
// que lo ata a que el control esté deshabilitado de verdad.

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { PALETA, type NombreColor } from "./paleta";

const MINIMO = 4.5;

/** Opacidad mínima del texto en tinta sobre una superficie clara. */
const TINTA_EN_CLARA = 65;
/** Opacidad mínima del texto en tinta sobre una superficie teñida. */
const TINTA_EN_TENIDA = 70;
/** Tope de opacidad del gel para que siga siendo una superficie clara. */
const GEL_TOPE = 35;

type RGB = readonly [number, number, number];

function rgb(hex: string): RGB {
  const canal = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  return [canal(1), canal(3), canal(5)];
}

/** `color` con opacidad `alfa` (0–100), compuesto sobre `debajo`. */
function sobre(color: NombreColor, alfa: number, debajo: RGB): RGB {
  const c = rgb(PALETA[color]);
  const a = alfa / 100;
  const canal = (i: 0 | 1 | 2) => c[i] * a + debajo[i] * (1 - a);
  return [canal(0), canal(1), canal(2)];
}

function luminancia([r, g, b]: RGB): number {
  const lineal = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lineal(r) + 0.7152 * lineal(g) + 0.0722 * lineal(b);
}

function contraste(a: RGB, b: RGB): number {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (oscuro + 0.05);
}

const PORCELANA = rgb(PALETA.porcelana);
const gel = (alfa: number) => sobre("gel", alfa, PORCELANA);

// Superficies claras: de porcelana a gel/35. Acá va cualquier texto de la paleta.
const CLARAS: Record<string, RGB> = Object.fromEntries(
  Array.from({ length: GEL_TOPE / 5 + 1 }, (_, i) => [i === 0 ? "porcelana" : `gel/${i * 5}`, gel(i * 5)]),
);

// Superficies teñidas, cada una sobre la tarjeta en la que vive de verdad. Acá
// el piedra y el terracota ya no pasan: el texto va en tinta.
const TENIDAS: Record<string, RGB> = {
  "chip separar · terracota/15 en tarjeta gel/15": sobre("terracota", 15, gel(15)),
  "chip cuidado · piedra/15 en tarjeta gel/15": sobre("piedra", 15, gel(15)),
  "chip nota · niebla/40 en tarjeta gel/15": sobre("niebla", 40, gel(15)),
  "opción seleccionada · piedra/15 en tarjeta gel/25": sobre("piedra", 15, gel(25)),
  "opción apretada · gel/60 en tarjeta gel/25": sobre("gel", 60, gel(25)),
  "aviso del paso · terracota/5 en tarjeta gel/25": sobre("terracota", 5, gel(25)),
  "chip de reputación · gel sólido": rgb(PALETA.gel),
};

function fallas(fondos: Record<string, RGB>, textos: Record<string, (fondo: RGB) => RGB>): string[] {
  const out: string[] = [];
  for (const [nombreFondo, fondo] of Object.entries(fondos)) {
    for (const [nombreTexto, texto] of Object.entries(textos)) {
      const v = contraste(texto(fondo), fondo);
      if (v < MINIMO) out.push(`${nombreTexto} sobre ${nombreFondo}: ${v.toFixed(2)}:1`);
    }
  }
  return out;
}

describe("contraste: la matriz del sistema", () => {
  it(`sobre las superficies claras pasan tinta desde /${TINTA_EN_CLARA}, piedra, salvia y terracota`, () => {
    expect(
      fallas(CLARAS, {
        [`tinta/${TINTA_EN_CLARA}`]: (f) => sobre("tinta", TINTA_EN_CLARA, f),
        piedra: () => rgb(PALETA.piedra),
        salvia: () => rgb(PALETA.salvia),
        terracota: () => rgb(PALETA.terracota),
      }),
    ).toEqual([]);
  });

  it(`sobre las superficies teñidas pasa tinta desde /${TINTA_EN_TENIDA}`, () => {
    expect(
      fallas(TENIDAS, { [`tinta/${TINTA_EN_TENIDA}`]: (f) => sobre("tinta", TINTA_EN_TENIDA, f) }),
    ).toEqual([]);
  });

  it("porcelana entera pasa sobre terracota sólido, que es el CTA", () => {
    expect(contraste(PORCELANA, rgb(PALETA.terracota))).toBeGreaterThanOrEqual(MINIMO);
  });
});

// ── El escaneo ─────────────────────────────────────────────────────────────────

const SRC = join(__dirname, "..", "..");

function fuentes(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return fuentes(ruta);
    return /\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) ? [ruta] : [];
  });
}

/** Borra los comentarios sin mover las líneas, para que no cuenten como clases. */
function sinComentarios(s: string): string {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const deshabilitado = (variantes: string) => /(^|[\w-]*-)disabled:/.test(variantes);

// Un token de clase: variantes opcionales ("hover:", "group-disabled:") y la utilidad.
const TEXTO_CON_OPACIDAD = /(^|[^\w/:-])((?:[\w-]+:)*)text-(tinta|porcelana|piedra|salvia|terracota)\/(\d+)/g;
const GEL_CON_OPACIDAD = /(^|[^\w/:-])((?:[\w-]+:)*)bg-gel\/(\d+)/g;
const SUPERFICIE_TENIDA = /(^|[^\w/:-])bg-(?:(?:piedra|terracota|niebla|salvia)\/\d+|gel(?![\w/-]))/;
const TEXTO_DE_COLOR = /(^|[^\w/:-])text-(piedra|terracota|salvia)(?![\w/-])/;
const TINTA_CON_OPACIDAD = /(^|[^\w/:-])text-tinta\/(\d+)/g;

function revisar(ruta: string, fuente: string): string[] {
  const s = sinComentarios(fuente);
  const linea = (i: number) => s.slice(0, i).split("\n").length;
  // El match arranca en el carácter anterior a la clase, que puede ser un salto de línea.
  const lineaDe = (m: RegExpMatchArray) => linea((m.index ?? 0) + m[1].length);
  const out: string[] = [];

  for (const m of s.matchAll(TEXTO_CON_OPACIDAD)) {
    const [, , variantes, color, alfa] = m;
    if (deshabilitado(variantes)) continue;
    if (color === "tinta" && Number(alfa) >= TINTA_EN_CLARA) continue;
    const motivo =
      color === "tinta"
        ? `tinta por debajo de /${TINTA_EN_CLARA} no llega a ${MINIMO}:1 ni sobre porcelana`
        : `${color} con opacidad no llega a ${MINIMO}:1; va entero`;
    out.push(`${ruta}:${lineaDe(m)} ${variantes}text-${color}/${alfa}: ${motivo}`);
  }

  for (const m of s.matchAll(GEL_CON_OPACIDAD)) {
    const [, , variantes, alfa] = m;
    if (variantes || Number(alfa) <= GEL_TOPE) continue;
    out.push(
      `${ruta}:${lineaDe(m)} bg-gel/${alfa}: una superficie por encima de gel/${GEL_TOPE} deja al CTA terracota debajo de ${MINIMO}:1`,
    );
  }

  // Texto de color sobre una superficie teñida, dentro de la misma lista de
  // clases. No ve un fondo puesto en el padre y un texto puesto en el hijo: eso
  // lo ve la medición renderizada.
  const literales = [
    ...[...s.matchAll(/"[^"\n]*"/g)].map((m) => ({ texto: m[0], i: m.index ?? 0 })),
    ...[...s.matchAll(/`[^`]*`/g)].map((m) => ({ texto: m[0].replace(/\$\{[^}]*\}/g, " "), i: m.index ?? 0 })),
  ];
  for (const { texto, i } of literales) {
    if (!SUPERFICIE_TENIDA.test(texto)) continue;
    const deColor = texto.match(TEXTO_DE_COLOR);
    const tintaBaja = [...texto.matchAll(TINTA_CON_OPACIDAD)].find(([, , a]) => Number(a) < TINTA_EN_TENIDA);
    if (deColor) {
      out.push(`${ruta}:${linea(i)} text-${deColor[2]} sobre superficie teñida: va en tinta`);
    } else if (tintaBaja) {
      out.push(`${ruta}:${linea(i)} text-tinta/${tintaBaja[2]} sobre superficie teñida: va desde /${TINTA_EN_TENIDA}`);
    }
  }

  return out;
}

describe("contraste: las clases de src/", () => {
  it("el escaneo ataja lo que tiene que atajar", () => {
    const casos: [string, number][] = [
      [`<span className="text-tinta/50">`, 1],
      [`<span className="text-porcelana/70">`, 1],
      [`<span className="text-piedra/80">`, 1],
      [`<div className="rounded-2xl bg-gel/40 p-5">`, 1],
      [`chip: "bg-terracota/15 text-terracota",`, 1],
      [`chip: "bg-niebla/40 text-tinta/65",`, 1],
      [`<p className={\`p-5 \${x ? "bg-piedra/15 text-piedra" : ""}\`}>`, 1],
      // Lo permitido no suena.
      [`<span className="text-tinta/65">`, 0],
      [`<button className="text-tinta disabled:text-tinta/35">`, 0],
      [`<span className="text-piedra group-disabled:text-tinta/35">`, 0],
      [`<button className="hover:bg-gel/40 active:bg-gel/60">`, 0],
      [`chip: "bg-terracota/15 text-tinta",`, 0],
      [`<span className="rounded-full bg-gel text-tinta">`, 0],
      [`// un comentario que nombra text-tinta/35 no es una clase`, 0],
    ];
    const distintos = casos
      .map(([codigo, esperado]) => ({ codigo, esperado, dio: revisar("caso.tsx", codigo).length }))
      .filter((c) => c.dio !== c.esperado);
    expect(distintos).toEqual([]);
  });

  it("ninguna clase sale del sistema", () => {
    const archivos = fuentes(SRC);
    // Si la ruta se rompe, el escaneo pasaría sin mirar nada.
    expect(archivos.length).toBeGreaterThan(20);

    const problemas = archivos.flatMap((ruta) =>
      revisar(relative(SRC, ruta).replace(/\\/g, "/"), readFileSync(ruta, "utf8")),
    );
    expect(problemas).toEqual([]);
  });
});
