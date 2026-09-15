// Textos del nicho. Editables sin tocar componentes.
export const copy = {
  marca: "Club de Piel",
  tagline: "No es el producto, es cuál va con cuál",

  meta: {
    title: "Club de Piel · El problema no era el producto",
    description:
      "Te armamos la rutina completa cruzando cada activo con los demás, para que no compres dos veces lo mismo ni mezcles cosas que se anulan. Coreanos, europeos y nacionales.",
  },

  // Pantalla de entrada: dos puertas, sin scroll y sin buscar.
  home: {
    // Above the fold. El mecanismo es "no es el producto, es la combinación", y
    // está respaldado por el motor de compatibilidad: reglas de conflicto entre
    // activos, sinergias y mitos. Por eso la home tiene una franja propia hacia
    // /combinaciones — la credibilidad la da el contenido, no un número.
    //
    // El marco temporal ("en 5 preguntas") es sobre NUESTRO servicio, no sobre
    // resultados en la piel. Prometer "resultados en 3 semanas" sería un claim
    // que no podemos sostener.
    titulo: "El problema no era el producto. Era cuál iba con cuál.",
    // El número de preguntas sale de configServible(), no escrito a mano: ya
    // quedó viejo dos veces (cuando entró la rama coreana y cuando se colapsaron
    // los tiers) y es el tipo de mentira que nadie revisa.
    bajada: (preguntas: number) =>
      `Te armamos la rutina completa en ${preguntas} preguntas, cruzando cada activo con los demás. ` +
      "Sin probar y errar, sin comprar dos veces lo mismo, sin ácidos que se anulan entre sí.",
    // La franja oscura de arriba de todo. Dice qué hacemos, no qué le va a pasar
    // a la piel.
    aviso: "Elegimos producto por producto y te decimos por qué",
    portada: {
      etiqueta: "Rutinas de skincare, a tu medida",
    },
    nav: {
      rutina: "Rutina",
      catalogo: "Catálogo",
      kits: "Kits",
      combinaciones: "Combinaciones",
    },
    puertas: {
      etiqueta: "Tres formas de empezar",
      titulo: "Elegí por dónde entrar",
    },
    // La franja hacia /combinaciones. Resume la entrada de esa página: «no
    // mezclar X con Y» son cuatro problemas distintos, cada uno con su arreglo.
    franja: {
      etiqueta: "Qué se puede mezclar y qué no",
      titulo: "Cómo decidimos qué combina con qué",
      texto:
        "«No mezclar X con Y» no quiere decir una sola cosa: quiere decir cuatro, y cada una se " +
        "arregla distinto. Te las explicamos una por una.",
      cta: "Leer las combinaciones",
    },
    // El crédito de las fotos, al pie. Ver src/niches/skincare/fotos-home.ts.
    creditoFotos: "fotos",
    // Las líneas del titular para la imagen de Open Graph. Van acá, pegadas al
    // titular de la página, porque la vez que vivieron en otro archivo el copy
    // cambió y la imagen quedó con el headline anterior durante varios deploys.
    tituloOG: ["El problema no era", "el producto. Era", "cuál iba con cuál."],
    kits: {
      titulo: "Kits ya armados",
      bajada: "Elegí el de tu tipo de piel y listo.",
      cta: "Ver kits",
    },
    quiz: {
      titulo: "Armá tu rutina",
      bajada: (n: number) => `${n} preguntas · menos de un minuto.`,
      cta: "Empezar",
    },

    // Debajo de las tres puertas, para el que no decidió y bajó a mirar. No son
    // puertas: ver 03-PRODUCTO.md § Tres puertas.
    //
    // Todo lo que dicen está en el código y se puede verificar. El paso del medio
    // no promete que "un retinoide y un ácido no te van a tocar la misma noche":
    // ese choque se resuelve con una instrucción y no cambiando de producto —es
    // una decisión tomada—, así que lo cierto es que el sitio te dice qué noche va
    // cada uno.
    metodo: {
      etiqueta: "cómo funciona",
      titulo: "Tres pasos, y el que importa es el del medio",
      pasos: [
        {
          titulo: "Respondés",
          // Piel y objetivo son siempre las dos primeras. El total no se escribe
          // a mano: sale de configServible(), como en el resto de la home.
          texto: (n: number) => `${n} preguntas, empezando por tu tipo de piel y lo que querés cambiar.`,
        },
        {
          titulo: "Cruzamos los activos",
          texto:
            "Chequeamos cada producto contra los demás antes de mostrártelo: que no se anulen entre sí, " +
            "que no se repitan y que no sumen irritación. Y si dos van mejor en noches distintas, te " +
            "decimos qué noche va cada uno.",
        },
        {
          titulo: "Te damos la rutina con el porqué",
          texto:
            "Paso por paso: para qué sirve cada uno y por qué ese producto. Si algo no es para tu piel, " +
            "también te lo decimos.",
        },
      ],
    },

    // Preguntas antes de empezar. Son hipótesis hasta tener respuestas reales de
    // clientas a "¿qué casi te frena?"; cuando las haya, se reescriben con esas.
    //
    // Cada respuesta describe algo que el sitio hace hoy. Si deja de hacerlo, la
    // respuesta cambia con él:
    //   · ventas            → la popularidad no clasifica ni ordena (06-ESTADO)
    //   · piel sensible     → apto-sensible.test.ts: fragancia, aceites
    //                         esenciales y contrairritantes vetan
    //   · comprar todo      → "Ya tengo uno", en el resultado
    //   · más caro          → el presupuesto cede ante la piel y el objetivo
    //   · dermatólogo       → el mismo aviso que va en las pantallas con links
    //
    // No está "¿cómo ganan plata?" a propósito: el brand kit dice que la
    // transparencia de afiliados va donde hay links de compra, no en la home.
    preguntas: {
      etiqueta: "preguntas",
      titulo: "Antes de empezar",
      items: [
        {
          pregunta: "¿Me van a recomendar lo que más se vende?",
          respuesta:
            "No. Las ventas y las estrellas de Mercado Libre no ordenan nada: el orden sale de qué tan " +
            "bien encaja cada producto en su paso y de la calidad de su fórmula. Un producto bueno y " +
            "poco conocido le puede ganar a uno famoso.",
        },
        {
          pregunta: "¿Y si tengo la piel sensible?",
          respuesta:
            "Si la fórmula declara fragancia o aceites esenciales, el producto no se le ofrece a piel " +
            "sensible, aunque la caja diga lo contrario. Y si en algún paso no tenemos una opción apta, " +
            "te lo avisamos en ese paso.",
        },
        {
          pregunta: "¿Tengo que comprar todo?",
          respuesta:
            "No. Si ya tenés algo para un paso, marcá “Ya tengo uno” en tu rutina y ese paso deja de " +
            "ofrecerte comprar.",
        },
        {
          pregunta: "¿Por qué a veces aparece algo más caro de lo que elegí?",
          respuesta:
            "Porque el presupuesto cede ante tu piel y tu objetivo. Si no hay nada más accesible que te " +
            "sirva, preferimos decírtelo antes que darte algo que no va a funcionar.",
        },
        {
          pregunta: "¿Esto reemplaza al dermatólogo?",
          respuesta:
            "No. Te ayudamos a elegir productos de venta libre y a combinarlos. Ante un problema de piel, " +
            "consultá a un dermatólogo.",
        },
      ],
      cta: "Armá tu rutina",
    },
    // El link a los criterios en el pie de TODAS las pantallas (ver Shell), no
    // una puerta de la home. Vive abajo porque es para el que ya está adentro y
    // quiere entender por qué recomendamos lo que recomendamos. En la home el
    // mismo destino tiene además su propia franja (`franja`).
    criterios: "cómo decidimos qué combina con qué",
    // La captura de mail al pie de la home. Decía "guardá tu rutina", que es la
    // etiqueta del resultado del quiz: en la home todavía no hay rutina que
    // guardar. La nota es la misma frase del mail de bienvenida —que la toma de
    // acá— y dice qué va a recibir, sin prometer frecuencia. "Ya estás en el
    // Club" es el asunto del mail que le llega.
    correo: {
      etiqueta: "dejanos tu correo",
      nota:
        "Te escribimos poco, y sólo cuando cambia algo que te afecte: un producto que entra o sale del catálogo, o un criterio que corregimos.",
      listo: "Listo, ya estás en el Club. Revisá tu correo.",
    },
  },

  // Debajo del botón de compra de cada ficha: el camino de compra devuelve al
  // camino de entender. Vos tenés los dos caminos y hasta acá no se tocaban.
  ficha: {
    cruce: "¿Va con tu piel?",
    cruceCta: "Armá tu rutina y lo chequeamos con el resto",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // PRECIO
  //
  // No publicamos el número. La razón está en `docs/PRECIO.md`: un precio de
  // Mercado Libre copiado a mano queda viejo en días, y cuando queda viejo no
  // falla de a poco — miente sobre lo único que la persona va a verificar en el
  // clic siguiente. La banda cualitativa dice lo que el número decía de verdad
  // ("¿me alcanza?") y no caduca.
  //
  // Las etiquetas van en minúscula y sin signo $: son una categoría, no un
  // monto, y escribirlas como monto invitaría a leerlas como uno.
  precio: {
    rangos: { 1: "accesible", 2: "equilibrado", 3: "premium" } as Record<number, string>,
    // Va junto a la banda, en la ficha. Es la promesa que sí podemos cumplir:
    // el precio de hoy, con el descuento de hoy, está a un clic.
    dondeVerlo: "el precio de hoy y los descuentos, en Mercado Libre",
    // La versión larga, para quien se pregunta por qué no está el número.
    porQue:
      "No publicamos precios: Mercado Libre los cambia todos los días y un número copiado acá " +
      "quedaría viejo sin que se note. Preferimos decirte en qué rango está y que el precio real " +
      "lo veas en la publicación, con el descuento que haya en ese momento.",
    // Para un kit armado por nosotros: la banda del conjunto, no una suma.
    rangoKit: (etiqueta: string) => `rango ${etiqueta}`,
  },

  // Catálogo navegable. Es la pieza que se comparte en redes: cada tarjeta se
  // sostiene sola, con foto, banda de precio y el porqué en una línea.
  catalogo: {
    titulo: "Todo el catálogo",
    bajadaHome: "Mirá producto por producto y elegí vos.",
    bajada:
      "Todo lo que tenemos, con sus activos a la vista. Separado en lo que forma parte de una " +
      "rutina y lo que es opcional — porque no es lo mismo, y mezclarlos es como termina la gente " +
      "con nueve frascos y la piel peor.",
    // Es el CTA de la puerta del catálogo en la home, así que dice adónde lleva.
    // Decía "Armar mi rutina": prometía lo mismo que la puerta del quiz y
    // mandaba a otro lado.
    cta: "Ver el catálogo",
    notaOpcionalGenerica:
      "Opcional: suma cuando la base ya está firme y sostenida. No lo pongas al mismo tiempo que " +
      "empezás con todo lo demás.",
    // Por qué cada categoría opcional quedó fuera del paso a paso. Se dice con
    // nombre y apellido: un "opcional" sin explicación se lee como "relleno".
    notaOpcional: {
      limpiador_oleoso:
        "La doble limpieza no es un paso necesario: es una costumbre que se popularizó con las " +
        "rutinas coreanas, y los dermatólogos coinciden en que lavarse una vez bien con un " +
        "limpiador suave alcanza. Lavarse de más reseca e irrita. Ahora bien, si usás maquillaje " +
        "resistente al agua o un protector muy waterproof, un limpiador oleoso saca en una pasada " +
        "lo que uno común deja. Ahí sí vale.",
      tonico:
        "Un tónico no es un paso necesario de ninguna rutina. Hidrata y prepara la piel, y eso " +
        "está bien, pero no hace nada que la crema no haga. Si te gusta la textura, sumalo; si no, " +
        "no te estás perdiendo nada.",
      exfoliante:
        "Dos o tres veces por semana como mucho, y nunca la misma noche que un retinoide. Es el " +
        "paso que más rápido rompe una barrera cuando se usa de más, y la señal —piel tirante y " +
        "más reactiva que antes— se confunde con «necesito exfoliar más».",
      retinoide:
        "El activo con más evidencia para arrugas y textura, y también el que más pide. Va de " +
        "noche, dos veces por semana al principio, sobre piel seca, y nunca junto a un exfoliante. " +
        "No lo pongas en una rutina que recién empezás.",
      serum_secundario:
        "Una capa más de hidratación. Suma si tenés la piel deshidratada de verdad; si no, es un " +
        "paso que se siente lindo y no cambia el resultado.",
      contorno:
        "La piel del párpado es más fina, pero la mayoría de las cremas de contorno son un " +
        "hidratante en frasco chico y a mayor precio. Vale la pena cuando trae algo específico " +
        "—cafeína, péptidos— y no como paso obligatorio.",
    } as Record<string, string>,
  },

  kits: {
    titulo: "Kits armados",
    // Los de compra única van primero: un link y un checkout convierte mucho
    // mejor que tres. Lo decimos con esas palabras, no con jerga.
    unicos: {
      titulo: "Todo en una sola compra",
      bajada: "Un solo link, un solo pago, un solo envío.",
      badge: "una sola compra",
      incluye: "Incluye",
      ver: "Comprar el kit",
    },
    armados: {
      titulo: "Armados por nosotros",
      bajada: "Elegimos producto por producto. Cada uno se compra aparte.",
    },
    bajada: "Cada kit es una rutina completa elegida para un tipo de piel.",
    pasos: (n: number) => `${n} paso${n === 1 ? "" : "s"}`,
    // En Mercado Libre cada producto es una compra distinta. Decirlo antes de que
    // la persona lo descubra en el checkout.
    //
    // Antes acá había un "total aprox.": la suma de los precios relevados. Era
    // el peor lugar posible para un número viejo, porque un total suma el error
    // de cada producto y se muestra antes de que nadie haya abierto una sola
    // publicación. Ahora se dice cuántos pasos son y en qué rango caen.
    aclaracionCompra:
      "Cada producto se compra por separado en Mercado Libre: son varios checkouts y varios envíos. " +
      "El precio de cada uno lo ves en su publicación, con el descuento que tenga hoy.",
    ver: "Ver el kit",
    volver: "todos los kits",
  },

  // Explicación de la rama coreana / occidental. Aparece con los resultados.
  // La idea no es vender una escuela sobre la otra: es que la persona entienda
  // qué está usando y por qué, que es lo que hace que lo sostenga.
  //
  // Antes estas tres notas explicaban las escuelas a través del tónico, porque
  // el tónico era el paso que la rama agregaba o sacaba. Ya no: un tónico es
  // completamente opcional y no ocupa un paso en ningún tier. La diferencia
  // real entre las dos tradiciones es de formulación, y de eso hablan ahora.
  notas: {
    coreano:
      "Las fórmulas coreanas suelen ir por texturas livianas, en capas finas, y apoyarse mucho en calmantes como la centella y el pantenol. Eso las hace cómodas de sostener, sobre todo si tenés piel grasa o reactiva. Ojo con una confusión frecuente: la rutina de diez pasos que se hizo famosa no es un requisito de nada. Los pasos que hacen el trabajo son los mismos de siempre.",
    occidental:
      "Te la armamos con dermocosmética de farmacia: fórmulas más directas, con el activo declarado en porcentaje y respaldo clínico detrás. Suelen ser rutinas más cortas, y no son peores por eso — limpiar, hidratar y protegerte del sol es la base que hace el 80% del trabajo.",
    mixto:
      "Elegimos el mejor de cada paso sin mirar de dónde viene. La diferencia entre las dos tradiciones es de formulación, no de cuántos frascos: la coreana tiende a texturas livianas y calmantes, la de farmacia a activos declarados en porcentaje. Ninguna es mejor — la que funciona es la que hacés todos los días.",
  },

  // Los pasos que NO están en ninguna rutina, y por qué. Se dice de frente
  // porque alguien que googlea "rutina coreana" va a contar los pasos y va a
  // notar que le faltan.
  opcionales:
    "Vas a ver rutinas por ahí que suman tónico, doble limpieza y exfoliante. Los dejamos afuera a propósito: ninguno es un paso necesario. La doble limpieza en particular es una costumbre cultural, no una indicación: los dermatólogos coinciden en que lavarse una vez bien con un limpiador suave alcanza, y que lavarse de más reseca e irrita. Preferimos que hagas cuatro pasos todos los días antes que seis tres veces por semana.",

  // Bloque de combinación de activos. La promesa del sitio no es "te damos
  // productos", es "te damos productos que funcionan JUNTOS" — y eso hay que
  // decirlo en la pantalla, no darlo por sobreentendido.
  compatibilidad: {
    titulo: "cómo combinarlos",
    bajada:
      "Los productos elegidos ya están chequeados entre sí. Lo que sigue es lo que conviene saber " +
      "para que la combinación rinda.",
    sinConflictos:
      "No hay nada para separar: estos productos se pueden usar juntos, en el orden en que están, " +
      "todos los días.",
    sinergias: "esto se potencia",
    mitos: "esto te lo van a decir, y está mal",
    // Etiquetas de las clases del motor, en castellano y sin jerga.
    clase: {
      degradacion: "se destruyen entre sí",
      ph: "cuestión de orden",
      irritacion: "carga para la piel",
      redundancia: "estás pagando dos veces",
      momento: "momento del día",
    } as Record<string, string>,
    severidad: {
      separar: "separar",
      cuidado: "ojo con esto",
      nota: "para tener en cuenta",
    } as Record<string, string>,
    // Marca en la card del paso involucrado, para que el aviso de abajo se pueda
    // conectar con el producto concreto sin hacer scroll dos veces.
    enPaso: "mirá el aviso de abajo",
    // Los tres bloques van plegados en el resultado. Esto es lo que dice el
    // botón que los abre: cuenta lo que hay adentro, para que se sepa si vale
    // abrirlo, sin adelantar el contenido. `peor` es la etiqueta de severidad
    // del aviso más serio ("separar", "ojo con esto", "para tener en cuenta").
    plegado: {
      conflictos: (n: number, peor: string) =>
        n === 0 ? "nada para separar" : `${n} ${n === 1 ? "aviso" : "avisos"} · ${peor}`,
      sinergias: (n: number) => `${n} ${n === 1 ? "combinación que suma" : "combinaciones que suman"}`,
      mitos: (n: number) => `${n} ${n === 1 ? "mito, desmentido" : "mitos, desmentidos"}`,
    },
  },

  // La nota de tradiciones (coreano / farmacia / mixto) y los pasos que dejamos
  // afuera van plegados juntos en el resultado, bajo este botón.
  criterio: {
    etiqueta: "por qué estos",
    titulo: "de dónde vienen y qué dejamos afuera",
  },


  // Avisos honestos cuando la recomendación no es un match perfecto.
  avisos: {
    no_apto_sensible:
      "Todavía no tenemos una opción para piel sensible en este paso. Esta es la mejor que hay, pero revisala si tu piel reacciona fácil.",
    otro_origen: "No teníamos este paso en el origen que elegiste.",
    fuera_de_presupuesto:
      "Se va de la banda que elegiste. No hay ninguno más accesible que sirva para tu piel y tu objetivo, y preferimos decírtelo antes que darte uno que no te va a servir.",
  },

  // Otras opciones para un paso, plegadas debajo de la recomendada. Ver
  // `src/engine/alternativas.ts`.
  //
  // El criterio dice sólo lo que es cierto SIEMPRE, por construcción: salen del
  // mismo escalón del motor, van en su mismo orden y ninguna suma un choque. No
  // dice "sirven para tu objetivo": cuando la recomendada se fue de banda, la
  // etiqueta del paso no dice de qué nivel de match vino, y la frase podría ser
  // falsa justo en ese caso.
  alternativas: {
    ver: (n: number) => `Ver ${n} ${n === 1 ? "opción más" : "opciones más"}`,
    criterio:
      "Salen del mismo grupo que la recomendada para lo que respondiste, en el mismo orden con el " +
      "que la elegimos, y ninguna suma un choque con el resto de tu rutina.",
  },

  // "Ya tengo uno": la persona marca que ya tiene algo para un paso. Dice "uno" y
  // no "lo" porque puede tener otro producto, no necesariamente el nuestro.
  //
  // La nota es la parte honesta: las combinaciones de la pantalla se chequearon
  // con el producto que recomendamos, no con el suyo, que no conocemos. No se
  // recalcula el análisis sin ese paso: sacarlo daría un "no hay nada para
  // separar" más tranquilo de lo que se puede afirmar.
  yaLoTengo: {
    control: "Ya tengo uno",
    cubierto: "Usá el tuyo en este paso.",
    nota: (producto: string) =>
      `Las combinaciones de abajo están chequeadas con ${producto}: si el tuyo trae otros activos, puede cambiar.`,
    noche: "Ya tenés uno: usá el tuyo también a la noche.",
    resumen: (tengo: number, faltan: number) =>
      `ya tenés ${tengo} · te ${faltan === 1 ? "falta" : "faltan"} ${faltan}`,
  },

  // Un paso de la noche que repite el mismo producto de la mañana va resumido,
  // con un link a la tarjeta de arriba. Ver PasoRepetido.
  repetido: {
    mismo: "El mismo de la mañana:",
  },

  // Para qué sirve cada paso, antes de mostrar qué producto lo cumple. Va sin
  // marca a propósito: es el criterio, y el producto llega como la respuesta.
  //
  // Es texto nuestro y lo lee todo el que termina el quiz, así que cada
  // afirmación tiene respaldo y pasa por el mismo filtro de claims que el copy
  // de producto (`copy-pasos.test.ts`):
  //   · limpiador — American Academy of Dermatology: dos veces por día, con uno
  //     suave y sin frotar, porque frotar irrita. INGREDIENTES.md §4.1: en algo
  //     que se enjuaga, el contacto con la piel es de segundos.
  //   · hidratante — Lodén, Clinics in Dermatology 2012: la composición decide
  //     si un hidratante mejora la función de barrera o la deteriora. Por eso el
  //     texto no promete nada del paso en general y dice que importa cuál.
  //   · protector — Hughes et al., Annals of Internal Medicine 2013, ensayo
  //     aleatorizado de 4,5 años: 24% menos fotoenvejecimiento con uso diario
  //     que con uso ocasional. Detalle en INGREDIENTES.md §8.
  //
  // `am` y `pm` son opcionales: si el paso cambia según el momento, se dice; si
  // no, va `explicacion` en los dos, y siempre en los kits.
  pasos: {
    limpiador: {
      funcion: "Limpiar sin llevarte de más",
      explicacion:
        "Un limpiador suave, a la mañana y a la noche, sin frotar. Está en la piel unos segundos " +
        "antes de enjuagarse, así que su trabajo no es aportar: es sacar lo que sobra sin llevarse " +
        "lo que la piel necesita.",
      am: "A la mañana alcanza con poco: la piel viene de la noche, no de la calle. Agua tibia y sin frotar.",
      pm: "A la noche es el lavado con más trabajo: saca lo que la piel juntó durante el día. Sin frotar, que frotar irrita.",
    },
    serum_activo: {
      funcion: "Ir a lo que querés cambiar",
      explicacion:
        "Es el único paso que apunta directo a tu objetivo; los otros sostienen la base. Va después " +
        "de limpiar y antes de hidratar, que es el orden en que se aplica.",
    },
    hidratante: {
      funcion: "Que la piel no pierda agua",
      explicacion:
        "Es su trabajo principal, y no todos lo hacen igual: según la fórmula, un hidratante puede " +
        "mejorar la barrera de la piel o dejarla peor. Por eso importa cuál.",
    },
    protector_solar: {
      funcion: "Protegerte del sol, todos los días",
      explicacion:
        "Es el paso que más cambia la piel a largo plazo, y el mejor medido: en un ensayo de cuatro " +
        "años y medio, quienes lo usaron todos los días tuvieron 24% menos envejecimiento por sol que " +
        "quienes lo usaban de vez en cuando. A la mañana va último.",
    },
  } as Record<string, { funcion: string; explicacion: string; am?: string; pm?: string }>,

  // Aparece recién en la pantalla de resultados, nunca antes.
  afiliacion: "Si comprás por estos links, cobramos una comisión sin costo extra para vos.",
  dermatologo: "Ante un problema de piel, consultá a un dermatólogo.",
  // La ventana de atribución arranca con el primer clic. Es un hecho real, no urgencia trucha.
  ventana: "Abrí los productos que quieras: el primer clic te guarda la rutina por 24 horas.",
};
