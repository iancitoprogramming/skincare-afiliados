import type { QuizOption } from "./types";

// Opción como etiqueta tocable, no como tarjeta flotante. El punto de la
// izquierda se pone en tinta cuando la opción queda elegida: el terracota es sólo
// para comprar.
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
        "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-piedra",
        selected ? "bg-arena" : "hover:bg-arena active:bg-arena",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "h-2 w-2 shrink-0 rounded-full transition-colors",
          selected ? "bg-tinta" : "bg-piedra/50 group-hover:bg-piedra",
        ].join(" ")}
      />
      <span className="flex flex-col">
        <span className="font-body text-lg leading-snug text-tinta">{option.label}</span>
        {/* La pista va en tinta/70: pasa sobre porcelana y sobre arena, que es el
            fondo de la opción tocada o elegida. */}
        {option.hint ? <span className="font-etiqueta text-xs text-tinta/70">{option.hint}</span> : null}
      </span>
    </button>
  );
}
