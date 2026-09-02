# skincare-afiliados

Landing de una sola página: arma una rutina de skincare personalizada (4 preguntas) y
recomienda productos con links de afiliado de Mercado Libre. El primer clic abre la
ventana de atribución de 24hs; toda la página empuja a que ese clic ocurra rápido.

## Arquitectura: motor + nicho

El código se separa para poder reusarlo en otros nichos:

- `src/engine/` — el motor. Quiz, recomendación, tracking, Supabase. No sabe nada de skincare.
- `src/niches/skincare/` — todo lo específico del nicho: preguntas, presupuesto, copy, tema y catálogo.

Para un nicho nuevo: copiar `src/niches/skincare/` y cambiar `config.ts`, `copy.ts`, `theme.css` y `productos.ts`.

## Estado

- [x] Parte 1 — Quiz (motor + config + tema)
- [x] Parte 2 — Motor de recomendación (algoritmo + catálogo + DB + scripts + test)
- [x] Parte 3 — Pantalla de resultados (rutina AM/PM + CTA a ML + email + lectura ISR)
- [x] Parte 4 — Tracking + deploy

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Scripts

```bash
npm test          # test de las 96 combinaciones: la rutina nunca queda vacía
npm run cobertura # qué combos caen a comodín (dónde cargar el próximo link)
npm run gen-seed  # regenera supabase/seed.sql desde productos.ts
npm run sync      # sube productos.ts a Supabase (necesita .env)
```

## Catálogo y links a mano

El catálogo vive en `src/niches/skincare/productos.ts` (fuente de verdad). Ahí pegás
cada `link_afiliado` generado a mano. Después `npm run sync` lo sube a Supabase y
desactiva lo que hayas sacado del archivo. `npm run cobertura` te dice qué
combinaciones todavía dependen de un comodín, para priorizar qué link cargar.

## Base de datos

`supabase/migrations/0001_init.sql` crea las tablas con RLS (productos: select público
solo de lo activo; sesiones/clicks/leads: solo insert). `supabase/seed.sql` es un seed
de 12 productos de ejemplo, generado desde `productos.ts`.

## Variables de entorno

Ver `.env.example`.

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` — lectura del catálogo e inserts (sesiones/clicks/leads) vía RLS.
- `SUPABASE_SERVICE_ROLE_KEY` — **solo servidor**, solo la usa `npm run sync`. Nunca exponerla en el cliente.

Sin estas variables la app igual corre en local: el catálogo usa el fallback de `productos.ts` y el tracking hace no-op.

## Tracking

- `sesiones` se inserta al **completar** el quiz (no al abrir la página). El id se genera en el cliente.
- El clic a Mercado Libre se registra con `navigator.sendBeacon` → `/api/clicks`, **antes** de abrir la pestaña (link directo, sin redirect propio).
- `/api/leads` valida el email del lado del servidor antes de insertar.
- Vercel Analytics (sin cookies). Sin Google Analytics ni Meta Pixel.

## Deploy a Vercel

1. Subí el repo a GitHub e importalo en Vercel (framework Next.js, autodetectado).
2. Cargá las 3 variables de entorno en el proyecto de Vercel.
3. En Supabase: corré `supabase/migrations/0001_init.sql` y después `npm run sync` (con `.env`) para cargar el catálogo.
4. Deploy. La home es estática con ISR (revalida cada hora).

> Free tier de Supabase: el proyecto se pausa tras 7 días sin actividad. Como el catálogo se lee con ISR y hay fallback local, la landing sigue mostrando rutina igual.
