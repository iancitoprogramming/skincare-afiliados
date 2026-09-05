// Prueba social de Mercado Libre: estrellas, ventas y reputación del vendedor.
//
// La calificación se muestra SÓLO con suficientes opiniones detrás. Tres productos
// del catálogo tienen 5,0 con una sola opinión: mostrar eso al lado de uno que
// tiene 4,8 con 3.000 haría que el peor dato parezca el mejor. Las ventas y la
// reputación no tienen ese problema, así que van siempre.
const MIN_OPINIONES = 10;

export interface DatosSociales {
  rating?: number;
  opiniones?: number;
  vendidos?: string;
  reputacion?: string;
}

export function PruebaSocial({ d, className = "" }: { d: DatosSociales; className?: string }) {
  const muestraRating =
    typeof d.rating === "number" && (d.opiniones ?? 0) >= MIN_OPINIONES;

  if (!muestraRating && !d.vendidos && !d.reputacion) return null;

  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs ${className}`}>
      {muestraRating ? (
        <span className="text-tinta">
          ★ {d.rating!.toLocaleString("es-AR", { minimumFractionDigits: 1 })}
          <span className="text-agua"> ({d.opiniones!.toLocaleString("es-AR")})</span>
        </span>
      ) : null}

      {d.vendidos ? <span className="text-agua">{d.vendidos} vendidos</span> : null}

      {d.reputacion ? (
        <span className="rounded-full bg-gel px-2 py-0.5 text-tinta">{d.reputacion}</span>
      ) : null}
    </p>
  );
}
