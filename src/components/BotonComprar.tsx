"use client";

import { trackClick } from "@/engine/tracking";

// Botón de compra para los kits de compra única. Mismo contrato que el de
// PasoRutina: dispara el beacon antes de abrir la pestaña y marca el link como
// patrocinado.
export function BotonComprar({
  href,
  productoId,
  label,
}: {
  href: string;
  productoId: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={() => trackClick({ sesion_id: null, producto_id: productoId, posicion: 1 })}
      className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-terracota px-5 font-body text-lg font-medium text-porcelana transition-transform active:scale-[0.98]"
    >
      {label}
    </a>
  );
}
