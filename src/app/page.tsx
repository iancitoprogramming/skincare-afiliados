import Link from "next/link";
import { preload } from "react-dom";
import { Logo } from "@/components/Logo";
import { FondoMonte } from "@/components/FondoMonte";
import { FOTO } from "@/niches/skincare/foto";
import { GuardarEmailHome } from "@/components/GuardarEmailHome";
import { ComoFunciona } from "@/components/ComoFunciona";
import { PreguntasFrecuentes } from "@/components/PreguntasFrecuentes";
import { getCatalogo } from "@/engine/catalogo";
import { conCriteriosDeOrden } from "@/niches/skincare/calidad";
import { armarKits } from "@/engine/kits";
import { copy } from "@/niches/skincare/copy";
import { TIERS } from "@/niches/skincare/config";
import { KITS, KITS_UNICOS } from "@/niches/skincare/kits";
import { configServible } from "@/engine/quiz/servible";
import { skincareQuiz } from "@/niches/skincare/config";
import { productos as fallback } from "@/niches/skincare/productos";
import s from "./home.module.css";

export const revalidate = 3600;

// Relativas a propósito: Next las resuelve contra metadataBase, así que el día
// que se cargue el dominio propio se actualizan solas.
export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

// Los handles viven en docs/proyecto/01-NEGOCIO.md. X está declarada como
// Medio pero no tiene handle documentado, por eso no está.
const REDES = [
  {
    nombre: "Instagram",
    href: "https://www.instagram.com/clubdepielok",
    icono: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r=".9" fill="currentColor" />
      </>
    ),
  },
  {
    nombre: "TikTok",
    href: "https://www.tiktok.com/@clubdepielok",
    icono: (
      <path d="M21 7.9v4a9.9 9.9 0 0 1-5-1.9v4.5a6.5 6.5 0 1 1-8-6.3v4.3a2.5 2.5 0 1 0 4 2V3h4.1A6 6 0 0 0 21 7.9z" />
    ),
  },
  {
    nombre: "YouTube",
    href: "https://www.youtube.com/@clubdepiel",
    icono: (
      <>
        <path d="M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" />
        <path d="M10 9l5 3-5 3z" />
      </>
    ),
  },
  {
    nombre: "Pinterest",
    href: "https://www.pinterest.com/ClubDePiel",
    icono: (
      <>
        <path d="M8 20l4-9" />
        <path d="M10.7 14c.4 1.3 1.4 2 2.6 2 2 0 3.7-1.6 3.7-4a5 5 0 1 0-9.7 1.7" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  },
];

// Sobre la foto el texto va en `tinta` y nada más: piedra, salvia y terracota
// como texto no llegan a AA sobre el fade. El CTA lleva su propio fondo
// terracota con porcelana encima, que sí pasa. Ver docs/proyecto/02-MARCA.md.
const CTA =
  "mt-2 inline-flex min-h-[52px] items-center gap-2 self-center rounded-[14px] bg-terracota px-5 font-body text-base font-medium text-porcelana";

// Puerta de entrada: el monte detrás de todo y tres tarjetas, una por banda.
// El que llega de una red social decide en un toque, sin buscar ni scrollear
// un catálogo. La home no usa <Shell>: ver home.module.css.
export default async function Home() {
  const productos = await getCatalogo(fallback, conCriteriosDeOrden);
  const kits = armarKits(productos, KITS, TIERS);
  const total = kits.length + KITS_UNICOS.length;
  const activos = productos.filter((p) => p.activo).length;
  // La cantidad de preguntas cambia sola: si el catálogo sólo puede servir un
  // tier, esa pregunta desaparece. Hardcodear "4 preguntas" ya nos quedó viejo
  // una vez cuando entró la rama coreana.
  const preguntas = configServible(skincareQuiz, productos).questions.length;

  // La foto es el elemento más grande de la pantalla: es el LCP. Sin preload
  // el navegador la descubre recién al parsear el <img>, tarde.
  preload(FOTO.archivo, { as: "image", fetchPriority: "high" });

  return (
    <>
      <FondoMonte />

      <header className={s.marca}>
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo size={26} className="text-piedra" />
          <span className="font-display text-lg font-medium tracking-tight text-tinta">
            {copy.marca}
          </span>
        </Link>
      </header>

      <main className={s.contenido}>
        <section className={s.seccion}>
          <div className={s.copy}>
            <h1 className="font-display text-[2.1rem] font-medium leading-[1.06] tracking-tight text-tinta sm:text-5xl">
              {copy.home.titulo}
            </h1>
            <p className="font-body text-base leading-relaxed text-tinta">{copy.home.bajada(preguntas)}</p>

            <ul className="flex flex-col gap-2">
              {copy.home.bullets.map((b) => (
                <li key={b} className="font-body text-sm text-tinta">
                  <span aria-hidden className="mr-2 inline-block h-1 w-3 rounded-full bg-salvia align-middle" />
                  {b}
                </li>
              ))}
            </ul>

            {/* La credibilidad del mecanismo la da contenido real, no un número.
                Este link es el respaldo de la promesa de arriba. */}
            <Link
              href="/combinaciones"
              className="self-center font-etiqueta text-xs text-tinta underline decoration-piedra underline-offset-4"
            >
              {copy.home.respaldo} →
            </Link>
          </div>
        </section>

        {/* Cada tarjeta está atada a una banda del fondo: la que entra en foco
            (centro de pantalla, hover o tap) es la que mueve su banda. */}
        <section className={s.presentacion} data-presentacion>
          <Link href="/rutina" data-banda="0" className={s.tarjeta}>
            <div className={s.copy}>
              <span className="font-etiqueta text-xs text-tinta">a tu medida</span>
              <span className="font-display text-2xl font-medium text-tinta">
                {copy.home.quiz.titulo}
              </span>
              <span className="font-body text-sm text-tinta">{copy.home.quiz.bajada(preguntas)}</span>
              <span className={CTA}>{copy.home.quiz.cta} →</span>
            </div>
          </Link>
          <Link href="/catalogo" data-banda="1" className={s.tarjeta}>
            <div className={s.copy}>
              <span className="font-etiqueta text-xs text-tinta">{activos} productos · con filtros</span>
              <span className="font-display text-2xl font-medium text-tinta">
                {copy.catalogo.titulo}
              </span>
              <span className="font-body text-sm text-tinta">{copy.catalogo.bajadaHome}</span>
              <span className={CTA}>{copy.catalogo.cta} →</span>
            </div>
          </Link>
          {total > 0 ? (
            <Link href="/kits" data-banda="2" className={s.tarjeta}>
              <div className={s.copy}>
                <span className="font-etiqueta text-xs text-tinta">
                  {total} kits{KITS_UNICOS.length > 0 ? " · hay de una sola compra" : ""}
                </span>
                <span className="font-display text-2xl font-medium text-tinta">
                  {copy.home.kits.titulo}
                </span>
                <span className="font-body text-sm text-tinta">{copy.home.kits.bajada}</span>
                <span className={CTA}>{copy.home.kits.cta} →</span>
              </div>
            </Link>
          ) : null}
        </section>

        {/* Para el que no decidió en las tarjetas y bajó a mirar (vienen de
            main, #28). Bloques de lectura: la columna va centrada pero el
            texto queda a la izquierda, que es como se lee una lista. */}
        <section className={`${s.seccion} ${s.suelta}`}>
          <div className={`${s.copy} ${s.lectura}`}>
            <ComoFunciona preguntas={preguntas} />
          </div>
        </section>
        <section className={`${s.seccion} ${s.suelta}`}>
          <div className={`${s.copy} ${s.lectura}`}>
            <PreguntasFrecuentes />
          </div>
        </section>

        <section className={`${s.seccion} ${s.cierre}`}>
          <div className={s.copy}>
            <GuardarEmailHome label="guardá tu rutina" />

            {/* Los criterios viven en el pie, como en toda pantalla. Sin
                disclaimers: en el home no hay links de compra a la vista. */}
            <footer className="flex flex-col gap-2 pt-4">
              <Link
                href="/combinaciones"
                className="self-center font-etiqueta text-xs text-tinta underline decoration-piedra underline-offset-4"
              >
                {copy.home.criterios} →
              </Link>
              <p className="font-etiqueta text-[0.66rem] text-tinta">
                foto ·{" "}
                <a href={FOTO.url} target="_blank" rel="noopener" className="underline underline-offset-2">
                  {FOTO.autor} · {FOTO.licencia}
                </a>
              </p>
            </footer>
          </div>
        </section>
      </main>

      <nav className={s.redes} aria-label="redes sociales">
        {REDES.map((r) => (
          <a key={r.nombre} href={r.href} target="_blank" rel="noopener" aria-label={r.nombre} className="text-tinta">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {r.icono}
            </svg>
          </a>
        ))}
      </nav>
    </>
  );
}
