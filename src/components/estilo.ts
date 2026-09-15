// Piezas de estilo del sitio que se repiten en varios componentes. La referencia
// es el sitio de Beauty of Joseon: etiquetas en mayúscula chica con aire entre
// letras, botones rectos (uno lleno en tinta y uno de borde fino) y nada de
// sombras ni esquinas redondeadas.
//
// Van como strings y no como componentes porque se aplican a Link, a <a> y a
// <span> por igual. Tailwind los encuentra igual: lee todos los archivos de src/.

/** La etiqueta sin color, para cuando va en otro nivel de tinta. */
export const ETIQUETA_BASE = "font-etiqueta text-xs uppercase tracking-[0.16em]";

/** Etiqueta arriba de un título: "cómo funciona", "78 productos · con filtros". */
export const ETIQUETA = `${ETIQUETA_BASE} text-tinta/70`;

const BOTON =
  "inline-flex min-h-12 items-center justify-center px-7 text-center font-body text-xs font-medium uppercase tracking-[0.16em] transition-colors";

/** La acción principal de una pantalla. Porcelana sobre tinta: 15:1. */
export const BOTON_LLENO = `${BOTON} bg-tinta text-porcelana hover:bg-tinta/90`;

/** Las demás acciones. */
export const BOTON_LINEA = `${BOTON} border border-tinta text-tinta hover:bg-tinta hover:text-porcelana`;

/**
 * El botón de compra: abre la publicación en Mercado Libre. El terracota es sólo
 * para comprar (decisión del 15/9), y que ningún otro botón se le parezca es a
 * propósito: Baymard pide que la compra tenga un estilo propio y NN/g, reservar
 * el color de acento para la acción principal. Tinta llena ya es "Armá tu
 * rutina". Porcelana sobre terracota: 4,96:1. `terracota.test.ts` no deja usar
 * el terracota en otro lado.
 */
export const BOTON_COMPRA =
  "flex min-h-13 w-full items-center justify-center bg-terracota px-5 text-center font-body text-sm font-medium uppercase tracking-[0.14em] text-porcelana";

/**
 * Las fotos de producto de Mercado Libre vienen sobre blanco. En un marco arena
 * y con multiplicar, el blanco toma el color del marco y la foto deja de verse
 * como un recuadro pegado. MARCO_FOTO va en el contenedor, que decide el tamaño;
 * FOTO_PRODUCTO, en la imagen.
 */
export const MARCO_FOTO = "bg-arena";
export const FOTO_PRODUCTO = "h-full w-full object-contain mix-blend-multiply";
