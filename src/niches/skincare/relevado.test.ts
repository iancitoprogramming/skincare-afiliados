// Acá NO hay test de antigüedad. Un test que falle porque pasaron 15 días
// rompe el build sin que nadie haya tocado nada, y se termina desactivando.
// La antigüedad la mide `npm run frescura`, que corre cuando uno decide.
// Estos tests sólo verifican que el dato esté bien formado.

import { describe, expect, it } from "vitest";
import { productos } from "./productos";
import { KITS_UNICOS } from "./kits";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

const conRelevado = [
  ...productos.filter((p) => p.activo).map((p) => ({ nombre: p.nombre, relevado: p.relevado })),
  ...KITS_UNICOS.map((k) => ({ nombre: k.nombre, relevado: k.relevado })),
];

describe("relevado", () => {
  it("todo ítem activo tiene fecha de relevamiento en formato ISO", () => {
    const malos = conRelevado.filter((x) => !ISO.test(x.relevado ?? ""));
    expect(malos.map((x) => x.nombre)).toEqual([]);
  });

  it("ninguna fecha es futura ni imposible", () => {
    const hoy = new Date();
    const malos = conRelevado.filter((x) => {
      const [a, m, d] = x.relevado.split("-").map(Number);
      const f = new Date(a, m - 1, d);
      // Reconstruir y comparar detecta 2026-09-31 o 2026-13-01, que Date
      // acomoda en silencio al mes siguiente en vez de rechazar.
      const valida = f.getFullYear() === a && f.getMonth() === m - 1 && f.getDate() === d;
      return !valida || f.getTime() > hoy.getTime();
    });
    expect(malos.map((x) => `${x.nombre}: ${x.relevado}`)).toEqual([]);
  });
});
