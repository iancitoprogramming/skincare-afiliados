// ¿Qué producto habría que comprar para que el motor pueda evitar los conflictos
// que hoy no puede evitar?
//
//   npm run huecos              · sobre el catálogo servible de hoy
//   npm run huecos -- --proyectar · como si todo el pipeline estuviera activo
//   npm run huecos -- --simular   · agrega los candidatos hipotéticos y mide
//
// ─────────────────────────────────────────────────────────────────────────────
// CÓMO CONTESTA LA PREGUNTA
//
// El armado que evita conflictos elige, dentro del mejor nivel de match, el
// candidato que menos choca. Cuando igual queda un conflicto, es por una de dos
// razones, y son muy distintas:
//
//   · EVITABLE-PERO-CARO — había un candidato limpio, pero perdía por prioridad.
//     Eso se arregla cambiando la política de desempate, no comprando nada.
//
//   · SIN ALTERNATIVA — TODOS los candidatos de ese paso chocaban. Acá no hay
//     política que valga: falta un producto. Este script cuenta exactamente
//     estos casos y describe qué tendría que tener el producto que falta.
//
// La salida es una lista de compras ordenada por cuántos conflictos destraba,
// no por lo que a uno le parece.

import { skincareQuiz } from "../src/niches/skincare/config";
import { productos as catalogoBase } from "../src/niches/skincare/productos";
import { catalogoActivos } from "../src/niches/skincare/activos";
import { configServible } from "../src/engine/quiz/servible";
import { candidatosPaso } from "../src/engine/recomendacion";
import { analizarRutina, ORDEN_DE_ELECCION } from "../src/engine/compatibilidad";
import { CANDIDATOS_A_COMPRAR } from "./candidatos-compra";
import type { Producto, PasoRutina, Rutina, RutinaSlot } from "../src/engine/recomendacion";
import type { Answers } from "../src/engine/quiz/types";

const PROYECTAR = process.argv.includes("--proyectar");
const SIMULAR = process.argv.includes("--simular");
/**
 * Prueba cada candidato POR SEPARADO y los ordena por cuántos conflictos
 * destraba. Es la única forma honesta de armar una lista de compras: comprar
 * los nueve juntos siempre mejora, pero la pregunta real es cuál primero.
 */
const RANKING = process.argv.includes("--ranking");
/** Sólo se simulan estos índices de CANDIDATOS_A_COMPRAR. Vacío = todos. */
const SOLO: number[] = (() => {
  const i = process.argv.indexOf("--solo");
  return i === -1 ? [] : (process.argv[i + 1] ?? "").split(",").filter(Boolean).map(Number);
})();
const clave = (p: PasoRutina) => p.producto.ml_id ?? p.producto.id;

let catalogo: Producto[] = PROYECTAR
  ? catalogoBase.map((p) => ({ ...p, activo: true }))
  : catalogoBase;

// Los candidatos hipotéticos entran con sus activos, si no el motor los vería
// como productos vacíos y "no chocarían" por no tener nada adentro — que sería
// hacer trampa con la simulación.
const activos = { ...catalogoActivos, porProducto: { ...catalogoActivos.porProducto } };
const aSimular = SOLO.length
  ? SOLO.map((i) => CANDIDATOS_A_COMPRAR[i]).filter(Boolean)
  : CANDIDATOS_A_COMPRAR;
if (SIMULAR || SOLO.length) {
  catalogo = [...catalogo, ...aSimular.map((c) => c.producto)];
  for (const c of aSimular) activos.porProducto[c.producto.ml_id!] = c.activos;
}

const config = configServible(skincareQuiz, catalogo);
const rec = config.recomendacion;
const valoresDe = (k: string) => config.questions.find((q) => q.urlKey === k)?.options.map((o) => o.value) ?? [];
const tiers = valoresDe(rec.rutinaKey).length ? valoresDe(rec.rutinaKey) : [rec.variantePorDefecto ?? "1"];

const rutinaDePasos = (pasos: PasoRutina[]): Rutina => ({
  am: pasos.filter((p) => p.slot.momento === "am" || p.slot.momento === "ambos"),
  pm: pasos.filter((p) => p.slot.momento === "pm" || p.slot.momento === "ambos"),
});

interface Hueco {
  categoria: string;
  piel: string;
  objetivo: string;
  reglaId: string;
  severidad: string;
  /** Activos que ya estaban puestos y con los que choca. */
  choca: string[];
  /** Cuántos candidatos había, para saber si es falta de stock o de variedad. */
  candidatos: number;
}

const huecos: Hueco[] = [];
let rutinasAnalizadas = 0;
let conflictosTotales = 0;
let conflictosSinAlternativa = 0;
let conflictosEvitablesPeroCaros = 0;

for (const piel of valoresDe(rec.pielKey)) {
  for (const objetivo of valoresDe(rec.objetivoKey)) {
    for (const presupuesto of valoresDe(rec.presupuestoKey).map(Number)) {
      for (const ramaValor of rec.rama ? valoresDe(rec.rama.key) : [""]) {
        for (const tier of tiers) {
          const answers: Answers = {
            [rec.pielKey]: piel,
            [rec.objetivoKey]: objetivo,
            [rec.presupuestoKey]: String(presupuesto),
            [rec.rutinaKey]: tier,
          };
          if (rec.rama && ramaValor) answers[rec.rama.key] = ramaValor;

          const techo = rec.techoPorPiel?.[piel];
          const variante = techo && Number(tier) > Number(techo) ? techo : tier;
          const quitar = rec.rama && ramaValor ? (rec.rama.quitarCategorias?.[ramaValor] ?? []) : [];
          const origenes = rec.rama && ramaValor ? (rec.rama.origenes[ramaValor] ?? []) : [];
          const slots: RutinaSlot[] = (rec.rutinas[variante] ?? []).filter(
            (s) => !quitar.includes(s.categoria),
          );
          if (!slots.length) continue;

          const r = { piel, objetivo, presupuesto, origenes };
          const orden = slots
            .map((slot, i) => ({ slot, i }))
            .sort(
              (a, b) =>
                (ORDEN_DE_ELECCION.indexOf(a.slot.categoria) + 1 || 99) -
                  (ORDEN_DE_ELECCION.indexOf(b.slot.categoria) + 1 || 99) || a.i - b.i,
            );

          const elegidos: PasoRutina[] = [];
          let rota = false;

          for (const { slot } of orden) {
            let cands;
            try {
              cands = candidatosPaso(catalogo, slot, r);
            } catch {
              rota = true;
              break;
            }

            // Para cada candidato: qué conflictos NUEVOS aporta.
            const base = analizarRutina(rutinaDePasos(elegidos), activos, clave).conflictos.length;
            let mejor: { paso: PasoRutina; nuevos: number; conflictos: ReturnType<typeof analizarRutina>["conflictos"] } | null = null;
            let hayLimpio = false;

            for (const producto of cands.productos) {
              const paso: PasoRutina = { slot, producto, fallback: cands.fallback };
              const a = analizarRutina(rutinaDePasos([...elegidos, paso]), activos, clave);
              const nuevos = a.conflictos.length - base;
              if (nuevos <= 0) hayLimpio = true;
              if (!mejor || nuevos < mejor.nuevos) mejor = { paso, nuevos, conflictos: a.conflictos };
            }
            if (!mejor) { rota = true; break; }

            if (mejor.nuevos > 0) {
              conflictosTotales += mejor.nuevos;
              if (hayLimpio) {
                conflictosEvitablesPeroCaros += mejor.nuevos;
              } else {
                conflictosSinAlternativa += mejor.nuevos;
                // Qué chocó: los conflictos que involucran a este paso.
                const activosPrevios = new Set(
                  elegidos.flatMap((e) => activos.porProducto[clave(e)] ?? []),
                );
                for (const c of mejor.conflictos.slice(base)) {
                  huecos.push({
                    categoria: slot.categoria,
                    piel,
                    objetivo,
                    reglaId: c.reglaId,
                    severidad: c.severidad,
                    choca: [...activosPrevios],
                    candidatos: cands.productos.length,
                  });
                }
              }
            }
            elegidos.push(mejor.paso);
          }
          if (!rota) rutinasAnalizadas++;
        }
      }
    }
  }
}

// ── Reporte ─────────────────────────────────────────────────────────────────
const L = (s = "") => console.log(s);
L("═".repeat(78));
L(`HUECOS DE COMPATIBILIDAD · ${rutinasAnalizadas} rutinas`);
L(
  `modo: ${PROYECTAR ? "proyectado" : "catálogo de hoy"}${SIMULAR ? " + candidatos simulados" : ""} · ` +
    `${catalogo.filter((p) => p.activo).length} productos activos`,
);
L("═".repeat(78));
L();
L(`Conflictos que el motor no pudo evitar: ${conflictosTotales}`);
L(`  · por falta de producto (SIN ALTERNATIVA): ${conflictosSinAlternativa}`);
L(`  · había opción limpia pero perdía por prioridad: ${conflictosEvitablesPeroCaros}`);
L();
L("Si el segundo número es alto, se arregla cambiando la política de desempate.");
L("Si el alto es el primero, hay que comprar.");

// Agregado por (categoría, regla): qué producto falta y cuánto destraba.
const porHueco = new Map<string, { n: number; pieles: Set<string>; objetivos: Set<string>; choca: Set<string>; cands: number; sev: string }>();
for (const h of huecos) {
  const k = `${h.categoria}|${h.reglaId}`;
  const e = porHueco.get(k) ?? { n: 0, pieles: new Set(), objetivos: new Set(), choca: new Set(), cands: h.candidatos, sev: h.severidad };
  e.n++;
  e.pieles.add(h.piel);
  e.objetivos.add(h.objetivo);
  for (const a of h.choca) e.choca.add(a);
  porHueco.set(k, e);
}

L();
L("── QUÉ FALTA, ORDENADO POR CUÁNTO DESTRABA ".padEnd(78, "─"));
if (!porHueco.size) {
  L("  Nada: todos los conflictos que quedan tenían alternativa limpia disponible.");
} else {
  for (const [k, e] of [...porHueco].sort((a, b) => b[1].n - a[1].n)) {
    const [categoria, reglaId] = k.split("|");
    L();
    L(`  ${e.n} veces · [${e.sev}] ${reglaId}`);
    L(`     falta un/a: ${categoria}`);
    L(`     para: piel ${[...e.pieles].join("/")} · objetivo ${[...e.objetivos].join("/")}`);
    L(`     candidatos disponibles en ese paso: ${e.cands} (todos chocan)`);
    const relevantes = [...e.choca].filter((a) =>
      /retin|vit_c_laa|aha_|bha_|cobre|peroxido|fragancia|alcohol|aceite_esencial/.test(a),
    );
    if (relevantes.length) L(`     choca con lo ya elegido: ${relevantes.join(", ")}`);
  }
}
L();
L("═".repeat(78));
