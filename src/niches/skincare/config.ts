import type { QuizConfig } from "@/engine/quiz/types";
import type { RutinaSlot } from "@/engine/recomendacion";
import { copy } from "./copy";

// Rangos de presupuesto en ARS. Editables acá sin tocar componentes.
export const PRESUPUESTO: Record<"1" | "2" | "3", string> = {
  "1": "Hasta $15.000",
  "2": "$15.000 a $30.000",
  "3": "Más de $30.000",
};

// Definición de la rutina por nivel (respuesta "n" del quiz). El protector solar
// va siempre a la mañana. Los slots "ambos" aparecen en mañana y noche.
export const RUTINAS: Record<"0" | "1", RutinaSlot[]> = {
  // De cero: 3 productos.
  "0": [
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
  // Ya usa algo: 5 productos.
  "1": [
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "serum", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
    { categoria: "exfoliante", momento: "pm" },
  ],
};

// Etiquetas legibles para las categorías (valores con guión bajo).
export const CATEGORIAS: Record<string, string> = {
  limpiador: "limpiador",
  serum: "serum",
  hidratante: "hidratante",
  protector_solar: "protector solar",
  exfoliante: "exfoliante",
  contorno: "contorno",
};

export const skincareQuiz: QuizConfig = {
  slug: "skincare",
  intro: "Tu rutina ideal en 4 toques · 30s",
  armando: "armando tu rutina",
  questions: [
    {
      urlKey: "p",
      title: "¿Cómo sentís tu piel a media tarde?",
      options: [
        { value: "grasa", label: "Con brillo, se ve grasa", short: "Piel grasa" },
        { value: "mixta", label: "Zona T grasa, mejillas normales", short: "Piel mixta" },
        { value: "seca", label: "Tirante, áspera o reseca", short: "Piel seca" },
        { value: "sensible", label: "Se irrita o enrojece fácil", short: "Piel sensible" },
      ],
    },
    {
      urlKey: "o",
      title: "¿Qué te gustaría cambiar primero?",
      options: [
        { value: "acne", label: "Granitos y poros", short: "foco en granitos" },
        { value: "manchas", label: "Manchas y marcas", short: "foco en manchas" },
        { value: "textura", label: "Textura y opacidad", short: "foco en textura" },
        { value: "deshidratacion", label: "Resequedad y tirantez", short: "foco en hidratación" },
      ],
    },
    {
      urlKey: "b",
      title: "¿Cuánto querés invertir por mes?",
      options: [
        { value: "1", label: PRESUPUESTO["1"] },
        { value: "2", label: PRESUPUESTO["2"] },
        { value: "3", label: PRESUPUESTO["3"] },
      ],
    },
    {
      urlKey: "n",
      title: "¿Arrancás de cero o ya tenés rutina?",
      options: [
        { value: "0", label: "Arranco de cero", hint: "rutina de 3 pasos" },
        { value: "1", label: "Ya uso algo", hint: "rutina de 5 pasos" },
      ],
    },
  ],
  categorias: CATEGORIAS,
  recomendacion: {
    pielKey: "p",
    objetivoKey: "o",
    presupuestoKey: "b",
    rutinaKey: "n",
    rutinas: RUTINAS,
  },
  resultados: {
    titulo: "tu rutina",
    manana: "mañana",
    noche: "noche",
    ventana: copy.ventana,
    afiliacion: copy.afiliacion,
    dermatologo: copy.dermatologo,
    rehacer: "rehacer el quiz",
  },
};
