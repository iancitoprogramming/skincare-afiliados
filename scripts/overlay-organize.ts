// Capa editorial del catálogo importado. Lo que el vault NO puede decir y una
// persona sí tiene que decidir.
//
// ─────────────────────────────────────────────────────────────────────────────
// EL CRITERIO: ORIENTACIÓN, NO RESTRICCIÓN
//
// Las carpetas del vault se llaman "ORIENTADOS A PIEL GRASA", y esa palabra hay
// que tomarla en serio. Dice para quién rinde mejor, no a quién se le puede
// ofrecer. El sitio da guía, no receta.
//
// De ahí sale la regla de clasificación: **inclusivo por defecto**. Un producto
// sirve para un tipo de piel salvo que haya un motivo de fórmula para sacarlo.
// El caso que lo explica todo: alguien de piel normal puede usar prácticamente
// cualquier cosa del catálogo, porque no tiene ni resequedad ni exceso de sebo
// que lo limite — para esa persona la elección depende de sus objetivos, no de
// su tipo de piel. Por eso "normal" y "mixta" aparecen en casi todo.
//
// Los únicos motivos válidos para excluir son de fórmula:
//   · piel grasa    → texturas ricas u oclusivas
//   · piel seca     → matificantes, control de sebo, desengrasantes
//   · piel sensible → la lista de ingredientes, según SUSTITUTOS_SENSIBLE
//
// ─────────────────────────────────────────────────────────────────────────────
// QUÉ SE DERIVA Y QUÉ SE DECIDE
//
// Se DERIVA del INCI (en importar-organize.ts, auditable y consistente):
//   · apto_sensible  — de los activos, contra las reglas del propio vault
//   · preocupaciones — de los activos: qué problema puede atacar el producto
//   · tipos_piel     — arranca en las cinco y se resta
//
// Se DECIDE acá, porque el INCI no lo dice:
//   · textura        — lo único que separa "sirve para piel grasa" de "no"
//   · exclusiones    — cada una con su motivo escrito
//   · origen, precio, prioridad
//
// El precio es un rango provisional por posicionamiento de marca: el vault no
// trae precios y `precio_ars` queda vacío hasta que alguien los releve.

export interface Curado {
  /**
   * Lo único que el INCI no permite deducir y que decide si le sirve a una piel
   * grasa. "rica" excluye piel grasa automáticamente.
   */
  textura: "liviana" | "neutra" | "rica";
  origen: "europeo" | "nacional" | "coreano";
  /** Provisional, por posicionamiento de marca. Verificar al cargar precios. */
  rangoPrecio: 1 | 2 | 3;
  prioridad: number;
  comodin?: boolean;
  /** Exclusiones que no salen de la textura. El motivo es obligatorio. */
  excluir?: { piel: string; motivo: string }[];
  /** Preocupación que los activos no delatan pero el producto sí atiende. */
  sumar?: string[];
  nota?: string;
}

const matificante = (que: string) => [
  { piel: "seca", motivo: `${que}: le saca a una piel seca lo poco que le queda` },
];

export const CURADO: Record<string, Curado> = {
  // ── Hidratantes ────────────────────────────────────────────────────────────
  MLA67629151: {
    textura: "neutra", origen: "europeo", rangoPrecio: 3, prioridad: 4,
    nota: "Sin INCI verificado: no se le mapean activos y el motor no opina sobre su fórmula.",
  },
  MLA23143346: {
    textura: "rica", origen: "europeo", rangoPrecio: 3, prioridad: 5,
    nota: "14 ingredientes, sin fragancia. La fórmula más corta del catálogo y esa es su propuesta.",
  },
  MLA21174873: { textura: "neutra", origen: "europeo", rangoPrecio: 2, prioridad: 4 },
  MLA35115621: {
    textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 4,
    excluir: matificante("gel anti-imperfecciones con salicílico y alcohol"),
  },
  MLA9210936: { textura: "liviana", origen: "europeo", rangoPrecio: 2, prioridad: 4 },
  MLA19899495: { textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 3 },
  MLA9855881: {
    textura: "neutra", origen: "europeo", rangoPrecio: 3, prioridad: 3,
    nota: "Lleva FPS 15: no alcanza como protección diaria, por eso está como hidratante.",
  },
  MLA22990183: { textura: "neutra", origen: "nacional", rangoPrecio: 1, prioridad: 4 },
  MLA9196384: {
    textura: "liviana", origen: "europeo", rangoPrecio: 2, prioridad: 4,
    excluir: matificante("matificante con LHA y alcohol"),
  },

  // ── Limpiadores ────────────────────────────────────────────────────────────
  MLA24300545: {
    textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 3,
    excluir: matificante("agua micelar con salicílico"),
  },
  MLA20546060: {
    textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 3,
    nota: "Sin INCI verificado.",
  },
  MLAU141343879: {
    textura: "liviana", origen: "europeo", rangoPrecio: 2, prioridad: 4,
    excluir: matificante("gel espumoso, formulado para piel normal a grasa"),
  },
  MLA37349507: {
    textura: "liviana", origen: "europeo", rangoPrecio: 2, prioridad: 4,
    excluir: matificante("control de sebo"),
  },
  MLA47671534: {
    textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 3,
    excluir: matificante("gel anti-imperfecciones con salicílico"),
  },
  MLA53897352: { textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 3 },
  MLA16135276: {
    textura: "rica", origen: "europeo", rangoPrecio: 2, prioridad: 5,
    nota: "Syndet sin jabón, pensado para piel atópica. Sin fragancia.",
  },
  MLA35427636: { textura: "liviana", origen: "coreano", rangoPrecio: 2, prioridad: 4 },
  MLA20030752: {
    textura: "rica", origen: "europeo", rangoPrecio: 3, prioridad: 5,
    nota: "Para piel atópica. Sin fragancia.",
  },
  MLA37598876: { textura: "rica", origen: "europeo", rangoPrecio: 2, prioridad: 5 },

  // ── Protectores solares ────────────────────────────────────────────────────
  // Ninguno es mineral: los que tienen dióxido de titanio lo tienen como
  // pigmento. Ver docs/INGREDIENTES.md §8.4.
  MLA19504960: {
    textura: "liviana", origen: "europeo", rangoPrecio: 2, prioridad: 4,
    excluir: matificante("oil control"),
  },
  MLA16048275: {
    textura: "liviana", origen: "europeo", rangoPrecio: 2, prioridad: 4,
    excluir: matificante("toque seco, oil control"),
  },
  MLAU3133622625: {
    textura: "liviana", origen: "europeo", rangoPrecio: 3, prioridad: 5,
    excluir: matificante("oil control"),
  },
  MLA16048424: {
    textura: "liviana", origen: "europeo", rangoPrecio: 3, prioridad: 4,
    excluir: matificante("efecto mate"),
  },
  MLA58897902: {
    textura: "neutra", origen: "europeo", rangoPrecio: 3, prioridad: 5,
    nota: "Filtro de UVA hasta 400 nm + óxidos de hierro. Es el mejor del catálogo para manchas.",
  },
  MLA63460365: {
    textura: "liviana", origen: "europeo", rangoPrecio: 2, prioridad: 4,
    excluir: matificante("anti-imperfecciones con salicílico"),
  },

  // ── Retinoides ─────────────────────────────────────────────────────────────
  MLA58622882: {
    textura: "neutra", origen: "europeo", rangoPrecio: 2, prioridad: 4, comodin: true,
    nota: "Comodín de la categoría: sin uno, el motor revienta cuando se abre el Tier 4.",
  },
  MLA20021768: { textura: "neutra", origen: "nacional", rangoPrecio: 2, prioridad: 3 },
  MLAU244146565: {
    textura: "neutra", origen: "europeo", rangoPrecio: 3, prioridad: 5,
    nota: "Se anuncia 'incluso piel sensible' y lleva alcohol denat y fragancia. Manda el INCI.",
  },

  // ── Séricos activos ────────────────────────────────────────────────────────
  MLAU209241342: { textura: "liviana", origen: "nacional", rangoPrecio: 1, prioridad: 3 },
  MLAU1655818860: { textura: "liviana", origen: "nacional", rangoPrecio: 2, prioridad: 4 },
  MLA29882074: {
    textura: "liviana", origen: "nacional", rangoPrecio: 2, prioridad: 3,
    nota: "Se vende como sérum de niacinamida y trae tranexámico más un complejo de AHA.",
  },
  MLA47223033: {
    textura: "liviana", origen: "europeo", rangoPrecio: 3, prioridad: 4,
    nota: "12% de ascórbico, pero también salicílico, alcohol y fragancia.",
  },
  MLA19710676: { textura: "liviana", origen: "europeo", rangoPrecio: 3, prioridad: 4 },
  MLA22843182: {
    textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 4,
    excluir: matificante("apila BHA, AHA y alcohol"),
  },
  MLA45672941: { textura: "liviana", origen: "nacional", rangoPrecio: 2, prioridad: 5 },
  MLA34459961: {
    textura: "liviana", origen: "europeo", rangoPrecio: 3, prioridad: 5,
    nota: "Melasyl tiene un ECA contra hidroquinona 4%. Ojo: trae retinil palmitato.",
  },
  MLA26197969: {
    textura: "liviana", origen: "europeo", rangoPrecio: 3, prioridad: 4,
    nota: "Segunda publicación del mismo producto que MLA34459961. Prioridad menor para no repetirlo.",
  },
  MLA24840827: {
    textura: "liviana", origen: "europeo", rangoPrecio: 3, prioridad: 5,
    nota: "Es la fórmula del paper de Duke: 15% ascórbico + 1% tocoferol + 0,5% ferúlico.",
  },

  // ── Séricos secundarios / ampollas ─────────────────────────────────────────
  MLA45338822: { textura: "neutra", origen: "coreano", rangoPrecio: 2, prioridad: 4 },
  MLA45991792: {
    textura: "liviana", origen: "nacional", rangoPrecio: 2, prioridad: 3,
    nota: "Trae gluconato de cobre: el motor lo va a separar de la vitamina C pura.",
  },
  MLA12754368: { textura: "liviana", origen: "europeo", rangoPrecio: 3, prioridad: 4 },
  MLA18964459: {
    textura: "liviana", origen: "europeo", rangoPrecio: 2, prioridad: 4, comodin: true,
    nota: "Comodín de la categoría: lista corta, sin fragancia, le sirve a cualquier piel.",
  },
  MLA22655637: { textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 3 },
  MLA18956615: { textura: "liviana", origen: "europeo", rangoPrecio: 1, prioridad: 3 },
  MLA38719413: {
    textura: "liviana", origen: "coreano", rangoPrecio: 2, prioridad: 4,
    excluir: matificante("anti-sebo, con árbol de té"),
  },
  MLA43183566: {
    textura: "liviana", origen: "coreano", rangoPrecio: 2, prioridad: 3,
    excluir: matificante("minimiza poros, control de aceite"),
  },
};
