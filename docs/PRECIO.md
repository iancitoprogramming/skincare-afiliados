# Por qué el sitio no publica precios

> Decisión cerrada el 2026-09-06. Estaba abierta desde el handoff anterior (§6) y bloqueaba todo
> lo demás, porque cinco superficies de la UI dependían de la respuesta.
>
> **La decisión: se publica una banda cualitativa —accesible · equilibrado · premium— y el número
> en pesos no se muestra en ninguna parte.** El precio de hoy, con el descuento de hoy, está en la
> publicación de Mercado Libre, a un clic del botón.

---

## 1 · El problema, planteado por quien tiene razón

El pedido original era el correcto, y conviene dejarlo escrito con sus palabras:

> *"Si llegáramos a poner un precio fijo de catálogo, no tendríamos acceso a los descuentos ni a
> las actualizaciones de precio. Eso rompería la mecánica fundamental."*

Es exactamente así. Un precio de catálogo escrito a mano no envejece de a poco: envejece de golpe,
el día que el vendedor pone un 20% off. Y falla en el peor lugar posible — es el único dato del
sitio que la persona va a verificar tres segundos después, al abrir la publicación. Una rutina mal
armada tarda semanas en desmentirse; un precio mal puesto se desmiente en el clic siguiente.

La solución natural sería traer el precio fresco. No se puede.

## 2 · Por qué no se puede traerlo fresco

Tres puertas, las tres cerradas. Verificado el 2026-09-06 contra las fuentes de Mercado Libre, no
de memoria.

**La puerta del scraping está cerrada por contrato.** Los Términos y Condiciones para
Desarrolladores prohíben explícitamente usar *"robots, harvesters, spiders, scraping u otra
tecnología"* para acceder al contenido del sitio, y prohíben además almacenar ese contenido para
desarrollar servicios propios. No es una zona gris.

**La puerta del scraping está cerrada también por técnica.** El `robots.txt` de
`mercadolibre.com.ar` bloquea con `Disallow: /` a `ClaudeBot`, `Claude-User`, `GPTBot`,
`ChatGPT-User`, `PerplexityBot`, `Perplexity-User` y `Amazonbot`. El sitio no quiere ser leído por
un agente automático y lo dice en el único lugar donde eso se declara.

**La puerta oficial no da lo que necesitamos.** La API pide OAuth 2.0, y desde abril de 2025 hasta
la búsqueda exige token de un usuario autenticado. Peor: Mercado Libre está **retirando los campos
`price`, `base_price` y `original_price` de `/items`** y empujando a consultar precios por la API
de Prices, que es una herramienta para que un vendedor administre sus propias publicaciones — no
para que un tercero lea el precio de una publicación ajena. O sea: el camino legítimo está siendo
desmantelado justo en el campo que queríamos.

**Y el riesgo es asimétrico.** El activo del negocio no es el código: es la cuenta de afiliados.
Un scraper detectado no rompe una feature, puede costar la cuenta, y con la cuenta se van los 69
links que monetizan. Se arriesga todo para ganar un número.

## 3 · Las tres opciones, y por qué ganó la B

| | Qué era | Por qué no / por qué sí |
|---|---|---|
| **A** · No mostrar nada | Lo que ya decía `ISSUES.md` §N2 | Honesto, pero tira información que sí tenemos y que no caduca: la persona igual necesita saber si le alcanza antes de hacer clic |
| **B** · Banda cualitativa | El campo `rango_precio` (1-3) ya existía en los 71 productos | **Elegida.** Contesta la pregunta que el número contestaba de verdad —"¿me alcanza?"— y no envejece |
| **C** · API oficial con OAuth | Legítimo | Necesita credenciales de ellos, refresco de token cada 6 h, y apunta al campo que están retirando |

La banda no es un premio consuelo. El precio exacto nunca fue el dato que la persona usa en esta
pantalla: en esta pantalla se decide **si mirar o no mirar**, y para eso "premium" y "$114.414"
dicen lo mismo. El número recién importa en el checkout, y en el checkout ya está el de Mercado
Libre, que además es el verdadero.

## 4 · Qué cambió, en concreto

Las cinco superficies que mostraban `precio_ars`, más la sexta que apareció al mirar:

| Dónde | Antes | Ahora |
|---|---|---|
| `/api/og/producto/[slug]` | `$46.477` a 40px | La banda |
| Ficha de producto | Precio grande + "visto hace N días" | Banda + "el precio de hoy y los descuentos, en Mercado Libre" |
| Grilla del catálogo | `$46.477` en cada card | Chip de banda |
| Card de paso del quiz | `~$46.477` | Chip de banda |
| Kits armados | `total aprox. $130.000` | `3 pasos · rango equilibrado` |
| Kits de compra única | Precio + precio de lista **tachado** | Banda |

**El caso de la imagen de Open Graph era el más urgente y había que arreglarlo con cualquiera de
las tres opciones.** Pinterest cachea esa imagen y no la regenera sola: un descuento la deja
mintiendo en el feed durante meses, y desde el repo no se nota nada. Es la única superficie del
sitio donde un dato viejo sobrevive a su propio deploy.

**El precio de lista tachado era el segundo.** Un descuento tachado es lo primero que deja de ser
cierto, y el que más se parece a una promesa.

## 5 · Qué se conservó

- **`precio_ars` sigue en los datos.** Es dato de relevamiento y lo usa `npm run frescura` para
  avisar cuándo hay que volver a mirar. Lo que no hace es llegar a la pantalla.
- **`rango_precio` sigue siendo filtro duro del motor** (`rango_precio <= presupuesto`). La
  pregunta de presupuesto del quiz no cambió.
- **Las bandas están medidas, no inventadas.** Sobre los 26 productos con precio relevado:
  rango 1 va de $15.488 a $32.999 · rango 2 de $36.719 a $54.739 · rango 3 de $55.620 a $114.414.
  Se parten solas, sin superposición.

## 6 · El candado

`src/lib/precio.test.ts` falla si algún `.tsx` de `src/` vuelve a leer `precio_ars` o
`precio_lista`. Está escrito leyendo los archivos y no renderizando, a propósito: lo que hay que
impedir es que el número **vuelva** por un componente nuevo o por un merge, y un test de render
sólo mira donde ya se sabe que hay que mirar. Este proyecto ya se comió una vez un merge
"exitoso" que dejó copy mintiendo (`config.ts` prometiendo un tónico que ningún tier tenía).

## 7 · Consecuencia sobre la herramienta de relevamiento

`npm run relevar-pendientes` / `relevar-aplicar` (commit `2fd9e78`) se construyó para cargar
**precio e imagen** de los 45 productos que esperan. La mitad de imagen sigue siendo válida: las
fotos no cambian. La mitad de precio ya no tiene consumidor en la UI — sigue escribiendo
`precio_ars` como dato de relevamiento, pero lo que hay que cargar para que un producto se pueda
activar es la **imagen** y la **banda**, no el número.

## 8 · Fuentes

- Términos y Condiciones para Desarrolladores de Mercado Libre —
  [developers.mercadolibre.com.ar](https://developers.mercadolibre.com.ar/es_ar/terminos-y-condiciones)
- `robots.txt` de Mercado Libre Argentina — https://www.mercadolibre.com.ar/robots.txt
  (`Disallow: /` para ClaudeBot, Claude-User, GPTBot, ChatGPT-User, PerplexityBot, Perplexity-User,
  Amazonbot)
- Products prices · retiro de `price`, `base_price` y `original_price` de `/items` —
  [developers.mercadolibre.com.ar](https://developers.mercadolibre.com.ar/en_us/price-apl)
- Restricción del endpoint de búsqueda a usuarios autenticados desde abril de 2025 —
  [AutomatizaPro](https://www.automatizapro.com.ar/blog/cambios-api-mercado-libre-2025/)
