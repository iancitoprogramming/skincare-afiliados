// El Pinterest Tag, y por qué está detrás de una variable.
//
// Pinterest Analytics ya cuenta, con el dominio reclamado, las impresiones y los
// clics de salida de cada pin. Lo que no ve es qué pasa después del clic: si la
// persona armó la rutina, si dejó el correo, si fue a Mercado Libre. Para eso
// está el tag, que además es lo que Pinterest exige para medir conversiones si
// alguna vez se paga por un pin.
//
// Es el primer tercero con cookies que entra al sitio (Vercel Analytics no usa),
// así que no se carga solo: se activa pegando el id en NEXT_PUBLIC_PINTEREST_TAG_ID,
// igual que el reclamo de dominio con NEXT_PUBLIC_PINTEREST_VERIFY. Sin la variable,
// nada de este archivo hace nada.
//
// Eventos que se mandan (los nombres son los de Pinterest, no se inventan):
//   pagevisit  cada página, desde <PinterestTag />
//   lead       al guardar el correo
//   custom     cada clic a Mercado Libre; no hay "compra" en este sitio
//
// No se manda el correo ni ningún dato de la persona ("enhanced match"): con la
// visita alcanza para atribuir, y el resto es de ella.

export const PINTEREST_TAG_ID = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;

const CORE = "https://s.pinimg.com/ct/core.js";

type Pintrk = ((...args: unknown[]) => void) & { queue: unknown[][]; version: string };

declare global {
  interface Window {
    pintrk?: Pintrk;
  }
}

/** El stub que Pinterest documenta: encola hasta que core.js lo reemplaza. */
function asegurarStub(): Pintrk | undefined {
  if (typeof window === "undefined") return undefined;
  if (window.pintrk) return window.pintrk;
  const stub = ((...args: unknown[]) => {
    stub.queue.push(args);
  }) as Pintrk;
  stub.queue = [];
  stub.version = "3.0";
  window.pintrk = stub;
  return stub;
}

let cargado = false;

/** Carga core.js una sola vez y registra el tag. No hace nada sin id. */
export function cargarPinterestTag(): void {
  if (!PINTEREST_TAG_ID || cargado) return;
  const pintrk = asegurarStub();
  if (!pintrk) return;
  cargado = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = CORE;
  document.head.appendChild(script);
  pintrk("load", PINTEREST_TAG_ID);
}

/** Un pageview: se llama en cada cambio de ruta, después de cargar. */
export function pinterestPagina(): void {
  if (!PINTEREST_TAG_ID) return;
  const pintrk = asegurarStub();
  pintrk?.("page");
  pintrk?.("track", "pagevisit");
}

/** Un evento. Best-effort: nunca rompe el flujo, nunca hace nada sin id. */
export function pinterestEvento(evento: "lead" | "custom", datos?: Record<string, unknown>): void {
  if (!PINTEREST_TAG_ID) return;
  try {
    asegurarStub()?.("track", evento, datos);
  } catch {
    // nada: es medición
  }
}
