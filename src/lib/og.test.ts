import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Ninguna página se puede compartir sin imagen de preview.
//
// Next mergea la metadata campo por campo del primer nivel, así que una ruta que
// exporta `openGraph: { url: "/x" }` reemplaza el openGraph heredado y se queda
// sin la imagen que aporta app/opengraph-image.tsx. El sitio sigue andando y la
// página se ve perfecta: el agujero aparece recién cuando alguien pega el link
// en Pinterest o en Facebook, que es donde nadie mira hasta que ya se publicó.
//
// Pasó de verdad con /catalogo, /kits, /rutina y /combinaciones. Este test es
// estático a propósito —lee los archivos, no importa los módulos— porque las
// páginas son server components y arrastran medio árbol al importarlas.

const APP = join(process.cwd(), "src/app");

function paginas(dir: string): string[] {
  return readdirSync(dir).flatMap((entrada) => {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) return paginas(ruta);
    return entrada === "page.tsx" ? [ruta] : [];
  });
}

/** El segmento donde vive opengraph-image.tsx no necesita declarar la imagen:
 *  ahí Next la agrega solo. Hoy es el root, y por eso la home está exenta. */
const CON_ARCHIVO_PROPIO = new Set([join(APP, "page.tsx")]);

describe("imagen de Open Graph", () => {
  const archivos = paginas(APP);

  it("encuentra las páginas del sitio", () => {
    expect(archivos.length).toBeGreaterThan(5);
  });

  it.each(archivos.map((a) => [relative(APP, a), a] as const))(
    "%s no exporta openGraph sin imagen",
    (_nombre, archivo) => {
      const fuente = readFileSync(archivo, "utf8");

      // Sin openGraph propio hereda el del padre, imagen incluida: está bien.
      if (!/openGraph\s*:/.test(fuente)) return;
      if (CON_ARCHIVO_PROPIO.has(archivo)) return;

      expect(
        /images\s*:/.test(fuente),
        "exporta openGraph sin `images`, así que pisa la imagen heredada y la " +
          "página se comparte sin preview. Agregá `images: OG_POR_DEFECTO` " +
          "(de @/lib/sitio) o una imagen propia.",
      ).toBe(true);
    },
  );
});
