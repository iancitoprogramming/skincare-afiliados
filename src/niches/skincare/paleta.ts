// Los colores de marca, en TypeScript.
//
// Existe porque `theme.css` sólo lo lee Tailwind. Todo lo que se genera fuera
// del DOM —las imágenes de Open Graph, que se arman con ImageResponse— necesita
// los hex como valores, y terminaban copiados a mano.
//
// Así se rompió una vez: el brand kit cambió la paleta entera y la imagen que
// se comparte quedó con los colores viejos. Como esa imagen no se ve navegando
// el sitio, nadie lo nota hasta que alguien pinea el link.
//
// `paleta.test.ts` compara este archivo contra theme.css y falla si divergen.

export const PALETA = {
  porcelana: "#fbfaf7",
  tinta: "#1b2430",
  piedra: "#5a6b85",
  salvia: "#4a6b57",
  gel: "#dce7de",
  arena: "#f3ede6",
  terracota: "#c2410c",
  niebla: "#e0d8cd",
} as const;

export type NombreColor = keyof typeof PALETA;
