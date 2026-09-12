# Estado y pendientes

_Corte: 2026-09-12. Todo lo de acá está medido contra `main` ese día, no de
memoria. El corte anterior era del 6/9 y había quedado viejo en casi todos los
números: decía 69 páginas, 56 tests y 46 links pendientes._

> El detalle de esta línea de trabajo —qué cambió, qué trampas aparecieron y cómo
> se mide— está en `docs/HANDOFF.md`. Acá queda el estado y las decisiones.

## Dónde está

| | |
|---|---|
| Producción | `clubdepiel.store` |
| Páginas estáticas | 175 |
| Productos en catálogo | 79 · 78 activos, más 2 kits de compra única |
| De esos, en el motor | 57 · los otros 21 están con `en_rutina: false` |
| Links que monetizan | 81 de 81 · 0 pendientes · todos declaran `maurobilat` |
| Tests | 132 en verde, en 15 archivos |
| Rutinas sin ningún conflicto | 344 de 360 (95,6 %) · 0 con severidad "separar" |
| Activos con fuente verificada | 73 de 79 entradas |
| Tiers servibles | 1 y 2 (son los dos que existen) |

## Bloqueantes para salir a vender

**1 · Tracking apagado.** Sin las variables de Supabase en producción, cada clic,
sesión y email se descarta en silencio. Hoy se lanzaría a ciegas. El
procedimiento completo —migraciones, `npm run sync`, variables en Production y
redeploy, y cómo comprobar que quedó prendido— está en `docs/HANDOFF.md` §5, con
el orden que hay que respetar. Es el primero de la lista.

> Consecuencia a tener presente: una vez que Supabase sirva el catálogo, cada
> cambio de catálogo necesita `npm run sync` o producción queda atrasada.

**2 · El check de Vercel falla en todos los PR.** No es código: el log dice *"Git
author WomenAre0bjects must have access to the project on Vercel to create
deployments"*. Es permisos y lo gestiona Ian. Viene fallando desde antes de esta
línea de trabajo, así que no sirve como señal de nada — la señal es el workflow
`verificar`, que corre tipos, tests, build, links y auditoría de cuentas.

**3 · Escudo anti-bots de Vercel.** Se disparó haciendo polling con curl. Los
navegadores lo pasan transparente, pero el crawler de Pinterest es un bot y
podría comérselo — y ahí el preview del pin sale vacío. Revisar Vercel →
Settings → Firewall antes de mandar la URL a Pinterest.

**4 · Perfil business de Pinterest.** Falta crearlo y reclamar el dominio. El
meta `p:domain_verify` ya está cableado: se pega el código en
`NEXT_PUBLIC_PINTEREST_VERIFY` y listo, sin tocar código.

> Los Medios ya están declarados en la cuenta de afiliados: sitio, Instagram,
> TikTok, YouTube, Pinterest y X. Facebook se descartó por decisión.

## Pendiente de UX

**Sistema visual.** La paleta y el logo ya están; falta la pasada de jerarquía,
espaciado y densidad para competir en un feed de Pinterest.

**Mockups** para Pinterest, TikTok, YouTube e Instagram. Las fotos en alta están
en `assets/productos/`.

> Aviso para los mockups: las fotos van de 176×979 a 1200×1185 según el producto.
> Para Pinterest (2:3, 1000×1500) **casi ninguna da el alto sola** — van a
> necesitar fondo o composición. Son fotos de producto sobre blanco.

**El carrusel y la prueba social del above the fold.** Necesita producción de
fotos y las respuestas de clientas a "¿qué casi te frena?".

## Pendiente de catálogo

Lo que está medido y con especificación de qué comprar está en `docs/COMPRAR.md`.
Acá va lo que no es una compra:

- **6 entradas de activos sin verificar de 79.** Ninguna se puede cerrar a
  distancia: necesitan el envase en la mano o migrar la entrada a una ficha
  `/p/`. La lista y el motivo de cada una están en `docs/AUDITORIA-PRODUCTOS.md`.
  Empezar por el **ISDIN Ureadin Fusion**, que es el que más cambia si está mal:
  el mapeo declara ácido láctico y vitamina C pura que no aparecen en la parte
  visible del INCI.
- **9 productos atados a un solo vendedor** (`docs/listados-atados.md`).
  Necesitan links nuevos generados desde la ficha `/p/`.
- **El vault y el catálogo divergieron.** 5 `ml_id` activos no existen en los
  `.md` de Obsidian, así que `npm run importar-organize` aborta a propósito.
- **El diccionario no puede nombrar la mayoría de los aceites esenciales.** Modela
  tres —tea tree, romero y menta— y los demás no tienen id al que apuntar, así
  que el motor no los ve: el Round Lab Dokdo trae aceite de flor de manzanilla y
  el aceite limpiador de Beauty of Joseon trae salvia, artemisa, albahaca y
  alcanfor, y las dos fórmulas le parecen limpias. Agregar un `aceite_esencial`
  genérico está descartado (ver *no reabrir*), así que la salida es darle id a
  los que aparezcan de verdad. Es la única decisión de criterio que la auditoría
  dejó abierta.

### Lo que estaba acá y ya no hace falta

Se verificó el 12/9 que estas cuatro se cerraron, para que nadie las vuelva a
poner en la lista:

- ~~9 productos sin link de afiliado~~ → hoy son 0. `npm run links-pendientes`
  sale limpio.
- ~~46 links por generar~~ → ese número venía del corte del 6/9 y ya no existía.
- ~~Falta un protector solar mineral~~ → hay uno (Haruharu Wonder Black Rice Pure
  Mineral) y 5 protectores aptos para sensible dentro del motor.
- ~~Falta un producto barato~~ → parcialmente. Hay 6 limpiadores en banda 1, 4 de
  ellos dentro del motor y todos aptos para sensible. Protectores en banda 1 hay
  2, pero sólo 1 está en el motor —el NIVEA Anti-Brillo— y no es apto para
  sensible. Eso último ya no degrada ninguna recomendación, porque el
  presupuesto cede ante la piel; el detalle está en `docs/COMPRAR.md`.

## Decisiones tomadas — no reabrir

Esto ya se discutió y se decidió. Si algo lo contradice, es un error, no una
propuesta.

| Decisión | Por qué |
|---|---|
| **Lectura botánica**, no clínica ni de lujo | La decide el catálogo: centella, arroz, ginseng, caracol |
| **Los protectores coreanos van aptos para sensible** | Verificado contra las páginas de los fabricantes. Excepción consciente a la regla del vault |
| **El exfoliante sale de las rutinas** | Suma costo, riesgo y un paso, para un beneficio que no justifica la fricción |
| **Los tiers son 2, no 4** | Medido: el Tier 4 sumaba tres pasos, cero puntos de cobertura y 13× el costo |
| **El tónico y la doble limpieza no son pasos de la rutina** | Misma medición. Siguen en el catálogo como opcionales, con la explicación de por qué quedaron afuera |
| **La pregunta de origen se queda, pero sólo elige marca** | Cuando el tónico era un paso, responder "no quiero coreanos" lo sacaba. Ya no cambia la forma de la rutina, sólo qué marca toca en cada paso |
| **El glicólico de The Ordinary es exfoliante, no tónico** | ML lo vende como "tónico exfoliante", pero es un AHA leave-on. En el slot de tónico diría de usarlo dos veces por día |
| **Presupuesto cualitativo, no en pesos** | Los montos fijos quedan viejos solos y pasan a mentir |
| **El quiz es una puerta, no el default** | Pinterest es un canal de browse |
| **`/combinaciones` va en el pie** | Nadie llega de una red social buscando combinaciones de activos |
| **Rating sólo con 10+ opiniones** | Tres productos tienen 5,0 con una sola opinión |
| **Nada de scraping a Mercado Libre** | Obligación (e) del Programa de Afiliados. La cuenta de cada link **se declara** al cargarlo y el script sólo audita. La API oficial con OAuth sí: es acceso autorizado por otro acuerdo |
| **La popularidad no clasifica ni ordena** | Las ventas no miden la calidad de una fórmula. Se retiraron las etiquetas "muy probado / probado / poca prueba" y el desempate por respaldo. El rating y las ventas quedan como dato atribuido a ML |
| **Un producto entra por su fórmula, no por sus ventas** | Ver `04-CATALOGO.md` § *Antes de cargarlo* |
| **El presupuesto cede ante la piel y el objetivo** | Hay pasos que no existen en banda accesible; dar algo que no sirve para ahorrar es peor. Antes era al revés y se relajaba `apto_sensible` |
| **`tipos_piel` orienta, `apto_sensible` veta** | El primero dice para qué piel está pensado el producto; el segundo es el único que filtra en el motor y el único que puede vetar, y sólo por fórmula. Pueden discrepar, y discrepan a propósito en tres productos |
| **No se agrega un `aceite_esencial` genérico** | Cambiaría varios productos de una vez y afecta al cálculo de lastre. Los que tienen id propio —tea tree, romero, menta— sí se declaran |
| **La fragancia veta `apto_sensible`** | El diccionario ya la define como "primera causa de dermatitis de contacto alérgica en cosmética", y de los 8 productos del motor que la declaran, 6 ya estaban cargados como no aptos: los 2 que faltaban eran la excepción, no otra política. NACDG 2019-2020: mezcla de fragancias I en 12,8% de parches positivos, hidroperóxidos de linalol en 11,1%. Vale para enjuague también: el catálogo tiene 13 limpiadores aptos sin fragancia, así que evitarla no cuesta nada |
| **Un extracto de hoja no es su aceite esencial** | Un id de aceite esencial es para un ACEITE que el INCI nombre. Es la regla que el mapa ya seguía en sus otras tres entradas, y el diccionario ya distingue por forma y no por planta: `hamamelis` tiene carga 0 porque "como agua o extracto sin alcohol es inofensivo". El CIR da HRIPT negativo para 2,5% de extracto de menta, y los casos publicados son del aceite |
| **Sumar sin quitar** | Un activo se quita sólo cuando la fuente oficial demuestra su ausencia |
| **Un conflicto que se arregla con una instrucción no baja la calidad de match** | "Retinoide y ácido la misma noche" se resuelve con "noches alternas", y el sitio ya genera el calendario noche por noche. Bajar de nivel le costaría a la persona el producto que vino a buscar, y el calendario le aparece igual. Sólo se baja ante un choque sin instrucción posible, como "dos retinoides: quedate con uno" |
| **El logo se adopta tal cual** (arcos concéntricos) | Decisión de Ian sobre la propuesta de Alex |
| **"Tu piel, sin vueltas" se descarta** | Cliché de skincare |

## Errores que ya se cometieron

Para no repetirlos:

**Links que no monetizan.** Pasó dos veces: en el vault de Obsidian y en el
`products.json` de Alex. Una URL de browse funciona igual y no paga nada, sin
ninguna señal. De ahí salió `check-links`.

**Ofrecer tiers sin catálogo.** Habilitar los 4 tiers cuando el catálogo sólo
podía servir uno daba "Application error" apenas la persona respondía. De ahí
salió `configServible()`.

**Contraste roto en lo que más importa.** El texto secundario estaba en 2,12:1 y
el botón de compra en 3,13:1. Cualquier color nuevo se mide antes de entrar.

**Kits todos iguales.** Los productos universales tenían prioridad más alta que
los específicos, así que los cinco kits daban el mismo resultado. El especialista
tiene que ganarle al comodín en su terreno.

**Números hardcodeados en el copy.** "4 preguntas" quedó viejo cuando entró la
rama coreana, y "5 preguntas" cuando se colapsaron los tiers. Dos veces el mismo
error. Ahora sale de `configServible()`.

**Un merge de git "exitoso" que produce texto mentiroso.** Al integrar la rama de
Alex, `config.ts` se auto-mergeó sin marcar conflicto: quedaron sus tiers (sin
tónico) junto con la rama coreana intacta, así que el quiz prometía "suma el
tónico" cuando ningún tier lo tenía. Que git no marque conflicto no significa que
el resultado tenga sentido.

**Una lista de activos vacía leída como "no tiene nada".** `Cleanex Free Gel`
tenía la lista vacía y el comentario "no verificado". El motor lo trató como
limpio en 36 rutinas y el INCI decía que traía fragancia. Conocimiento y ausencia
de conocimiento se ven idénticos en el código y son opuestos. De ahí salieron los
marcadores `[INCI]` / `[vault]` / `[pendiente]` y `fuente-activos.test.ts`.

**La prosa y el dato diciendo cosas opuestas, y ganando el dato.** El mapeo de
activos del COSRX Low pH decía por escrito que el tea tree "lo saca de las
rutinas de piel sensible", pero el producto seguía cargado `apto_sensible: true`
y el motor se lo servía a piel sensible igual. Un comentario no es un candado: de
ahí salió `apto-sensible.test.ts`.

**Números de estado copiados de la rama equivocada.** El handoff daba como estado
de `main` los números medidos en la rama de un PR sin mergear, y así entraron un
344/360 y un 73/79 que `main` todavía no tenía. Cada número de un documento de
estado tiene que decir sobre qué commit se midió.

**Contar el catálogo grepeando un solo archivo.** El catálogo es `productos.ts`
**más** `productos.organize.ts`, y el primero solo tiene 34 de los 81 ítems. De
ahí salió un "73 links" que estuvo escrito en dos documentos.

**Disparar el escudo de Vercel con polling.** Ver bloqueante 3.

**`git checkout <archivo>` sobre cambios sin stagear los borra.** Pasó al querer
revertir un experimento de una línea: se perdió el archivo entero de ediciones.
Antes de cualquier experimento destructivo, commitear.

## Lo próximo

1. **Prender el tracking** (bloqueante 1). Es lo único que frena lanzar con
   medición.
2. **Leer el envase de los 6 productos** que quedan sin verificar, empezando por
   el ISDIN.
3. **Las dos compras de `COMPRAR.md`**, que están especificadas activo por activo.
4. **Los 9 listados atados a un solo vendedor.**
5. **2 vulnerabilidades moderadas** de `vitest`, sólo de desarrollo. El arreglo
   pide vitest 5, que es un salto mayor.
6. **UX**: sistema visual, mockups, carrusel y prueba social.
