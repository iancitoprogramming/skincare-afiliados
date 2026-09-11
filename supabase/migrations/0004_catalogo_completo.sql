-- Las columnas que el catálogo ya tenía y la tabla no.
--
-- `npm run sync` sube los objetos de productos.ts enteros. Desde que el catálogo
-- sumó el relevamiento de Mercado Libre, `cuenta` y `en_rutina`, la tabla no
-- tenía dónde guardarlos y el upsert fallaba completo. Mientras Supabase no
-- estuviera configurado no se notaba, porque el sitio lee productos.ts. El día
-- que se prendiera, el catálogo de producción iba a salir de una copia sin estos
-- campos, y sin `en_rutina` los productos que se venden pero no se recomiendan
-- volvían a recomendarse.
--
-- Los campos derivados (`calidad_formula`, `respaldo_orden`) NO van acá: se
-- calculan al leer. Ver CAMPOS_DERIVADOS en src/engine/catalogo.ts.
--
-- src/lib/esquema-supabase.test.ts falla si el catálogo suma un campo sin
-- columna, para que no se vuelvan a separar.

alter table productos add column if not exists cuenta         text;
alter table productos add column if not exists en_rutina      boolean;
alter table productos add column if not exists imagen_hd      text;
alter table productos add column if not exists rating         real    check (rating is null or (rating >= 0 and rating <= 5));
alter table productos add column if not exists opiniones      integer check (opiniones is null or opiniones >= 0);
alter table productos add column if not exists vendidos       text;
alter table productos add column if not exists vendidos_aprox integer check (vendidos_aprox is null or vendidos_aprox >= 0);
alter table productos add column if not exists reputacion     text;

comment on column productos.en_rutina is
  'false = se vende pero no se recomienda. null o true = entra al motor.';
comment on column productos.cuenta is
  'Cuenta de afiliado que cobra por el link. Ver docs/proyecto/07-AFILIADOS.md.';
comment on column productos.imagen_hd is
  'Misma foto en proporción original y mayor resolución, para piezas de diseño.';
