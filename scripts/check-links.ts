// Chequea que todo producto ACTIVO tenga un link que realmente monetice.
// Uso: npm run check-links   (sale con código 1 si hay algo roto)
//
// Por qué existe: los links se cargan a mano, de a decenas. Una URL de browse
// pegada por error funciona igual — la persona compra y no se cobra comisión, y
// no hay ninguna señal de que algo esté mal. Esto es esa señal.

import { productos } from "../src/niches/skincare/productos";
import type { Producto } from "../src/engine/recomendacion";
import { clasificar, ETIQUETA as etiqueta, type Veredicto } from "../src/lib/links";

const activos = productos.filter((p) => p.activo);
const grupos = new Map<Veredicto, Producto[]>();
for (const p of activos) {
  const v = clasificar(p.link_afiliado);
  grupos.set(v, [...(grupos.get(v) ?? []), p]);
}


console.log(`\n${activos.length} productos activos de ${productos.length} en catálogo\n`);

for (const v of ["afiliado", "placeholder", "browse", "vacio", "desconocido"] as Veredicto[]) {
  const ps = grupos.get(v);
  if (!ps?.length) continue;
  console.log(`${etiqueta[v]} — ${ps.length}`);
  if (v !== "afiliado") for (const p of ps) console.log(`    · ${p.marca ?? ""} ${p.nombre}`.trim());
  console.log("");
}

// Un producto inactivo con placeholder es normal: se está preparando. Lo que no
// puede pasar es que algo ACTIVO no monetice.
const rotos = (grupos.get("browse")?.length ?? 0) + (grupos.get("vacio")?.length ?? 0);
const pendientes = grupos.get("placeholder")?.length ?? 0;
const revisar = grupos.get("desconocido")?.length ?? 0;

if (rotos) {
  console.error(`${rotos} producto(s) activos con links que NO monetizan. Corregilos antes de publicar.\n`);
  process.exit(1);
}
if (pendientes) {
  console.log(`${pendientes} activo(s) todavía con placeholder: no cobran comisión.\n`);
  process.exit(1);
}
if (revisar) {
  console.log(`${revisar} link(s) que no reconozco como de afiliado. Revisalos a mano.\n`);
  process.exit(1);
}
console.log("Todos los links activos monetizan.\n");
