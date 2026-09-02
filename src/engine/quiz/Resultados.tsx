"use client";

import type { Answers, QuizConfig } from "./types";
import type { PasoRutina as Paso, Producto } from "@/engine/recomendacion";
import { armarRutina } from "@/engine/recomendacion";
import { guardarLead } from "@/engine/tracking";
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
  const piel = answers[rec.pielKey];
  const objetivo = answers[rec.objetivoKey];
  const presupuesto = Number(answers[rec.presupuestoKey]);
  const slots = rec.rutinas[answers[rec.rutinaKey]] ?? [];

  const rutina = armarRutina(productos, slots, { piel, objetivo, presupuesto });

  const etiquetaOpcion = (urlKey: string, value: string) => {
    const q = config.questions.find((x) => x.urlKey === urlKey);
    const o = q?.options.find((x) => x.value === value);
    return o?.short ?? o?.label ?? "";
  };

  const resumen = [
    etiquetaOpcion(rec.pielKey, piel),
    etiquetaOpcion(rec.objetivoKey, objetivo),
    `${slots.length} pasos`,
  ]
    .filter(Boolean)
    .join(" · ");

  const catLabel = (categoria: string) => config.categorias[categoria] ?? categoria;

  const Seccion = ({ titulo, pasos }: { titulo: string; pasos: Paso[] }) => (
    <section className="flex flex-col gap-3">
      <h2 className="font-mono text-sm text-agua">{titulo}</h2>
      {pasos.map((paso, i) => (
        <PasoRutina
          key={`${titulo}-${paso.producto.id}`}
          paso={paso}
          numero={i + 1}
          categoriaLabel={catLabel(paso.slot.categoria)}
          sesionId={sesionId}
        />
      ))}
    </section>
  );

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs text-agua">{resumen}</p>
        <h1 className="font-display text-3xl font-medium text-tinta">{config.resultados.titulo}</h1>
      </header>

      <Seccion titulo={config.resultados.manana} pasos={rutina.am} />
      <Seccion titulo={config.resultados.noche} pasos={rutina.pm} />

      <div className="rounded-2xl border border-niebla bg-gel/25 p-5">
        <GuardarEmail label="guardá tu rutina" onGuardar={(email) => guardarLead(sesionId, email)} />
        <p className="mt-3 font-body text-sm text-tinta">{config.resultados.ventana}</p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="self-start font-mono text-sm text-agua transition-colors hover:text-tinta"
      >
        {config.resultados.rehacer}
      </button>

      <footer className="flex flex-col gap-1 border-t border-niebla pt-4">
        <p className="font-body text-xs text-agua">* {config.resultados.afiliacion}</p>
        <p className="font-body text-xs text-agua">* {config.resultados.dermatologo}</p>
      </footer>
    </div>
  );
}
