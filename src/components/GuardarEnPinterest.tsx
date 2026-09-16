"use client";

import Script from "next/script";
import type { MouseEvent } from "react";
import { copy } from "@/niches/skincare/copy";
import { urlGuardarPin } from "@/lib/pinterest";

type PinUtils = {
  pinOne: (pin: { url: string; media: string; description: string; v?: Event }) => void;
};

// El botón Guardar de Pinterest de cada ficha, con el pin 2:3 del producto.
//
// Es un link de verdad, con href, y no el botón personalizado de pinit.js
// (`data-pin-custom`): con ese modo, pinit.js le borra el href al link
// (`removeAttribute("href")`) y lo abre desde un listener propio, así que deja de
// recibir foco con el teclado. `data-pin-do="none"` le dice a pinit.js que no lo
// toque, y el clic usa `PinUtils.pinOne`, que abre el mismo formulario en una
// ventana chica.
//
// Sin pinit.js —bloqueado, o todavía sin cargar— el href abre ese formulario en
// otra pestaña, con la misma imagen: el script suma la ventana chica, no la
// imagen. El script se carga sólo en las fichas, que es donde está el botón, y
// una vez aunque se navegue entre fichas: next/script no repite un src.
export function GuardarEnPinterest({
  url,
  media,
  descripcion,
  className,
}: {
  /** URL absoluta de la ficha. */
  url: string;
  /** URL absoluta del pin 2:3. */
  media: string;
  descripcion: string;
  className: string;
}) {
  function abrir(e: MouseEvent<HTMLAnchorElement>) {
    // Con una tecla modificadora o la rueda, lo que la persona pidió es otra
    // pestaña: se respeta.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const pin = (window as Window & { PinUtils?: PinUtils }).PinUtils;
    if (typeof pin?.pinOne !== "function") return;
    e.preventDefault();
    pin.pinOne({ url, media, description: descripcion, v: e.nativeEvent });
  }

  return (
    <>
      <Script src="https://assets.pinterest.com/js/pinit.js" strategy="lazyOnload" />
      <a
        href={urlGuardarPin({ url, media, descripcion })}
        target="_blank"
        rel="noopener noreferrer"
        data-pin-do="none"
        onClick={abrir}
        className={className}
      >
        {copy.pinterest.guardar}
        <span className="sr-only">, {copy.pinterest.ventana}</span>
      </a>
    </>
  );
}
