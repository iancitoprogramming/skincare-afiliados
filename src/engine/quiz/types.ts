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
}

// Cómo se traducen las respuestas a la recomendación. Los *Key son urlKeys de preguntas.
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
