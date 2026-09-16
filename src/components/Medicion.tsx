"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capturarEntrada } from "@/engine/tracking";
import { cargarPinterestTag, pinterestPagina } from "@/lib/pinterest";

// Lo que corre en cada página y no se ve. Vive en el layout, al lado de
// <Analytics />, y es un solo componente cliente para que el layout siga siendo
// de servidor.
//
// 1. Guarda la entrada de la visita (utm_*, página, referrer) la primera vez, y
//    la pisa si una URL trae utm nuevos. Ver `capturarEntrada` en tracking.ts.
// 2. Si hay NEXT_PUBLIC_PINTEREST_TAG_ID, carga el Pinterest Tag y le avisa cada
//    cambio de ruta: con App Router la navegación es en el cliente y el tag, solo,
//    vería una sola página.
//
// Se engancha a `usePathname` y no a `useSearchParams` a propósito: el segundo
// obliga a un <Suspense> alrededor y el quiz cambia la query en cada respuesta.
// Los utm se leen de window.location en el momento, que es lo que importa.
export function Medicion() {
  const pathname = usePathname();

  useEffect(() => {
    capturarEntrada();
    cargarPinterestTag();
    pinterestPagina();
  }, [pathname]);

  return null;
}
