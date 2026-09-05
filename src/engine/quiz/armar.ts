import type { Answers, QuizConfig } from "./types";
import type { Producto, Rutina } from "@/engine/recomendacion";
import { armarRutina } from "@/engine/recomendacion";

// Traduce respuestas del quiz a una rutina. Estaba embebido en Resultados.tsx;
// se sacó acá porque la auditoría de combinaciones (`npm run auditar`) tiene que
// recorrer exactamente el mismo camino que la persona. Con la lógica duplicada,
// una auditoría "sin conflictos" no probaría nada sobre lo que ve el usuario.

export interface RutinaResuelta {
  rutina: Rutina;
  /** Tier finalmente aplicado, después del techo por tipo de piel. */
  variante: string;
  /** true si el techo por piel bajó el tier que la persona eligió. */
  bajadaPorTecho: boolean;
  piel: string;
  objetivo: string;
  presupuesto: number;
  origenes: string[];
  /** Categorías que la rama de origen sacó de la rutina. */
  quitadas: string[];
  /** Explicación de la rama, si corresponde. */
  nota?: string;
}

export function resolverRutina(
  config: QuizConfig,
  productos: Producto[],
  answers: Answers,
): RutinaResuelta {
  const rec = config.recomendacion;
  const piel = answers[rec.pielKey];
  const objetivo = answers[rec.objetivoKey];
  const presupuesto = Number(answers[rec.presupuestoKey]);

  // Techo por tipo de piel: piel sensible no pasa de Tier 3 aunque haya elegido
  // Tier 4. Las variantes están ordenadas por número, de menos a más pasos.
  const elegida = answers[rec.rutinaKey] ?? rec.variantePorDefecto ?? "";
  const techo = rec.techoPorPiel?.[piel];
  const bajadaPorTecho = Boolean(techo && Number(elegida) > Number(techo));
  const variante = bajadaPorTecho && techo ? techo : elegida;

  // Rama de procedencia: además de filtrar por origen, puede sacar pasos. Si
  // alguien dijo que no quiere coreanos, meterle un tónico igual sería no haber
  // escuchado la respuesta.
  const rama = rec.rama;
  const respuestaRama = rama ? answers[rama.key] : undefined;
  const origenes = rama && respuestaRama ? (rama.origenes[respuestaRama] ?? []) : [];
  const quitadas = rama && respuestaRama ? (rama.quitarCategorias?.[respuestaRama] ?? []) : [];
  const nota = rama && respuestaRama ? rama.nota?.[respuestaRama] : undefined;

  const slots = (rec.rutinas[variante] ?? []).filter((s) => !quitadas.includes(s.categoria));

  return {
    rutina: armarRutina(productos, slots, { piel, objetivo, presupuesto, origenes }),
    variante,
    bajadaPorTecho,
    piel,
    objetivo,
    presupuesto,
    origenes,
    quitadas,
    nota,
  };
}
