import type { Producto } from "../src/engine/recomendacion";

// Productos hipotéticos, para simular. NO son catálogo: no tienen link ni
// precio y nunca se importan desde la app. Existen para poder contestar con un
// número la pregunta "¿qué habría que comprar?" en vez de con una opinión.
//
// Cada uno se define por lo que APORTA —sus activos y a qué pieles sirve—, no
// por una marca. La marca se elige después; lo que el motor necesita es el
// perfil. Correr `npm run huecos -- --proyectar --simular` mide cuánto destraba
// cada uno.

export interface CandidatoDeCompra {
  /** Por qué está en la lista. */
  razon: string;
  /** Qué buscar en Mercado Libre, en criollo. */
  queBuscar: string;
  producto: Producto;
  activos: string[];
}

function base(id: string, categoria: string, momento: Producto["momento"]): Producto {
  return {
    id: `hipotetico-${id}`,
    ml_id: `HIPOTETICO_${id}`,
    nombre: id,
    marca: "(a definir)",
    categoria,
    paso: 0,
    momento,
    tipos_piel: ["grasa", "mixta", "normal", "seca", "sensible"],
    preocupaciones: [],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 2,
    link_afiliado: "",
    relevado: "2026-09-06",
    prioridad: 4,
    comodin: false,
    activo: true,
  };
}

export const CANDIDATOS_A_COMPRAR: CandidatoDeCompra[] = [
  // RESUELTO SIN COMPRAR NADA — se deja documentado porque es el mejor ejemplo
  // de para qué sirve medir antes de comprar.
  //
  // El tónico salía primero en este ranking con 226 conflictos, casi el 25% del
  // total: había uno solo en el catálogo y era obligatorio en tres tiers. La
  // conclusión automática era "comprar otro tónico". La correcta era que un
  // tónico nunca es un paso necesario, así que el paso salió de los tiers y el
  // hueco desapareció solo. Salió gratis y además le acortó la rutina a la
  // persona. Ver config.ts › TIERS.
  {
    razon:
      "Los tres retinoides del catálogo traen fragancia, y dos traen alcohol denat. Para piel " +
      "reactiva no hay ninguno servible, y en las rutinas con exfoliante no hay forma de esquivar " +
      "el choque porque no existe una alternativa más limpia.",
    queBuscar:
      "Retinol o retinaldehído encapsulado SIN fragancia ni alcohol denat, idealmente con " +
      "niacinamida o ceramidas en la misma fórmula",
    producto: {
      ...base("Retinoide sin fragancia", "retinoide", "pm"),
      preocupaciones: ["textura", "manchas"],
      relevado: "2026-09-06",
      prioridad: 5,
      comodin: true,
    },
    activos: ["retinol", "niacinamida", "ceramidas"],
  },
  {
    razon:
      "Único activo con evidencia A para acné, rosácea, manchas y marcas a la vez, que además " +
      "no choca con nada y es compatible con el embarazo. Es el hueco de eficacia más grande.",
    queBuscar: "Ácido azelaico 10% a 20% en sérum o gel facial",
    producto: {
      ...base("Sérum de ácido azelaico", "serum_activo", "ambos"),
      preocupaciones: ["acne", "manchas", "textura"],
      relevado: "2026-09-06",
      prioridad: 5,
    },
    activos: ["azelaico", "niacinamida"],
  },
  {
    razon:
      "Piel sensible sigue sin rutina servible: los 7 protectores del catálogo son de filtro " +
      "orgánico y la regla del vault pide mineral. Son 36 pasos que hoy se sirven degradados.",
    queBuscar: "Protector solar facial FPS 50 con óxido de zinc como filtro (no como color)",
    producto: {
      ...base("Protector solar mineral", "protector_solar", "am"),
      preocupaciones: ["manchas"],
      relevado: "2026-09-06",
      prioridad: 5,
      comodin: true,
    },
    activos: ["filtro_mineral", "oxidos_de_hierro"],
  },
  {
    razon:
      "Lo que la tabla de sustitutos de piel sensible promete y el catálogo no tiene. Además es " +
      "el único exfoliante que convive con un retinoide sin sumar carga.",
    queBuscar: "Exfoliante con PHA (gluconolactona o ácido lactobiónico), sin AHA ni BHA",
    producto: {
      ...base("Exfoliante PHA", "exfoliante", "pm"),
      preocupaciones: ["textura", "manchas"],
      relevado: "2026-09-06",
      prioridad: 4,
      comodin: true,
    },
    activos: ["pha_gluconolactona", "panthenol"],
  },
  {
    razon:
      "La mejor dupla con niacinamida para melasma y marcas, sin costo de irritación. El único " +
      "tranexámico del catálogo viene con un complejo de AHA que va en contra.",
    queBuscar: "Sérum de ácido tranexámico 3-5%, sin AHA ni alcohol",
    producto: {
      ...base("Sérum de tranexámico", "serum_activo", "ambos"),
      preocupaciones: ["manchas"],
      relevado: "2026-09-06",
      prioridad: 5,
    },
    activos: ["tranexamico", "niacinamida"],
  },
  {
    razon:
      "Alternativa al retinoide para quien no lo tolera, y para embarazo. Permite ofrecer el " +
      "paso de renovación a piel sensible sin meter un conflicto.",
    queBuscar: "Sérum o crema con bakuchiol 0,5-1%, sin fragancia",
    producto: {
      ...base("Sérum de bakuchiol", "retinoide", "pm"),
      preocupaciones: ["textura", "manchas"],
      relevado: "2026-09-06",
      prioridad: 4,
    },
    activos: ["bakuchiol", "panthenol"],
  },
  {
    razon:
      "Los limpiadores 'para sensible' del catálogo traen salicílico o árbol de té. Falta uno " +
      "que de verdad no tenga nada.",
    queBuscar: "Limpiador en gel o crema sin fragancia, sin BHA, sin aceites esenciales",
    producto: {
      ...base("Limpiador neutro sin fragancia", "limpiador", "ambos"),
      preocupaciones: ["deshidratacion"],
      relevado: "2026-09-06",
      prioridad: 4,
    },
    activos: ["ceramidas", "colesterol", "fitoesfingosina"],
  },
  {
    razon:
      "El slot de ampolla no tiene ninguna opción sin fragancia ni activos fuertes para piel " +
      "reactiva; hoy se resuelve con comodín.",
    queBuscar: "Sérum de ácido hialurónico puro, lista corta, sin fragancia ni alcohol",
    producto: {
      ...base("Sérum hialurónico sin fragancia", "serum_secundario", "ambos"),
      preocupaciones: ["deshidratacion"],
      relevado: "2026-09-06",
      prioridad: 4,
    },
    activos: ["hialuronico", "panthenol", "escualano"],
  },
];
