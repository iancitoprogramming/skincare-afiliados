// Reporte de cobertura. Recorre TODAS las combinaciones del quiz y te dice en qué
// pasos la recomendación cae a un comodín (o a un match parcial). Ahí es donde
// conviene cargar el próximo link de afiliado hecho a mano.
// Uso: npm run cobertura   (no necesita base de datos, lee productos.ts local)

import { elegirPaso, type NivelFallback } from "../src/engine/recomendacion";
import { productos } from "../src/niches/skincare/productos";
import { RUTINAS, skincareQuiz } from "../src/niches/skincare/config";

const valores = (urlKey: string) =>
  skincareQuiz.questions.find((q) => q.urlKey === urlKey)!.options.map((o) => o.value);

const pieles = valores("p");
const objetivos = valores("o");
const presupuestos = valores("b").map(Number);
const niveles = valores("n") as ("0" | "1")[];

const conteo: Record<NivelFallback, number> = {
  match: 0,
  sin_preocupacion: 0,
  sin_piel: 0,
  comodin: 0,
};
const alertas: string[] = [];
let combos = 0;

for (const nivel of niveles) {
  for (const piel of pieles) {
    for (const objetivo of objetivos) {
      for (const presupuesto of presupuestos) {
        combos++;
        for (const slot of RUTINAS[nivel]) {
          const paso = elegirPaso(productos, slot, { piel, objetivo, presupuesto });
          conteo[paso.fallback]++;
          if (paso.fallback === "comodin" || paso.fallback === "sin_piel") {
            alertas.push(
              `n${nivel} · ${piel}/${objetivo}/$${presupuesto} · ${slot.categoria} → ${paso.fallback} (${paso.producto.nombre})`,
            );
          }
        }
      }
    }
  }
}

console.log(`\nCobertura sobre ${combos} combinaciones:\n`);
console.log(`  match completo   : ${conteo.match}`);
console.log(`  sin preocupación : ${conteo.sin_preocupacion}`);
console.log(`  sin tipo de piel : ${conteo.sin_piel}`);
console.log(`  comodín          : ${conteo.comodin}`);

if (alertas.length) {
  console.log(`\nPasos flojos (${alertas.length}) — candidatos a cargar un link mejor:\n`);
  for (const a of alertas) console.log(`  · ${a}`);
} else {
  console.log("\nNingún paso cae a comodín ni a match por tipo de piel. Catálogo redondo.");
}
console.log("");
