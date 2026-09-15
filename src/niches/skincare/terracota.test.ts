// Terracota es el color de comprar, y de nada más. Lo decidió el usuario el
// 15/9/2026, al llevar el resto del sitio al lenguaje de la home.
//
// El motivo es de usabilidad, no de gusto. Baymard pide que el botón de compra
// tenga un estilo que ningún otro botón reutilice, y NN/g, reservar el color de
// acento para la acción principal. Un filtro activo, una opción elegida o un
// sello en terracota le sacan al color lo único que tiene que decir.
//
// Por eso las clases con terracota sólo pueden vivir donde se abre una
// publicación de Mercado Libre: BOTON_COMPRA en estilo.ts y el link de cada
// alternativa. Lo que no es comprar va en tinta. Los avisos también: lo que
// avisa es la frase, no el color.

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(__dirname, "..", "..");

/** Los únicos archivos donde el terracota abre una publicación. */
const PERMITIDOS = ["components/estilo.ts", "engine/quiz/Alternativas.tsx"];

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

// Una utilidad de Tailwind con el color, con variantes y opacidad opcionales:
// `bg-terracota`, `hover:text-terracota`, `border-terracota/40`. `PALETA.terracota`
// no es una clase y no suena.
const CLASE_TERRACOTA =
  /(^|[^\w/:-])((?:[\w-]+:)*)((?:bg|text|border(?:-[trblxy])?|decoration|outline|ring|fill|stroke|accent|caret|divide|shadow|from|via|to)-terracota)(?:\/\d+)?(?![\w-])/g;

function usos(ruta: string, fuente: string): string[] {
  const s = sinComentarios(fuente);
  const linea = (i: number) => s.slice(0, i).split("\n").length;
  return [...s.matchAll(CLASE_TERRACOTA)].map(
    (m) => `${ruta}:${linea((m.index ?? 0) + m[1].length)} ${m[2]}${m[3]}`,
  );
}

describe("terracota: sólo para comprar", () => {
  it("el escaneo ataja lo que tiene que atajar", () => {
    const casos: [string, number][] = [
      [`<a className="bg-terracota text-porcelana">`, 1],
      [`<span className="rounded-full bg-terracota px-2">`, 1],
      [`borde: "border-terracota/40",`, 1],
      [`<p className="text-terracota underline decoration-terracota/40">`, 2],
      [`<span className="hover:text-terracota">`, 1],
      // Lo que no es una clase no suena.
      [`const color = PALETA.terracota;`, 0],
      [`// un comentario que nombra bg-terracota no es una clase`, 0],
      [`<p className="text-tinta">`, 0],
    ];
    const distintos = casos
      .map(([codigo, esperado]) => ({ codigo, esperado, dio: usos("caso.tsx", codigo).length }))
      .filter((c) => c.dio !== c.esperado);
    expect(distintos).toEqual([]);
  });

  it("sólo lo usan los lugares que abren una publicación", () => {
    const archivos = fuentes(SRC);
    // Si la ruta se rompe, el escaneo pasaría sin mirar nada.
    expect(archivos.length).toBeGreaterThan(20);

    const todos = archivos.flatMap((ruta) =>
      usos(relative(SRC, ruta).replace(/\\/g, "/"), readFileSync(ruta, "utf8")),
    );
    expect(todos.filter((u) => !PERMITIDOS.some((p) => u.startsWith(`${p}:`)))).toEqual([]);
    // Si BOTON_COMPRA dejara de ser terracota, lo de arriba pasaría sin proteger nada.
    expect(todos.some((u) => u.startsWith("components/estilo.ts:"))).toBe(true);
  });
});
