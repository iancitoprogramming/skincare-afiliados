import Link from "next/link";
import { Shell } from "@/components/Shell";
import { BOTON_LLENO, ETIQUETA, ETIQUETA_BASE } from "@/components/estilo";
import { copy } from "@/niches/skincare/copy";
import { ACTIVOS, MITOS, REGLAS, SINERGIAS } from "@/niches/skincare/activos";
import { celda, EN_MATRIZ, LEYENDA, SIMBOLO, type Marca } from "@/niches/skincare/matriz";
import { OG_POR_DEFECTO } from "@/lib/sitio";

// Página de criterios. Existe por dos motivos, y el segundo es el que importa:
//
//   1. Es contenido que se puede buscar y compartir — "vitamina C y niacinamida"
//      es una de las preguntas más buscadas del rubro.
//   2. Es la manera de que el sitio sea auditable. Cualquiera puede leer acá con
//      qué criterio armamos una rutina y contrastarlo con la rutina que le
//      dimos. Un sitio de afiliados que no publica su criterio es un sitio de
//      afiliados que no tiene criterio.
//
// Todo lo que se renderiza sale de `activos.ts`, que es lo mismo que consume el
// motor. No hay una segunda copia de la verdad.

export const metadata = {
  alternates: { canonical: "/combinaciones" },
  openGraph: { url: "/combinaciones", images: OG_POR_DEFECTO },
  title: `Qué se puede mezclar y qué no · ${copy.marca}`,
  description:
    "La tabla completa de combinaciones entre ingredientes activos, con el criterio detrás de " +
    "cada una: qué se destruye, qué sólo irrita, qué se potencia y qué es mito.",
};

// El color de cada marca de la tabla, el mismo en las celdas y en la leyenda.
// ✕ ("nunca") y ＋ ("se potencian") son la misma cruz girada: con el terracota
// fuera —es sólo para comprar— el que las separa es el salvia de lo que suma, y
// "nunca" va en tinta con más peso.
const COLOR_MARCA: Record<Marca, string> = {
  nunca: "font-medium text-tinta",
  separar: "text-piedra",
  potencia: "text-salvia",
  libre: "text-tinta/70",
  nota: "text-tinta/70",
};

const CLASES: { clase: string; titulo: string; bajada: string }[] = [
  {
    clase: "degradacion",
    titulo: "Se destruyen entre sí",
    bajada:
      "Química, no sensación. Una molécula rompe a la otra, así que no importa el orden ni cuánto " +
      "esperes: hay que separarlas de momento del día.",
  },
  {
    clase: "irritacion",
    titulo: "No se destruyen, pero la piel no da abasto",
    bajada:
      "Acá no hay ninguna reacción química. Los dos funcionan, y juntos funcionan igual — el " +
      "problema es la barrera. Se arregla con calendario, no con orden.",
  },
  {
    clase: "ph",
    titulo: "Cuestión de orden",
    bajada: "Conviven bien. Sólo hay que pensar cuál va primero.",
  },
];

export default function Combinaciones() {
  return (
    <Shell volver={{ href: "/", label: "inicio" }}>
      <div className="flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-normal leading-tight text-tinta">
            Qué se puede mezclar y qué no
          </h1>
          <p className="font-body leading-relaxed text-tinta/80">
            «No mezclar X con Y» no quiere decir una sola cosa. Quiere decir cuatro, y cada una se
            arregla distinto. Casi toda la confusión que circula sale de meterlas en la misma bolsa.
          </p>
          <dl className="flex flex-col gap-2 bg-arena p-4">
            {[
              ["se destruyen", "una molécula rompe a la otra. Separar por momento del día."],
              ["cuestión de orden", "conviven bien; sólo importa cuál va primero."],
              ["carga para la piel", "no se anulan: irritan sumados. Se arregla alternando días."],
              ["pagás dos veces", "no pasa nada malo. Estás comprando lo mismo dos veces."],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className={ETIQUETA}>{k}</dt>
                <dd className="font-body text-sm leading-relaxed text-tinta/80">{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* ── La matriz ───────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <h2 className={`${ETIQUETA_BASE} text-tinta`}>la tabla</h2>
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-max border-collapse font-etiqueta text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-porcelana p-1.5 text-left font-normal text-piedra">
                    &nbsp;
                  </th>
                  {EN_MATRIZ.map((id) => (
                    <th
                      key={id}
                      // Ancho fijo + break-words: "Niacinamida" es una sola
                      // palabra larga y sin esto se le monta a la columna de al
                      // lado en vez de partirse.
                      className="w-20 break-words px-2 py-1.5 align-bottom font-normal leading-tight text-piedra"
                    >
                      {ACTIVOS[id].nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EN_MATRIZ.map((fila) => (
                  <tr key={fila} className="border-t border-niebla/60">
                    <th className="sticky left-0 z-10 w-28 bg-porcelana py-1.5 pr-3 text-left font-normal leading-tight text-tinta">
                      {ACTIVOS[fila].nombre}
                    </th>
                    {EN_MATRIZ.map((col) => {
                      const c = celda(fila, col);
                      return (
                        <td
                          key={col}
                          title={c.motivo ?? undefined}
                          className={`p-1.5 text-center text-sm ${COLOR_MARCA[c.marca]}`}
                        >
                          {SIMBOLO[c.marca]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="flex flex-col gap-1">
            {LEYENDA.map((l) => (
              <li key={l.marca} className="font-body text-xs text-tinta/70">
                <span className={`mr-2 font-etiqueta text-sm ${COLOR_MARCA[l.marca]}`}>{SIMBOLO[l.marca]}</span>
                {l.texto}
              </li>
            ))}
          </ul>
          <p className="font-body text-xs leading-relaxed text-tinta/70">
            Ceramidas, ácido hialurónico, pantenol, centella y alantoína no están en la tabla porque
            no chocan con nada. Van con todo, siempre. Es la parte aburrida y la que más sostiene
            una rutina.
          </p>
        </section>

        {/* ── Reglas, agrupadas por qué tipo de problema son ──────────────── */}
        {CLASES.map(({ clase, titulo, bajada }) => {
          const reglas = REGLAS.filter((r) => r.clase === clase);
          if (!reglas.length) return null;
          return (
            <section key={clase} className="flex flex-col gap-3">
              <div>
                <h2 className="font-display text-xl font-normal leading-snug text-tinta">{titulo}</h2>
                <p className="mt-1 font-body text-sm leading-relaxed text-tinta/80">{bajada}</p>
              </div>
              <ul className="flex flex-col gap-3">
                {reglas.map((r) => (
                  <li
                    key={r.id}
                    className={`border p-4 ${
                      r.severidad === "separar" ? "border-tinta" : "border-niebla"
                    }`}
                  >
                    <h3 className="font-display text-base font-medium leading-snug text-tinta">
                      {r.titulo}
                    </h3>
                    <p className="mt-1 font-body text-sm leading-relaxed text-tinta/80">
                      {r.explicacion}
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-tinta">
                      <span className="text-piedra">qué hacer:</span> {r.queHacer}
                    </p>
                    {r.evidencia ? (
                      <p className="mt-2 border-t border-niebla pt-2 font-body text-xs leading-relaxed text-tinta/70">
                        {r.evidencia}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* ── Sinergias ───────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="font-display text-xl font-normal leading-snug text-tinta">
              Lo que sí conviene juntar
            </h2>
            <p className="mt-1 font-body text-sm leading-relaxed text-tinta/80">
              Se habla mucho de lo que no se puede mezclar y poco de lo que suma. Estas
              combinaciones rinden más juntas que por separado.
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {SINERGIAS.map((s) => (
              <li key={s.id} className="bg-arena p-4">
                <h3 className="font-display text-base font-medium leading-snug text-tinta">
                  {s.titulo}
                </h3>
                <p className="mt-1 font-body text-sm leading-relaxed text-tinta/80">
                  {s.explicacion}
                </p>
                {s.evidencia ? (
                  <p className="mt-2 font-body text-xs leading-relaxed text-tinta/70">
                    {s.evidencia}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Mitos ───────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="font-display text-xl font-normal leading-snug text-tinta">
              Tres cosas que te van a decir y no son ciertas
            </h2>
            <p className="mt-1 font-body text-sm leading-relaxed text-tinta/80">
              Las tres circularon durante años. Las tres se cayeron. Si armaste una rutina alrededor
              de alguna, vale la pena leer esto.
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {MITOS.map((m) => (
              <li key={m.id} className="border border-niebla p-4">
                <h3 className="font-display text-base font-medium leading-snug text-tinta">
                  {m.titulo}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-tinta/70">
                  <span className="text-piedra">lo que se dice:</span> {m.loQueSeDice}
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-tinta/80">
                  <span className="text-piedra">lo que se sabe:</span> {m.loQueSabemos}
                </p>
                {m.evidencia ? (
                  <p className="mt-2 font-body text-xs leading-relaxed text-tinta/70">
                    {m.evidencia}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-arena p-5">
          <h2 className="font-display text-xl font-normal leading-snug text-tinta">
            Esto ya está aplicado en tu rutina
          </h2>
          <p className="mt-1 font-body text-sm leading-relaxed text-tinta/80">
            No hace falta que lo memorices. Cuando armás tu rutina, el sitio chequea estas reglas
            contra los productos que te tocaron y te avisa si hay algo para separar.
          </p>
          {/* Tinta llena, como "Armá tu rutina" en la home: lleva al quiz, no a
              comprar, así que no va en terracota. */}
          <Link href="/rutina" className={`${BOTON_LLENO} mt-4 w-full`}>
            Armar mi rutina
          </Link>
        </section>

        <p className="font-body text-xs leading-relaxed text-piedra">
          * {copy.dermatologo} Nada de lo que se explica acá reemplaza una consulta, y ninguno de
          estos productos trata ni cura ninguna condición.
        </p>
      </div>
    </Shell>
  );
}
