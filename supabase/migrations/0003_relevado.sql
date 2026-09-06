-- Fecha del último relevamiento en Mercado Libre.
--
-- Precio, rating, opiniones, ventas y reputación se copian a mano y envejecen
-- solos. Sin esta fecha no hay forma de saber si el número que se muestra
-- todavía es cierto. `npm run frescura` la lee para pedir revisión.
alter table productos add column if not exists relevado date;

comment on column productos.relevado is
  'Último relevamiento en ML. Actualizar en el mismo edit que cualquier número.';
