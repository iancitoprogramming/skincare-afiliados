import { copy } from "@/niches/skincare/copy";

// "Cómo funciona", debajo de las tres puertas.
//
// No es una puerta: las puertas siguen siendo tres y siguen arriba, donde el
// que llega de una red social decide sin scrollear. Esto es para el que no
// decidió y bajó a mirar: le cuenta el mecanismo con lo que el motor hace de
// verdad, no con adjetivos.
//
// El paso del medio no repite la bajada del fold —que ya dice "cruzando cada
// activo con los demás"—: baja a las tres clases de choque que el motor
// chequea (degradación, redundancia e irritación) y al calendario que arma
// cuando dos productos van mejor en noches distintas.
//
// Va sobre la foto de la home, dentro del fade: sin borde arriba (sería el
// borde de una caja) y todo el texto en tinta, que es lo único que pasa AA ahí.
export function ComoFunciona({ preguntas }: { preguntas: number }) {
  const m = copy.home.metodo;

  return (
    <section aria-labelledby="como-funciona" className="flex flex-col gap-4">
      <p className="font-etiqueta text-xs text-tinta">{m.etiqueta}</p>
      <h2 id="como-funciona" className="font-display text-2xl font-medium leading-tight text-tinta">
        {m.titulo}
      </h2>

      <ol className="flex flex-col gap-5">
        {m.pasos.map((paso, i) => (
          <li key={paso.titulo} className="flex gap-3">
            <span aria-hidden className="pt-1 font-etiqueta text-xs font-medium text-tinta">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-display text-lg font-medium leading-tight text-tinta">{paso.titulo}</p>
              <p className="font-body text-sm leading-relaxed text-tinta">
                {typeof paso.texto === "function" ? paso.texto(preguntas) : paso.texto}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
