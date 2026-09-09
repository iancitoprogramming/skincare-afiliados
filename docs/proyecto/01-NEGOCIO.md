# Negocio y monetización

## Qué vende Club de Piel

Nada, literalmente. Es un sitio de **recomendación con links de afiliado**. No
tiene stock, ni carrito, ni cobra. El CTA de toda la plataforma es
*"Ver en Mercado Libre"*.

Lo que se vende, en realidad, es **criterio**: qué comprar, en qué orden y por
qué. El producto lo despacha Mercado Libre.

## Quiénes

- **Ian** — dueño de la marca, decide producto y criterio editorial.
- **Alex** — socio. Trabaja en paralelo sobre el catálogo (vault de Obsidian,
  `products.json`) y aportó el motor de compatibilidad entre activos.

## Cómo entra la plata

**Comisión del Programa de Afiliados de Mercado Libre.** La persona hace clic,
compra en ML, y ML paga comisión. El precio que paga el comprador no cambia.

### Las dos cuentas

Los links salen de dos cuentas de afiliado distintas:

| Cuenta | De quién es | Perfil | Catálogo |
|---|---|---|---|
| `goldenvalhalla` | **Ian** | — | Mix europeo y nacional |
| `maurobilat` | **Alex** | **Club de Piel** | Mayoría coreana |

> **Están migrando a una sola.** Soporte del Programa indicó que un mismo
> proyecto debe operar con una única cuenta afiliada, porque cada afiliado cobra
> sólo por los canales declarados en la suya. Quedó `maurobilat`; `goldenvalhalla`
> sale. Faltan regenerar 35 links, 13 de ellos activos. Ver `07-AFILIADOS.md`.

De quién es cada cuenta estaba sólo en la cabeza de los dos, y eso ya se dio
vuelta una vez: se afirmó que `maurobilat` era la de Ian y se le dijo que había
mandado dos links mal etiquetados cuando en realidad los había mandado bien.
El handle no dice el nombre, así que va escrito acá.

### Las redes

| Red | Handle | Estado |
|---|---|---|
| Pinterest | `pinterest.com/ClubDePiel` | business · dominio verificado |
| Instagram | `@clubdepielok` | creada · vinculada a Pinterest |
| TikTok | `@clubdepielok` | creada |
| YouTube | `@clubdepiel` | creada |
| Facebook | — | descartada por ahora |

El handle no es igual en todas y está bien: YouTube tenía libre el corto y las
otras no. Lo que sí es igual en las cinco es el **nombre visible**, "Club de
Piel", que es lo que la gente ve y busca. El handle sólo importa para citarse
entre redes, y ahí las dos que se citan —Instagram y TikTok— coinciden.

La verificación de dominio de Pinterest está hecha contra `https://clubdepiel.store`
con el método de etiqueta HTML: el código vive en Vercel como
`NEXT_PUBLIC_PINTEREST_VERIFY` y sale en el `<head>` desde `layout.tsx`. Si
alguna vez el sitio deja de emitir esa etiqueta, Pinterest desverifica el
dominio y se pierden las estadísticas y los pines enriquecidos.

Los textos de perfil de cada red —nombre, bio con su límite de caracteres,
primeras piezas— están fuera del repo, en el documento de redes.

### Cómo se ve un link que paga

Los links son shortlinks **`meli.la`**, generados a mano desde el panel de
Afiliados. Resuelven a `mercadolibre.com.ar/social/<cuenta>?matt_tool=…&ref=…`.

**Un link que NO paga** es una URL de producto copiada de la búsqueda:

```
https://www.mercadolibre.com.ar/producto/p/MLA123#polycard_client=search-desktop&tracking_id=…
```

Ese `tracking_id` es la sesión de búsqueda de ML, no un tag de afiliado. Y va
después del `#`, así que ni siquiera llega al servidor.

**Este es el error más caro del proyecto**: el sitio funciona igual, la persona
compra, y no se cobra nada. No hay ninguna señal visible. Por eso existe
`npm run check-links`, que falla si un producto activo tiene un link que no
atribuye.

### Ventana de atribución

24 horas desde el primer clic. Es un hecho real y se comunica como tal, sin
falsa urgencia: *"Abrí los productos que quieras: el primer clic te guarda la
rutina por 24 horas."*

## La escalera de precios

Ordenada por fricción, de menos a más:

| Producto | Precio | Checkouts |
|---|---|---|
| Kit Libra · piel grasa y acneica | $22.314 | **1** |
| Kit Libra · rutina piel mixta | $45.900 | **1** |
| Kits armados por nosotros | $101.125 – $137.636 | 3 |
| Producto suelto | $15.488 – $114.414 | 1 |

**Aprendizaje central:** los kits de **compra única** son publicaciones de ML que
ya vienen con varios productos adentro — un link, un pago, un envío. Los kits
armados por nosotros son N productos y N checkouts. La compra única convierte
mejor y por eso va primero en la página de kits.

Ojo con no mentir: si un kit son tres compras separadas, hay que decirlo antes
del checkout, no después.

## Canales

**Pinterest es el canal prioritario.** Eso condiciona la arquitectura entera:
Pinterest es un canal de *browse*, un pin equivale a un producto, y un pin
necesita una URL propia a la que llevar. Por eso cada producto tiene su página.

Después: TikTok, YouTube, Instagram, Facebook.

Consecuencia técnica: el `og:image` y los metadatos tienen que resolver a URLs
absolutas de producción. Si `metadataBase` queda en localhost, el preview del pin
sale vacío.

## Qué medir

Todavía **no se mide nada**: sin las variables de Supabase en producción, cada
clic, sesión y email se descarta en silencio. Es el bloqueante #1 para lanzar,
porque sin eso se lanza a ciegas.

Cuando esté prendido, lo que importa:

- Clics a ML por visita
- Qué producto y qué kit se clickean
- Ratio kit de compra única vs kit armado
- Qué filtros del catálogo se usan
- De qué canal viene cada sesión (utm)

## Riesgos conocidos

**Los coreanos casi no tienen prueba social en ML.** Los europeos y nacionales
venden decenas de miles de unidades; los coreanos están entre 5 y 100. Tres de
ellos tienen 5,0 estrellas con **una sola opinión**. Es el choque más serio con
el posicionamiento K-beauty: los productos que la marca quiere empujar son los
que menos respaldo muestran en la plataforma donde se compran.

Por eso la calificación sólo se muestra con 10 o más opiniones. Las ventas y la
reputación del vendedor van siempre, que no tienen ese problema.
