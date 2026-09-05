// Auditoría exhaustiva del motor. Recorre TODAS las combinaciones de respuestas
// que el quiz puede producir, arma la rutina de cada una y le pasa el motor de
// compatibilidad. Contesta cuatro preguntas que a ojo no se pueden contestar:
//
//   1. ¿Qué conflictos de activos genera el catálogo tal como está hoy, y en
//      cuántas de las rutinas posibles?
//   2. ¿Hay productos que el motor no puede elegir nunca? (inventario muerto:
//      links de afiliado cargados que jamás se le muestran a nadie)
//   3. ¿Qué productos no tienen activos mapeados? (huecos de la capa curada)
//   4. ¿Cuántas rutinas salen con un paso degradado —fallback— y de qué tipo?
//
// Correr con:  npm run auditar
// Sólo lee. No toca ningún archivo.

import { skincareQuiz } from "../src/niches/skincare/config";
import { productos } from "../src/niches/skincare/productos";
import { catalogoActivos } from "../src/niches/skincare/activos";
import { planSemanal } from "../src/niches/skincare/calendario";
import { resolverRutina } from "../src/engine/quiz/armar";
import { configServible } from "../src/engine/quiz/servible";
import { analizarRutina } from "../src/engine/compatibilidad";
import type { Answers } from "../src/engine/quiz/types";
import type { PasoRutina } from "../src/engine/recomendacion";

const clave = (p: PasoRutina) => p.producto.ml_id ?? p.producto.id;

// La config que ve el usuario, no la teórica: `configServible` recorta los tiers
// que el catálogo no puede llenar. Auditar la teórica daría números que nadie ve.
const config = configServible(skincareQuiz, productos);

const valoresDe = (urlKey: string) =>
  config.questions.find((q) => q.urlKey === urlKey)?.options.map((o) => o.value) ?? [];

const rec = config.recomendacion;
const pieles = valoresDe(rec.pielKey);
const objetivos = valoresDe(rec.objetivoKey);
const presupuestos = valoresDe(rec.presupuestoKey);
const ramas = rec.rama ? valoresDe(rec.rama.key) : [""];
// Si `configServible` sacó la pregunta del tier por haber una sola variante,
// hay que usar la variante por defecto igual.
const tiers = valoresDe(rec.rutinaKey).length
  ? valoresDe(rec.rutinaKey)
  : [rec.variantePorDefecto ?? "1"];

interface Fila {
  answers: Answers;
  etiqueta: string;
  conflictos: string[];
  sinergias: string[];
  mitos: string[];
  fallbacks: string[];
  /** Un elemento por paso servido (AM + PM), sin deduplicar. */
  totalPasos: number;
  productos: string[];
  cargaAm: number;
  cargaPm: number;
  conPlan: boolean;
}

const filas: Fila[] = [];

for (const piel of pieles) {
  for (const objetivo of objetivos) {
    for (const presupuesto of presupuestos) {
      for (const ramaValor of ramas) {
        for (const tier of tiers) {
          const answers: Answers = {
            [rec.pielKey]: piel,
            [rec.objetivoKey]: objetivo,
            [rec.presupuestoKey]: presupuesto,
            [rec.rutinaKey]: tier,
          };
          if (rec.rama && ramaValor) answers[rec.rama.key] = ramaValor;

          const resuelta = resolverRutina(config, productos, answers);
          const analisis = analizarRutina(resuelta.rutina, catalogoActivos, clave);
          const pasos = [...resuelta.rutina.am, ...resuelta.rutina.pm];

          filas.push({
            answers,
            etiqueta: `${piel} · ${objetivo} · $${presupuesto} · ${ramaValor} · T${resuelta.variante}`,
            conflictos: analisis.conflictos.map((c) => `${c.severidad}|${c.reglaId}`),
            sinergias: analisis.sinergias.map((s) => s.sinergiaId),
            mitos: analisis.mitos.map((m) => m.mitoId),
            fallbacks: pasos.map((p) => p.fallback),
            totalPasos: pasos.length,
            productos: [...new Set(pasos.map((p) => clave(p)))],
            cargaAm: analisis.carga.am,
            cargaPm: analisis.carga.pm,
            conPlan: planSemanal(analisis) !== null,
          });
        }
      }
    }
  }
}

// ── Reporte ─────────────────────────────────────────────────────────────────

const linea = (s = "") => console.log(s);
const pct = (n: number) => `${((n / filas.length) * 100).toFixed(1)}%`;

linea("═".repeat(78));
linea(`AUDITORÍA DE COMBINACIONES · ${filas.length} rutinas posibles`);
linea(
  `${pieles.length} pieles × ${objetivos.length} objetivos × ${presupuestos.length} presupuestos ` +
    `× ${ramas.length} ramas × ${tiers.length} tiers`,
);
linea("═".repeat(78));

// 1 · Conflictos
linea();
linea("── CONFLICTOS DE ACTIVOS ".padEnd(78, "─"));
const conteoConflictos = new Map<string, number>();
for (const f of filas) {
  for (const c of new Set(f.conflictos)) {
    conteoConflictos.set(c, (conteoConflictos.get(c) ?? 0) + 1);
  }
}
if (conteoConflictos.size === 0) {
  linea("Ninguno. El catálogo no puede generar una rutina con activos que choquen.");
} else {
  for (const [id, n] of [...conteoConflictos].sort((a, b) => b[1] - a[1])) {
    const [sev, reglaId] = id.split("|");
    linea(`  ${String(n).padStart(4)} rutinas  ${pct(n).padStart(6)}  [${sev}] ${reglaId}`);
  }
}
const limpias = filas.filter((f) => f.conflictos.length === 0).length;
linea();
linea(`  Rutinas sin ningún conflicto: ${limpias} / ${filas.length} (${pct(limpias)})`);
const graves = filas.filter((f) => f.conflictos.some((c) => c.startsWith("separar"))).length;
linea(`  Rutinas con al menos un "separar": ${graves} (${pct(graves)})`);
linea();
linea("  Por tipo de piel — rutinas con al menos un conflicto:");
for (const piel of pieles) {
  const dePiel = filas.filter((f) => f.answers[rec.pielKey] === piel);
  const con = dePiel.filter((f) => f.conflictos.length).length;
  linea(
    `    ${piel.padEnd(10)} ${String(con).padStart(3)}/${String(dePiel.length).padStart(3)} ` +
      `(${((con / dePiel.length) * 100).toFixed(0)}%)`,
  );
}

// 2 · Inventario muerto
linea();
linea("── INVENTARIO ".padEnd(78, "─"));
const alcanzables = new Set(filas.flatMap((f) => f.productos));
const activosDelCatalogo = productos.filter((p) => p.activo);
const muertos = activosDelCatalogo.filter((p) => !alcanzables.has(p.ml_id ?? p.id));
linea(`  Productos activos en el catálogo: ${activosDelCatalogo.length}`);
linea(`  Alcanzables por alguna combinación: ${alcanzables.size}`);
if (muertos.length) {
  linea(`  NUNCA se muestran (${muertos.length}):`);
  for (const p of muertos) {
    linea(`    · ${p.marca} ${p.nombre}`);
    linea(`      categoría ${p.categoria} · momento "${p.momento}" · ${p.ml_id}`);
  }
} else {
  linea("  Todos los productos activos son alcanzables.");
}

// 3 · Cobertura de la capa de activos
linea();
linea("── COBERTURA DE ACTIVOS ".padEnd(78, "─"));
const sinMapa = activosDelCatalogo.filter((p) => !(p.ml_id! in catalogoActivos.porProducto));
const vacios = activosDelCatalogo.filter(
  (p) => (catalogoActivos.porProducto[p.ml_id!] ?? []).length === 0,
);
linea(`  Sin entrada en el mapa: ${sinMapa.length}`);
for (const p of sinMapa) linea(`    · ${p.marca} ${p.nombre} (${p.ml_id})`);
linea(`  Con entrada pero sin activos declarados: ${vacios.length}`);
for (const p of vacios) linea(`    · ${p.marca} ${p.nombre}`);

// Ids de activo referidos por el mapa que no existen en el diccionario.
const huerfanos = new Set<string>();
for (const ids of Object.values(catalogoActivos.porProducto)) {
  for (const id of ids) if (!catalogoActivos.activos[id]) huerfanos.add(id);
}
linea(`  Ids de activo sin definición: ${huerfanos.size ? [...huerfanos].join(", ") : "ninguno"}`);

// 4 · Fallbacks
linea();
linea("── CALIDAD DEL MATCH ".padEnd(78, "─"));
const conteoFallback = new Map<string, number>();
for (const f of filas) {
  for (const fb of f.fallbacks) conteoFallback.set(fb, (conteoFallback.get(fb) ?? 0) + 1);
}
const totalPasos = filas.reduce((a, f) => a + f.totalPasos, 0);
for (const [fb, n] of [...conteoFallback].sort((a, b) => b[1] - a[1])) {
  const marca = fb === "match" ? "✓" : " ";
  linea(`  ${marca} ${String(n).padStart(5)} pasos  ${((n / totalPasos) * 100).toFixed(1).padStart(5)}%  ${fb}`);
}
linea(`  Total de pasos servidos (AM + PM, sin deduplicar): ${totalPasos}`);

// Desglose por tipo de piel: dónde duele el catálogo.
linea();
linea("  Por tipo de piel — pasos que NO son match limpio:");
for (const piel of pieles) {
  const dePiel = filas.filter((f) => f.answers[rec.pielKey] === piel);
  const pasos = dePiel.reduce((a, f) => a + f.totalPasos, 0);
  const noMatch = dePiel.reduce((a, f) => a + f.fallbacks.filter((x) => x !== "match").length, 0);
  const noApto = dePiel.reduce(
    (a, f) => a + f.fallbacks.filter((x) => x === "no_apto_sensible").length,
    0,
  );
  linea(
    `    ${piel.padEnd(10)} ${String(noMatch).padStart(4)}/${String(pasos).padStart(4)} ` +
      `(${((noMatch / pasos) * 100).toFixed(0)}%)` +
      (noApto ? `  · ${noApto} pasos servidos sin ser aptos para piel sensible` : ""),
  );
}

// 5 · Sinergias y mitos
linea();
linea("── SINERGIAS Y MITOS DETECTADOS ".padEnd(78, "─"));
const conteoSinergia = new Map<string, number>();
for (const f of filas) for (const s of new Set(f.sinergias)) conteoSinergia.set(s, (conteoSinergia.get(s) ?? 0) + 1);
for (const [id, n] of [...conteoSinergia].sort((a, b) => b[1] - a[1])) {
  linea(`  ${String(n).padStart(4)} rutinas  ${pct(n).padStart(6)}  sinergia: ${id}`);
}
const conteoMito = new Map<string, number>();
for (const f of filas) for (const m of new Set(f.mitos)) conteoMito.set(m, (conteoMito.get(m) ?? 0) + 1);
for (const [id, n] of [...conteoMito].sort((a, b) => b[1] - a[1])) {
  linea(`  ${String(n).padStart(4)} rutinas  ${pct(n).padStart(6)}  mito: ${id}`);
}

// 6 · Carga irritativa
linea();
linea("── CARGA IRRITATIVA ".padEnd(78, "─"));
const maxPm = Math.max(...filas.map((f) => f.cargaPm));
const peores = filas.filter((f) => f.cargaPm === maxPm);
linea(`  Máxima carga de noche: ${maxPm} · la alcanzan ${peores.length} rutinas`);
linea(`  Rutinas que ameritan calendario semanal: ${filas.filter((f) => f.conPlan).length}`);

// La peor rutina, desarmada: qué productos son y qué activos aporta cada uno.
if (peores.length) {
  const peor = peores[0];
  linea();
  linea(`  La peor, paso por paso — ${peor.etiqueta}:`);
  const resuelta = resolverRutina(config, productos, peor.answers);
  const analisis = analizarRutina(resuelta.rutina, catalogoActivos, clave);
  const vistos = new Set<string>();
  for (const paso of [...resuelta.rutina.am, ...resuelta.rutina.pm]) {
    const k = clave(paso);
    if (vistos.has(k)) continue;
    vistos.add(k);
    const ids = catalogoActivos.porProducto[k] ?? [];
    linea(`    ${paso.slot.categoria.padEnd(18)} ${paso.producto.marca} ${paso.producto.nombre}`);
    linea(`    ${"".padEnd(18)} activos: ${ids.length ? ids.join(", ") : "—"}`);
  }
  linea(`    → conflictos: ${analisis.conflictos.map((c) => c.reglaId).join(", ") || "ninguno"}`);
}

// 7 · Ejemplos concretos de las combinaciones más problemáticas
linea();
linea("── EJEMPLOS ".padEnd(78, "─"));
const conSeparar = filas.filter((f) => f.conflictos.some((c) => c.startsWith("separar")));
for (const f of conSeparar.slice(0, 5)) {
  linea(`  ${f.etiqueta}`);
  for (const c of new Set(f.conflictos)) linea(`      ${c}`);
}
if (!conSeparar.length) {
  const conCuidado = filas.filter((f) => f.conflictos.length);
  for (const f of conCuidado.slice(0, 5)) {
    linea(`  ${f.etiqueta}`);
    for (const c of new Set(f.conflictos)) linea(`      ${c}`);
  }
}

linea();
linea("═".repeat(78));
