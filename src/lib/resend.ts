import { Resend } from "resend";
import { bienvenidaAsunto, bienvenidaHtml, bienvenidaTexto } from "./emails/bienvenida";
import { copy } from "../niches/skincare/copy";
import { urlDelSitio } from "./sitio";

// Lo que pasa en Resend cuando alguien deja su correo: el contacto entra al
// segmento con el topic en opt-in, recibe el mail de bienvenida —con el link a
// su rutina si vino del resultado— y, si hay NOTIFY_EMAIL, avisa.
//
// Es best-effort a propósito. El lead ya quedó guardado en Supabase antes de
// llegar acá; un error de Resend se registra y no le cambia nada a la persona.
// Sin RESEND_API_KEY no hace nada, como el tracking sin Supabase.
//
// Sólo servidor. La key nunca sale de acá: nada de esto se importa desde un
// componente de cliente.

const FROM = process.env.RESEND_FROM ?? `${copy.marca} <hola@clubdepiel.store>`;
const SEGMENT_ID = process.env.RESEND_SEGMENT_ID;
const TOPIC_ID = process.env.RESEND_TOPIC_ID;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
// Token que Resend reemplaza por el link de baja del contacto. Sólo existe
// cuando el envío lleva topicId; sin topic, el pie va sin link.
const BAJA_URL = TOPIC_ID ? "{{{RESEND_UNSUBSCRIBE_URL}}}" : undefined;

export type Suscripcion = {
  email: string;
  /** De dónde vino: "home" | "resultado". Queda como propiedad del contacto. */
  origen: string;
  /** URL absoluta de la rutina, ya validada por la API. */
  rutinaUrl?: string;
};

// Distinto por (mail, rutina): si la misma persona guarda dos rutinas, recibe
// las dos; si apoya dos veces el botón, recibe una.
function claveIdempotente({ email, rutinaUrl }: Suscripcion): string {
  if (!rutinaUrl) return `bienvenida_${email}`;
  let h = 0;
  for (const c of rutinaUrl) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `rutina_${email}_${h.toString(16)}`;
}

export async function suscribir(s: Suscripcion): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  // Se construye acá y no a nivel de módulo: el constructor tira si la key
  // falta, y a nivel de módulo eso rompía `next build` al recolectar la route.
  const resend = new Resend(key);
  const sitio = urlDelSitio();

  // 1 · El contacto. Si ya existía no es un error para la persona: se sigue,
  //     pero no se le repite la bienvenida cada vez que apoya el botón.
  let yaEstaba = false;
  try {
    const { error } = await resend.contacts.create({
      email: s.email,
      unsubscribed: false,
      properties: { origen: s.origen, sitio: sitio.replace(/^https?:\/\//, "") },
      ...(SEGMENT_ID ? { segments: [{ id: SEGMENT_ID }] } : {}),
      ...(TOPIC_ID ? { topics: [{ id: TOPIC_ID, subscription: "opt_in" as const }] } : {}),
    });
    if (error) {
      const mensaje = `${error.name ?? ""} ${error.message ?? ""}`.toLowerCase();
      yaEstaba = mensaje.includes("exist") || mensaje.includes("duplicate");
      if (!yaEstaba) console.error("[resend] contacts.create", error);
    }
  } catch (err) {
    console.error("[resend] contacts.create tiró", err);
  }

  // 2 · El mail. A los nuevos siempre; a los que ya estaban, sólo si esta vez
  //     traen una rutina, que es lo que la pantalla les prometió.
  if (!yaEstaba || s.rutinaUrl) {
    try {
      const props = { sitio, rutinaUrl: s.rutinaUrl, bajaUrl: BAJA_URL };
      const { error } = await resend.emails.send(
        {
          from: FROM,
          to: [s.email],
          replyTo: FROM.replace(/^.*<|>$/g, ""),
          subject: bienvenidaAsunto(props),
          html: bienvenidaHtml(props),
          text: bienvenidaTexto(props),
          ...(TOPIC_ID ? { topicId: TOPIC_ID } : {}),
          tags: [
            { name: "tipo", value: s.rutinaUrl ? "rutina" : "bienvenida" },
            { name: "origen", value: s.origen.replace(/[^a-zA-Z0-9_-]/g, "_") },
          ],
        },
        { idempotencyKey: claveIdempotente(s) },
      );
      if (error) console.error("[resend] emails.send", error);
    } catch (err) {
      console.error("[resend] emails.send tiró", err);
    }
  }

  // 3 · Aviso interno, sólo de altas nuevas.
  if (NOTIFY_EMAIL && !yaEstaba) {
    try {
      await resend.emails.send({
        from: FROM,
        to: [NOTIFY_EMAIL],
        subject: `Nuevo correo en ${copy.marca}: ${s.email}`,
        text: [`Mail: ${s.email}`, `Origen: ${s.origen}`, s.rutinaUrl ? `Rutina: ${s.rutinaUrl}` : ""].filter(Boolean).join("\n"),
      });
    } catch (err) {
      console.error("[resend] aviso interno tiró", err);
    }
  }
}
