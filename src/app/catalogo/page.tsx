import Link from "next/link";
import { Shell } from "@/components/Shell";
import { BotonComprar } from "@/components/BotonComprar";
import { PruebaSocial } from "@/components/PruebaSocial";
import { getCatalogo } from "@/engine/catalogo";
import { copy } from "@/niches/skincare/copy";
import { productos as fallback } from "@/niches/skincare/productos";
import { CATEGORIAS, CATEGORIAS_OPCIONALES, TIERS } from "@/niches/skincare/config";
import { ACTIVOS, ACTIVOS_POR_PRODUCTO } from "@/niches/skincare/activos";

// Catálogo navegable. Existe por dos razones y las dos importan:
//
//   1. La rutina que arma el quiz tiene 3, 4 o 5 pasos, y el catálogo tiene 72
//      productos. Todo lo que no entra en una rutina no desaparece: se ofrece
//      acá, como lo que es — opcional.
//
//   2. Es la pieza pensada para compartir. Una tarjeta vertical con foto, precio
//      y el "por qué" en una línea es lo que funciona en Pinterest, y desde
//      Pinterest vuelve tráfico que ya sabe qué está mirando.
//
// La distinción esencial / opcional se muestra de frente. No es una etiqueta
// decorativa: es la diferencia entre lo que le recomendamos a alguien y lo que
// le ofrecemos por si quiere. Confundir las dos cosas es lo que produce rutinas
// de nueve pasos que nadie sostiene.

export const revalidate = 3600;

export const metadata = {
  title: `Catálogo · ${copy.marca}`,
  description:
    "Todos los productos, con sus ingredientes activos y por qué están. Lo esencial y lo opcional, separados.",
};

const ESENCIALES = new Set(Object.values(TIERS).flat().map((s) => s.categoria));
const OPCIONALES = new Set<string>(CATEGORIAS_OPCIONALES);

// Orden de presentación: primero lo que forma parte de una rutina, en el orden
// en que se aplica; después lo opcional.
const ORDEN = [
  "limpiador_oleoso",
  "limpiador",
  "serum_activo",
  "hidratante",
  "protector_solar",
  "tonico",
  "serum_secundario",
  "exfoliante",
  "contorno",
  "retinoide",
];

const precio = (n: number) => `$${n.toLocaleString("es-AR")}`;

export default async function Catalogo() {
  const productos = (await getCatalogo(fallback)).filter((p) => p.activo);

  const porCategoria = ORDEN.map((categoria) => ({
    categoria,
    esencial: ESENCIALES.has(categoria),
    productos: productos
      .filter((p) => p.categoria === categoria)
      .sort((a, b) => b.prioridad - a.prioridad || (b.vendidos_aprox ?? 0) - (a.vendidos_aprox ?? 0)),
  })).filter((g) => g.productos.length > 0);

  const total = productos.length;

  return (
    <Shell volver={{ href: "/", label: "inicio" }} disclaimers>
      <div className="flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs text-agua">{total} productos</p>
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-tinta">
            Todo el catálogo
          </h1>
          <p className="font-body leading-relaxed text-tinta/85">{copy.catalogo.bajada}</p>

          <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-niebla bg-gel/20 p-4">
            <p className="font-body text-sm leading-relaxed text-tinta/85">
              <span className="font-mono text-xs text-tinta">esencial</span> — los tres pasos que
              hacen el trabajo: limpiar, hidratar y protegerte del sol. Si vas a hacer una sola
              cosa, que sea esto.
            </p>
            <p className="font-body text-sm leading-relaxed text-tinta/85">
              <span className="font-mono text-xs text-agua">opcional</span> — suman cuando la base
              ya está firme. Medimos que agregarlos a una rutina automática sube los conflictos
              entre activos sin mejorar lo que la persona vino a resolver, así que los ofrecemos
              acá y no dentro del paso a paso.
            </p>
          </div>

          <Link
            href="/rutina"
            className="mt-2 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-vitamina px-5 font-body text-lg font-medium text-porcelana transition-transform active:scale-[0.98]"
          >
            {copy.catalogo.cta}
          </Link>
        </header>

        {porCategoria.map((grupo) => (
          <section key={grupo.categoria} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-niebla pb-2">
              <h2 className="font-display text-xl font-medium leading-snug text-tinta">
                {CATEGORIAS[grupo.categoria] ?? grupo.categoria}
              </h2>
              <span
                className={`font-mono text-[11px] ${grupo.esencial ? "text-tinta" : "text-agua"}`}
              >
                {grupo.esencial ? "esencial" : "opcional"}
              </span>
              <span className="ml-auto font-mono text-[11px] text-agua">
                {grupo.productos.length}
              </span>
            </div>

            <ul className="grid grid-cols-2 gap-3">
              {grupo.productos.map((p) => {
                const activos = (ACTIVOS_POR_PRODUCTO[p.ml_id ?? ""] ?? [])
                  .map((id) => ACTIVOS[id])
                  .filter((a) => a && a.carga > 0)
                  .slice(0, 3);
                return (
                  <li
                    key={p.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-niebla bg-gel/20"
                  >
                    {/* 2:3 es la proporción que Pinterest muestra entera; en
                        otras se recorta y se pierde el envase. */}
                    <div className="aspect-[2/3] w-full bg-porcelana">
                      {p.imagen_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imagen_url}
                          alt={`${p.marca ?? ""} ${p.nombre}`}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col gap-1 p-3">
                      {p.marca ? (
                        <span className="font-mono text-[11px] text-agua">{p.marca}</span>
                      ) : null}
                      <h3 className="font-display text-sm font-medium leading-tight text-tinta">
                        {p.nombre}
                      </h3>
                      {p.precio_ars ? (
                        <span className="font-mono text-xs text-tinta">~{precio(p.precio_ars)}</span>
                      ) : null}
                      <PruebaSocial d={p} className="mt-0.5 text-[10px]" />

                      {activos.length ? (
                        <p className="mt-1 font-mono text-[10px] leading-relaxed text-agua">
                          {activos.map((a) => a.nombre).join(" · ")}
                        </p>
                      ) : null}

                      {p.por_que ? (
                        <p className="mt-1 font-body text-xs leading-relaxed text-tinta/75">
                          {p.por_que}
                        </p>
                      ) : null}

                      <div className="mt-auto pt-3">
                        <BotonComprar
                          href={p.link_afiliado}
                          productoId={p.id}
                          label="Ver en Mercado Libre"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {OPCIONALES.has(grupo.categoria) ? (
              <p className="font-body text-xs leading-relaxed text-tinta/60">
                {copy.catalogo.notaOpcional[grupo.categoria] ?? copy.catalogo.notaOpcionalGenerica}
              </p>
            ) : null}
          </section>
        ))}

        <section className="rounded-2xl border border-niebla bg-gel/25 p-5">
          <h2 className="font-display text-xl font-medium leading-snug text-tinta">
            ¿Cuál de todos te toca a vos?
          </h2>
          <p className="mt-1 font-body text-sm leading-relaxed text-tinta/85">
            Cuatro preguntas y te armamos la rutina con los que van con tu piel, chequeando además
            que los activos no choquen entre sí.
          </p>
          <Link
            href="/rutina"
            className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-vitamina px-5 font-body text-lg font-medium text-porcelana transition-transform active:scale-[0.98]"
          >
            {copy.catalogo.cta}
          </Link>
          <Link
            href="/combinaciones"
            className="mt-3 block text-center font-mono text-xs text-agua underline decoration-niebla underline-offset-4"
          >
            {copy.home.criterios} →
          </Link>
        </section>
      </div>
    </Shell>
  );
}
