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
  /**
   * Misma foto en proporción original y mayor resolución (variante -F del CDN de
   * ML, hasta 1200px). La cuadrada sirve para las cards; esta es para piezas de
   * diseño, donde el relleno blanco del cuadrado molesta.
   */
  imagen_hd?: string;
  /** Link del Programa de Afiliados. Es el único que monetiza. */
  link_afiliado: string;
  /**
   * Cuenta de afiliado que cobra por este link. Se resuelve siguiendo el
   * redirect del shortlink, con `npm run cuentas -- --guardar`.
   *
   * Guardarlo importa porque un `meli.la` no dice a quién le paga: regenerar un
   * link puede moverlo de una cuenta a la otra sin que se note. Con el campo
   * escrito, el script compara y avisa.
   */
  cuenta?: string;
  /** URL de browse de ML, sólo para identificar el producto al cargar el afiliado. NO monetiza. */
  url_referencia?: string;
  /** ID del producto en Mercado Libre (MLA… / MLAU…). Clave natural para deduplicar. */
  ml_id?: string;
  // ── Prueba social. Relevado de Mercado Libre, se pone viejo solo. ─────────
  /** Promedio de estrellas. Ojo: sin `opiniones` suficientes no significa nada. */
  rating?: number;
  /** Cantidad de opiniones detrás del rating. */
  opiniones?: number;
  /** Etiqueta tal cual la muestra ML: "+10 mil". No es un número exacto. */
  vendidos?: string;
  /** La etiqueta anterior en número, para ordenar y comparar. */
  vendidos_aprox?: number;
  /** "Tienda oficial" | "MercadoLíder". */
  reputacion?: string;
  /**
   * Fecha del último relevamiento en Mercado Libre, ISO 'YYYY-MM-DD'.
   *
   * Obligatoria a propósito: precio, rating, opiniones, ventas y reputación se
   * copiaron una vez y envejecen solos. Sin fecha no hay forma de saber si el
   * número que se está mostrando todavía es cierto. `npm run frescura` la usa.
   */
  relevado: string;

  por_que?: string;
  como_usar?: string;
  prioridad: number;
  comodin: boolean;
  activo: boolean;

  // ── Criterio de orden. Los dos son DERIVADOS: no se cargan a mano. ─────────
  //
  // Los escribe el nicho al armar el catálogo (`conCriteriosDeOrden`), porque
  // los dos necesitan saber de skincare: uno el mapa de activos, el otro los
  // umbrales de opiniones. Son opcionales para que el motor siga andando con un
  // catálogo que no los traiga —tests, un nicho nuevo, una fila vieja de
  // Supabase—: sin ellos el orden es el de antes, sólo que sin esos desempates.

  /** Qué tan bien respaldada está la fórmula. Ver `engine/calidad.ts`. */
  calidad_formula?: number;
  /** Cuánta gente ajena a nosotros la probó, graduada. Ver `engine/respaldo.ts`. */
  respaldo_orden?: number;
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
  /**
   * Procedencias aceptadas. Es una lista porque "no quiero coreano" no es un
   * valor: es todo lo demás. Vacío o ausente = no filtra.
   */
  origenes?: string[];
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

/**
 * El criterio de orden, explícito y en este orden:
 *
 *   1. prioridad          — qué tan buen match es. No la discute nadie.
 *   2. calidad de fórmula — con qué está hecho, según la escala A–D.
 *   3. respaldo           — cuánta gente ajena a nosotros lo probó.
 *   4. precio             — la banda, hacia el lado que diga la preferencia.
 *   5. id                 — para que el orden no dependa del archivo.
 *
 * ANTES ERA prioridad → precio → precio, y ahí estaba el problema. El precio era
 * un proxy de "cuál es mejor": con `preferencia: "mejor"` se agarraba el más caro
 * que entrara en el presupuesto, porque no había con qué medir "mejor". Ahora sí
 * lo hay, y el proxy pasa a ser lo que siempre fue — un dato sobre el bolsillo,
 * no sobre la fórmula. Por eso baja al cuarto lugar.
 *
 * El desempate por `id` no es decoración. Cuando los tres criterios anteriores
 * empatan, `Array.sort` es estable y el que gana termina siendo el que está más
 * arriba en `productos.ts`. Así fue como once productos del catálogo proyectado
 * —el SkinCeuticals C E Ferulic entre ellos— no se le mostraban nunca a nadie:
 * no perdían por peores, perdían porque el archivo los tenía abajo. Un orden
 * arbitrario está bien; un orden arbitrario que además nadie ve, no.
 */
function ordenador(preferencia: RespuestasRutina["preferencia"]) {
  const signo = preferencia === "precio" ? -1 : 1;
  return (a: Producto, b: Producto): number =>
    b.prioridad - a.prioridad ||
    (b.calidad_formula ?? 0) - (a.calidad_formula ?? 0) ||
    (b.respaldo_orden ?? 0) - (a.respaldo_orden ?? 0) ||
    signo * (b.rango_precio - a.rango_precio) ||
    a.id.localeCompare(b.id);
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

/**
 * Todos los candidatos del mejor nivel disponible, sin elegir todavía.
 *
 * Se separa de `mejorDe` porque el armado que evita conflictos necesita ver la
 * lista entera para poder elegir otro del MISMO nivel. Ese matiz es todo el
 * punto: esquivar un choque de activos no puede costar calidad de match. Si
 * alguien pidió algo para las manchas, se le da algo para las manchas; entre
 * los que sirven para las manchas, se prefiere el que no choca.
 */
function candidatosDe(
  pool: Producto[],
  r: RespuestasRutina,
): { productos: Producto[]; fallback: NivelFallback } | null {
  const match = pool.filter(
    (p) => p.tipos_piel.includes(r.piel) && p.preocupaciones.includes(r.objetivo),
  );
  if (match.length) return { productos: match, fallback: "match" };

  const sinPreoc = pool.filter((p) => p.tipos_piel.includes(r.piel));
  if (sinPreoc.length) return { productos: sinPreoc, fallback: "sin_preocupacion" };

  if (pool.length) return { productos: pool, fallback: "sin_piel" };
  return null;
}

// Busca dentro de un conjunto ya filtrado, relajando preocupación y después tipo de piel.
function mejorDe(
  pool: Producto[],
  r: RespuestasRutina,
): { producto: Producto; fallback: NivelFallback } | null {
  const c = candidatosDe(pool, r);
  if (!c) return null;
  return { producto: [...c.productos].sort(ordenador(r.preferencia))[0], fallback: c.fallback };
}

/**
 * La misma cadena de relajación que `elegirPaso`, pero devolviendo el conjunto
 * completo de candidatos empatados en nivel, ya ordenados por el criterio de
 * siempre. El primero es exactamente lo que devolvería `elegirPaso`.
 */
export function candidatosPaso(
  productos: Producto[],
  slot: RutinaSlot,
  r: RespuestasRutina,
): { productos: Producto[]; fallback: NivelFallback } {
  const enCategoria = elegibles(productos, slot);
  const base = enCategoria.filter((p) => p.rango_precio <= r.presupuesto);
  const sensible = r.piel === "sensible";
  const aptos = sensible ? base.filter((p) => p.apto_sensible) : base;
  const ordenar = ordenador(r.preferencia);

  if (r.origenes?.length) {
    const delOrigen = candidatosDe(
      aptos.filter((p) => r.origenes!.includes(p.origen)),
      r,
    );
    if (delOrigen) {
      return { productos: [...delOrigen.productos].sort(ordenar), fallback: delOrigen.fallback };
    }
  }

  const cualquierOrigen = candidatosDe(aptos, r);
  if (cualquierOrigen) {
    return {
      productos: [...cualquierOrigen.productos].sort(ordenar),
      fallback: r.origenes?.length ? "otro_origen" : cualquierOrigen.fallback,
    };
  }

  if (sensible) {
    const igual = candidatosDe(base, r);
    if (igual) {
      return { productos: [...igual.productos].sort(ordenar), fallback: "no_apto_sensible" };
    }
  }

  const comodines = enCategoria.filter((p) => p.comodin);
  if (comodines.length) return { productos: [...comodines].sort(ordenar), fallback: "comodin" };

  throw new Error(
    `Sin comodín para la categoría "${slot.categoria}" (momento ${slot.momento}). ` +
      `Cargá un producto con comodin=true en esa categoría.`,
  );
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
  if (r.origenes?.length) {
    const delOrigen = mejorDe(
      aptos.filter((p) => r.origenes!.includes(p.origen)),
      r,
    );
    if (delOrigen) return { slot, ...delOrigen };
  }

  // 2. Cualquier origen, todavía respetando piel sensible.
  const cualquierOrigen = mejorDe(aptos, r);
  if (cualquierOrigen) {
    // Si había preferencia y terminamos fuera de ella, hay que decirlo en la card.
    const fallback = r.origenes?.length ? "otro_origen" : cualquierOrigen.fallback;
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
