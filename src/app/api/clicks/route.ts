import { type NextRequest } from "next/server";
import { serverClient } from "@/engine/supabase";

// Destino del sendBeacon: registra el clic a Mercado Libre. Responde vacío y rápido.
export async function POST(req: NextRequest) {
  let body: { sesion_id?: string | null; producto_id?: string; posicion?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (!body.producto_id) return new Response(null, { status: 400 });

  const supabase = serverClient();
  if (supabase) {
    await supabase.from("clicks").insert({
      sesion_id: body.sesion_id ?? null,
      producto_id: body.producto_id,
      posicion: body.posicion ?? null,
    });
  }

  return new Response(null, { status: 204 });
}
