// Con qué está construida una fórmula: cuánto respalda la literatura los activos
// que trae, menos lo que trae y no aporta.
//
// ─────────────────────────────────────────────────────────────────────────────
// POR QUÉ EXISTE
//
// Durante un tiempo el único criterio graduado fue la popularidad: cuánta gente
// había comprado el producto en Mercado Libre. Eso es reputación, y es un dato
// real, pero no dice con qué está hecho. La calidad de la fórmula no entraba en
// ningún ranking: la escala A–D estaba escrita en
// `docs/INGREDIENTES.md` y no codificada, así que la regla de la casa —"en la
// landing sólo se afirma lo que está en A o B"— no podía aplicarse a nada.
//
// Se notaba. Con el catálogo proyectado, once productos aparecían como
// candidatos y perdían SIEMPRE el desempate, entre ellos el SkinCeuticals C E
// Ferulic, que es el único producto del catálogo con una afirmación de nivel A.
// No perdía por peor: empataba en prioridad y en banda de precio, y ahí se
// acababan los criterios. Lo que decidía era el orden del archivo.
//
// ─────────────────────────────────────────────────────────────────────────────
// LO QUE ESTO **NO** MIDE, Y CONVIENE TENERLO A LA VISTA
//
// El nivel de evidencia es de la MOLÉCULA, no del producto. `INGREDIENTES.md` lo
// dice con todas las letras: el retinol tiene A, y una crema con retinol al
// 0,01% en envase transparente no hereda esa A. Casi ninguna marca declara
// porcentaje, así que la concentración no se puede puntuar sin inventarla — y
// acá no se inventa nada.
//
// Entonces esto se llama `calidadFormula` y no "calidad del producto": dice con
// qué está construida la fórmula, no cuánto rinde. Es un criterio de DESEMPATE
// entre productos que ya empataron en todo lo demás, no una nota.
// ─────────────────────────────────────────────────────────────────────────────

import type { Activo, CatalogoActivos, NivelEvidencia } from "./compatibilidad";

export interface ConfigCalidad {
  /** Cuánto vale un activo según su nivel de evidencia. */
  peso: Record<NivelEvidencia, number>;
  /** Cuánto resta cada lastre a exposición plena. La clave es el id del activo. */
  lastre: Record<string, number>;
  /**
   * De 0 a 1: cuánto de ese activo llega a la piel en esa categoría de producto.
   *
   * Multiplica al lastre y no al aporte, a propósito. Dentro de una categoría el
   * vehículo es el mismo para todos, así que descontarle el aporte a un limpiador
   * sólo lo haría rankear último por ser limpiador. Lo que NO se cancela es la
   * proporción entre lo que el producto aporta y lo que arrastra: una fragancia
   * en algo que se enjuaga a los treinta segundos cuesta mucho menos que la misma
   * fragancia en un sérum que queda ocho horas puesto.
   */
  exposicion(activoId: string, categoria: string): number;
}

export interface Calidad {
  /** Aporte menos lastre. Es el número con el que se ordena. */
  puntaje: number;
  aporte: number;
  lastre: number;
  /** El mejor nivel presente en la fórmula. Sin activos declarados, undefined. */
  mejorNivel?: NivelEvidencia;
  /** Lo que efectivamente contó, mejor primero. Para poder explicar el número. */
  contados: { activo: Activo; nivel: NivelEvidencia; peso: number }[];
  /** Lo que restó, con cuánto restó ya ajustado por exposición. */
  restados: { id: string; costo: number }[];
}

/**
 * Puntúa la fórmula de un producto.
 *
 * Dos decisiones que explican la forma del número:
 *
 * 1. **Se cuenta una vez por familia.** Cuatro fuentes de niacinamida no son
 *    cuatro beneficios: son la `redundancia` que este mismo motor detecta y
 *    avisa. Sin esta regla, el producto con más ingredientes gana siempre, y el
 *    catálogo tiene el contraejemplo perfecto — el Garnier Anti-imperfecciones
 *    apila BHA, AHA, fítico, ascorbil glucósido y niacinamida, y el documento lo
 *    trata como una trampa, no como una virtud.
 *
 * 2. **Cada familia siguiente cuenta la mitad que la anterior.** La segunda vale
 *    la mitad, la tercera un cuarto, la cuarta un octavo. El descuento es fuerte
 *    a propósito: la tesis del proyecto es que una rutina no mejora sumando
 *    frascos, y una fórmula no mejora sumando renglones al INCI. Lo que define a
 *    un producto es aquello alrededor de lo cual está construido.
 *
 *    Se probó con un descuento más suave —dividir por la posición en vez de por
 *    el doble— y el resultado desmentía al documento: el Garnier Anti Manchas,
 *    que apila seis familias y trae fragancia, quedaba a 0,15 de la fórmula de
 *    Pinnell, que `INGREDIENTES.md` §10.1 describe como lo único del catálogo que
 *    "se puede afirmar sin matices". Cuando el número y el criterio escrito no
 *    coinciden, el que está mal es el número.
 */
export function calidadFormula(
  activos: string[],
  catalogo: CatalogoActivos,
  categoria: string,
  cfg: ConfigCalidad,
): Calidad {
  const resueltos = activos.map((id) => catalogo.activos[id]).filter((a): a is Activo => Boolean(a));

  // ── Aporte: lo mejor de cada familia, con descuento por posición ───────────
  const porFamilia = new Map<string, { activo: Activo; nivel: NivelEvidencia; peso: number }>();
  for (const a of resueltos) {
    if (!a.nivelEvidencia) continue;
    const peso = cfg.peso[a.nivelEvidencia];
    const previo = porFamilia.get(a.familia);
    if (!previo || peso > previo.peso) {
      porFamilia.set(a.familia, { activo: a, nivel: a.nivelEvidencia, peso });
    }
  }
  const contados = [...porFamilia.values()].sort(
    (x, y) => y.peso - x.peso || x.activo.id.localeCompare(y.activo.id),
  );
  const aporte = contados.reduce((suma, c, i) => suma + c.peso / 2 ** i, 0);

  // ── Lastre: lo que no aporta y sí suma costo, ajustado por exposición ──────
  const restados = resueltos
    .filter((a) => cfg.lastre[a.id] !== undefined)
    .map((a) => ({ id: a.id, costo: cfg.lastre[a.id] * cfg.exposicion(a.id, categoria) }))
    .filter((r) => r.costo > 0);
  const lastre = restados.reduce((s, r) => s + r.costo, 0);

  return {
    puntaje: aporte - lastre,
    aporte,
    lastre,
    mejorNivel: contados[0]?.nivel,
    contados,
    restados,
  };
}
