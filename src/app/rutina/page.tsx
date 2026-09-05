import { Quiz } from "@/engine/quiz/Quiz";
import { Shell } from "@/components/Shell";
import { getCatalogo } from "@/engine/catalogo";
import { skincareQuiz } from "@/niches/skincare/config";
import { configServible } from "@/engine/quiz/servible";
import { productos as fallback } from "@/niches/skincare/productos";

// ISR: la página se regenera cada hora. Si Supabase falla, se sirve el catálogo
// cacheado (o el fallback local), así la landing sigue funcionando siempre.
export const revalidate = 3600;

export default async function Rutina() {
  const productos = await getCatalogo(fallback);
  // Sólo ofrecemos los tiers que el catálogo puede entregar. A medida que se
  // cargan productos de Tier 2-4, las opciones aparecen solas.
  const config = configServible(skincareQuiz, productos);
  return (
    <Shell volver={{ href: "/", label: "inicio" }}>
      <Quiz config={config} productos={productos} />
    </Shell>
  );
}
