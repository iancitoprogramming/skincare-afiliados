import { armarRutina, type PasoRutina, type Producto, type RutinaSlot } from "./recomendacion";

// Un kit es una rutina pre-resuelta: (tipo de piel + foco + tier) fijos, sin quiz.
// Sirve para el que llega de una red social y quiere comprar sin responder nada.

export interface KitDef {
  slug: string;
  nombre: string;
  descripcion: string;
  piel: string;
  objetivo: string;
  tier: string;
  presupuesto: number;
}

export interface Kit {
  def: KitDef;
  pasos: PasoRutina[];
  /** Suma de precios conocidos. Si algún producto no tiene precio, queda incompleto. */
  total: number;
  totalCompleto: boolean;
}

/**
 * Resuelve un kit contra el catálogo. Devuelve `null` si el tier no es servible,
 * así una definición de kit sin catálogo detrás simplemente no se muestra en vez
 * de romper la página.
 *
 * Los pasos salen deduplicados: un producto de momento "ambos" aparece una sola
 * vez, porque el kit es una lista de compra, no un paso a paso de mañana y noche.
 */
export function armarKit(
  productos: Producto[],
  def: KitDef,
  rutinas: Record<string, RutinaSlot[]>,
): Kit | null {
  const slots = rutinas[def.tier];
  if (!slots) return null;

  const conStock = new Set(productos.filter((p) => p.activo).map((p) => p.categoria));
  if (!slots.every((s) => conStock.has(s.categoria))) return null;

  let rutina;
  try {
    rutina = armarRutina(productos, slots, {
      piel: def.piel,
      objetivo: def.objetivo,
      presupuesto: def.presupuesto,
    });
  } catch {
    return null;
  }

  const vistos = new Set<string>();
  const pasos = [...rutina.am, ...rutina.pm].filter((p) => {
    if (vistos.has(p.producto.id)) return false;
    vistos.add(p.producto.id);
    return true;
  });

  const precios = pasos.map((p) => p.producto.precio_ars);
  return {
    def,
    pasos,
    total: precios.reduce<number>((a, b) => a + (b ?? 0), 0),
    totalCompleto: precios.every((p) => typeof p === "number"),
  };
}

export function armarKits(
  productos: Producto[],
  defs: KitDef[],
  rutinas: Record<string, RutinaSlot[]>,
): Kit[] {
  return defs
    .map((d) => armarKit(productos, d, rutinas))
    .filter((k): k is Kit => k !== null);
}
