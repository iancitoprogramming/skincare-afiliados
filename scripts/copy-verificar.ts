// Chequea el copy de producto contra las reglas que el proyecto se puso.
//
//   npm run copy-verificar   (sale con código 1 si algo no pasa)
//
// Por qué existe: el filtro de claims médicos es una decisión documentada
// (ISSUES.md §I8) y hasta ahora vivía sólo en la cabeza de quien escribía. Un
// "repara la barrera" se cuela sin que nadie lo note, y no se nota nunca —
// hasta que lo nota quien no debería.

import { COPY_PRODUCTOS } from "../src/niches/skincare/copy-productos";
import { productos } from "../src/niches/skincare/productos";

// La lista vive en src/niches/skincare/claims.ts, para que los tests también la usen.
import { PROHIBIDAS } from "../src/niches/skincare/claims";

// Largo máximo. Las cards tienen poco espacio y un texto que se corta a la
// mitad es peor que uno corto.
const MAX_POR_QUE = 190;
const MAX_COMO_USAR = 170;

const problemas: string[] = [];

for (const [mlId, copy] of Object.entries(COPY_PRODUCTOS)) {
  for (const [campo, texto, max] of [
    ["por_que", copy.porQue, MAX_POR_QUE],
    ["como_usar", copy.comoUsar, MAX_COMO_USAR],
  ] as const) {
    for (const [re, motivo] of PROHIBIDAS) {
      if (re.test(texto)) problemas.push(`${mlId} · ${campo}: ${motivo}\n     "${texto}"`);
    }
    if (texto.length > max) {
      problemas.push(`${mlId} · ${campo}: ${texto.length} caracteres, máximo ${max}`);
    }
    if (!texto.trim().endsWith(".")) {
      problemas.push(`${mlId} · ${campo}: no termina en punto`);
    }
  }
}

// Todo producto del catálogo con link debería tener copy: si monetiza, se
// muestra, y si se muestra necesita decir algo.
const sinCopy = productos
  .filter((p) => p.link_afiliado && !p.por_que && !(p.ml_id! in COPY_PRODUCTOS))
  .map((p) => `${p.ml_id} · ${p.marca} ${p.nombre.slice(0, 40)}`);

console.log(`Copy verificado: ${Object.keys(COPY_PRODUCTOS).length} productos`);
if (sinCopy.length) {
  console.log(`\n⚠️  ${sinCopy.length} productos con link y sin copy:`);
  for (const s of sinCopy) console.log(`     · ${s}`);
}

if (problemas.length) {
  console.error(`\n⛔ ${problemas.length} problemas:\n`);
  for (const p of problemas) console.error(`   · ${p}`);
  process.exit(1);
}
console.log("Sin claims prohibidos, sin textos largos de más.");
