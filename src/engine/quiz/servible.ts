import type { QuizConfig } from "./types";
import type { Producto, RutinaSlot } from "@/engine/recomendacion";

// Una variante de rutina (un tier) sólo se puede ofrecer si TODAS sus categorías
// tienen al menos un producto activo. Si no, el motor no tiene con qué llenar el
// paso y revienta.
export function variantesServibles(
  productos: Producto[],
  rutinas: Record<string, RutinaSlot[]>,
): string[] {
  const conStock = new Set(productos.filter((p) => p.activo).map((p) => p.categoria));
  return Object.keys(rutinas).filter((k) =>
    rutinas[k].every((slot) => conStock.has(slot.categoria)),
  );
}

/**
 * Recorta la config a lo que el catálogo puede entregar hoy.
 *
 * Ofrecer un tier sin catálogo no es un detalle estético: el motor levanta
 * excepción y la persona ve una pantalla de error justo después de responder.
 * Mejor mostrar menos opciones que romper.
 *
 * Si queda una sola variante, la pregunta se saca del quiz (una pregunta con una
 * sola respuesta es fricción pura) y esa variante pasa a ser la de por defecto.
 */
export function configServible(config: QuizConfig, productos: Producto[]): QuizConfig {
  const rec = config.recomendacion;
  const servibles = variantesServibles(productos, rec.rutinas);

  // Catálogo vacío o roto: devolvemos la config tal cual y que el error salte en
  // desarrollo, no acá silenciosamente.
  if (servibles.length === 0) return config;

  const rutinas = Object.fromEntries(servibles.map((k) => [k, rec.rutinas[k]]));

  if (servibles.length === 1) {
    return {
      ...config,
      questions: config.questions.filter((q) => q.urlKey !== rec.rutinaKey),
      recomendacion: { ...rec, rutinas, variantePorDefecto: servibles[0] },
    };
  }

  return {
    ...config,
    questions: config.questions.map((q) =>
      q.urlKey === rec.rutinaKey
        ? { ...q, options: q.options.filter((o) => servibles.includes(o.value)) }
        : q,
    ),
    recomendacion: { ...rec, rutinas, variantePorDefecto: servibles[0] },
  };
}
