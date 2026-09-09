# El criterio de orden: calidad de fórmula + reputación

> Escrito el 2026-09-06, cuando se codificó la escala A–D. Complementa a
> `INGREDIENTES.md`, que dice cuánta evidencia tiene cada molécula, y a
> `COMPATIBILIDAD.md`, que dice qué se puede mezclar con qué. Éste dice **cómo se
> decide, entre dos productos que sirven igual, cuál se muestra.**

---

## 1 · El problema que había

`INGREDIENTES.md` traía la escala A–D desde el principio, con una regla de la
casa arriba de todo: *en la landing sólo se afirma lo que está en A o B*. Pero la
escala estaba **escrita y no codificada**. El motor no tenía forma de saber qué
era un A y qué era un D, así que la regla no se le podía aplicar a nada.

Mientras tanto el desempate del motor era:

```
prioridad  →  banda de precio  →  precio en pesos
```

Con `preferencia: "mejor"`, "banda de precio" significaba *el más caro que entre
en el presupuesto*. Eso no es un criterio: es un **proxy** de "cuál es mejor",
usado porque no había con qué medir "mejor".

Y cuando los tres empataban —que con el catálogo proyectado pasaba seguido,
porque 45 productos no tienen precio cargado— no quedaba nada. `Array.sort` es
estable, así que **decidía el orden del archivo**. Medido con
`npm run auditar -- --proyectar`: **10 productos aparecían como candidatos y no
ganaban nunca**, entre ellos el SkinCeuticals C E Ferulic. No perdían por peores.
Perdían porque estaban abajo en `productos.ts`.

## 2 · El criterio nuevo

```
prioridad  →  calidad de fórmula  →  respaldo  →  banda de precio  →  id
```

El precio baja al cuarto lugar y pasa a ser lo que siempre fue: un dato sobre el
bolsillo, no sobre el producto. El `id` al final no es decoración: es lo que hace
que el orden no dependa nunca más de dónde alguien pegó un bloque.

**Este mismo orden se usa en la grilla del catálogo** ("nuestro criterio", que es
el orden por omisión). Si el sitio ordenara la grilla por popularidad y la rutina
por criterio, serían dos sitios distintos con la misma marca encima.

## 3 · Cómo se calcula la calidad de fórmula

`src/engine/calidad.ts`. Dos reglas, y las dos salen de la tesis del proyecto.

**Se cuenta una vez por familia.** Cuatro fuentes de niacinamida no son cuatro
beneficios: son la `redundancia` que este mismo motor detecta y avisa. Sin esta
regla gana siempre el que tiene más renglones en el INCI.

**Cada familia siguiente cuenta la mitad que la anterior.** La segunda vale la
mitad, la tercera un cuarto. El descuento es fuerte a propósito.

> Se probó con un descuento más suave —dividir por la posición en vez de por el
> doble— y el resultado desmentía al documento: el **Garnier Anti Manchas**, que
> apila seis familias y trae fragancia, quedaba a **0,15** de la fórmula de
> Pinnell, que `INGREDIENTES.md` §10.1 describe como lo único del catálogo que
> "se puede afirmar sin matices". Con el descuento fuerte la distancia es **0,77**.
> Cuando el número y el criterio escrito no coinciden, el que está mal es el número.

**Los pesos.** A=4 · B=3 · C=1,5 · D=0,5. El salto grande está entre B y C, no
repartido parejo: es la regla de la casa hecha número.

**El lastre.** Fragancia y aceites esenciales restan 1,5; alcohol denat resta 1.
Se multiplican por la **exposición**: 0,25 en algo que se enjuaga, 0,25 para el
alcohol en un protector solar (§9.1: en un protector el alcohol es lo que da la
textura, y un protector que se usa todos los días protege más que uno perfecto en
el cajón), 1 en todo lo demás. La fragancia no recibe esa excepción, porque no
tiene el argumento de la textura.

Ninguna penalización alcanza para hundir una fórmula buena, y está bien: un
producto con un activo A y fragancia (4 − 1,5 = 2,5) sigue arriba de uno impecable
cuyo mejor activo es un C (1,5). Lo que la fragancia hace es **perder los empates**.

## 4 · Qué se midió al encenderlo

Con `npm run auditar` y un script de diferencia que compara el catálogo con y sin
los campos derivados, rutina por rutina, sobre las 360 combinaciones:

| | Catálogo de hoy (25) | Proyectado (71) |
|---|---|---|
| Rutinas que cambian de contenido | 62 · 17,2% | 200 · 55,6% |
| Rutinas sin ningún conflicto | 302 → **300** | 222 → **223** |
| Calidad del match (match limpio) | 63,4% → **63,4%** | — |
| Productos que no gana nunca nadie | 2 → **2** | 10 → **13** |

**Cambios que el documento pedía.** En proyectado, 78 rutinas cambian el
**Garnier Anti-imperfecciones** —la trampa №5 de §10.3, el sérum con más activos
por mililitro— por otro sérum, y 48 cambian el **Mela B3** —niacinamida con
retinil palmitato escondido y fragancia— por el **Kosmos**, que es la fórmula de
Pinnell. Esos dos cambios son el criterio funcionando.

**Costos, sin maquillar.** En proyectado suben todos los avisos de pila:
vitamina C 33 → 45, exfoliante 83 → 85, irritante 87 → 89, niacinamida 15 → 17;
y `vitamina-c-x-acidos` 10 → 17. El mecanismo está identificado y **no es del
puntaje**: `armarRutinaEvitandoConflictos` es voraz y elige en el orden de
`ORDEN_DE_ELECCION`. El hidratante se decide *después* del protector solar, así
que una redundancia que recién aparece cuando entra el hidratante no se podía
esquivar al elegir el protector. Al preferir fórmulas con más activos bien
respaldados, hay más ocasiones de que eso pase. **La palanca, si se quiere
corregir, es subir `nota` por encima de `-prioridad` en el desempate de ese
armado** — que hoy es una decisión tomada y documentada al revés, a propósito.

**El conteo de "no gana nunca nadie" sube, y no es un retroceso.** Antes ese
número estaba inflado por el azar: al no haber criterio, el ganador dependía del
archivo y las victorias se repartían solas. Con un criterio decisivo, el producto
estrictamente mejor respaldado gana siempre, y el que está estrictamente peor no
aparece nunca. Se revisaron los 13 uno por uno: **todos pierden contra un producto
de mejor prioridad o de mejor fórmula**, ninguno por posición en el archivo.

## 5 · Lo que este número **no** mide

Está en el encabezado de `calidad.ts` y conviene repetirlo, porque es la forma más
fácil de usar mal esto:

**El nivel de evidencia es de la molécula, no del producto.** El retinol tiene A;
una crema con retinol al 0,01% en envase transparente no hereda esa A. Casi
ninguna marca declara porcentaje, así que la concentración no se puede puntuar sin
inventarla. Por eso la función se llama `calidadFormula` y no "calidad del
producto", y por eso el puntaje es un **criterio de desempate**, no una nota que
se le muestre a nadie.

El caso concreto donde esto duele: **Kosmos le gana a SkinCeuticals C E Ferulic**
(7,13 contra 6,63), porque replica el trío C + E + ferúlico y encima suma
ceramida. Por composición está bien. Lo que el puntaje no ve es que la fórmula del
paper es 15% de ascórbico, 1% de E y 0,5% de ferúlico, y que ninguna de las dos
marcas está obligada a declarar el porcentaje. Hay un test que fija ese resultado
justamente para que, si algún día se verifica la concentración, duela ahí.

**Tres limitaciones más, conocidas:**

1. **Los filtros solares se aplastan.** `filtro_quimico`, `filtro_mineral`,
   `filtro_avobenzona` y `filtro_uva_400` comparten `familia: "filtro"`, así que
   cuentan una sola vez. La ventaja del **Mexoryl 400** —que §8.2 llama lo mejor
   del catálogo— es invisible para el puntaje. No se arregló acá porque ya está
   cubierta en otro lado: la sinergia `uva400-x-manchas` la muestra en la rutina,
   y los tres Anthelios ya tienen `prioridad: 5`.
2. **Un limpiador minimalista queda mal parado.** El Idraet Espuma Extra Suave
   tiene la lista de activos vacía **a propósito** —"un limpiador que se enjuaga
   no es el lugar para poner activos"— y por eso puntúa 0 y pierde 90 rutinas en
   proyectado. El puntaje mide con qué está hecho un producto, y para un limpiador
   eso es un proxy flojo. La palanca sigue siendo `prioridad`.
3. **"Verificamos y no tiene" y "no verificamos" puntúan igual.** Los dos quedan
   en 0 porque el mapa de activos no los distingue. Es una carencia del dato, no
   del cálculo, y arreglarla es cambiar la forma de `ACTIVOS_POR_PRODUCTO`.

## 6 · Los candados

- `activos.test.ts` — todo activo declara nivel **o** está en
  `SIN_NIVEL_DE_EVIDENCIA` con un motivo escrito. Un activo nuevo sin grado rompe
  el build en vez de contarse como cero en silencio. Además fija 25 grados contra
  las secciones de `INGREDIENTES.md` que los sostienen.
- `calidad.test.ts` (engine) — la forma del cálculo: dedup por familia, descuento
  a la mitad, el lastre resta pero no hunde, apilar familias flojas nunca alcanza
  a un solo activo A.
- `calidad.test.ts` (nicho) — los casos del catálogo real, incluido el de Kosmos.
- `recomendacion.test.ts` — el orden: la calidad gana al precio, la prioridad gana
  a la calidad, y con todo empatado el resultado no depende del orden del archivo.

## 7 · Dónde mirar los números

```bash
npm run auditar                  # incluye la tabla de calidad por categoría
npm run auditar -- --proyectar   # lo mismo con los 71 activos
```
