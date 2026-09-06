# Club de Piel — carpeta de proyecto

Todo lo que hay que saber para trabajar en Club de Piel, listo para cargar como
proyecto de Claude.

## Cómo usarla

**`00-INSTRUCCIONES.md`** va pegado en el campo **Instrucciones del proyecto**.
Es corto a propósito: son las reglas de cómo trabajar, no la documentación.

**Los otros seis** se suben como **conocimiento del proyecto**.

## Qué hay en cada uno

| Archivo | Qué responde |
|---|---|
| `00-INSTRUCCIONES.md` | Cómo trabajar. Reglas duras. Qué chequear antes de dar algo por terminado |
| `01-NEGOCIO.md` | Qué es Club de Piel, cómo entra la plata, canales, qué medir |
| `02-MARCA.md` | Lectura de marca, paleta con contrastes, tipografía, logo, voz, qué está prohibido escribir |
| `03-PRODUCTO.md` | Arquitectura: tres puertas, rutas, tiers, el motor, el quiz, kits |
| `04-CATALOGO.md` | Estado del catálogo, forma de un producto, huecos, el pipeline de Alex |
| `05-TECNICO.md` | Stack, estructura, scripts, env vars, convenciones, trampas conocidas |
| `06-ESTADO.md` | Dónde estamos, bloqueantes, decisiones tomadas, errores ya cometidos |

## Los dos más importantes

Si sólo se leen dos, que sean estos:

**`06-ESTADO.md`** tiene dos secciones que evitan repetir trabajo: *Decisiones
tomadas* (para no reabrir lo que ya se discutió) y *Errores que ya se cometieron*
(para no volver a pisarlos).

**`02-MARCA.md`** tiene la lista de lo que no se puede escribir. La voz es la
parte más fácil de arruinar y la más difícil de recuperar.

## Lo que no está acá

El código. Vive en el repo, y los archivos que más explican son:

- `src/niches/skincare/productos.ts` — el catálogo
- `src/niches/skincare/config.ts` — tiers, categorías, quiz
- `src/engine/recomendacion.ts` — el motor
- `src/niches/skincare/copy.ts` — todos los textos

---

_Corte: 2026-09-05._ Los números de `06-ESTADO.md` envejecen: si algo no
coincide con el repo, manda el repo.
