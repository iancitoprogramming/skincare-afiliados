import { Quiz } from "@/engine/quiz/Quiz";
import { getCatalogo } from "@/engine/catalogo";
import { skincareQuiz } from "@/niches/skincare/config";
import { productos as fallback } from "@/niches/skincare/productos";

// ISR: la página se regenera cada hora. Si Supabase falla, se sirve el catálogo
// cacheado (o el fallback local), así la landing sigue funcionando siempre.
export const revalidate = 3600;

export default async function Home() {
  const productos = await getCatalogo(fallback);
  return <Quiz config={skincareQuiz} productos={productos} />;
}
