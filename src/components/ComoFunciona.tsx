import { copy } from "@/niches/skincare/copy";
import { ETIQUETA } from "@/components/estilo";

// "Cómo funciona", debajo de las tres puertas.
//
// No es una puerta: las puertas siguen siendo tres y siguen arriba, donde el
// que llega de una red social decide sin scrollear. Esto es para el que no
// decidió y bajó a mirar: le cuenta el mecanismo con lo que el motor hace de
// verdad, no con adjetivos.
//
// El paso del medio no repite la bajada de la portada —que ya dice "cruzando
// cada activo con los demás"—: baja a las tres clases de choque que el motor
// chequea (degradación, redundancia e irritación) y al calendario que arma
// cuando dos productos van mejor en noches distintas.
//
// Los números grandes en serif son decoración: van ocultos para el lector de
// pantalla, que ya recibe el orden de la lista.
export function ComoFunciona({ preguntas }: { preguntas: number }) {
  const m = copy.home.metodo;

  return (
    <section aria-labelledby="como-funciona" className="mx-auto max-w-6xl px-6 py-14 lg:px-14 lg:py-22">
      <p className={ETIQUETA}>{m.etiqueta}</p>
      <h2
        id="como-funciona"
        className="mt-3 max-w-[20ch] font-display text-3xl font-normal leading-tight text-tinta lg:text-4xl"
      >
        {m.titulo}
      </h2>

      <ol className="mt-8 grid gap-9 border-t border-niebla pt-8 md:grid-cols-3 md:gap-10">
        {m.pasos.map((paso, i) => (
          <li key={paso.titulo} className="flex flex-col">
            <span aria-hidden className="font-display text-4xl font-normal leading-none text-tinta/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-3 font-display text-xl font-normal leading-snug text-tinta">{paso.titulo}</p>
            <p className="mt-2 font-body text-sm leading-relaxed text-tinta/80">
              {typeof paso.texto === "function" ? paso.texto(preguntas) : paso.texto}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
