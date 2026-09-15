// Las tarjetas de la home y las bandas del fondo se reparten el mismo espacio:
// lo que queda entre la marca y las redes. `.presentacion` (home.module.css) lo
// usa para las filas y `.fondo` (FondoMonte.module.css) para las costuras.
//
// Son dos CSS modules que no se pueden leer uno al otro, así que los valores van
// copiados. Este test evita que se separen: si divergen, las tarjetas dejan de
// caer sobre su banda y nada se rompe a la vista hasta que alguien scrollea en un
// celular.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** El CSS sin comentarios: un valor citado en un comentario no es una declaración. */
const leer = (ruta: string) => readFileSync(join(__dirname, ruta), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

const reservas = (css: string) =>
  [...css.matchAll(/(--reserva-(?:arriba|abajo)):\s*([^;]+);/g)].map(([, nombre, valor]) => `${nombre}: ${valor.trim()}`);

const home = leer("../app/home.module.css");
const fondo = leer("FondoMonte.module.css");

describe("la home y su fondo reparten el mismo espacio", () => {
  it("declaran las mismas reservas, en el mismo orden", () => {
    // Base y desktop, que en desktop no reserva abajo porque las redes van al costado.
    expect(reservas(home).length).toBeGreaterThanOrEqual(3);
    expect(reservas(fondo)).toEqual(reservas(home));
  });

  it("las filas y las costuras usan esas reservas", () => {
    expect(home).toMatch(/padding-top:\s*var\(--reserva-arriba\)/);
    expect(home).toMatch(/padding-bottom:\s*var\(--reserva-abajo\)/);
    // Dos costuras, con máscara con y sin prefijo, y dos paradas cada una.
    expect(fondo.match(/var\(--fila\)/g)?.length ?? 0).toBeGreaterThanOrEqual(8);
  });
});
