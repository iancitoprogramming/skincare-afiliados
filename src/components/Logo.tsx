// Marca de Club de Piel: tres arcos concéntricos que se cierran sobre un punto.
//
// Reconstruido en SVG a partir del original de Alex. Va inline y no como archivo
// porque así hereda el color del texto (`currentColor`), escala sin pixelarse y
// pesa menos que cualquier PNG.
//
// Lectura del símbolo, para que no sea un ícono genérico de belleza: son capas
// de piel vistas desde arriba, cerrándose hacia un centro. Es lo que hace la
// rutina — capa sobre capa, en orden, hacia un punto.
//
// Los arcos se dibujan con `stroke-dasharray` sobre círculos completos: cada
// anillo muestra ~78% de su circunferencia y el corte va rotando, que es lo que
// da la sensación de espiral sin tener que calcular arcos a mano.

const ANILLOS = [
  { r: 42, rot: -8 },
  { r: 29, rot: 28 },
  { r: 16, rot: 64 },
];

export function Logo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Club de Piel"
      fill="none"
    >
      {ANILLOS.map(({ r, rot }) => {
        const circunferencia = 2 * Math.PI * r;
        const visible = circunferencia * 0.78;
        return (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${visible} ${circunferencia - visible}`}
            transform={`rotate(${rot} 50 50)`}
          />
        );
      })}
      <circle cx="50" cy="50" r="6.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
