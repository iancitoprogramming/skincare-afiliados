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
    </div>
  );
}
