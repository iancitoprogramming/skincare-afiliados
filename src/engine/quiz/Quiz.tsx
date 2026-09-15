"use client";

import { useCallback, useEffect, useState } from "react";
import type { Answers, QuizConfig } from "./types";
import type { Producto } from "@/engine/recomendacion";
import { ETIQUETA } from "@/components/estilo";
import { Pregunta } from "./Pregunta";
import { Progreso } from "./Progreso";
import { Armando } from "./Armando";
import { Resultados } from "./Resultados";
import { answersToQuery, isComplete, parseAnswers } from "./url";
import { leerUtm, nuevaSesionId, registrarSesion } from "@/engine/tracking";

type Phase = "quiz" | "armando" | "resultados";

export function Quiz({ config, productos }: { config: QuizConfig; productos: Producto[] }) {
  const { questions } = config;
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("quiz");
  const [sesionId, setSesionId] = useState<string | null>(null);

  // Recuperar respuestas desde la URL al montar. Se hace en efecto (no en render)
  // para que el primer render del cliente coincida con el del servidor.
  useEffect(() => {
    const parsed = parseAnswers(new URLSearchParams(window.location.search), questions);
    if (Object.keys(parsed).length === 0) return;
    setAnswers(parsed);
    if (isComplete(parsed, questions)) {
      setPhase("resultados");
    } else {
      const firstUnanswered = questions.findIndex((q) => !parsed[q.urlKey]);
      setStep(firstUnanswered === -1 ? 0 : firstUnanswered);
    }
  }, [questions]);

  const syncUrl = useCallback((next: Answers) => {
    window.history.replaceState(null, "", window.location.pathname + answersToQuery(next));
  }, []);

  const handleSelect = (value: string) => {
    const question = questions[step];
    const next = { ...answers, [question.urlKey]: value };
    setAnswers(next);
    syncUrl(next);
    // Avanza a la siguiente SIN responder, no a la siguiente a secas. Una
    // respuesta puede venir en la URL antes de empezar (la home entra por
    // objetivo con `/rutina?o=manchas`) y no tiene sentido volver a hacerla.
    // Con "volver" se puede llegar igual a cualquiera y cambiarla.
    const siguiente = questions.findIndex((q, i) => i > step && !next[q.urlKey]);
    if (siguiente !== -1) {
      setStep(siguiente);
    } else {
      // Quiz completo: registramos la sesión (una sola vez, acá, no al abrir).
      const id = nuevaSesionId();
      registrarSesion(id, next, leerUtm());
      setSesionId(id);
      setPhase("armando");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setAnswers({});
    setStep(0);
    setSesionId(null);
    setPhase("quiz");
    window.history.replaceState(null, "", window.location.pathname);
  };

  // Vive adentro del Shell de /rutina, que ya pone el <main>, el ancho y los
  // márgenes. Tenía los suyos repetidos: dos <main> anidados y el doble de margen
  // a los costados, que a 390 px le sacaba 40 px de ancho a la pregunta.
  return (
    <div className="flex w-full flex-1 flex-col">
      {phase === "quiz" ? (
        <>
          <p className={ETIQUETA}>{config.intro}</p>
          <div className="mt-6 flex flex-col gap-8">
            <Progreso
              current={step}
              total={questions.length}
              onBack={step > 0 ? handleBack : undefined}
            />
            <Pregunta
              question={questions[step]}
              selected={answers[questions[step].urlKey]}
              onSelect={handleSelect}
            />
          </div>
        </>
      ) : null}

      {phase === "armando" ? (
        <div className="flex flex-1 items-center justify-center">
          <Armando label={config.armando} onDone={() => setPhase("resultados")} />
        </div>
      ) : null}

      {phase === "resultados" ? (
        <div className="flex-1">
          <Resultados
            config={config}
            productos={productos}
            answers={answers}
            sesionId={sesionId}
            onReset={handleReset}
          />
        </div>
      ) : null}
    </div>
  );
}
