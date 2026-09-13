"use client";

import type { Answers, QuizConfig } from "./types";
import type { PasoRutina as Paso, Producto } from "@/engine/recomendacion";
import { analizarRutina } from "@/engine/compatibilidad";
import { catalogoActivos } from "@/niches/skincare/activos";
import { planSemanal } from "@/niches/skincare/calendario";
import { copy } from "@/niches/skincare/copy";
import { guardarLead } from "@/engine/tracking";
import { resolverRutina } from "./armar";
import { Compatibilidad } from "./Compatibilidad";
import { PasoRutina } from "./PasoRutina";
import { GuardarEmail } from "./GuardarEmail";

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
  const { rutina, piel, objetivo, nota } = resolverRutina(config, productos, answers);
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

  const Seccion = ({ titulo, pasos }: { titulo: string; pasos: Paso[] }) => (
    <section className="flex flex-col gap-3">
      <h2 className="font-etiqueta text-sm text-piedra">{titulo}</h2>
      {pasos.map((paso, i) => (
        <PasoRutina
          key={`${titulo}-${paso.producto.id}`}
          paso={paso}
          numero={i + 1}
          categoriaLabel={catLabel(paso.slot.categoria)}
          sesionId={sesionId}
          conAvisoDeCombinacion={categoriasConAviso.has(paso.slot.categoria)}
        />
      ))}
    </section>
  );

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="font-etiqueta text-xs text-piedra">{resumen}</p>
        <h1 className="font-display text-3xl font-medium text-tinta">{config.resultados.titulo}</h1>
      </header>

      <Seccion titulo={config.resultados.manana} pasos={rutina.am} />
      <Seccion titulo={config.resultados.noche} pasos={rutina.pm} />

      <Compatibilidad analisis={analisis} plan={plan} />

      {nota ? (
        <section className="rounded-2xl border border-niebla bg-porcelana p-5">
          <p className="font-body text-sm leading-relaxed text-tinta/85">{nota}</p>
          <p className="mt-3 font-body text-sm leading-relaxed text-tinta/70">
            {copy.opcionales}
          </p>
        </section>
      ) : null}

      <div className="rounded-2xl border border-niebla bg-gel/25 p-5">
        <GuardarEmail label="guardá tu rutina" onGuardar={(email) => guardarLead(sesionId, email)} />
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
