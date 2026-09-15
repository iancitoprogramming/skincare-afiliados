# Handoff · Club de Piel

> Reescrito el 2026-09-15, al cerrar una conversación larga (12/9 a 15/9). Lo que
> dice acá está verificado contra el repo y GitHub ese día, salvo donde se aclara
> que no se volvió a medir. Reemplaza al handoff del 12/9.
>
> **Actualizado el 15/9 a la tarde:** el #34 y el #35 ya están en `main` y en
> Production; la cuenta de Alex pasó de `WomenAre0bjects` a `ExtremeImagery` (§1,
> §10), y el catálogo se comparó contra producción (§6).

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
Vercel no frenó esos merges. **Los merges de `ExtremeImagery` todavía no se
verificaron:** después del primero, confirmar que el deployment de Production de
ese commit terminó.

---

## 2 · Dónde quedó el trabajo

### Los PR del 15/9: mergeados

| PR | Rama | Qué | Estado |
|---|---|---|---|
| **#34** | `arreglos-preview` | Los tres problemas de la preview del 15/9: puertas bajo las barras, catálogo sin productos en la primera pantalla y la franja de redes en desktop | En `main` (`d588c58`) y en Production |
| **#35** | `home-editorial` | La home con el lenguaje de Beauty of Joseon (§4) | En `main` (`0a8e802`) y en Production |

**Los dos quedaron invisibles en GitHub** porque los abrió `WomenAre0bjects`, que
GitHub restringió (§10): la página del PR da 404 aunque se entre como dueño del
repo. El registro está en los commits de merge y en los deployments de Vercel.

**CI y el #35.** El primer run del #35 falló: `tsc` no encontraba los tipos de los
imports `*.jpg` de `src/assets/home/`. Next los declara en `next-env.d.ts`, que
está en `.gitignore` y sólo existe después de correr `next dev` o `next build`, y
en CI `npm test` corre antes del build. El arreglo es `src/types/imagenes.d.ts`,
con la misma referencia. **El último commit del #35 (`5e4b12c`) no tuvo run** por
la restricción de la cuenta, y los merges del #34 y el #35 tampoco. Se corrió el
job de CI a mano sobre `5e4b12c` —clon limpio, sin `next-env.d.ts`, Node 22— y
pasaron los cuatro pasos. `main` tiene el mismo árbol que `5e4b12c`. El primer
run oficial sobre ese contenido es el del PR que trae esta actualización del
handoff.

### `main` al 15/9

Último merge: **#35** (`0a8e802`).

| | |
|---|---|
| Tests en `main` | 184 en 25 archivos |
| `npm run build` | 175 páginas |
| Rutinas sin conflicto | 344 de 360 · 0 con "separar" — medido el 12/9 |
| Links que monetizan | 81 de 81, todos de `maurobilat` — medido otra vez el 15/9 |
| Activos con fuente verificada | 73 de 79 — medido el 12/9 |

Las rutinas y los activos no se volvieron a medir: desde el 12/9 no se tocó el
catálogo y el único cambio de motor fueron las alternativas (#27), que no cambian
la rutina.

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

**Dirección visual nueva (#34, #35).** Ver §4.

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

**Lo que NO cambió todavía:** catálogo, quiz, resultado, fichas, kits y
combinaciones heredaron la serif, el marfil y los bordes cálidos, pero siguen con
tarjetas redondeadas, el tinte verde `gel`, el botón de compra terracota y el
formulario de mail redondeado. Es el próximo paso (§6).

---

## 5 · El sistema visual y sus candados

Las reglas viven en `docs/proyecto/02-MARCA.md` y en el comentario de
`src/niches/skincare/theme.css`. Los tests las hacen cumplir:

| Test | Qué frena |
|---|---|
| `contraste.test.ts` | Calcula la matriz desde `PALETA` y escanea las clases de `src/`: tinta sólo en `/80` o `/70`; texto de color sin opacidad; `bg-gel` hasta `/35`; texto de color sobre superficie teñida; terracota sobre `arena`. Por debajo del mínimo sólo con `disabled:` |
| `tipografia.test.ts` | Ningún `text-[…]` con tamaño; nada debajo de 12 px en `theme.css`; campos de formulario desde `text-base` |
| `paleta.test.ts` | `paleta.ts` y `theme.css` declaran los mismos colores |
| `copy-home.test.ts`, `copy-pasos.test.ts`, `copy-quiz.test.ts`, `bienvenida.test.ts` | El copy pasa por `PROHIBIDAS` de `claims.ts` |

**El escaneo no ve un fondo puesto en el padre y un texto en el hijo.** Por eso
cada cambio visual se mide también renderizado (§8).

**La regla por rol que ningún test ve:** etiqueta, dato o nota al pie van desde 12
px; una instrucción que la persona tiene que seguir va desde 14 px aunque sea
secundaria.

---

## 6 · Lo próximo, priorizado

1. **Confirmar que CI y Vercel andan con `ExtremeImagery`.** En su primer PR o
   merge tiene que aparecer `verificar`, y su merge tiene que terminar en un
   deployment de Production (§1). Si `verificar` no aparece, la cuenta nueva tiene
   el mismo problema que la anterior (§10).
2. **Llevar el resto del sitio al lenguaje de la home.** Catálogo, quiz, resultado,
   fichas, kits y combinaciones:
   - tarjetas rectas;
   - `arena` o marfil en vez del tinte verde `gel`;
   - `Shell` con el header de la home;
   - el formulario de mail recto.

   **El color del botón de compra es decisión del usuario:** terracota o tinta.
   Proponerlo, no hacerlo.
3. **La imagen para compartir** (`opengraph-image.tsx` y
   `api/og/producto/[slug]`) sigue con el diseño anterior. Pinterest recomienda 2:3
   (1000×1500) y las actuales son 1200×630.
4. **Frescura del catálogo en producción.** Producción lee el catálogo de Supabase,
   que queda al día sólo cuando alguien corre `npm run sync`.
   - Ian no corrió el `sync` el 15/9: en los logs de Supabase de ese día sólo hay
     lecturas de `productos`.
   - **No hacía falta.** Se comparó el catálogo de `main` contra la tabla, sólo
     leyendo: los 78 activos coinciden en los 29 campos que sube el `sync`, y el
     inactivo (Mela B3 "Opcion 2") está inactivo en los dos lados. Las correcciones
     de `apto_sensible` del 12/9 ya están en producción.
   - Vuelve a hacer falta con el próximo cambio de catálogo.
5. **Los 6 productos sin verificar** (§7), empezando por el ISDIN Ureadin Fusion.
6. **Fotos propias de ingredientes.** Una sección como la de ingredientes de Beauty
   of Joseon (centella, ginseng o arroz recortados) no se puede hacer con bancos
   libres: no hay con esa calidad.
7. **Pendientes de producto:**
   - las preguntas frecuentes reales, cuando haya respuestas de clientas;
   - prueba social y carrusel;
   - el copy "guardá tu rutina" de la captura de la home, que es la etiqueta del
     quiz.
8. **Catálogo:**
   - las dos compras de `docs/COMPRAR.md`;
   - 9 productos atados a un solo vendedor (`docs/listados-atados.md`);
   - confirmar con el frasco el alcanfor del Beauty of Joseon;
   - `INGREDIENTES.md` §8.4 todavía dice que no hay protector mineral, y hay.

---

## 7 · La auditoría de productos: las 6 que faltan

`docs/AUDITORIA-PRODUCTOS.md` es el registro. Cada entrada del mapa de activos
lleva `[INCI]`, `[vault]` o `[pendiente]`, y `fuente-activos.test.ts` falla si a
alguna le falta. Ninguna de estas se puede cerrar a distancia:

| Producto | Qué falta |
|---|---|
| ISDIN Ureadin Fusion | **El más importante.** El mapeo declara ácido láctico y vitamina C pura que no aparecen en la parte visible del INCI |
| LRP Anthelios Oil Control | `ml_id` `MLAU`: la API responde 403. El INCI sin color trae `Parfum` y `Zinc PCA` sin mapear |
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

**Los servers de preview.** El panel lee `.claude/launch.json` de la carpeta de
arriba (`Main Claude/`), no del repo. Hay dos configuraciones:

- **`club-de-piel`:** `next dev` en el puerto 3000.
- **`club-de-piel-produccion`:** `next start -p 3001`; necesita un build antes.

`next dev` y `next build` escriben los dos en `.next`: con uno levantado, el otro
se rompe.

**Medir renderizado.** Con `javascript_tool` en el panel, sobre la página
renderizada:
- **Contraste:** compone cada capa de fondo en un canvas, en sRGB, igual que el
  navegador. Las opacidades de Tailwind v4 son `color-mix` con transparente, que da
  el mismo resultado.
- **Tamaños:** que ningún texto baje de 12 px.
- **Desborde:** `scrollWidth` contra el ancho de la pantalla.
- **Imágenes:** que `naturalWidth` sea mayor que cero.

**Capturas.** Las del panel fallan cuando el panel no está a la vista. Lo que
funciona es Chrome headless por CDP con el `WebSocket` de Node 24 contra el build
de producción:
- **Chrome:** `C:\Program Files\Google\Chrome\Application\chrome.exe`, con
  `--remote-debugging-port` y un `--user-data-dir` propio.
- **Emulación:** `Emulation.setDeviceMetricsOverride`.
- **Captura:** `Page.captureScreenshot`.
- **Los scripts no quedaron en el repo:** vivían en el scratchpad de la sesión.

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

---

## 10 · Trampas conocidas

**Las variantes de una línea son la trampa más frecuente de catálogo.** Avène
*Rich* contra *Légère*, cuatro Dermaglós FPS30, Eucerin Tono Medio contra Toque
Seco, Anthelios con y sin color. Cuando la API no resuelve, dejarlo pendiente.

**Las fórmulas cambian por región.** El Neutrogena Hydro Boost no lleva perfume en
España y sí en Latinoamérica.

**Los `ml_id` `MLAU`** dan 403 en la API. Panalab, CosDNA y Neutrogena Argentina
bloquean la lectura automática.

**El importador puede borrar los links.** El vault y el catálogo divergieron: 5
`ml_id` activos no existen en los `.md` de Obsidian y `npm run importar-organize`
aborta a propósito.

**Medir el catálogo completo:** `productos.ts` **más** `productos.organize.ts`.
Grepear sólo el primero da la mitad.

**Vitest no resuelve el alias `@/`** en imports de valor. Rutas relativas.

**`next-env.d.ts` está en `.gitignore`.** Un tipo que sólo viene de ahí pasa local y
falla en CI: pasó con los `*.jpg` del #35 (§2).

**Dos colores de texto en la misma lista de clases** (`text-tinta/70 text-tinta`)
no se resuelven por orden. Para eso existe `ETIQUETA_BASE` en `estilo.ts`.

**Una cuenta restringida por GitHub no avisa en el repo.** Le pasó a
`WomenAre0bjects` el 15/9, alrededor de las 14:35. Síntomas: su perfil da 404
(también en la API), los PR que abrió y los runs que disparó desaparecen de las
listas aunque existan, y lo que empuja deja de disparar Actions sin error. La
configuración de Actions del repo estaba bien. Para distinguirlo de un problema
del repo, consultar `GET /repos/…/commits/{sha}/check-runs`: ahí siguen
apareciendo los runs ocultos. Se resolvió sacando esa cuenta y sumando
`ExtremeImagery`.

**Un pseudo-elemento con `z-index: -1` dentro de un bloque con `isolation:
isolate`** se pinta encima del contenido de los bloques anteriores. Lavó dos
botones de la home del monte (#34).

**`gh pr view` a veces responde `mergeable: UNKNOWN`** y el panel de la app puede
mostrar un conflicto viejo. Confirmar con `git merge-tree --write-tree
origin/main <rama>`.

**Herramientas:** un heredoc por comando de bash; en Windows, Python imprime mal
sin `PYTHONIOENCODING=utf-8`; `grep -E` con `\|` en vez de `|` da falsos ceros.

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
```

El resto de la documentación está en `docs/proyecto/` (índice en `LEEME.md`):
`02-MARCA.md` para el sistema visual, `03-PRODUCTO.md` para las puertas y el quiz,
`06-ESTADO.md` para el estado y las decisiones anteriores.
