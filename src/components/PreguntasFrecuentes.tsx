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
//
// Va sobre la foto de la home, dentro del fade: sin caja alrededor de la lista
// (sólo las líneas entre preguntas), texto en tinta, y el link final como botón
// terracota porque terracota como texto no pasa AA sobre la foto.
export function PreguntasFrecuentes() {
  const f = copy.home.preguntas;

  return (
    <section aria-labelledby="preguntas" className="flex flex-col gap-4">
      <p className="font-etiqueta text-xs text-tinta">{f.etiqueta}</p>
      <h2 id="preguntas" className="font-display text-2xl font-medium leading-tight text-tinta">
        {f.titulo}
      </h2>

      <div className="flex flex-col divide-y divide-tinta/15">
        {f.items.map(({ pregunta, respuesta }) => (
          <details key={pregunta} className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 font-body text-base font-medium text-tinta [&::-webkit-details-marker]:hidden">
              {pregunta}
              <span aria-hidden className="flex-none font-etiqueta text-xs text-tinta transition-transform group-open:rotate-180">
                ↓
              </span>
            </summary>
            <p className="pb-4 font-body text-sm leading-relaxed text-tinta">{respuesta}</p>
          </details>
        ))}
      </div>

      {/* Un link más a la puerta del quiz, no una puerta nueva: el que llegó hasta
          acá leyendo ya no tiene las tarjetas de arriba a la vista. */}
      <Link
        href="/rutina"
        className="mt-2 inline-flex min-h-[52px] items-center gap-2 self-center rounded-[14px] bg-terracota px-5 font-body text-base font-medium text-porcelana"
      >
        {f.cta} →
      </Link>
    </section>
  );
}
