import type {
  Activo,
  CatalogoActivos,
  Mito,
  Regla,
  ReglaAcumulacion,
  Sinergia,
} from "@/engine/compatibilidad";

// ─────────────────────────────────────────────────────────────────────────────
// DICCIONARIO DE ACTIVOS Y REGLAS DE COMBINACIÓN
//
// Fuente de verdad de todo lo que el sitio afirma sobre mezclar ingredientes.
// El razonamiento largo, con citas, está en `docs/COMPATIBILIDAD.md`; acá está
// la versión ejecutable. Si los dos se contradicen, manda el documento y este
// archivo está desactualizado.
//
// Tres decisiones de criterio que explican por qué está armado así:
//
// 1. Se separa "se destruyen" de "irritan juntos". Son cosas distintas con
//    arreglos distintos, y confundirlas es el origen de casi todo el folclore
//    de "no mezclar". La clase del conflicto lo dice explícitamente.
//
// 2. Se desmiente activamente. Un mito que sigue circulando —vitamina C con
//    niacinamida— hace daño si nos callamos: la persona googlea, encuentra el
//    mito y desarma la rutina que le dimos. Por eso `MITOS` es una estructura
//    de primera clase y no un párrafo de blog.
//
// 3. Ningún activo entra al mapa por inferencia. Si no verificamos el INCI, el
//    producto va con lista vacía. Recomendar de más es peor que no avisar: una
//    advertencia inventada tiene el mismo costo de credibilidad que un claim
//    inventado.
//
// 4. Cada activo declara su NIVEL DE EVIDENCIA (A–D). La escala está definida en
//    `docs/INGREDIENTES.md` §0 y los grados salen de ahí, sección por sección;
//    los pocos que el documento no cubre van marcados uno por uno con el motivo.
//    Estaba escrito y sin codificar: el documento decía "sólo se afirma lo que
//    está en A o B" y el motor no tenía forma de saber qué era A ni qué era B,
//    así que la regla no se podía aplicar a nada. Ahora `calidadFormula()` la
//    usa para ordenar.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Los que NO llevan nivel de evidencia, y por qué. Es una decisión, no un olvido:
 * la escala A–D mide cuánto respalda la literatura un BENEFICIO, y estas cosas
 * no están en la fórmula por un beneficio que nosotros afirmemos.
 *
 * El test de `activos.test.ts` cruza esta lista contra el diccionario, así que un
 * activo nuevo sin grado y sin exención rompe el build en vez de contarse como
 * cero en silencio.
 */
export const SIN_NIVEL_DE_EVIDENCIA: Record<string, string> = {
  fragancia: "No es un activo: es la primera causa de dermatitis de contacto alérgica en cosmética.",
  alcohol_denat: "Aporta textura, no resultado. En un leave-on el argumento de la textura casi no pesa.",
  aceite_esencial_tea_tree:
    "Tiene evidencia razonable para acné (INGREDIENTES.md §9.3), pero el documento lo trata en el " +
    "capítulo de lo que no aporta y sí suma riesgo, y acá manda el documento. Cuenta como lastre.",
  aceite_esencial_romero: "Aceite esencial sin beneficio tópico documentado.",
  menta: "La sensación de fresco no es un beneficio: es la señal de que algo está irritando.",
  hamamelis: "Astringente tradicional sin beneficio afirmable; se declara para explicar tolerancia.",
  cobre_gluconato:
    "Está en el diccionario para explicar un conflicto —el cobre oxida al ascorbato— y no porque " +
    "afirmemos que el gluconato de cobre haga algo por la piel.",
};

export const ACTIVOS: Record<string, Activo> = {
  // ── Exfoliantes ────────────────────────────────────────────────────────────
  // El grupo "acido-libre" junta a los que trabajan bajando el pH y necesitan
  // que una fracción de la molécula esté sin disociar para actuar. Es el grupo
  // que choca con retinoides y con vitamina C pura. Los PHA quedan afuera a
  // propósito: son el reemplazo suave, no el problema.
  aha_glicolico: {
    id: "aha_glicolico",
    nivelEvidencia: "A",
    nombre: "Ácido glicólico",
    familia: "aha",
    grupos: ["exfoliante", "acido-libre", "renovador"],
    carga: 3,
    ph: [3, 4],
    evidencia:
      "Es el AHA de molécula más chica, así que es el que más entra y el que más irrita. " +
      "A 7% en tónico es un exfoliante de verdad, no un gesto.",
  },
  aha_lactico: {
    id: "aha_lactico",
    nivelEvidencia: "A",
    nombre: "Ácido láctico",
    familia: "aha",
    grupos: ["exfoliante", "acido-libre", "renovador"],
    carga: 2,
    ph: [3, 4],
    evidencia: "Molécula más grande que el glicólico: entra más despacio y además es humectante.",
  },
  aha_mandelico: {
    id: "aha_mandelico",
    nivelEvidencia: "B",
    nombre: "Ácido mandélico",
    familia: "aha",
    grupos: ["exfoliante", "acido-libre"],
    carga: 1,
    ph: [3, 4],
    evidencia:
      "El AHA más grande y más lento. En una crema, a porcentaje bajo, aporta poca exfoliación " +
      "real, pero suma a la cuenta del día.",
  },
  aha_citrico: {
    id: "aha_citrico",
    nivelEvidencia: "D",
    nombre: "Ácido cítrico",
    familia: "aha",
    grupos: ["exfoliante"],
    carga: 1,
    evidencia:
      "En casi todas las fórmulas está como ajustador de pH, no como exfoliante. Se cuenta con " +
      "carga baja y sin grupo 'acido-libre' justamente por eso.",
  },
  bha_salicilico: {
    id: "bha_salicilico",
    nivelEvidencia: "A",
    nombre: "Ácido salicílico",
    familia: "bha",
    grupos: ["exfoliante", "acido-libre", "renovador"],
    carga: 2,
    ph: [3, 4],
    evidencia:
      "Liposoluble: entra al poro, que es por lo que sirve para granitos. En un limpiador que se " +
      "enjuaga, el tiempo de contacto es corto y el efecto mucho menor que en un sérum.",
  },
  bha_betaina_salicilato: {
    id: "bha_betaina_salicilato",
    nivelEvidencia: "C", // el documento gradúa el salicílico (A), no esta versión suave, que no tiene ensayos propios
    nombre: "Betaína salicilato",
    familia: "bha",
    grupos: ["exfoliante"],
    carga: 1,
    evidencia:
      "Versión suave del salicílico. Hace falta bastante más concentración para igualarlo, por eso " +
      "va con carga baja — pero sigue siendo un BHA y para piel reactiva cuenta.",
  },
  bha_lha: {
    id: "bha_lha",
    nivelEvidencia: "B",
    nombre: "LHA (capriloil salicílico)",
    familia: "bha",
    grupos: ["exfoliante"],
    carga: 1,
    evidencia:
      "Éster del salicílico con una cadena grasa: más lipofílico, molécula más grande y penetración " +
      "unas cinco veces más lenta. Se queda en el estrato córneo y descama célula por célula, así " +
      "que irrita bastante menos — y por lo mismo rinde menos contra el granito que el salicílico " +
      "puro. No va al grupo 'ácido libre' justamente por eso: no se comporta como un ácido directo.",
  },
  aha_malico: {
    id: "aha_malico",
    nivelEvidencia: "D",
    nombre: "Ácido málico",
    familia: "aha",
    grupos: ["exfoliante", "acido-libre"],
    carga: 1,
  },
  aha_tartarico: {
    id: "aha_tartarico",
    nivelEvidencia: "D",
    nombre: "Ácido tartárico",
    familia: "aha",
    grupos: ["exfoliante", "acido-libre"],
    carga: 1,
  },
  acido_fitico: {
    id: "acido_fitico",
    nivelEvidencia: "C",
    nombre: "Ácido fítico",
    familia: "aha",
    grupos: ["exfoliante", "despigmentante"],
    carga: 1,
    evidencia:
      "Quelante de metales con exfoliación muy suave. Aparece en fórmulas despigmentantes más por " +
      "quelar hierro y cobre —que catalizan oxidación— que por descamar.",
  },
  pha_gluconolactona: {
    id: "pha_gluconolactona",
    nivelEvidencia: "B",
    nombre: "PHA (gluconolactona)",
    familia: "pha",
    // A propósito NO está en el grupo "exfoliante", que es el que cuenta carga
    // acumulada. Su propiedad documentada es justamente la contraria: molécula
    // grande, penetración baja y humectante. Contarlo como carga hacía que
    // "retinoide + PHA" —que es la combinación que recomendamos para piel
    // reactiva en COMPATIBILIDAD.md §2.4— disparara un aviso de sobrecarga.
    // Una regla que le pega a la recomendación que damos nosotros mismos está
    // mal escrita, no mal aplicada.
    grupos: [],
    carga: 1,
    evidencia:
      "Molécula grande: entra poco y además retiene agua. Es el exfoliante que la literatura " +
      "describe como compatible con piel sensible, rosácea y dermatitis atópica.",
  },

  // ── Retinoides ─────────────────────────────────────────────────────────────
  // "retinoide-oxidable" agrupa a los que el peróxido de benzoilo degrada. El
  // adapaleno queda afuera adrede: es la excepción documentada, y meterlo en la
  // misma bolsa haría que el motor dé un consejo falso.
  retinol: {
    id: "retinol",
    nivelEvidencia: "A",
    nombre: "Retinol",
    familia: "retinoide",
    grupos: ["exfoliante", "renovador", "retinoide-oxidable"],
    carga: 3,
    soloNoche: true,
    evidencia:
      "La luz UV lo degrada por isomerización. Va de noche por eso, no por superstición.",
  },
  retinal: {
    id: "retinal",
    nivelEvidencia: "B", // no está en INGREDIENTES.md ni en el catálogo; el retinaldehído tiene ensayos propios pero menos que el retinol
    nombre: "Retinaldehído",
    familia: "retinoide",
    grupos: ["exfoliante", "renovador", "retinoide-oxidable"],
    carga: 3,
    soloNoche: true,
    evidencia: "Un paso más cerca del ácido retinoico que el retinol. Misma sensibilidad a la luz.",
  },
  retinil_ester: {
    id: "retinil_ester",
    nivelEvidencia: "C",
    nombre: "Retinil palmitato",
    familia: "retinoide",
    grupos: ["renovador", "retinoide-oxidable"],
    carga: 1,
    // NO lleva soloNoche, a diferencia del resto de los retinoides. La auditoría
    // proyectada lo destapó: el palmitato aparece casi siempre como ingrediente
    // menor —antioxidante de fórmula— dentro de productos que el fabricante
    // vende para mañana y noche, como el Mela B3. Marcarlo "va de noche" hacía
    // saltar el aviso en 96 rutinas para contradecir al fabricante sobre un
    // ingrediente que ni siquiera es el activo del producto. Un aviso que se
    // dispara por algo que no importa entrena a la gente a ignorar los avisos.
    //
    // Lo que sí importa de este ingrediente —que es un retinoide escondido y que
    // suma si se combina con otro— lo sigue detectando la regla `pila-retinoide`.
    evidencia:
      "El retinoide más débil de la escala: necesita dos conversiones antes de hacer algo. " +
      "Aparece mucho en etiquetas porque permite decir 'con retinol' sin el costo de irritar, " +
      "y a menudo en cantidades donde no es el activo sino el acompañamiento.",
  },
  tretinoina: {
    id: "tretinoina",
    nivelEvidencia: "A", // fármaco de referencia, fuera del catálogo: está para que las reglas de retinoide tengan a quién apuntar
    nombre: "Tretinoína",
    familia: "retinoide",
    grupos: ["exfoliante", "renovador", "retinoide-oxidable"],
    carga: 3,
    soloNoche: true,
    evidencia:
      "Medicamento, no cosmético. Va bajo receta y no entra al catálogo: acá está sólo para que " +
      "el motor sepa avisar si alguien ya la usa.",
  },
  adapaleno: {
    id: "adapaleno",
    nivelEvidencia: "A",
    nombre: "Adapaleno",
    familia: "retinoide",
    grupos: ["exfoliante", "renovador"],
    carga: 2,
    evidencia:
      "El retinoide fotoestable. Es el único que no se degrada con peróxido de benzoilo ni con " +
      "luz — por eso existen productos que los combinan en el mismo tubo.",
  },
  bakuchiol: {
    id: "bakuchiol",
    nivelEvidencia: "B",
    nombre: "Bakuchiol",
    familia: "retinoide-alternativa",
    grupos: ["renovador"],
    carga: 1,
    evidencia:
      "No es un retinoide: es un extracto vegetal que activa vías parecidas. En un ensayo a doble " +
      "ciego a 12 semanas igualó a retinol 0,5% en arrugas y pigmento, con menos descamación.",
  },

  // ── Vitamina C ─────────────────────────────────────────────────────────────
  vit_c_laa: {
    id: "vit_c_laa",
    nivelEvidencia: "A",
    nombre: "Vitamina C pura (ácido L-ascórbico)",
    familia: "vitamina-c",
    grupos: ["antioxidante", "despigmentante"],
    carga: 2,
    ph: [2.5, 3.5],
    evidencia:
      "Necesita pH 3,5 o menos para entrar sin ionizar. Es la forma más eficaz y la más inestable: " +
      "se oxida con aire, luz, calor y metales.",
  },
  vit_c_derivado: {
    id: "vit_c_derivado",
    nivelEvidencia: "B",
    nombre: "Derivado de vitamina C",
    familia: "vitamina-c",
    grupos: ["antioxidante", "despigmentante"],
    carga: 1,
    ph: [5, 7],
    evidencia:
      "Ascorbil glucósido, ascorbil fosfato de sodio o magnesio, etil ascórbico. Estables a pH " +
      "neutro y mucho menos irritantes; a cambio, dependen de que la piel los convierta.",
  },

  // ── Despigmentantes y reguladores ──────────────────────────────────────────
  niacinamida: {
    id: "niacinamida",
    nivelEvidencia: "A",
    nombre: "Niacinamida",
    familia: "niacinamida",
    grupos: ["despigmentante", "barrera-reparadora"],
    carga: 1,
    ph: [5, 7],
    evidencia:
      "El activo más versátil y mejor tolerado del catálogo: pigmento, sebo, barrera y rojeces. " +
      "Por eso está en todo, y por eso hay que contar cuántas veces aparece.",
  },
  azelaico: {
    id: "azelaico",
    nivelEvidencia: "A",
    nombre: "Ácido azelaico",
    familia: "azelaico",
    grupos: ["despigmentante", "renovador"],
    carga: 1,
    evidencia:
      "El comodín: sirve para acné, rosácea, manchas y marcas, tolera bien la compañía y es de " +
      "los pocos activos potentes compatibles con el embarazo.",
  },
  tranexamico: {
    id: "tranexamico",
    nivelEvidencia: "B",
    nombre: "Ácido tranexámico",
    familia: "tranexamico",
    grupos: ["despigmentante"],
    carga: 0,
    evidencia:
      "A pesar del nombre no es un ácido exfoliante: no baja el pH ni descama. Trabaja sobre la " +
      "señal que dispara el pigmento.",
  },
  arbutina: {
    id: "arbutina",
    nivelEvidencia: "B",
    nombre: "Alfa-arbutina",
    familia: "despigmentante",
    grupos: ["despigmentante"],
    carga: 1,
  },
  melasyl: {
    id: "melasyl",
    nivelEvidencia: "B",
    nombre: "Melasyl (2-mercaptonicotinoil glicina)",
    familia: "despigmentante",
    grupos: ["despigmentante"],
    carga: 0,
    evidencia:
      "Molécula nueva, y de las pocas con mecanismo distinto: no inhibe la tirosinasa como casi " +
      "todos los despigmentantes, sino que atrapa un intermediario del pigmento (la dopaquinona) " +
      "antes de que polimerice. Tiene un ensayo aleatorizado a 3 meses contra hidroquinona al 4% " +
      "en melasma facial, que es un comparador exigente.",
  },
  tiosulfato_sodio: {
    id: "tiosulfato_sodio",
    nivelEvidencia: "D",
    nombre: "Tiosulfato de sodio",
    familia: "despigmentante",
    grupos: ["despigmentante"],
    carga: 0,
    evidencia: "Acompaña a otros despigmentantes; sola tiene poca evidencia propia.",
  },

  // ── Humectantes y reparadores de barrera con mecanismo propio ─────────────
  urea: {
    id: "urea",
    nivelEvidencia: "A",
    nombre: "Urea",
    familia: "humectante",
    grupos: ["barrera-reparadora"],
    carga: 0,
    evidencia:
      "Es dosis-dependiente y ese es todo el punto: hasta 10% hidrata y repara barrera (forma parte " +
      "del factor natural de hidratación de la piel); por encima de 10% empieza a ser queratolítica. " +
      "En un hidratante facial está en el rango bajo, así que suma sin exfoliar.",
  },
  glicerilo_glucosido: {
    id: "glicerilo_glucosido",
    nivelEvidencia: "B",
    nombre: "Gliceril glucósido",
    familia: "humectante",
    grupos: ["barrera-reparadora"],
    carga: 0,
    evidencia:
      "Humectante con un mecanismo distinto del resto: en vez de atraer agua y quedarse ahí, " +
      "estimula la expresión de acuaporina-3, el canal por el que el agua circula entre células. " +
      "Hay trabajo publicado midiendo el aumento de AQP3 en queratinocitos y en piel humana.",
  },
  escualano: { id: "escualano", nivelEvidencia: "B", nombre: "Escualano", familia: "emoliente", grupos: [], carga: 0 },
  fitoesfingosina: {
    id: "fitoesfingosina",
    nivelEvidencia: "A",
    nombre: "Fitoesfingosina",
    familia: "barrera",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  colesterol: {
    id: "colesterol",
    nivelEvidencia: "A",
    nombre: "Colesterol",
    familia: "barrera",
    grupos: ["barrera-reparadora"],
    carga: 0,
    evidencia:
      "La barrera se arma con ceramidas, colesterol y ácidos grasos en proporción. Un producto que " +
      "trae los tres repone lo que falta, no sólo una pieza.",
  },
  manteca_karite: {
    id: "manteca_karite",
    nivelEvidencia: "C", // no está graduada en el documento; emoliente clásico, buena tolerancia, sin ensayos que sostengan más
    nombre: "Manteca de karité",
    familia: "emoliente",
    grupos: [],
    carga: 0,
  },
  resorcinol_fenetil: {
    id: "resorcinol_fenetil",
    nivelEvidencia: "B",
    nombre: "Fenetil resorcinol",
    familia: "despigmentante",
    grupos: ["despigmentante"],
    carga: 1,
    evidencia: "Inhibidor de tirosinasa. Potente para su concentración y bastante bien tolerado.",
  },
  zinc_pca: {
    id: "zinc_pca",
    nivelEvidencia: "C",
    nombre: "Zinc PCA",
    familia: "seborregulador",
    grupos: [],
    carga: 0,
  },

  // ── Oxidantes y péptidos ───────────────────────────────────────────────────
  peroxido_benzoilo: {
    id: "peroxido_benzoilo",
    nivelEvidencia: "A", // el documento no lo gradúa porque no está en el catálogo; es estándar de tratamiento en acné
    nombre: "Peróxido de benzoilo",
    familia: "peroxido",
    grupos: ["oxidante", "renovador"],
    carga: 3,
    evidencia:
      "Es un oxidante fuerte, y esa es exactamente la razón por la que destruye lo que tiene al " +
      "lado. No está en el catálogo; el motor lo conoce para poder avisar.",
  },
  // El grupo "cobre" es lo que activa la regla con vitamina C pura. Lo comparten
  // el péptido de cobre y las sales de cobre: el problema es el metal, no el
  // péptido, y meterlos en el mismo grupo es la manera de no confundirlo.
  peptidos_cobre: {
    id: "peptidos_cobre",
    nivelEvidencia: "C",
    nombre: "Péptidos de cobre (GHK-Cu)",
    familia: "peptido",
    grupos: ["cobre"],
    carga: 1,
    evidencia:
      "Cincuenta años de literatura a nivel celular y resultados clínicos prometedores, pero con " +
      "estudios chicos, casi siempre financiados por la industria y sin réplica independiente. " +
      "No está al nivel de evidencia de un retinoide o de la vitamina C, y conviene decirlo.",
  },
  cobre_gluconato: {
    id: "cobre_gluconato",
    nombre: "Gluconato de cobre",
    familia: "mineral",
    grupos: ["cobre"],
    carga: 0,
    evidencia:
      "Sal de cobre, sin el péptido. Aporta el mismo problema de oxidación frente al ascorbato y " +
      "ninguno de los datos clínicos del GHK-Cu.",
  },
  peptidos: {
    id: "peptidos",
    nivelEvidencia: "D",
    nombre: "Péptidos de señal",
    familia: "peptido",
    grupos: [],
    carga: 0,
    evidencia:
      "Palmitoil pentapéptido-4, acetil hexapéptido-8 y compañía. Buena tolerancia y evidencia " +
      "modesta: mejoras reales pero chicas, muy por debajo de lo que hace un retinoide. Sirven " +
      "como acompañamiento, no como el activo principal de una rutina.",
  },
  zinc_gluconato: {
    id: "zinc_gluconato",
    nivelEvidencia: "C",
    nombre: "Gluconato de zinc",
    familia: "seborregulador",
    grupos: [],
    carga: 0,
  },

  // ── Calmantes, barrera e hidratación ───────────────────────────────────────
  // Carga 0 casi siempre: no suman irritación, y varios la restan. En el motor
  // importan sobre todo por las sinergias — son lo que hace tolerable un activo.
  centella: {
    id: "centella",
    nivelEvidencia: "B",
    nombre: "Centella asiática",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  panthenol: {
    id: "panthenol",
    nivelEvidencia: "B",
    nombre: "Pantenol (vitamina B5)",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  ceramidas: {
    id: "ceramidas",
    nivelEvidencia: "A",
    nombre: "Ceramidas",
    familia: "barrera",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  hialuronico: {
    id: "hialuronico",
    nivelEvidencia: "B",
    nombre: "Ácido hialurónico",
    familia: "humectante",
    grupos: [],
    carga: 0,
    evidencia:
      "Otro que no exfolia pese al nombre. Es un humectante: atrae agua y hay que sellarlo con " +
      "algo encima, sobre todo en ambientes secos.",
  },
  alantoina: { id: "alantoina", nivelEvidencia: "C", nombre: "Alantoína", familia: "calmante", grupos: [], carga: 0 },
  mucina_caracol: {
    id: "mucina_caracol",
    nivelEvidencia: "C",
    nombre: "Mucina de caracol",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  // adenosina: no está en el documento; aprobado como antiarrugas en Corea, sin réplica independiente fuerte
  adenosina: { id: "adenosina", nivelEvidencia: "C", nombre: "Adenosina", familia: "calmante", grupos: [], carga: 0 },
  // cafeina: no está en el documento; el efecto sobre ojeras es transitorio y vasoconstrictor
  cafeina: { id: "cafeina", nivelEvidencia: "D", nombre: "Cafeína", familia: "calmante", grupos: [], carga: 0 },
  licochalcona: {
    id: "licochalcona",
    nivelEvidencia: "B",
    nombre: "Licochalcona A",
    familia: "calmante",
    grupos: [],
    carga: 0,
    evidencia: "Antioxidante de regaliz. Apunta al enrojecimiento post-sol.",
  },
  glicirretinico: {
    id: "glicirretinico",
    nivelEvidencia: "B",
    nombre: "Ácido glicirretínico",
    familia: "calmante",
    grupos: [],
    carga: 0,
  },
  tocoferol: {
    id: "tocoferol",
    nivelEvidencia: "C",
    nombre: "Vitamina E (tocoferol)",
    familia: "antioxidante",
    grupos: ["antioxidante"],
    carga: 0,
  },
  ferulico: {
    id: "ferulico",
    nivelEvidencia: "B",
    nombre: "Ácido ferúlico",
    familia: "antioxidante",
    grupos: ["antioxidante"],
    carga: 0,
    evidencia:
      "Pese al nombre no exfolia: es un antioxidante vegetal. Su papel principal es estabilizar la " +
      "vitamina C y potenciar su fotoprotección.",
  },
  madecassosido: {
    id: "madecassosido",
    nivelEvidencia: "B",
    nombre: "Madecasósido",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
    evidencia:
      "El componente de centella con más respaldo propio: hay trabajos sobre cicatrización " +
      "epidérmica y sobre protección del queratinocito frente a UVB, además de datos de síntesis " +
      "de colágeno vía TGF-β.",
  },
  glicirricinato: {
    id: "glicirricinato",
    nivelEvidencia: "C",
    nombre: "Glicirricinato dipotásico",
    familia: "calmante",
    grupos: [],
    carga: 0,
    evidencia: "Derivado de regaliz. Antiinflamatorio suave, muy bien tolerado.",
  },
  bisabolol: { id: "bisabolol", nivelEvidencia: "C", nombre: "Bisabolol", familia: "calmante", grupos: [], carga: 0 },
  carnosina: {
    id: "carnosina",
    nivelEvidencia: "D",
    nombre: "Carnosina",
    familia: "antioxidante",
    grupos: ["antioxidante"],
    carga: 0,
    evidencia: "Antioxidante y antiglicante. Evidencia tópica modesta.",
  },
  avena: {
    id: "avena",
    nivelEvidencia: "A",
    nombre: "Avena coloidal",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  agua_termal: {
    id: "agua_termal",
    nivelEvidencia: "D",
    nombre: "Agua termal",
    familia: "calmante",
    grupos: [],
    carga: 0,
    evidencia:
      "Aporta poco por sí sola. Su valor real es que reemplaza al agua común en fórmulas pensadas " +
      "para piel reactiva, donde lo importante es lo que NO tienen.",
  },
  noni: {
    id: "noni",
    nivelEvidencia: "D",
    nombre: "Extracto de noni",
    familia: "antioxidante",
    grupos: ["antioxidante"],
    carga: 0,
    evidencia: "Antioxidante vegetal. Evidencia tópica escasa; se usa como base de fórmula.",
  },
  // aloe: no está en el documento; calmante bien tolerado, evidencia mayormente abierta
  aloe: { id: "aloe", nivelEvidencia: "C", nombre: "Aloe vera", familia: "calmante", grupos: [], carga: 0 },
  // creatina: no está en el documento; sólo mecanismo
  creatina: { id: "creatina", nivelEvidencia: "D", nombre: "Creatina", familia: "otros", grupos: [], carga: 0 },
  ginseng: { id: "ginseng", nivelEvidencia: "D", nombre: "Ginseng", familia: "antioxidante", grupos: [], carga: 0 },
  arroz_fermentado: {
    id: "arroz_fermentado",
    nivelEvidencia: "D", // no está en el documento; fermentado de marca, sin literatura independiente
    nombre: "Extracto de arroz fermentado",
    familia: "antioxidante",
    grupos: [],
    carga: 0,
  },

  // ── Irritantes potenciales ─────────────────────────────────────────────────
  // No son activos: son cosas que suman a la cuenta de irritación sin aportar
  // nada a cambio. Se modelan igual porque para piel reactiva pesan más que
  // varios activos "de verdad".
  aceite_esencial_tea_tree: {
    id: "aceite_esencial_tea_tree",
    nombre: "Aceite esencial de árbol de té",
    familia: "aceite-esencial",
    grupos: ["irritante-potencial"],
    carga: 1,
    evidencia:
      "Tiene evidencia razonable para acné, pero es un aceite esencial y una causa conocida de " +
      "dermatitis de contacto. Dos productos con tea tree en la misma rutina es fácil de hacer " +
      "sin darse cuenta.",
  },
  aceite_esencial_romero: {
    id: "aceite_esencial_romero",
    nombre: "Aceite esencial de romero",
    familia: "aceite-esencial",
    grupos: ["irritante-potencial"],
    carga: 1,
    evidencia:
      "Aceite esencial. Aporta aroma y algo de antioxidante, y a cambio suma riesgo de dermatitis " +
      "de contacto en piel reactiva.",
  },
  menta: {
    id: "menta",
    nombre: "Menta / mentol",
    familia: "aceite-esencial",
    grupos: ["irritante-potencial"],
    carga: 1,
    evidencia: "La sensación de fresco no es un beneficio: es la señal de que algo está irritando.",
  },
  fragancia: {
    id: "fragancia",
    nombre: "Fragancia",
    familia: "fragancia",
    grupos: ["irritante-potencial"],
    carga: 1,
    evidencia:
      "Primera causa de dermatitis de contacto alérgica en cosmética. Para piel que reacciona, " +
      "es lo primero que conviene sacar.",
  },
  alcohol_denat: {
    id: "alcohol_denat",
    nombre: "Alcohol denat",
    familia: "alcohol",
    grupos: ["irritante-potencial"],
    carga: 1,
    evidencia:
      "En protectores solares aporta la textura liviana que hace que la gente se lo ponga. " +
      "El costo lo paga la piel seca o reactiva.",
  },
  hamamelis: {
    id: "hamamelis",
    nombre: "Hamamelis",
    familia: "astringente",
    grupos: [],
    carga: 0,
    evidencia:
      "Como agua o extracto sin alcohol es inofensivo. La mala fama viene de las destilaciones " +
      "con alcohol de los tónicos astringentes de los 90.",
  },

  // ── Filtros solares ────────────────────────────────────────────────────────
  // Se modelan al nivel que cambia una recomendación, no filtro por filtro. Un
  // diccionario con los quince filtros del catálogo sería más completo y no
  // haría que el sitio dijera nada distinto.
  filtro_quimico: {
    id: "filtro_quimico",
    nivelEvidencia: "A", // el documento describe los filtros uno por uno sin ponerles letra; la fotoprotección es lo mejor documentado del rubro
    nombre: "Filtros solares orgánicos",
    familia: "filtro",
    grupos: [],
    carga: 0,
  },
  filtro_mineral: {
    id: "filtro_mineral",
    nivelEvidencia: "A", // ídem filtros orgánicos
    nombre: "Filtros solares minerales",
    familia: "filtro",
    grupos: [],
    carga: 0,
    evidencia:
      "Óxido de zinc o dióxido de titanio actuando COMO filtro. Ojo con confundirlo: varios " +
      "protectores con color traen dióxido de titanio y óxidos de hierro como pigmento, no como " +
      "filtro. Un protector con color no es un protector mineral.",
  },
  filtro_avobenzona: {
    id: "filtro_avobenzona",
    nivelEvidencia: "A", // ídem; su problema es la fotoestabilidad, no la evidencia
    nombre: "Avobenzona",
    familia: "filtro",
    grupos: [],
    carga: 0,
    evidencia:
      "El filtro UVA clásico, y el menos estable: se degrada con la propia luz que bloquea si no " +
      "lo acompañan estabilizadores. En las fórmulas de este catálogo siempre viene acompañado, " +
      "que es como corresponde.",
  },
  filtro_uva_400: {
    id: "filtro_uva_400",
    nivelEvidencia: "B",
    nombre: "Filtro de UVA ultra-largo (Mexoryl 400)",
    familia: "filtro",
    grupos: [],
    carga: 0,
    evidencia:
      "Cubre la franja de 380 a 400 nm, que la mayoría de los protectores deja pasar. Tiene un " +
      "ensayo aleatorizado mostrando menos pigmentación inducida por UVA1 frente a un protector " +
      "que sólo llega a 370 nm. Importa sobre todo para melasma y manchas que reaparecen.",
  },
  oxidos_de_hierro: {
    id: "oxidos_de_hierro",
    nivelEvidencia: "B",
    nombre: "Óxidos de hierro (color)",
    familia: "pigmento",
    grupos: [],
    carga: 0,
    evidencia:
      "El color no es sólo cosmético: los óxidos de hierro son de lo poco que bloquea luz visible, " +
      "y la luz visible es un disparador conocido de melasma. Para manchas, un protector con color " +
      "protege más que el mismo protector sin color.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// REGLAS DE PAR
// ─────────────────────────────────────────────────────────────────────────────

export const REGLAS: Regla[] = [
  // ── Degradación: química medible ──────────────────────────────────────────
  {
    id: "peroxido-x-retinoide",
    entre: ["grupo:retinoide-oxidable", "peroxido_benzoilo"],
    clase: "degradacion",
    severidad: "separar",
    soloMismoMomento: true,
    titulo: "Peróxido de benzoilo y retinoide, juntos, se anulan",
    explicacion:
      "El peróxido es un oxidante y el retinoide se oxida. Aplicados uno encima del otro y con luz " +
      "de por medio, el retinoide se degrada en cuestión de horas: quedás con la irritación de los " +
      "dos y el beneficio de uno solo.",
    queHacer:
      "Uno a la mañana y el otro a la noche, o en noches distintas. Si necesitás los dos sí o sí " +
      "en el mismo momento, el adapaleno es el retinoide que aguanta al peróxido.",
    evidencia:
      "Martin et al., British Journal of Dermatology 1998: mezclados y con luz, la tretinoína " +
      "pierde más del 50% en unas 2 horas y ~95% a las 24. El adapaleno, en el mismo ensayo, " +
      "no se movió. La industria lo resolvió recién en 2021 microencapsulando los dos por " +
      "separado en cáscaras de sílice — o sea que el problema era real y hubo que fabricar " +
      "alrededor de él.",
  },
  {
    id: "peroxido-x-vitamina-c",
    entre: ["vit_c_laa", "peroxido_benzoilo"],
    clase: "degradacion",
    severidad: "separar",
    soloMismoMomento: true,
    titulo: "Peróxido de benzoilo y vitamina C pura se cancelan",
    explicacion:
      "La vitamina C funciona porque se oxida antes que tu piel. El peróxido es justamente un " +
      "oxidante: si van juntos, la vitamina C se gasta ahí mismo y no llega a hacer nada.",
    queHacer: "Vitamina C a la mañana, peróxido a la noche. Separados, los dos rinden.",
  },
  {
    id: "cobre-x-vitamina-c",
    entre: ["grupo:cobre", "vit_c_laa"],
    clase: "degradacion",
    severidad: "cuidado",
    soloMismoMomento: true,
    titulo: "Cobre y vitamina C pura: mejor separados",
    explicacion:
      "El cobre acelera la oxidación de la vitamina C. En un vaso de precipitado el efecto es " +
      "clarísimo; sobre la piel, con fórmulas terminadas y minutos de diferencia, es bastante " +
      "menos dramático de lo que se suele contar. Ojo con el detalle: el problema es el metal, " +
      "no el péptido — 'los péptidos no van con vitamina C' es falso como regla general.",
    queHacer:
      "Separalos por momento. No es una emergencia: es un seguro barato, porque no perdés nada " +
      "poniendo uno a la mañana y otro a la noche.",
  },

  // ── pH: se atenúa con el orden ────────────────────────────────────────────
  {
    id: "vitamina-c-x-acidos",
    entre: ["vit_c_laa", "grupo:acido-libre"],
    clase: "ph",
    severidad: "cuidado",
    soloMismoMomento: true,
    titulo: "Vitamina C pura y un ácido exfoliante en la misma aplicación",
    explicacion:
      "No se destruyen: los dos trabajan en medio ácido y conviven bien químicamente. El problema " +
      "es de piel, no de química — son dos productos de pH bajo seguidos, y eso se siente.",
    queHacer:
      "Si van juntos, primero el de pH más bajo. Y si notás ardor o tirantez, mandá el exfoliante " +
      "a otro momento del día: no perdés nada.",
  },

  // ── Irritación: se arregla con calendario ─────────────────────────────────
  {
    id: "retinoide-x-acidos",
    entre: ["familia:retinoide", "grupo:acido-libre"],
    clase: "irritacion",
    severidad: "separar",
    soloMismoMomento: true,
    titulo: "Retinoide y exfoliante ácido, la misma noche",
    explicacion:
      "Ojo con el motivo, porque el que circula está mal: NO es que el ácido 'desactive' al " +
      "retinoide — eso nunca tuvo evidencia detrás. Lo que pasa es que los dos aceleran la " +
      "renovación por vías distintas, y sumados la barrera no da abasto. Terminás con la cara " +
      "roja, descamando, y abandonando.",
    queHacer:
      "Noches alternas. Lunes exfoliante, martes retinoide, miércoles y jueves sólo hidratar. " +
      "Ese es el esquema que la gente sostiene.",
    evidencia:
      "La recomendación de separarlos es clínica y de tolerancia, no de química. La versión " +
      "'se desactivan' no aparece en la literatura.",
  },
  {
    id: "retinoide-x-vitamina-c",
    entre: ["familia:retinoide", "vit_c_laa"],
    clase: "irritacion",
    severidad: "cuidado",
    soloMismoMomento: true,
    titulo: "Vitamina C pura y retinoide en la misma aplicación",
    explicacion:
      "Se pueden usar los dos y de hecho se complementan: uno protege de día, el otro reconstruye " +
      "de noche. Lo que no conviene es apilarlos en la misma aplicación, porque la suma de " +
      "irritación no la aporta ninguno de los dos por separado.",
    queHacer: "Vitamina C a la mañana, retinoide a la noche. Es la rutina clásica y funciona.",
  },
  {
    id: "peroxido-x-acidos",
    entre: ["peroxido_benzoilo", "grupo:acido-libre"],
    clase: "irritacion",
    severidad: "cuidado",
    soloMismoMomento: true,
    titulo: "Peróxido de benzoilo y exfoliante ácido juntos",
    explicacion:
      "Los dos secan y los dos descaman. Juntos, en piel con acné que además ya viene irritada, " +
      "es la receta para la dermatitis que se confunde con 'me empeoró el acné'.",
    queHacer: "Elegí uno por momento del día, o alterná días.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ACUMULACIÓN
// Estas son las que más se disparan en la vida real, y las que ningún artículo
// de "no mezclar" cubre: nadie apila dos ingredientes prohibidos, todo el mundo
// apila tres productos que traen lo mismo sin enterarse.
// ─────────────────────────────────────────────────────────────────────────────

export const ACUMULACION: ReglaAcumulacion[] = [
  {
    id: "pila-exfoliante",
    sobre: "grupo:exfoliante",
    desde: 2,
    clase: "irritacion",
    severidad: "cuidado",
    titulo: "Más de un exfoliante en la misma rutina",
    explicacion:
      "Los ácidos vienen escondidos en limpiadores, tónicos y hasta en cremas, así que es muy " +
      "fácil terminar con dos o tres sin haberlo decidido. La exfoliación no se suma para bien: " +
      "pasado cierto punto sube la pérdida de agua y la piel queda peor que antes.",
    queHacer:
      "Dejá uno solo como exfoliante de la rutina y usalo dos o tres veces por semana. Los otros, " +
      "o se van, o se usan en días distintos.",
  },
  {
    id: "pila-retinoide",
    sobre: "familia:retinoide",
    desde: 2,
    clase: "irritacion",
    severidad: "separar",
    titulo: "Dos retinoides a la vez",
    explicacion:
      "No hay nada que ganar: los receptores son los mismos y se saturan. Lo único que se duplica " +
      "es la descamación.",
    queHacer: "Quedate con uno. Si querés subir potencia, subí la frecuencia antes que sumar frascos.",
  },
  {
    id: "pila-niacinamida",
    sobre: "niacinamida",
    desde: 3,
    clase: "redundancia",
    severidad: "nota",
    titulo: "Niacinamida repetida en varios pasos",
    explicacion:
      "No es un problema de seguridad: la niacinamida se lleva bien con todo y a esta altura está " +
      "en casi cualquier fórmula decente. Es un problema de plata. Si el tónico, el sérum, la " +
      "crema y el protector la traen, estás pagando cuatro veces por el mismo activo.",
    queHacer:
      "Si querés recortar la rutina, este es el paso por donde conviene empezar: sacá el sérum de " +
      "niacinamida y usá ese lugar para un activo que no estés cubriendo.",
  },
  {
    id: "pila-vitamina-c",
    sobre: "familia:vitamina-c",
    desde: 2,
    clase: "redundancia",
    severidad: "nota",
    titulo: "Vitamina C en dos productos distintos",
    explicacion:
      "No se pelean entre ellas. Simplemente no hace falta: pasado cierto punto no absorbés más " +
      "por poner más.",
    queHacer: "Quedate con la de mayor concentración y liberá el otro paso.",
  },
  {
    id: "pila-irritante",
    sobre: "grupo:irritante-potencial",
    desde: 2,
    clase: "irritacion",
    severidad: "cuidado",
    titulo: "Varios irritantes potenciales sumados",
    explicacion:
      "Fragancia, aceites esenciales y alcohol no aportan nada al resultado y sí a la cuenta de " +
      "irritación. Dos o tres productos que los traigan es una carga que se paga sin recibir nada.",
    queHacer:
      "Si tu piel reacciona fácil, este es el primer lugar donde recortar — antes que tocar los " +
      "activos, que sí están haciendo algo.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SINERGIAS
// ─────────────────────────────────────────────────────────────────────────────

export const SINERGIAS: Sinergia[] = [
  {
    id: "spf-x-despigmentante",
    requiere: ["familia:filtro", "grupo:despigmentante"],
    mismoMomento: false,
    enMatriz: false, // es sobre la rutina entera, no sobre un par de moléculas
    titulo: "El protector solar es lo que hace que lo demás sirva",
    explicacion:
      "Cualquier cosa que hagas contra las manchas trabaja en contra del sol. Sin protector, el " +
      "activo despigmentante está apagando un incendio con la manguera abierta del otro lado.",
    evidencia:
      "Es la única parte de una rutina para manchas que no es negociable, y la que más gente se saltea.",
  },
  {
    id: "niacinamida-x-retinoide",
    requiere: ["niacinamida", "familia:retinoide"],
    mismoMomento: false,
    titulo: "La niacinamida hace tolerable al retinoide",
    explicacion:
      "Es de las pocas combinaciones donde uno mejora al otro de verdad: la niacinamida refuerza " +
      "la barrera, y con la barrera mejor el retinoide pica y descama menos. Menos irritación " +
      "significa que lo seguís usando, y con retinoides la constancia es todo el resultado.",
    evidencia:
      "Hay trabajos que muestran menos sequedad, ardor y descamación cuando la niacinamida " +
      "acompaña al retinoide, frente al retinoide solo.",
  },
  {
    id: "vitamina-c-x-vitamina-e",
    requiere: ["vit_c_laa", "tocoferol"],
    mismoMomento: true,
    titulo: "Vitamina C con vitamina E",
    explicacion:
      "La vitamina E estabiliza a la C y le extiende la vida útil, y juntas protegen bastante más " +
      "que cualquiera de las dos sola. Si además la fórmula lleva ácido ferúlico, mejor todavía.",
    evidencia:
      "El trabajo de Pinnell y su equipo en Duke: 15% de ácido L-ascórbico + 1% de vitamina E + " +
      "0,5% de ferúlico duplica la fotoprotección respecto de C+E, y mantiene más del 90% del " +
      "activo tras un mes a 45 °C. Es la fórmula que copió toda la industria.",
  },
  {
    id: "niacinamida-x-vitamina-c",
    requiere: ["niacinamida", "familia:vitamina-c"],
    mismoMomento: true,
    titulo: "Niacinamida y vitamina C se potencian",
    explicacion:
      "Atacan la mancha por vías distintas —una frena la producción de pigmento, la otra frena su " +
      "transporte a la superficie— así que suman en vez de pisarse. Durante quince años se dijo " +
      "que no se podían mezclar; hoy las marcas grandes las formulan juntas en el mismo frasco.",
  },
  {
    id: "niacinamida-x-tranexamico",
    requiere: ["niacinamida", "tranexamico"],
    mismoMomento: false,
    titulo: "Niacinamida con ácido tranexámico",
    explicacion:
      "La dupla más interesante para melasma y marcas que quedan después de un granito, y sin " +
      "el costo de irritación que tienen los ácidos exfoliantes.",
    evidencia:
      "Ensayos con séricos que combinan tranexámico y niacinamida muestran mejoras medibles del " +
      "índice de melasma desde las primeras semanas.",
  },
  {
    id: "adapaleno-x-peroxido",
    requiere: ["adapaleno", "peroxido_benzoilo"],
    mismoMomento: true,
    titulo: "Adapaleno con peróxido de benzoilo: la excepción",
    explicacion:
      "Es el contraejemplo perfecto del 'no mezclar retinoides con peróxido'. El adapaleno no se " +
      "degrada, y la combinación funciona mejor que cualquiera de los dos por separado.",
  },
  {
    id: "color-x-manchas",
    requiere: ["oxidos_de_hierro", "grupo:despigmentante"],
    mismoMomento: false,
    titulo: "Para manchas, el protector con color protege más",
    explicacion:
      "La luz visible —la de las pantallas y la de un día nublado— dispara melasma, y los filtros " +
      "UV normales no la frenan. Los óxidos de hierro que dan el color sí. Si estás trabajando " +
      "manchas, el protector con color no es una cuestión de maquillaje: es parte del tratamiento.",
  },
  {
    id: "uva400-x-manchas",
    requiere: ["filtro_uva_400", "grupo:despigmentante"],
    mismoMomento: false,
    titulo: "Protección hasta 400 nm cuando el problema es el pigmento",
    explicacion:
      "La franja de UVA de 380 a 400 nm es la que más pigmenta y la que casi ningún protector " +
      "cubre. Si venís peleando con manchas que vuelven, este es el detalle que cambia el " +
      "resultado más que agregar otro sérum.",
    evidencia:
      "Ensayo aleatorizado: menos pigmentación inducida por UVA1 frente a un protector que sólo " +
      "llega a 370 nm.",
  },
  {
    id: "melasyl-x-niacinamida",
    requiere: ["melasyl", "niacinamida"],
    mismoMomento: true,
    titulo: "Melasyl con niacinamida",
    explicacion:
      "Atacan el pigmento en dos puntos distintos de la misma cadena: uno atrapa el precursor " +
      "antes de que se convierta en melanina, la otra frena que la melanina ya formada suba a la " +
      "superficie. Vienen formulados juntos, y tiene sentido que así sea.",
  },
  {
    id: "barrera-x-activo",
    requiere: ["grupo:barrera-reparadora", "grupo:renovador"],
    mismoMomento: false,
    enMatriz: false, // ídem: habla del paso hidratante, no de dos ingredientes
    titulo: "El paso que sostiene a los activos",
    explicacion:
      "Ceramidas, pantenol, centella y niacinamida no son un paso opcional cuando hay activos " +
      "fuertes en la rutina: son lo que hace que puedas seguir usándolos. Casi todos los abandonos " +
      "de retinoide o de ácidos son abandonos por irritación, no por falta de resultado.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MITOS
// Se desmienten cuando la combinación aparece en la rutina de la persona, no en
// abstracto. Callarse acá tiene un costo concreto: alguien googlea, encuentra
// el mito, y desarma una rutina que estaba bien.
// ─────────────────────────────────────────────────────────────────────────────

export const MITOS: Mito[] = [
  {
    id: "mito-vitc-niacinamida",
    requiere: ["familia:vitamina-c", "niacinamida"],
    titulo: "«Vitamina C y niacinamida no se pueden mezclar»",
    loQueSeDice:
      "Que se neutralizan y que al juntarse forman niacina, que enrojece la cara.",
    loQueSabemos:
      "Viene de estudios de los años 60 sobre estabilidad, hechos a pH muy bajo y con calor " +
      "sostenido durante días. En esas condiciones, sí: parte de la niacinamida se convierte en " +
      "niacina. En un producto terminado, tamponado, con conservantes y a temperatura ambiente, " +
      "la conversión es despreciable. Y lo de que 'se neutralizan' nunca tuvo sustento. Hoy las " +
      "dos se recomiendan juntas para manchas y opacidad, y hay fórmulas de góndola que las traen " +
      "en el mismo frasco.",
    evidencia:
      "A pH 2 y 90 °C hace falta más de 75 horas para convertir la mitad. Tu crema no vive ahí.",
  },
  {
    id: "mito-esperar-30-minutos",
    requiere: ["grupo:acido-libre"],
    titulo: "«Hay que esperar 30 minutos después del ácido»",
    loQueSeDice:
      "Que si ponés otra cosa encima antes de media hora, subís el pH y anulás el exfoliante.",
    loQueSabemos:
      "Las fórmulas están tamponadas: sostienen su pH contra las cantidades chiquitas con las que " +
      "se encuentran. Haría falta muchísimo más líquido del que trae un sérum para mover el pH de " +
      "un tónico de ácido glicólico. Además, para cuando aplicás lo siguiente el ácido ya estuvo " +
      "en contacto con la piel. Esperar un minuto tiene sentido para que no se apelotonen los " +
      "productos; media hora es tiempo perdido, y es una de las razones por las que la gente " +
      "abandona las rutinas largas.",
  },
  {
    id: "mito-alcohol-denat",
    requiere: ["alcohol_denat"],
    titulo: "«El alcohol denat arruina la piel»",
    loQueSeDice:
      "Que reseca, destruye la barrera y hay que evitar cualquier producto que lo lleve.",
    loQueSabemos:
      "Depende de para qué está y de qué piel tenés. En un protector solar, el alcohol es lo que " +
      "hace que la textura sea liviana y se seque rápido — y un protector que se usa todos los días " +
      "protege infinitamente más que uno perfecto que queda en el cajón. Se evapora en segundos y " +
      "no se queda en la piel. Dicho eso: si tu piel es seca, reactiva o está con la barrera " +
      "dañada, sí lo vas a notar, y ahí conviene buscar una fórmula sin alcohol. No es veneno ni " +
      "es inofensivo: es un ingrediente con un costo y un beneficio concretos.",
  },
  {
    id: "mito-acidos-desactivan-retinol",
    requiere: ["familia:retinoide", "grupo:acido-libre"],
    titulo: "«Los ácidos desactivan el retinol»",
    loQueSeDice: "Que el pH bajo del exfoliante inutiliza al retinoide.",
    loQueSabemos:
      "No hay estudios que lo muestren. El retinol no depende del pH como la vitamina C pura: la " +
      "piel lo convierte por vía enzimática, adentro de la célula. Ahora bien, la recomendación " +
      "de separarlos sigue siendo buena — pero por irritación acumulada, que es un motivo " +
      "distinto y se arregla de otra manera: alternando noches, no cambiando el orden.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAPA PRODUCTO → ACTIVOS
//
// Clave: `ml_id`, que es la clave natural del catálogo (la misma con la que se
// deduplica). Va aparte de `productos.ts` a propósito: ese archivo es la fuente
// de verdad comercial (links, precios, fotos) y este es la capa curada, igual
// que el overlay del vault. Se pueden actualizar por separado.
//
// PROCEDENCIA DE CADA LISTA:
//   [INCI]  → lista de ingredientes verificada contra la ficha del fabricante o
//             una base de datos de INCI.
//   [vault] → declarada en el .md del vault de Club de Piel.
//   []      → no se verificó. Queda vacío a propósito: el motor no avisa nada
//             sobre este producto en vez de inventar.
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVOS_POR_PRODUCTO: Record<string, string[]> = {
  // ── Altas manuales del 9/9/2026, mapeadas desde el INCI completo ──────────
  // Round Lab Dokdo: hialurónico en tres formas, pantenol, alantoína y ceramida NP.
  //
  // El ácido cítrico del INCI NO se mapea, y la decisión vale para los dos
  // limpiadores de esta tanda. Aparece al final de la lista, entre conservantes:
  // es ajustador de pH a menos de medio por ciento, no un exfoliante. Mapearlo
  // sumaba carga al grupo "exfoliante" y ensuciaba 19 rutinas con un aviso que no
  // le sirve a nadie.
  //
  // Ojo con la inconsistencia que esto deja a la vista: de 74 productos, uno solo
  // declara aha_citrico. O se mapea en todos los INCI donde aparece —y entonces
  // sube el conflicto en todo el catálogo— o en ninguno salvo que sea exfoliante
  // de verdad. Hoy la convención de hecho es la segunda, y esto la sigue.
  // [INCI] fuente sin registrar — ver docs/AUDITORIA-PRODUCTOS.md
  MLA28943962: ["hialuronico", "panthenol", "alantoina", "ceramidas"],
  // Vanicream Moisturizing Lotion: vacio a proposito. Once ingredientes y
  // ninguno es un activo que el motor conozca — hidrata por oclusion, con
  // petrolatum. No tener activos no es un dato faltante, es la formula.
  // Vanicream Moisturizing Lotion [INCI] — verificado el 11/9/2026: vaselina,
  // propilenglicol, alcohol ceteárico y emulsionantes. Nada del diccionario.
  //
  // Vacío VERIFICADO, que no es lo mismo que vacío por no haber mirado: la
  // fórmula es deliberadamente mínima y no tiene activos que declarar.
  MLAU3880810580: [],
  // Haruharu Black Rice Airyfit [INCI] — verificado el 12/9/2026 sobre la lista
  // completa (51 ingredientes). Filtros orgánicos: Mexoryl SX, Tinosorb S,
  // triazona y Uvinul A Plus. Sin fragancia, sin aceites esenciales, sin alcohol
  // denat.
  //
  // Se suma FITOESFINGOSINA, que estaba en el INCI y faltaba en el mapeo.
  // Confirma además la nota vieja: el Butyloctyl Salicylate es emoliente y no
  // salicílico, así que no suma carga exfoliante.
  MLAU3860746273: ["filtro_quimico", "niacinamida", "adenosina", "ceramidas", "fitoesfingosina", "tocoferol"],
  // Vanicream Vitamin C [INCI] — verificado el 12/9/2026 contra la ficha de la
  // marca. Tetrahexildecil ascorbato: derivado liposoluble, no ácido ascórbico.
  // Cinco ceramidas (NP, EOP, AP, NG, AS), carnosina y fitoesteroles. El cítrico
  // va al final entre ajustadores. Sin fragancia ni alcohol denat.
  MLAU4347154318: ["vit_c_derivado", "ceramidas", "carnosina"],
  // Vanicream Daily Facial Moisturizer [INCI] — verificado el 12/9/2026 contra la
  // ficha de la marca. Mapeo exacto y completo: escualano, hialurónico, cinco
  // ceramidas (EOP, NG, NP, AS, AP) y carnosina. Sin fragancia ni conservantes
  // clásicos; lista de 19 ingredientes.
  MLAU4938195565: ["escualano", "hialuronico", "ceramidas", "carnosina"],
  // Vanicream Gentle Cleanser: vacio a proposito, son tensioactivos suaves.
  // [INCI] fuente sin registrar — ver docs/AUDITORIA-PRODUCTOS.md
  MLAU3382695636: [],
  // Haruharu Black Rice Pure Mineral [INCI] — verificado el 11/9/2026. Mapeo
  // confirmado entero: óxido de zinc como filtro físico, niacinamida,
  // hialuronato, ceramida y tocoferol.
  //
  // Confirma también la nota que ya estaba: el `Butyloctyl Salicylate` es
  // emoliente y NO salicílico, así que no suma carga exfoliante.
  //
  // Importa que sea mineral de verdad: es el único del catálogo con óxido de
  // zinc, está en 110 rutinas, y es el candidato del hueco de protector para
  // piel sensible que COMPRAR.md §3 daba por abierto.
  MLA2068351806: ["filtro_mineral", "niacinamida", "hialuronico", "ceramidas", "tocoferol"],
  // Haruharu Wonder Black Rice Moisture 5.5 Soft Cleansing Gel [INCI] —
  // verificado el 11/9/2026. Confirma el mapeo: filtrado de fermento de
  // Aspergillus y raíz de ginseng.
  //
  // La marca lo declara sin fragancia, sin aceites y sin sulfatos, y el INCI lo
  // sostiene: los tensioactivos son coco-betaína y cocoil glicinato de potasio.
  // El cítrico va al final y no se cuenta, como en el resto de la tanda.
  MLA37826532: ["arroz_fermentado", "ginseng"],
  // ── Limpiadores ────────────────────────────────────────────────────────────
  // Idraet Espuma Extra Suave · sin activos declarados, y está bien que así sea:
  // un limpiador que se enjuaga no es el lugar para poner activos.
  // [pendiente] fuente sin registrar — ver docs/AUDITORIA-PRODUCTOS.md
  MLA21801426: [],
  // CeraVe Gel Limpiador Espumoso [INCI] — reverificado el 12/9/2026. El INCI
  // trae además COLESTEROL y FITOESFINGOSINA, que faltaban en este mapeo y sí
  // estaban en el del otro listado del mismo producto (MLAU141343879). Los dos
  // quedan iguales: es la misma fórmula en dos publicaciones distintas.
  MLA25800983: ["ceramidas", "niacinamida", "hialuronico", "colesterol", "fitoesfingosina"],
  // COSRX Low pH Good Morning [INCI] — el BHA suave + tea tree que lo saca de
  // las rutinas de piel sensible.
  MLA11139349: ["bha_betaina_salicilato", "aceite_esencial_tea_tree"],
  // Mixsoon Centella Cleansing Foam [INCI] — verificado el 11/9/2026. Confirma
  // lo que traía del vault: salicílico de verdad, en un limpiador que se enjuaga.
  //
  // Los tensioactivos sí son suaves —cocoil isetionato, cocoil glicinato,
  // metil cocoil taurato—, así que lo que lo saca de las rutinas de acné no es
  // la base sino el ácido. El cítrico va al final, entre ajustadores, y no se
  // cuenta como exfoliante.
  MLAU3453545171: ["centella", "bha_salicilico"],
  // Skin1004 Madagascar Centella Ampoule Foam [INCI] — verificado el 11/9/2026
  // contra la página oficial de la marca, y corrige al vault: sale `aha_citrico`.
  //
  // El `Citric Acid` está en la posición 12, entre benzoato de potasio y cloruro
  // de sodio, y la marca declara pH 5. Es ajustador de pH, no exfoliante, que es
  // exactamente el criterio que ya se había fijado para los otros limpiadores de
  // esta tanda. Contarlo le sumaba carga al grupo `exfoliante` que la fórmula no
  // tiene.
  //
  // Los tensioactivos son suaves: cocoil isetionato, metil cocoil taurato,
  // coco-betaína y cocoil glicinato.
  MLA47129399: ["centella", "hialuronico"],
  // Cleanex Free Gel [INCI] — verificado el 11/9/2026 contra el prospecto oficial
  // de Panalab y una base de ingredientes independiente, que coinciden: trae
  // `Fragrance (Parfum)` en la posición 10. Estaba cargado como "no verificado"
  // con la lista vacía, que el motor lee como "no tiene nada", así que el
  // producto pasaba por limpio en 36 rutinas.
  //
  // El `Sodium Laureth Sulfate` de la posición 4 no se mapea porque el
  // diccionario no modela tensioactivos: no hay activo al que apuntar. Queda
  // dicho acá igual, porque `COMPRAR.md` §1 pide tensioactivos suaves y el SLES
  // no lo es.
  MLA27603374: ["fragancia"],
  // Beauty of Joseon Ginseng Cleansing Oil [INCI] — verificado el 11/9/2026
  // contra la tienda oficial de la marca. Ginseng en cuatro formas y tocoferol,
  // como ya estaba.
  //
  // LO QUE NO SE PUEDE DECLARAR, Y CONVIENE SABERLO. El INCI trae además aceites
  // esenciales de salvia, artemisa y albahaca, y alcanfor. Este diccionario sólo
  // modela tres: tea tree, romero y menta. No hay activo al que apuntar, así que
  // el motor no los ve y este producto le parece limpio.
  //
  // No se inventa un id acá: agregar un `aceite_esencial` genérico cambiaría
  // varios productos de una vez y es una decisión de criterio, no de carga de
  // datos. Queda anotado en el registro de auditoría como decisión pendiente.
  MLA37240248: ["ginseng", "tocoferol"],

  // ── Tónico ─────────────────────────────────────────────────────────────────
  // TIRTIR Milk Skin Toner [INCI] — niacinamida alta en la lista, y hamamelis.
  //
  // SALE `menta`, el 12/9/2026. El INCI declara `Mentha Piperita (Peppermint)
  // Leaf Extract` —extracto de hoja, en la cola de una lista de 35
  // ingredientes— y el id `menta` de este diccionario es "Menta / mentol", de
  // familia aceite-esencial. El extracto no es el aceite esencial ni el mentol
  // aislado, y apuntarlo ahí era afirmar más de lo que dice el envase.
  //
  // Es la regla que el resto del mapa ya seguía sin estar escrita: los otros
  // tres productos con aceite esencial apuntan a un ACEITE que el INCI nombra
  // —`Rosmarinus Officinalis Leaf Oil` en el Celimax, `Melaleuca Alternifolia
  // Leaf Oil` en los dos Skin1004 y el COSRX—. Éste era el único que apuntaba a
  // un extracto. Y el propio diccionario ya distingue por forma: `hamamelis`
  // tiene carga 0 porque "como agua o extracto sin alcohol es inofensivo".
  //
  // El respaldo externo es el CIR: en HRIPT, 2,5% de extracto de menta dio
  // negativo para irritación y sensibilización, y los casos publicados son del
  // ACEITE y de sus constituyentes. La reserva del panel es sobre la pulegona
  // (≤1%) y sobre el mentol como promotor de penetración — ninguno de los dos
  // es lo que declara este INCI.
  MLAU3481553718: ["niacinamida", "panthenol", "centella", "alantoina", "hialuronico", "hamamelis"],

  // ── Séricos ────────────────────────────────────────────────────────────────
  // Garnier Sérum Anti Manchas Vitamina C [INCI] — no es vitamina C pura:
  // es ascorbil glucósido. Y trae ácido salicílico, que nadie espera en un
  // sérum de vitamina C. Además, fragancia con limoneno, linalol y geraniol.
  MLA18957818: [
    "vit_c_derivado",
    "niacinamida",
    "bha_salicilico",
    "resorcinol_fenetil",
    "hialuronico",
    "adenosina",
    "fragancia",
  ],
  // The Ordinary Niacinamida 10% + Zinc 1% [INCI] — verificado el 11/9/2026.
  // Once ingredientes: niacinamida, zinc PCA y vehículos. Sin fragancia, sin
  // ácidos, sin alcohol denat.
  MLA23033385: ["niacinamida", "zinc_pca"],

  // ── Contorno ───────────────────────────────────────────────────────────────
  // Vichy Minéral 89 Eyes [INCI] — lista corta, sin fragancia. Nada que choque.
  MLA18956630: ["hialuronico", "cafeina"],

  // ── Hidratantes ────────────────────────────────────────────────────────────
  // L'Oréal Revitalift Glass Skin [INCI] — niacinamida + ascorbil glucósido en
  // el mismo frasco: la mejor prueba de que el mito de "C con niacinamida" cayó.
  // Trae fragancia, que es lo que lo deja fuera de piel sensible.
  MLA65451035: ["niacinamida", "vit_c_derivado", "panthenol", "hialuronico", "adenosina", "fragancia"],
  // Skin1004 Tea-trica B5 [INCI] — verificado el 11/9/2026. Confirma lo que ya
  // estaba y agrega hialurónico, alantoína y tocoferol.
  //
  // El tea tree aparece dos veces: agua de hoja a 94.000 ppm y aceite de hoja a
  // 300 ppm. Más ácido mandélico. Por eso salió del motor.
  //
  // Y deja a la vista un dato mal cargado que sigue sin corregirse: el producto
  // está marcado `apto_sensible: true` teniendo tea tree, que es causa conocida
  // de dermatitis de contacto. Ver docs/AUDITORIA-PRODUCTOS.md.
  MLA37722163: ["panthenol", "ceramidas", "niacinamida", "centella", "aceite_esencial_tea_tree", "aha_mandelico", "hialuronico", "alantoina", "tocoferol"],
  // La Roche-Posay Toleriane Dermallergo · sin activos a propósito: su propuesta
  // es exactamente la lista de ingredientes más corta posible. No es un hueco
  // de datos, es la fórmula.
  // LRP Toleriane Dermallergo [INCI] — verificado el 11/9/2026. Sin fragancia,
  // sin alcohol denat y sin ácidos; la marca declara además "fragrance & essential
  // oil-free". Lo que hay para declarar son dos emolientes: escualano y karité.
  //
  // El `Citric Acid` del INCI no se mapea, por la misma razón que en los
  // limpiadores de la tanda anterior: va al final, entre ajustadores, y contarlo
  // sumaría carga exfoliante que la fórmula no tiene.
  MLA19866311: ["escualano", "manteca_karite"],
  // Beauty of Joseon Dynasty Cream [INCI] — verificado el 11/9/2026, y corrige
  // al vault: el INCI dice `Oryza Sativa (Rice) Bran Water`, que es agua de
  // salvado de arroz y NO un fermento. `arroz_fermentado` se define en este
  // diccionario como extracto fermentado, así que no corresponde y sale.
  //
  // Entran `escualano` y `adenosina`, que estaban en el INCI y faltaban. Sin
  // fragancia, sin ácidos, sin alcohol denat. La ceramida es Ceramide NP.
  MLA21179266: ["niacinamida", "ceramidas", "ginseng", "hialuronico", "escualano", "adenosina"],
  // Lidherma Hyaluronic 4D [INCI] — verificado el 12/9/2026. El comentario viejo
  // decía "humectante puro" y era falso: además de las cuatro formas de
  // hialurónico, el INCI declara FRAGANCIA y cinco alérgenos de declaración
  // obligatoria — bencil salicilato, citronelol, limoneno, linalol e ionona.
  MLA19474747: ["hialuronico", "fragancia"],
  // COSRX Advanced Snail 92 [INCI] — verificado el 11/9/2026 contra la página
  // oficial de COSRX. El mapeo que venía del vault estaba bien y no se cambia:
  // filtrado de baba, pantenol, alantoína, adenosina e hialurónico de sodio.
  // Sin fragancia, sin ácidos y sin alcohol denat.
  //
  // Importaba confirmarlo: es el producto que más aparece en el catálogo, en 376
  // de las rutinas sin conflicto. Si el mapeo hubiera estado mal, se equivocaba
  // más rutinas que cualquier otro.
  MLA45253335: ["mucina_caracol", "panthenol", "alantoina", "adenosina", "hialuronico"],
  // Dermaglós Crema de Día Ultra Volumen FPS30 [INCI] — verificado el 12/9/2026
  // contra Andrómaco y confirmado en un retailer independiente. Estaba mapeada
  // como `filtro_quimico` a secas y trae ocho activos más.
  //
  // DOS DE ELLOS IMPORTAN. Tiene FRAGANCIA, y tiene PALMITATO DE RETINILO: un
  // retinoide escondido en lo que el catálogo usa como paso de protector solar.
  // Es el tercer caso del proyecto, después del Mela B3 y el Pure Vitamin C12.
  //
  // Ojo con el encuadre además del mapeo: la ficha de ML la vende como crema
  // antiedad para 40+, piel normal a seca, y nosotros la usamos de protector.
  // Ver docs/AUDITORIA-PRODUCTOS.md.
  MLA24692733: [
    "filtro_quimico",
    "filtro_avobenzona",
    "niacinamida",
    "panthenol",
    "alantoina",
    "hialuronico",
    "tocoferol",
    "fragancia",
    "retinil_ester",
  ],

  // Beauty of Joseon Relief Sun: Rice + Probiotics [INCI] — verificado el
  // 11/9/2026 con la lista completa. La primera búsqueda la devolvió cortada en
  // el ingrediente 33 de 42, y la cola es justo donde suele ir la fragancia, así
  // que no alcanzaba para darlo por limpio. Con la lista entera: sin fragancia,
  // sin alcohol denat y sin ácidos.
  //
  // Se suman `adenosina` y `ginseng`, que el mapeo del vault no traía. Los cuatro
  // filtros son orgánicos.
  MLA21801065: ["filtro_quimico", "niacinamida", "arroz_fermentado", "tocoferol", "adenosina", "ginseng"],
  // ISDIN Fusion Water Magic [INCI]
  MLA26916726: ["filtro_quimico"],
  // COSRX Ultra-Light Invisible [INCI]
  MLA2097460920: ["filtro_quimico", "niacinamida", "tocoferol", "hialuronico", "adenosina", "hamamelis"],
  // Eucerin Sun Gel-crema Oil Control Toque Seco FPS50+ [INCI] — verificado el
  // 12/9/2026. Mapeo exacto: homosalato, avobenzona, salicilato de etilhexilo y
  // octocrileno como filtros, más licochalcona, glicirretínico y alcohol denat.
  // Sin fragancia y SIN óxidos de hierro, que es lo que lo separa del Tono Medio.
  //
  // Trae mentoxipropanodiol, derivado sintético de mentol. No se mapea a `menta`:
  // el diccionario define ese activo como aceite esencial, y éste no lo es. Queda
  // dicho acá porque para piel reactiva la sensación de fresco igual cuenta.
  MLA16048275: ["filtro_quimico", "filtro_avobenzona", "licochalcona", "glicirretinico", "alcohol_denat"],
  // Skin1004 Hyalu-Cica Water-Fit Sun Serum [INCI] — verificado el 11/9/2026.
  // Confirma lo que traía del vault y suma tocoferol y adenosina. Sin fragancia.
  //
  // Los cuatro filtros son orgánicos y por eso van como `filtro_quimico`. Ojo con
  // el Methylene Bis-Benzotriazolyl Tetramethylbutylphenol: es una partícula
  // orgánica microfina, no un filtro mineral. Que sea "partícula" no lo convierte
  // en óxido de zinc, y esa distinción es justo la que importa en el hueco de
  // protector mineral para piel sensible.
  MLA24454808: ["filtro_quimico", "centella", "niacinamida", "hialuronico", "tocoferol", "adenosina"],
  // ISDIN Fusion Water Magic Color Light [INCI]
  MLA20067103: ["filtro_quimico"],
  // NIVEA Protector Solar Facial Control Anti-Brillo · filtros no verificados en
  // detalle; se declara sólo lo seguro.
  // [INCI] fuente sin registrar — ver docs/AUDITORIA-PRODUCTOS.md
  MLA16189493: ["filtro_quimico"],

  // ── Exfoliante ─────────────────────────────────────────────────────────────
  // The Ordinary Glycolic Acid 7% [INCI] — el único exfoliante fuerte del
  // catálogo. Hoy ningún tier lo incluye (decisión de producto), así que el
  // motor no lo ofrece; queda cargado para cuando vuelva.
  MLA29493655: ["aha_glicolico", "ginseng"],

  // ═══════════════════════════════════════════════════════════════════════════
  // VAULT "ORGANIZE" · 46 productos de dermocosmética de farmacia.
  // Todas las listas salen del INCI que trae el propio .md, salvo las cuatro
  // marcadas [externo], verificadas contra la ficha del fabricante.
  // ═══════════════════════════════════════════════════════════════════════════

  // SkinCeuticals C E Ferulic [INCI] — verificado el 12/9/2026 contra la ficha de
  // la marca. Es la fórmula del paper: ascórbico 15%, tocoferol 1% y ferúlico
  // 0,5%, más carnosina, pantenol e hialuronato. Sin fragancia ni alcohol denat.
  //
  // Es el único producto del catálogo con una afirmación de nivel A sostenida por
  // la concentración declarada. Ver docs/CALIDAD.md §5.
  MLA24840827: ["vit_c_laa", "tocoferol", "ferulico", "carnosina", "panthenol", "hialuronico"],
  // Kosmos Vitamina C Pura [INCI] — verificado el 11/9/2026 contra la página de
  // la marca. Once ingredientes y el mapeo entero confirmado: ácido ascórbico al
  // 15%, ferúlico 0,5%, tocoferol 1%, ceramida NP y D-pantenol.
  //
  // Confirma lo que CALIDAD.md §5 usa de ejemplo: replica el trío del paper y
  // suma ceramida. Sin fragancia y sin otros ácidos.
  MLA45672941: ["vit_c_laa", "tocoferol", "ferulico", "ceramidas", "panthenol"],
  // LRP Pure Vitamin C12 [INCI] — verificado el 12/9/2026. Confirma la trampa №2
  // de INGREDIENTES.md §10.3: ácido ascórbico puro con ÁCIDO SALICÍLICO adentro,
  // que nadie espera en un sérum de vitamina C.
  //
  // Trae además alcohol denat (quinto) y `Parfum`. La Neurosensine (acetil
  // dipéptido-1 cetil éster) no tiene id en el diccionario.
  MLA47223033: ["vit_c_laa", "bha_salicilico", "hialuronico", "adenosina", "tocoferol", "peptidos", "alcohol_denat", "fragancia"],
  // Vichy Liftactiv Supreme Vitamina C [INCI] — verificado el 12/9/2026. Once
  // ingredientes: ascórbico puro al 15% segundo, alcohol denat tercero, tocoferol
  // e hialurónico hidrolizado, más polifenoles de pino marítimo.
  //
  // SIN fragancia, declarado por la marca. Es de las listas más cortas del
  // catálogo, y esa brevedad es parte de la propuesta.
  MLA19710676: ["vit_c_laa", "tocoferol", "hialuronico", "alcohol_denat"],

  // Neutrogena Retinol Boost [pendiente] — 12/9/2026. Se suma ÁCIDO ASCÓRBICO,
  // que el INCI declara y faltaba: es vitamina C pura conviviendo con retinol.
  // Confirmados retinol, bisabolol, hialuronato y `Parfum`.
  //
  // QUEDA UNA DUDA CONCRETA: la lista que se consiguió es la europea de 50 ml y
  // no incluye tocoferol —su antioxidante es BHT—, pero el mapeo sí lo declara.
  // No se quita porque no se pudo leer la fórmula argentina: neutrogena.com.ar
  // responde 403. Se resuelve leyendo el envase de 30 ml.
  MLA58622882: ["retinol", "hialuronico", "bisabolol", "tocoferol", "fragancia", "vit_c_laa"],
  // Eximia Hyalu-R Concentré [INCI] — verificado el 12/9/2026 contra la ficha del
  // laboratorio. Trae DOS retinoides a la vez, retinol y palmitato de retinilo,
  // más niacinamida, pantenol, ferúlico, hialurónico hidrolizado, alfa-tocoferol
  // y `Parfum`. Sin alcohol.
  MLA20021768: ["retinol", "retinil_ester", "niacinamida", "panthenol", "ferulico", "hialuronico", "tocoferol", "fragancia"],
  // LRP Retinol B3 [INCI] — verificado el 12/9/2026. Trae DOS retinoides: retinol
  // puro y palmitato de retinilo, más niacinamida al 2%, hialuronato y adenosina.
  // Alcohol denat va cuarto y también declara `Parfum`.
  MLAU244146565: ["retinol", "retinil_ester", "niacinamida", "hialuronico", "adenosina", "tocoferol", "alcohol_denat", "fragancia"],

  // LRP Mela B3 [INCI] — verificado el 12/9/2026. Confirma la trampa №1 de
  // INGREDIENTES.md §10.3: es un sérum de niacinamida al 10% que además trae
  // PALMITATO DE RETINILO, o sea un retinoide que nadie espera ahí, y ácido
  // capriloil salicílico (LHA). Melasyl es 2-mercaptonicotinoil glicina.
  //
  // Se suma FRAGANCIA, que el INCI declara y faltaba en el mapeo.
  MLA34459961: ["niacinamida", "melasyl", "retinil_ester", "bha_lha", "tiosulfato_sodio", "carnosina", "glicirricinato", "hialuronico", "tocoferol", "fragancia"],
  // LRP Mela B3 [INCI] — verificado el 12/9/2026. Confirma la trampa №1 de
  // INGREDIENTES.md §10.3: es un sérum de niacinamida al 10% que además trae
  // PALMITATO DE RETINILO, o sea un retinoide que nadie espera ahí, y ácido
  // capriloil salicílico (LHA). Melasyl es 2-mercaptonicotinoil glicina.
  //
  // Se suma FRAGANCIA, que el INCI declara y faltaba en el mapeo.
  MLA26197969: ["niacinamida", "melasyl", "retinil_ester", "bha_lha", "tiosulfato_sodio", "carnosina", "glicirricinato", "hialuronico", "tocoferol", "fragancia"],
  // Eximia Hyalu-N Concentré [INCI] — verificado el 12/9/2026 contra la ficha del
  // laboratorio. Confirma la trampa №4 de INGREDIENTES.md §10.3: se vende como
  // niacinamida y el "Cobio AHA" es un complejo entero —glicólico, láctico,
  // málico y tartárico— más urea, tranexámico y `Parfum`.
  //
  // El INCI dice `alcohol` a secas, que es etanol. Se mapea a `alcohol_denat`
  // porque el diccionario modela ese riesgo y es el mismo; queda dicho acá que la
  // lista no usa la forma desnaturalizada.
  MLA29882074: ["niacinamida", "tranexamico", "aha_glicolico", "aha_lactico", "aha_malico", "aha_tartarico", "urea", "hialuronico", "alcohol_denat", "fragancia"],
  // Dermaglós Sérum Niacinamida [INCI] — verificado el 12/9/2026 contra Andrómaco.
  // Mapeo exacto y completo: niacinamida al 10%, gluconato de zinc y `Fragrance`.
  // Trece ingredientes en total.
  MLAU209241342: ["niacinamida", "zinc_gluconato", "fragancia"],
  // Detenage N [pendiente] — 12/9/2026. Panalab no publica el INCI: su web
  // responde 403 a la lectura automática y las fichas de farmacia sólo listan
  // activos con porcentaje (niacinamida 10%, hialurónico 1% + 0,5%). Mismo caso
  // que Idraet: hay que leer la etiqueta física.
  MLAU1655818860: ["niacinamida", "hialuronico"],

  // Eximia Hyalu-B Concentré [INCI] — verificado el 12/9/2026 contra la ficha del
  // laboratorio. Confirma la trampa №3 de INGREDIENTES.md §10.3: lleva GLUCONATO
  // DE COBRE, que es el metal que oxida al ascorbato.
  //
  // Trae además niacinamida, pantenol, gluconato de zinc, hialurónico y `Parfum`.
  // No lleva vitamina C propia: el conflicto aparece al combinarlo con otra.
  MLA45991792: ["panthenol", "niacinamida", "cobre_gluconato", "zinc_gluconato", "hialuronico", "fragancia"],
  // LRP Hyalu B5 Suractivated [INCI] — reemplazó al anterior. Verificado: misma
  // lista, incluidos alcohol denat y fragancia.
  MLA59802317: ["hialuronico", "panthenol", "madecassosido", "adenosina", "tocoferol", "alcohol_denat", "fragancia"],
  // Neutrogena Hydro Boost sérum concentrado [INCI] — verificado el 12/9/2026.
  // Lista corta: hialuronato de sodio y pantenol sobre glicerina y gelificantes
  // (carragenano, agar, xantana). Sin fragancia, sin alcohol y sin ácidos.
  MLA22655637: ["hialuronico", "panthenol", "fragancia"],
  // L'Oréal Revitalift Hialurónico 1,5% [INCI] — verificado el 12/9/2026. Catorce
  // ingredientes: hialuronato de sodio, ascorbil glucósido (derivado de vitamina
  // C) y un dipéptido. Sin fragancia y sin alcohol denat.
  //
  // El pantotenato de calcio NO se mapea como `panthenol`: es la sal del ácido
  // pantoténico, no el alcohol que el diccionario nombra.
  MLA18956615: ["hialuronico", "vit_c_derivado", "peptidos"],
  // Vichy Minéral 89 [INCI] — verificado el 12/9/2026. Lista de trece
  // ingredientes: hialuronato de sodio y biosacárido, sobre agua y humectantes.
  // Sin perfume y sin alcohol, declarado por la marca.
  //
  // El 89% de agua volcánica que promete el nombre NO se mapea como `agua_termal`:
  // el INCI declara `Aqua` a secas, y mapearlo sería inferir desde el marketing.
  MLA18964459: ["hialuronico"],
  // Skin1004 Tea-trica Relief Ampoule [INCI] — verificado el 12/9/2026. Agua de
  // hoja de tea tree como SEGUNDO ingrediente y además aceite de tea tree cerca
  // del final, más centella. Sin fragancia y sin ácidos.
  //
  // El tea tree es causa conocida de dermatitis de contacto, así que pesa aunque
  // el producto se venda como calmante.
  MLA38719413: ["centella", "aceite_esencial_tea_tree", "panthenol", "hialuronico"],
  // Skin1004 Poremizing Fresh Ampoule [INCI] — verificado el 12/9/2026. Centella
  // como primer ingrediente, aloe, péptidos —incluido cobre tripéptido-1—,
  // pantenol, hialurónico en tres formas y glicirrizinato. Se suma ascórbico
  // etílico, que es derivado de vitamina C y faltaba.
  //
  // Ojo: el cobre y el ascorbato conviven en esta fórmula, que es la pelea que el
  // diccionario modela. Acá los dos están declarados.
  MLA43183566: ["centella", "panthenol", "hialuronico", "vit_c_derivado", "aloe", "peptidos", "peptidos_cobre", "glicirricinato"],
  // Celimax The Real Noni Energy Ampoule [INCI] — verificado el 12/9/2026.
  // Extracto de noni al 71,77% como base, más ceramida NP, escualano, karité y
  // aceites de oliva y de semilla de noni.
  //
  // Se declara ACEITE ESENCIAL DE ROMERO, que el INCI lista y el diccionario sí
  // sabe nombrar. La decisión de no declarar aceites era sobre no inventar un
  // activo genérico para los que no tienen id; éste lo tiene.
  MLA45338822: ["noni", "ceramidas", "escualano", "colesterol", "fitoesfingosina", "manteca_karite", "alantoina", "adenosina", "hialuronico", "aceite_esencial_romero"],

  // Garnier Sérum Anti-imperfecciones [INCI] — verificado el 12/9/2026. Confirma
  // la trampa №5 de INGREDIENTES.md §10.3: apila salicílico, láctico, fítico,
  // ascorbil glucósido y niacinamida en la misma fórmula.
  //
  // Se suma ALCOHOL DENAT, que va SEGUNDO en la lista y faltaba en el mapeo. Con
  // eso el producto acumula tres exfoliantes, un irritante y fragancia.
  MLA22843182: ["niacinamida", "bha_salicilico", "aha_lactico", "acido_fitico", "vit_c_derivado", "alcohol_denat", "fragancia"],

  // ISDIN Ureadin Fusion Melting Cream [pendiente] — 12/9/2026. No se consiguió
  // el INCI completo: la lista publicada aparece truncada y las dos bases de
  // ingredientes que la tienen (CosDNA, vadedermo) responden 403 y 404.
  //
  // LA DUDA ES CONCRETA: en la parte visible del INCI figura la urea, pero NO el
  // ácido láctico ni la vitamina C que este mapeo declara. Si no estuvieran, acá
  // sobra un exfoliante y una vitamina C pura, que no es poca cosa. Hay que leer
  // el envase antes de confiar en esta entrada.
  MLA21174873: ["urea", "aha_lactico", "ceramidas", "vit_c_laa", "hialuronico", "tocoferol", "creatina", "manteca_karite", "fragancia"],
  // Garnier Crema Hidratante en Gel Anti Imperfecciones [INCI] — verificado el
  // 12/9/2026. Niacinamida tercera, alcohol denat cuarto, ascorbil glucósido,
  // salicílico y `Parfum` con linalol, geraniol y limoneno declarados.
  MLA35115621: ["niacinamida", "bha_salicilico", "vit_c_derivado", "alcohol_denat", "fragancia"],
  // Neutrogena Hydro Boost recarga [INCI] — verificado el 12/9/2026 sobre la
  // fórmula LATAM, que es la que se vende acá: hialuronato de sodio, siliconas y
  // `Parfum`, más CI 42090 como colorante.
  //
  // OJO AL ELEGIR LA FUENTE: la versión española del mismo producto es otra
  // fórmula —sin perfume, con urea, ceramida NP y aminoácidos—. Tomar esa lista
  // habría dado un producto limpio que acá no se vende.
  MLA28531465: ["hialuronico", "fragancia"],
  // LRP Effaclar Mat [INCI] — verificado el 12/9/2026. Mapeo exacto y completo:
  // alcohol denat (quinto), capriloil salicílico (LHA), ácido salicílico y
  // fragancia. Los cuatro estaban bien.
  MLA9196384: ["bha_lha", "bha_salicilico", "alcohol_denat", "fragancia"],
  // Eucerin Hyaluron-Filler Día FPS15 [INCI] — verificado el 12/9/2026. Mapeo
  // exacto y completo: salicilato de etilhexilo, octocrileno, Tinosorb S y
  // avobenzona como filtros, alcohol denat, hialuronato y `Parfum`.
  //
  // La saponina de germen de soja que promete la marca no tiene id en el
  // diccionario, así que queda dicha acá y no en la lista.
  MLA9855881: ["filtro_quimico", "filtro_avobenzona", "hialuronico", "alcohol_denat", "fragancia"],
  // Eucerin Aquaporin Active piel normal a mixta [INCI] — verificado el
  // 12/9/2026. Mapeo correcto: gliceril glucósido (el activo de la línea) y
  // ALCOHOL DENAT, que va tercero en la lista. La variante para piel seca no lo
  // lleva; ésta sí.
  MLA9210936: ["glicerilo_glucosido", "alcohol_denat"],
  // Avène Tolerance Control [INCI] — verificado el 11/9/2026 contra la página
  // oficial. Catorce ingredientes y mapeo confirmado: agua termal y escualano.
  //
  // Sin fragancia y sin conservantes, que es posible por el envase estéril. Es la
  // fórmula más corta del catálogo y esa ES su propuesta.
  MLA23143346: ["agua_termal", "escualano"],
  // Aveno Gel Crema [INCI] — verificado el 11/9/2026, y corrige al catálogo:
  // sale `hialuronico`, que estaba mapeado y NO aparece en la lista.
  //
  // Entran karité y alantoína, que sí están. La `Hydroxyethyl Urea` de la
  // posición 2 no se mapea como `urea`: es un humectante derivado, no la urea
  // que el diccionario gradúa con evidencia A para barrera.
  //
  // El tocoferol va como acetato, que es la forma estable. Sin fragancia, sin
  // ácidos, sin alcohol denat.
  MLA22990183: ["avena", "tocoferol", "manteca_karite", "alantoina"],
  // Avène Hydrance SPF30 · SIN VERIFICAR. El .md no trae INCI y la línea tiene
  // variantes con filtros distintos. Queda vacío a propósito.
  // [INCI] fuente sin registrar — ver docs/AUDITORIA-PRODUCTOS.md
  MLA67629151: [],

  // Garnier Agua Micelar Anti-imperfecciones [INCI] — verificado el 12/9/2026
  // contra la página de Garnier ARGENTINA, que es la que corresponde: la fórmula
  // local son once ingredientes.
  //
  // SE QUITAN TRES que la fórmula no trae: `bha_lha`, `zinc_pca` y `fragancia`.
  // La página declara "sin perfume". Se agrega `alcohol_denat`, que va cuarto en
  // la lista y faltaba. Es la primera vez en esta auditoría que se quitan activos:
  // se hace porque la fuente oficial demuestra la ausencia, no por no encontrarlos.
  MLA24300545: ["bha_salicilico", "vit_c_derivado", "alcohol_denat"],
  // Garnier Agua Micelar Todo en 1 · SIN VERIFICAR: el .md no trae INCI.
  // Garnier Agua Micelar Todo en 1 [INCI] — verificado el 11/9/2026. Lista muy
  // corta: agua, hexilenglicol, glicerina, cocoanfodiacetato disódico, EDTA,
  // poloxámero y biguanida como conservante. Sin fragancia, sin ácidos.
  //
  // Vacío VERIFICADO: no hay nada que declarar, y eso es distinto de no haber
  // mirado.
  MLA20546060: [],
  // Garnier Limpiador Crema Hidratante Anti Imperfecciones [INCI] — verificado el
  // 12/9/2026. Mapeo exacto: niacinamida, hialuronato y salicílico, sobre
  // tensioactivos suaves (metil cocoil taurato, coco-betaína, cocoil isetionato).
  // SIN fragancia.
  //
  // Ojo al elegir la fuente: Garnier tiene tres anti-imperfecciones con nombres
  // parecidos. El `Gel de Limpieza` sí trae SLES, zinc PCA y fragancia; éste no.
  MLA47671534: ["niacinamida", "bha_salicilico", "hialuronico"],
  // Eucerin DermoPure Oil Control gel limpiador [pendiente] — 12/9/2026. Hay dos
  // versiones y el mapeo actual sirve para las dos, porque el salicílico está en
  // ambas. Lo que cambia es lo que faltaría:
  //
  //   básica (8 ingredientes)  — sólo salicílico, sin perfume. El mapeo está bien.
  //   concentrada triple efecto — suma glicólico, PHA, alcohol denat y fragancia.
  //
  // El nombre del catálogo no dice "concentrado" ni "triple efecto", lo que apunta
  // a la básica, pero no alcanza para cerrarlo. Se resuelve leyendo el envase.
  MLA37349507: ["bha_salicilico"],
  // BoJ Green Plum Refreshing Cleanser [INCI] — verificado el 12/9/2026. Sale
  // `arroz_fermentado`: el INCI dice `Oryza Sativa Extract`, extracto de arroz y
  // NO un fermento. Es el mismo error que tenía el Dynasty Cream.
  //
  // Queda VACÍO VERIFICADO: lo demás que trae —agua de ciruela mume, poroto mung,
  // té verde, loto, houttuynia— no tiene activo al que apuntar en el diccionario.
  // Tensioactivos suaves y sin fragancia; el cítrico es ajustador de pH.
  MLA35427636: [],
  // CeraVe Gel Limpiador Espumoso [INCI] — verificado el 12/9/2026. Mismo
  // producto que MLA25800983 en otra publicación, misma fórmula: niacinamida,
  // hialuronato, ceramidas NP/AP/EOP, fitoesfingosina y colesterol. Sin
  // fragancia; el cítrico es ajustador de pH.
  MLAU141343879: ["ceramidas", "niacinamida", "hialuronico", "colesterol", "fitoesfingosina"],
  // CeraVe Limpiador Hidratante [INCI] — verificado el 11/9/2026 contra la
  // página de la marca. Mapeo confirmado entero: ceramidas NP, AP y EOP,
  // hialuronato de sodio, colesterol, fitoesfingosina y tocoferol.
  //
  // Sin fragancia y sin ácidos. Es el trío de ceramidas más colesterol, que es
  // la composición que INGREDIENTES.md respalda para barrera.
  MLA37598876: ["ceramidas", "hialuronico", "colesterol", "fitoesfingosina", "tocoferol"],
  // Neutrogena Hydro Boost gel limpiador [INCI] — verificado el 12/9/2026 contra
  // la ficha de la marca. Mapeo correcto y completo: hialurónico hidrolizado.
  // Tensioactivos suaves (cocoil isetionato, metil cocoil taurato) y sin
  // fragancia, declarado por la marca. El cítrico es ajustador de pH.
  MLA53897352: ["hialuronico"],
  // LRP Lipikar Syndet AP+ [INCI] — verificado el 12/9/2026. Mapeo exacto:
  // niacinamida y manteca de karité. Sin fragancia, declarado por la marca.
  //
  // El Aqua Posae Filiformis que promete la marca es `Vitreoscilla Ferment` en el
  // INCI y no tiene id en el diccionario. Queda dicho acá.
  MLA20663979: ["niacinamida", "manteca_karite"],
  // Cetaphil Pro AD Restoraderm [INCI] — verificado el 11/9/2026. Confirma el
  // mapeo: karité, alantoína, niacinamida y tocoferol (como acetato).
  //
  // La marca lo declara sin fragancia y el INCI lo sostiene. El tensioactivo es
  // trideceth sulfato de sodio, más duro que un cocoil isetionato, pero eso no
  // tiene activo al que apuntar en este diccionario.
  MLA20030752: ["niacinamida", "alantoina", "manteca_karite", "tocoferol"],

  // LRP Anthelios UVMUNE 400 con color [INCI] — verificado el 12/9/2026. Trae el
  // Mexoryl 400 (Methoxypropylamino Cyclohexenylidene Ethoxyethylcyanoacetate),
  // avobenzona, Mexoryl XL y SX, tocoferol, alcohol denat y los tres óxidos de
  // hierro del tono (CI 77491, 77492, 77499) junto al dióxido de titanio.
  //
  // FALTABA LA FRAGANCIA: el INCI declara `Parfum` y el mapeo no lo tenía.
  // Refuerza la duda sobre el otro Anthelios del catálogo, que sigue pendiente.
  MLA58897902: [
    "filtro_quimico",
    "filtro_avobenzona",
    "filtro_uva_400",
    "oxidos_de_hierro",
    "tocoferol",
    "alcohol_denat",
    "fragancia",
  ],
  // LRP Anthelios Oil Control [pendiente] — 12/9/2026. NO se pudo resolver qué
  // variante es, y hay motivo para dudar del mapeo actual.
  //
  // El INCI del UVMune 400 Oil Control SIN color trae `Parfum` y `Zinc PCA`, que
  // acá no están, y NO trae óxidos de hierro, que acá sí están. Los óxidos son de
  // la versión con color. El nombre del catálogo no dice "color"; el comentario
  // viejo decía que sí. Uno de los dos está mal.
  //
  // No se puede preguntar a la API: el ml_id es MLAU, de alcance del vendedor, y
  // responde 403. Se resuelve mirando el envase o migrando la entrada a una ficha
  // de catálogo /p/. Ver docs/AUDITORIA-PRODUCTOS.md.
  MLAU3133622625: ["filtro_quimico", "filtro_avobenzona", "filtro_uva_400", "oxidos_de_hierro", "tocoferol", "alcohol_denat"],
  // LRP Anthelios Ultra Fluido con Color [INCI] — reemplazó al anterior en el
  // catálogo. ATENCIÓN, es el único caso del catálogo:
  //
  //   Trae `titanium dioxide [nano]` LISTADO ENTRE LOS FILTROS, no sólo el
  //   `CI 77891 / titanium dioxide` que va con los óxidos de hierro como
  //   pigmento. O sea que acá el dióxido de titanio SÍ actúa como filtro: es
  //   una fórmula híbrida, orgánica + mineral.
  //
  // Cuidado con leer esto como "ya tenemos protector mineral". No lo es: sigue
  // llevando alcohol denat y octocrileno, así que no pasa las reglas de piel
  // sensible del vault. El hueco B1 —un mineral limpio para piel reactiva—
  // sigue abierto. Lo que cambia es que este producto es lo más cerca que está
  // hoy el catálogo, y para quien reacciona a un filtro orgánico puro es una
  // opción intermedia real.
  MLA16048263: [
    "filtro_quimico",
    "filtro_mineral",
    "filtro_avobenzona",
    "oxidos_de_hierro",
    "agua_termal",
    "alcohol_denat",
  ],
  // Eucerin Sun Face Oil Control FPS50+ Tono Medio [INCI] — verificado el
  // 12/9/2026. Mapeo exacto y completo: avobenzona, filtros orgánicos, óxidos de
  // hierro (CI 77491 y 77499), licochalcona, glicirretínico y alcohol denat.
  // Sin fragancia.
  //
  // Confirma la nota de arriba: el CI 77891 (dióxido de titanio) está junto a los
  // óxidos de hierro, como PIGMENTO del tono y no como filtro.
  MLA19504960: ["filtro_quimico", "filtro_avobenzona", "oxidos_de_hierro", "licochalcona", "glicirretinico", "alcohol_denat"],
  // Garnier Super UV Fluido Invisible [INCI] — reemplazó al anterior. Verificado
  // contra la ficha: mismo complejo declarado (niacinamida + salicílico + zinc
  // PCA) y mismos filtros. Misma lista de activos que su antecesor.
  MLA38098313: ["filtro_quimico", "filtro_avobenzona", "niacinamida", "bha_salicilico", "vit_c_derivado", "zinc_pca", "aloe", "tocoferol", "alcohol_denat", "fragancia"],
};

export const catalogoActivos: CatalogoActivos = {
  activos: ACTIVOS,
  reglas: REGLAS,
  acumulacion: ACUMULACION,
  sinergias: SINERGIAS,
  mitos: MITOS,
  porProducto: ACTIVOS_POR_PRODUCTO,
};
