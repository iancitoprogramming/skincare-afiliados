import { armarRutina, type PasoRutina, type Producto, type RutinaSlot } from "./recomendacion";

// Un kit es una rutina pre-resuelta: (tipo de piel + foco + tier) fijos, sin quiz.
// Sirve para el que llega de una red social y quiere comprar sin responder nada.

/**
 * Kit de compra única: UNA publicación de Mercado Libre que ya viene con varios
 * productos adentro. Un link, un checkout, un envío.
 *
 * No pasa por el motor de recomendación: es un producto cerrado que armó otro.
 * Por eso vive acá y no en el catálogo, donde cada fila es un producto suelto
 * que el motor combina.
 */
export interface KitUnico {
  slug: string;
  ml_id: string;
  nombre: string;
  marca: string;
  descripcion: string;
  /** Lo que el título de la publicación declara. Vacío si no lo aclara. */
  incluye: string[];
  piel: string[];
  apto_sensible: boolean;
  /**
   * Precio relevado en Mercado Libre. **No se muestra.** Queda guardado como
   * dato de relevamiento —`npm run frescura` lo usa— pero la UI publica la
   * banda cualitativa, no el número. Ver `docs/PRECIO.md`.
   */
  precio_ars: number;
  /** Precio de lista al momento del relevamiento. Tampoco se muestra: un
   * descuento tachado es lo primero que deja de ser cierto. */
  precio_lista?: number;
  /** Banda de precio, 1 a 3. Es lo que sí se publica. */
  rango_precio: number;
  imagen_url: string;
  /** Proporcion original y mayor resolucion, para piezas de diseno. */
  imagen_hd?: string;
  link_afiliado: string;
  /** Cuenta de afiliado que cobra. Ver `npm run cuentas`. */
  cuenta?: string;
  vendedor?: string;
  mas_vendido?: boolean;
  rating?: number;
  opiniones?: number;
  vendidos?: string;
  vendidos_aprox?: number;
  reputacion?: string;
  /** Fecha del último relevamiento en ML, ISO. Mismo motivo que en Producto. */
  relevado: string;
}

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
  /**
   * Banda de precio del conjunto, 1 a 3. Reemplaza a la suma de precios que
   * había antes.
   *
   * Un total en pesos era el número más frágil del sitio: sumaba el error de
   * cada precio relevado, se mostraba antes de que la persona abriera ninguna
   * publicación, y quedaba viejo con cualquier descuento de cualquiera de los
   * productos. Ver `docs/PRECIO.md`.
   *
   * Se redondea hacia arriba a propósito: un kit donde uno de los pasos es
   * premium se siente premium, aunque los otros dos sean accesibles. Redondear
   * hacia abajo prometería barato y sorprendería en el checkout.
   */
  rango: number;
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
      // En un kit el total se ve de una: a igual match, el más barato.
      preferencia: "precio",
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

  const rangos = pasos.map((p) => p.producto.rango_precio);
  const promedio = rangos.reduce((a, b) => a + b, 0) / (rangos.length || 1);
  return { def, pasos, rango: Math.min(3, Math.max(1, Math.ceil(promedio))) };
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
