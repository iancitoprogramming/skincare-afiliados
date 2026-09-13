// La foto del fondo de la home. Es de Wikimedia Commons con licencia CC BY-SA:
// la atribución tiene que estar visible en el sitio, no sólo acá. La muestra
// el pie de la home con estos mismos datos.
//
// Vive en un módulo sin "use client" a propósito: la lee el server component
// de la home y el componente de cliente del fondo. Exportada desde un módulo
// de cliente, al server component le llega una referencia y no el objeto —
// el crédito salía vacío.
export const FOTO = {
  archivo: "/monte.webp",
  autor: "Sai Avinash",
  licencia: "CC BY-SA 4.0",
  url: "https://commons.wikimedia.org/wiki/File:East_Khasi_Hills.jpg",
} as const;
