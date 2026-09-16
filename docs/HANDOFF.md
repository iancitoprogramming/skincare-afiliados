# Handoff · Club de Piel

> Reescrito el 2026-09-15, al cerrar una conversación larga (12/9 a 15/9). Lo que
> dice acá está verificado contra el repo y GitHub ese día, salvo donde se aclara
> que no se volvió a medir. Reemplaza al handoff del 12/9.
>
> **Actualizado el 15/9 a la tarde:** el #34 y el #35 ya están en `main` y en
> Production; la cuenta de Alex pasó de `WomenAre0bjects` a `ExtremeImagery` (§1,
> §10), y el catálogo se comparó contra producción (§6).
>
> **Actualizado el 16/9:** del #37 al #43 están en `main` y en Production. Los
> mergeó `ExtremeImagery`, que quedó probada (§1), salvo el #43, que mergeó Ian.
> El #43 sacó la captura de mail de la home: el correo se pide sólo en el
> resultado del quiz (§3). **Abiertos: el #44**, el pin 2:3 de cada ficha con el
> botón Guardar en Pinterest (§6), **y el #45**, tres comentarios que quedaron
> desactualizados con el #43. **Falta que Ian corra `npm run sync`:** sin eso,
> producción no tiene el arreglo del #39 (§6). Los productos pendientes se
> revisaron otra vez sin el envase, y no cierra ninguno (§7).

---

## 1 · Qué es esto

Landing de afiliados de skincare para Argentina. La persona responde el quiz y
recibe una rutina armada con productos de Mercado Libre; cada botón lleva un link
de afiliado que paga comisión.

**El diferencial no es el catálogo, es el criterio.** Se cruzan los activos de
cada producto con los de los demás para que la rutina no se contradiga: que no
haya dos exfoliantes sin querer, que no se pague cuatro veces la misma
niacinamida, que un retinoide no caiga la misma noche que un ácido.

| | |
|---|---|
| Repo | `github.com/iancitoprogramming/skincare-afiliados` |
| Carpeta local | `C:\Users\zxzxe\OneDrive\Desktop\Main Claude\club-de-piel-web` |
| Producción | `clubdepiel.store` |
| Vault de Obsidian | `C:\Users\zxzxe\OneDrive\Desktop\Club de Piel\Organize` |
| Permisos | Desde el 15/9 la cuenta de Alex con push directo y merge es `ExtremeImagery`. `WomenAre0bjects` quedó restringida por GitHub y se sacó del repo (§10). Los PR van al repo de Ian, no a un fork. |

**La identidad de los commits no es negociable.** El git local está configurado
como `iancitoprogramming <129790147+iancitoprogramming@users.noreply.github.com>`
y cada commit termina con:

```
Co-authored-by: therexone1 <therexone1@gmail.com>
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

Vercel sólo deploya commits de un autor con acceso al proyecto. Con otra identidad
**producción deja de publicarse sin avisar**: pasó con los PR #14 a #21. Los merges
que hacía `WomenAre0bjects` desde `gh pr merge` sí deployaban; se verificó en los
deployments de Production del #26 al #28, y del #34 y el #35. Con el repo público
Vercel no frenó esos merges.

**`ExtremeImagery` quedó probada el 15/9.** Es la cuenta activa de `gh` en la
máquina de Alex, y git usa `gh` como helper de credenciales, así que los pushes
salen con ella; su perfil es público. Pusheó y abrió el #37, `verificar` corrió en
el PR y, al mergearlo, en el push a `main` (`72a1eae`), y el deployment de
Production de ese commit terminó. Después mergeó el #38, el #39 y el #40, los tres
con `verificar` y Production en verde. El #36 no contaba para la prueba: lo mergeó
`iancitoprogramming`.

---

## 2 · Dónde quedó el trabajo

### Los PR del 15/9 y el 16/9

| PR | Rama | Qué | Estado |
|---|---|---|---|
| **#34** | `arreglos-preview` | Los tres problemas de la preview del 15/9: puertas bajo las barras, catálogo sin productos en la primera pantalla y la franja de redes en desktop | En `main` (`d588c58`) y en Production |
| **#35** | `home-editorial` | La home con el lenguaje de Beauty of Joseon (§4) | En `main` (`0a8e802`) y en Production |
| **#36** | `docs-handoff-cuenta` | El handoff con el cambio de cuenta | En `main` (`fc51441`). Lo mergeó Ian; `verificar` y Production en verde |
| **#37** | `sitio-editorial` | El resto del sitio con el lenguaje de la home (§4) | En `main` (`72a1eae`) y en Production. Lo mergeó `ExtremeImagery` |
| **#38** | `og-editorial` | La imagen para compartir con el lenguaje del sitio (§4) | En `main` (`1faff72`) y en Production |
| **#39** | `sensible-hydro-boost` | El sérum Hydro Boost apto para piel sensible; `INGREDIENTES.md` §8.4 al día | En `main` (`ba83dd2`) y en Production. **Falta `npm run sync`** (§6) |
| **#40** | `mail-editorial` | El mail de bienvenida con el lenguaje del sitio, `npm run comparar` y una corrección del #39 | En `main` (`42a0fd0`) y en Production |
| **#41** | `correo-home` | La captura de mail de la home ya no habla de una rutina | En `main` (`d5ef21e`) y en Production |
| **#42** | `auditoria-evidencia` | Lo que se averiguó de los productos pendientes sin el envase (§7) y este handoff | En `main` (`293236d`) y en Production |
| **#43** | `captura-en-resultado` | El correo se pide en un solo lugar, el resultado del quiz: sale la captura de la home | En `main` (`a4dc89b`) y en Production. Lo mergeó Ian |
| **#44** | `pinterest-2x3` | El pin 2:3 de cada ficha y el botón Guardar en Pinterest (§6) | Abierto |
| **#45** | `comentarios-correo` | Tres comentarios del correo que describían lo anterior al #43. Sólo comentarios | Abierto |

**El #34 y el #35 quedaron invisibles en GitHub** porque los abrió
`WomenAre0bjects`, que GitHub restringió (§10): la página del PR da 404 aunque se
entre como dueño del repo. El registro está en los commits de merge y en los
deployments de Vercel.

**CI y el #35.** El primer run del #35 falló: `tsc` no encontraba los tipos de los
imports `*.jpg` de `src/assets/home/`. Next los declara en `next-env.d.ts`, que
está en `.gitignore` y sólo existe después de correr `next dev` o `next build`, y
en CI `npm test` corre antes del build. El arreglo es `src/types/imagenes.d.ts`,
con la misma referencia. **El último commit del #35 (`5e4b12c`) no tuvo run** por
la restricción de la cuenta, y los merges del #34 y el #35 tampoco. Se corrió el
job de CI a mano sobre `5e4b12c` —clon limpio, sin `next-env.d.ts`, Node 22— y
pasaron los cuatro pasos. `main` tiene el mismo árbol que `5e4b12c`. El primer
run oficial sobre ese contenido fue el del #36, en verde.

**CI y el #38.** El `verificar` del push de `1faff72` salió cancelado: cinco
segundos después llegó el merge del #39, y el workflow corta el run anterior de la
misma rama. El de `ba83dd2` incluye los dos y dio verde.

### `main` al 15/9

Último merge: **#42** (`293236d`), después del #43.

| | |
|---|---|
| Tests en `main` | 189 en 26 archivos |
| `npm run build` | 175 páginas |
| Rutinas sin conflicto | 344 de 360 · 0 con "separar" — medido otra vez el 15/9, con el #39 |
| Links que monetizan | 81 de 81, todos de `maurobilat` — medido otra vez el 15/9 |
| Activos con fuente verificada | 73 de 79 — medido el 12/9 |

Los activos no se volvieron a medir: el #39 corrige el mapeo de un producto que ya
tenía la fuente verificada. El #37, el #38, el #40, el #41 y el #43 son presentación,
copy y herramientas, y el sérum del #39 es un paso opcional que no entra en
ninguna rutina.

---

## 3 · Qué se hizo del 12/9 al 15/9

**Catálogo y criterio (#14 a #21).** Auditoría de productos, tea tree y fragancia
vetan `apto_sensible`, la cascada de candidatos, los aceites esenciales que el
diccionario no nombraba. El detalle sigue en `06-ESTADO.md` y en
`AUDITORIA-PRODUCTOS.md`.

**Resultado y home (#23 a #28).** La puerta del catálogo decía "Armar mi rutina";
cada paso dice primero para qué sirve; los pasos de mañana y noche no se repiten
enteros; "Ya tengo uno"; hasta dos alternativas por paso chequeadas contra el
resto; "cómo funciona" y cinco preguntas en la home.

**Lo que hicieron otros en paralelo.** El **#29** —de otra sesión— trajo la home
del monte, `font-etiqueta`, el resultado plegado con `Desplegable` y lo que se tomó
del banco visual (chips del objetivo, `porQue` por pregunta, cruce de la ficha al
quiz). El **#31** trajo Resend: el mail que sale cuando alguien deja su correo.

**Sistema visual (#30, #32, #33).**
- **#30 · Contraste por capa.** Todos los colores pasaban sobre porcelana, pero el
  texto vive sobre tarjetas y chips. Había nueve lugares debajo de AA.
- **#32 · Tamaño de letra.** Piso de 12 px, instrucciones a 14, campos a 16.
- **#33 · Tinta en tres niveles:** entero, `/80` y `/70`.

**Dirección visual nueva (#34, #35, #37, #38 y #40).** Ver §4.

**El sérum Hydro Boost (#39 y #40).** Ver §6.

**La captura de mail de la home (#41, y después se sacó).** El #41 le cambió
el texto para que no hablara de una rutina que no existía. El 16/9 Lucas decidió
que el correo se pide en un solo lugar: el resultado del quiz, bajo "guardá tu
rutina", que es donde hay algo que guardar. Un campo de mail suelto al pie es un
pop-up con otro nombre. La frase del mail de bienvenida sobre qué va a recibir
sigue en `copy.correo.frecuencia`.

---

## 4 · La dirección visual: Beauty of Joseon

El 15/9 el usuario pidió cambiar el fondo de montañas, que era provisorio, con
**el sitio de Beauty of Joseon como referencia**, y fijó la vara: *tiene que verse
profesional; la página todavía necesita seriedad*. Aprobó un boceto y pidió cambiar
una sola foto.

**Qué se tomó de Beauty of Joseon** (mirado en su sitio global y en el coreano):
fondo marfil, títulos en serif, fotos de texturas con luz pareja, etiquetas en
mayúscula chica con aire, botones rectos y líneas finas. Está escrito en
`02-MARCA.md` § *La referencia visual*.

**Lo que decidió el usuario:**
- **Tipografía: Newsreader** para títulos, comparada contra Instrument Serif.
  Beauty of Joseon usa Proxima Sera, que es paga.
- **La foto de la franja** no podía ser una hoja verde recortada.
- **Descargar las imágenes**, después de ver archivo, fuente, tamaño y licencia.
- **Botón de compra terracota, y el terracota sólo para comprar** (el paso 2,
  abajo).

**Lo que se decidió en el camino y conviene sostener:**
- **Fotos sólo con licencia verificada en la página de cada una.** En Unsplash eso
  es "Free Photo" con la Unsplash License, **no Unsplash+**, que es paga. El
  registro está en `src/niches/skincare/fotos-home.ts`, y se acreditan al pie.
- **Sin iconografía coreana** (arte Joseon, hanok): el catálogo es 48 europeo, 19
  coreano y 11 nacional, y esa estética lo haría parecer sólo coreano. Hay arte
  Joseon en dominio público (Cleveland Museum of Art, CC0) si algún día se quiere
  un acento.
- **Sin fotos con marcas a la vista ni con gente.**

**Qué cambió en código con el #35:**
- **Paleta:** `porcelana` pasa a `#fbfaf7` (marfil), `niebla` a `#e0d8cd`, y entra
  `arena` (`#f3ede6`), donde terracota **no** pasa AA.
- **Tipografía:** Newsreader en `font-display`, Instrument Sans en `font-body` y
  `font-etiqueta`; Bricolage sale.
- **Piezas compartidas:** `src/components/estilo.ts` (`ETIQUETA`, `BOTON_LLENO`,
  `BOTON_LINEA`).
- **Lo que sale:** `FondoMonte`, `home.module.css`, `foto.ts` y `monte.webp`.

**El paso 2, en el #37.** Antes de tocar código se hizo un boceto: un HTML con
copy y datos reales del build local, a 390 px, con el resultado en las dos
opciones de botón de compra. El usuario eligió **terracota** y aceptó las demás
propuestas. Lo que cambió:
- **Catálogo, quiz, resultado, fichas, kits y combinaciones:** tarjetas y botones
  rectos; arena o marfil donde había `gel`. `gel` queda en la paleta, sin uso.
- **`Encabezado`:** el header de la home, sacado a un componente que usan la home
  y `Shell`. "Volver" va a la derecha y sólo en pantallas chicas.
- **`BOTON_COMPRA`:** terracota, recto, en mayúscula con aire. Es el único botón
  terracota; filtro activo, opción elegida del quiz, sello de los kits, avisos y
  "separar" pasan a tinta.
- **Fotos de producto sobre arena** con `mix-blend-mode: multiply` (`MARCO_FOTO`,
  `FOTO_PRODUCTO`): el blanco de Mercado Libre deja de verse como un recuadro.
- **Mail y selector de orden** rectos, con borde y placeholder en `tinta/70`.
- **El quiz** tenía un `<main>` y márgenes propios adentro del `Shell`, que ya los
  pone: dos `<main>` anidados y 40 px menos de ancho a 390 px. Se sacaron.
- **Tabla de combinaciones:** ✕ ("nunca") y ＋ ("se potencian") son la misma cruz
  girada. Sin terracota, "nunca" va en tinta con más peso y "se potencian" en
  salvia; la leyenda usa los mismos colores.

**La imagen para compartir, en el #38.** Las dos imágenes de Open Graph seguían
con el diseño anterior. Ahora:
- **La de la home** lleva la foto de la portada, la etiqueta en mayúscula con aire
  y el titular en Newsreader.
- **La de cada ficha** lleva la marca del producto en mayúscula, el nombre en
  Newsreader y la banda en un recuadro recto. **La foto va sobre blanco**: Satori
  no soporta `mix-blend-mode`, y sobre arena se vería el recuadro.
- **Las fuentes** se piden a Google Fonts con `text`, como en los ejemplos
  oficiales de Vercel para OG (`src/components/og/recursos.ts`). Si Google no
  responde, la imagen sale con la fuente por defecto y el build no se rompe.
- **Sigue en 1200×630.** Una versión 2:3 para Pinterest es decisión del usuario
  (§6).

**El mail de bienvenida, en el #40.** Seguía con la paleta anterior al 15/9,
copiada a mano, y con un botón terracota redondeado que no lleva a comprar. Ahora
toma los colores de `PALETA`, tiene la tarjeta recta con una línea fina, la marca
en mayúscula con aire, el título en serif y los botones en tinta. La serif es
Georgia y no Newsreader: según caniemail, `@font-face` funciona en uno de cada
cuatro clientes de correo, y Gmail no lo soporta.

---

## 5 · El sistema visual y sus candados

Las reglas viven en `docs/proyecto/02-MARCA.md` y en el comentario de
`src/niches/skincare/theme.css`. Los tests las hacen cumplir:

| Test | Qué frena |
|---|---|
| `contraste.test.ts` | Calcula la matriz desde `PALETA` y escanea las clases de `src/`: tinta sólo en `/80` o `/70`; texto de color sin opacidad; `bg-gel` hasta `/35`; texto de color sobre superficie teñida; terracota sobre `arena`. Por debajo del mínimo sólo con `disabled:` |
| `terracota.test.ts` | Ninguna clase con terracota fuera de `estilo.ts` (`BOTON_COMPRA`) y `Alternativas.tsx` (el link de cada alternativa) |
| `tipografia.test.ts` | Ningún `text-[…]` con tamaño; nada debajo de 12 px en `theme.css`; campos de formulario desde `text-base` |
| `paleta.test.ts` | `paleta.ts` y `theme.css` declaran los mismos colores |
| `copy-home.test.ts`, `copy-pasos.test.ts`, `copy-quiz.test.ts`, `bienvenida.test.ts` | El copy pasa por `PROHIBIDAS` de `claims.ts` |
| `bienvenida.test.ts` (#40) | Además, el HTML del mail no usa el terracota y sí el fondo y las líneas de la paleta actual: lleva estilos inline, y el escaneo de clases no lo ve |

**El escaneo no ve un fondo puesto en el padre y un texto en el hijo.** Por eso
cada cambio visual se mide también renderizado (§8).

**La regla por rol que ningún test ve:** etiqueta, dato o nota al pie van desde 12
px; una instrucción que la persona tiene que seguir va desde 14 px aunque sea
secundaria.

---

## 6 · Lo próximo, priorizado

1. **Ian: `npm run comparar` y después `npm run sync`.** Producción lee el catálogo
   de Supabase y todavía no tiene el arreglo del #39: ahí el sérum Hydro Boost
   sigue vetado para piel sensible.
   - `comparar` muestra qué pisaría el sync, sin escribir nada. Debería mostrar
     sólo el sérum Hydro Boost (`apto_sensible` y `tipos_piel`). Si muestra otra
     cosa, mirarla antes de sincronizar: el sync hace upsert de todos los campos y
     desactiva lo que no está en el archivo.
   - En la máquina de Alex no se puede: su `.env` tiene las variables de Supabase
     vacías (§10).
   - Qué corrige el #39: el mapeo del sérum (`MLA22655637`) declaraba `fragancia`
     contra su propio comentario y contra el INCI. La ficha oficial de Neutrogena
     Uruguay (Kenvue), con la fórmula latinoamericana, no trae fragancia; la marca
     lo declara "sin perfume" y FarmaPlus lo confirma. Se revisaron las 79
     entradas de `activos.ts` buscando otro comentario que contradiga su mapeo, y
     no hay.
   - **El vault no hay que tocarlo.** En el #39 se dijo lo contrario, y estaba mal:
     la exclusión "no va a → sensible" la calcula el importador desde
     `activos.ts`. Lo corrige el #40.
2. **Pinterest 2:3: el #44 espera el visto bueno.** El 16/9 el usuario aprobó
   cargar `pinit.js` para ofrecerle a Pinterest una imagen 2:3. El #44 genera en el
   build un pin de 1000×1500 por ficha (`/api/pin/producto/[slug]`), y el botón
   "Guardar en Pinterest" de la ficha se lo ofrece. Lo que hay que saber antes de
   mergearlo:
   - **El link funciona sin `pinit.js`**: es la URL de creación de pin de
     Pinterest, con la imagen, y el script sólo le suma una ventana chica.
     Probado el 16/9 sin sesión: la URL sola abre el formulario de Pinterest y
     carga la imagen de `media`; para guardar pide iniciar sesión. Esto corrige lo
     que decía este punto antes, que el script era la condición para ofrecer otra
     imagen.
   - **`pinit.js` le avisa a Pinterest de cada visita a una ficha**, con la URL de
     la página, aunque nadie toque el botón. Está medido; el detalle y cómo
     sacarlo están en `05-TECNICO.md` § Pinterest. El sitio no tiene página de
     privacidad que lo diga.
   - Después del merge hay que verificar que en producción el `media` del botón
     sea `https://clubdepiel.store/api/pin/producto/…` y devuelva `200 image/png`.
3. **Los 6 productos sin verificar** (§7), empezando por el ISDIN Ureadin Fusion.
   Necesitan la caja.
4. **Fotos propias de ingredientes.** Una sección como la de ingredientes de Beauty
   of Joseon (centella, ginseng o arroz recortados) no se puede hacer con bancos
   libres: no hay con esa calidad.
5. **Pendientes de producto:**
   - las preguntas frecuentes reales, cuando haya respuestas de clientas;
   - prueba social y carrusel.
6. **Catálogo:**
   - las dos compras de `docs/COMPRAR.md`;
   - 9 productos atados a un solo vendedor (`docs/listados-atados.md`): hay que
     elegir la publicación y generar el link de afiliado desde la cuenta de
     Mercado Libre, así que lo hace el usuario;
   - confirmar con el frasco el alcanfor del Beauty of Joseon.
7. **Frescura del catálogo en producción.** Producción lee el catálogo de Supabase,
   que queda al día sólo cuando alguien corre `npm run sync`.
   - Ian no corrió el `sync` el 15/9: en los logs de Supabase de ese día sólo hay
     lecturas de `productos`.
   - Antes del #39 no hacía falta: Ian comparó el catálogo de `main` contra la
     tabla, sólo leyendo, y los 78 activos coincidían en los 29 campos que sube el
     `sync`; el inactivo (Mela B3 "Opcion 2") estaba inactivo en los dos lados.
   - **Con el #39 vuelve a hacer falta:** ver el punto 1.

---

## 7 · La auditoría de productos: las 6 que faltan

`docs/AUDITORIA-PRODUCTOS.md` es el registro. Cada entrada del mapa de activos
lleva `[INCI]`, `[vault]` o `[pendiente]`, y `fuente-activos.test.ts` falla si a
alguna le falta. Ninguna de estas se puede cerrar a distancia:

| Producto | Qué falta |
|---|---|
| ISDIN Ureadin Fusion | **El más importante.** El mapeo declara ácido láctico y vitamina C pura que no aparecen en la parte visible del INCI, y manteca de karité cuando la que aparece es de shorea (illipe). Revisado otra vez el 15/9 sin el envase: ver `AUDITORIA-PRODUCTOS.md` |
| LRP Anthelios Oil Control | `ml_id` `MLAU`: la API responde 403. El INCI sin color trae `Parfum` y `Zinc PCA` sin mapear. Está marcado no apto para sensible |
| Idraet Espuma Extra Suave | La marca no publica INCI |
| Avène Hydrance SPF30 | Variante sin resolver; no es la *Rich* |
| Detenage N | Panalab bloquea la lectura automática |
| Eucerin DermoPure | Dos versiones; el nombre del catálogo no alcanza |

---

## 8 · Cómo se verifica un cambio

Lo pidió el usuario y es costumbre: **nada se da por terminado sin**

1. `npm test` (que es `tsc --noEmit && vitest run`);
2. `npm run build` **corrido local**, con el server de desarrollo frenado;
3. mirar la home en el navegador a 390 px.

**Un cambio de catálogo, además, se sube con `npm run comparar` y después `npm
run sync`**, desde una máquina con la `service_role` de Supabase.

**Los servers de preview.** El panel lee `.claude/launch.json` de la carpeta de
arriba (`Main Claude/`), no del repo. Hay dos configuraciones:

- **`club-de-piel`:** `next dev` en el puerto 3000.
- **`club-de-piel-produccion`:** `next start -p 3001`; necesita un build antes.

`next dev` y `next build` escriben los dos en `.next`: con uno levantado, el otro
se rompe.

**Medir renderizado.** Sobre la página renderizada:
- **Contraste:** compone cada capa de fondo en un canvas, en sRGB, igual que el
  navegador. Las opacidades de Tailwind v4 son `color-mix` con transparente, que da
  el mismo resultado.
- **Tamaños:** que ningún texto baje de 12 px.
- **Desborde:** `scrollWidth` contra el ancho de la pantalla.
- **Imágenes:** que `naturalWidth` sea mayor que cero.
- **Lo plegado:** abrir los `<details>` antes de medir, o no se mide.

**Lo que se midió en el #37:** nueve pantallas a 390 px —home, catálogo, ficha,
quiz, un resultado real, kits, un kit de compra única, un kit armado y
combinaciones—, con los desplegables abiertos: 914 textos, **0 debajo de 4,5:1, 0
debajo de 12 px**, sin desborde y sin imágenes rotas.

**Las imágenes para compartir se miran como PNG**, bajadas del build local:
`/opengraph-image` y `/api/og/producto/<slug>`. Conviene mirar una ficha con
rating y otra con nombre largo y sin rating. Un cambio de fuente que no llegó no
da error: la imagen sale con la de por defecto, y sólo se nota mirándola.

**El mail se mira renderizado:** `bienvenidaHtml` con rutina y sin rutina, escrito
a un `.html` y capturado a 640 px.

**Capturas y medición.** Las del panel fallan cuando el panel no está a la vista,
y sus pestañas se cierran solas. Lo que funciona es Chrome headless por CDP con el
`WebSocket` de Node 24 contra el build de producción:
- **Chrome:** `C:/Program Files/Google/Chrome/Application/chrome.exe`, con
  `--remote-debugging-port` y un `--user-data-dir` propio.
- **Emulación:** `Emulation.setDeviceMetricsOverride`.
- **Captura:** `Page.captureScreenshot`, con `captureBeyondViewport` **sólo** para
  la página entera: con `true` en una captura de una sola pantalla, devuelve la
  página entera con el contenido repetido.
- **Una sección suelta** se mira llevándola al centro con `scrollIntoView` y
  capturando esa pantalla.
- **Los scripts no quedaron en el repo:** vivían en el scratchpad de la sesión
  (`captura.mjs`, `medir.mjs`, `captura-seccion.mjs` y `render-mail.mts`).

**Unsplash bloquea el headless** con BotStopper. No se esquiva: se navega con el
panel, que es un navegador normal, y las miniaturas del CDN
(`images.unsplash.com`) sí cargan.

**El preview de Vercel pide login** (SSO de Vercel): sólo lo abre quien tiene
acceso al proyecto de Ian. Para mostrarle algo al usuario, capturas.

**En local, el 404 de `/_vercel/insights/script.js` es esperable:** Vercel
Analytics sólo existe desplegado.

---

## 9 · Decisiones tomadas — no reabrir

Las anteriores al 12/9 están en `docs/proyecto/06-ESTADO.md`.

| Decisión | Por qué |
|---|---|
| **Nada de scraping a ML** | Obligación (e) del Programa. La API oficial con OAuth sí |
| **La popularidad no clasifica ni ordena** | Las ventas no miden la calidad de una fórmula |
| **El presupuesto cede ante la piel y el objetivo** | Dar algo que no sirve para ahorrar es peor |
| **`tipos_piel` orienta, `apto_sensible` veta** | Sólo se excluye por fórmula |
| **La fragancia y los aceites esenciales vetan `apto_sensible`**, enjuague incluido | Decisión del usuario delegada, 12/9 |
| **No hay `aceite_esencial` genérico** | Se le da id a cada aceite que aparezca en un INCI |
| **Un conflicto que se arregla con una instrucción no baja la calidad de match** | Decisión del usuario, 12/9 |
| **El tónico nunca es un paso obligatorio** | Decisión del usuario |
| **Tres puertas** (quiz, catálogo, kits) | Lo que va debajo no es una puerta: `03-PRODUCTO.md` |
| **Beauty of Joseon es la referencia visual** | Decisión del usuario, 15/9. Se toma su lenguaje, no sus imágenes ni su marca |
| **Newsreader en los títulos** | Decisión del usuario, 15/9 |
| **Fotos sólo con licencia verificada, sin marcas, sin gente, sin iconografía coreana** | 15/9; §4 |
| **Contraste medido por capa; tinta en tres niveles** | #30 y #33; `02-MARCA.md` |
| **Piso de 12 px, instrucciones a 14, campos a 16** | #32; `02-MARCA.md` |
| **Botón de compra terracota y recto; el terracota, sólo para comprar** | Decisión del usuario, 15/9. Baymard pide un estilo propio para la compra y NN/g, reservar el acento para la acción principal; `02-MARCA.md` § *Terracota es comprar* |
| **Fotos de producto sobre arena con multiply; campos con borde `tinta/70`** | Decisión del usuario, 15/9, sobre el boceto |

---

## 10 · Trampas conocidas

**Las variantes de una línea son la trampa más frecuente de catálogo.** Avène
*Rich* contra *Légère*, cuatro Dermaglós FPS30, Eucerin Tono Medio contra Toque
Seco, Anthelios con y sin color. Cuando la API no resuelve, dejarlo pendiente.

**Las fórmulas cambian por región.** El Neutrogena Hydro Boost en crema no lleva
perfume en España y sí en Latinoamérica. Y la trampa corre para los dos lados:
el sérum de la misma línea no lleva perfume en Latinoamérica, y el mapeo se lo
había puesto (#39).

**Un comentario puede decir lo contrario que el dato.** El motor lee el mapeo y el
flag, no la prosa: el sérum Hydro Boost tenía "Sin fragancia" en el comentario y
`fragancia` en el mapeo, y quedó vetado para piel sensible. Al tocar una entrada,
leer las dos cosas.

**Los `ml_id` `MLAU`** dan 403 en la API. Panalab, CosDNA y Neutrogena Argentina
bloquean la lectura automática.

**El importador puede borrar los links.** El vault y el catálogo divergieron: 5
`ml_id` activos no existen en los `.md` de Obsidian y `npm run importar-organize`
aborta a propósito.

**Las exclusiones del importador no salen del vault.** Los comentarios "no va a →
sensible: …" de `productos.organize.ts` los escribe `importar-organize` calculando
`apto_sensible` desde el mapa de `activos.ts`. Un error en ese mapa aparece ahí
como si el vault lo dijera: pasó con el sérum Hydro Boost.

**En la máquina de Alex el `.env` tiene las variables de Supabase vacías.** Los
builds locales usan el catálogo del repo y no el de producción, y `npm run sync` y
`npm run comparar` cortan sin credenciales.

**Medir el catálogo completo:** `productos.ts` **más** `productos.organize.ts`.
Grepear sólo el primero da la mitad.

**Vitest no resuelve el alias `@/`** en imports de valor. Rutas relativas.

**`next-env.d.ts` está en `.gitignore`.** Un tipo que sólo viene de ahí pasa local y
falla en CI: pasó con los `*.jpg` del #35 (§2).

**Dos colores de texto en la misma lista de clases** (`text-tinta/70 text-tinta`)
no se resuelven por orden. Para eso existe `ETIQUETA_BASE` en `estilo.ts`.

**Un campo adentro de una etiqueta hereda su letra.** El `<select>` del orden del
catálogo vive adentro de un `<label>` con `ETIQUETA` y le heredaba la mayúscula y
el aire entre letras. Por eso lleva `normal-case tracking-normal`.

**Satori no es CSS completo.** No soporta `mix-blend-mode` (por eso la foto de la
imagen de ficha va sobre blanco), no decodifica WebP y sólo lee fuentes TTF, OTF o
WOFF. Google Fonts devuelve TTF cuando se le pide sin User-Agent.

**Una cuenta restringida por GitHub no avisa en el repo.** Le pasó a
`WomenAre0bjects` el 15/9, alrededor de las 14:35. Síntomas: su perfil da 404
(también en la API), los PR que abrió y los runs que disparó desaparecen de las
listas aunque existan, y lo que empuja deja de disparar Actions sin error. La
configuración de Actions del repo estaba bien. Para distinguirlo de un problema
del repo, consultar `GET /repos/…/commits/{sha}/check-runs`: ahí siguen
apareciendo los runs ocultos. Se resolvió sacando esa cuenta y sumando
`ExtremeImagery`.

**Justo después de un push, `gh pr checks` puede decir "no checks reported".**
Tarda unos segundos en registrar el run. No confundirlo con el síntoma de la cuenta
restringida: mirar los check-runs del commit un minuto después.

**Un pseudo-elemento con `z-index: -1` dentro de un bloque con `isolation:
isolate`** se pinta encima del contenido de los bloques anteriores. Lavó dos
botones de la home del monte (#34).

**`gh pr view` a veces responde `mergeable: UNKNOWN`** y el panel de la app puede
mostrar un conflicto viejo. Confirmar con `git merge-tree --write-tree
origin/main <rama>`.

**Git Bash convierte los argumentos que empiezan con `/` en rutas de Windows:**
`/catalogo` le llega a un script de Node como `C:/Program Files/Git/catalogo`.
Pasó con la medición del #37, que midió `about:blank` sin dar error. Correr esos
scripts con `MSYS_NO_PATHCONV=1`.

**Un script escrito desde adentro de un comando pierde las barras invertidas.**
`"C:\\Program Files\\…"` llegó al archivo como `C:\Program Files\…` y JavaScript
se comió las barras: el `spawn` de Chrome falló con `ENOENT`. En Windows conviene
escribir las rutas con barras normales, que el sistema acepta igual.

**Un script `.ts` suelto fuera del repo, corrido con `tsx`, se trata como
CommonJS** y no acepta `await` fuera de una función: usar `.mts`. Y en Windows,
`import()` de una ruta `C:/…` necesita `pathToFileURL`.

**Herramientas:** un heredoc por comando de bash; en Windows, Python imprime mal
sin `PYTHONIOENCODING=utf-8`; `grep -E` con `\|` en vez de `|` da falsos ceros;
`rg` no acepta lookahead (`(?!…)`) sin `--pcre2`; en PowerShell, un `curl.exe -o
NUL` hizo que la herramienta bloqueara el comando entero; `git commit` con varios
`-m` hace un párrafo por cada uno, y los trailers tienen que ir juntos en el
último o Git no los reconoce.

---

## 11 · Cómo trabaja este usuario

- **Escribe en español rioplatense** y espera respuestas así.
- **Pide investigar y corroborar contra las fuentes más rigurosas, siempre**,
  incluso lo que él afirma. Citar de dónde sale cada cosa.
- **Prefiere que se actúe:** "mergeá el #N y seguí con X" es el ritmo. Espera el
  trabajo hecho y verificado, con PR, no un plan.
- **Decide él las cuestiones de producto y de marca.** Medir y proponer, sí;
  cambiar el criterio por cuenta propia, no. A veces delega con "decidí vos".
- **Para cambios visuales grandes, primero un boceto.** El del 15/9 fue un HTML
  renderizado con el copy real y las fotos enlazadas, sin descargarlas.
- **Descargar archivos se confirma antes**, indicando archivo, fuente, tamaño y
  licencia.
- **La vara visual es "profesional y serio".**

---

## 12 · Comandos para arrancar

```bash
cd "C:\Users\zxzxe\OneDrive\Desktop\Main Claude\club-de-piel-web"
git fetch && git status
gh pr list --state open
npm ci
npm test && npm run build
```

Herramental de medición:

```bash
npm run auditar      # las 360 rutinas, con conflictos por tipo
npm run huecos       # qué conflicto NO se puede evitar y qué falta
npm run cobertura    # pasos flojos, fuera de banda, comodines
npm run cuentas      # todos los links salen de maurobilat · exit 1 si no
npm run check-links  # los activos monetizan
npm run frescura     # qué datos están por vencer
npm run comparar     # qué pisaría el sync, sin escribir nada (#40)
```

El resto de la documentación está en `docs/proyecto/` (índice en `LEEME.md`):
`02-MARCA.md` para el sistema visual, `03-PRODUCTO.md` para las puertas y el quiz,
`06-ESTADO.md` para el estado y las decisiones anteriores.
