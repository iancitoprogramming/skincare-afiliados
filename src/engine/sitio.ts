// De dónde sale la URL absoluta del sitio.
//
// Importa más de lo que parece: `metadataBase` es lo que arma el og:image. Si
// queda en localhost, la imagen que Pinterest muestra al pinear el link apunta
// a una máquina que nadie puede ver y el preview sale vacío.

/**
 * Normaliza lo que se haya pegado en la variable de entorno: agrega https://
 * si falta y saca la barra final.
 *
 * Sin esto, pegar "clubdepiel.com.ar" hace que new URL() tire y el build falle
 * con un error que no explica nada, y pegar "https://clubdepiel.com.ar/" genera
 * og:image con doble barra. Los dos son errores de copiar y pegar, y los va a
 * cometer alguien apurado en el panel de Vercel.
 */
function normalizar(valor: string): string {
  const conProtocolo = /^https?:\/\//i.test(valor) ? valor : `https://${valor}`;
  return conProtocolo.replace(/\/+$/, "");
}

/**
 * Orden de resolución: dominio propio → dominio estable de Vercel → URL del
 * deploy → local.
 *
 * VERCEL_PROJECT_PRODUCTION_URL y VERCEL_URL no son NEXT_PUBLIC_, así que sólo
 * existen del lado del server. Alcanza: la metadata se genera en el build.
 */
export function urlDelSitio(): string {
  const propio = process.env.NEXT_PUBLIC_SITE_URL;
  if (propio) return normalizar(propio);

  const produccion = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (produccion) return normalizar(produccion);

  const deploy = process.env.VERCEL_URL;
  if (deploy) return normalizar(deploy);

  return "http://localhost:3000";
}

/**
 * Se imprime en el log del build de Vercel. Es la única forma de ver a qué
 * resolvió metadataBase sin tener que abrir la HTML publicada y leerla.
 */
export function informarMetadata(): void {
  console.log(`[metadata] base = ${urlDelSitio()}`);
  console.log(
    `[metadata] pinterest = ${
      process.env.NEXT_PUBLIC_PINTEREST_VERIFY ? "presente" : "AUSENTE"
    }`,
  );
}
