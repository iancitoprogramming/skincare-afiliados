// El copy de la home —portada, puertas, franja, cómo funciona, preguntas y la
// captura de mail— pasa por el mismo filtro de claims que el copy de producto y
// el de los pasos. Es de lo primero que lee alguien que llega desconfiando, y un
// "garantiza" o un "trata" ahí lo lee cualquiera.

import { describe, expect, it } from "vitest";
import { copy } from "./copy";
import { PROHIBIDAS } from "./claims";

/** Todos los textos de un objeto de copy, incluidos los que se arman con un número. */
function textos(valor: unknown): string[] {
  if (typeof valor === "string") return [valor];
  if (typeof valor === "function") return textos((valor as (n: number) => unknown)(5));
  if (Array.isArray(valor)) return valor.flatMap(textos);
  if (valor && typeof valor === "object") return Object.values(valor).flatMap(textos);
  return [];
}

describe("copy de la home: cómo funciona y preguntas", () => {
  it("no promete lo que el sitio no puede sostener", () => {
    const problemas: string[] = [];
    const home = {
      aviso: copy.home.aviso,
      portada: copy.home.portada,
      puertas: copy.home.puertas,
      franja: copy.home.franja,
      metodo: copy.home.metodo,
      preguntas: copy.home.preguntas,
      correo: copy.correo,
    };
    for (const texto of textos(home)) {
      for (const [re, motivo] of PROHIBIDAS) {
        if (re.test(texto)) problemas.push(`"${texto.slice(0, 60)}…": ${motivo}`);
      }
    }
    expect(problemas).toEqual([]);
  });

  it("el método son tres pasos", () => {
    expect(copy.home.metodo.pasos).toHaveLength(3);
  });

  // Una lista de preguntas larga deja de ser "antes de empezar" y pasa a ser una
  // página de ayuda. Si hace falta una sexta, probablemente sobra otra.
  it("las preguntas son pocas y cada una es una pregunta", () => {
    const items = copy.home.preguntas.items;
    expect(items.length).toBeLessThanOrEqual(5);
    expect(items.filter((i) => !i.pregunta.trim().endsWith("?")).map((i) => i.pregunta)).toEqual([]);
  });
});
