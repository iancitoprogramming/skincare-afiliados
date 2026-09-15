"use client";

import { trackClick } from "@/engine/tracking";
import { BOTON_COMPRA } from "@/components/estilo";

// Botón de compra de las fichas y de los kits de compra única. Mismo contrato que
// el de PasoRutina: dispara el beacon antes de abrir la pestaña y marca el link
// como patrocinado. El estilo es BOTON_COMPRA, el mismo en todo el sitio.
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
      className={BOTON_COMPRA}
    >
      {label}
    </a>
  );
}
