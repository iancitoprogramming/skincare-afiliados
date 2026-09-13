// Contrato entre el motor y cada nicho. El motor no sabe nada de skincare:
// consume esta config y se arma solo. Todo es data serializable (server → client).

import type { RutinaSlot } from "@/engine/recomendacion";

export interface QuizOption {
  value: string; // valor corto que viaja en la URL, ej. "grasa"
  label: string; // lo que ve la persona
  short?: string; // versión corta para el encabezado de resultados
  hint?: string; // ayuda chica opcional, ej. "rutina de 3 pasos"
}

export interface QuizQuestion {
  urlKey: string; // clave corta en la URL: "p" | "o" | "b" | "n"
  title: string; // la pregunta grande
  options: QuizOption[];
  /**
   * Una línea debajo de las opciones: qué hace el motor con esta respuesta.
   * Es lo que separa un diagnóstico de un embudo: la persona sabe para qué
   * contesta. Describe lo que el motor HACE, no lo que promete.
   */
  porQue?: string;
}

// Cómo se traducen las respuestas a la recomendación. Los *Key son urlKeys de preguntas.
/**
 * Una pregunta que no sólo filtra productos: cambia qué pasos tiene la rutina.
 *
 * El caso concreto es el tónico. En la tradición occidental ese paso directamente
 * no existe, así que preguntar "¿querés coreanos?" y después igual meterle un
 * tónico sería no haber escuchado la respuesta.
 */
export interface RamaOrigen {
  /** urlKey de la pregunta que decide la rama. */
  key: string;
  /** valor de la respuesta → procedencias aceptadas. Lista vacía = no filtra. */
  origenes: Record<string, string[]>;
  /** valor de la respuesta → categorías que salen de la rutina. */
  quitarCategorias?: Record<string, string[]>;
  /** valor de la respuesta → explicación que se muestra con los resultados. */
  nota?: Record<string, string>;
}

export interface RecomendacionConfig {
  pielKey: string;
  objetivoKey: string;
  presupuestoKey: string;
  rutinaKey: string; // la respuesta de esta pregunta elige la variante de rutina (el tier)
  rutinas: Record<string, RutinaSlot[]>; // indexada por el valor de rutinaKey
  /**
   * Tier máximo permitido por tipo de piel. Piel sensible topea en Tier 3: sumarle
   * ampolla, contorno y retinoide encima es pedirle problemas. Si una piel no está
   * acá, no tiene techo.
   */
  techoPorPiel?: Record<string, string>;
  /**
   * Variante a usar cuando la pregunta del tier no se le hizo a la persona
   * (porque el catálogo sólo puede servir una). La setea configServible().
   */
  variantePorDefecto?: string;
  /** Rama de procedencia: filtra productos y puede sacar pasos. */
  rama?: RamaOrigen;
}

export interface ResultadosCopy {
  titulo: string;
  manana: string;
  noche: string;
  ventana: string;
  afiliacion: string;
  dermatologo: string;
  rehacer: string;
}

export interface QuizConfig {
  slug: string;
  intro: string; // línea de arriba: qué obtiene y cuánto tarda
  armando: string; // texto de la transición
  questions: QuizQuestion[];
  categorias: Record<string, string>; // categoria (valor) → etiqueta legible
  recomendacion: RecomendacionConfig;
  resultados: ResultadosCopy;
}

// Respuestas indexadas por urlKey, ej. { p: "grasa", o: "acne", b: "2", n: "0" }
export type Answers = Record<string, string>;
