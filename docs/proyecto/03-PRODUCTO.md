# Arquitectura de producto

## Tres puertas

El home ofrece tres caminos y nada más. Cuatro opciones con el mismo peso dejan
de ser un fork y pasan a ser un menú — y el menú es la fricción que el fork
existe para sacar.

| Puerta | Ruta | Para quién |
|---|---|---|
| **Todo el catálogo** | `/catalogo` | El que quiere mirar y elegir solo |
| **Kits ya armados** | `/kits` | El que quiere comprar sin pensar |
| **Armá tu rutina** | `/rutina` | El que quiere que le acierten |

`/combinaciones` vive en el pie, no en el home: nadie llega de una red social
buscando "combinaciones de activos". Es contenido para el que ya está adentro.

### Lo que va debajo de las puertas no es una puerta

Debajo de las tres tarjetas hay dos secciones: **cómo funciona**, en tres
pasos, y **preguntas antes de empezar**. No son un cuarto camino. La regla de
"tres caminos y nada más" es sobre lo que compite por la decisión arriba del
fold, y eso no cambió: el que llega de una red social sigue decidiendo sin
scrollear.

Las secciones son para el que no decidió y bajó a mirar. Por eso cierran con un
link más a `/rutina` —una puerta que ya existe, no una nueva—: al que llegó
hasta ahí leyendo ya no le quedan las tarjetas de arriba a la vista.

Las respuestas describen cosas que el sitio hace hoy, y cada una está atada a
una decisión o a un test (el detalle está en `copy.ts`, al lado del texto). Las
preguntas en sí son hipótesis hasta tener las respuestas de clientas a "¿qué
casi te frena?".

## Rutas

```
/                       fork de tres puertas
/catalogo               grilla con filtros (piel, paso, origen) + orden
/producto/[slug]        ficha × 78 — la unidad pineable (una por producto activo)
/kits                   compra única primero, después los armados
/kits/[slug]            × 7 (2 de compra única + 5 armados)
/rutina                 el quiz
/combinaciones          criterios de compatibilidad entre activos
```

Cada ficha tiene además dos imágenes, horneadas en el build:
`/api/og/producto/[slug]` (1200×630, la que se ve al compartir el link) y
`/api/pin/producto/[slug]` (1000×1500, el pin 2:3 que ofrece el botón Guardar en
Pinterest de la ficha).

Todo prerenderizado. **253 páginas estáticas** al 16/9/2026: 175 hasta el 15/9,
más los 78 pins. El número sale de `npm run build`, no de sumar a mano: cambia
cada vez que entra o sale un producto activo.

### Los slugs son contrato

`slugProducto()` deriva de **marca + nombre**, nunca de categoría ni tier. Un pin
de Pinterest vive años: si el slug cambia porque el producto cambió de categoría,
el pin queda apuntando a un 404. `indicePorSlug()` falla fuerte ante una colisión
en vez de servir el producto equivocado.

## El sistema de tiers

Espeja la estructura del vault de Obsidian: rutinas que crecen en cantidad de
pasos, no en calidad de producto.

| Tier | Pasos | Suma |
|---|---|---|
| 1 · Base | 3 | limpiador · hidratante · protector solar |
| 2 · Esencial | 5 | + limpiador oleoso · tónico |
| 3 · Completo | 6 | + serum activo |
| 4 · Máximo | 9 | + serum secundario · contorno · retinoide |

**Piel sensible topea en Tier 3.** Sumarle ampolla, contorno y retinoide encima
es pedirle problemas.

**El exfoliante salió de todos los tiers** por decisión de producto: suma costo,
riesgo de irritación y un paso más, para un beneficio que no justifica la
fricción en rutinas pensadas para sostenerse. La categoría sigue definida por si
se vuelve atrás.

### Sólo se ofrece lo que se puede servir

`configServible()` recorta las opciones del quiz a los tiers que el catálogo
puede entregar de verdad. Si un tier tiene una categoría sin stock, el motor
levanta excepción — así que ofrecerlo daría "Application error" apenas la
persona responde. Cuando se carga catálogo nuevo, las opciones aparecen solas.

Hoy: **Tiers 1 a 3 servibles.** El 4 espera ampolla y retinoide.

## El motor de recomendación

Determinístico, sin IA. Recibe catálogo + slots + respuestas y devuelve la rutina
de mañana y de noche. **Nunca deja un paso vacío.**

### Cascada de relajación

1. Match completo (tipo de piel **y** preocupación), dentro de la banda pedida
2. Match completo **fuera de la banda** → marca `fuera_de_presupuesto`
3. Relaja preocupación (misma lógica de banda adentro)
4. Relaja tipo de piel
5. Relaja origen → marca `otro_origen`
6. Relaja apto para sensible → marca `no_apto_sensible`
7. Comodín de la categoría → marca `comodin`

**Categoría y momento nunca se relajan**: sin eso la rutina deja de tener
sentido.

### Por qué el presupuesto cede antes que el tipo de piel

Era al revés: la banda era filtro duro y `apto_sensible` se relajaba. Eso hacía
que alguien de piel sensible con presupuesto accesible recibiera un protector
químico marcado como no apto, en vez del mineral de banda 2 que sí le servía —y
no había ninguno apto en banda 1, así que no era un hueco de catálogo sino el
precio de mercado.

Se prioriza la necesidad y el objetivo de la persona por sobre la banda, y **las
bandas se mezclan entre sí** dentro de una misma rutina. La banda se respeta
mientras haya algo del mismo nivel de match que entre; sólo cuando ninguno de los
que sirven entra, se ofrece el que sirve y se avisa.

Medido al hacer el cambio: los pasos marcados `no_apto_sensible` pasaron de 16 a
**0**, a cambio de 54 pasos que se van de banda, cada uno con su aviso.

Cada nivel devuelve una señal, y **la interfaz la muestra**. Si el kit de piel
sensible tiene un protector que no es apto, lo dice.

### Preferencia de desempate

A igual prioridad:

- `"mejor"` (default) → el más caro que entre en el presupuesto. Es lo que espera
  alguien que ya eligió cuánto gastar.
- `"precio"` → el más barato. Lo usan los kits, donde el total se ve de una y un
  número alto espanta antes de que la persona lea nada.

### Prioridad por especificidad

Universal (5 pieles) = 3 · 3-4 pieles = 4 · 1-2 pieles = 5.

**El especialista le gana al comodín en su terreno.** Cuando estaba al revés, los
cinco kits daban exactamente el mismo resultado.

## El quiz

Cinco preguntas: tipo de piel · objetivo · presupuesto · **¿coreanos?** · pasos.

### La rama coreana / occidental

No es un filtro de marca: **es una rama de estructura**. El tónico es el paso que
separa las dos escuelas — en la tradición occidental ese paso directamente no
existe. Por eso responder "no quiero coreanos" saca la categoría `tonico` de
todos los tiers. Preguntar y después meter un tónico igual sería no haber
escuchado la respuesta.

La doble limpieza **no** se saca: el aceite desmaquillante también se usa acá,
sólo que no se lo llama "paso 1 de 2".

Las tres respuestas traen su explicación, que aparece con los resultados. Es
educativa, no vendedora: se aclara que los tónicos occidentales de los 90 eran
astringentes con alcohol —por eso quedaron con mala fama— y que los coreanos van
al revés.

### El presupuesto es cualitativo

"Lo más accesible" / "Equilibrado" / "Lo mejor que haya". Los montos fijos
quedan viejos solos y pasan a mentir. El precio real de cada producto se ve en su
card.

## Kits

Dos clases, y la diferencia importa para la conversión:

**`KITS_UNICOS`** — una publicación de ML con varios productos adentro. Un link,
un checkout, un envío. Van primero.

**`KITS`** — curaduría nuestra: (piel + foco + tier) que el motor resuelve contra
el catálogo. Salen N productos, o sea N compras. Más flexibles, más fricción, y
se aclara antes del checkout.

Un kit sin catálogo detrás **no se muestra**, en vez de romper la página.

## Prueba social

Se muestra rating, opiniones, ventas y reputación del vendedor.

**La calificación aparece sólo con 10 o más opiniones.** Tres productos tienen
5,0 con una sola opinión: al lado de uno con 4,8 y 3.000, el peor dato parecería
el mejor. Ventas y reputación van siempre.
