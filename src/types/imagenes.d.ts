// Los tipos de los imports de imágenes: `import foto from "@/assets/home/x.jpg"`.
//
// Next los declara en `next-env.d.ts`, pero ese archivo lo genera `next dev` o
// `next build` y no se commitea. En CI, `npm test` corre `tsc` antes del build,
// así que ahí no existía y los imports de `src/assets/home/` fallaban con TS2307
// (PR #35). En una máquina que ya corrió el server de desarrollo no se nota. Esta
// referencia hace que los tipos no dependan de ese orden.
/// <reference types="next/image-types/global" />
