import type { PasoRutina as Paso } from "@/engine/recomendacion";
import { copy } from "@/niches/skincare/copy";

// Un paso de la noche que repite, con el mismo producto, uno que ya se mostró
// entero a la mañana. Va resumido: número, función, lo que cambia a la noche si
// cambia algo, y un link a la tarjeta de arriba.
//
// Sin foto y sin botón de compra, porque es el mismo frasco. Mostrarlo entero de
// nuevo era pedir que se compre dos veces lo que la home promete no hacer
// comprar dos veces. Ver `repetidos.ts`.
export function PasoRepetido({
  paso,
  numero,
  categoriaLabel,
  ancla,
  conAvisoDeCombinacion = false,
}: {
  paso: Paso;
  numero: number;
  categoriaLabel: string;
  /** Id de la tarjeta entera de la mañana, a la que este paso manda. */
  ancla: string;
  conAvisoDeCombinacion?: boolean;
}) {
  const explicado = copy.pasos[paso.slot.categoria];

  return (
    <div className="rounded-2xl border border-dashed border-niebla px-5 py-4">
      <p className="font-mono text-xs text-piedra">
        paso {String(numero).padStart(2, "0")} · {categoriaLabel}
        {conAvisoDeCombinacion ? (
          <span className="ml-2 text-tinta/50">↓ {copy.compatibilidad.enPaso}</span>
        ) : null}
      </p>

      <h3 className="mt-1.5 font-display text-lg font-medium leading-tight text-tinta">
        {explicado?.funcion ?? paso.producto.nombre}
      </h3>

      {/* Sólo si a la noche el paso dice algo distinto. La explicación general ya
          se leyó en la tarjeta de la mañana, y repetirla es el mismo problema que
          repetir la tarjeta. */}
      {explicado?.pm ? (
        <p className="mt-1 font-body text-sm leading-relaxed text-tinta/80">{explicado.pm}</p>
      ) : null}

      <p className="mt-2 font-body text-sm text-tinta/80">
        {copy.repetido.mismo}{" "}
        <a
          href={`#${ancla}`}
          className="font-medium text-tinta underline decoration-niebla underline-offset-4 transition-colors hover:decoration-tinta"
        >
          {paso.producto.nombre}
        </a>{" "}
        <span aria-hidden className="text-piedra">
          ↑
        </span>
      </p>
    </div>
  );
}
