// Qué es un link que monetiza y qué no.
//
// Vive acá y no adentro de un script porque lo usan tres: el que audita
// (check-links), el que arma la lista para pedir links nuevos
// (links-pendientes) y el que los aplica de vuelta (links-aplicar). Tres copias
// de esta regla es como se cuela un link que no paga.

export type Veredicto =
  | "afiliado"
  | "placeholder"
  | "browse"
  | "sin_cargar"
  | "vacio"
  | "desconocido";

export const ETIQUETA: Record<Veredicto, string> = {
  afiliado: "OK · link de afiliado",
  placeholder: "PENDIENTE · todavía es el placeholder",
  browse: "NO MONETIZA · URL copiada de la búsqueda de ML",
  sin_cargar: "SIN CARGAR · producto nuevo, todavía sin link",
  vacio: "ROTO · sin link",
  desconocido: "REVISAR · no parece de afiliado",
};

/**
 * Un link del Programa de Afiliados de ML es un shortlink `meli.la`, un
 * `/sec/…`, o trae los parámetros `matt_*`. Cualquier otra cosa no atribuye.
 *
 * El caso peligroso es `browse`: una URL de producto copiada de la búsqueda
 * funciona igual, la persona compra, y no se cobra nada. El tracking que trae
 * es la sesión de búsqueda de ML, no un tag de afiliado, y encima va después
 * del `#`, así que ni siquiera llega al servidor.
 */
export function clasificar(link: string, activo = true): Veredicto {
  // Un producto sin link es "roto" sólo si está publicado. Si todavía está
  // inactivo, es simplemente uno nuevo esperando que le generen el link — y
  // marcar 46 de esos como ROTO hace que la lista se lea como una catástrofe.
  if (!link || !link.trim()) return activo ? "vacio" : "sin_cargar";
  if (link.includes("REEMPLAZAR-LINK-AFILIADO")) return "placeholder";
  if (/^https:\/\/meli\.la\//i.test(link)) return "afiliado";
  if (/mercadolibre\.com(\.ar)?\/sec\//i.test(link)) return "afiliado";
  if (/[?&#]matt_(tool|word)=/i.test(link)) return "afiliado";
  if (/polycard_client|sid=search|[?&#]tracking_id=|[?&#]wid=MLA/i.test(link)) return "browse";
  return "desconocido";
}

export function monetiza(link: string): boolean {
  return clasificar(link) === "afiliado";
}

/** URL de la publicación, para poder abrirla y generar el link de afiliado. */
export function urlPublicacion(mlId: string): string {
  // Los IDs unificados de vendedor van por /up/, los de catálogo por /p/.
  return `https://www.mercadolibre.com.ar/${mlId.startsWith("MLAU") ? "up" : "p"}/${mlId}`;
}
