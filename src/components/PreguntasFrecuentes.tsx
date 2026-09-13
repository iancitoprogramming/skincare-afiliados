import Link from "next/link";
import { copy } from "@/niches/skincare/copy";

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
    <section aria-labelledby="preguntas" className="flex flex-col gap-4 border-t border-niebla pt-8">
      <p className="font-mono text-xs text-piedra">{f.etiqueta}</p>
      <h2 id="preguntas" className="font-display text-2xl font-medium leading-tight text-tinta">
        {f.titulo}
      </h2>

      <div className="flex flex-col divide-y divide-niebla rounded-2xl border border-niebla">
        {f.items.map(({ pregunta, respuesta }) => (
          <details key={pregunta} className="group px-5">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 font-body text-base font-medium text-tinta [&::-webkit-details-marker]:hidden">
              {pregunta}
              <span aria-hidden className="flex-none font-mono text-xs text-piedra transition-transform group-open:rotate-180">
                ↓
              </span>
            </summary>
            <p className="pb-4 font-body text-sm leading-relaxed text-tinta/80">{respuesta}</p>
          </details>
        ))}
      </div>

      {/* Un link más a la puerta del quiz, no una puerta nueva: el que llegó hasta
          acá leyendo ya no tiene las tarjetas de arriba a la vista. */}
      <Link
        href="/rutina"
        className="mt-1 self-start font-body text-base font-medium text-terracota transition-colors hover:text-tinta"
      >
        {f.cta} →
      </Link>
    </section>
  );
}
