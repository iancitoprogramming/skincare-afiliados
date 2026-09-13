// Tamaños de letra. Tres reglas, cada una con su fuente:
//
//   1. Sólo tamaños con nombre: la escala de Tailwind, más `text-titular`, que se
//      define en theme.css. Con clases sueltas —seis `text-[11px]` y un
//      `text-[0.66rem]`— se llegó a tener texto debajo del piso sin que nadie lo
//      decidiera.
//   2. Nada por debajo de 12 px. Es el umbral de Lighthouse: "Font sizes smaller
//      than 12 px are often difficult to read on mobile devices". Apple fija 11 pt
//      de mínimo, pero para apps nativas; en la web mide Google. Con la regla 1
//      esta se cumple sola mientras theme.css no defina un tamaño con nombre por
//      debajo de `text-xs`, y eso también se chequea.
//   3. Los campos de formulario, desde 16 px y declarado en el campo. Safari en
//      iPhone agranda la página al enfocar un campo con letra más chica. Apple no
//      lo documenta; está reproducido de forma independiente (CSS-Tricks,
//      Defensive CSS, un merge request de GitLab). Tiene que estar declarado porque
//      Tailwind hace que los campos hereden la letra, y lo heredado depende de
//      dónde se monte el componente.
//
// Lo que este test no puede ver es el rol del texto: una instrucción que la
// persona tiene que seguir va desde 14 px aunque sea secundaria. Está escrito en
// 02-MARCA.md.

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(__dirname, "..", "..");
const PISO_REM = 0.75; // 12 px, `text-xs`

function fuentes(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return fuentes(ruta);
    return /\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) ? [ruta] : [];
  });
}

/** Borra los comentarios sin mover las líneas, para que no cuenten como código. */
function sinComentarios(s: string): string {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

// `text-[11px]`, `sm:text-[2.1rem]`. Un color arbitrario (`text-[#fff]`) no es un tamaño.
const TAMANO_ARBITRARIO = /(^|[^\w-])((?:[\w-]+:)*)text-\[((?:\d|\.\d|calc|clamp|min\(|max\(|length:)[^\]]*)\]/g;
const CAMPO = /<(select|textarea|input)\b/g;
const SIN_LETRA = /\btype=["'](checkbox|radio|hidden|range|color|file)["']/;
// Un campo que nadie puede enfocar no dispara el zoom. Es el caso del honeypot del
// email: fuera del tab (`tabIndex={-1}`) y oculto para lectores (`aria-hidden`).
// Tienen que estar las dos, para que un campo visible no se escape con una sola.
const FUERA_DE_ALCANCE = (etiqueta: string) =>
  /tabIndex=\{-1\}/.test(etiqueta) && /aria-hidden=["']true["']/.test(etiqueta);
const LETRA_SUFICIENTE = /(^|[^\w:-])text-(base|lg|xl|[2-9]xl|titular)(?![\w-])/;

/** La etiqueta de apertura entera, con sus props, aunque haya `=>` adentro de una llave. */
function etiquetaDesde(s: string, inicio: number): string {
  let profundidad = 0;
  for (let j = inicio; j < s.length; j++) {
    const c = s[j];
    if (c === "{") profundidad++;
    else if (c === "}") profundidad--;
    else if (c === ">" && profundidad === 0) return s.slice(inicio, j + 1);
  }
  return s.slice(inicio);
}

function revisar(ruta: string, fuente: string): string[] {
  const s = sinComentarios(fuente);
  const linea = (i: number) => s.slice(0, i).split("\n").length;
  const out: string[] = [];

  for (const m of s.matchAll(TAMANO_ARBITRARIO)) {
    const i = (m.index ?? 0) + m[1].length;
    out.push(`${ruta}:${linea(i)} ${m[2]}text-[${m[3]}]: tamaño sin nombre; va uno de la escala o un token de theme.css`);
  }

  for (const m of s.matchAll(CAMPO)) {
    const etiqueta = etiquetaDesde(s, m.index ?? 0);
    if (m[1] === "input" && SIN_LETRA.test(etiqueta)) continue;
    if (FUERA_DE_ALCANCE(etiqueta)) continue;
    if (LETRA_SUFICIENTE.test(etiqueta)) continue;
    out.push(`${ruta}:${linea(m.index ?? 0)} <${m[1]}> sin text-base o más: Safari en iPhone agranda la página al enfocarlo`);
  }

  return out;
}

describe("tipografía", () => {
  it("el escaneo ataja lo que tiene que atajar", () => {
    const casos: [string, number][] = [
      [`<span className="font-etiqueta text-[11px]">`, 1],
      [`<h1 className="text-[2.1rem] sm:text-[3rem]">`, 2],
      [`<select className="font-etiqueta text-xs">`, 1],
      [`<input type="text" aria-hidden="true" className="h-0 w-0" />`, 1],
      [`<input type="email" className="px-4 font-body" />`, 1],
      [`<textarea className="text-sm" />`, 1],
      [`<select value={x} onChange={(e) => set(e.target.value)} className="text-xs">`, 1],
      // Lo permitido no suena.
      [`<span className="text-xs text-[#1b2430]">`, 0],
      [`<select value={x} onChange={(e) => set(e.target.value)} className="font-body text-base">`, 0],
      [`<input type="checkbox" className="h-4 w-4" />`, 0],
      [`<input type="text" name="website" onChange={(e) => set(e)} tabIndex={-1} aria-hidden="true" className="absolute h-0 w-0" />`, 0],
      [`<input className="min-w-0 flex-1 text-base" />`, 0],
      [`<h1 className="text-titular sm:text-5xl">`, 0],
      [`// un comentario que nombra text-[11px] y <select> no es código`, 0],
    ];
    const distintos = casos
      .map(([codigo, esperado]) => ({ codigo, esperado, dio: revisar("caso.tsx", codigo).length }))
      .filter((c) => c.dio !== c.esperado);
    expect(distintos).toEqual([]);
  });

  it("theme.css no define ningún tamaño por debajo de 12 px", () => {
    const css = readFileSync(join(__dirname, "theme.css"), "utf8");
    const tamanos = [...css.matchAll(/--text-([\w-]+):\s*([\d.]+)rem/g)].filter(([, nombre]) => !nombre.includes("--"));
    expect(tamanos.length).toBeGreaterThan(0);
    expect(tamanos.filter(([, , rem]) => Number(rem) < PISO_REM).map(([, nombre, rem]) => `${nombre}: ${rem}rem`)).toEqual([]);
  });

  it("ninguna clase ni ningún campo sale de la regla", () => {
    const archivos = fuentes(SRC);
    // Si la ruta se rompe, el escaneo pasaría sin mirar nada.
    expect(archivos.length).toBeGreaterThan(20);

    const problemas = archivos.flatMap((ruta) =>
      revisar(relative(SRC, ruta).replace(/\\/g, "/"), readFileSync(ruta, "utf8")),
    );
    expect(problemas).toEqual([]);
  });
});
