# Marca y sistema visual

## La lectura: botánico · natural

De las tres lecturas posibles en skincare —clínico, botánico, lujo— Club de Piel
es **botánico**.

**No es una decisión de gusto: la decide el catálogo.** Centella asiática,
extracto de arroz, ginseng, mucina de caracol, té verde. Los ingredientes son el
posicionamiento.

Por qué no las otras dos:

- **Clínico** prometería un rigor dermatológico que un catálogo K-beauty no
  entrega.
- **Lujo** choca con precios de $15.000 a $137.000 y con una voz que evita la
  pretensión.

### La referencia visual: Beauty of Joseon

Desde el 15/9 el lenguaje visual toma como referencia el sitio de Beauty of
Joseon. La lectura sigue siendo botánica; lo que se toma es cómo se ve una marca
de skincare seria:

- **Fondo marfil**, cálido y casi sin color, con paneles `arena` para separar
  bloques y para los avisos.
- **Títulos en serif** (Newsreader) a tamaño moderado; texto y etiquetas en sans.
- **Etiquetas en mayúscula chica** con aire entre letras y **botones rectos**: uno
  lleno en `tinta` y uno de borde fino. Sin sombras ni esquinas redondeadas. Los
  chips de filtro y de objetivo siguen redondos: son chips, no botones.
- **Fotos de texturas** —sérums, cremas— con luz pareja. Sin gente, sin marcas a
  la vista y sin iconografía coreana: el catálogo es mayormente europeo y esa
  estética lo haría parecer otra cosa.
- **Fotos de producto sobre arena.** Las de Mercado Libre vienen sobre blanco; en
  un marco `arena` y con `mix-blend-mode: multiply`, el blanco toma el color del
  marco y la foto deja de verse como un recuadro pegado. Son `MARCO_FOTO` y
  `FOTO_PRODUCTO`, en `src/components/estilo.ts`.
- **Líneas finas** en `niebla` y mucho aire entre secciones.

Hasta el 15/9 esto valía sólo para la home. **Desde el 15/9 vale para todo el
sitio**: catálogo, quiz, resultado, fichas, kits y combinaciones, con el mismo
encabezado (`src/components/Encabezado.tsx`).

Las fotos son de Unsplash, con la licencia verificada en la página de cada una, y
se acreditan al pie de la home aunque la licencia no lo exija. El detalle está en
`src/niches/skincare/fotos-home.ts`.

## Paleta

Todos los colores que llevan texto pasan **WCAG AA (4.5:1)** sobre el fondo.
Medido sobre la página renderizada, no en el papel.

| Token | Hex | Rol | Contraste |
|---|---|---|---|
| `porcelana` | `#fbfaf7` | fondo marfil | — |
| `tinta` | `#1b2430` | texto principal | 15,00:1 |
| `piedra` | `#5a6b85` | texto secundario · **color del logo** | 5,19:1 |
| `salvia` | `#4a6b57` | verde de marca | 5,70:1 |
| `gel` | `#dce7de` | superficie verde suave · **sin uso en pantallas desde el 15/9** | fondo, no texto |
| `arena` | `#f3ede6` | paneles, avisos, opción elegida del quiz y marco de las fotos de producto | fondo; terracota encima no pasa (4,46:1) |
| `terracota` | `#c2410c` | **sólo comprar**: el botón de compra y el link de las alternativas | 4,96:1 con `porcelana` encima |
| `niebla` | `#e0d8cd` | bordes y líneas finas | no texto |

**La decisión que hace funcionar el sistema:** `piedra` es el azul del logo *y* el
color del texto secundario. Eso resuelve tener un logo azul grisáceo en una marca
verde — el logo deja de ser un acento suelto y pasa a ser el ancla fría de todo
el sistema.

### Terracota es comprar

Desde el 15/9 el terracota se usa **sólo para comprar**: `BOTON_COMPRA` —el "Ver
en Mercado Libre" de cada paso, ficha y kit— y el link de cada alternativa.
Filtro activo, opción elegida del quiz, sello de los kits, avisos y el "separar"
de las combinaciones van en tinta. Lo decidió el usuario.

- **Por qué.** Baymard pide que el botón de compra tenga un estilo que ningún
  otro botón reutilice, y NN/g, reservar el color de acento para la acción
  principal. Tinta llena ya es "Armá tu rutina": con la compra también en tinta,
  las dos acciones se verían iguales.
- **Lo que la evidencia no dice.** No hay un color que venda más que otro. Lo que
  está respaldado es que el botón de compra se distinga y tenga contraste.
- **Beauty of Joseon hace lo mismo:** su "Add to cart" principal es de borde
  cobre, y los botones negros quedan para otras cosas. Su cobre no pasa AA
  (2,52:1 sobre su fondo), así que se tomó la idea y no el color.
- **Un aviso tampoco va en terracota.** Justo arriba del botón de compra, un
  aviso del mismo color se leería como parte de él. Lo que avisa es la frase.
- `terracota.test.ts` falla si aparece una clase con terracota fuera de
  `estilo.ts` y `Alternativas.tsx`.

### Sobre qué capa va cada texto

Pasar sobre `porcelana` no alcanza. Casi todo el texto vive sobre una tarjeta o un
chip, y cada capa le baja el contraste: con las puertas de la home en `gel/40`,
el CTA terracota quedaba en **4,48:1**. Estas reglas las calcula
`contraste.test.ts` desde la paleta, y el mismo test las hace cumplir sobre las
clases de `src/`:

| Superficie | Dónde | Texto encima |
|---|---|---|
| **Clara:** de `porcelana` a `gel/35` | fondo, tarjetas | tinta entero, `/80` o `/70` · piedra, salvia y terracota enteros |
| **Teñida:** `piedra/NN`, `niebla/NN`, `gel` sólido | chips de severidad | tinta entero, `/80` o `/70` — el color va en el fondo, no en la letra |
| `terracota` sólido | botón de compra | `porcelana` entero |
| **Arena** (`bg-arena`) | paneles, avisos, opción elegida del quiz, marco de las fotos | tinta en sus tres niveles · piedra y salvia enteros · **terracota no** (4,46:1) |
| `tinta` sólido | botón lleno, filtro activo, chip "separar" | `porcelana` entero (15,00:1) |

- **Un color con opacidad nunca pasa** (`text-piedra/80`, `text-porcelana/70`): va
  entero.
- **Por debajo del mínimo sólo va un control deshabilitado**, con la variante
  `disabled:`. WCAG 1.4.3 exime ese texto, y la variante ata el contraste bajo a
  que el control esté deshabilitado de verdad.
- **El borde de un campo va en `tinta/70`**: 5,72:1 sobre porcelana y 5,44 contra
  arena. En `niebla` quedaba en 1,35:1, y WCAG 1.4.11 pide 3:1 cuando el borde es
  lo que identifica el campo. El placeholder, también en `tinta/70`.
- **El escaneo no ve un fondo puesto en el padre y un texto en el hijo.** Por eso
  se mide también la página renderizada: así apareció la pista del quiz, que en
  `piedra` quedaba en 3,98:1 con la opción seleccionada.

### Niveles de tinta

Tinta va en tres niveles y nada más:

| Nivel | Clase | Para qué | Contraste |
|---|---|---|---|
| Principal | `text-tinta` | títulos y lo que se lee primero | 11:1 o más |
| Apoyo | `text-tinta/80` | explicaciones, bajadas, descripciones, avisos | **7:1 o más** sobre superficie clara |
| Nota | `text-tinta/70` | leyendas, notas al pie, pistas, marcas, celdas vacías | **4,5:1 o más** en cualquier superficie |

- **Por qué 7:1 para el apoyo.** Es el umbral AAA de WCAG (1.4.6). Según W3C,
  compensa la pérdida de sensibilidad al contraste de quien tiene baja visión y
  no usa tecnología de asistencia. El apoyo es lo que se lee de corrido —la
  explicación de cada paso, lo que hay que saber de un choque—, y ahí conviene
  el margen.
- **Por qué no cinco.** Hasta el 13/9 había `/65`, `/70`, `/75`, `/80` y `/85`, y
  no eran cinco jerarquías: la explicación de un paso iba en `/80` y la de un
  choque, en la tarjeta de abajo, en `/85`. Ahora cada nivel es un rol, y entre
  apoyo y nota hay el doble de diferencia de color que entre dos escalones
  viejos: 7,5 contra 3,7 de ΔE00 sobre porcelana.
- **Se asigna por rol, no por parecido.** "Por qué esta pregunta" va como nota
  porque es contexto en voz baja; "si la piel arde" va como apoyo aunque esté al
  pie, porque es lo que hay que hacer.
- **`/35`**, sólo en un control deshabilitado y con `disabled:`.

`contraste.test.ts` no deja pasar ningún otro valor.

### Historia, para no repetir el error

La paleta anterior tenía `agua #6fb2c0` en **2,12:1** —y era el color de *todas*
las etiquetas chicas del sitio— y el botón de compra en **3,13:1**. O sea que lo
único que genera comisión no se leía al sol. Cualquier color nuevo se mide antes
de entrar.

## Tipografía

| Familia | Uso |
|---|---|
| **Newsreader** | `font-display` — títulos |
| **Instrument Sans** | `font-body` — texto corrido |
| **Instrument Sans** | `font-etiqueta` — etiquetas chicas, datos, precios |

**Newsreader** es la serif de los títulos desde el 15/9. Beauty of Joseon titula
en Proxima Sera, que es paga; de las libres, Newsreader es la más parecida
—híbrida, con x-height amplia— y trae eje de tamaño óptico, así que el mismo
archivo sirve para el titular y para un título chico. Se comparó contra
Instrument Serif, más angosta y de revista, y ganó Newsreader.

Las etiquetas cortas ("paso 01 · limpiador", "25 productos", "tipo de piel") van
en Instrument Sans a 12px, en mayúscula y con aire entre letras: `ETIQUETA` en
`estilo.ts`. Antes fueron Space Mono y después Bricolage Grotesque, que también
titulaba: con la serif en los títulos, una tercera familia sobraba.

### Tamaños

El tamaño lo decide el rol del texto, no cuánto espacio queda:

| Rol | Tamaño mínimo |
|---|---|
| Etiqueta, dato, leyenda, cita, nota al pie | `text-xs` · 12 px |
| Texto corrido | `text-sm` · 14 px |
| **Instrucción que la persona tiene que seguir**, aunque sea secundaria | `text-sm` · 14 px |
| Campo de formulario (`input`, `select`, `textarea`) | `text-base` · 16 px, declarado en el campo |

- **12 px es el piso.** Lighthouse marca como difícil de leer en móvil todo lo
  que baja de ahí. Hasta el 13/9 había seis `text-[11px]` sueltos —la banda de
  precio, la marca del catálogo, los chips y la tabla de combinaciones— y el
  crédito de la foto de la home a 10,56 px.
- **Una instrucción no es una nota al pie.** El aviso de un paso que no es un
  match limpio, o qué hacer si la piel arde, se lee antes de comprar o en el
  momento en que algo sale mal. Por eso van a 14 px, aunque estén en un segundo
  plano visual.
- **Los campos van a 16 px** porque Safari en iPhone agranda la página al
  enfocar un campo con letra más chica. Apple no lo documenta; está reproducido
  de forma independiente. Va declarado en el campo porque Tailwind hace que los
  campos hereden la letra, y lo heredado depende de dónde se monte.
- **Sólo tamaños con nombre:** la escala de Tailwind, más `text-titular`
  (2,1 rem) para el titular de la home, que está definido en `theme.css`.

Como referencia, Apple, en iOS, pone el texto normal en 17 pt, las notas al pie
en 13 y las leyendas en 12 y 11, que es su mínimo. Las etiquetas y notas a 12 px
entran en ese rango. Lo que se sale es usar ese tamaño para una instrucción.

`tipografia.test.ts` hace cumplir el piso, los campos y los nombres. El rol no lo
puede ver.

## Logo

Tres arcos concéntricos que se cierran sobre un punto, en `piedra`.

**Lectura del símbolo:** capas de piel vistas desde arriba, cerrándose hacia un
centro. Es lo que hace la rutina — capa sobre capa, en orden, hacia un punto.
Importa que signifique algo concreto y no sea un ícono genérico de belleza.

Implementado como **SVG inline** (`src/components/Logo.tsx`), no como archivo:
hereda `currentColor`, escala sin pixelarse y pesa menos que cualquier PNG. Los
arcos se dibujan con `stroke-dasharray` sobre círculos completos, así que la
apertura y la rotación se ajustan cambiando dos números.

> Nota: la versión en código es una reconstrucción a partir de la imagen que pasó
> Alex. Si aparece el SVG original, reemplazarlo.

## Voz

Argentina, directa, de mentor y no de influencer. Voseo. Sin palabras técnicas
innecesarias.

### Prohibido

**El cliché de skincare.** Si una frase podría estar en cualquier marca del
rubro, no sirve.

- ❌ "Tu piel, sin vueltas" · "Transformá tu piel" · "Descubrí el secreto" ·
  "Rutina de ensueño" · "Glow natural"

**Los claims médicos**, aunque los diga la ficha de Mercado Libre:

- ❌ "Clínicamente comprobado" · "Reduce la inflamación" · "Repara la piel
  dañada" · "Efecto anti-edad" · cifras de laboratorio del fabricante
  ("elimina el 92,69% del polvo fino")

Todo el copy de producto se escribe de cero. El texto crudo de la ficha de ML
nunca se renderiza.

**Prometer lo que no se cumple.** Una bajada que decía "No vendemos nada" se
descartó antes de publicar: sí se cobra comisión, y se aclara en cada ficha. El
headline no puede contradecir el disclaimer.

### Funciona

- "Qué comprar, en qué orden y por qué."
- "Elegimos producto por producto, te explicamos por qué, y te dejamos el link."
- "Ninguna es mejor — la que funciona es la que hacés todos los días."
- "Todavía no tenemos una opción para piel sensible en este paso. Esta es la
  mejor que hay, pero revisala si tu piel reacciona fácil."

Esa última muestra el tono: se dice lo que falta, sin adornar.

## Bloque de transparencia de afiliados

Va en toda pantalla con links de compra a la vista. **Nunca antes** — en el home
no viene a cuento.

> \* Si comprás por estos links, cobramos una comisión sin costo extra para vos.
> \* Ante un problema de piel, consultá a un dermatólogo.

En tipografía y jerarquía normales. Nunca en letra chica.
