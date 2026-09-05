// Motor de recomendación. Determinístico, sin IA. No sabe de skincare: recibe el
// catálogo, la lista de slots de la rutina (del nicho) y las respuestas, y devuelve
// la rutina de mañana y de noche. Nunca deja un paso vacío: si no hay match, relaja
// preocupaciones, después tipos de piel, después el origen, y por último usa el
// comodín de la categoría.
//
// La categoría y el momento del slot no se relajan nunca: sin eso la rutina deja
// de tener sentido. `apto_sensible` es lo último que se relaja, y cuando pasa el
// paso queda marcado para que la card lo diga en vez de callarlo.

export type Momento = "am" | "pm" | "ambos";
export type Frecuencia = "diario" | "no_diario";

export interface Producto {
  id: string;
  nombre: string;
  marca?: string;
  categoria: string;
  paso: number;
  momento: Momento;
  tipos_piel: string[];
  preocupaciones: string[];
  /** Procedencia comercial: "coreano" | "europeo" | "nacional". Es preferencia, se relaja. */
  origen: string;
  /** Si es falso, nunca se le ofrece a piel sensible. No se relaja. */
  apto_sensible: boolean;
  rango_precio: number; // 1 | 2 | 3
  precio_ars?: number;
  imagen_url?: string;
  /** Link del Programa de Afiliados. Es el único que monetiza. */
  link_afiliado: string;
  /** URL de browse de ML, sólo para identificar el producto al cargar el afiliado. NO monetiza. */
  url_referencia?: string;
  /** ID del producto en Mercado Libre (MLA… / MLAU…). Clave natural para deduplicar. */
  ml_id?: string;
  por_que?: string;
  como_usar?: string;
  prioridad: number;
  comodin: boolean;
  activo: boolean;
}

export interface RutinaSlot {
  categoria: string;
  momento: Momento;
  /** "no_diario" = exfoliante, retinoide. La UI lo muestra aparte del paso a paso. */
  frecuencia?: Frecuencia;
}

export type NivelFallback =
  | "match"
  | "sin_preocupacion"
  | "sin_piel"
  | "otro_origen"
  | "no_apto_sensible"
  | "comodin";

export interface PasoRutina {
  slot: RutinaSlot;
  producto: Producto;
  fallback: NivelFallback;
}

export interface RespuestasRutina {
  piel: string;
  objetivo: string;
  presupuesto: number; // 1 | 2 | 3
  /** Preferencia de procedencia. Si viene vacío, no filtra. */
  origen?: string;
  /**
   * A igualdad de prioridad, con qué criterio se desempata.
   * - "mejor" (default): el más caro que entre en el presupuesto. Es lo que
   *   quiere alguien que ya eligió cuánto gastar.
   * - "precio": el más barato. Es lo que conviene en un kit, donde el total
   *   se ve de una y un número alto espanta antes de leer nada.
   */
  preferencia?: "mejor" | "precio";
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

// Siempre gana la prioridad (qué tan buen match es). El desempate es por precio,
// y hacia qué lado lo define la preferencia.
function ordenador(preferencia: RespuestasRutina["preferencia"]) {
  const signo = preferencia === "precio" ? -1 : 1;
  return (a: Producto, b: Producto): number =>
    b.prioridad - a.prioridad ||
    signo * (b.rango_precio - a.rango_precio) ||
    signo * ((b.precio_ars ?? 0) - (a.precio_ars ?? 0));
}

// Filtro duro: categoría y momento. Nunca se relaja.
function elegibles(productos: Producto[], slot: RutinaSlot): Producto[] {
  return productos.filter(
    (p) =>
      p.activo &&
      p.categoria === slot.categoria &&
      momentoCompatible(slot.momento, p.momento),
  );
}

// Busca dentro de un conjunto ya filtrado, relajando preocupación y después tipo de piel.
function mejorDe(
  pool: Producto[],
  r: RespuestasRutina,
): { producto: Producto; fallback: NivelFallback } | null {
  const ordenar = ordenador(r.preferencia);

  const match = pool.filter(
    (p) => p.tipos_piel.includes(r.piel) && p.preocupaciones.includes(r.objetivo),
  );
  if (match.length) return { producto: match.sort(ordenar)[0], fallback: "match" };

  const sinPreoc = pool.filter((p) => p.tipos_piel.includes(r.piel));
  if (sinPreoc.length)
    return { producto: sinPreoc.sort(ordenar)[0], fallback: "sin_preocupacion" };

  if (pool.length) return { producto: pool.sort(ordenar)[0], fallback: "sin_piel" };
  return null;
}

export function elegirPaso(
  productos: Producto[],
  slot: RutinaSlot,
  r: RespuestasRutina,
): PasoRutina {
  const enCategoria = elegibles(productos, slot);
  const base = enCategoria.filter((p) => p.rango_precio <= r.presupuesto);
  const sensible = r.piel === "sensible";
  const aptos = sensible ? base.filter((p) => p.apto_sensible) : base;

  // 1. Con la preferencia de origen puesta. Se agota acá antes de cambiar de origen:
  // si alguien pidió coreano, es mejor darle un coreano que no matchea la preocupación
  // que un europeo que sí. El origen fue una elección explícita.
  if (r.origen) {
    const delOrigen = mejorDe(
      aptos.filter((p) => p.origen === r.origen),
      r,
    );
    if (delOrigen) return { slot, ...delOrigen };
  }

  // 2. Cualquier origen, todavía respetando piel sensible.
  const cualquierOrigen = mejorDe(aptos, r);
  if (cualquierOrigen) {
    // Si había preferencia y terminamos fuera de ella, hay que decirlo en la card.
    const fallback = r.origen ? "otro_origen" : cualquierOrigen.fallback;
    return { slot, producto: cualquierOrigen.producto, fallback };
  }

  // 3. Piel sensible sin ningún producto apto en esta categoría. Es un hueco real
  // del catálogo (típico: falta un protector solar mineral). Damos el mejor que hay
  // pero marcado, para que la UI lo aclare en vez de venderlo como apto.
  if (sensible) {
    const igual = mejorDe(base, r);
    if (igual) return { slot, producto: igual.producto, fallback: "no_apto_sensible" };
  }

  // 4. Último recurso: comodín de la categoría, ignorando presupuesto y origen para
  // no dejar el paso vacío.
  const comodines = enCategoria.filter((p) => p.comodin);
  if (comodines.length)
    return { slot, producto: comodines.sort(ordenador(r.preferencia))[0], fallback: "comodin" };

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
