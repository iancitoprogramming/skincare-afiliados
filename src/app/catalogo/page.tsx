import { Shell } from "@/components/Shell";
import { CatalogoGrid, type OpcionFiltro } from "@/components/CatalogoGrid";
import { getCatalogo } from "@/engine/catalogo";
import { conCriteriosDeOrden } from "@/niches/skincare/calidad";
import { copy } from "@/niches/skincare/copy";
import { CATEGORIAS, CATEGORIAS_OPCIONALES, ORIGENES, skincareQuiz } from "@/niches/skincare/config";
import { productos as fallback } from "@/niches/skincare/productos";
import { OG_POR_DEFECTO } from "@/lib/sitio";

export const revalidate = 3600;

export const metadata = {
  title: `Catálogo · ${copy.marca}`,
  description: copy.catalogo.bajada,
  alternates: { canonical: "/catalogo" },
  openGraph: { url: "/catalogo", images: OG_POR_DEFECTO },
};

export default async function Catalogo() {
  const productos = (await getCatalogo(fallback, conCriteriosDeOrden)).filter((p) => p.activo);

  // Las opciones salen de lo que el catálogo tiene de verdad, no de una lista
  // fija: un filtro que devuelve cero resultados siempre es culpa nuestra.
  const presentes = <T,>(xs: T[]) => [...new Set(xs)];

  const etiquetaPiel = (v: string) =>
    skincareQuiz.questions
      .find((q) => q.urlKey === "p")
      ?.options.find((o) => o.value === v)?.short ?? v;

  const pieles: OpcionFiltro[] = presentes(productos.flatMap((p) => p.tipos_piel))
    .sort()
    .map((v) => ({ valor: v, label: etiquetaPiel(v).replace(/^Piel /, "") }));

  // En el orden de una rutina, que es el de CATEGORIAS, y con las categorías
  // opcionales marcadas para ir aparte: es la separación que promete la bajada.
  // Las opcionales tienen pocos productos a propósito, y mezcladas con los pasos
  // de siempre se leían como filtros casi vacíos.
  const opcionales = new Set<string>(CATEGORIAS_OPCIONALES);
  const enRutina = Object.keys(CATEGORIAS);
  const posicion = (v: string) => (enRutina.includes(v) ? enRutina.indexOf(v) : enRutina.length);
  const pasos: OpcionFiltro[] = presentes(productos.map((p) => p.categoria))
    .sort((a, b) => posicion(a) - posicion(b))
    .map((v) => ({ valor: v, label: CATEGORIAS[v] ?? v, opcional: opcionales.has(v) }));

  const origenes: OpcionFiltro[] = presentes(productos.map((p) => p.origen))
    .sort()
    .map((v) => ({ valor: v, label: ORIGENES[v] ?? v }));

  return (
    <Shell volver={{ href: "/", label: "inicio" }} disclaimers ancho="ancho">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-normal text-tinta">
            {copy.catalogo.titulo}
          </h1>
          <p className="font-body text-sm text-tinta/80">{copy.catalogo.bajada}</p>
        </header>

        <CatalogoGrid
          productos={productos}
          pieles={pieles}
          pasos={pasos}
          origenes={origenes}
        />
      </div>
    </Shell>
  );
}
