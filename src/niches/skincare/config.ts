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
// ─────────────────────────────────────────────────────────────────────────────
// LOS TIERS SE DEFINEN POR LO QUE AGREGAN, NO POR CUÁNTOS FRASCOS SON
//
// Antes eran cuatro escalones de 3, 5, 6 y 9 productos, y la pregunta del quiz
// era "¿cuántos pasos estás dispuesta a hacer?". Medirlo cambió la respuesta.
// `npm run rendimiento` compara los tiers sobre las mismas respuestas:
//
//   tier  pasos  cubre el objetivo  conflictos/rutina  graves/rutina
//    T1     3          98%                0,23             0,00
//    T2     4          99%                0,23             0,00
//    T3     5         100%                0,82             0,02
//    T4     8         100%                3,09             0,76
//
// El Tier 4 sumaba tres pasos, CERO puntos de cobertura y 13 veces los
// conflictos de la base. Los pasos que agregaba —ampolla, contorno, retinoide—
// no atacaban nada que la rutina no atacara ya, y sí metían activos que chocan
// entre sí. Vendíamos tres frascos más para empeorar el resultado.
//
// Así que el Tier 4 dejó de existir como rutina. Sus productos siguen en el
// catálogo y se ofrecen aparte, como lo que son: opcionales.
//
// Lo esencial son tres pasos —limpiador, hidratante y protector solar— y el
// resto se gana el lugar o no entra.
//
// LA DOBLE LIMPIEZA TAMPOCO SE LO GANÓ. Estuvo un rato como escalón 3 con el
// argumento de que "saca bien el protector solar", pero al corroborarlo contra
// fuentes serias el argumento no se sostuvo como paso necesario:
//
//   · Cleveland Clinic (Dra. Wu, dermatóloga): "Double cleansing is usually not
//     necessary"; lavarse una vez bien con un limpiador suave "is more than
//     adequate". Y advierte lo contrario de lo que se supone: el sobrelavado
//     seca, irrita y rompe la barrera.
//   · La misma fuente ordena las prioridades sin vueltas: hay pasos más
//     importantes, como el antioxidante y el protector solar.
//   · La American Academy of Dermatology recomienda lavarse la cara dos veces
//     por día con un limpiador suave. UNA limpieza por vez, no dos.
//   · El origen del hábito es cultural —de las geishas japonesas al régimen
//     coreano de diez pasos—, no clínico.
//
// Sigue teniendo una función real para quien usa maquillaje resistente al agua
// o un protector muy waterproof: un limpiador oleoso saca más residuo en una
// sola pasada. Eso lo vuelve una buena opción para algunas personas, no un paso
// de la rutina de todas. Va al catálogo, como opcional.
// ─────────────────────────────────────────────────────────────────────────────
export const TIERS: Record<"1" | "2", RutinaSlot[]> = {
  // Base · 3 productos — lo único que no es opcional
  "1": [
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
  // Base + tratamiento · 4 productos — el único paso que cambia el resultado.
  // El sérum va después de limpiar y antes de hidratar: es el orden de
  // aplicación correcto y el que define este array.
  "2": [
    { categoria: "limpiador", momento: "ambos" },
    { categoria: "serum_activo", momento: "ambos" },
    { categoria: "hidratante", momento: "ambos" },
    { categoria: "protector_solar", momento: "am" },
  ],
};

/**
 * Categorías que existen en el catálogo pero que NO son un paso de ninguna
 * rutina. Se ofrecen en el catálogo navegable, nunca dentro del paso a paso.
 *
 * No es una lista de descarte: es una lista de cosas opcionales. El retinoide
 * es el activo con más evidencia para arrugas y no está acá por malo — está
 * porque meterlo en una rutina automática, junto a un exfoliante y sin
 * acompañamiento, genera más problemas que soluciones.
 */
export const CATEGORIAS_OPCIONALES = [
  "limpiador_oleoso",
  "tonico",
  "exfoliante",
  "serum_secundario",
  "contorno",
  "retinoide",
] as const;

// Piel sensible topea en Tier 3. Si alguien con piel sensible elige Tier 4, el
// motor lo baja y la UI lo explica en vez de darle una rutina que la va a irritar.
// Techo por tipo de piel. Hoy no recorta nada, porque el escalón más alto ya es
// el 3 — quedó como no-op cuando se eliminó el Tier 4. Se deja porque el
// mecanismo sigue siendo el correcto si algún día vuelve a haber un escalón por
// encima, y porque borrarlo escondería una decisión que conviene tener a la vista.
export const TECHO_POR_PIEL: Record<string, "1" | "2"> = {
  sensible: "2",
};

export function tierEfectivo(tierElegido: string, piel: string): "1" | "2" {
  const techo = TECHO_POR_PIEL[piel];
  const t = (tierElegido in TIERS ? tierElegido : "1") as "1" | "2";
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
      // La pregunta ya no es por cantidad de pasos sino por qué se le suma a la
      // base, porque medimos que la cantidad no predice el resultado: el Tier 4
      // tenía cinco pasos más que la base y la misma cobertura.
      title: "¿Querés sumarle algo a la base?",
      options: [
        {
          value: "1",
          label: "Solo lo esencial",
          short: "solo la base",
          hint: "3 pasos: limpiar, hidratar y protegerte del sol",
        },
        {
          value: "2",
          label: "Sumale un tratamiento",
          short: "con tratamiento",
          hint: "4 pasos: un sérum para lo que querés cambiar",
        },
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
