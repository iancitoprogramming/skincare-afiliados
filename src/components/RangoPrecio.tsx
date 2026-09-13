import { copy } from "@/niches/skincare/copy";

// La banda de precio: "accesible", "equilibrado", "premium".
//
// Reemplaza al número en pesos en todas las superficies públicas. El motivo
// largo está en `docs/PRECIO.md`; el corto es que un precio de Mercado Libre
// copiado a mano queda viejo en días y miente justo sobre lo que la persona va
// a verificar en el clic siguiente, mientras que la banda contesta la pregunta
// real ("¿me alcanza?") y no caduca.
//
// Se ve distinto de un precio a propósito: minúscula, sin signo $, en el mismo
// registro que el chip de respaldo. Si se pareciera a un precio, alguien lo
// leería como uno.

export function RangoPrecio({ rango, className = "" }: { rango: number; className?: string }) {
  const etiqueta = copy.precio.rangos[rango];
  if (!etiqueta) return null;
  return (
    <span
      title={copy.precio.porQue}
      className={`inline-flex rounded-full border border-niebla px-2 py-0.5 font-etiqueta text-xs leading-tight text-piedra ${className}`}
    >
      {etiqueta}
    </span>
  );
}
