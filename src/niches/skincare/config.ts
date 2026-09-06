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
// DOS PASOS QUE NO ESTÁN, Y ES A PROPÓSITO:
//
// · El exfoliante químico salió por decisión de producto: suma costo, riesgo de
//   irritación y un paso más, para un beneficio que no justifica la fricción en
//   rutinas pensadas para que la gente las sostenga.
//
// · El tónico salió por el mismo criterio. Un tónico nunca es un paso necesario:
//   es completamente opcional, y no debería ocupar un slot esencial en ningún
//   tier. Antes estaba en los tiers 2, 3 y 4 de la rama coreana, y eso tenía dos
//   costos: le sumaba un frasco a la rutina sin sumarle resultado, y —como el
//   catálogo tenía un solo tónico— metía sus activos en cientos de rutinas sin
//   que nadie lo hubiera decidido. La medición de `npm run huecos` lo puso
//   primero en la lista de "productos a comprar" con casi el 25% de los
//   conflictos; la respuesta correcta no era comprar otro tónico, era sacar el
//   paso. Sacarlo salió gratis y le bajó el costo a la persona.
//
// Las dos categorías siguen definidas en CATEGORIAS por si se vuelven atrás, o
// para ofrecerlas alguna vez como extra opcional fuera del paso a paso.
export const TIERS: Record<"1" | "2" | "3" | "4", RutinaSlot[]> = {
  // Tier 1 · Base — 3 productos
  "1": [
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
  // Tier 2 · Esencial — 4 productos
  "2": [
    { categoria: "limpiador_oleoso", momento: "pm" },
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
  // Tier 3 · Completo — 5 productos
  "3": [
    { categoria: "limpiador_oleoso", momento: "pm" },
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "serum_activo", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
  // Tier 4 · Máximo — 8 productos
  "4": [
    { categoria: "limpiador_oleoso", momento: "pm" },
    { categoria: "limpiador", momento: "ambos" },
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
          hint: "texturas más livianas y fórmulas con calmantes",
        },
        {
          value: "no",
          label: "Prefiero lo de siempre",
          short: "sin coreanos",
          hint: "dermocosmética de farmacia",
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
        { value: "2", label: "Un poco más completo", hint: "4 productos" },
        { value: "3", label: "Rutina en serio", hint: "5 productos" },
        { value: "4", label: "Todo el ritual", hint: "8 productos" },
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
      // Ya no saca ninguna categoría. Antes la rama occidental quitaba el
      // tónico; ahora el tónico no está en ningún tier, así que la rama es lo
      // que siempre debió ser: una preferencia de procedencia, nada más.
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
