# Estado y pendientes

_Corte: 2026-09-06_

## Dónde está

| | |
|---|---|
| Producción | `skincare-afiliados.vercel.app` |
| Páginas estáticas | 69 |
| Productos en catálogo | 72 · 25 activos + 2 kits de compra única |
| Links que monetizan | 28 de 28 activos · 46 pendientes |
| Tests | 6 en verde |
| Tiers servibles | 1 y 2 (son los dos que existen) |

## Bloqueantes para salir a vender

**1 · Tracking apagado.** Sin las variables de Supabase en producción, cada clic,
sesión y email se descarta en silencio. Hoy se lanzaría a ciegas: no se sabría ni
cuántos clics a ML se generaron. Es el primero de la lista.

**2 · Escudo anti-bots de Vercel.** Se disparó haciendo polling con curl. Los
navegadores lo pasan transparente, pero el crawler de Pinterest es un bot y
podría comérselo — y ahí el preview del pin sale vacío. Revisar Vercel →
Settings → Firewall antes de mandar la URL a Pinterest.

**3 · Perfil business de Pinterest.** Falta crearlo y reclamar el dominio. El
meta `p:domain_verify` ya está cableado: se pega el código en
`NEXT_PUBLIC_PINTEREST_VERIFY` y listo, sin tocar código.

> Ojo: no está confirmado que Pinterest deje *reclamar* un subdominio de
> `vercel.app`. Si lo rechaza, se resuelve con dominio propio.

## Pendiente de UX

**Sistema visual.** La paleta y el logo ya están; falta la pasada de jerarquía,
espaciado y densidad para competir en un feed de Pinterest.

**Mockups** para Pinterest, TikTok, YouTube, Instagram y Facebook. Las 26 fotos
en alta están en `assets/productos/`.

> Aviso para los mockups: las fotos van de 176×979 a 1200×1185 según el producto.
> Para Pinterest (2:3, 1000×1500) **casi ninguna da el alto sola** — van a
> necesitar fondo o composición. Son fotos de producto sobre blanco.

## Pendiente de catálogo

- **46 productos sin link de afiliado** → `npm run links-pendientes` los lista
- **Protector solar mineral** → o renombrar la carpeta del vault
- **Producto barato**: limpiador y protector abajo de $35.000
- **Los coreanos casi no tienen prueba social** → buscar las mismas publicaciones
  en vendedores más grandes

## Decisiones tomadas — no reabrir

Esto ya se discutió y se decidió. Si algo lo contradice, es un error, no una
propuesta.

| Decisión | Por qué |
|---|---|
| **Lectura botánica**, no clínica ni de lujo | La decide el catálogo: centella, arroz, ginseng, caracol |
| **Los protectores coreanos van aptos para sensible** | Verificado contra las páginas de los fabricantes. Excepción consciente a la regla del vault |
| **El exfoliante sale de las rutinas** | Suma costo, riesgo y un paso, para un beneficio que no justifica la fricción |
| **Los tiers son 2, no 4** | Medido por Alex: el Tier 4 sumaba tres pasos, cero puntos de cobertura y 13× el costo |
| **El tónico y la doble limpieza no son pasos de la rutina** | Misma medición. Siguen en el catálogo como opcionales, con la explicación de por qué quedaron afuera |
| **La pregunta de origen se queda, pero sólo elige marca** | Cuando el tónico era un paso, responder "no quiero coreanos" lo sacaba. Ya no cambia la forma de la rutina, sólo qué marca toca en cada paso |
| **El glicólico de The Ordinary es exfoliante, no tónico** | ML lo vende como "tónico exfoliante", pero es un AHA leave-on. En el slot de tónico diría de usarlo dos veces por día |
| **Presupuesto cualitativo, no en pesos** | Los montos fijos quedan viejos solos y pasan a mentir |
| **El quiz es una puerta, no el default** | Pinterest es un canal de browse |
| **`/combinaciones` va en el pie** | Nadie llega de una red social buscando combinaciones de activos |
| **Rating sólo con 10+ opiniones** | Tres productos tienen 5,0 con una sola opinión |
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
tónico" cuando ningún tier lo tenía. Que git no marque conflicto no significa
que el resultado tenga sentido — después de un merge grande hay que leer los
archivos que ninguno de los dos lados marcó.

**Disparar el escudo de Vercel con polling.** Ver bloqueante 2.

## Lo próximo

1. Generar los 46 links de afiliado que faltan (`links-pendientes` → pegar →
   `links-aplicar`).
2. Perfil business de Pinterest con la URL de producción.
3. Las 7 imágenes del carrusel y la prueba social del above the fold — necesita
   producción de fotos y las respuestas de clientas a "¿qué casi te frena?".
