import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import { serverClient } from "@/engine/supabase";
import { suscribir } from "@/lib/resend";
import { rutinaValida } from "@/lib/rutina-url";
import { urlDelSitio } from "@/lib/sitio";

// El SDK de Resend corre en Node; el runtime edge no va acá.
export const runtime = "nodejs";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Guarda el email para reabrir la rutina. Valida el formato del lado del servidor.
// Después de responder, el contacto entra a Resend y sale el mail (ver lib/resend).
export async function POST(req: NextRequest) {
  let body: { sesion_id?: string | null; email?: string; rutina_url?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "cuerpo inválido" }, { status: 400 });
  }

  // Honeypot: un campo que la persona no ve. Si viene con algo, es un bot, y
  // se le responde 200 igual para no darle la señal de que lo cazamos.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "email inválido" }, { status: 400 });
  }
  const rutinaUrl = rutinaValida(body.rutina_url, urlDelSitio());

  const supabase = serverClient();
  if (supabase) {
    const { error } = await supabase
      .from("leads")
      .insert({ sesion_id: body.sesion_id ?? null, email });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Sin Supabase (dev) el lead no se guarda, pero el mail sí sale si hay key:
  // es la forma de probar Resend en local.

  after(() => suscribir({ email, origen: rutinaUrl ? "resultado" : "home", rutinaUrl }));

  return NextResponse.json({ ok: true });
}
