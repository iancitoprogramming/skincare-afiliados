# Relevamiento pendiente: imágenes

> Generado por `npm run relevar-pendientes`. **Se puede editar**: pegá la URL
> de la imagen en la última columna y después corré `npm run relevar-aplicar`.

> **El precio no hace falta.** El sitio publica una banda cualitativa y no el
> número en pesos, así que `precio_ars` no se renderiza en ninguna parte. La
> columna queda por compatibilidad; dejala vacía. El porqué está en
> `docs/PRECIO.md`.

71 productos · **71 completos** · **0 pendientes**

## Cómo se completa

1. Abrí la publicación con el link de la columna *abrir*.
2. Click derecho sobre la foto grande → *Copiar dirección de la imagen*, y
   pegala en la última columna.
3. Guardá el archivo y corré `npm run relevar-aplicar`.

Un par de cosas que ahorran trabajo:

- **Con una sola URL de imagen alcanza.** El script deriva solo la variante
  cuadrada para las cards y la de proporción original para las piezas de
  diseño. No hace falta buscar las dos.
- **Las filas vacías se ignoran**, así que se puede ir de a poco.
- **No toques la columna `ml_id`**: es con lo que el script vuelve a encontrar
  cada producto.
- El script **rechaza** una URL que no sea de Mercado Libre o que sea la
  miniatura. Te dice cuál y por qué, y no escribe nada de esa fila.
## Pendientes

Ninguno. Todo el catálogo tiene precio e imagen.
