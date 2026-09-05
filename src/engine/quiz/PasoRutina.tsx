"use client";

import type { PasoRutina as Paso } from "@/engine/recomendacion";
import { copy } from "@/niches/skincare/copy";
import { trackClick } from "@/engine/tracking";

// Un paso de la rutina: producto + botón directo a Mercado Libre.
// El botón abre en pestaña nueva con rel="sponsored noopener noreferrer".
// En el clic dispara el sendBeacon ANTES de abrir la pestaña (no bloquea).
export function PasoRutina({
  paso,
  numero,
  categoriaLabel,
  sesionId,
}: {
  paso: Paso;
  numero: number;
  categoriaLabel: string;
  sesionId: string | null;
}) {
  const p = paso.producto;
  // Cuando la recomendacion no fue un match limpio, se dice. Un kit o una rutina
  // que esconde esto vende peor a la larga.
  const aviso =
    paso.fallback === "no_apto_sensible"
      ? copy.avisos.no_apto_sensible
      : paso.fallback === "otro_origen"
        ? copy.avisos.otro_origen
        : null;

  return (
    <div className="rounded-2xl border border-niebla bg-gel/25 p-5">
      <p className="font-mono text-xs text-agua">
        paso {String(numero).padStart(2, "0")} · {categoriaLabel}
      </p>

      <div className="mt-1 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl font-medium leading-tight text-tinta">{p.nombre}</h3>
        {p.precio_ars ? (
          <span className="whitespace-nowrap font-mono text-sm text-tinta">
            ~${p.precio_ars.toLocaleString("es-AR")}
          </span>
        ) : null}
      </div>
      {p.marca ? <p className="font-mono text-xs text-agua">{p.marca}</p> : null}

      {p.por_que ? (
        <p className="mt-3 font-body text-tinta">
          <span className="text-agua">por qué:</span> {p.por_que}
        </p>
      ) : null}
      {p.como_usar ? (
        <p className="mt-1 font-body text-tinta">
          <span className="text-agua">cómo:</span> {p.como_usar}
        </p>
      ) : null}

      {aviso ? (
        <p className="mt-3 rounded-xl border border-vitamina/30 bg-vitamina/5 px-3 py-2 font-body text-xs text-tinta/80">
          {aviso}
        </p>
      ) : null}

      <a
        href={p.link_afiliado}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => trackClick({ sesion_id: sesionId, producto_id: p.id, posicion: numero })}
        className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-vitamina px-5 font-body text-lg font-medium text-porcelana transition-transform active:scale-[0.98]"
      >
        Ver en Mercado Libre
      </a>
    </div>
  );
}
