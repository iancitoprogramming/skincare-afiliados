import { Shell } from "@/components/Shell";
import { CatalogoGrid, type OpcionFiltro } from "@/components/CatalogoGrid";
import { getCatalogo } from "@/engine/catalogo";
import { copy } from "@/niches/skincare/copy";
import { CATEGORIAS, ORIGENES, skincareQuiz } from "@/niches/skincare/config";
import { productos as fallback } from "@/niches/skincare/productos";

export const revalidate = 3600;

export const metadata = {
  title: `Catálogo · ${copy.marca}`,
  description: copy.catalogo.bajada,
  alternates: { canonical: "/catalogo" },
  openGraph: { url: "/catalogo" },
};

export default async function Catalogo() {
  const productos = (await getCatalogo(fallback)).filter((p) => p.activo);

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

  const pasos: OpcionFiltro[] = presentes(productos.map((p) => p.categoria))
    .sort()
    .map((v) => ({ valor: v, label: CATEGORIAS[v] ?? v }));

  const origenes: OpcionFiltro[] = presentes(productos.map((p) => p.origen))
    .sort()
    .map((v) => ({ valor: v, label: ORIGENES[v] ?? v }));

  return (
    <Shell volver={{ href: "/", label: "inicio" }} disclaimers>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-medium tracking-tight text-tinta">
            {copy.catalogo.titulo}
          </h1>
          <p className="font-body text-sm text-tinta/75">{copy.catalogo.bajada}</p>
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
