import { NextResponse, type NextRequest } from "next/server";
import { serverClient } from "@/engine/supabase";

// Registra una sesión al completar el quiz. El id lo genera el cliente.
export async function POST(req: NextRequest) {
  let body: { id?: string; respuestas?: unknown; utm?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "cuerpo inválido" }, { status: 400 });
  }

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ ok: true }); // dev sin Supabase: no-op

  const { error } = await supabase.from("sesiones").insert({
    id: body.id,
    respuestas: body.respuestas ?? null,
    referrer: req.headers.get("referer"),
    utm: body.utm ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
