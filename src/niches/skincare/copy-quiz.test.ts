// El "por qué esta pregunta" de cada paso del quiz describe lo que el motor
// hace con la respuesta. Pasa por el mismo filtro de claims que el resto del
// copy, y tiene que ser corto: es una línea de contexto debajo de las
// opciones, no otra cosa para leer antes de decidir.

import { describe, expect, it } from "vitest";
import { skincareQuiz } from "./config";
import { copy } from "./copy";
import { PROHIBIDAS } from "./claims";

describe("copy del quiz: por qué esta pregunta", () => {
  it("toda pregunta explica para qué se hace", () => {
    const sin = skincareQuiz.questions.filter((q) => !q.porQue?.trim()).map((q) => q.urlKey);
    expect(sin).toEqual([]);
  });

  it("es una línea, no un párrafo", () => {
    const largos = skincareQuiz.questions
      .filter((q) => (q.porQue?.length ?? 0) > 220)
      .map((q) => `${q.urlKey}: ${q.porQue?.length}`);
    expect(largos).toEqual([]);
  });

  it("no promete lo que el sitio no puede sostener", () => {
    const textos = [
      ...skincareQuiz.questions.map((q) => q.porQue ?? ""),
      copy.ficha.cruce,
      copy.ficha.cruceCta,
    ];
    const problemas: string[] = [];
    for (const texto of textos) {
      for (const [re, motivo] of PROHIBIDAS) {
        if (re.test(texto)) problemas.push(`"${texto.slice(0, 60)}…": ${motivo}`);
      }
    }
    expect(problemas).toEqual([]);
  });
});
