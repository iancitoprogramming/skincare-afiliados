# Handoff para marketing

> Escrito el 16/9/2026 al cerrar la conversación de producto (fondo de la home,
> Resend, sincronización de catálogo). Es el punto de partida del chat que arma la
> campaña. Todo lo de acá está medido contra `main` (`293236d`) y contra Supabase
> ese día; lo que no se midió, lo dice. Se lee junto con `01-NEGOCIO.md` (qué
> vende y cómo cobra) y `02-MARCA.md` (paleta, tipografía, voz). Quien lo use
> tiene que traer además **el documento de redes** (bios, nombres de perfil,
> primeras piezas), que vive fuera del repo.

---

## 1 · Qué se vende, en una línea

**Criterio.** Club de Piel no tiene stock ni carrito: recomienda una rutina de
skincare y manda a comprar a Mercado Libre con links de afiliado. La comisión la
paga Mercado Libre; el precio del comprador no cambia. La promesa no es "el mejor
producto" sino **"cuál va con cuál"**: el motor cruza los activos de cada producto
con los de los demás para que la rutina no se contradiga.

El titular de la home, que es la tesis: *"El problema no era el producto. Era
cuál iba con cuál."* Tagline: *"No es el producto, es cuál va con cuál."*

## 2 · Quién es quién

- **Ian** — dueño de la marca. Decide producto, criterio editorial, copy y
  prioridades. Es quien corre las operaciones (sync del catálogo, variables de
  Vercel).
- **Alex** — socio. Catálogo (vault de Obsidian), motor de compatibilidad, y desde
  el 15/9 **la dirección visual** (home editorial, paleta, tipografía) y el brand
  kit en Canva. Su cuenta de GitHub es `ExtremeImagery`.
- Las sesiones de Claude trabajan sobre el repo por PR, con la identidad
  `iancitoprogramming`. Todo cambio al sitio pasa por ahí.

## 3 · El sitio hoy (`clubdepiel.store`)

**El embudo:**

1. **Home** — editorial, fondo marfil, títulos en serif. Tres puertas: *Armá tu
   rutina* (quiz), *Todo el catálogo*, *Kits ya armados*. Debajo, "cómo funciona"
   y "preguntas antes de empezar". **No pide el correo.**
2. **Quiz** (`/rutina`) — 5 preguntas, ~40 segundos, una por pantalla, avanza al
   elegir. Cada pregunta lleva una línea de "por qué esta pregunta". Se puede
   entrar con una respuesta puesta: `/rutina?o=manchas` arranca con el objetivo
   elegido (`acne`, `manchas`, `textura`, `deshidratacion`). La home ya usa esos
   cuatro links como chips.
3. **Resultado** — la rutina por pasos (mañana / noche), con "ya tengo uno" por
   paso, hasta dos alternativas por paso chequeadas contra la rutina entera, y
   plegados: "cómo combinarlos", "esto se potencia", los mitos, y por qué estos.
   **Acá, y sólo acá, se pide el correo** ("guardá tu rutina"). La URL del
   resultado es compartible: `/rutina?p=mixta&o=manchas&b=2&k=tanto&n=1` rearma
   la misma rutina.
4. **El mail** — al dejar el correo llega "Tu rutina, guardada" con el link a su
   rutina (Resend, desde `hola@clubdepiel.store`). El contacto entra a un segmento
   con un topic en opt-in y tiene link de baja. **No se promete frecuencia**: el
   mail dice "te escribimos poco, y sólo cuando cambia algo que te afecte". No hay
   newsletter armado todavía: hay una base y un remitente.

**Lo demás:** `/catalogo` (78 productos activos, con filtros), `/kits` (7 kits: 2
de **compra única** —un link, un pago, un envío— y 5 armados por nosotros, que
son N checkouts), `/producto/<slug>` (78 fichas: por qué lo elegimos, cómo se
usa, prueba social de Mercado Libre, botón "Ver en Mercado Libre" y, debajo, el
cruce de vuelta al quiz), `/combinaciones` (la matriz de qué activo va con cuál:
es la página de credibilidad).

**Números reales para usar en piezas** (medidos el 16/9): 78 productos activos,
7 kits, 5 preguntas, 344 de 360 rutinas posibles sin ningún conflicto y ninguna
con algo que haya que separar. Catálogo: 48 europeo, 19 coreano, 11 nacional. No hay ningún otro
número que se pueda afirmar: ni clientas, ni reseñas propias, ni resultados.

## 4 · Marca y voz — lo que una pieza no puede romper

La paleta y la tipografía están en `02-MARCA.md` y en `paleta.ts`; Alex las
tiene en Canva. En resumen: fondo marfil `#FBFAF7`, texto `#1B2430`, azul del
logo `#5A6B85`, verde `#4A6B57`, terracota `#C2410C` **sólo para comprar**,
Newsreader (serif) para títulos e Instrument Sans para el resto. Referencia
visual: Beauty of Joseon, **sin iconografía coreana** (el catálogo es mayormente
europeo), sin fotos con gente ni con marcas a la vista, y sólo fotos con
licencia verificada.

**Voz:** argentina, directa, de mentor y no de influencer. Voseo. Se dice lo que
falta sin adornar. Lo que funciona: *"Qué comprar, en qué orden y por qué."*,
*"Ninguna es mejor — la que funciona es la que hacés todos los días."*

**Prohibido, y hay un test que lo frena en el sitio** (`claims.ts`):

- el cliché de skincare — "tu piel, sin vueltas", "descubrí el secreto", "glow";
- **claims médicos**, aunque los diga la ficha de Mercado Libre — "clínicamente
  comprobado", "cura", "trata", "elimina", "repara", "revierte",
  "antiinflamatorio", "garantiza", "milagro", "en N días/semanas";
- prometer lo que no se cumple — el headline no puede contradecir el
  disclaimer; "una vez por semana" fue la primera promesa incumplida y se sacó.

Para una pieza, el filtro es el mismo: si podría estar en cualquier marca del
rubro, no sirve; si promete un resultado en la piel con plazo, no va.

**Afiliación:** en toda pantalla con links de compra se declara *"Si comprás por
estos links, cobramos una comisión sin costo extra para vos"* y *"Ante un
problema de piel, consultá a un dermatólogo"*, en tipografía normal, nunca en
letra chica. Una pieza de campaña con link de compra tiene que poder decir lo
mismo.

**Precios:** el sitio **no publica precios**; usa bandas (accesible, equilibrado,
premium) porque un precio de Mercado Libre copiado a mano queda viejo en días.
Una pieza con un número de precio miente en una semana.

## 5 · Los canales y su estado

| Red | Handle | Estado |
|---|---|---|
| Pinterest | `pinterest.com/ClubDePiel` | business · **dominio verificado** contra `clubdepiel.store` |
| Instagram | `@clubdepielok` | creada · vinculada a Pinterest |
| TikTok | `@clubdepielok` | creada |
| YouTube | `@clubdepiel` | creada |
| X | — | declarada como Medio en la cuenta de afiliados, sin handle |
| Facebook | — | descartada por decisión |

Todas están declaradas como Medios en la cuenta de afiliados `maurobilat`, que es
la única que paga desde el 9/9. **Un link que se comparta en una red no declarada
no cobra.**

**Lo que ya existe para compartir:** una imagen de Open Graph 1200×630 por
producto y una por defecto, con el lenguaje del sitio. WhatsApp y Facebook la
usan bien. **Para Pinterest falta una decisión de Ian**: Pinterest recomienda
2:3, y ofrecerle otra imagen sin cambiar la de las demás redes exige cargar su
script en el sitio (ver `HANDOFF.md` §6.2). Hoy, al pinear, la persona elige
entre las imágenes de la página.

## 6 · Cómo se mide

- **Supabase**, prendido en producción: `sesiones` (una por quiz completado, con
  las respuestas y los `utm_*` de la URL de entrada), `clicks` (cada clic a
  Mercado Libre, con producto y posición), `leads` (correos). Medido el 16/9, los
  últimos 7 días: **7 sesiones, 10 clics, 2 correos**. Es el piso desde el que
  arranca la campaña.
- **Vercel Analytics** en todas las páginas.
- **Los links de campaña tienen que llevar `utm_*`**: el quiz los lee de la URL
  y los guarda con la sesión. Sin eso no se puede atribuir un clic a una pieza.
  Ejemplo: `https://clubdepiel.store/rutina?o=manchas&utm_source=pinterest&utm_campaign=manchas`.
- **Resend** guarda los contactos por segmento; el aviso de cada alta llega a la
  casilla de `NOTIFY_EMAIL`.
- **Ventana de atribución de Mercado Libre: 24 horas desde el primer clic.** Se
  puede decir tal cual; no se inventa urgencia.

Cómo leer los conteos sin tocar nada: hay un script de comparación de catálogo
(`npm run comparar`) y los conteos se sacan de Supabase con la service key desde
la máquina de Ian. Pedírselo a él o a una sesión con acceso; no hay panel.

## 7 · Activos disponibles

- **Fotos de producto:** `assets/productos/*.webp`, sobre blanco, tamaños
  irregulares (de 176×979 a 1200×1185). Para 2:3 de Pinterest casi ninguna da el
  alto sola: necesitan fondo o composición.
- **Fotos de la home:** en `src/niches/skincare/fotos-home.ts`, Unsplash License
  verificada una por una, acreditadas al pie. Se pueden reusar en piezas con la
  misma atribución.
- **Logo:** tres arcos concéntricos sobre un punto, en azul `#5A6B85`; SVG en
  `src/components/Logo.tsx`. Lectura: capas de piel cerrándose hacia un centro.
- **Imágenes OG** (1200×630) por producto: `/api/og/producto/<slug>`.
- **El mail** de bienvenida/rutina, ya con la paleta del sitio.
- **No hay:** fotos propias de ingredientes (los bancos libres no tienen la
  calidad; es una compra o una producción), fotos de piel real, testimonios,
  reseñas propias ni "madrinas". La prueba social disponible es la de Mercado
  Libre (estrellas y ventas por producto, con fecha de relevamiento).

## 8 · Los ángulos de contenido que el sitio ya sostiene

Son los que el sitio puede respaldar con una página; una pieza que apunte a
otro lado no tiene dónde aterrizar.

1. **"Cuál va con cuál"** — la tesis. Aterriza en `/combinaciones` y en el quiz.
2. **Los mitos** — "vitamina C y niacinamida no se pueden mezclar" y otros, con
   *lo que se dice / lo que se sabe*. Viven en el resultado del quiz; son piezas
   casi hechas.
3. **Los pasos que sobran** — tónico, doble limpieza, exfoliante: "preferimos
   cuatro pasos todos los días antes que seis tres veces por semana". Aterriza en
   el quiz (pregunta "¿querés sumarle algo a la base?").
4. **Entrar por lo que te preocupa** — granitos, manchas, textura, tirantez. Un
   link por preocupación: `/rutina?o=…`. Es la pieza más directa.
5. **Los kits de compra única** — un link, un pago, un envío. Convierten mejor
   que tres checkouts; van primero en `/kits`.
6. **"Ya tengo uno"** — la rutina se arma alrededor de lo que la persona ya
   tiene; el sitio promete "sin comprar dos veces lo mismo" y lo cumple.

## 9 · Restricciones duras que no se negocian

- **Todo link que se comparta tiene que monetizar**: shortlinks `meli.la`
  generados desde el panel de afiliados, nunca una URL de producto copiada de la
  búsqueda (esa no atribuye y nadie lo nota). `npm run check-links` lo vigila en
  el sitio; en una pieza lo vigila quien la arma.
- **Sin claims médicos y sin precios**, por lo dicho arriba.
- **Nada de tráfico automatizado contra `clubdepiel.store`**: Vercel tiene
  escudo anti-bots y un polling ya lo disparó. Las herramientas de preview de
  links de cada red pasan; un script propio, no.
- **El catálogo de producción es Supabase**, no el archivo: un cambio de
  catálogo llega a producción sólo cuando Ian corre `npm run sync` (hecho el
  16/9; todo al día).

## 10 · Pendientes que a marketing le importan

- Decisión de Ian sobre la imagen 2:3 para Pinterest (§5).
- 6 productos con activos sin verificar (necesitan la caja) y 9 atados a un solo
  vendedor: no conviene que una pieza los tenga de protagonista hasta que se
  cierren (`docs/AUDITORIA-PRODUCTOS.md`, `docs/listados-atados.md`).
- Las preguntas frecuentes de la home son hipótesis: cuando haya respuestas
  reales de clientas a "¿qué casi te frena?", se reescriben con esas. La campaña
  es la forma de conseguirlas.
- Fotos propias de ingredientes: no hay y no se pueden sacar de bancos.
- X: sin handle. Si se va a usar, hay que crearlo y declararlo como Medio.
- Los textos de "por qué esta pregunta" del quiz son borrador de Ian.

## 11 · Por dónde empezar

Un orden razonable para el primer chat de campaña, con lo que hay:

1. **Fijar el objetivo y la métrica**: hoy se puede medir sesiones (quiz
   completados), clics a Mercado Libre y correos, por `utm`. Elegir una.
2. **Un link por preocupación con `utm`**, y una pieza por link (§8.4). Es lo que
   el sitio mejor aterriza y lo más fácil de medir.
3. **Pinterest primero**: es la única red con el dominio verificado, es de
   búsqueda (el contenido rinde meses, no horas) y el producto —una rutina por
   preocupación— es exactamente lo que ahí se busca. Resolver antes lo de la
   imagen 2:3 con Ian.
4. **Los mitos como serie** para Instagram y TikTok: ya están escritos con la
   voz del sitio y cada uno aterriza en el resultado del quiz.
5. **Medir a la semana** con los conteos de Supabase, contra el piso de §6.

Lo que no conviene hacer: prometer newsletter, publicar precios, usar productos
sin verificar, o mandar tráfico a la home cuando la pieza habla de una
preocupación concreta (que aterrice en `/rutina?o=…`).
