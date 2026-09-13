"use client";

import type { PasoRutina as Paso } from "@/engine/recomendacion";
import { copy } from "@/niches/skincare/copy";
import { PruebaSocial } from "@/components/PruebaSocial";
import { RangoPrecio } from "@/components/RangoPrecio";
import { trackClick } from "@/engine/tracking";

// Un paso de la rutina: primero para qué sirve el paso, después el producto.
//
// EL ORDEN ES EL ARGUMENTO. El diferencial del sitio no es el catálogo sino el
// criterio, y la tarjeta decía lo contrario: foto de 160 px a todo el ancho,
// nombre, marca y calificación, y recién a 323 px del borde el porqué — medido
// en un teléfono de 375 px. Ahora el paso se explica solo, sin marca, y el
// producto llega como la respuesta a esa explicación. La foto no se va: se
// achica al costado del nombre, que es donde identifica sin tapar.
//
// El botón abre en pestaña nueva con rel="sponsored noopener noreferrer".
// En el clic dispara el sendBeacon ANTES de abrir la pestaña (no bloquea).
export function PasoRutina({
  paso,
  numero,
  categoriaLabel,
  momento,
  sesionId,
  conAvisoDeCombinacion = false,
}: {
  paso: Paso;
  numero: number;
  categoriaLabel: string;
  /**
   * En qué bloque de la rutina se muestra la tarjeta. Un paso de momento
   * "ambos" aparece en mañana y en noche con el MISMO slot, así que la tarjeta
   * no puede deducirlo del paso: se lo dice quien la ubica. Sin momento —en un
   * kit, que no separa mañana de noche— va la explicación general.
   */
  momento?: "am" | "pm";
  sesionId: string | null;
  /**
   * Este paso aparece en algún aviso del bloque "cómo combinarlos". Se marca acá
   * para que el aviso de abajo se pueda conectar con el producto concreto sin
   * que la persona tenga que ir y volver adivinando cuál era.
   */
  conAvisoDeCombinacion?: boolean;
}) {
  const p = paso.producto;

  // Si una categoría no tiene su explicación cargada, la tarjeta vuelve a la
  // forma anterior en vez de mostrar un título vacío. `copy-pasos.test.ts`
  // exige que todo paso de un tier la tenga, así que esto sólo pasa con
  // categorías que no entran en ninguna rutina.
  const explicado = copy.pasos[paso.slot.categoria];
  const explicacion = explicado ? (momento && explicado[momento]) || explicado.explicacion : null;

  // Cuando la recomendacion no fue un match limpio, se dice. Un kit o una rutina
  // que esconde esto vende peor a la larga.
  const aviso =
    paso.fallback === "no_apto_sensible"
      ? copy.avisos.no_apto_sensible
      : paso.fallback === "otro_origen"
        ? copy.avisos.otro_origen
        : paso.fallback === "fuera_de_presupuesto"
          ? copy.avisos.fuera_de_presupuesto
          : null;

  return (
    <div className="rounded-2xl border border-niebla bg-gel/25 p-5">
      <p className="font-mono text-xs text-piedra">
        paso {String(numero).padStart(2, "0")} · {categoriaLabel}
        {conAvisoDeCombinacion ? (
          <span className="ml-2 text-tinta/50">↓ {copy.compatibilidad.enPaso}</span>
        ) : null}
      </p>

      {explicado ? (
        <>
          <h3 className="mt-2 font-display text-xl font-medium leading-tight text-tinta">
            {explicado.funcion}
          </h3>
          <p className="mt-1.5 font-body text-sm leading-relaxed text-tinta/80">{explicacion}</p>
        </>
      ) : null}

      <div className={`flex items-start gap-3 ${explicado ? "mt-4 border-t border-niebla/70 pt-4" : "mt-3"}`}>
        {p.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.imagen_url}
            alt={p.nombre}
            loading="lazy"
            className="h-20 w-20 flex-none rounded-xl bg-porcelana object-contain"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Con la función del paso arriba, el nombre del producto deja de ser
              el título de la tarjeta. Sin ella, lo sigue siendo. */}
          {explicado ? (
            <p className="font-display text-lg font-medium leading-tight text-tinta">{p.nombre}</p>
          ) : (
            <h3 className="font-display text-xl font-medium leading-tight text-tinta">{p.nombre}</h3>
          )}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {p.marca ? <span className="font-mono text-xs text-piedra">{p.marca}</span> : null}
            <RangoPrecio rango={p.rango_precio} className="shrink-0" />
          </div>
          <PruebaSocial d={p} />
        </div>
      </div>

      {p.por_que ? (
        <p className="mt-3 font-body text-tinta">
          <span className="text-piedra">{explicado ? "por qué este:" : "por qué:"}</span> {p.por_que}
        </p>
      ) : null}
      {p.como_usar ? (
        <p className="mt-1 font-body text-tinta">
          <span className="text-piedra">cómo:</span> {p.como_usar}
        </p>
      ) : null}

      {aviso ? (
        <p className="mt-3 rounded-xl border border-terracota/30 bg-terracota/5 px-3 py-2 font-body text-xs text-tinta/80">
          {aviso}
        </p>
      ) : null}

      <a
        href={p.link_afiliado}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => trackClick({ sesion_id: sesionId, producto_id: p.id, posicion: numero })}
        className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-terracota px-5 font-body text-lg font-medium text-porcelana transition-transform active:scale-[0.98]"
      >
        Ver en Mercado Libre
      </a>
    </div>
  );
}
