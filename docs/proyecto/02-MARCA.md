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

## Paleta

Todos los colores que llevan texto pasan **WCAG AA (4.5:1)** sobre el fondo.
Medido sobre la página renderizada, no en el papel.

| Token | Hex | Rol | Contraste |
|---|---|---|---|
| `porcelana` | `#f4f6f3` | fondo | — |
| `tinta` | `#1b2430` | texto principal | 14,40:1 |
| `piedra` | `#5a6b85` | texto secundario · **color del logo** | 4,98:1 |
| `salvia` | `#4a6b57` | verde de marca | 5,47:1 |
| `gel` | `#dce7de` | superficie verde suave | fondo, no texto |
| `terracota` | `#c2410c` | CTA | 4,76:1 con `porcelana` encima |
| `niebla` | `#cbd5d0` | bordes | no texto |

**La decisión que hace funcionar el sistema:** `piedra` es el azul del logo *y* el
color del texto secundario. Eso resuelve tener un logo azul grisáceo en una marca
verde — el logo deja de ser un acento suelto y pasa a ser el ancla fría de todo
el sistema.

### Sobre qué capa va cada texto

Pasar sobre `porcelana` no alcanza. Casi todo el texto vive sobre una tarjeta o un
chip, y cada capa le baja el contraste: con las puertas de la home en `gel/40`,
el CTA terracota quedaba en **4,48:1**. Estas reglas las calcula
`contraste.test.ts` desde la paleta, y el mismo test las hace cumplir sobre las
clases de `src/`:

| Superficie | Dónde | Texto encima |
|---|---|---|
| **Clara:** de `porcelana` a `gel/35` | fondo, tarjetas, puertas | tinta desde `/65` · piedra, salvia y terracota enteros |
| **Teñida:** `piedra/NN`, `terracota/NN`, `niebla/NN`, `gel` sólido | chips de severidad, opción seleccionada del quiz | tinta desde `/70` — el color va en el fondo, no en la letra |
| `terracota` sólido | CTA, filtro activo | `porcelana` entero |

- **Un color con opacidad nunca pasa** (`text-piedra/80`, `text-porcelana/70`): va
  entero.
- **Por debajo del mínimo sólo va un control deshabilitado**, con la variante
  `disabled:`. WCAG 1.4.3 exime ese texto, y la variante ata el contraste bajo a
  que el control esté deshabilitado de verdad.
- **El escaneo no ve un fondo puesto en el padre y un texto en el hijo.** Por eso
  se mide también la página renderizada: así apareció la pista del quiz, que en
  `piedra` quedaba en 3,98:1 con la opción seleccionada.

### Historia, para no repetir el error

La paleta anterior tenía `agua #6fb2c0` en **2,12:1** —y era el color de *todas*
las etiquetas chicas del sitio— y el botón de compra en **3,13:1**. O sea que lo
único que genera comisión no se leía al sol. Cualquier color nuevo se mide antes
de entrar.

## Tipografía

| Familia | Uso |
|---|---|
| **Bricolage Grotesque** | `font-display` — títulos |
| **Instrument Sans** | `font-body` — texto corrido |
| **Space Mono** | `font-mono` — etiquetas, datos, precios |

La monoespaciada es la que da personalidad: se usa para etiquetas cortas en
minúscula ("paso 01 · limpiador", "25 productos", "tipo de piel").

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
