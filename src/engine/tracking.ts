import type { Answers } from "./quiz/types";
// Relativo, no `@/`: vitest no resuelve el alias y este módulo se testea.
import { pinterestEvento } from "../lib/pinterest";

// Genera el id de sesión en el cliente. Así insertamos con id conocido y no
// dependemos de leer de vuelta (RLS bloquea el select en sesiones).
export function nuevaSesionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  }
}

// ── La entrada: de dónde vino la visita ──────────────────────────────────────
//
// Los utm_* vienen en la URL del primer pageview y nada más. El quiz reescribe la
// query con las respuestas al elegir la primera (Quiz.syncUrl), y una pieza puede
// aterrizar en /producto o en /kits, donde no hay sesión. Si se leen sólo de la
// URL en el momento de registrar, se pierden: pasó con todas las sesiones que
// había el 16/9, ninguna con utm aunque el handoff daba el link con utm por hecho.
//
// Por eso la entrada se captura una vez, al cargar cualquier página, y se guarda
// en sessionStorage —dura la pestaña, que es lo que dura una visita— para que la
// sesión y cada clic la lleven. Y por eso la URL sigue quedando limpia: la del
// resultado se comparte y va en el mail, y si arrastrara el utm, la amiga que la
// abre contaría como venida de Pinterest.

export type Entrada = {
  utm?: Record<string, string>;
  /** La página donde aterrizó la visita. */
  pagina: string;
  /** El referrer del primer pageview, sólo si es de otro sitio. */
  referrer?: string;
};

export const CLAVE_ENTRADA = "cdp_entrada";

/** Los utm_* de una query string, o undefined si no hay ninguno. */
export function extraerUtm(search: string): Record<string, string> | undefined {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith("utm_") && value) utm[key] = value.slice(0, 200);
  });
  return Object.keys(utm).length ? utm : undefined;
}

/** El referrer sirve si es de otro sitio; el propio es navegación interna. */
export function referrerExterno(referrer: string, host: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const r = new URL(referrer);
    return r.host === host ? undefined : r.origin;
  } catch {
    return undefined;
  }
}

/**
 * Qué entrada queda guardada después de este pageview.
 *
 * Una URL con utm_* pisa lo que hubiera: es una entrada nueva desde una pieza
 * nueva. Sin utm, la primera de la pestaña se guarda (con página y referrer) y
 * las siguientes no la tocan: la persona que entró por un pin y ahora navega
 * el catálogo sigue siendo la que entró por el pin.
 */
export function resolverEntrada(
  actual: { search: string; pathname: string; referrer?: string },
  previa: Entrada | null,
): Entrada {
  const utm = extraerUtm(actual.search);
  if (utm) return { utm, pagina: actual.pathname, referrer: actual.referrer };
  if (previa) return previa;
  return { pagina: actual.pathname, referrer: actual.referrer };
}

function leerEntradaGuardada(): Entrada | null {
  try {
    const raw = sessionStorage.getItem(CLAVE_ENTRADA);
    if (!raw) return null;
    const e = JSON.parse(raw) as Entrada;
    return e && typeof e.pagina === "string" ? e : null;
  } catch {
    return null;
  }
}

/** Se llama una vez por pageview, desde <Medicion /> en el layout. */
export function capturarEntrada(): void {
  try {
    const entrada = resolverEntrada(
      {
        search: window.location.search,
        pathname: window.location.pathname,
        referrer: referrerExterno(document.referrer, window.location.host),
      },
      leerEntradaGuardada(),
    );
    sessionStorage.setItem(CLAVE_ENTRADA, JSON.stringify(entrada));
  } catch {
    // sin storage (modo privado estricto) la entrada vive sólo en la URL
  }
}

// Los utm_* de la visita: los de la URL si están, si no los de la entrada guardada.
export function leerUtm(): Record<string, string> | undefined {
  try {
    return extraerUtm(window.location.search) ?? leerEntradaGuardada()?.utm;
  } catch {
    return undefined;
  }
}

function entradaActual(): Entrada | undefined {
  try {
    return (
      leerEntradaGuardada() ?? {
        utm: extraerUtm(window.location.search),
        pagina: window.location.pathname,
      }
    );
  } catch {
    return undefined;
  }
}

// ── Lo que se registra ───────────────────────────────────────────────────────

// Se llama cuando se completa el quiz (no al abrir la página).
export function registrarSesion(id: string, respuestas: Answers, utm?: Record<string, string>): void {
  try {
    void fetch("/api/sesiones", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, respuestas, utm, referrer: entradaActual()?.referrer }),
      keepalive: true,
    });
  } catch {
    // best-effort: el tracking nunca debe romper el flujo
  }
}

// Registra el clic a Mercado Libre ANTES de abrir la pestaña. sendBeacon no bloquea
// la navegación y sobrevive al cambio de página. Lleva la entrada de la visita
// para que un clic desde /producto, sin sesión, igual se pueda atribuir a la pieza.
export function trackClick(data: {
  sesion_id: string | null;
  producto_id: string;
  posicion: number;
}): void {
  try {
    const entrada = entradaActual();
    const cuerpo = {
      ...data,
      utm: entrada?.utm ?? null,
      pagina: window.location.pathname,
      referrer: entrada?.referrer ?? null,
    };
    const blob = new Blob([JSON.stringify(cuerpo)], { type: "application/json" });
    navigator.sendBeacon("/api/clicks", blob);
  } catch {
    // best-effort
  }
  pinterestEvento("custom", { producto_id: data.producto_id });
}

// `rutina_url` es la URL de la rutina armada (con las respuestas en la query),
// para que el mail la traiga. `website` es el honeypot del formulario: viene
// vacío de una persona. La API valida los dos.
export async function guardarLead(
  sesion_id: string | null,
  email: string,
  extra: { rutina_url?: string; website?: string } = {},
): Promise<void> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sesion_id, email, ...extra }),
  });
  if (!res.ok) throw new Error("No se pudo guardar el lead");
  pinterestEvento("lead");
}
