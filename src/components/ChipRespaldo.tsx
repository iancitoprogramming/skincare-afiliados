import type { NivelRespaldo } from "@/engine/respaldo";
import { copy } from "@/niches/skincare/copy";

// El chip que muestra cuánto respalda el producto gente ajena a nosotros.
//
// `poca_prueba` va en un color distinto pero NO en rojo ni con ícono de alerta:
// no es un defecto del producto, es una ausencia de información. Marcarlo como
// peligro empujaría a la persona a evitar productos que elegimos a propósito.

const ESTILO: Record<NivelRespaldo, string> = {
  muy_probado: "bg-gel text-tinta",
  probado: "bg-gel/60 text-tinta",
  poca_prueba: "border border-niebla text-piedra",
};

export function ChipRespaldo({
  nivel,
  opiniones,
  className = "",
}: {
  nivel: NivelRespaldo;
  opiniones?: number;
  className?: string;
}) {
  return (
    <span
      title={copy.respaldo[nivel].detalle(opiniones ?? 0)}
      className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[11px] leading-tight ${ESTILO[nivel]} ${className}`}
    >
      {copy.respaldo[nivel].chip}
    </span>
  );
}

/** La versión larga, para la ficha: el chip más la explicación. */
export function RespaldoDetalle({
  nivel,
  opiniones,
}: {
  nivel: NivelRespaldo;
  opiniones?: number;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-niebla bg-porcelana p-4">
      <ChipRespaldo nivel={nivel} opiniones={opiniones} className="self-start" />
      <p className="font-body text-sm text-tinta/80">
        {copy.respaldo[nivel].detalle(opiniones ?? 0)}
      </p>
    </div>
  );
}
