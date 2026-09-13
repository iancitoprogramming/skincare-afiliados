// Verbos y frases que un producto cosmético de venta libre no puede sostener.
//
// El filtro de claims médicos es una decisión documentada (ISSUES.md §I8). Vive
// en un módulo propio y no adentro de `scripts/copy-verificar.ts` por una razón
// práctica: ese script corre de arriba abajo al cargarse, así que un test no lo
// puede importar sin ejecutarlo. Con la lista acá, el script la usa para el copy
// de producto y `copy-pasos.test.ts` para el copy de cada paso de la rutina.
//
// Ojo con "tratamiento": el quiz tiene una opción que dice "Sumale un
// tratamiento" desde antes de este filtro. Quedó así; el copy nuevo no la usa.
export const PROHIBIDAS: [RegExp, string][] = [
  [/\bcur[ao]r?\b|\bcura\b/i, "promete curar"],
  [/\btrat(a|ar|amiento)\b/i, "dice tratar: es lenguaje médico"],
  [/\belimin(a|ar)\b/i, "promete eliminar"],
  [/\brepar(a|ar)\b/i, "promete reparar"],
  [/\brevierte\b/i, "promete revertir"],
  [/\bdesinflama\b|\bantiinflamatorio\b/i, "claim antiinflamatorio"],
  [/\bcl[ií]nicamente (comprobado|probado)\b/i, "claim clínico sin fuente"],
  [/\bgarantiza\b/i, "garantía de resultado"],
  [/\bmilagro/i, "lenguaje de milagro"],
  [/en \d+ (d[ií]as|semanas|meses)/i, "promesa de resultado con plazo"],
];
