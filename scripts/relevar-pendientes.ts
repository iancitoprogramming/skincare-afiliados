// Arma docs/relevar-pendientes.md con todo lo que le falta precio o imagen.
//
// Mismo ida y vuelta que `links-pendientes`: se abre el .md, se pega el precio
// y la URL de la foto de cada publicación, y después `npm run relevar-aplicar`
// lo escribe en el catálogo. El ml_id va adelante porque es la clave con la que
// se vuelve a encontrar cada producto, y no cambia aunque cambie el nombre.
//
// Por qué hace falta: los 73 links ya están cargados, pero un producto sin
// precio ni foto no se puede prender — la card sale con un recuadro vacío y sin
// número. Estos dos datos son lo único que separa al catálogo de estar completo.

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { productos } from "../src/niches/skincare/productos";
import { urlPublicacion } from "../src/lib/links";

interface Fila {
  ml_id: string;
  etiqueta: string;
  falta: string[];
  activo: boolean;
}

const filas: Fila[] = productos
  .map((p) => {
    const falta: string[] = [];
    if (!p.precio_ars) falta.push("precio");
    if (!p.imagen_url) falta.push("imagen");
    return {
      ml_id: p.ml_id ?? "",
      etiqueta: `${p.marca ?? ""} ${p.nombre}`.trim(),
      falta,
      activo: p.activo,
    };
  })
  .filter((f) => f.falta.length > 0);

// Los activos primero: son los que ya se están mostrando incompletos.
filas.sort(
  (a, b) => Number(b.activo) - Number(a.activo) || a.etiqueta.localeCompare(b.etiqueta),
);

const completos = productos.length - filas.length;

const md = [
  "# Relevamiento pendiente: precio e imagen",
  "",
  "> Generado por `npm run relevar-pendientes`. **Se puede editar**: pegá el precio",
  "> y la imagen en las últimas dos columnas y después corré `npm run relevar-aplicar`.",
  "",
  `${productos.length} productos · **${completos} completos** · **${filas.length} pendientes**`,
  "",
  "## Cómo se completa",
  "",
  "1. Abrí la publicación con el link de la columna *abrir*.",
  "2. Copiá el precio tal cual lo muestra ML. Da igual el formato: `24.693`,",
  "   `$24.693` y `24693` se entienden los tres.",
  "3. Click derecho sobre la foto grande → *Copiar dirección de la imagen*, y",
  "   pegala en la última columna.",
  "4. Guardá el archivo y corré `npm run relevar-aplicar`.",
  "",
  "Un par de cosas que ahorran trabajo:",
  "",
  "- **Con una sola URL de imagen alcanza.** El script deriva solo la variante",
  "  cuadrada para las cards y la de proporción original para las piezas de",
  "  diseño. No hace falta buscar las dos.",
  "- **Las filas vacías se ignoran**, así que se puede ir de a poco.",
  "- **No toques la columna `ml_id`**: es con lo que el script vuelve a encontrar",
  "  cada producto.",
  "- El script **rechaza** un precio que no entienda o que esté fuera de rango, y",
  "  una URL que no sea de Mercado Libre o que sea la miniatura. Te dice cuál y",
  "  por qué, y no escribe nada de esa fila.",
  "",
].join("\n");

const tabla = filas.length
  ? [
      "## Pendientes",
      "",
      "| ml_id | producto | falta | abrir | precio | imagen |",
      "|---|---|---|---|---|---|",
      ...filas.map(
        (f) =>
          `| \`${f.ml_id}\` | ${f.activo ? "" : "_(inactivo)_ "}${f.etiqueta} | ` +
          `${f.falta.join(" + ")} | [ML](${urlPublicacion(f.ml_id)}) | | |`,
      ),
      "",
    ].join("\n")
  : "## Pendientes\n\nNinguno. Todo el catálogo tiene precio e imagen.\n";

const destino = resolve(process.cwd(), "docs/relevar-pendientes.md");
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, md + tabla, "utf8");

console.log(`\n${productos.length} productos · ${completos} completos · ${filas.length} pendientes`);
console.log(`→ ${destino}\n`);

if (filas.length) {
  const soloPrecio = filas.filter((f) => f.falta.length === 1 && f.falta[0] === "precio").length;
  const soloImagen = filas.filter((f) => f.falta.length === 1 && f.falta[0] === "imagen").length;
  const ambos = filas.filter((f) => f.falta.length === 2).length;
  if (ambos) console.log(`  falta precio e imagen — ${ambos}`);
  if (soloPrecio) console.log(`  falta sólo el precio — ${soloPrecio}`);
  if (soloImagen) console.log(`  falta sólo la imagen — ${soloImagen}`);
  const activos = filas.filter((f) => f.activo).length;
  if (activos) console.log(`\n  ⚠️  ${activos} ya están ACTIVOS y se muestran incompletos.`);
  console.log("");
}
