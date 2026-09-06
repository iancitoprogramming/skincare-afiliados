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
    bajada:
      "Te armamos la rutina completa en 5 preguntas, cruzando cada activo con los demás. Sin probar y errar, sin comprar dos veces lo mismo, sin ácidos que se anulan entre sí.",
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
    // Tercera puerta, y a propósito mucho más chica que las otras dos: es para
    // el que llega desconfiando. La home sigue siendo de dos caminos.
    criterios: "cómo decidimos qué combina con qué",
  },

  catalogo: {
    titulo: "Todo el catálogo",
    bajada: "Filtrá por tu tipo de piel, por paso o por origen. Cada producto tiene su ficha.",
    cta: "Ver el catálogo",
    bajadaHome: "Mirá producto por producto y elegí vos.",
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
    total: "total aprox.",
    // En Mercado Libre cada producto es una compra distinta. Decirlo antes de que
    // la persona lo descubra en el checkout.
    aclaracionCompra:
      "Cada producto se compra por separado en Mercado Libre: son varios checkouts y varios envíos. El total es la suma de todos.",
    ver: "Ver el kit",
    volver: "todos los kits",
  },

  // Explicación de la rama coreana / occidental. Aparece con los resultados.
  // La idea no es vender una escuela sobre la otra: es que la persona entienda
  // qué paso está haciendo y por qué, que es lo que hace que lo sostenga.
  notas: {
    coreano:
      "El tónico es el paso que más distingue una rutina coreana. Va después de limpiar y antes de la crema, y no limpia nada: hidrata y deja la piel húmeda para que lo que viene después entre mejor. Ojo con la confusión: los tónicos occidentales de los 90 eran astringentes, con alcohol, para sacar el resto del jabón. Por eso quedaron con mala fama. Los coreanos van al revés, son de hidratar.",
    occidental:
      "Te la armamos sin tónico, que es el paso que en occidente no se usa. Tu rutina queda más corta y no es peor por eso: limpiar, hidratar y protegerte del sol es la base que hace el 80% del trabajo. Si alguna vez tenés ganas de probar el paso extra, rehacé el quiz eligiendo coreanos.",
    mixto:
      "Elegimos el mejor de cada paso sin mirar de dónde viene. La diferencia principal entre las dos escuelas es el tónico: en las rutinas coreanas hidrata y prepara la piel entre la limpieza y la crema; en las occidentales ese paso directamente no existe. Ninguna es mejor — la que funciona es la que hacés todos los días.",
  },

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

  // Cuánto respalda el producto gente que no somos nosotros.
  // El tercero es el importante: decir que algo tiene poca prueba es lo que hace
  // creíbles a los otros dos.
  respaldo: {
    muy_probado: { chip: "muy probado", detalle: (n: number) => `${n.toLocaleString("es-AR")} opiniones en Mercado Libre` },
    probado: { chip: "probado", detalle: (n: number) => `${n.toLocaleString("es-AR")} opiniones en Mercado Libre` },
    poca_prueba: {
      chip: "poca prueba todavía",
      detalle: () => "Está en el catálogo por criterio nuestro. Todavía tiene pocas opiniones en Mercado Libre.",
    },
    filtro: "respaldo",
  },

  // Avisos honestos cuando la recomendación no es un match perfecto.
  avisos: {
    no_apto_sensible:
      "Todavía no tenemos una opción para piel sensible en este paso. Esta es la mejor que hay, pero revisala si tu piel reacciona fácil.",
    otro_origen: "No teníamos este paso en el origen que elegiste.",
  },

  // Aparece recién en la pantalla de resultados, nunca antes.
  afiliacion: "Si comprás por estos links, cobramos una comisión sin costo extra para vos.",
  dermatologo: "Ante un problema de piel, consultá a un dermatólogo.",
  // La ventana de atribución arranca con el primer clic. Es un hecho real, no urgencia trucha.
  ventana: "Abrí los productos que quieras: el primer clic te guarda la rutina por 24 horas.",
};
