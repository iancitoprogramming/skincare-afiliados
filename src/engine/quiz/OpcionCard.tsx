import type { QuizOption } from "./types";

// Opción como etiqueta tocable, no como tarjeta flotante. El punto de la izquierda
// es el motivo "gotero": se tiñe de Vitamina cuando queda seleccionada.
export function OpcionCard({
  option,
  selected,
  onClick,
}: {
  option: QuizOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "group flex w-full items-center gap-3 px-4 py-4 text-left min-h-[56px]",
        "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-agua",
        selected ? "bg-agua/15" : "hover:bg-gel/40 active:bg-gel/60",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "h-2 w-2 shrink-0 rounded-full transition-colors",
          selected ? "bg-vitamina" : "bg-agua/50 group-hover:bg-agua",
        ].join(" ")}
      />
      <span className="flex flex-col">
        <span className="font-body text-lg leading-snug text-tinta">{option.label}</span>
        {option.hint ? <span className="font-mono text-xs text-agua">{option.hint}</span> : null}
      </span>
    </button>
  );
}
