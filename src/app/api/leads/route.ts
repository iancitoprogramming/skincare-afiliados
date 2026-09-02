import { NextResponse, type NextRequest } from "next/server";
import { serverClient } from "@/engine/supabase";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Guarda el email para reabrir la rutina. Valida el formato del lado del servidor.
export async function POST(req: NextRequest) {
  let body: { sesion_id?: string | null; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "cuerpo inválido" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "email inválido" }, { status: 400 });
  }

  const supabase = serverClient();
  if (!supabase) return NextResponse.json({ ok: true }); // dev sin Supabase: no-op

  const { error } = await supabase
    .from("leads")
    .insert({ sesion_id: body.sesion_id ?? null, email });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
