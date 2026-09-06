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
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVOS: Record<string, Activo> = {
  // ── Exfoliantes ────────────────────────────────────────────────────────────
  // El grupo "acido-libre" junta a los que trabajan bajando el pH y necesitan
  // que una fracción de la molécula esté sin disociar para actuar. Es el grupo
  // que choca con retinoides y con vitamina C pura. Los PHA quedan afuera a
  // propósito: son el reemplazo suave, no el problema.
  aha_glicolico: {
    id: "aha_glicolico",
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
    nombre: "Ácido láctico",
    familia: "aha",
    grupos: ["exfoliante", "acido-libre", "renovador"],
    carga: 2,
    ph: [3, 4],
    evidencia: "Molécula más grande que el glicólico: entra más despacio y además es humectante.",
  },
  aha_mandelico: {
    id: "aha_mandelico",
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
    nombre: "Ácido málico",
    familia: "aha",
    grupos: ["exfoliante", "acido-libre"],
    carga: 1,
  },
  aha_tartarico: {
    id: "aha_tartarico",
    nombre: "Ácido tartárico",
    familia: "aha",
    grupos: ["exfoliante", "acido-libre"],
    carga: 1,
  },
  acido_fitico: {
    id: "acido_fitico",
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
    nombre: "Retinaldehído",
    familia: "retinoide",
    grupos: ["exfoliante", "renovador", "retinoide-oxidable"],
    carga: 3,
    soloNoche: true,
    evidencia: "Un paso más cerca del ácido retinoico que el retinol. Misma sensibilidad a la luz.",
  },
  retinil_ester: {
    id: "retinil_ester",
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
    nombre: "Alfa-arbutina",
    familia: "despigmentante",
    grupos: ["despigmentante"],
    carga: 1,
  },
  melasyl: {
    id: "melasyl",
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
    nombre: "Tiosulfato de sodio",
    familia: "despigmentante",
    grupos: ["despigmentante"],
    carga: 0,
    evidencia: "Acompaña a otros despigmentantes; sola tiene poca evidencia propia.",
  },

  // ── Humectantes y reparadores de barrera con mecanismo propio ─────────────
  urea: {
    id: "urea",
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
    nombre: "Gliceril glucósido",
    familia: "humectante",
    grupos: ["barrera-reparadora"],
    carga: 0,
    evidencia:
      "Humectante con un mecanismo distinto del resto: en vez de atraer agua y quedarse ahí, " +
      "estimula la expresión de acuaporina-3, el canal por el que el agua circula entre células. " +
      "Hay trabajo publicado midiendo el aumento de AQP3 en queratinocitos y en piel humana.",
  },
  escualano: { id: "escualano", nombre: "Escualano", familia: "emoliente", grupos: [], carga: 0 },
  fitoesfingosina: {
    id: "fitoesfingosina",
    nombre: "Fitoesfingosina",
    familia: "barrera",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  colesterol: {
    id: "colesterol",
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
    nombre: "Manteca de karité",
    familia: "emoliente",
    grupos: [],
    carga: 0,
  },
  resorcinol_fenetil: {
    id: "resorcinol_fenetil",
    nombre: "Fenetil resorcinol",
    familia: "despigmentante",
    grupos: ["despigmentante"],
    carga: 1,
    evidencia: "Inhibidor de tirosinasa. Potente para su concentración y bastante bien tolerado.",
  },
  zinc_pca: {
    id: "zinc_pca",
    nombre: "Zinc PCA",
    familia: "seborregulador",
    grupos: [],
    carga: 0,
  },

  // ── Oxidantes y péptidos ───────────────────────────────────────────────────
  peroxido_benzoilo: {
    id: "peroxido_benzoilo",
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
    nombre: "Centella asiática",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  panthenol: {
    id: "panthenol",
    nombre: "Pantenol (vitamina B5)",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  ceramidas: {
    id: "ceramidas",
    nombre: "Ceramidas",
    familia: "barrera",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  hialuronico: {
    id: "hialuronico",
    nombre: "Ácido hialurónico",
    familia: "humectante",
    grupos: [],
    carga: 0,
    evidencia:
      "Otro que no exfolia pese al nombre. Es un humectante: atrae agua y hay que sellarlo con " +
      "algo encima, sobre todo en ambientes secos.",
  },
  alantoina: { id: "alantoina", nombre: "Alantoína", familia: "calmante", grupos: [], carga: 0 },
  mucina_caracol: {
    id: "mucina_caracol",
    nombre: "Mucina de caracol",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  adenosina: { id: "adenosina", nombre: "Adenosina", familia: "calmante", grupos: [], carga: 0 },
  cafeina: { id: "cafeina", nombre: "Cafeína", familia: "calmante", grupos: [], carga: 0 },
  licochalcona: {
    id: "licochalcona",
    nombre: "Licochalcona A",
    familia: "calmante",
    grupos: [],
    carga: 0,
    evidencia: "Antioxidante de regaliz. Apunta al enrojecimiento post-sol.",
  },
  glicirretinico: {
    id: "glicirretinico",
    nombre: "Ácido glicirretínico",
    familia: "calmante",
    grupos: [],
    carga: 0,
  },
  tocoferol: {
    id: "tocoferol",
    nombre: "Vitamina E (tocoferol)",
    familia: "antioxidante",
    grupos: ["antioxidante"],
    carga: 0,
  },
  ferulico: {
    id: "ferulico",
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
    nombre: "Glicirricinato dipotásico",
    familia: "calmante",
    grupos: [],
    carga: 0,
    evidencia: "Derivado de regaliz. Antiinflamatorio suave, muy bien tolerado.",
  },
  bisabolol: { id: "bisabolol", nombre: "Bisabolol", familia: "calmante", grupos: [], carga: 0 },
  carnosina: {
    id: "carnosina",
    nombre: "Carnosina",
    familia: "antioxidante",
    grupos: ["antioxidante"],
    carga: 0,
    evidencia: "Antioxidante y antiglicante. Evidencia tópica modesta.",
  },
  avena: {
    id: "avena",
    nombre: "Avena coloidal",
    familia: "calmante",
    grupos: ["barrera-reparadora"],
    carga: 0,
  },
  agua_termal: {
    id: "agua_termal",
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
    nombre: "Extracto de noni",
    familia: "antioxidante",
    grupos: ["antioxidante"],
    carga: 0,
    evidencia: "Antioxidante vegetal. Evidencia tópica escasa; se usa como base de fórmula.",
  },
  aloe: { id: "aloe", nombre: "Aloe vera", familia: "calmante", grupos: [], carga: 0 },
  creatina: { id: "creatina", nombre: "Creatina", familia: "otros", grupos: [], carga: 0 },
  ginseng: { id: "ginseng", nombre: "Ginseng", familia: "antioxidante", grupos: [], carga: 0 },
  arroz_fermentado: {
    id: "arroz_fermentado",
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
    nombre: "Filtros solares orgánicos",
    familia: "filtro",
    grupos: [],
    carga: 0,
  },
  filtro_mineral: {
    id: "filtro_mineral",
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
  // ── Limpiadores ────────────────────────────────────────────────────────────
  // Idraet Espuma Extra Suave · sin activos declarados, y está bien que así sea:
  // un limpiador que se enjuaga no es el lugar para poner activos.
  MLA21801426: [],
  // CeraVe Gel Limpiador Espumoso [INCI]
  MLAU140993030: ["ceramidas", "niacinamida", "hialuronico"],
  // COSRX Low pH Good Morning [INCI] — el BHA suave + tea tree que lo saca de
  // las rutinas de piel sensible.
  MLA11139349: ["bha_betaina_salicilato", "aceite_esencial_tea_tree"],
  // Mixsoon Centella Cleansing Foam [vault] — trae salicílico de verdad.
  MLAU3453545171: ["centella", "bha_salicilico"],
  // Skin1004 Centella Ampoule Foam [vault] — el cítrico está como ajuste de pH.
  MLAU3856054670: ["centella", "aha_citrico", "hialuronico"],
  // Cleanex Free Gel · no verificado.
  MLA27603374: [],
  // Beauty of Joseon Ginseng Cleansing Oil [vault]
  MLA37240248: ["ginseng", "tocoferol"],

  // ── Tónico ─────────────────────────────────────────────────────────────────
  // TIRTIR Milk Skin Toner [INCI] — niacinamida alta en la lista; también trae
  // hamamelis y hoja de menta, que para piel reactiva cuentan.
  MLAU3481553718: ["niacinamida", "panthenol", "centella", "alantoina", "hialuronico", "hamamelis", "menta"],

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
  // The Ordinary Niacinamida 10% + Zinc 1% [INCI]
  MLA23033385: ["niacinamida", "zinc_pca"],

  // ── Contorno ───────────────────────────────────────────────────────────────
  // Vichy Minéral 89 Eyes [INCI] — lista corta, sin fragancia. Nada que choque.
  MLA18956630: ["hialuronico", "cafeina"],

  // ── Hidratantes ────────────────────────────────────────────────────────────
  // L'Oréal Revitalift Glass Skin [INCI] — niacinamida + ascorbil glucósido en
  // el mismo frasco: la mejor prueba de que el mito de "C con niacinamida" cayó.
  // Trae fragancia, que es lo que lo deja fuera de piel sensible.
  MLA65451035: ["niacinamida", "vit_c_derivado", "panthenol", "hialuronico", "adenosina", "fragancia"],
  // Skin1004 Tea-Trica B5 [vault] — pantenol y ceramidas, pero también tea tree
  // y mandélico. Es un hidratante que además exfolia un poco.
  MLA37722163: ["panthenol", "ceramidas", "niacinamida", "centella", "aceite_esencial_tea_tree", "aha_mandelico"],
  // La Roche-Posay Toleriane Dermallergo · sin activos a propósito: su propuesta
  // es exactamente la lista de ingredientes más corta posible. No es un hueco
  // de datos, es la fórmula.
  MLA19866311: [],
  // Beauty of Joseon Dynasty Cream [vault]
  MLA21179266: ["niacinamida", "ceramidas", "ginseng", "hialuronico", "arroz_fermentado"],
  // Lidherma Hyaluronic 4D · humectante puro.
  MLA19474747: ["hialuronico"],
  // COSRX Advanced Snail 92 [vault]
  MLA45253335: ["mucina_caracol", "panthenol", "alantoina", "adenosina", "hialuronico"],
  // Dermaglós Crema Hidratante de Día FPS 30 · lleva filtro, no verificamos cuál.
  MLA24692733: ["filtro_quimico"],

  // ── Protectores solares ────────────────────────────────────────────────────
  // Los siete son de filtro orgánico. Ninguno lleva óxido de zinc ni dióxido de
  // titanio como filtro: no hay un solo protector mineral en el catálogo.
  // Beauty of Joseon Relief Sun Rice + Probiotics [vault]
  MLAU3480823224: ["filtro_quimico", "niacinamida", "arroz_fermentado", "tocoferol"],
  // ISDIN Fusion Water Magic [INCI]
  MLA26916726: ["filtro_quimico"],
  // COSRX Ultra-Light Invisible [INCI]
  MLA2097460920: ["filtro_quimico", "niacinamida", "tocoferol", "hialuronico", "adenosina", "hamamelis"],
  // Eucerin Sun Oil Control Dry Touch [INCI] — trae alcohol denat, que es de
  // dónde sale la textura seca. Es también lo que lo saca de piel sensible.
  // Único producto que aparece en los dos vaults; el INCI del vault nuevo
  // confirma avobenzona y glicirretínico.
  // (Glycyrrhiza inflata root extract es la fuente de la licochalcona A, y va
  // junto al ácido glicirretínico: los dos están en la lista.)
  MLA16048275: ["filtro_quimico", "filtro_avobenzona", "licochalcona", "glicirretinico", "alcohol_denat"],
  // Skin1004 Hyalu-Cica Water-Fit Sun Serum [vault]
  MLA24454808: ["filtro_quimico", "centella", "niacinamida", "hialuronico"],
  // ISDIN Fusion Water Magic Color Light [INCI]
  MLA20067103: ["filtro_quimico"],
  // NIVEA Protector Solar Facial Control Anti-Brillo · filtros no verificados en
  // detalle; se declara sólo lo seguro.
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

  // ── Vitamina C ─────────────────────────────────────────────────────────────
  // SkinCeuticals C E Ferulic — es, literalmente, la fórmula del paper de Duke:
  // 15% de ascórbico + 1% de tocoferol + 0,5% de ferúlico. Lista de 12
  // ingredientes, sin fragancia. El resto del rubro la viene copiando.
  MLA24840827: ["vit_c_laa", "tocoferol", "ferulico", "panthenol", "hialuronico"],
  // Kosmos Vitamina C Pura — mismo trío C + E + ferúlico, y suma ceramida.
  MLA45672941: ["vit_c_laa", "tocoferol", "ferulico", "ceramidas", "panthenol"],
  // La Roche-Posay Pure Vitamin C12 — 12% de ascórbico, pero ojo: trae ácido
  // salicílico, alcohol denat y fragancia. No es una fórmula minimalista.
  MLA47223033: ["vit_c_laa", "bha_salicilico", "hialuronico", "adenosina", "tocoferol", "peptidos", "alcohol_denat", "fragancia"],
  // Vichy Liftactiv Supreme Vitamina C 16% [externo] — el .md no publica INCI;
  // se declara sólo lo que la propia marca afirma: C pura, E y hialurónico.
  MLA19710676: ["vit_c_laa", "tocoferol", "hialuronico"],

  // ── Retinoides ─────────────────────────────────────────────────────────────
  // Neutrogena Retinol Boost — retinol puro. El ascórbico está abajo en la
  // lista, como antioxidante de la fórmula, no como activo.
  MLA58622882: ["retinol", "hialuronico", "bisabolol", "tocoferol", "fragancia"],
  // Eximia Hyalu-R — retinol + retinil palmitato + ferúlico + niacinamida.
  MLA20021768: ["retinol", "retinil_ester", "niacinamida", "panthenol", "ferulico", "hialuronico", "tocoferol", "fragancia"],
  // La Roche-Posay Retinol B3 — retinol + retinil palmitato + niacinamida. Se
  // vende "incluso para piel sensible" y lleva alcohol denat y fragancia: la
  // etiqueta y la lista de ingredientes no dicen lo mismo.
  MLAU244146565: ["retinol", "retinil_ester", "niacinamida", "hialuronico", "adenosina", "tocoferol", "alcohol_denat", "fragancia"],

  // ── Niacinamida ────────────────────────────────────────────────────────────
  // La Roche-Posay Mela B3 (dos publicaciones del mismo producto).
  // ATENCIÓN: se vende como sérum de niacinamida y trae RETINIL PALMITATO.
  // Es un retinoide escondido en un producto que nadie clasifica como retinoide.
  MLA34459961: ["niacinamida", "melasyl", "retinil_ester", "bha_lha", "tiosulfato_sodio", "carnosina", "glicirricinato", "hialuronico", "tocoferol", "fragancia"],
  MLA26197969: ["niacinamida", "melasyl", "retinil_ester", "bha_lha", "tiosulfato_sodio", "carnosina", "glicirricinato", "hialuronico", "tocoferol", "fragancia"],
  // Eximia Hyalu-N — un "sérum de niacinamida" que además trae tranexámico y un
  // complejo de AHA (glicólico, málico, tartárico, láctico) más alcohol.
  MLA29882074: ["niacinamida", "tranexamico", "aha_glicolico", "aha_lactico", "aha_malico", "aha_tartarico", "urea", "hialuronico", "alcohol_denat", "fragancia"],
  // Dermaglós Serum Niacinamida 10% — fórmula corta y directa.
  MLAU209241342: ["niacinamida", "zinc_gluconato", "fragancia"],
  // Detenage N 10% [externo] — niacinamida 10% + hialurónico de dos pesos.
  MLAU1655818860: ["niacinamida", "hialuronico"],

  // ── Ácido hialurónico y ampollas ───────────────────────────────────────────
  // Eximia Hyalu-B — OJO: trae GLUCONATO DE COBRE. Es el producto que activa la
  // regla de cobre contra vitamina C pura.
  MLA45991792: ["panthenol", "niacinamida", "cobre_gluconato", "zinc_gluconato", "hialuronico", "fragancia"],
  // La Roche-Posay Hyalu B5 — hialurónico + pantenol + madecasósido. Con alcohol
  // denat y fragancia, que es lo que lo saca de una rutina de piel reactiva.
  MLA12754368: ["hialuronico", "panthenol", "madecassosido", "adenosina", "tocoferol", "alcohol_denat", "fragancia"],
  // Neutrogena Hydro Boost sérum — hialurónico y pantenol, nada más.
  MLA22655637: ["hialuronico", "panthenol", "fragancia"],
  // L'Oréal Revitalift Ácido Hialurónico — suma ascorbil glucósido y péptido.
  MLA18956615: ["hialuronico", "vit_c_derivado", "peptidos"],
  // Vichy Minéral 89 [externo] — agua termal + hialurónico. Lista corta.
  MLA18964459: ["hialuronico", "agua_termal"],
  // Skin1004 Tea-Trica Relief Ampoule — centella + árbol de té (agua Y aceite).
  MLA38719413: ["centella", "aceite_esencial_tea_tree", "panthenol", "hialuronico"],
  // Skin1004 Poremizing Fresh Ampoule — trae COBRE TRIPÉPTIDO-1 y varios
  // péptidos de señal, además de centella y aloe.
  MLA43183566: ["centella", "aloe", "peptidos", "peptidos_cobre", "panthenol", "hialuronico", "glicirricinato"],
  // Celimax The Real Noni Energy Ampoule [externo] — 71,8% de noni, ceramida,
  // escualano, colesterol y fitoesfingosina. Trae aceite esencial de romero.
  MLA45338822: ["noni", "ceramidas", "escualano", "colesterol", "fitoesfingosina", "manteca_karite", "alantoina", "adenosina", "hialuronico", "aceite_esencial_romero"],

  // ── Séricos con activo dirigido ────────────────────────────────────────────
  // Garnier Sérum Anti-imperfecciones [externo] — apila BHA + AHA + fítico +
  // ascorbil glucósido + niacinamida, con alcohol denat y fragancia. Es el
  // producto con más activos por mililitro de todo el catálogo.
  MLA22843182: ["niacinamida", "bha_salicilico", "aha_lactico", "acido_fitico", "vit_c_derivado", "alcohol_denat", "fragancia"],

  // ── Hidratantes ────────────────────────────────────────────────────────────
  // Isdin Ureadin Fusion Melting — urea + láctico + ceramida + ascórbico, con
  // una fragancia cargada (limoneno, citral, cumarina, linalol).
  MLA21174873: ["urea", "aha_lactico", "ceramidas", "vit_c_laa", "hialuronico", "tocoferol", "creatina", "manteca_karite", "fragancia"],
  // Garnier Crema Gel Anti-imperfecciones — niacinamida + salicílico + alcohol.
  MLA35115621: ["niacinamida", "bha_salicilico", "vit_c_derivado", "alcohol_denat", "fragancia"],
  // Neutrogena Hydro Boost water gel — hialurónico y siliconas. Sin activos.
  MLA19899495: ["hialuronico", "fragancia"],
  // La Roche-Posay Effaclar Mat — LHA + salicílico + alcohol denat.
  MLA9196384: ["bha_lha", "bha_salicilico", "alcohol_denat", "fragancia"],
  // Eucerin Hyaluron-Filler Día FPS 15 — filtro insuficiente como protector.
  MLA9855881: ["filtro_quimico", "filtro_avobenzona", "hialuronico", "alcohol_denat", "fragancia"],
  // Eucerin Aquaporin Active — gliceril glucósido, el activo con mecanismo
  // propio de esta crema. Trae alcohol denat.
  MLA9210936: ["glicerilo_glucosido", "alcohol_denat"],
  // Avène Tolerance Control — 14 ingredientes, sin fragancia, sin conservantes
  // clásicos. Es la fórmula más corta del catálogo y esa ES su propuesta.
  MLA23143346: ["agua_termal", "escualano"],
  // Aveno Gel Crema — avena coloidal y manzanilla.
  MLA22990183: ["avena", "hialuronico", "tocoferol"],
  // Avène Hydrance SPF30 · SIN VERIFICAR. El .md no trae INCI y la línea tiene
  // variantes con filtros distintos. Queda vacío a propósito.
  MLA67629151: [],

  // ── Limpiadores ────────────────────────────────────────────────────────────
  // Garnier Agua Micelar Anti-imperfecciones — salicílico + LHA + zinc.
  MLA24300545: ["bha_salicilico", "bha_lha", "zinc_pca", "vit_c_derivado", "fragancia"],
  // Garnier Agua Micelar Todo en 1 · SIN VERIFICAR: el .md no trae INCI.
  MLA20546060: [],
  // Garnier Gel Limpiador Anti-imperfecciones — niacinamida + salicílico.
  MLA47671534: ["niacinamida", "bha_salicilico", "hialuronico"],
  // Eucerin Dermopure Oil Control — salicílico en un gel que se enjuaga.
  MLA37349507: ["bha_salicilico"],
  // Beauty of Joseon Ciruela Verde — tensioactivos suaves y extractos. Sin BHA.
  MLA35427636: ["arroz_fermentado"],
  // CeraVe Gel Limpiador Espumoso — ceramidas + niacinamida, sin fragancia.
  MLAU141343879: ["ceramidas", "niacinamida", "hialuronico", "colesterol", "fitoesfingosina"],
  // CeraVe Limpiador Hidratante — ceramidas, sin tensioactivo agresivo.
  MLA37598876: ["ceramidas", "hialuronico", "colesterol", "fitoesfingosina", "tocoferol"],
  // Neutrogena Hydro Boost gel limpiador — hialurónico, sin activos.
  MLA53897352: ["hialuronico"],
  // La Roche-Posay Lipikar Syndet AP+ — niacinamida + karité, sin fragancia.
  MLA16135276: ["niacinamida", "manteca_karite"],
  // Cetaphil Pro AD Restoraderm — niacinamida + alantoína + karité.
  MLA20030752: ["niacinamida", "alantoina", "manteca_karite", "tocoferol"],

  // ── Protectores solares ────────────────────────────────────────────────────
  // Ninguno es mineral. Los que traen dióxido de titanio lo traen como PIGMENTO,
  // junto a óxidos de hierro, no como filtro. Ver docs/INGREDIENTES.md.
  // LRP Anthelios UVMUNE 400 con color — el único con el filtro de UVA ultra
  // largo Y óxidos de hierro. Para manchas es el mejor del catálogo.
  MLA58897902: ["filtro_quimico", "filtro_avobenzona", "filtro_uva_400", "oxidos_de_hierro", "tocoferol", "alcohol_denat"],
  // LRP Anthelios Oil Control — también trae Mexoryl 400 y color.
  MLAU3133622625: ["filtro_quimico", "filtro_avobenzona", "filtro_uva_400", "oxidos_de_hierro", "tocoferol", "alcohol_denat"],
  // LRP Anthelios Color Efecto Mate — sin el filtro de 400 nm, con zinc PCA.
  MLA16048424: ["filtro_quimico", "filtro_avobenzona", "filtro_uva_400", "zinc_pca", "tocoferol", "alcohol_denat"],
  // Eucerin Sun Oil Control Tono medio — con color, y con alcohol denat.
  MLA19504960: ["filtro_quimico", "filtro_avobenzona", "oxidos_de_hierro", "licochalcona", "glicirretinico", "alcohol_denat"],
  // Garnier Super UV Anti-Imperfecciones — protector con niacinamida y
  // salicílico. Poco común y bastante buena idea para piel grasa.
  MLA63460365: ["filtro_quimico", "filtro_avobenzona", "niacinamida", "bha_salicilico", "vit_c_derivado", "zinc_pca", "aloe", "tocoferol", "alcohol_denat", "fragancia"],
};

export const catalogoActivos: CatalogoActivos = {
  activos: ACTIVOS,
  reglas: REGLAS,
  acumulacion: ACUMULACION,
  sinergias: SINERGIAS,
  mitos: MITOS,
  porProducto: ACTIVOS_POR_PRODUCTO,
};
