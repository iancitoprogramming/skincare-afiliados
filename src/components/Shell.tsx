import Link from "next/link";
import type { ReactNode } from "react";
import { copy } from "@/niches/skincare/copy";
import { Logo } from "@/components/Logo";

// Shell común de todas las pantallas: marca arriba, disclaimers abajo.
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
    <div className={`mx-auto flex min-h-[100dvh] w-full flex-col px-5 py-6 sm:px-8 ${ANCHOS[ancho]}`}>
      <header className="flex items-baseline justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={26} className="text-piedra" />
          <span className="font-display text-lg font-medium tracking-tight text-tinta">
            {copy.marca}
          </span>
        </Link>
        {volver ? (
          <Link
            href={volver.href}
            className="font-etiqueta text-xs text-piedra transition-colors hover:text-tinta"
          >
            ← {volver.label}
          </Link>
        ) : null}
      </header>

      <main className="flex flex-1 flex-col py-6">{children}</main>

      {/*
        Los criterios viven en el pie, no en la puerta de entrada. Nadie llega de
        una red social buscando "combinaciones de activos": llega por un producto
        o por una rutina. Pero el que ya está adentro y quiere entender por qué
        recomendamos lo que recomendamos, lo tiene a un toque desde cualquier
        pantalla.
      */}
      <footer className="flex flex-col gap-2 border-t border-niebla pt-4">
        <Link
          href="/combinaciones"
          className="font-etiqueta text-xs text-piedra underline decoration-niebla underline-offset-4 transition-colors hover:text-tinta"
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
  );
}
