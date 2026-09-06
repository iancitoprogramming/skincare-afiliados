// Qué es un precio y una imagen válidos, y cómo se normalizan.
//
// Vive acá, y no adentro de un script, por el mismo motivo que `links.ts`: lo
// usan el que arma la lista para relevar y el que la aplica de vuelta. Dos
// copias de esta regla es como se cuela un precio en dólares o una URL de la
// miniatura de 40 píxeles.

/** Precio máximo razonable para un producto facial en ARS. Sirve de sanity check. */
const PRECIO_MAX = 500_000;
const PRECIO_MIN = 1_000;

export type ErrorRelevamiento =
  | "precio_no_numerico"
  | "precio_fuera_de_rango"
  | "imagen_no_es_ml"
  | "imagen_miniatura";

export const MOTIVO: Record<ErrorRelevamiento, string> = {
  precio_no_numerico: "no se entiende como número",
  precio_fuera_de_rango: `fuera del rango razonable ($${PRECIO_MIN.toLocaleString("es-AR")} a $${PRECIO_MAX.toLocaleString("es-AR")})`,
  imagen_no_es_ml: "no es una URL de imagen de Mercado Libre",
  imagen_miniatura: "es una miniatura: buscá la imagen grande de la publicación",
};

/**
 * Acepta lo que sea que Ian copie y pegue de Mercado Libre: `24.693`, `$24.693`,
 * `24693`, `24.693,00`, `$ 24.693`.
 *
 * El punto en Argentina es separador de miles y la coma es el decimal — al
 * revés que en inglés. Un parser que asuma lo contrario convierte $24.693 en
 * veinticuatro pesos con sesenta y nueve, y eso se ve perfectamente normal en
 * un JSON.
 */
export function normalizarPrecio(crudo: string): { precio: number } | { error: ErrorRelevamiento } {
  const limpio = crudo
    .replace(/\s/g, "")
    .replace(/^\$/, "")
    .replace(/ARS/gi, "")
    .replace(/\.(?=\d{3}\b)/g, "") // puntos de miles
    .replace(/,\d{1,2}$/, ""); // centavos: se descartan, ML no los cobra

  if (!/^\d+$/.test(limpio)) return { error: "precio_no_numerico" };
  const precio = Number(limpio);
  if (precio < PRECIO_MIN || precio > PRECIO_MAX) return { error: "precio_fuera_de_rango" };
  return { precio };
}

/**
 * Valida la URL de imagen y devuelve las dos variantes que usa el catálogo.
 *
 * Mercado Libre sirve la misma foto en varios formatos, y el sufijo importa:
 *   -V.webp  cuadrada, con relleno blanco. Es la de las cards.
 *   -F.webp  proporción original y más resolución. Es la de las piezas de diseño.
 *
 * Como se derivan una de la otra, alcanza con pegar UNA. Pegar las dos es una
 * oportunidad más de equivocarse de fila.
 */
export function normalizarImagen(
  crudo: string,
): { url: string; hd: string } | { error: ErrorRelevamiento } {
  const limpio = crudo.trim().replace(/[<>]/g, "");
  if (!/^https:\/\/\S*mlstatic\.com\//i.test(limpio)) return { error: "imagen_no_es_ml" };

  // Las miniaturas van con sufijos chicos (-I, -O, -S) o sin el 2X.
  if (!/_2X_/.test(limpio)) return { error: "imagen_miniatura" };

  const base = limpio.replace(/-[A-Z]\.webp.*$/i, "");
  const cuadrada = base.replace(/D_NQ_NP_/, "D_Q_NP_");
  const original = base.replace(/D_Q_NP_/, "D_NQ_NP_");
  return { url: `${cuadrada}-V.webp`, hd: `${original}-F.webp` };
}

/** La fecha de hoy en el formato que usa el campo `relevado`. */
export function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}
