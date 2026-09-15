import type { StaticImageData } from "next/image";
import serumsSuperpuestos from "@/assets/home/serums-superpuestos.jpg";
import cremaBeige from "@/assets/home/crema-beige.jpg";
import serumsConHojas from "@/assets/home/serums-con-hojas.jpg";
import serumsEnDiscos from "@/assets/home/serums-en-discos.jpg";
import serumsCruzados from "@/assets/home/serums-cruzados.jpg";

// Las fotos de la home y de dónde salen.
//
// Todas son de Unsplash, bajo la Unsplash License: uso comercial sin pedir
// permiso y sin atribución obligatoria. Lo que prohíbe es vender la foto sin
// modificarla y usarla para armar un servicio que compita con Unsplash. Se
// verificó el 15/9/2026 en la página de cada una que fuera "Free Photo" con
// esa licencia y no Unsplash+, que es otra licencia y es paga.
//
// La atribución no es obligatoria, pero va igual al pie: es lo correcto con
// quien sacó la foto, y deja escrito de dónde viene cada imagen.
//
// Por qué estas: la referencia visual es Beauty of Joseon, que usa texturas e
// ingredientes con luz pareja, sin gente. Quedan afuera las fotos con marcas a
// la vista y la iconografía coreana: el catálogo es mayormente europeo, y esa
// estética lo haría parecer otra cosa.
//
// Se bajaron del CDN de Unsplash al ancho que necesita cada lugar (2000 px la
// portada, 1600 la franja, 1200 las puertas); next/image arma el resto de los
// tamaños.

export interface FotoHome {
  imagen: StaticImageData;
  autor: string;
  perfil: string;
  pagina: string;
}

export const FOTOS_HOME = {
  portada: {
    imagen: serumsSuperpuestos,
    autor: "ibnu ihza",
    perfil: "https://unsplash.com/@mahendra_10",
    pagina: "https://unsplash.com/photos/GeG4U-lAF10",
  },
  rutina: {
    imagen: cremaBeige,
    autor: "Kelsey Curtis",
    perfil: "https://unsplash.com/@kelseycurtis",
    pagina: "https://unsplash.com/photos/kD9qprR6HBI",
  },
  catalogo: {
    imagen: serumsConHojas,
    autor: "ibnu ihza",
    perfil: "https://unsplash.com/@mahendra_10",
    pagina: "https://unsplash.com/photos/g6q3lFAe3kA",
  },
  kits: {
    imagen: serumsEnDiscos,
    autor: "ibnu ihza",
    perfil: "https://unsplash.com/@mahendra_10",
    pagina: "https://unsplash.com/photos/QbHwPe1HE84",
  },
  combinaciones: {
    imagen: serumsCruzados,
    autor: "ibnu ihza",
    perfil: "https://unsplash.com/@mahendra_10",
    pagina: "https://unsplash.com/photos/2tcm5faS9ig",
  },
} satisfies Record<string, FotoHome>;

/** Cada autor una vez, en el orden en que aparece su primera foto. */
export const AUTORES_HOME: { autor: string; perfil: string }[] = [
  ...new Map(Object.values(FOTOS_HOME).map((f) => [f.autor, f.perfil])),
].map(([autor, perfil]) => ({ autor, perfil }));
