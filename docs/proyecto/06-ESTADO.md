# Estado y pendientes

_Corte: 2026-09-16. Todo lo de acá está medido contra `main` (`5e6771b`, último
merge el #46) más el PR #47, que es el único abierto, y contra Supabase y Vercel
ese día. Lo que no se volvió a medir, lo dice. El corte anterior era del 12/9 y
había quedado viejo en lo que más importaba: decía que el tracking estaba apagado
y que faltaba el perfil de Pinterest, y las dos cosas ya estaban hechas._

> El detalle de la línea de trabajo del 12/9 al 16/9 —qué cambió, qué trampas
> aparecieron y cómo se mide— está en `docs/HANDOFF.md`. El punto de partida de
> la campaña está en `08-MARKETING.md`. Acá queda el estado y las decisiones.

## Dónde está

| | |
|---|---|
| Producción | `clubdepiel.store` · Vercel, plan hobby |
| Páginas estáticas | 175 |
| Productos en catálogo | 79 · 78 activos · 48 europeos, 19 coreanos, 11 nacionales |
| De esos, en el motor | 57 · los otros 21 están con `en_rutina: false` |
| Kits | 7 · 2 de compra única (un link, un pago) y 5 armados por nosotros |
| Links que monetizan | 81 de 81 · 0 pendientes · todos declaran `maurobilat` |
| Tests | 199 en verde, en 27 archivos, con el #47 · `main` tiene 189 en 26 |
| Rutinas sin ningún conflicto | 344 de 360 (95,6 %) · 0 con severidad "separar" |
| Activos con fuente verificada | 73 de 79 entradas · 6 pendientes |
| Catálogo en producción | Al día: `npm run sync` el 16/9, `npm run comparar` da 0 cambios |
| Tracking (Supabase) | **Prendido desde el 12/9 a la noche.** Al 16/9: 8 sesiones, 11 clics, 2 correos |
| Vercel Analytics | Prendido. El 16/9: 15 visitantes, 60 páginas vistas |
| Correo | Resend desde `hola@clubdepiel.store`; se pide sólo en el resultado del quiz |
| Redes | Pinterest business con dominio verificado · Instagram, TikTok y YouTube creadas · X sin handle · Facebook descartado |

Los números del catálogo, los links, las rutinas y los activos son los mismos del
15/9: el #46 es documentación y el #47 es medición, ninguno toca el catálogo.

## Lo que frenaba y ya no

Los cuatro bloqueantes del corte anterior, con lo que pasó con cada uno. Quedan
escritos para que nadie los vuelva a poner en la lista.

**1 · ~~Tracking apagado~~ → prendido.** Las variables de Supabase están en
Production y las tres tablas reciben: sesiones al completar el quiz, clics a
Mercado Libre, correos. Lo que sí estaba roto, y nadie había probado de punta a
punta, era **la atribución por `utm`**: el quiz reescribe la URL con las
respuestas al elegir la primera, y al terminar ya no quedaba `utm` que leer. Las
8 sesiones tenían `utm = null`. El #47 lo arregla guardando la entrada de la
visita (`utm_*`, página, referrer) en la pestaña, y la lleva también a cada clic,
que antes salía sin nada desde `/producto` y `/kits`. Ver `05-TECNICO.md`.

> Consecuencia que sigue vigente: producción lee el catálogo de Supabase, así que
> cada cambio de catálogo necesita `npm run comparar` y `npm run sync` desde la
> máquina de Ian, o producción queda atrasada.

**2 · ~~El check de Vercel falla en todos los PR~~ → resuelto el 12/9.** Vercel
sólo deploya commits cuyo autor tiene acceso al proyecto. Desde el #22 los
commits salen con `iancitoprogramming`; la cuenta de Alex es `ExtremeImagery` y
quedó probada mergeando del #37 al #41. **Si un commit sale con otra identidad,
producción deja de publicarse sin avisar** (pasó del #14 al #21).

**3 · Escudo anti-bots de Vercel → sigue, y hay que tenerlo presente.** Se
disparó una vez haciendo polling con curl. El crawler de Pinterest pasó —el
dominio quedó verificado—, pero la regla no cambia: nada de tráfico automatizado
propio contra `clubdepiel.store`. Las herramientas de preview de cada red pasan;
un script nuestro, no.

**4 · ~~Perfil business de Pinterest~~ → creado, con el dominio verificado**
contra `clubdepiel.store` (`pinterest.com/ClubDePiel`). El `p:domain_verify`
está en `NEXT_PUBLIC_PINTEREST_VERIFY`; el log del build lo dice.

## Lo que hay que decidir

Tres decisiones de Ian que frenan cosas concretas. Ninguna se toma sola.

1. **Pinterest Tag: prenderlo o no.** Está cableado detrás de
   `NEXT_PUBLIC_PINTEREST_TAG_ID` (#47) y sin la variable no carga nada. Con él,
   Pinterest ve qué pasa después del clic —página vista, correo guardado, clic a
   Mercado Libre— y lo atribuye al pin; sin él, sólo ve el clic de salida. Es el
   **primer tercero con cookies** que entraría al sitio (Vercel Analytics no
   usa). El id sale del perfil business: Anuncios → Conversiones → Pinterest Tag.
2. **La imagen 2:3 para Pinterest.** La de compartir sigue en 1200×630, que es lo
   que usan WhatsApp y Facebook. Ofrecerle otra a Pinterest sin cambiar la de las
   demás redes exige cargar su script `pinit.js`: es sumar otro tercero. Hoy, al
   pinear, la persona elige entre las imágenes de la página. Detalle en
   `docs/HANDOFF.md` §6.2.
3. **X.** Está declarada como Medio en la cuenta de afiliados pero no tiene
   handle. O se crea y se usa, o se deja.

## Pendiente de UX

**Hecho del 13/9 al 16/9:** el resultado explica cada paso antes del producto,
"ya tengo uno" por paso, hasta dos alternativas chequeadas contra la rutina
(#23+); la home editorial con el lenguaje de Beauty of Joseon (#35) y el resto del
sitio detrás (#37), la imagen para compartir (#38) y el mail de bienvenida (#40)
con el mismo lenguaje; el correo se pide en un solo lugar, el resultado del quiz
(#43). Desde el 15/9 **la dirección visual la lleva Alex**, con el brand kit en
Canva.

Lo que queda:

- **Fotos propias de ingredientes.** Centella, ginseng o arroz recortados sobre
  blanco, como en la página de ingredientes de Beauty of Joseon. En los bancos
  libres no hay con esa calidad: es una producción o una compra.
- **Las preguntas frecuentes de la home son hipótesis.** Se reescriben cuando
  haya respuestas reales de clientas a "¿qué casi te frena?". La campaña es la
  forma de conseguirlas.
- **Los textos de "por qué esta pregunta" del quiz** son borrador de Ian.
- **Mockups** para Pinterest, TikTok, YouTube e Instagram, con Alex. Las fotos de
  producto están en `assets/productos/`, sobre blanco, de 176×979 a 1200×1185:
  para el 2:3 de Pinterest casi ninguna da el alto sola, necesitan fondo o
  composición.
- **Carrusel y prueba social propia.** No hay fotos de piel real, testimonios ni
  reseñas propias; la única prueba social es la de Mercado Libre, con fecha de
  relevamiento. Necesita producción y las respuestas de clientas.

## Pendiente de catálogo

Lo que está medido y con especificación de qué comprar está en `docs/COMPRAR.md`.
Acá va lo que no es una compra:

- **6 entradas de activos sin verificar de 79.** Se volvieron a revisar el 16/9
  sin el envase y no cierra ninguna: necesitan la caja en la mano o migrar la
  entrada a una ficha `/p/`. La lista está en `docs/AUDITORIA-PRODUCTOS.md`.
  Empezar por el **ISDIN Ureadin Fusion**, que es el que más cambia si está mal.
  Mientras tanto, **una pieza de campaña no los tiene de protagonistas**.
- **9 productos atados a un solo vendedor** (`docs/listados-atados.md`). Hay que
  elegir la publicación y generar el link desde el panel de afiliados, así que lo
  hace Ian. Misma regla para las piezas.
- **El vault y el catálogo divergieron.** 5 `ml_id` activos no existen en los
  `.md` de Obsidian, así que `npm run importar-organize` aborta a propósito.
- **Los aceites esenciales del diccionario son los que aparecieron, no todos los
  que existen.** Agregar uno genérico está descartado (ver *no reabrir*); el
  procedimiento es darle id al que aparezca en un INCI, de a uno, y su entrada en
  la tabla de lastre. El producto que entre mañana con un aceite nuevo va a
  parecerle limpio al motor hasta que alguien lea su INCI.

### Lo que estaba acá y ya no hace falta

Los links se volvieron a medir el 16/9; el protector y el producto barato son
del 12/9 y el catálogo no cambió desde entonces:

- ~~9 productos sin link de afiliado~~ → 0. `npm run links-pendientes` sale
  limpio.
- ~~46 links por generar~~ → era un número del corte del 6/9.
- ~~Falta un protector solar mineral~~ → hay uno (Haruharu Wonder Black Rice Pure
  Mineral) y 5 protectores aptos para sensible dentro del motor.
- ~~Falta un producto barato~~ → parcialmente; el presupuesto cede ante la piel,
  así que ya no degrada ninguna recomendación. Detalle en `docs/COMPRAR.md`.
- ~~Falta correr `npm run sync` después del #39~~ → hecho el 16/9. `comparar`
  mostró 3 campos y 0 bajas; después del sync, 0 y 0.

## Decisiones tomadas — no reabrir

Esto ya se discutió y se decidió. Si algo lo contradice, es un error, no una
propuesta.

| Decisión | Por qué |
|---|---|
| **Lectura botánica**, no clínica ni de lujo | La decide el catálogo: centella, arroz, ginseng, caracol |
| **Referencia visual Beauty of Joseon, sin iconografía coreana** | El catálogo es mayormente europeo. Sin fotos con gente ni con marcas a la vista; sólo fotos con licencia verificada, acreditadas |
| **Los protectores coreanos van aptos para sensible** | Verificado contra las páginas de los fabricantes. Excepción consciente a la regla del vault |
| **El exfoliante sale de las rutinas** | Suma costo, riesgo y un paso, para un beneficio que no justifica la fricción |
| **Los tiers son 2, no 4** | Medido: el Tier 4 sumaba tres pasos, cero puntos de cobertura y 13× el costo |
| **El tónico y la doble limpieza no son pasos de la rutina** | Misma medición. Siguen en el catálogo como opcionales, con la explicación de por qué quedaron afuera |
| **La pregunta de origen se queda, pero sólo elige marca** | Cuando el tónico era un paso, responder "no quiero coreanos" lo sacaba. Ya no cambia la forma de la rutina, sólo qué marca toca en cada paso |
| **El glicólico de The Ordinary es exfoliante, no tónico** | ML lo vende como "tónico exfoliante", pero es un AHA leave-on. En el slot de tónico diría de usarlo dos veces por día |
| **Presupuesto cualitativo, no en pesos; el sitio no publica precios** | Los montos fijos quedan viejos solos y pasan a mentir. Vale también para las piezas de campaña |
| **El quiz es una puerta, no el default** | Pinterest es un canal de browse |
| **`/combinaciones` va en el pie** | Nadie llega de una red social buscando combinaciones de activos |
| **El correo se pide en un solo lugar: el resultado del quiz** | Decidido el 16/9 (#43). La home no lo pide. El mail no promete frecuencia: "te escribimos poco, y sólo cuando cambia algo que te afecte"; "una vez por semana" fue la primera promesa incumplida y se sacó |
| **La URL del resultado no arrastra `utm`** | La URL se comparte y va en el mail. Si llevara el `utm`, quien la abre contaría como venido de la pieza. La entrada de la visita vive en `sessionStorage` (#47) |
| **Rating sólo con 10+ opiniones** | Tres productos tienen 5,0 con una sola opinión |
| **Nada de scraping a Mercado Libre** | Obligación (e) del Programa de Afiliados. La cuenta de cada link **se declara** al cargarlo y el script sólo audita. La API oficial con OAuth sí: es acceso autorizado por otro acuerdo |
| **Una sola cuenta de afiliados: `maurobilat`** | Cada afiliado cobra sólo por los Medios que declaró. Con links de dos cuentas, la mitad de las ventas queda expuesta a no pagarse. Un link compartido en una red no declarada no cobra |
| **Facebook no se usa** | Decisión de Ian. Las demás redes están declaradas como Medios |
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
| **"Tu piel, sin vueltas" se descarta** | Cliché de skincare. Como todo lo que podría estar en cualquier marca del rubro, y como todo claim médico o con plazo: `claims.ts` lo frena en el sitio |
| **La fuente de verdad de UX es el brand kit botánico con las tres puertas** | Decidido el 13/9. En el vault hay un plan anterior, `landing/fase-2.html`, con otra paleta, otra tipografía y una landing de una sola página. Partía de supuestos que ya no son ciertos —10 productos, 4 preguntas, sin precios, piel sensible sin servir— y adoptarlo reabriría decisiones cerradas. De ahí se rescatan ideas sueltas, no el sistema |

## Errores que ya se cometieron

Para no repetirlos:

**Links que no monetizan.** Pasó dos veces: en el vault de Obsidian y en el
`products.json` de Alex. Una URL de browse funciona igual y no paga nada, sin
ninguna señal. De ahí salió `check-links`.

**Una atribución que nadie probó de punta a punta.** El handoff de marketing daba
por hecho el link `/rutina?o=manchas&utm_source=pinterest` y el código tenía
`leerUtm()`, pero entre los dos estaba `Quiz.syncUrl`, que reescribía la URL antes
de que nadie la leyera. Cuatro días de tracking prendido y ninguna sesión con
`utm`. Un dato que se registra al final de un flujo hay que probarlo desde el
principio del flujo, con la URL real, mirando la fila que quedó. De ahí salió
`tracking.test.ts` y la prueba que pide el #47 después de mergear.

**Un documento de estado que envejeció el mismo día.** El corte del 12/9 se
escribió con el tracking apagado y esa misma noche se prendió; cuatro días
después el archivo seguía diciendo "bloqueante #1: tracking apagado" y era lo
primero que leía cualquiera que entrara. Este archivo se mide contra el repo y
contra los servicios el día del corte, la fecha va arriba, y si algo cambia el
mismo día, se vuelve a tocar.

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

**Un activo nuevo sin entrada en la tabla de lastre.** `CONFIG_CALIDAD.lastre` en
`calidad.ts` es una tabla **por id**, no por familia. Al dar de alta
`aceite_esencial_manzanilla` el activo no entró ahí, así que el producto que lo
trae declaraba el aceite y no pagaba el descuento: cero silencioso, sin que nada
fallara. Hoy hay un test: *"todo irritante potencial pesa como lastre"*.

**Una promesa en el mail que nadie iba a cumplir.** "Una vez por semana" salió en
la primera versión del correo y no había newsletter. Se sacó: el mail dice lo que
hay. Vale para las piezas: el headline no puede contradecir el disclaimer.

**El catálogo y la tabla separados sin que nada avise.** `productos.ts` sumó diez
campos y ninguna migración les dio columna; el `sync` fallaba entero y no se
notaba porque el sitio leía el archivo. De ahí `esquema-supabase.test.ts`, y el
mismo candado para `clicks` en `tracking.test.ts`: la migración va antes del
deploy, siempre.

**Disparar el escudo de Vercel con polling.** Ver punto 3 de *Lo que frenaba*.

**`git checkout <archivo>` sobre cambios sin stagear los borra.** Pasó al querer
revertir un experimento de una línea: se perdió el archivo entero de ediciones.
Antes de cualquier experimento destructivo, commitear.

## Lo próximo

1. **Mergear el #47 y probar la atribución**: abrir
   `clubdepiel.store/rutina?o=manchas&utm_source=prueba` en un navegador,
   completar el quiz, clickear un producto, y ver en Supabase que la sesión y el
   clic salieron con `utm = {"utm_source":"prueba"}`. Hasta que esa fila exista,
   la campaña no se puede medir por pieza.
2. **Las tres decisiones de Ian** (Pinterest Tag, imagen 2:3, X).
3. **La campaña**, por el orden de `08-MARKETING.md` §11: fijar la métrica, un
   link por preocupación con `utm`, Pinterest primero, los mitos como serie, y
   medir a la semana contra el piso de hoy (8 sesiones, 11 clics, 2 correos).
4. **Leer el envase de los 6 productos** que quedan sin verificar, empezando por
   el ISDIN.
5. **Los 9 listados atados a un solo vendedor.**
6. **Las dos compras de `COMPRAR.md`**, que están especificadas activo por activo.
7. **2 vulnerabilidades moderadas** de `vitest`, sólo de desarrollo (`npm audit`
   sin dev da 0). El arreglo pide vitest 5, que es un salto mayor.
8. **UX**: mockups con Alex, fotos propias de ingredientes, y las preguntas
   frecuentes reales cuando la campaña traiga respuestas.
