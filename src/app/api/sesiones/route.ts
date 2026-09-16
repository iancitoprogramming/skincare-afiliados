import { NextResponse, type NextRequest } from "next/server";
import { serverClient } from "@/engine/supabase";

// Registra una sesión al completar el quiz. El id lo genera el cliente.
export async function POST(req: NextRequest) {
  let body: { id?: string; respuestas?: unknown; utm?: unknown; referrer?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "cuerpo inválido" }, { status: 400 });
  }

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ ok: true }); // dev sin Supabase: no-op

  // El referrer que manda el cliente es el del primer pageview de la visita, si
  // era de otro sitio (ver tracking.ts). El header es el de este fetch, o sea
  // nuestra propia página: se deja como resto, por si el cliente no trae nada.
  const referrer =
    typeof body.referrer === "string" && body.referrer
      ? body.referrer.slice(0, 500)
      : req.headers.get("referer");
  const { error } = await supabase.from("sesiones").insert({
    id: body.id,
    respuestas: body.respuestas ?? null,
    referrer,
    utm: body.utm ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
