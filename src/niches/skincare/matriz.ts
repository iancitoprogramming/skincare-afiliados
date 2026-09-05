import { activoCoincide } from "@/engine/compatibilidad";
import { ACTIVOS, REGLAS, SINERGIAS } from "./activos";

// Deriva la matriz de combinaciones de las MISMAS reglas que usa el motor.
//
// Se podría escribir a mano y quedaría más prolija. No se hace porque una tabla
// escrita a mano, tarde o temprano, dice algo distinto de lo que el sitio hace —
// y una contradicción entre lo que publicás y lo que recomendás cuesta más que
// cualquier detalle de diseño.

export type Marca = "potencia" | "libre" | "separar" | "nunca" | "nota";

export interface Celda {
  marca: Marca;
  /** Título de la regla o sinergia que generó la celda, si hubo una. */
  motivo?: string;
}

/**
 * Los activos que se muestran en la matriz pública. Es un recorte: mostrar los
 * cuarenta del diccionario haría una tabla ilegible, y la mitad no choca con
 * nada. Estos son los que la gente busca.
 */
export const EN_MATRIZ = [
  "retinol",
  "vit_c_laa",
  "vit_c_derivado",
  "niacinamida",
  "bha_salicilico",
  "pha_gluconolactona",
  "peroxido_benzoilo",
  "azelaico",
  "peptidos_cobre",
] as const;

export function celda(idA: string, idB: string): Celda {
  const a = ACTIVOS[idA];
  const b = ACTIVOS[idB];
  if (!a || !b || idA === idB) return { marca: "nota" };

  // Las sinergias ganan: si dos activos se potencian, eso es lo que hay que
  // decir, aunque además compartan alguna regla de tolerancia.
  for (const s of SINERGIAS) {
    if (s.enMatriz === false) continue;
    if (s.requiere.length !== 2) continue;
    const [r1, r2] = s.requiere;
    const cruzado =
      (activoCoincide(r1, a) && activoCoincide(r2, b)) ||
      (activoCoincide(r1, b) && activoCoincide(r2, a));
    if (cruzado) return { marca: "potencia", motivo: s.titulo };
  }

  for (const r of REGLAS) {
    const [e1, e2] = r.entre;
    const cruzado =
      (activoCoincide(e1, a) && activoCoincide(e2, b)) ||
      (activoCoincide(e1, b) && activoCoincide(e2, a));
    if (!cruzado) continue;
    if (r.clase === "degradacion" && r.severidad === "separar") {
      return { marca: "nunca", motivo: r.titulo };
    }
    return { marca: "separar", motivo: r.titulo };
  }

  return { marca: "libre" };
}

export const SIMBOLO: Record<Marca, string> = {
  potencia: "＋",
  libre: "✓",
  separar: "◐",
  nunca: "✕",
  nota: "—",
};

export const LEYENDA: { marca: Marca; texto: string }[] = [
  { marca: "potencia", texto: "se potencian: usalos juntos a propósito" },
  { marca: "libre", texto: "sin problema, en la misma aplicación" },
  { marca: "separar", texto: "separalos por momento del día o por días" },
  { marca: "nunca", texto: "nunca en la misma aplicación: se destruyen" },
];
