// Reporte de cobertura. Recorre TODAS las combinaciones del quiz y te dice en qué
// pasos la recomendación cae a un comodín (o a un match parcial). Ahí es donde
// conviene cargar el próximo link de afiliado hecho a mano.
// Uso: npm run cobertura   (no necesita base de datos, lee productos.ts local)

import { elegirPaso, type NivelFallback } from "../src/engine/recomendacion";
import { productos } from "../src/niches/skincare/productos";
import { TIERS, tierEfectivo, skincareQuiz } from "../src/niches/skincare/config";

const valores = (urlKey: string) =>
  skincareQuiz.questions.find((q) => q.urlKey === urlKey)!.options.map((o) => o.value);

const pieles = valores("p");
const objetivos = valores("o");
const presupuestos = valores("b").map(Number);
const tiers = valores("n");

// Un tier sólo es servible si TODAS sus categorías tienen al menos un producto.
const conStock = new Set(productos.filter((p) => p.activo).map((p) => p.categoria));
const servibles = tiers.filter((t) =>
  TIERS[t as keyof typeof TIERS].every((s) => conStock.has(s.categoria)),
);
const bloqueados = tiers.filter((t) => !servibles.includes(t));

const conteo: Record<NivelFallback, number> = {
  match: 0,
  sin_preocupacion: 0,
  sin_piel: 0,
  fuera_de_presupuesto: 0,
  otro_origen: 0,
  no_apto_sensible: 0,
  comodin: 0,
};
const alertas: string[] = [];
let combos = 0;

for (const tier of servibles) {
  for (const piel of pieles) {
    for (const objetivo of objetivos) {
      for (const presupuesto of presupuestos) {
        combos++;
        for (const slot of TIERS[tierEfectivo(tier, piel)]) {
          const paso = elegirPaso(productos, slot, { piel, objetivo, presupuesto });
          conteo[paso.fallback]++;
          if (["comodin", "sin_piel", "no_apto_sensible"].includes(paso.fallback)) {
            alertas.push(
              `T${tier} · ${piel}/${objetivo}/$${presupuesto} · ${slot.categoria} → ${paso.fallback} (${paso.producto.nombre})`,
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
// No es un paso flojo: es el criterio funcionando. Se muestra igual porque mide
// cuánto le estamos pidiendo a la persona que se estire por encima de su banda.
console.log(`  fuera de banda   : ${conteo.fuera_de_presupuesto}`);
console.log(`  otro origen      : ${conteo.otro_origen}`);
console.log(`  no apto sensible : ${conteo.no_apto_sensible}`);
console.log(`  comodín          : ${conteo.comodin}`);

if (alertas.length) {
  console.log(`\nPasos flojos (${alertas.length}) — candidatos a cargar un link mejor:\n`);
  for (const a of alertas) console.log(`  · ${a}`);
} else {
  console.log("\nNingún paso cae a comodín ni a match por tipo de piel. Catálogo redondo.");
}
console.log("");
