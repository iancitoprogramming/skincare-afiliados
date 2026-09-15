// Piezas de estilo de la home y sus secciones, que se repiten en varios
// componentes. La referencia es el sitio de Beauty of Joseon: etiquetas en
// mayúscula chica con aire entre letras, botones rectos (uno lleno en tinta y
// uno de borde fino) y nada de sombras ni esquinas redondeadas.
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
