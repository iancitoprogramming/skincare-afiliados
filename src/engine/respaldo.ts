import type { Producto } from "./recomendacion";

// Qué tan respaldada está una recomendación por gente que no somos nosotros.
//
// La idea es de Ganga Hunter: en vez de mostrar todos los productos como si
// tuvieran el mismo peso, se gradúa la evidencia y se deja filtrar por ella.
//
// Para nosotros el problema es concreto y conocido: los coreanos del catálogo
// casi no tienen opiniones en Mercado Libre —tres tienen exactamente una— y en
// una grilla se ven idénticos a un CeraVe con 3.207. Esconder esa diferencia
// hace que la persona la descubra sola y desconfíe de todo el resto.
//
// La salida no es sacar esos productos: es decirlo. "Está acá por criterio
// nuestro, todavía sin volumen de opiniones" es una afirmación honesta y además
// es el argumento de la marca — recomendamos por criterio, no por popularidad.

export type NivelRespaldo = "muy_probado" | "probado" | "poca_prueba";

export interface UmbralesRespaldo {
  /** Opiniones desde las que se considera masivamente validado. */
  muyProbado: number;
  /** Mínimo de opiniones para que el promedio signifique algo. */
  probado: number;
}

export function respaldoDe(
  p: Pick<Producto, "opiniones" | "rating">,
  u: UmbralesRespaldo,
): NivelRespaldo {
  const op = p.opiniones ?? 0;
  // Sin rating no hay nada que respaldar, por muchas opiniones que figuren.
  if (typeof p.rating !== "number") return "poca_prueba";
  if (op >= u.muyProbado) return "muy_probado";
  if (op >= u.probado) return "probado";
  return "poca_prueba";
}

/** Para ordenar: primero lo más respaldado. */
export const ORDEN_RESPALDO: Record<NivelRespaldo, number> = {
  muy_probado: 2,
  probado: 1,
  poca_prueba: 0,
};
