import Link from "next/link";
import type { ReactNode } from "react";
import { copy } from "@/niches/skincare/copy";
import { Encabezado } from "@/components/Encabezado";

// Shell común de las pantallas que no son la home: el encabezado de la home
// arriba, disclaimers abajo. Desde el 15/9 el encabezado es el mismo en todo el
// sitio (`Encabezado`), así que va a todo el ancho y el contenido, en su columna.
// Mobile-first: el 90% del tráfico va a entrar desde una red social.
// El sitio nació mobile-first y estaba clavado en max-w-md en todas las
// pantallas. Para una ficha o el quiz esa columna angosta está bien —el texto
// se lee mejor— pero una grilla de 25 productos en 448px de ancho desaprovecha
// media pantalla en desktop.
const ANCHOS = {
  angosto: "max-w-md",
  ancho: "max-w-5xl",
} as const;

export function Shell({
  children,
  volver,
  disclaimers = false,
  ancho = "angosto",
}: {
  children: ReactNode;
  volver?: { href: string; label: string };
  /** "ancho" para grillas; "angosto" para lectura. */
  ancho?: keyof typeof ANCHOS;
  /**
   * Los avisos de afiliacion y dermatologo aparecen solo donde hay links de
   * compra a la vista. Antes de eso no vienen a cuento.
   */
  disclaimers?: boolean;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Encabezado volver={volver} />

      <div className={`mx-auto flex w-full flex-1 flex-col px-5 sm:px-8 ${ANCHOS[ancho]}`}>
        <main className="flex flex-1 flex-col py-8">{children}</main>

        {/*
          Los criterios viven en el pie, no en la puerta de entrada. Nadie llega de
          una red social buscando "combinaciones de activos": llega por un producto
          o por una rutina. Pero el que ya está adentro y quiere entender por qué
          recomendamos lo que recomendamos, lo tiene a un toque desde cualquier
          pantalla.
        */}
        <footer className="flex flex-col gap-2 border-t border-niebla py-6">
          <Link
            href="/combinaciones"
            className="self-start font-etiqueta text-xs text-tinta underline decoration-niebla underline-offset-4 transition-colors hover:decoration-tinta"
          >
            {copy.home.criterios} →
          </Link>
          {disclaimers ? (
            <>
              <p className="font-body text-xs text-piedra">* {copy.afiliacion}</p>
              <p className="font-body text-xs text-piedra">* {copy.dermatologo}</p>
            </>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
