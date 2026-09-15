import type { QuizQuestion } from "./types";
import { OpcionCard } from "./OpcionCard";

export function Pregunta({
  question,
  selected,
  onSelect,
}: {
  question: QuizQuestion;
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-7">
      <h1 className="text-balance font-display text-3xl font-medium leading-tight text-tinta">
        {question.title}
      </h1>
      <div className="divide-y divide-niebla border-y border-niebla">
        {question.options.map((option) => (
          <OpcionCard
            key={option.value}
            option={option}
            selected={selected === option.value}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </div>

      {/* Qué hace el motor con la respuesta. Va debajo de las opciones y en
          voz baja: es contexto, no otra cosa para decidir. */}
      {question.porQue ? (
        <p className="font-body text-sm leading-relaxed text-tinta/70">
          <span className="font-etiqueta text-xs text-piedra">por qué esta pregunta · </span>
          {question.porQue}
        </p>
      ) : null}
    </div>
  );
}
