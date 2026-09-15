import { copy } from "@/niches/skincare/copy";
import { PALETA } from "@/niches/skincare/paleta";

// La marca para las imágenes de Open Graph.
//
// No reusa <Logo/> porque esas imágenes las arma Satori, que soporta un subconjunto
// de CSS y no interpreta `stroke-dasharray`. Acá los arcos se hacen con tres
// círculos anidados a los que se les vuelve transparente un lado del borde: da la
// misma lectura de anillos abiertos con lo que Satori sí entiende.
//
// El nombre va en Newsreader, como en el encabezado del sitio. La fuente la carga
// `fuentesOG()`; si no llegó, Satori usa la de por defecto.
const ANILLOS = [
  { medida: 52, grosor: 5, rot: -20 },
  { medida: 34, grosor: 5, rot: 40 },
  { medida: 17, grosor: 4, rot: 100 },
];

export function MarcaOG({ escala = 1 }: { escala?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${16 * escala}px` }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          width: `${56 * escala}px`,
          height: `${56 * escala}px`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ANILLOS.map(({ medida, grosor, rot }) => (
          <div
            key={medida}
            style={{
              position: "absolute",
              width: `${medida * escala}px`,
              height: `${medida * escala}px`,
              borderRadius: "50%",
              border: `${grosor * escala}px solid ${PALETA.piedra}`,
              borderTopColor: "transparent",
              transform: `rotate(${rot}deg)`,
            }}
          />
        ))}
        <div
          style={{
            width: `${9 * escala}px`,
            height: `${9 * escala}px`,
            borderRadius: "50%",
            backgroundColor: PALETA.piedra,
          }}
        />
      </div>

      <div
        style={{
          fontFamily: "Newsreader",
          fontSize: `${40 * escala}px`,
          fontWeight: 400,
          color: PALETA.tinta,
        }}
      >
        {copy.marca}
      </div>
    </div>
  );
}
