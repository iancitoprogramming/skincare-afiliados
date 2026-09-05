-- Origen comercial, aptitud para piel sensible y trazabilidad al producto de ML.
--
-- origen        : coreano | europeo | nacional. Es preferencia del usuario; el motor
--                 la relaja si no hay cobertura y marca el paso como "otro_origen".
-- apto_sensible : curado a mano producto por producto. Es lo último que el motor
--                 relaja, y cuando lo hace el paso queda marcado.
-- ml_id         : id del producto en Mercado Libre (MLA… / MLAU…). Clave natural para
--                 deduplicar al importar del vault y para volver a la publicación.
-- url_referencia: URL de browse. NO monetiza — sirve para identificar el producto
--                 mientras se carga el link de afiliado real.

alter table productos add column if not exists origen         text    not null default 'europeo';
alter table productos add column if not exists apto_sensible  boolean not null default false;
alter table productos add column if not exists ml_id          text;
alter table productos add column if not exists url_referencia text;

create unique index if not exists productos_ml_id_idx on productos (ml_id) where ml_id is not null;
create index if not exists productos_origen_idx on productos (origen) where activo;

comment on column productos.categoria is
  'limpiador_oleoso | limpiador | tonico | serum_activo | serum_secundario | contorno | hidratante | protector_solar | exfoliante | retinoide';
comment on column productos.tipos_piel is
  'grasa | mixta | normal | seca | sensible';
