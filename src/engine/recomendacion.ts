// Motor de recomendación. Determinístico, sin IA. No sabe de skincare: recibe el
// catálogo, la lista de slots de la rutina (del nicho) y las respuestas, y devuelve
// la rutina de mañana y de noche. Nunca deja un paso vacío: si no hay match, relaja
// preocupaciones, después tipos de piel, y por último usa el comodín de la categoría.

export type Momento = "am" | "pm" | "ambos";

export interface Producto {
  id: string;
  nombre: string;
  marca?: string;
  categoria: string;
  paso: number;
  momento: Momento;
  tipos_piel: string[];
  preocupaciones: string[];
  rango_precio: number; // 1 | 2 | 3
  precio_ars?: number;
  imagen_url?: string;
  link_afiliado: string;
  por_que?: string;
  como_usar?: string;
  prioridad: number;
  comodin: boolean;
  activo: boolean;
}

export interface RutinaSlot {
  categoria: string;
  momento: Momento;
}

export type NivelFallback = "match" | "sin_preocupacion" | "sin_piel" | "comodin";

export interface PasoRutina {
  slot: RutinaSlot;
  producto: Producto;
  fallback: NivelFallback;
}

export interface RespuestasRutina {
  piel: string;
  objetivo: string;
  presupuesto: number; // 1 | 2 | 3
}

export interface Rutina {
  am: PasoRutina[];
  pm: PasoRutina[];
}

// Un producto de momento "ambos" sirve mañana y noche. Un slot "ambos" (limpiador,
// hidratante) exige un producto usable siempre; un slot "am"/"pm" acepta el suyo o "ambos".
function momentoCompatible(slot: Momento, producto: Momento): boolean {
  if (slot === "ambos") return producto === "ambos";
  return producto === slot || producto === "ambos";
}

// Dentro del presupuesto, el de mayor prioridad; a igualdad, el mejor que se pueda pagar.
function ordenar(a: Producto, b: Producto): number {
  return b.prioridad - a.prioridad || b.rango_precio - a.rango_precio;
}

export function elegirPaso(
  productos: Producto[],
  slot: RutinaSlot,
  r: RespuestasRutina,
): PasoRutina {
  const base = productos.filter(
    (p) =>
      p.activo &&
      p.categoria === slot.categoria &&
      momentoCompatible(slot.momento, p.momento) &&
      p.rango_precio <= r.presupuesto,
  );

  const match = base.filter(
    (p) => p.tipos_piel.includes(r.piel) && p.preocupaciones.includes(r.objetivo),
  );
  if (match.length) return { slot, producto: match.sort(ordenar)[0], fallback: "match" };

  const sinPreoc = base.filter((p) => p.tipos_piel.includes(r.piel));
  if (sinPreoc.length)
    return { slot, producto: sinPreoc.sort(ordenar)[0], fallback: "sin_preocupacion" };

  if (base.length) return { slot, producto: base.sort(ordenar)[0], fallback: "sin_piel" };

  // Último recurso: comodín de la categoría, ignorando presupuesto para no dejar el paso vacío.
  const comodines = productos.filter(
    (p) =>
      p.activo &&
      p.categoria === slot.categoria &&
      p.comodin &&
      momentoCompatible(slot.momento, p.momento),
  );
  if (comodines.length) return { slot, producto: comodines.sort(ordenar)[0], fallback: "comodin" };

  throw new Error(
    `Sin comodín para la categoría "${slot.categoria}" (momento ${slot.momento}). ` +
      `Cargá un producto con comodin=true en esa categoría.`,
  );
}

export function armarRutina(
  productos: Producto[],
  slots: RutinaSlot[],
  r: RespuestasRutina,
): Rutina {
  const pasos = slots.map((slot) => elegirPaso(productos, slot, r));
  return {
    am: pasos.filter((p) => p.slot.momento === "am" || p.slot.momento === "ambos"),
    pm: pasos.filter((p) => p.slot.momento === "pm" || p.slot.momento === "ambos"),
  };
}
