// Qué es un link que monetiza y qué no.
//
// Vive acá y no adentro de un script porque lo usan tres: el que audita
// (check-links), el que arma la lista para pedir links nuevos
// (links-pendientes) y el que los aplica de vuelta (links-aplicar). Tres copias
// de esta regla es como se cuela un link que no paga.

export type Veredicto =
  | "afiliado"
  | "otra_cuenta"
  | "placeholder"
  | "browse"
  | "sin_cargar"
  | "vacio"
  | "desconocido";

export const ETIQUETA: Record<Veredicto, string> = {
  afiliado: "OK · link de afiliado",
  otra_cuenta: "REGENERAR · el link es de la otra cuenta",
  placeholder: "PENDIENTE · todavía es el placeholder",
  browse: "NO MONETIZA · URL copiada de la búsqueda de ML",
  sin_cargar: "SIN CARGAR · producto nuevo, todavía sin link",
  vacio: "ROTO · sin link",
  desconocido: "REVISAR · no parece de afiliado",
};

/**
 * La cuenta desde la que tienen que salir TODOS los links.
 *
 * Soporte del Programa indicó que un mismo proyecto debe operar con una sola
 * cuenta afiliada, porque cada afiliado cobra únicamente por los canales que
 * declaró en su propia cuenta. Con links de dos cuentas sobre un mismo sitio,
 * la mitad de las ventas queda expuesta a no pagarse. El detalle está en
 * `docs/proyecto/07-AFILIADOS.md`.
 *
 * Es una constante y no una variable de entorno a propósito: cambiar de cuenta
 * obliga a regenerar los 73 links a mano, así que no es algo que se configure
 * — es algo que se decide una vez y se ve en el diff.
 */
export const CUENTA_PRINCIPAL = "maurobilat";

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

/**
 * Igual que `clasificar`, pero además exige que el link salga de la cuenta
 * principal.
 *
 * Un link de la otra cuenta monetiza perfectamente — por eso `clasificar` lo da
 * por bueno y por eso el problema es invisible. Lo que falla es más arriba: la
 * comisión se le acredita a una cuenta que no declaró este sitio como Medio.
 *
 * La cuenta la declara `npm run links-aplicar` cuando escribe el link, que es el
 * único momento en que se sabe con certeza de qué panel salió. Antes la resolvía
 * `npm run cuentas` siguiendo el redirect contra Mercado Libre; eso se retiró por
 * la obligación (e) del Programa. Ver `docs/proyecto/07-AFILIADOS.md` §4.
 *
 * Un ítem sin `cuenta` declarada no se marca: no sabemos, y gritar sobre lo que
 * no sabemos entrena a ignorar la lista.
 */
export function clasificarConCuenta(
  link: string,
  activo: boolean,
  cuenta?: string,
): Veredicto {
  const veredicto = clasificar(link, activo);
  if (veredicto !== "afiliado") return veredicto;
  return cuenta && cuenta !== CUENTA_PRINCIPAL ? "otra_cuenta" : veredicto;
}

/** URL de la publicación, para poder abrirla y generar el link de afiliado. */
export function urlPublicacion(mlId: string): string {
  // Los IDs unificados de vendedor van por /up/, los de catálogo por /p/.
  return `https://www.mercadolibre.com.ar/${mlId.startsWith("MLAU") ? "up" : "p"}/${mlId}`;
}
