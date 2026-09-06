import type { Answers, QuizConfig } from "./types";
import type { PasoRutina, Producto, Rutina } from "@/engine/recomendacion";
import { armarRutina } from "@/engine/recomendacion";
import { armarRutinaEvitandoConflictos } from "@/engine/compatibilidad";
import { catalogoActivos } from "@/niches/skincare/activos";

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

/** Clave estable del producto para la capa de activos. */
const clave = (p: PasoRutina) => p.producto.ml_id ?? p.producto.id;

export function resolverRutina(
  config: QuizConfig,
  productos: Producto[],
  answers: Answers,
  opciones: {
    /**
     * Con true (por omisión) el armado elige, dentro del mismo nivel de match,
     * el producto que menos choca con lo ya elegido. Con false usa el motor
     * viejo, que elige cada paso por separado — sirve para medir cuánto aporta
     * el cuidado, que es lo que hace `npm run auditar -- --sin-evitar`.
     */
    evitarConflictos?: boolean;
  } = {},
): RutinaResuelta {
  const evitar = opciones.evitarConflictos ?? true;
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

  const r = { piel, objetivo, presupuesto, origenes };

  return {
    rutina: evitar
      ? armarRutinaEvitandoConflictos(productos, slots, r, catalogoActivos, clave)
      : armarRutina(productos, slots, r),
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
