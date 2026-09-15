import Image from "next/image";
import Link from "next/link";
import { Encabezado } from "@/components/Encabezado";
import { GuardarEmailHome } from "@/components/GuardarEmailHome";
import { ComoFunciona } from "@/components/ComoFunciona";
import { PreguntasFrecuentes } from "@/components/PreguntasFrecuentes";
import { BOTON_LINEA, BOTON_LLENO, ETIQUETA } from "@/components/estilo";
import { getCatalogo } from "@/engine/catalogo";
import { conCriteriosDeOrden } from "@/niches/skincare/calidad";
import { armarKits } from "@/engine/kits";
import { copy } from "@/niches/skincare/copy";
import { TIERS } from "@/niches/skincare/config";
import { KITS, KITS_UNICOS } from "@/niches/skincare/kits";
import { configServible } from "@/engine/quiz/servible";
import { skincareQuiz } from "@/niches/skincare/config";
import { productos as fallback } from "@/niches/skincare/productos";
import { answersToQuery } from "@/engine/quiz/url";
import { AUTORES_HOME, FOTOS_HOME } from "@/niches/skincare/fotos-home";

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

// La home con el lenguaje de Beauty of Joseon, que es la referencia visual:
// fondo marfil, títulos en serif, fotos de texturas, líneas finas y botones
// rectos. Reemplaza al fondo de monte en bandas, que era provisorio.
//
// Lo que no cambió es la arquitectura: las tres puertas siguen siendo tres y la
// portada ya deja entrar al quiz (el botón) o por el objetivo (los chips). Lo
// que va debajo de las puertas no es una puerta: ver 03-PRODUCTO.md.
export default async function Home() {
  const productos = await getCatalogo(fallback, conCriteriosDeOrden);
  const kits = armarKits(productos, KITS, TIERS);
  const total = kits.length + KITS_UNICOS.length;
  const activos = productos.filter((p) => p.activo).length;
  // La cantidad de preguntas cambia sola: si el catálogo sólo puede servir un
  // tier, esa pregunta desaparece. Hardcodear "4 preguntas" ya nos quedó viejo
  // una vez cuando entró la rama coreana.
  const quiz = configServible(skincareQuiz, productos);
  const preguntas = quiz.questions.length;
  // Entrar por lo que te preocupa, no por tipo de producto: es la tesis del
  // sitio, y la home la hace tocable. Cada chip es la pregunta del objetivo ya
  // respondida; el quiz arranca en la siguiente. La pregunta y sus opciones
  // son las del quiz, no una copia.
  const objetivo = quiz.questions.find((q) => q.urlKey === quiz.recomendacion.objetivoKey);

  const puertas = [
    {
      href: "/rutina",
      foto: FOTOS_HOME.rutina,
      etiqueta: "a tu medida",
      titulo: copy.home.quiz.titulo,
      bajada: copy.home.quiz.bajada(preguntas),
      cta: copy.home.quiz.cta,
    },
    {
      href: "/catalogo",
      foto: FOTOS_HOME.catalogo,
      etiqueta: `${activos} productos · con filtros`,
      titulo: copy.catalogo.titulo,
      bajada: copy.catalogo.bajadaHome,
      cta: copy.catalogo.cta,
    },
    ...(total > 0
      ? [
          {
            href: "/kits",
            foto: FOTOS_HOME.kits,
            etiqueta: `${total} kits${KITS_UNICOS.length > 0 ? " · hay de una sola compra" : ""}`,
            titulo: copy.home.kits.titulo,
            bajada: copy.home.kits.bajada,
            cta: copy.home.kits.cta,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-[100dvh] bg-porcelana">
      <p className="bg-tinta px-4 py-2 text-center font-etiqueta text-xs text-porcelana">{copy.home.aviso}</p>

      {/* El mismo encabezado que el resto del sitio: vive en `Encabezado`. */}
      <Encabezado />

      <main>
        {/* Portada. En desktop, foto a la izquierda y texto a la derecha; en el
            celular, la foto arriba y el texto abajo, centrado. */}
        <section className="lg:grid lg:min-h-[640px] lg:grid-cols-[1.05fr_1fr]">
          <div className="relative aspect-[4/3.4] lg:aspect-auto">
            <Image
              src={FOTOS_HOME.portada.imagen}
              alt=""
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center px-6 pb-12 pt-10 text-center lg:items-start lg:justify-center lg:px-18 lg:text-left">
            <p className={ETIQUETA}>{copy.home.portada.etiqueta}</p>
            <h1 className="mt-4 font-display text-titular font-normal leading-[1.08] text-tinta lg:text-6xl">
              {copy.home.titulo}
            </h1>
            <p className="mt-4 max-w-[38ch] font-body text-base leading-relaxed text-tinta/80">
              {copy.home.bajada(preguntas)}
            </p>
            <div className="mt-7 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <Link href="/rutina" className={`${BOTON_LLENO} w-full max-w-72 sm:w-auto`}>
                {copy.home.quiz.titulo}
              </Link>
              <Link href="/catalogo" className={`${BOTON_LINEA} w-full max-w-72 sm:w-auto`}>
                {copy.catalogo.cta}
              </Link>
            </div>

            {objetivo ? (
              <nav aria-label={objetivo.title} className="mt-9 flex flex-col items-center gap-3 lg:items-start">
                <p className={ETIQUETA}>{objetivo.title}</p>
                <ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
                  {objetivo.options.map((o) => (
                    <li key={o.value}>
                      <Link
                        href={`/rutina${answersToQuery({ [objetivo.urlKey]: o.value })}`}
                        className="inline-flex min-h-11 items-center rounded-full border border-niebla bg-porcelana px-4 font-body text-sm text-tinta transition-colors hover:border-tinta"
                      >
                        {o.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </section>

        {/* Las tres puertas, cada una con su foto. La tarjeta entera es el link;
            el "botón" de adentro es un span, para no anidar dos controles. */}
        <section aria-labelledby="puertas" className="bg-arena px-5 py-14 lg:px-14 lg:py-20">
          <p className={`${ETIQUETA} text-center`}>{copy.home.puertas.etiqueta}</p>
          <h2 id="puertas" className="mt-3 text-center font-display text-3xl font-normal text-tinta lg:text-4xl">
            {copy.home.puertas.titulo}
          </h2>
          <ul className="mx-auto mt-9 grid max-w-7xl gap-4 md:grid-cols-3 lg:gap-6">
            {puertas.map((p) => (
              <li key={p.href} className="flex">
                <Link href={p.href} className="group flex w-full flex-col bg-porcelana">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.foto.imagen}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center px-5 pb-7 pt-6 text-center">
                    <span className={ETIQUETA}>{p.etiqueta}</span>
                    <span className="mt-2 font-display text-2xl font-normal text-tinta">{p.titulo}</span>
                    <span className="mt-1 font-body text-sm text-tinta/80">{p.bajada}</span>
                    <span className={`${BOTON_LINEA} mt-5 group-hover:bg-tinta group-hover:text-porcelana`}>
                      {p.cta}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ComoFunciona preguntas={preguntas} />

        {/* Cómo decidimos qué combina con qué: la credibilidad del mecanismo la da
            contenido real, no un número. */}
        <section className="border-t border-niebla lg:grid lg:grid-cols-2">
          <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[520px]">
            <Image
              src={FOTOS_HOME.combinaciones.imagen}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center px-6 py-12 text-center lg:items-start lg:justify-center lg:px-18 lg:text-left">
            <p className={ETIQUETA}>{copy.home.franja.etiqueta}</p>
            <h2 className="mt-3 font-display text-3xl font-normal leading-tight text-tinta lg:text-4xl">
              {copy.home.franja.titulo}
            </h2>
            <p className="mt-4 max-w-[42ch] font-body text-base leading-relaxed text-tinta/80">{copy.home.franja.texto}</p>
            <Link href="/combinaciones" className={`${BOTON_LINEA} mt-7`}>
              {copy.home.franja.cta}
            </Link>
          </div>
        </section>

        <PreguntasFrecuentes />

        <section aria-label={copy.home.correo.etiqueta} className="border-t border-niebla px-6 py-14">
          <div className="mx-auto max-w-md">
            <GuardarEmailHome />
          </div>
        </section>
      </main>

      {/* Sin disclaimers: en la home no hay links de compra a la vista. */}
      <footer className="border-t border-niebla px-6 pb-12 pt-14 text-center">
        <p className="font-display text-5xl font-normal leading-none text-tinta md:text-8xl lg:text-9xl">{copy.marca}</p>

        <nav aria-label="redes sociales" className="mt-8 flex justify-center gap-1">
          {REDES.map((r) => (
            <a
              key={r.nombre}
              href={r.href}
              target="_blank"
              rel="noopener"
              aria-label={r.nombre}
              className="grid h-11 w-11 place-items-center text-tinta"
            >
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

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href="/combinaciones"
            className="font-etiqueta text-xs text-tinta underline decoration-niebla underline-offset-4"
          >
            {copy.home.criterios} →
          </Link>
          <p className="font-etiqueta text-xs text-tinta/70">
            {copy.home.creditoFotos}:{" "}
            {AUTORES_HOME.map(({ autor, perfil }, i) => (
              <span key={autor}>
                {i > 0 ? " y " : ""}
                <a href={perfil} target="_blank" rel="noopener" className="underline underline-offset-2">
                  {autor}
                </a>
              </span>
            ))}{" "}
            en{" "}
            <a href="https://unsplash.com" target="_blank" rel="noopener" className="underline underline-offset-2">
              Unsplash
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
