import type { PasoRutina, Rutina } from "../recomendacion";

// Qué pasos de la noche repiten uno que ya se mostró entero a la mañana.
//
// Un slot de momento "ambos" termina en las dos listas de la rutina con el MISMO
// producto. El análisis de compatibilidad necesita las dos listas así —sus
// reglas miran qué va junto en cada momento—, pero mostrarlas así duplicaba la
// tarjeta entera, con foto y botón de compra: en la rutina de piel mixta que se
// midió, 7 tarjetas para 4 productos y 7.336 px de alto. Esto decide qué se
// muestra entero y qué se resume, sin tocar la rutina.
//
// Vive fuera del componente para poder testearlo sin React.

export interface PasoMostrado {
  paso: PasoRutina;
  /** Posición dentro de su momento, desde 1: es el orden en que se aplica. */
  numero: number;
  /** El mismo producto, en el mismo paso, ya se mostró entero a la mañana. */
  repetido: boolean;
}

/** Id de la tarjeta de la mañana, para que el paso repetido de la noche la señale. */
export function anclaDePaso(paso: PasoRutina): string {
  return `paso-manana-${paso.slot.categoria}`;
}

export function pasosPorMomento(rutina: Rutina): { am: PasoMostrado[]; pm: PasoMostrado[] } {
  // Se compara por paso y producto, no por identidad del objeto. Hoy el motor
  // mete el mismo objeto en las dos listas, pero el día que la rutina llegue
  // serializada —desde la URL o desde la base— la identidad se pierde y la
  // comparación tiene que seguir andando.
  const clave = (p: PasoRutina) => `${p.slot.categoria}·${p.producto.id}`;
  const deLaManana = new Set(rutina.am.map(clave));

  return {
    am: rutina.am.map((paso, i) => ({ paso, numero: i + 1, repetido: false })),
    pm: rutina.pm.map((paso, i) => ({ paso, numero: i + 1, repetido: deLaManana.has(clave(paso)) })),
  };
}
