// Motor de compatibilidad entre ingredientes activos. Determinístico, sin IA, y
// —como el motor de recomendación— no sabe nada de skincare: recibe un
// diccionario de activos, un juego de reglas y una rutina ya armada, y devuelve
// qué choca, qué se potencia y qué conviene hacer al respecto.
//
// ─────────────────────────────────────────────────────────────────────────────
// POR QUÉ ESTE ARCHIVO EXISTE
//
// "No mezclar X con Y" esconde cuatro fenómenos que no tienen nada que ver entre
// sí y que se arreglan de maneras distintas. Meterlos en la misma bolsa es el
// origen de casi toda la desinformación que circula:
//
//   1. degradacion — una molécula destruye a la otra. Química medible, con
//      papers. Ej.: el peróxido de benzoilo oxida la tretinoína. No se arregla
//      esperando cinco minutos: hay que separarlas de momento (AM/PM) o cambiar
//      de molécula.
//
//   2. ph — una necesita medio ácido para entrar y la otra trabaja en neutro.
//      Real en un vaso de precipitado, mucho menos dramático sobre la piel
//      (las fórmulas terminadas están tamponadas). Se atenúa con el ORDEN.
//
//   3. irritacion — no hay reacción química: hay barrera. Dos exfoliantes y un
//      retinoide la misma noche no se "desactivan", te dejan la cara roja y
//      abandonás la rutina a la semana. Es el motivo REAL de la mayoría de los
//      "no mezclar" que circulan. Se arregla con CALENDARIO, no con orden.
//
//   4. redundancia — no es peligroso, es plata tirada. Varios productos que
//      aportan lo mismo. Para un sitio de afiliados esto importa el doble: si
//      recomendamos cuatro fuentes de niacinamida, estamos vendiendo cuatro
//      cosas para conseguir una.
//
// La severidad y la acción sugerida salen de la clase, no del criterio del día.
// ─────────────────────────────────────────────────────────────────────────────

import type { Momento, PasoRutina, Producto, RespuestasRutina, Rutina, RutinaSlot } from "./recomendacion";
import { candidatosPaso } from "./recomendacion";

export type ClaseConflicto =
  | "degradacion"
  | "ph"
  | "irritacion"
  | "redundancia"
  | "momento";

/** Qué tan fuerte es el aviso. De más a menos grave. */
export type Severidad = "separar" | "cuidado" | "nota";

export const severidadPeso: Record<Severidad, number> = {
  separar: 3,
  cuidado: 2,
  nota: 1,
};

export interface Activo {
  id: string;
  /** Cómo se le dice en la card, en castellano. */
  nombre: string;
  /** Agrupa activos que se comportan igual. Las reglas pueden apuntar a "familia:aha". */
  familia: string;
  /**
   * Pertenencias transversales, para reglas que cortan por otro lado. El caso
   * concreto es "exfoliante": junta AHA, BHA y PHA a los fines de contar carga
   * acumulada, pero las reglas de par necesitan seguir distinguiéndolos, porque
   * PHA + retinoide es justamente la combinación recomendada para piel reactiva
   * y AHA + retinoide no lo es. Se apuntan con "grupo:exfoliante".
   */
  grupos?: string[];
  /**
   * Carga irritativa aproximada, 0 a 3. Se suma por momento para detectar
   * rutinas que, sin tener ningún choque puntual, piden demasiado de una vez.
   * 0 = calmante o inerte · 1 = suave · 2 = activo de verdad · 3 = fuerte.
   */
  carga: number;
  /** La luz lo degrada o fotosensibiliza: si cae en un paso de mañana, se avisa. */
  soloNoche?: boolean;
  /** Rango de pH en el que la fórmula suele trabajar. Informativo. */
  ph?: [number, number];
  /** Qué respalda la clasificación. Se muestra en la página pública de criterios. */
  evidencia?: string;
}

/**
 * Un extremo de regla. Tres formas, de la más específica a la más amplia:
 *   "retinol"             → ese activo
 *   "familia:aha"         → todos los de esa familia
 *   "grupo:exfoliante"    → todos los que declaran ese grupo
 */
export type Extremo = string;

export interface Regla {
  id: string;
  entre: [Extremo, Extremo];
  clase: ClaseConflicto;
  severidad: Severidad;
  /**
   * true  = sólo hay problema si caen en el mismo momento (misma aplicación).
   * false = hay problema aunque uno vaya a la mañana y el otro a la noche.
   */
  soloMismoMomento: boolean;
  titulo: string;
  /** Qué pasa, en una o dos oraciones, sin jerga. */
  explicacion: string;
  /** Qué hacer al respecto. Es lo único accionable: va siempre. */
  queHacer: string;
  evidencia?: string;
}

/**
 * Demasiado de lo mismo. No es un choque entre dos moléculas: es contar cuántos
 * productos distintos aportan la misma familia dentro de un mismo momento.
 */
export interface ReglaAcumulacion {
  id: string;
  /** Sobre qué se cuenta: activo, "familia:x" o "grupo:x". */
  sobre: Extremo;
  /** A partir de cuántos productos distintos se avisa. */
  desde: number;
  clase: ClaseConflicto;
  severidad: Severidad;
  titulo: string;
  explicacion: string;
  queHacer: string;
  evidencia?: string;
}

/**
 * Combinaciones que conviene señalar porque suman. Existen por dos motivos: uno
 * informativo y otro comercial. Una rutina que explica por qué dos productos se
 * potencian se sostiene mejor que una lista de nueve frascos.
 */
export interface Sinergia {
  id: string;
  /** Todos tienen que estar presentes para que aplique. */
  requiere: Extremo[];
  /** Si es true, tienen que estar en el mismo momento. */
  mismoMomento: boolean;
  titulo: string;
  explicacion: string;
  evidencia?: string;
  /**
   * false para las sinergias que no son entre DOS ingredientes sino sobre la
   * estructura de la rutina ("poné un hidratante con barrera si usás activos",
   * "usá protector si trabajás manchas"). Son ciertas y valen en la pantalla de
   * resultados, pero puestas en una celda de la matriz confunden: la celda
   * promete hablar de un par y termina hablando de otra cosa.
   * Por omisión, true.
   */
  enMatriz?: boolean;
}

/**
 * Un "no mezclar" que circula y que la evidencia no sostiene. Se modela porque
 * hay que poder DESMENTIRLO activamente: si a alguien le toca vitamina C y
 * niacinamida en la misma rutina, el sitio tiene que decir "esto se puede y
 * además conviene", no quedarse callado y dejar que lo googlee.
 */
export interface Mito {
  id: string;
  requiere: Extremo[];
  titulo: string;
  /** La versión que circula. */
  loQueSeDice: string;
  /** Lo que sostiene la evidencia. */
  loQueSabemos: string;
  evidencia?: string;
}

export interface Presencia {
  activoId: string;
  productoId: string;
  productoNombre: string;
  categoria: string;
}

export interface Conflicto {
  reglaId: string;
  clase: ClaseConflicto;
  severidad: Severidad;
  titulo: string;
  explicacion: string;
  queHacer: string;
  evidencia?: string;
  /** En qué momentos se da. Vacío = transversal a la rutina. */
  momentos: Momento[];
  /** Categorías de los pasos involucrados, para que la UI los marque. */
  categorias: string[];
  /** Nombres de producto involucrados, para el texto del aviso. */
  productos: string[];
}

export interface SinergiaDetectada {
  sinergiaId: string;
  titulo: string;
  explicacion: string;
  evidencia?: string;
  productos: string[];
}

export interface MitoDetectado {
  mitoId: string;
  titulo: string;
  loQueSeDice: string;
  loQueSabemos: string;
  evidencia?: string;
  productos: string[];
}

export interface AnalisisCompatibilidad {
  conflictos: Conflicto[];
  sinergias: SinergiaDetectada[];
  mitos: MitoDetectado[];
  /** Suma de carga irritativa por momento. */
  carga: { am: number; pm: number };
  /** Activos presentes por momento, ya resueltos. Útil para tests y auditoría. */
  presencias: { am: Presencia[]; pm: Presencia[] };
}

export interface CatalogoActivos {
  activos: Record<string, Activo>;
  reglas: Regla[];
  acumulacion: ReglaAcumulacion[];
  sinergias: Sinergia[];
  mitos: Mito[];
  /** Clave estable del producto (acá: ml_id) → ids de activo. */
  porProducto: Record<string, string[]>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Resolución de extremos
// ─────────────────────────────────────────────────────────────────────────────

const PREFIJO_FAMILIA = "familia:";
const PREFIJO_GRUPO = "grupo:";

/**
 * Se exporta para que la página pública de criterios pueda derivar la matriz de
 * combinaciones de las MISMAS reglas que usa el motor. Si la matriz se
 * escribiera a mano, tarde o temprano diría algo distinto de lo que el sitio
 * hace, y ese es exactamente el tipo de contradicción que arruina la confianza.
 */
export function activoCoincide(extremo: Extremo, activo: Activo): boolean {
  return coincide(extremo, activo);
}

function coincide(extremo: Extremo, activo: Activo): boolean {
  if (extremo.startsWith(PREFIJO_FAMILIA)) {
    return activo.familia === extremo.slice(PREFIJO_FAMILIA.length);
  }
  if (extremo.startsWith(PREFIJO_GRUPO)) {
    return (activo.grupos ?? []).includes(extremo.slice(PREFIJO_GRUPO.length));
  }
  return activo.id === extremo;
}

function presenciasQueCoinciden(
  extremo: Extremo,
  presencias: Presencia[],
  activos: Record<string, Activo>,
): Presencia[] {
  return presencias.filter((p) => {
    const a = activos[p.activoId];
    return a ? coincide(extremo, a) : false;
  });
}

function unicos(xs: string[]): string[] {
  return [...new Set(xs)];
}

// ─────────────────────────────────────────────────────────────────────────────
// Presencias: qué activo entra en juego, en qué momento y por qué producto
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `armarRutina` ya devuelve los pasos de momento "ambos" duplicados en las dos
 * listas, así que acá alcanza con leer cada lista tal cual viene.
 *
 * Un id de activo que no está en el diccionario se ignora en silencio a
 * propósito: preferimos un aviso de menos a una pantalla de error después de que
 * la persona respondió el quiz. La auditoría (`npm run auditar`) los reporta.
 */
export function presenciasDe(
  pasos: PasoRutina[],
  catalogo: CatalogoActivos,
  claveProducto: (p: PasoRutina) => string,
): Presencia[] {
  const out: Presencia[] = [];
  for (const paso of pasos) {
    const ids = catalogo.porProducto[claveProducto(paso)] ?? [];
    for (const activoId of ids) {
      if (!catalogo.activos[activoId]) continue;
      out.push({
        activoId,
        productoId: paso.producto.id,
        productoNombre: paso.producto.nombre,
        categoria: paso.slot.categoria,
      });
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Análisis
// ─────────────────────────────────────────────────────────────────────────────

export function analizarRutina(
  rutina: { am: PasoRutina[]; pm: PasoRutina[] },
  catalogo: CatalogoActivos,
  claveProducto: (p: PasoRutina) => string,
): AnalisisCompatibilidad {
  const presencias = {
    am: presenciasDe(rutina.am, catalogo, claveProducto),
    pm: presenciasDe(rutina.pm, catalogo, claveProducto),
  };
  const todas = [...presencias.am, ...presencias.pm];
  const conflictos: Conflicto[] = [];

  // 1 · Activos que la luz degrada, puestos a la mañana.
  for (const p of presencias.am) {
    const a = catalogo.activos[p.activoId];
    if (!a?.soloNoche) continue;
    conflictos.push({
      reglaId: "momento:" + a.id,
      clase: "momento",
      severidad: "separar",
      titulo: a.nombre + " va de noche",
      explicacion:
        "La luz UV degrada este activo. Puesto a la mañana rinde bastante menos de lo que promete " +
        "el envase, y además es el momento del día en el que menos falta hace.",
      queHacer: "Movelo a la rutina de noche. A la mañana, el último paso es el protector solar.",
      evidencia: a.evidencia,
      momentos: ["am"],
      categorias: [p.categoria],
      productos: [p.productoNombre],
    });
  }

  // 2 · Reglas de par.
  for (const regla of catalogo.reglas) {
    const [ext1, ext2] = regla.entre;

    if (regla.soloMismoMomento) {
      const momentos: Momento[] = [];
      let categorias: string[] = [];
      let productos: string[] = [];

      for (const m of ["am", "pm"] as const) {
        const lado1 = presenciasQueCoinciden(ext1, presencias[m], catalogo.activos);
        const lado2 = presenciasQueCoinciden(ext2, presencias[m], catalogo.activos);
        // Los dos extremos dentro del MISMO producto no son un choque: son una
        // fórmula que ya resolvió el problema puertas adentro (adapaleno + PB,
        // C + E + ferúlico, niacinamida + ácido salicílico del sérum de Garnier).
        const cruce = lado1.some((a) => lado2.some((b) => b.productoId !== a.productoId));
        if (!cruce) continue;
        momentos.push(m);
        categorias = unicos([
          ...categorias,
          ...lado1.map((x) => x.categoria),
          ...lado2.map((x) => x.categoria),
        ]);
        productos = unicos([
          ...productos,
          ...lado1.map((x) => x.productoNombre),
          ...lado2.map((x) => x.productoNombre),
        ]);
      }

      if (momentos.length) {
        conflictos.push({
          reglaId: regla.id,
          clase: regla.clase,
          severidad: regla.severidad,
          titulo: regla.titulo,
          explicacion: regla.explicacion,
          queHacer: regla.queHacer,
          evidencia: regla.evidencia,
          momentos,
          categorias,
          productos,
        });
      }
      continue;
    }

    // Regla transversal: alcanza con que los dos estén en la rutina.
    const lado1 = presenciasQueCoinciden(ext1, todas, catalogo.activos);
    const lado2 = presenciasQueCoinciden(ext2, todas, catalogo.activos);
    if (!lado1.some((a) => lado2.some((b) => b.productoId !== a.productoId))) continue;

    conflictos.push({
      reglaId: regla.id,
      clase: regla.clase,
      severidad: regla.severidad,
      titulo: regla.titulo,
      explicacion: regla.explicacion,
      queHacer: regla.queHacer,
      evidencia: regla.evidencia,
      momentos: [],
      categorias: unicos([...lado1, ...lado2].map((x) => x.categoria)),
      productos: unicos([...lado1, ...lado2].map((x) => x.productoNombre)),
    });
  }

  // 3 · Acumulación: cuántos PRODUCTOS distintos aportan la misma familia.
  for (const regla of catalogo.acumulacion) {
    const momentos: Momento[] = [];
    let categorias: string[] = [];
    let productos: string[] = [];

    for (const m of ["am", "pm"] as const) {
      const dePila = presenciasQueCoinciden(regla.sobre, presencias[m], catalogo.activos);
      if (unicos(dePila.map((x) => x.productoId)).length < regla.desde) continue;
      momentos.push(m);
      categorias = unicos([...categorias, ...dePila.map((x) => x.categoria)]);
      productos = unicos([...productos, ...dePila.map((x) => x.productoNombre)]);
    }

    if (momentos.length) {
      conflictos.push({
        reglaId: regla.id,
        clase: regla.clase,
        severidad: regla.severidad,
        titulo: regla.titulo,
        explicacion: regla.explicacion,
        queHacer: regla.queHacer,
        evidencia: regla.evidencia,
        momentos,
        categorias,
        productos,
      });
    }
  }

  // 4 · Sinergias.
  const sinergias: SinergiaDetectada[] = [];
  for (const s of catalogo.sinergias) {
    const fuentes: Presencia[][] = s.mismoMomento ? [presencias.am, presencias.pm] : [todas];
    for (const fuente of fuentes) {
      const porRequisito = s.requiere.map((ext) =>
        presenciasQueCoinciden(ext, fuente, catalogo.activos),
      );
      if (porRequisito.some((x) => x.length === 0)) continue;
      sinergias.push({
        sinergiaId: s.id,
        titulo: s.titulo,
        explicacion: s.explicacion,
        evidencia: s.evidencia,
        productos: unicos(porRequisito.flat().map((x) => x.productoNombre)),
      });
      break; // con detectarla una vez alcanza
    }
  }

  // 5 · Mitos que conviene desmentir cuando la combinación aparece.
  const mitos: MitoDetectado[] = [];
  for (const m of catalogo.mitos) {
    const porRequisito = m.requiere.map((ext) =>
      presenciasQueCoinciden(ext, todas, catalogo.activos),
    );
    if (porRequisito.some((x) => x.length === 0)) continue;
    mitos.push({
      mitoId: m.id,
      titulo: m.titulo,
      loQueSeDice: m.loQueSeDice,
      loQueSabemos: m.loQueSabemos,
      evidencia: m.evidencia,
      productos: unicos(porRequisito.flat().map((x) => x.productoNombre)),
    });
  }

  // 6 · Carga irritativa por momento. Cada activo cuenta una sola vez: dos
  // productos con niacinamida no irritan el doble. Que sean dos es redundancia,
  // y de eso ya se ocupa la regla de acumulación.
  const cargaDe = (ps: Presencia[]) =>
    unicos(ps.map((p) => p.activoId)).reduce(
      (acc, id) => acc + (catalogo.activos[id]?.carga ?? 0),
      0,
    );

  conflictos.sort(
    (a, b) =>
      severidadPeso[b.severidad] - severidadPeso[a.severidad] ||
      a.reglaId.localeCompare(b.reglaId),
  );

  return {
    conflictos,
    sinergias,
    mitos,
    carga: { am: cargaDe(presencias.am), pm: cargaDe(presencias.pm) },
    presencias,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ARMADO QUE EVITA CONFLICTOS
//
// Hasta acá el motor de compatibilidad sólo miraba: `armarRutina` elegía cada
// paso por separado y después se contaba qué había chocado. Eso alcanzaba
// mientras el catálogo no podía generar un choque grave. Con retinoides y
// vitamina C pura adentro, no alcanza más: avisar "esto no lo uses junto" sobre
// una rutina que armamos nosotros es raro, y encima es evitable.
//
// La regla de oro de este armado: **esquivar un conflicto NUNCA cuesta calidad
// de match.** Si alguien pidió algo para las manchas, se le da algo para las
// manchas. Entre los que sirven para las manchas, se prefiere el que no choca.
// Por eso se elige siempre dentro del mismo nivel de fallback que hubiera
// elegido el motor de antes: no se degrada la respuesta para quedar prolijo.
//
// El orden en que se recorren los pasos importa y es una decisión, no un
// detalle: primero se eligen los pasos que DEFINEN la rutina —el sérum activo,
// el retinoide— sobre su propio mérito, y después los pasos de soporte se
// acomodan alrededor. Al revés, un limpiador cualquiera podría condicionar cuál
// tratamiento recibe la persona, que es exactamente al revés de lo que hay que
// hacer.
// ─────────────────────────────────────────────────────────────────────────────

const ORDEN_DE_ELECCION = [
  "serum_activo", // el tratamiento: es el motivo por el que la persona vino
  "retinoide",
  "exfoliante",
  "serum_secundario",
  "protector_solar", // no negociable: se elige por mérito, no por comodidad
  "hidratante",
  "tonico",
  "contorno",
  "limpiador",
  "limpiador_oleoso",
];

function pesoDeOrden(categoria: string): number {
  const i = ORDEN_DE_ELECCION.indexOf(categoria);
  return i === -1 ? ORDEN_DE_ELECCION.length : i;
}

function rutinaDePasos(pasos: PasoRutina[]): Rutina {
  return {
    am: pasos.filter((p) => p.slot.momento === "am" || p.slot.momento === "ambos"),
    pm: pasos.filter((p) => p.slot.momento === "pm" || p.slot.momento === "ambos"),
  };
}

/**
 * Arma la rutina eligiendo, dentro de cada nivel de match, el producto que menos
 * choca con lo ya elegido.
 *
 * El desempate está ordenado a propósito:
 *   1. conflictos "separar"  — nunca se acepta uno si hay alternativa
 *   2. prioridad del producto — qué tan bueno es para ese paso
 *   3. conflictos "cuidado"  — manejables; no valen sacrificar un mejor producto
 *   4. conflictos "nota"     — redundancia; sólo importa si todo lo demás empata
 *   5. precio                — el desempate de siempre
 *
 * Que "cuidado" vaya DEBAJO de prioridad es la decisión más discutible de todo
 * esto, y es deliberada: un aviso de "separalos por momento" se resuelve con una
 * instrucción de una línea, mientras que darle a alguien un producto peor no se
 * resuelve con nada.
 */
export function armarRutinaEvitandoConflictos(
  productos: Producto[],
  slots: RutinaSlot[],
  r: RespuestasRutina,
  catalogo: CatalogoActivos,
  claveProducto: (p: PasoRutina) => string,
): Rutina {
  const orden = slots
    .map((slot, i) => ({ slot, i }))
    .sort((a, b) => pesoDeOrden(a.slot.categoria) - pesoDeOrden(b.slot.categoria) || a.i - b.i);

  const elegidos: { paso: PasoRutina; i: number }[] = [];

  for (const { slot, i } of orden) {
    const { productos: candidatos, fallback } = candidatosPaso(productos, slot, r);

    let mejor: PasoRutina | null = null;
    let mejorPuntaje: [number, number, number, number] | null = null;

    for (const producto of candidatos) {
      const paso: PasoRutina = { slot, producto, fallback };
      const analisis = analizarRutina(
        rutinaDePasos([...elegidos.map((e) => e.paso), paso]),
        catalogo,
        claveProducto,
      );

      let separar = 0;
      let cuidado = 0;
      let nota = 0;
      for (const c of analisis.conflictos) {
        if (c.severidad === "separar") separar++;
        else if (c.severidad === "cuidado") cuidado++;
        else nota++;
      }

      // `candidatos` ya viene ordenado por prioridad y precio, así que para
      // desempatar esos dos alcanza con quedarse con el primero que gane: se
      // usa el índice como sustituto del orden original.
      const puntaje: [number, number, number, number] = [
        separar,
        -producto.prioridad,
        cuidado,
        nota,
      ];

      if (!mejorPuntaje || menor(puntaje, mejorPuntaje)) {
        mejor = paso;
        mejorPuntaje = puntaje;
      }
    }

    // `candidatosPaso` nunca devuelve vacío: o hay candidatos o levanta excepción.
    elegidos.push({ paso: mejor!, i });
  }

  // Se devuelve en el orden original de los slots, no en el de elección.
  return rutinaDePasos(elegidos.sort((a, b) => a.i - b.i).map((e) => e.paso));
}

/** Comparación lexicográfica de puntajes. Estrictamente menor = mejor. */
function menor(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i];
  }
  return false;
}
