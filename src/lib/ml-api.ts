// Acceso a la API de Mercado Libre.
//
// Vive acá y no adentro de un script por el mismo motivo que `links.ts`: lo usan
// dos —el que trae imágenes y el que trae opiniones— y dos copias de la lectura
// de credenciales es como se termina con uno que busca la variable con otro
// nombre y falla sin decir por qué.
//
// La app se registra en developers.mercadolibre.com.ar. Su nombre no puede
// llevar "mercado", "libre", "pago" ni "envíos": lo restringen los Términos de
// Desarrolladores, y soporte confirmó por escrito que esa restricción alcanza
// sólo al nombre y diseño de la app, no al sitio. Ver `docs/proyecto/07-AFILIADOS.md`.
//
// POR QUÉ LA API Y NO SCRAPEAR
//
// La obligación (e) del Programa de Afiliados prohíbe la extracción automatizada
// de datos, web scraping incluido. La API con credenciales es acceso autorizado
// por otro acuerdo. Es la diferencia entre pedir y agarrar.

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Las credenciales, del entorno o de `.env.local`.
 *
 * `tsx` no carga `.env.local` solo —eso lo hace Next, no el runtime— así que se
 * lee a mano. Se prueba el entorno primero para que el mismo script corra en un
 * runner donde las variables ya estén puestas.
 */
export function credencialesML(): { id: string; secret: string } | null {
  let id = process.env.ML_CLIENT_ID ?? "";
  let secret = process.env.ML_CLIENT_SECRET ?? "";

  const local = resolve(process.cwd(), ".env.local");
  if ((!id || !secret) && existsSync(local)) {
    for (const linea of readFileSync(local, "utf8").split("\n")) {
      const t = linea.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const clave = t.slice(0, i).trim();
      const valor = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (clave === "ML_CLIENT_ID" && !id) id = valor;
      if (clave === "ML_CLIENT_SECRET" && !secret) secret = valor;
    }
  }

  return id && secret ? { id, secret } : null;
}

/**
 * Token de aplicación, sin intervención humana.
 *
 * `client_credentials` alcanza: no hace falta que nadie autorice nada en un
 * browser. Dura 6 horas, y como cada corrida pide el suyo, no hay refresh que
 * guardar ni secreto que rote.
 */
export async function tokenML(): Promise<string> {
  const cred = credencialesML();
  if (!cred) {
    console.error(
      "\nFaltan ML_CLIENT_ID y ML_CLIENT_SECRET.\n" +
        "Van en .env.local, que ya está en .gitignore. Los da\n" +
        "developers.mercadolibre.com.ar en la app registrada.\n",
    );
    process.exit(1);
  }

  const r = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: cred.id,
      client_secret: cred.secret,
    }),
  });
  const j = (await r.json().catch(() => ({}))) as { access_token?: string; message?: string };
  if (!r.ok || !j.access_token) {
    console.error(`\nNo se pudo obtener el token (HTTP ${r.status}). ${j.message ?? ""}\n`);
    process.exit(1);
  }
  return j.access_token;
}

/** Los headers de toda llamada autenticada. */
export function cabeceras(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, accept: "application/json" };
}

/**
 * Qué se puede leer y qué no, verificado el 9/9/2026.
 *
 *   GET /products/{id}            ficha del producto: nombre, fotos, atributos.
 *                                 `buy_box_winner` viene SIEMPRE en null, así
 *                                 que de acá no sale el precio.
 *   GET /products/{id}/items      los listados del producto, con `item_id` y
 *                                 `price`. Acá sí está el precio.
 *   GET /reviews/item/{item_id}   `rating_average` y `paging.total`. Las
 *                                 opiniones son del PRODUCTO, no del listado:
 *                                 los 9 listados de un Anthelios devuelven los
 *                                 mismos 1.998. Alcanza con consultar uno.
 *   GET /items/{item_id}          403. Sólo se leen los items propios, así que
 *                                 `sold_quantity` no está a nuestro alcance.
 *
 * Los ml_id que empiezan con MLAU son user-products y responden 403 en todo:
 * son de alcance del vendedor. Esos hay que cargarlos a mano.
 */
export const ALCANCE_API = "ver el comentario de arriba";
