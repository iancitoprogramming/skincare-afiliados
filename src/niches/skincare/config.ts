import type { QuizConfig } from "@/engine/quiz/types";
import type { RutinaSlot } from "@/engine/recomendacion";
import { copy } from "./copy";

// ─────────────────────────────────────────────────────────────────────────────
// Estructura del nicho. Espeja el vault de Obsidian "Club de Piel":
// 5 tipos de piel × 4 tiers, con piel sensible topeada en Tier 3.
// ─────────────────────────────────────────────────────────────────────────────

// Rangos de presupuesto en ARS. Editables acá sin tocar componentes.
// Etiquetas cualitativas a propósito: los montos fijos quedan viejos solos y
// pasan a mentir. El precio real de cada producto se ve en su card.
export const PRESUPUESTO: Record<"1" | "2" | "3", string> = {
  "1": "Lo más accesible",
  "2": "Equilibrado",
  "3": "Lo mejor que haya",
};

// Cuántos días vale un relevamiento antes de pedir revisión. Los precios de
// Mercado Libre se mueven, pero poner la ventana demasiado corta hace que todo
// esté siempre vencido y que la herramienta se termine ignorando.
export const DIAS_FRESCURA = 30;

// Cortes de respaldo. Salen de mirar la distribución real del catálogo, que se
// parte sola en tres: 11 productos arriba de 1.000 opiniones, 10 entre 10 y 999,
// y 4 abajo de 10 — que son los coreanos nuevos en Mercado Libre.
export const UMBRALES_RESPALDO = { muyProbado: 1000, probado: 10 };

// Procedencia. Es preferencia del usuario, no filtro duro: el motor la relaja si
// no hay cobertura en esa categoría, y la card avisa cuando eso pasa.
export const ORIGENES: Record<string, string> = {
  coreano: "Coreano",
  europeo: "Europeo",
  nacional: "Nacional",
};

// Etiquetas legibles para las categorías (valores con guión bajo).
export const CATEGORIAS: Record<string, string> = {
  limpiador_oleoso: "limpiador oleoso",
  limpiador: "limpiador",
  tonico: "tónico o esencia",
  serum_activo: "serum activo",
  serum_secundario: "serum secundario o ampolla",
  contorno: "contorno de ojos",
  hidratante: "hidratante",
  protector_solar: "protector solar",
  exfoliante: "exfoliante químico",
  retinoide: "retinoide",
};

// Los 4 tiers. El protector solar va siempre a la mañana; el limpiador oleoso es
// la primera mitad de la doble limpieza, así que es de noche. El retinoide va
// marcado "no_diario": la UI lo muestra fuera del paso a paso.
//
// El exfoliante químico salió de todos los tiers por decisión de producto: suma
// costo, riesgo de irritación y un paso más, para un beneficio que no justifica
// la fricción en rutinas pensadas para que la gente las sostenga. La categoría
// sigue definida en CATEGORIAS por si se vuelve atrás.
export const TIERS: Record<"1" | "2" | "3" | "4", RutinaSlot[]> = {
  // Tier 1 · Base — 3 productos
  "1": [
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
  // Tier 2 · Esencial — 5 productos
  "2": [
    { categoria: "limpiador_oleoso", momento: "pm" },
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "tonico", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
  // Tier 3 · Completo — 6 productos
  "3": [
    { categoria: "limpiador_oleoso", momento: "pm" },
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "tonico", momento: "ambos" },
    { categoria: "serum_activo", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
  // Tier 4 · Máximo — 9 productos
  "4": [
    { categoria: "limpiador_oleoso", momento: "pm" },
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "tonico", momento: "ambos" },
    { categoria: "serum_activo", momento: "ambos" },
    { categoria: "serum_secundario", momento: "ambos" },
    { categoria: "contorno", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
    { categoria: "retinoide", momento: "pm", frecuencia: "no_diario" },
  ],
};

// Piel sensible topea en Tier 3. Si alguien con piel sensible elige Tier 4, el
// motor lo baja y la UI lo explica en vez de darle una rutina que la va a irritar.
export const TECHO_POR_PIEL: Record<string, "1" | "2" | "3" | "4"> = {
  sensible: "3",
};

export function tierEfectivo(tierElegido: string, piel: string): "1" | "2" | "3" | "4" {
  const techo = TECHO_POR_PIEL[piel];
  const t = (tierElegido in TIERS ? tierElegido : "1") as "1" | "2" | "3" | "4";
  if (!techo) return t;
  return Number(t) > Number(techo) ? techo : t;
}

// Sustituciones para piel sensible. NO se aplican solas: el motor filtra por
// `apto_sensible`, que es un flag curado producto por producto. Esta tabla es el
// criterio con el que se carga ese flag, y lo que se le muestra a la persona.
export const SUSTITUTOS_SENSIBLE: { evitar: string; usar: string }[] = [
  { evitar: "AHA o BHA", usar: "PHA" },
  { evitar: "Alcohol denat", usar: "fórmula sin alcohol" },
  { evitar: "Fragancia", usar: "sin fragancia" },
  { evitar: "Protector solar químico", usar: "protector mineral" },
  { evitar: "Retinol", usar: "bakuchiol o ácido azelaico" },
  { evitar: "Vitamina C pura", usar: "derivados de vitamina C" },
];

export const skincareQuiz: QuizConfig = {
  slug: "skincare",
  intro: "Tu rutina ideal en 5 toques · 40s",
  armando: "armando tu rutina",
  questions: [
    {
      urlKey: "p",
      title: "¿Cómo sentís tu piel a media tarde?",
      options: [
        { value: "grasa", label: "Con brillo, se ve grasa", short: "Piel grasa" },
        { value: "mixta", label: "Zona T grasa, mejillas normales", short: "Piel mixta" },
        { value: "normal", label: "Cómoda, ni tirante ni grasa", short: "Piel normal" },
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
      title: "¿Cuánto querés gastar?",
      options: [
        { value: "1", label: PRESUPUESTO["1"], hint: "lo justo y necesario" },
        { value: "2", label: PRESUPUESTO["2"], hint: "buena relación precio-calidad" },
        { value: "3", label: PRESUPUESTO["3"], hint: "sin mirar el precio" },
      ],
    },
    {
      urlKey: "k",
      title: "¿Querés que te incluyamos productos coreanos?",
      options: [
        {
          value: "si",
          label: "Sí, quiero probar",
          short: "con coreanos",
          hint: "suma el tónico, el paso más típico de esas rutinas",
        },
        {
          value: "no",
          label: "Prefiero lo de siempre",
          short: "sin coreanos",
          hint: "sin tónico, un paso menos",
        },
        {
          value: "tanto",
          label: "Me da igual, quiero lo que funcione",
          short: "lo que funcione",
          hint: "elegimos el mejor de cada paso, venga de donde venga",
        },
      ],
    },
    {
      urlKey: "n",
      title: "¿Cuántos pasos estás dispuesta a hacer?",
      options: [
        { value: "1", label: "Lo mínimo que funcione", hint: "3 productos" },
        { value: "2", label: "Un poco más completo", hint: "4 o 5 productos" },
        { value: "3", label: "Rutina en serio", hint: "5 o 6 productos" },
        { value: "4", label: "Todo el ritual", hint: "8 o 9 productos" },
      ],
    },
  ],
  categorias: CATEGORIAS,
  recomendacion: {
    pielKey: "p",
    objetivoKey: "o",
    presupuestoKey: "b",
    rutinaKey: "n",
    rutinas: TIERS,
    techoPorPiel: TECHO_POR_PIEL,
    rama: {
      key: "k",
      origenes: {
        si: ["coreano"],
        no: ["europeo", "nacional"],
        tanto: [],
      },
      // Si no quiere coreanos, el tónico se va: en occidente ese paso no se usa.
      // La doble limpieza NO se saca — el aceite desmaquillante también se usa
      // acá, sólo que no se lo llama "paso 1 de 2".
      quitarCategorias: {
        no: ["tonico"],
      },
      nota: {
        si: copy.notas.coreano,
        no: copy.notas.occidental,
        tanto: copy.notas.mixto,
      },
    },
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

// Compatibilidad: el nombre viejo apuntaba a 2 variantes. Ahora son 4 tiers.
export const RUTINAS = TIERS;
