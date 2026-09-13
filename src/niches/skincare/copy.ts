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
    // activos, sinergias y mitos. Por eso el fold cierra con un link a
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
    // Orientados a resultado, no a función. Dos: en mobile no entra un tercero
    // sin empujar el CTA abajo del fold.
    bullets: [
      "Comprás una vez lo que te sirve, en vez de ir sumando frascos que quedan por la mitad.",
      "Te decimos cuándo un producto no es para tu piel, aunque lo tengamos en el catálogo.",
    ],
    respaldo: "cómo decidimos qué combina con qué",
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
    // El link a los criterios en el pie de TODAS las pantallas (ver Shell), no
    // una puerta de la home. Vive abajo porque es para el que ya está adentro y
    // quiere entender por qué recomendamos lo que recomendamos. En la home el
    // mismo destino aparece como `respaldo`, cerrando el fold.
    criterios: "cómo decidimos qué combina con qué",
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
  },


  // Avisos honestos cuando la recomendación no es un match perfecto.
  avisos: {
    no_apto_sensible:
      "Todavía no tenemos una opción para piel sensible en este paso. Esta es la mejor que hay, pero revisala si tu piel reacciona fácil.",
    otro_origen: "No teníamos este paso en el origen que elegiste.",
    fuera_de_presupuesto:
      "Se va de la banda que elegiste. No hay ninguno más accesible que sirva para tu piel y tu objetivo, y preferimos decírtelo antes que darte uno que no te va a servir.",
  },

  // Aparece recién en la pantalla de resultados, nunca antes.
  afiliacion: "Si comprás por estos links, cobramos una comisión sin costo extra para vos.",
  dermatologo: "Ante un problema de piel, consultá a un dermatólogo.",
  // La ventana de atribución arranca con el primer clic. Es un hecho real, no urgencia trucha.
  ventana: "Abrí los productos que quieras: el primer clic te guarda la rutina por 24 horas.",
};
