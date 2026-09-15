import type { ReactNode } from "react";
import { ETIQUETA } from "@/components/estilo";

// Un bloque plegado con un botón para abrirlo. <details> nativo, como las
// alternativas del resultado y las preguntas de la home: se abre con teclado,
// lo anuncia un lector de pantalla y no necesita JavaScript.
//
// Nació en el resultado del quiz. "Cómo combinarlos", "esto se potencia", los
// mitos y la nota de tradiciones iban sueltos uno debajo del otro, y la captura
// de mail quedaba a tres pantallas de la rutina. Plegados, la persona abre lo
// que le interesa y lo demás no empuja. El botón cuenta lo que hay adentro
// ("1 aviso · para tener en cuenta") para que se sepa si vale la pena abrirlo.
export function Desplegable({
  etiqueta,
  titulo,
  abierto = false,
  children,
}: {
  /** Nombre del bloque, en la cara de etiqueta: "cómo combinarlos". */
  etiqueta: string;
  /** Lo que hay adentro, en una línea: "2 combinaciones que suman". */
  titulo: string;
  abierto?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={abierto} className="group border border-niebla">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col gap-0.5">
          <span className={ETIQUETA}>{etiqueta}</span>
          <span className="font-body text-base font-medium leading-snug text-tinta">{titulo}</span>
        </span>
        <span
          aria-hidden
          className="flex-none font-etiqueta text-xs text-piedra transition-transform group-open:rotate-180"
        >
          ↓
        </span>
      </summary>
      <div className="flex flex-col gap-4 border-t border-niebla px-5 pb-5 pt-4">{children}</div>
    </details>
  );
}
