// Textos del nicho. Editables sin tocar componentes.
export const copy = {
  marca: "Club de Piel",
  tagline: "Rutinas de skincare que se entienden",

  meta: {
    title: "Club de Piel · Tu rutina de skincare en 30 segundos",
    description:
      "Elegí un kit ya armado o respondé 4 preguntas y te armamos la rutina para tu piel y tu presupuesto. Productos coreanos, europeos y nacionales.",
  },

  // Pantalla de entrada: dos puertas, sin scroll y sin buscar.
  home: {
    titulo: "Tu piel, sin vueltas.",
    bajada:
      "Sin listas infinitas ni palabras raras. Elegí por dónde arrancar y en un minuto tenés tu rutina.",
    kits: {
      titulo: "Kits ya armados",
      bajada: "Elegí el de tu tipo de piel y listo.",
      cta: "Ver kits",
    },
    quiz: {
      titulo: "Armá tu rutina",
      bajada: "4 preguntas · 30 segundos.",
      cta: "Empezar",
    },
    // Tercera puerta, y a propósito mucho más chica que las otras dos: es para
    // el que llega desconfiando. La home sigue siendo de dos caminos.
    criterios: "cómo decidimos qué combina con qué",
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
    "Vas a ver rutinas por ahí que suman tónico y exfoliante. Los dejamos afuera a propósito: ninguno de los dos es un paso necesario, los dos suman un frasco y el exfoliante además suma riesgo de irritación. Preferimos que hagas cuatro pasos todos los días antes que seis tres veces por semana.",

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
  },

  // Aparece recién en la pantalla de resultados, nunca antes.
  afiliacion: "Si comprás por estos links, cobramos una comisión sin costo extra para vos.",
  dermatologo: "Ante un problema de piel, consultá a un dermatólogo.",
  // La ventana de atribución arranca con el primer clic. Es un hecho real, no urgencia trucha.
  ventana: "Abrí los productos que quieras: el primer clic te guarda la rutina por 24 horas.",
};
