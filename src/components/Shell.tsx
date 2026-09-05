import Link from "next/link";
import type { ReactNode } from "react";
import { copy } from "@/niches/skincare/copy";

// Shell común de todas las pantallas: marca arriba, disclaimers abajo.
// Mobile-first: el 90% del tráfico va a entrar desde una red social.
export function Shell({
  children,
  volver,
  disclaimers = false,
}: {
  children: ReactNode;
  volver?: { href: string; label: string };
  /**
   * Los avisos de afiliacion y dermatologo aparecen solo donde hay links de
   * compra a la vista. Antes de eso no vienen a cuento.
   */
  disclaimers?: boolean;
}) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 py-6">
      <header className="flex items-baseline justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-vitamina" />
          <span className="font-display text-lg font-medium tracking-tight text-tinta">
            {copy.marca}
          </span>
        </Link>
        {volver ? (
          <Link
            href={volver.href}
            className="font-mono text-xs text-agua transition-colors hover:text-tinta"
          >
            ← {volver.label}
          </Link>
        ) : null}
      </header>

      <main className="flex flex-1 flex-col py-6">{children}</main>

      {disclaimers ? (
        <footer className="flex flex-col gap-1 border-t border-niebla pt-4">
          <p className="font-body text-xs text-agua">* {copy.afiliacion}</p>
          <p className="font-body text-xs text-agua">* {copy.dermatologo}</p>
        </footer>
      ) : null}
    </div>
  );
}
