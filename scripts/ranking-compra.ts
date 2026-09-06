// Ordena los candidatos de compra por cuántos conflictos destraba cada uno,
// probándolos DE A UNO contra el catálogo proyectado.
//
//   npm run ranking-compra
//
// Comprar los nueve juntos siempre mejora; la pregunta real es cuál primero.
// Corre `huecos-compatibilidad.ts` como subproceso una vez por candidato, más
// una corrida base, y arma la tabla. Es lento a propósito: cada corrida es una
// medición independiente, no una estimación.

import { execFileSync } from "node:child_process";
import { CANDIDATOS_A_COMPRAR } from "./candidatos-compra";

function conflictos(args: string[]): number {
  const salida = execFileSync(
    process.execPath,
    [require.resolve("tsx/cli"), __filename.replace("ranking-compra", "huecos-compatibilidad"), ...args],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  const m = salida.match(/SIN ALTERNATIVA\):\s*(\d+)/);
  return m ? Number(m[1]) : NaN;
}

const base = conflictos(["--proyectar"]);
console.log("═".repeat(78));
console.log("RANKING DE COMPRA · conflictos que destraba cada producto, medido de a uno");
console.log("═".repeat(78));
console.log(`\nBase (catálogo proyectado, sin comprar nada): ${base} conflictos sin alternativa\n`);

const filas = CANDIDATOS_A_COMPRAR.map((c, i) => {
  const n = conflictos(["--proyectar", "--solo", String(i)]);
  return { i, c, restante: n, destraba: base - n };
}).sort((a, b) => b.destraba - a.destraba);

for (const f of filas) {
  const pct = ((f.destraba / base) * 100).toFixed(1);
  console.log(
    `${String(f.destraba).padStart(4)} conflictos  ${pct.padStart(5)}%   ${f.c.producto.nombre}`,
  );
  console.log(`                            categoría: ${f.c.producto.categoria}`);
  console.log(`                            comprar: ${f.c.queBuscar}`);
  console.log();
}

const todos = conflictos(["--proyectar", "--simular"]);
console.log("─".repeat(78));
console.log(`Comprando los ${CANDIDATOS_A_COMPRAR.length}: ${base} → ${todos} conflictos ` +
  `(${(((base - todos) / base) * 100).toFixed(1)}% menos)`);
console.log(
  "La suma de los individuales es mayor que el total porque varios destraban los mismos casos.",
);
console.log();
console.log("─".repeat(78));
console.log("OJO CON CÓMO SE LEE ESTA TABLA");
console.log();
console.log("Mide UNA sola cosa: conflictos de activos que el motor no puede esquivar.");
console.log("Un 0 acá NO quiere decir que el producto no sirva. El protector mineral saca 17,");
console.log("pero es el único que destraba la rutina de piel sensible, que hoy no existe — eso");
console.log("no es un conflicto, es un hueco de cobertura, y se mide con `npm run auditar`.");
console.log();
console.log("Un número NEGATIVO sí es una advertencia real: ese producto EMPEORA la");
console.log("compatibilidad. Sumar otro retinoide a un catálogo que ya tiene tres agrega");
console.log("choques en vez de sacarlos. Si hace falta cubrir ese paso, conviene un activo");
console.log("de otra familia antes que una versión más limpia del mismo.");
