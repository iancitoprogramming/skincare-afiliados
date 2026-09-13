"use client";

import type { Producto } from "@/engine/recomendacion";
import { copy } from "@/niches/skincare/copy";
import { RangoPrecio } from "@/components/RangoPrecio";
import { trackClick } from "@/engine/tracking";

// Otras opciones para un paso, plegadas debajo del botón de la recomendada.
//
// Van en un <details> nativo a propósito. Plegadas no alargan la página —que ya
// se achicó 1.334 px al sacar los pasos repetidos— y el botón grande sigue
// siendo uno solo: el de la recomendada. Y el <details> se abre con teclado y
// lo anuncia un lector de pantalla sin una línea de JavaScript.
//
// Cómo se eligen está en `src/engine/alternativas.ts`: mismo escalón del motor,
// mismo orden, y ninguna suma un choque con el resto de la rutina.
export function Alternativas({
  productos,
  posicion,
  sesionId,
}: {
  productos: Producto[];
  /** El número del paso: el clic se registra en la misma posición. */
  posicion: number;
  sesionId: string | null;
}) {
  if (!productos.length) return null;

  return (
    <details className="group mt-3 rounded-xl border border-niebla/70 bg-porcelana/60">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-4 font-body text-sm font-medium text-tinta [&::-webkit-details-marker]:hidden">
        {copy.alternativas.ver(productos.length)}
        <span aria-hidden className="font-etiqueta text-xs text-piedra transition-transform group-open:rotate-180">
          ↓
        </span>
      </summary>

      <div className="flex flex-col gap-4 border-t border-niebla/70 px-4 pb-4 pt-3">
        <p className="font-body text-xs leading-relaxed text-tinta/70">{copy.alternativas.criterio}</p>

        {productos.map((p) => (
          <div key={p.id} className="flex items-start gap-3">
            {p.imagen_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.imagen_url}
                alt={p.nombre}
                loading="lazy"
                className="h-12 w-12 flex-none rounded-lg bg-porcelana object-contain"
              />
            ) : null}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="font-display text-base font-medium leading-tight text-tinta">{p.nombre}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {p.marca ? <span className="font-etiqueta text-xs text-piedra">{p.marca}</span> : null}
                <RangoPrecio rango={p.rango_precio} className="shrink-0" />
              </div>
              {p.por_que ? (
                <p className="line-clamp-3 font-body text-sm leading-relaxed text-tinta/80">{p.por_que}</p>
              ) : null}
              <a
                href={p.link_afiliado}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() => trackClick({ sesion_id: sesionId, producto_id: p.id, posicion })}
                className="mt-1 inline-flex min-h-11 items-center self-start font-body text-sm font-medium text-terracota underline decoration-terracota/40 underline-offset-4"
              >
                Ver en Mercado Libre →
              </a>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
