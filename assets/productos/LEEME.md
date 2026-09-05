# Fotos de producto en alta

26 imágenes, una por producto del catálogo. Bajadas del CDN de Mercado Libre
el 2026-09-05.

- **Nombre del archivo:** `<ml_id>_<marca-producto>.webp` — el `ml_id` es la
  clave con la que el producto vive en `src/niches/skincare/productos.ts`.
- **Variante:** `-F` del CDN, o sea la foto en su proporción original y hasta
  1200px. La que usa el sitio en las cards es la `-V`, cuadrada de 640 con
  relleno blanco, que queda mejor en una grilla pero peor en una pieza de diseño.
- **Tamaños:** van de 176×979 a 1200×1185 según la foto. Para Pinterest (2:3,
  1000×1500) la mayoría necesita fondo o recorte, no dan el alto solas.

Para regenerarlas: los campos `imagen_hd` del catálogo tienen la URL de cada una.
