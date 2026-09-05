import type { AnalisisCompatibilidad } from "@/engine/compatibilidad";

// ─────────────────────────────────────────────────────────────────────────────
// CALENDARIO SEMANAL DE ACTIVOS NO DIARIOS
//
// Los conflictos de clase "irritacion" no se arreglan con el orden de los pasos:
// se arreglan repartiendo los activos fuertes en distintas noches. Un aviso que
// dice "no los uses juntos" sin decir CUÁNDO usar cada uno deja a la persona
// exactamente donde estaba.
//
// El esquema de abajo es el que se popularizó como "skin cycling": una noche de
// exfoliante, una de retinoide y dos de recuperación. No es una técnica nueva
// —los dermatólogos vienen espaciando activos desde siempre—, pero le puso
// nombre a algo que la gente sí sostiene, y esa es toda la diferencia entre una
// rutina que funciona y una que se abandona a las tres semanas.
// ─────────────────────────────────────────────────────────────────────────────

export interface NocheDelPlan {
  /** 1 a 7. */
  noche: number;
  titulo: string;
  detalle: string;
}

export interface PlanSemanal {
  titulo: string;
  intro: string;
  noches: NocheDelPlan[];
  /** Qué hacer si la piel avisa. Va siempre: es la parte que nadie escribe. */
  siArde: string;
}

const RECUPERACION: Omit<NocheDelPlan, "noche"> = {
  titulo: "Recuperación",
  detalle:
    "Limpiador e hidratante, nada más. No es una noche perdida: es la noche en la que la piel " +
    "aprovecha lo de las anteriores.",
};

/**
 * Arma el plan a partir de lo que la rutina realmente tiene. Devuelve null
 * cuando no hay nada fuerte que repartir — que es el caso de la mayoría de las
 * rutinas de Tier 1 y 2, y está perfecto: inventar un calendario donde no hace
 * falta es agregarle fricción a una rutina que ya funcionaba.
 */
export function planSemanal(analisis: AnalisisCompatibilidad): PlanSemanal | null {
  const ids = new Set(analisis.presencias.pm.map((p) => p.activoId));

  const hayRetinoide = [...ids].some((id) => id.startsWith("retin") || id === "tretinoina" || id === "adapaleno");
  const hayExfoliante = [...ids].some((id) => id.startsWith("aha_") || id.startsWith("bha_"));

  // Un solo ácido suave escondido en un limpiador que se enjuaga no amerita un
  // calendario. El umbral es que el conflicto de acumulación se haya disparado.
  const pilaDetectada = analisis.conflictos.some(
    (c) => c.reglaId === "pila-exfoliante" || c.reglaId === "retinoide-x-acidos",
  );

  if (hayRetinoide && hayExfoliante) {
    return {
      titulo: "Cómo repartirlos en la semana",
      intro:
        "Tu rutina tiene dos activos fuertes que no conviene apilar la misma noche. Repartidos así, " +
        "obtenés el beneficio de los dos sin la irritación de sumarlos. Se repite cada cuatro noches.",
      noches: [
        {
          noche: 1,
          titulo: "Exfoliante",
          detalle: "Después de limpiar. Nada de retinoide esta noche.",
        },
        {
          noche: 2,
          titulo: "Retinoide",
          detalle:
            "Sobre la piel seca, poca cantidad. Si recién empezás, una capa de hidratante antes " +
            "y otra después amortigua bastante.",
        },
        { noche: 3, ...RECUPERACION },
        { noche: 4, ...RECUPERACION },
      ],
      siArde:
        "Si la piel arde, tira o descama, sumá noches de recuperación hasta que se calme. " +
        "Bajar la frecuencia no es retroceder: es lo único que permite sostenerlo meses, que es " +
        "cuando estos activos muestran resultados.",
    };
  }

  if (hayRetinoide) {
    return {
      titulo: "Cómo arrancar con el retinoide",
      intro:
        "Los retinoides no se usan todas las noches desde el día uno. El período de adaptación es " +
        "real y es la razón por la que la mayoría los abandona en el primer mes.",
      noches: [
        { noche: 1, titulo: "Retinoide", detalle: "Dos noches por semana durante las primeras dos semanas." },
        { noche: 2, ...RECUPERACION },
        { noche: 3, titulo: "Retinoide", detalle: "Subí a tres por semana recién cuando no te descame." },
        { noche: 4, ...RECUPERACION },
      ],
      siArde:
        "Descamación leve las primeras semanas es esperable. Ardor, rojo que no baja o piel que " +
        "tira todo el día no: eso es pasarse, y se arregla espaciando.",
    };
  }

  if (hayExfoliante && pilaDetectada) {
    return {
      titulo: "Cómo espaciar el exfoliante",
      intro:
        "Tu rutina tiene más de una fuente de exfoliación. La piel se renueva a su ritmo: forzarla " +
        "todos los días no acelera nada y sí rompe la barrera.",
      noches: [
        { noche: 1, titulo: "Exfoliante", detalle: "Dos o tres noches por semana alcanzan y sobran." },
        { noche: 2, ...RECUPERACION },
        { noche: 3, titulo: "Exfoliante", detalle: "Dejá al menos una noche de por medio." },
        { noche: 4, ...RECUPERACION },
      ],
      siArde:
        "Si notás la piel tirante, brillosa de un modo raro o más reactiva que antes, es " +
        "sobreexfoliación. Se corrige parando una o dos semanas, no sumando hidratante.",
    };
  }

  return null;
}
