import type { Answers } from "./quiz/types";

// Genera el id de sesión en el cliente. Así insertamos con id conocido y no
// dependemos de leer de vuelta (RLS bloquea el select en sesiones).
export function nuevaSesionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  }
}

// Lee parámetros utm_* de la URL, si hay.
export function leerUtm(): Record<string, string> | undefined {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    params.forEach((value, key) => {
      if (key.startsWith("utm_")) utm[key] = value;
    });
    return Object.keys(utm).length ? utm : undefined;
  } catch {
    return undefined;
  }
}

// Se llama cuando se completa el quiz (no al abrir la página).
export function registrarSesion(id: string, respuestas: Answers, utm?: Record<string, string>): void {
  try {
    void fetch("/api/sesiones", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, respuestas, utm }),
      keepalive: true,
    });
  } catch {
    // best-effort: el tracking nunca debe romper el flujo
  }
}

// Registra el clic a Mercado Libre ANTES de abrir la pestaña. sendBeacon no bloquea
// la navegación y sobrevive al cambio de página.
export function trackClick(data: {
  sesion_id: string | null;
  producto_id: string;
  posicion: number;
}): void {
  try {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    navigator.sendBeacon("/api/clicks", blob);
  } catch {
    // best-effort
  }
}

export async function guardarLead(sesion_id: string | null, email: string): Promise<void> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sesion_id, email }),
  });
  if (!res.ok) throw new Error("No se pudo guardar el lead");
}
