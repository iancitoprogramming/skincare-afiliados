-- Esquema inicial: catálogo, sesiones, clicks y leads.
-- RLS obligatorio. En el cliente solo se usa la anon key; la service_role key
-- queda solo del lado del servidor (scripts y API routes).

create extension if not exists "pgcrypto";

-- ── Catálogo ────────────────────────────────────────────────────────────────
create table if not exists productos (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  marca          text,
  categoria      text not null,        -- limpiador | hidratante | protector_solar | serum | exfoliante | contorno
  paso           int  not null,        -- orden dentro de la rutina
  momento        text not null,        -- 'am' | 'pm' | 'ambos'
  tipos_piel     text[] not null,      -- ['grasa','mixta','seca','sensible']
  preocupaciones text[] not null,      -- ['acne','manchas','textura','deshidratacion']
  rango_precio   int  not null,        -- 1 | 2 | 3
  precio_ars     numeric,
  imagen_url     text,
  link_afiliado  text not null,
  por_que        text,
  como_usar      text,
  prioridad      int  default 0,
  comodin        boolean default false, -- se usa si no hay match para ese paso
  activo         boolean default true
);

-- Índices para los filtros de la recomendación.
create index if not exists productos_categoria_idx on productos (categoria) where activo;
create index if not exists productos_tipos_piel_idx on productos using gin (tipos_piel);
create index if not exists productos_preocupaciones_idx on productos using gin (preocupaciones);

-- ── Tracking ─────────────────────────────────────────────────────────────────
create table if not exists sesiones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  respuestas jsonb,
  referrer text,
  utm jsonb
);

create table if not exists clicks (
  id bigserial primary key,
  sesion_id uuid references sesiones(id),
  producto_id uuid references productos(id),
  posicion int,
  created_at timestamptz default now()
);

create table if not exists leads (
  id bigserial primary key,
  sesion_id uuid references sesiones(id),
  email text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  created_at timestamptz default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table productos enable row level security;
alter table sesiones  enable row level security;
alter table clicks    enable row level security;
alter table leads     enable row level security;

-- productos: select público solo de lo activo.
drop policy if exists productos_select_publico on productos;
create policy productos_select_publico on productos
  for select using (activo = true);

-- sesiones / clicks / leads: insert público, select bloqueado (sin policy de select).
drop policy if exists sesiones_insert_publico on sesiones;
create policy sesiones_insert_publico on sesiones
  for insert with check (true);

drop policy if exists clicks_insert_publico on clicks;
create policy clicks_insert_publico on clicks
  for insert with check (true);

drop policy if exists leads_insert_publico on leads;
create policy leads_insert_publico on leads
  for insert with check (true);
