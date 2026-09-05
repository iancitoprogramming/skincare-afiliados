"use client";

import type { AnalisisCompatibilidad, Conflicto, Severidad } from "@/engine/compatibilidad";
import type { PlanSemanal } from "@/niches/skincare/calendario";
import { copy } from "@/niches/skincare/copy";

// Bloque "cómo combinarlos", debajo de la rutina. Tres cosas, en este orden:
//
//   1. lo que hay que separar o mirar,
//   2. lo que se potencia (que es lo que hace que la rutina se entienda como una
//      sola cosa y no como nueve frascos sueltos),
//   3. el mito que le van a contar, desmentido antes de que lo googlee.
//
// El orden no es estético. Un aviso sin acción concreta genera abandono; una
// sinergia sin el aviso previo se lee como venta. Y desmentir un mito que la
// persona todavía no escuchó es ruido — por eso los mitos van último y sólo
// cuando la combinación que los dispara está de verdad en SU rutina.

const ESTILO: Record<Severidad, { chip: string; borde: string }> = {
  separar: {
    chip: "bg-vitamina/15 text-vitamina",
    borde: "border-vitamina/40",
  },
  cuidado: {
    chip: "bg-agua/15 text-agua",
    borde: "border-agua/40",
  },
  nota: {
    chip: "bg-niebla/40 text-tinta/60",
    borde: "border-niebla",
  },
};

function Tarjeta({ conflicto }: { conflicto: Conflicto }) {
  const estilo = ESTILO[conflicto.severidad];
  const cuando =
    conflicto.momentos.length === 1
      ? conflicto.momentos[0] === "am"
        ? "a la mañana"
        : "a la noche"
      : null;

  return (
    <li className={`rounded-2xl border ${estilo.borde} bg-gel/15 p-4`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${estilo.chip}`}>
          {copy.compatibilidad.severidad[conflicto.severidad]}
        </span>
        <span className="font-mono text-[11px] text-agua">
          {copy.compatibilidad.clase[conflicto.clase]}
          {cuando ? ` · ${cuando}` : ""}
        </span>
      </div>

      <h3 className="mt-2 font-display text-base font-medium leading-snug text-tinta">
        {conflicto.titulo}
      </h3>
      <p className="mt-1 font-body text-sm leading-relaxed text-tinta/85">
        {conflicto.explicacion}
      </p>
      <p className="mt-2 font-body text-sm leading-relaxed text-tinta">
        <span className="text-agua">qué hacer:</span> {conflicto.queHacer}
      </p>

      {conflicto.productos.length ? (
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-agua">
          {conflicto.productos.join(" · ")}
        </p>
      ) : null}
    </li>
  );
}

export function Compatibilidad({
  analisis,
  plan,
}: {
  analisis: AnalisisCompatibilidad;
  plan: PlanSemanal | null;
}) {
  const { conflictos, sinergias, mitos } = analisis;
  if (!conflictos.length && !sinergias.length && !mitos.length && !plan) return null;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-mono text-sm text-agua">{copy.compatibilidad.titulo}</h2>
        <p className="mt-1 font-body text-sm leading-relaxed text-tinta/75">
          {copy.compatibilidad.bajada}
        </p>
      </div>

      {conflictos.length ? (
        <ul className="flex flex-col gap-3">
          {conflictos.map((c) => (
            <Tarjeta key={c.reglaId} conflicto={c} />
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-niebla bg-gel/15 p-4 font-body text-sm leading-relaxed text-tinta/85">
          {copy.compatibilidad.sinConflictos}
        </p>
      )}

      {plan ? (
        <div className="rounded-2xl border border-niebla bg-porcelana p-5">
          <h3 className="font-display text-base font-medium text-tinta">{plan.titulo}</h3>
          <p className="mt-1 font-body text-sm leading-relaxed text-tinta/85">{plan.intro}</p>
          <ol className="mt-3 flex flex-col gap-2">
            {plan.noches.map((n) => (
              <li key={n.noche} className="flex gap-3">
                <span className="mt-0.5 font-mono text-xs text-agua">
                  {String(n.noche).padStart(2, "0")}
                </span>
                <span className="font-body text-sm leading-relaxed text-tinta">
                  <span className="font-medium">{n.titulo}.</span> {n.detalle}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 font-body text-xs leading-relaxed text-tinta/70">{plan.siArde}</p>
        </div>
      ) : null}

      {sinergias.length ? (
        <div className="rounded-2xl border border-gel bg-gel/25 p-5">
          <h3 className="font-mono text-xs text-agua">{copy.compatibilidad.sinergias}</h3>
          <ul className="mt-2 flex flex-col gap-3">
            {sinergias.map((s) => (
              <li key={s.sinergiaId}>
                <p className="font-display text-base font-medium leading-snug text-tinta">
                  {s.titulo}
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-tinta/85">
                  {s.explicacion}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {mitos.length ? (
        <div className="rounded-2xl border border-niebla p-5">
          <h3 className="font-mono text-xs text-agua">{copy.compatibilidad.mitos}</h3>
          <ul className="mt-2 flex flex-col gap-4">
            {mitos.map((m) => (
              <li key={m.mitoId}>
                <p className="font-display text-base font-medium leading-snug text-tinta">
                  {m.titulo}
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-tinta/70">
                  <span className="text-agua">lo que se dice:</span> {m.loQueSeDice}
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-tinta/85">
                  <span className="text-agua">lo que se sabe:</span> {m.loQueSabemos}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
