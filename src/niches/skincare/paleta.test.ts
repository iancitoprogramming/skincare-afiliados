// theme.css lo lee Tailwind; paleta.ts lo leen las imágenes de Open Graph.
// Son dos copias del mismo dato y ya divergieron una vez: el brand kit cambió
// theme.css y la imagen que se comparte siguió con los colores viejos durante
// varios deploys, porque esa imagen no se ve navegando el sitio.
//
// Este test es la única forma de que eso no vuelva a pasar en silencio.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PALETA } from "./paleta";

const css = readFileSync(join(__dirname, "theme.css"), "utf8");

// --color-porcelana: #f4f6f3;
const enCss = new Map<string, string>();
for (const [, nombre, hex] of css.matchAll(/--color-([a-z]+):\s*(#[0-9a-f]{6})/gi)) {
  enCss.set(nombre, hex.toLowerCase());
}

describe("paleta", () => {
  it("theme.css declara exactamente los mismos colores que paleta.ts", () => {
    expect([...enCss.keys()].sort()).toEqual(Object.keys(PALETA).sort());
  });

  it("cada color tiene el mismo valor en los dos lados", () => {
    const distintos = Object.entries(PALETA)
      .filter(([nombre, hex]) => enCss.get(nombre) !== hex.toLowerCase())
      .map(([nombre, hex]) => `${nombre}: paleta.ts ${hex} vs theme.css ${enCss.get(nombre)}`);
    expect(distintos).toEqual([]);
  });
});
