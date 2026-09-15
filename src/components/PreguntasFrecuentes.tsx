import Link from "next/link";
import { copy } from "@/niches/skincare/copy";
import { BOTON_LLENO, ETIQUETA } from "@/components/estilo";

// Preguntas antes de empezar, al pie de la home.
//
// Cada respuesta describe algo que el sitio HACE hoy y que se puede verificar
// en el código: que las ventas no ordenan, que la fragancia y los aceites
// esenciales vetan para piel sensible, que existe "ya tengo uno", que el
// presupuesto cede ante la piel. Si alguna deja de ser cierta, la respuesta
// tiene que cambiar con ella.
//
// Las preguntas son hipótesis: todavía no hay respuestas reales de clientas a
// "¿qué casi te frena?". Cuando las haya, esta lista se reescribe con esas.
//
// <details> nativo, como las alternativas del resultado: se abre con teclado y
// lo anuncia un lector de pantalla sin JavaScript, y plegadas no empujan nada.
export function PreguntasFrecuentes() {
  const f = copy.home.preguntas;

  return (
    <section aria-labelledby="preguntas" className="border-t border-niebla px-6 py-14 lg:py-20">
      <div className="mx-auto flex max-w-3xl flex-col">
        <p className={ETIQUETA}>{f.etiqueta}</p>
        <h2 id="preguntas" className="mt-3 font-display text-3xl font-normal leading-tight text-tinta lg:text-4xl">
          {f.titulo}
        </h2>

        <div className="mt-7 divide-y divide-niebla border-y border-niebla">
          {f.items.map(({ pregunta, respuesta }) => (
            <details key={pregunta} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-normal text-tinta [&::-webkit-details-marker]:hidden">
                {pregunta}
                <span aria-hidden className="flex-none font-body text-xl leading-none text-tinta/70 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-[62ch] pb-5 font-body text-sm leading-relaxed text-tinta/80">{respuesta}</p>
            </details>
          ))}
        </div>

        {/* Un link más a la puerta del quiz, no una puerta nueva: el que llegó hasta
            acá leyendo ya no tiene las tarjetas de arriba a la vista. */}
        <Link href="/rutina" className={`${BOTON_LLENO} mt-9 self-center`}>
          {f.cta}
        </Link>
      </div>
    </section>
  );
}
