import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ETIQUETA_BASE } from "@/components/estilo";
import { copy } from "@/niches/skincare/copy";

// El encabezado de todo el sitio, el mismo de la home. En desktop, la marca al
// centro con las secciones a los costados; en el celular, la marca sola a la
// izquierda.
//
// "Volver" va a la derecha y sólo en pantallas chicas: en desktop las secciones
// ya están a la vista y el link sobraría. Lleva 44 px de alto para que se pueda
// tocar, aunque la letra sea de etiqueta.
export function Encabezado({ volver }: { volver?: { href: string; label: string } }) {
  const nav = copy.home.nav;

  return (
    <header className="border-b border-niebla">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-5 lg:h-20 lg:px-14">
        <nav aria-label="secciones" className="hidden flex-1 gap-8 lg:flex">
          <Link href="/rutina" className={`${ETIQUETA_BASE} text-tinta`}>{nav.rutina}</Link>
          <Link href="/catalogo" className={`${ETIQUETA_BASE} text-tinta`}>{nav.catalogo}</Link>
          <Link href="/kits" className={`${ETIQUETA_BASE} text-tinta`}>{nav.kits}</Link>
        </nav>
        <Link href="/" className="flex items-center gap-2">
          <Logo size={24} className="text-piedra" />
          <span className="font-display text-2xl font-normal text-tinta lg:text-3xl">{copy.marca}</span>
        </Link>
        <div className="flex flex-1 justify-end">
          {volver ? (
            <Link
              href={volver.href}
              className={`${ETIQUETA_BASE} inline-flex min-h-11 items-center text-tinta/70 transition-colors hover:text-tinta lg:hidden`}
            >
              ← {volver.label}
            </Link>
          ) : null}
          <Link href="/combinaciones" className={`${ETIQUETA_BASE} hidden text-tinta lg:inline`}>
            {nav.combinaciones}
          </Link>
        </div>
      </div>
    </header>
  );
}
