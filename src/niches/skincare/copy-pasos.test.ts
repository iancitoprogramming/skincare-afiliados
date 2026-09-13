// El copy que explica cada paso de la rutina, antes de mostrar el producto.
//
// Es la primera línea que lee alguien en su resultado, y es texto nuestro, no
// de la ficha de un producto: así que pasa por el mismo filtro de claims que el
// copy de producto. Un "repara la barrera" en el título de un paso lo leería
// todo el que termina el quiz.

import { describe, expect, it } from "vitest";
import { copy } from "./copy";
import { TIERS } from "./config";
import { PROHIBIDAS } from "./claims";

describe("el copy de cada paso de la rutina", () => {
  // Si mañana un tier suma un paso, la tarjeta mostraría la forma vieja sin
  // avisar. Mejor que falle acá.
  it("todo paso que sirve un tier explica para qué sirve", () => {
    const categorias = [...new Set(Object.values(TIERS).flat().map((s) => s.categoria))];
    const sinCopy = categorias.filter((c) => !copy.pasos[c]);
    expect(sinCopy).toEqual([]);
  });

  it("no promete lo que un cosmético no puede sostener", () => {
    const problemas: string[] = [];
    for (const [categoria, entrada] of Object.entries(copy.pasos)) {
      for (const [campo, texto] of Object.entries(entrada)) {
        if (typeof texto !== "string") continue;
        for (const [re, motivo] of PROHIBIDAS) {
          if (re.test(texto)) problemas.push(`${categoria}.${campo}: ${motivo}`);
        }
      }
    }
    expect(problemas).toEqual([]);
  });

  // La función es el título de la tarjeta. Si no entra en una línea y media a
  // 375 px, dejó de ser un título y pasó a ser otro párrafo.
  it("la función del paso es corta, porque es un título", () => {
    const largas = Object.entries(copy.pasos)
      .filter(([, e]) => e.funcion.length > 36)
      .map(([c, e]) => `${c}: "${e.funcion}" (${e.funcion.length})`);
    expect(largas).toEqual([]);
  });
});
