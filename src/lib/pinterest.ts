import type { Producto } from "../engine/recomendacion";

// Lo que el botón Guardar de cada ficha le pasa a Pinterest.
//
// Pinterest recomienda 2:3 para un pin ("a 2:3 aspect ratio, or 1000 x 1500
// pixels", en sus especificaciones de anuncios), y la imagen para compartir del
// sitio es 1200×630, que es la que usan WhatsApp y Facebook. El botón le ofrece a
// Pinterest otra imagen sin cambiar la que ven las demás redes.
//
// La URL de creación es la misma que arma pinit.js al hacer clic: sin el script
// —bloqueado, o todavía sin cargar— el link abre ese formulario en otra pestaña,
// con la misma imagen y la misma descripción.

export const PIN = { width: 1000, height: 1500 } as const;

/** Pinterest admite hasta 500 caracteres; pinit.js corta ahí. */
export const MAX_DESCRIPCION = 500;

const comparable = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/**
 * El nombre con la marca adelante, salvo que ya la traiga. Los nombres son los
 * títulos de Mercado Libre y muchos la repiten: "Cleanex Free Gel Limpiador".
 */
export function nombreConMarca(p: Pick<Producto, "marca" | "nombre">): string {
  if (!p.marca || comparable(p.nombre).includes(comparable(p.marca))) return p.nombre;
  return `${p.marca} ${p.nombre}`;
}

/** El nombre y el porqué de la ficha, dentro del límite de Pinterest. */
export function descripcionPin(p: Pick<Producto, "marca" | "nombre" | "por_que">): string {
  const texto = [nombreConMarca(p), p.por_que].filter(Boolean).join(". ");
  if (texto.length <= MAX_DESCRIPCION) return texto;
  const corte = texto.slice(0, MAX_DESCRIPCION - 1);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

/**
 * El formulario de creación de pin con la imagen, la página y la descripción.
 * Codifica con encodeURIComponent, como pinit.js: URLSearchParams escribe los
 * espacios como "+", y el parser de pinit.js no los vuelve a espacios.
 */
export function urlGuardarPin({ url, media, descripcion }: { url: string; media: string; descripcion: string }): string {
  const q = (v: string) => encodeURIComponent(v);
  return `https://www.pinterest.com/pin/create/button/?url=${q(url)}&media=${q(media)}&description=${q(descripcion)}`;
}
