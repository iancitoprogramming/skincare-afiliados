# Técnico

## Stack

| Capa | Qué |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 · Tailwind CSS 4 |
| Tipado | TypeScript |
| Tests | Vitest |
| Datos | Supabase (opcional — hay fallback local) |
| Deploy | Vercel |
| Analytics | Vercel Analytics |

**Repo:** `github.com/iancitoprogramming/skincare-afiliados`
**Producción:** `clubdepiel.store`  ·  **Deploy previo:** `skincare-afiliados.vercel.app`

## Estructura

```
src/
├── app/                        rutas
├── assets/home/                las fotos de la home (Unsplash)
├── components/                 Shell · Logo · CatalogoGrid · BotonComprar · PruebaSocial
├── lib/                        utilidades sueltas
│   └── sitio.ts                URL absoluta del sitio + log del build
├── engine/                     lógica agnóstica del nicho
│   ├── recomendacion.ts        el motor: cascada de fallbacks
│   ├── kits.ts                 KitDef · KitUnico · armarKit
│   ├── slug.ts                 slugs estables de producto
│   ├── catalogo.ts             lee Supabase, cae al fallback local
│   ├── compatibilidad.ts       compatibilidad entre activos (de Alex)
│   ├── tracking.ts             sesiones · clics · leads
│   └── quiz/                   Quiz · Resultados · PasoRutina · servible
└── niches/skincare/            todo lo que sabe de skincare
    ├── productos.ts            EL CATÁLOGO — fuente de verdad
    ├── kits.ts                 definiciones de kits
    ├── config.ts               tiers · categorías · quiz · rama
    ├── copy.ts                 todos los textos
    ├── fotos-home.ts           las fotos de la home, su licencia y su crédito
    ├── activos.ts              activos e interacciones (de Alex)
    └── theme.css               paleta y tipografías
```

**La separación importa:** `engine/` no sabe de skincare. Todo lo que es del
nicho vive en `niches/skincare/`. Para otro nicho se copia esa carpeta.

## Scripts

```bash
npm run dev              # servidor de desarrollo
npm test                 # vitest
npm run check-links      # falla si un producto activo no monetiza
npm run frescura         # qué relevamientos quedaron viejos (>30 días)
npm run links-pendientes # arma el MD con los links que faltan generar
npm run links-aplicar    # lee ese MD completado y los escribe en el catálogo
npm run cuentas          # a qué cuenta de afiliado le paga cada link
npm run cobertura        # dónde el motor cae a comodín o match parcial
npm run gen-seed         # productos.ts → supabase/seed.sql
npm run sync             # sube el catálogo a Supabase
npm run importar-vault   # vault de Obsidian → catálogo, dedup por ml_id
```

## Variables de entorno

**El sitio buildea y funciona sin ninguna.** Sin Supabase usa el catálogo local.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # sólo scripts locales
NEXT_PUBLIC_SITE_URL=             # dominio propio, cuando lo haya
NEXT_PUBLIC_PINTEREST_VERIFY=     # código de reclamo de dominio
RESEND_API_KEY=                   # mail al dejar el correo · Sensitive en Vercel
RESEND_FROM=                      # "Club de Piel <hola@clubdepiel.store>"
RESEND_SEGMENT_ID=                # segmento del contacto (referencia, no secreto)
RESEND_TOPIC_ID=                  # topic del contacto; habilita el link de baja
NOTIFY_EMAIL=                     # opcional: aviso interno por cada correo nuevo
```

**Sin las dos primeras el tracking es un no-op silencioso.** Todo clic, sesión y
email se descarta. Es el bloqueante para lanzar con medición.

**Sin `RESEND_API_KEY` no sale ningún mail**, pero el lead se guarda igual. Con
la key, al dejar el correo el contacto entra al segmento con el topic en
opt-in y recibe la bienvenida; si vino del resultado del quiz, el mail trae el
link a su rutina (`src/lib/resend.ts`, plantilla en `src/lib/emails/`). Todo
best-effort y después de responder (`after()`): un error de Resend se registra
y no le cambia nada a la persona. La key es de "Sending access", restringida al
dominio, y nunca lleva `NEXT_PUBLIC_`.

`metadataBase` resuelve dominio propio → dominio estable de Vercel → URL del
deploy → localhost (`src/lib/sitio.ts`). Los del medio los setea Vercel solo.

El valor se **normaliza**: se le agrega `https://` si falta y se le saca la barra
final. Sin eso, pegar `clubdepiel.com.ar` hace que `new URL()` tire y el build
falle con un error que no explica nada, y pegar `https://clubdepiel.com.ar/`
genera og:image con doble barra. Los dos son errores de copiar y pegar en el
panel de Vercel.

Cada build imprime a qué resolvió:

```
[metadata] base = https://clubdepiel.com.ar
[metadata] pinterest = presente
```

Es la única forma de verlo sin abrir la HTML publicada. Sale repetido una vez
por worker de Next, que está bien.

## Verificación después del deploy

En el log del build de Vercel tienen que aparecer las dos líneas `[metadata]`:

```
[metadata] base = https://clubdepiel.store
[metadata] pinterest = presente | AUSENTE
```

**Si `base` dice localhost, algo está mal configurado y los pins van a salir sin
imagen.** Es el error más caro de este proyecto porque no se nota: el sitio
carga bien, el link se comparte, y el preview aparece vacío.

**Localhost no es la única forma de romperlo.** Al conectar `clubdepiel.store`
pasó la variante que este documento no preveía: `base` resolvió a
`https://www.clubdepiel.store` —el subdominio `www`, que en Vercel figuraba
como dominio de producción pero **no tenía registro DNS**—. El apex servía el
sitio con normalidad y el `og:image` apuntaba a un host inexistente. Mismo
síntoma, causa distinta: el chequeo no es "¿dice localhost?" sino "¿ese host
existe y devuelve la imagen?".

Sin acceso al dashboard, la misma verificación se hace desde afuera y es más
fuerte, porque mira el resultado y no el paso intermedio:

```bash
curl -s https://clubdepiel.store/ | grep -o 'og:image" content="[^"]*"'

# …y después pedir ESA url, que es lo que el chequeo anterior no hace:
curl -sI "$(curl -s https://clubdepiel.store/ | grep -o 'og:image" content="[^"]*' | cut -d'"' -f3)" | head -1
```

Tiene que devolver una URL absoluta con el dominio de producción. Si dice
`localhost`, `base` resolvió mal. Después, que esa URL devuelva `200` y
`image/png`.

## Pinterest: el pin 2:3 y el botón Guardar

Cada ficha tiene un botón "Guardar en Pinterest" (`GuardarEnPinterest.tsx`) que le
ofrece a Pinterest `/api/pin/producto/[slug]`, 1000×1500, en vez de la imagen de
1200×630 que usan las demás redes. La foto del producto de la ficha lleva los
mismos datos en `data-pin-media`, `data-pin-url` y `data-pin-description`, que lee
el selector de imágenes de Pinterest (`pinmarklet.js`): si alguien guarda desde la
extensión, también se lleva el pin 2:3.

El botón es un link a la URL de creación de pin de Pinterest
(`/pin/create/button/?url=…&media=…&description=…`) y funciona sin ningún script:
probado el 16/9, la URL sola abre el formulario de Pinterest con la imagen de
`media`.
`pinit.js` se carga sólo en las fichas y le agrega que el formulario se abra en
una ventana chica en vez de otra pestaña.

**Qué le manda `pinit.js` a Pinterest**, leído de su código y medido en el
navegador el 16/9/2026: pide el script a `assets.pinterest.com`; un segundo
después, un beacon a `log.pinterest.com` con `event=init`, la URL de la página
(`via`) y el idioma del navegador (`nvl`), aunque nadie toque el botón; y en cada
clic, otro con `event=button_pinit_custom`. Salen con la IP de la persona y con
las cookies de Pinterest que tenga su navegador.

**No usar `data-pin-custom`.** En ese modo `pinit.js` le borra el `href` al link
(`removeAttribute("href")`) y lo abre desde un listener propio, así que el botón
deja de recibir foco con el teclado. El link lleva `data-pin-do="none"`, para que
`pinit.js` no lo toque, y el clic llama a `PinUtils.pinOne`.

**Para sacar `pinit.js`**, se borra el `<Script>` de `GuardarEnPinterest.tsx`: el
link sigue abriendo el mismo formulario, con la misma imagen, en otra pestaña.

## Convenciones de código

**Los comentarios explican el porqué, no el qué.** Si un comentario describe lo
que la línea siguiente ya dice, sobra. Los que valen son los que explican una
decisión: por qué el desempate de kits es por precio, por qué el slug no incluye
la categoría, por qué el tónico sale en la rama occidental.

**Nombres en español**, como el dominio. `armarRutina`, `elegirPaso`,
`tiersServibles`, `no_apto_sensible`.

**Fallar fuerte antes que servir mal.** `indicePorSlug()` tira excepción ante una
colisión en vez de devolver el producto equivocado. El motor tira excepción si
falta un comodín en vez de dejar un paso vacío.

**Los tests documentan el estado real**, no el ideal. Hay uno que afirma qué
tiers son servibles hoy y cuáles categorías faltan para el Tier 4: cuando se
carga catálogo, ese test falla y avisa que hay que actualizarlo. Es a propósito.

## Trampas conocidas

**`next build` con el dev server prendido corrompe `.next`.** Aparece como
`Cannot find module './vendor-chunks/...'` o pantalla negra. Solución:
`rm -rf .next` y reiniciar el dev.

**Polling con curl contra Vercel dispara el escudo anti-bots.** Aparece como 403
con `X-Vercel-Mitigated: challenge`. Los navegadores lo pasan solo, pero **el
crawler de Pinterest es un bot** y podría comerse el challenge — con lo cual el
preview del pin sale vacío. Revisar Vercel → Settings → Firewall.

**Los archivos usan LF.** En Windows Git avisa que va a convertir a CRLF: es
normal, no es un error.

## Flujo de git

Rama `main`. Vercel deploya solo en cada push.

Commits descriptivos que expliquen **la decisión**, no sólo el cambio. Cuando un
commit corrige algo que se rompió, decir qué se rompió y por qué.
