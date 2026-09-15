"use client";

import type { Answers, QuizConfig } from "./types";
import type { Producto } from "@/engine/recomendacion";
import { analizarRutina } from "@/engine/compatibilidad";
import { alternativasDePaso } from "@/engine/alternativas";
import { catalogoActivos } from "@/niches/skincare/activos";
import { planSemanal } from "@/niches/skincare/calendario";
import { copy } from "@/niches/skincare/copy";
import { guardarLead } from "@/engine/tracking";
import { resolverRutina } from "./armar";
import { Compatibilidad } from "./Compatibilidad";
import { PasoRutina } from "./PasoRutina";
import { PasoRepetido } from "./PasoRepetido";
import { anclaDePaso, pasosPorMomento, type PasoMostrado } from "./repetidos";
import { GuardarEmail } from "./GuardarEmail";
import { useYaLoTengo } from "./yaLoTengo";
import { Desplegable } from "@/components/Desplegable";

export function Resultados({
  config,
  productos,
  answers,
  sesionId,
  onReset,
}: {
  config: QuizConfig;
  productos: Producto[];
  answers: Answers;
  sesionId: string | null;
  onReset: () => void;
}) {
  const rec = config.recomendacion;
  // El armado vive en `armar.ts` para que la auditoría de combinaciones recorra
  // exactamente este camino y no una copia parecida.
  const { rutina, piel, objetivo, presupuesto, origenes, nota } = resolverRutina(config, productos, answers);
  // Las mismas respuestas con las que se armó la rutina: las alternativas tienen
  // que salir del mismo camino, o dejarían de ser alternativas de ESTA rutina.
  const respuestas = { piel, objetivo, presupuesto, origenes };
  const claveDeActivos = (p: { producto: Producto }) => p.producto.ml_id ?? p.producto.id;
  const rama = rec.rama;
  const respuestaRama = rama ? answers[rama.key] : undefined;

  // Compatibilidad entre los activos de los productos que salieron elegidos.
  // Se calcula sobre la rutina ya armada, no sobre lo que la persona respondió:
  // lo que puede chocar es lo que efectivamente se va a poner en la cara.
  const analisis = analizarRutina(rutina, catalogoActivos, (p) => p.producto.ml_id ?? p.producto.id);
  const plan = planSemanal(analisis);

  // Marcar los pasos involucrados en un aviso sirve para conectar la tarjeta de
  // abajo con el producto concreto. Pero la marca sólo significa algo si
  // distingue: dos filtros para que no termine en todos los pasos.
  //
  //   1. Las notas ("estás pagando dos veces") no marcan. Son informativas y
  //      suelen tocar media rutina — el protector solar no tiene la culpa de que
  //      traiga niacinamida.
  //   2. Si aun así la marca cubriría casi toda la rutina, no se pone ninguna:
  //      a esa altura no orienta, sólo mete ruido en cada tarjeta.
  const categorias = [...new Set([...rutina.am, ...rutina.pm].map((p) => p.slot.categoria))];
  const marcadas = new Set(
    analisis.conflictos.filter((c) => c.severidad !== "nota").flatMap((c) => c.categorias),
  );
  const categoriasConAviso = marcadas.size > categorias.length * 0.6 ? new Set<string>() : marcadas;

  const etiquetaOpcion = (urlKey: string, value: string) => {
    const q = config.questions.find((x) => x.urlKey === urlKey);
    const o = q?.options.find((x) => x.value === value);
    return o?.short ?? o?.label ?? "";
  };

  const resumen = [
    etiquetaOpcion(rec.pielKey, piel),
    etiquetaOpcion(rec.objetivoKey, objetivo),
    rama && respuestaRama ? etiquetaOpcion(rama.key, respuestaRama) : "",
    // Un paso de momento "ambos" aparece en las dos listas: se cuenta una vez.
    `${new Set([...rutina.am, ...rutina.pm].map((p) => p.slot.categoria)).size} pasos`,
  ]
    .filter(Boolean)
    .join(" · ");

  const catLabel = (categoria: string) => config.categorias[categoria] ?? categoria;

  // "Ya tengo uno", por categoría y guardado en el navegador. Ver `yaLoTengo.ts`.
  // Lo guardado puede traer categorías que esta rutina no tiene —es un dato de
  // la persona, no de la rutina—, así que el conteo mira sólo las de acá.
  const [tengo, alternarTengo] = useYaLoTengo(`${config.slug}:ya-lo-tengo`);
  const tengoAca = categorias.filter((c) => tengo.has(c)).length;

  // La rutina trae los pasos de "mañana y noche" en las dos listas —el análisis
  // de compatibilidad los necesita así—, pero no se muestran dos veces enteros:
  // a la noche, el que repite producto va resumido. Ver `repetidos.ts`.
  const mostrados = pasosPorMomento(rutina);

  // Se llama como función y no como componente. Definida adentro de este
  // componente, sería un tipo nuevo en cada render: React desmontaría todas las
  // tarjetas cada vez que alguien marca "ya tengo uno", y el foco del teclado
  // se perdería con el checkbox recién usado.
  const seccion = ({
    titulo,
    pasos,
    momento,
  }: {
    titulo: string;
    pasos: PasoMostrado[];
    momento: "am" | "pm";
  }) => (
    <section className="flex flex-col gap-3">
      <h2 className="font-etiqueta text-sm text-piedra">{titulo}</h2>
      {pasos.map(({ paso, numero, repetido }) =>
        repetido ? (
          <PasoRepetido
            key={`${titulo}-${paso.producto.id}`}
            paso={paso}
            numero={numero}
            categoriaLabel={catLabel(paso.slot.categoria)}
            ancla={anclaDePaso(paso)}
            tengo={tengo.has(paso.slot.categoria)}
            conAvisoDeCombinacion={categoriasConAviso.has(paso.slot.categoria)}
          />
        ) : (
          <PasoRutina
            key={`${titulo}-${paso.producto.id}`}
            paso={paso}
            numero={numero}
            categoriaLabel={catLabel(paso.slot.categoria)}
            momento={momento}
            ancla={momento === "am" ? anclaDePaso(paso) : undefined}
            tengo={tengo.has(paso.slot.categoria)}
            onAlternarTengo={() => alternarTengo(paso.slot.categoria)}
            alternativas={
              // Si la persona ya tiene uno, la tarjeta está cerrada y no se muestran:
              // no tiene sentido chequearlas contra la rutina entera para nada.
              tengo.has(paso.slot.categoria)
                ? undefined
                : alternativasDePaso(productos, rutina, paso, respuestas, catalogoActivos, claveDeActivos)
            }
            sesionId={sesionId}
            conAvisoDeCombinacion={categoriasConAviso.has(paso.slot.categoria)}
          />
        ),
      )}
    </section>
  );

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="font-etiqueta text-xs text-piedra">{resumen}</p>
        <h1 className="font-display text-3xl font-medium text-tinta">{config.resultados.titulo}</h1>
        {tengoAca > 0 ? (
          <p className="mt-1 font-etiqueta text-xs text-salvia">
            {copy.yaLoTengo.resumen(tengoAca, categorias.length - tengoAca)}
          </p>
        ) : null}
      </header>

      {seccion({ titulo: config.resultados.manana, pasos: mostrados.am, momento: "am" })}
      {seccion({ titulo: config.resultados.noche, pasos: mostrados.pm, momento: "pm" })}

      {/* Lectura para el que quiere, no parte de la rutina: todo plegado, en
          un solo grupo, y la captura de mail queda justo debajo. */}
      <div className="flex flex-col gap-3">
        <Compatibilidad analisis={analisis} plan={plan} />
        {nota ? (
          <Desplegable etiqueta={copy.criterio.etiqueta} titulo={copy.criterio.titulo}>
            <p className="font-body text-sm leading-relaxed text-tinta/80">{nota}</p>
            <p className="font-body text-sm leading-relaxed text-tinta/70">{copy.opcionales}</p>
          </Desplegable>
        ) : null}
      </div>

      <div className="rounded-2xl border border-niebla bg-gel/25 p-5">
        {/* La URL lleva las respuestas en la query (ver Quiz.syncUrl): es la
            rutina, y es lo que va en el mail. */}
        <GuardarEmail
          label="guardá tu rutina"
          onGuardar={(email, website) =>
            guardarLead(sesionId, email, { rutina_url: window.location.href, website })
          }
        />
        <p className="mt-3 font-body text-sm text-tinta">{config.resultados.ventana}</p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="self-start font-etiqueta text-sm text-piedra transition-colors hover:text-tinta"
      >
        {config.resultados.rehacer}
      </button>

      <footer className="flex flex-col gap-1 border-t border-niebla pt-4">
        <p className="font-body text-xs text-piedra">* {config.resultados.afiliacion}</p>
        <p className="font-body text-xs text-piedra">* {config.resultados.dermatologo}</p>
      </footer>
    </div>
  );
}
