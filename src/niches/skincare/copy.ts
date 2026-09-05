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
  },

  kits: {
    titulo: "Kits armados",
    bajada: "Cada kit es una rutina completa elegida para un tipo de piel.",
    pasos: (n: number) => `${n} paso${n === 1 ? "" : "s"}`,
    total: "total aprox.",
    // En Mercado Libre cada producto es una compra distinta. Decirlo antes de que
    // la persona lo descubra en el checkout.
    aclaracionCompra:
      "Cada producto se compra por separado en Mercado Libre. El total es la suma de los tres.",
    ver: "Ver el kit",
    volver: "todos los kits",
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
