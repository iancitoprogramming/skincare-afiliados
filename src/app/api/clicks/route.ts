import { type NextRequest } from "next/server";
import { serverClient } from "@/engine/supabase";

// Destino del sendBeacon: registra el clic a Mercado Libre. Responde vacío y rápido.
export async function POST(req: NextRequest) {
  let body: {
    sesion_id?: string | null;
    producto_id?: string;
    posicion?: number;
    utm?: unknown;
    pagina?: unknown;
    referrer?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (!body.producto_id) return new Response(null, { status: 400 });

  const supabase = serverClient();
  if (supabase) {
    // La entrada de la visita (ver tracking.ts): es lo que permite atribuir a una
    // pieza un clic que no pasó por el quiz. Se recorta, porque viene del cliente.
    const { error } = await supabase.from("clicks").insert({
      sesion_id: body.sesion_id ?? null,
      producto_id: body.producto_id,
      posicion: body.posicion ?? null,
      utm: utmValido(body.utm),
      pagina: textoCorto(body.pagina),
      referrer: textoCorto(body.referrer),
    });
    // sendBeacon no lee la respuesta, así que este 500 no le cambia nada a la
    // persona: sirve para que el clic perdido quede en los logs de Vercel en vez
    // de desaparecer. El caso concreto es `producto_id`, que es clave foránea de
    // `productos`: un producto que no se sincronizó hace fallar el insert aunque
    // las variables estén bien puestas.
    if (error) {
      console.error("clicks: no se pudo registrar el clic:", error.message);
      return new Response(null, { status: 500 });
    }
  }

  return new Response(null, { status: 204 });
}

/** Sólo un objeto plano de strings con claves utm_*; cualquier otra cosa es null. */
function utmValido(v: unknown): Record<string, string> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const utm: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (k.startsWith("utm_") && typeof val === "string" && val) utm[k] = val.slice(0, 200);
  }
  return Object.keys(utm).length ? utm : null;
}

function textoCorto(v: unknown): string | null {
  return typeof v === "string" && v ? v.slice(0, 500) : null;
}
