// El precio en pesos no se publica. Este test es el candado.
//
// La decisión está en `docs/PRECIO.md`: Mercado Libre prohíbe scrapear, la API
// oficial pide OAuth y encima está desmantelando el campo `price` de `/items`,
// así que no hay forma legítima de tener el precio fresco. Y un precio viejo no
// falla de a poco: miente exactamente sobre lo que la persona va a verificar en
// el clic siguiente.
//
// Se testea así —leyendo los archivos— y no con un render, porque lo que hay
// que impedir es que el número VUELVA. Un componente nuevo, una card nueva o un
// merge que reviva una línea vieja pasarían cualquier test de render que no
// supiera de antemano dónde mirar. Ya pasó una vez con el copy del tónico:
// `config.ts` se auto-mergeó sin conflicto y quedó prometiendo un paso que
// ningún tier tenía.

import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { productos } from "../niches/skincare/productos";
import { KITS_UNICOS } from "../niches/skincare/kits";
import { copy } from "../niches/skincare/copy";

const RAIZ = join(__dirname, "..");

function archivos(dir: string, ext: string[]): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return archivos(p, ext);
    return ext.some((e) => n.endsWith(e)) ? [p] : [];
  });
}

/** Quita comentarios de línea y de bloque: el candado es sobre el código. */
const sinComentarios = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("el precio en pesos no llega a la pantalla", () => {
  it("ningún componente lee precio_ars ni precio_lista", () => {
    const culpables = archivos(RAIZ, [".tsx"])
      .filter((p) => /precio_ars|precio_lista/.test(sinComentarios(readFileSync(p, "utf8"))))
      .map((p) => p.slice(RAIZ.length + 1).split(sep).join("/"));
    expect(culpables).toEqual([]);
  });

  it("todo producto y todo kit único declaran su banda, y es 1, 2 o 3", () => {
    const malos = [
      ...productos.map((p) => ({ nombre: p.nombre, r: p.rango_precio })),
      ...KITS_UNICOS.map((k) => ({ nombre: k.nombre, r: k.rango_precio })),
    ].filter((x) => ![1, 2, 3].includes(x.r));
    expect(malos.map((x) => `${x.nombre}: ${x.r}`)).toEqual([]);
  });

  it("hay etiqueta para las tres bandas", () => {
    expect([1, 2, 3].map((r) => copy.precio.rangos[r])).toEqual([
      "accesible",
      "equilibrado",
      "premium",
    ]);
  });
});
