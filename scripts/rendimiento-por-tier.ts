// ¿Qué aporta cada paso que se suma por encima de la base?
//
//   npm run rendimiento
//   npm run rendimiento -- --proyectar
//
// ─────────────────────────────────────────────────────────────────────────────
// LA PREGUNTA
//
// La base de una rutina son tres pasos: limpiador, hidratante y protector solar.
// Todo lo demás es opcional. Pero "opcional" no significa "gratis": cada paso
// que se suma trae activos nuevos, y esos activos pueden chocar entre sí. Para
// un sitio que recomienda, la pregunta no es cuántos pasos se pueden ofrecer
// sino a partir de cuál se empieza a perder.
//
// Este script compara los cuatro tiers en cuatro ejes, sobre las mismas
// respuestas:
//
//   1. ¿Cubre el objetivo que la persona eligió? — el único eje que mide si la
//      rutina sirve para lo que la persona vino a buscar.
//   2. ¿Cuántos activos NUEVOS aporta respecto del tier anterior?
//   3. ¿Cuántos conflictos introduce?
//   4. ¿Cuánto sale?
//
// Un paso que no mejora el eje 1 pero empeora el 3 y el 4 es un paso que le
// estamos vendiendo a alguien sin darle nada a cambio.

import { skincareQuiz } from "../src/niches/skincare/config";
import { productos as catalogoBase } from "../src/niches/skincare/productos";
import { catalogoActivos } from "../src/niches/skincare/activos";
import { configServible } from "../src/engine/quiz/servible";
import { resolverRutina } from "../src/engine/quiz/armar";
import { analizarRutina } from "../src/engine/compatibilidad";
import type { Answers } from "../src/engine/quiz/types";
import type { PasoRutina } from "../src/engine/recomendacion";

const PROYECTAR = process.argv.includes("--proyectar");
const clave = (p: PasoRutina) => p.producto.ml_id ?? p.producto.id;
const catalogo = PROYECTAR ? catalogoBase.map((p) => ({ ...p, activo: true })) : catalogoBase;
const config = configServible(skincareQuiz, catalogo);
const rec = config.recomendacion;
const valoresDe = (k: string) => config.questions.find((q) => q.urlKey === k)?.options.map((o) => o.value) ?? [];
const tiers = valoresDe(rec.rutinaKey).length ? valoresDe(rec.rutinaKey) : [rec.variantePorDefecto ?? "1"];

interface Medicion {
  tier: string;
  pasos: number;
  cubreObjetivo: boolean;
  activos: Set<string>;
  conflictos: number;
  graves: number;
  precio: number;
  conPrecio: boolean;
}

const porTier = new Map<string, Medicion[]>();

for (const piel of valoresDe(rec.pielKey)) {
  for (const objetivo of valoresDe(rec.objetivoKey)) {
    for (const presupuesto of valoresDe(rec.presupuestoKey)) {
      for (const ramaValor of rec.rama ? valoresDe(rec.rama.key) : [""]) {
        for (const tier of tiers) {
          const answers: Answers = {
            [rec.pielKey]: piel,
            [rec.objetivoKey]: objetivo,
            [rec.presupuestoKey]: presupuesto,
            [rec.rutinaKey]: tier,
          };
          if (rec.rama && ramaValor) answers[rec.rama.key] = ramaValor;

          let resuelta;
          try {
            resuelta = resolverRutina(config, catalogo, answers);
          } catch {
            continue;
          }
          const pasosUnicos = [
            ...new Map(
              [...resuelta.rutina.am, ...resuelta.rutina.pm].map((p) => [clave(p), p]),
            ).values(),
          ];
          const a = analizarRutina(resuelta.rutina, catalogoActivos, clave);

          const precios = pasosUnicos.map((p) => p.producto.precio_ars ?? 0);
          porTier.set(resuelta.variante, [
            ...(porTier.get(resuelta.variante) ?? []),
            {
              tier: resuelta.variante,
              pasos: pasosUnicos.length,
              // "Cubre el objetivo" = hay al menos un producto cuya lista de
              // preocupaciones incluye lo que la persona eligió. Es el test más
              // simple de "esta rutina sirve para lo que viniste a buscar".
              cubreObjetivo: pasosUnicos.some((p) => p.producto.preocupaciones.includes(objetivo)),
              activos: new Set(pasosUnicos.flatMap((p) => catalogoActivos.porProducto[clave(p)] ?? [])),
              conflictos: a.conflictos.length,
              graves: a.conflictos.filter((c) => c.severidad === "separar").length,
              precio: precios.reduce((x, y) => x + y, 0),
              conPrecio: precios.every((x) => x > 0),
            },
          ]);
        }
      }
    }
  }
}

const prom = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const L = (s = "") => console.log(s);

L("═".repeat(78));
L(`RENDIMIENTO POR TIER · ${PROYECTAR ? "catálogo proyectado" : "catálogo de hoy"}`);
L("═".repeat(78));
L();
L("  tier  pasos   cubre obj.   activos   conflictos   graves   precio prom.");
L("  " + "─".repeat(72));

const claves = [...porTier.keys()].sort();
const resumen: { tier: string; pasos: number; cubre: number; activos: number; conf: number; graves: number; precio: number }[] = [];

for (const t of claves) {
  const ms = porTier.get(t)!;
  const cubre = (ms.filter((m) => m.cubreObjetivo).length / ms.length) * 100;
  const activos = prom(ms.map((m) => m.activos.size));
  const conf = prom(ms.map((m) => m.conflictos));
  const graves = prom(ms.map((m) => m.graves));
  const conPrecio = ms.filter((m) => m.conPrecio);
  const precio = prom(conPrecio.map((m) => m.precio));
  resumen.push({ tier: t, pasos: prom(ms.map((m) => m.pasos)), cubre, activos, conf, graves, precio });
  L(
    `   T${t}   ${prom(ms.map((m) => m.pasos)).toFixed(1).padStart(4)}   ` +
      `${cubre.toFixed(0).padStart(8)}%   ${activos.toFixed(1).padStart(6)}   ` +
      `${conf.toFixed(2).padStart(9)}   ${graves.toFixed(2).padStart(6)}   ` +
      `${precio ? "$" + Math.round(precio).toLocaleString("es-AR") : "—"}`,
  );
}

// ── Lo marginal: qué agrega cada escalón respecto del anterior ───────────────
L();
L("── QUÉ AGREGA CADA ESCALÓN RESPECTO DEL ANTERIOR ".padEnd(78, "─"));
L();
for (let i = 1; i < resumen.length; i++) {
  const a = resumen[i - 1];
  const b = resumen[i];
  const dCubre = b.cubre - a.cubre;
  const dConf = b.conf - a.conf;
  const dPrecio = b.precio && a.precio ? b.precio - a.precio : 0;
  L(`  T${a.tier} → T${b.tier}   (+${(b.pasos - a.pasos).toFixed(1)} pasos)`);
  L(`     cobertura del objetivo: ${dCubre >= 0 ? "+" : ""}${dCubre.toFixed(0)} puntos`);
  L(`     conflictos por rutina:  ${dConf >= 0 ? "+" : ""}${dConf.toFixed(2)}`);
  L(`     activos distintos:      +${(b.activos - a.activos).toFixed(1)}`);
  if (dPrecio) L(`     costo:                  +$${Math.round(dPrecio).toLocaleString("es-AR")}`);
  const veredicto =
    dCubre <= 0.5 && dConf > 0
      ? "  ⚠️  no mejora lo que la persona pidió y suma conflictos"
      : dCubre > 5
        ? "  ✓ mejora la cobertura de forma real"
        : "  · aporta poco";
  L(`    ${veredicto}`);
  L();
}

// ── El dato que decide ──────────────────────────────────────────────────────
L("── ¿HAY ALGÚN CASO EN QUE LOS PASOS EXTRA CUBRAN ALGO QUE LA BASE NO? ".padEnd(78, "─"));
const t1 = porTier.get("1") ?? [];
const cubreT1 = (t1.filter((m) => m.cubreObjetivo).length / (t1.length || 1)) * 100;
L();
L(`  Tier 1 (los 3 pasos esenciales) ya cubre el objetivo en el ${cubreT1.toFixed(0)}% de los casos.`);
for (const r of resumen.slice(1)) {
  const delta = r.cubre - cubreT1;
  L(
    `  Tier ${r.tier}: ${r.cubre.toFixed(0)}% · ${delta > 0.5 ? `+${delta.toFixed(0)} puntos por ${(r.pasos - resumen[0].pasos).toFixed(0)} pasos más` : "no mejora la cobertura"}` +
      ` · ${(r.conf / (resumen[0].conf || 1)).toFixed(1)}× los conflictos de la base`,
  );
}
L();
L("═".repeat(78));
