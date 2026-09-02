// Barra de progreso como hilo de gotero: la gota (Agua) avanza a lo largo del hilo.
export function Progreso({
  current,
  total,
  onBack,
}: {
  current: number;
  total: number;
  onBack?: () => void;
}) {
  const pct = total > 1 ? Math.round((current / (total - 1)) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver a la pregunta anterior"
          className="font-mono text-sm text-agua transition-colors hover:text-tinta"
        >
          ←
        </button>
      ) : (
        <span className="w-3" aria-hidden />
      )}

      <div className="relative h-px flex-1 bg-niebla" aria-hidden>
        <div
          className="absolute inset-y-0 left-0 bg-agua transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-agua transition-[left] duration-300"
          style={{ left: `calc(${pct}% - 4px)` }}
        />
      </div>

      <span className="font-mono text-xs tabular-nums text-agua">
        {current + 1} / {total}
      </span>
    </div>
  );
}
