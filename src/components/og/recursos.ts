import { PALETA } from "@/niches/skincare/paleta";

// Lo que comparten las imágenes de Open Graph: las fuentes del sitio y los
// niveles de tinta.
//
// Satori —el motor de ImageResponse— no usa next/font y sólo lee TTF, OTF o
// WOFF. Las fuentes se piden a la API de Google Fonts con `text`, que devuelve un
// TTF recortado a esos caracteres: es el camino de los ejemplos oficiales de
// Vercel para OG. Se piden una vez por proceso y no una por imagen, con un juego
// de caracteres fijo que cubre el copy y los nombres del catálogo.
//
// Si Google no responde, la imagen se arma igual con la fuente por defecto: una
// imagen para compartir con otra letra es un problema menor; un build roto por
// una fuente, no.

const CARACTERES =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" +
  "¡¿«»·—–‘’“”…®™°ºª×áéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛçÇ";

export interface FuenteOG {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500;
  style: "normal";
}

async function cargar(familia: string, peso: 400 | 500): Promise<FuenteOG | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${familia.replace(/ /g, "+")}:wght@${peso}&text=${encodeURIComponent(CARACTERES)}`)
    ).text();
    const recurso = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!recurso) return null;
    const r = await fetch(recurso[1]);
    if (!r.ok) return null;
    return { name: familia, data: await r.arrayBuffer(), weight: peso, style: "normal" };
  } catch {
    return null;
  }
}

let pedido: Promise<FuenteOG[]> | null = null;

/** Newsreader para los títulos e Instrument Sans para el resto, como en el sitio. */
export function fuentesOG(): Promise<FuenteOG[]> {
  pedido ??= Promise.all([
    cargar("Newsreader", 400),
    cargar("Instrument Sans", 400),
    cargar("Instrument Sans", 500),
  ]).then((fuentes) => fuentes.filter((f): f is FuenteOG => f !== null));
  return pedido;
}

/** Tinta con opacidad: /80 es el apoyo y /70 la nota, igual que en el sitio. */
export function tinta(alfa: 0.8 | 0.7): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(PALETA.tinta.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alfa})`;
}
