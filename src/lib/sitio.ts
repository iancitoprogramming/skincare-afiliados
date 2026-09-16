// De dónde sale la URL absoluta del sitio.
//
// Importa más de lo que parece: `metadataBase` es lo que arma el og:image. Si
// queda en localhost, la imagen que Pinterest muestra al pinear el link apunta
// a una máquina que nadie puede ver y el preview sale vacío.

/**
 * Normaliza lo que se haya pegado en la variable de entorno: agrega https://
 * si falta y saca la barra final.
 *
 * Sin esto, pegar "clubdepiel.store" hace que new URL() tire y el build falle
 * con un error que no explica nada, y pegar "https://clubdepiel.store/" genera
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
/**
 * La imagen de Open Graph del root, para las rutas que exportan `openGraph`.
 *
 * Next mergea la metadata campo por campo del primer nivel: una ruta que
 * exporta `openGraph: { url: "/catalogo" }` **reemplaza** el openGraph heredado,
 * y con él la imagen que aporta `app/opengraph-image.tsx`. La página queda sin
 * `og:image` y se comparte sin preview.
 *
 * Así se rompió: /catalogo, /kits, /rutina y /combinaciones salieron sin imagen
 * durante todo el tiempo que estuvieron publicadas, y no se nota navegando —
 * sólo cuando alguien pega el link en Pinterest o Facebook. /producto no estaba
 * afectado porque declara su imagen propia, y / tampoco porque el archivo
 * opengraph-image.tsx vive en su mismo segmento.
 *
 * Es la misma clase de error que `base = localhost`: el sitio anda, el preview
 * no. `og.test.ts` falla si alguna ruta vuelve a exportar openGraph sin imagen.
 */
export const OG_POR_DEFECTO = [{ url: "/opengraph-image", width: 1200, height: 630 }];

export function informarMetadata(): void {
  console.log(`[metadata] base = ${urlDelSitio()}`);
  console.log(
    `[metadata] pinterest = ${
      process.env.NEXT_PUBLIC_PINTEREST_VERIFY ? "presente" : "AUSENTE"
    }`,
  );
  // El tag es opcional (ver src/lib/pinterest.ts); se informa para que se vea
  // desde el log si la campaña va a poder medir conversiones o no.
  console.log(
    `[metadata] pinterest tag = ${
      process.env.NEXT_PUBLIC_PINTEREST_TAG_ID ? "presente" : "ausente"
    }`,
  );
}

/**
 * "hace 3 días" / "hoy" a partir de una fecha ISO.
 *
 * Se muestra al lado del precio. Un precio de Mercado Libre sin fecha es una
 * afirmación que no se puede verificar; con fecha, la persona decide cuánto
 * confiar. Es la misma idea que el "PRECIO ACTUALIZADO · HACE 6 H" que usa
 * Ganga Hunter, adaptada a que nosotros relevamos a mano y no cada hora.
 */
export function haceCuanto(iso: string): string {
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return "";
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const dias = Math.round((hoy.getTime() - new Date(a, m - 1, d).getTime()) / 86_400_000);
  if (dias <= 0) return "hoy";
  if (dias === 1) return "ayer";
  if (dias < 30) return `hace ${dias} días`;
  const meses = Math.round(dias / 30);
  return meses === 1 ? "hace un mes" : `hace ${meses} meses`;
}
