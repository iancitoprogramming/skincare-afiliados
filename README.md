# skincare-afiliados

Landing de una sola página: arma una rutina de skincare personalizada (4 preguntas) y
recomienda productos con links de afiliado de Mercado Libre. El primer clic abre la
ventana de atribución de 24hs; toda la página empuja a que ese clic ocurra rápido.

## Arquitectura: motor + nicho

El código se separa para poder reusarlo en otros nichos:

- `src/engine/` — el motor. Quiz, recomendación, compatibilidad, tracking, Supabase. No sabe nada de skincare.
- `src/niches/skincare/` — todo lo específico del nicho: preguntas, presupuesto, copy, tema, catálogo y activos.

Para un nicho nuevo: copiar `src/niches/skincare/` y cambiar `config.ts`, `copy.ts`, `theme.css` y `productos.ts`.

## Compatibilidad entre activos

El motor de recomendación elige qué producto va en cada paso. El de compatibilidad revisa que
los productos elegidos **funcionen juntos**, que es una pregunta distinta y la que más consultan
los usuarios.

- `docs/INGREDIENTES.md` — qué hace cada activo del catálogo, a qué concentración y con qué
  nivel de evidencia (escala A–D). **Regla: en la landing sólo se afirma lo que está en A o B.**
- `docs/COMPATIBILIDAD.md` — qué pasa cuando se juntan. Es la fuente de verdad del criterio.
- `src/niches/skincare/activos.ts` — la versión ejecutable: diccionario de activos, reglas,
  sinergias, mitos y el mapa `ml_id → activos`.
- `src/engine/compatibilidad.ts` — el motor. Agnóstico del nicho.
- `src/niches/skincare/matriz.ts` — deriva la tabla pública de las mismas reglas, para que no
  pueda contradecir al motor.
- `/combinaciones` — la página pública de criterios.

Separa cuatro cosas que suelen confundirse en una sola: **degradación** (una molécula destruye a
la otra), **pH** (orden de aplicación), **irritación** (carga acumulada, se arregla con
calendario) y **redundancia** (pagar dos veces por el mismo activo). El arreglo es distinto en
cada caso, así que meterlas en la misma bolsa da consejos inútiles.

**El motor no sólo avisa: elige para no chocar.** Al armar la rutina prefiere, dentro del mismo
nivel de match, el producto que menos conflictos genera con lo ya elegido. La regla que lo
gobierna: *esquivar un conflicto nunca cuesta calidad de match* — si alguien pidió algo para las
manchas, se le da algo para las manchas. Medido con `npm run auditar -- --sin-evitar`: las rutinas
sin ningún conflicto pasan de 71,9% a 77,6%, y la calidad del match no se mueve. Ver
`docs/COMPATIBILIDAD.md` §8bis.

**Regla de carga:** ningún activo entra al mapa por inferencia. Sin INCI verificado, el producto
va con lista vacía y el motor no dice nada de él. Una advertencia inventada cuesta lo mismo en
credibilidad que un claim inventado.

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
npm test          # rutina nunca vacía + reglas de compatibilidad
npm run auditar   # recorre las 540 rutinas posibles: conflictos, inventario muerto, calidad del match
npm run auditar -- --proyectar   # lo mismo pero como si TODO el pipeline ya estuviera activo
npm run auditar -- --sin-evitar  # con el armado viejo, para medir cuánto aporta evitar conflictos
npm run importar-organize -- "<ruta al vault Organize>"   # reimporta el catálogo de farmacia
npm run cobertura # qué combos caen a comodín (dónde cargar el próximo link)
npm run gen-seed  # regenera supabase/seed.sql desde productos.ts
npm run sync      # sube productos.ts a Supabase (necesita .env)
```

`npm run auditar` es el que conviene mirar antes de cargar un producto nuevo. Responde preguntas
que a ojo no se pueden contestar: qué conflictos de activos genera el catálogo, qué productos el
motor no puede elegir nunca (inventario muerto con link de afiliado cargado), qué categorías se
quedarían sin comodín, qué productos no tienen activos mapeados, y cuántos pasos se resuelven con
un comodín.

Con `--proyectar` corre como si los 72 productos ya tuvieran link de afiliado. Sirve para ver qué
se rompe **antes** de terminar de cargar el catálogo, no después.

## Catálogo: curado + pipeline

`src/niches/skincare/productos.ts` tiene los 26 productos curados a mano (link de afiliado, precio
y copy escritos) y concatena `productos.organize.ts`, que son 46 importados del vault de Obsidian.

Los importados entran **todos con `activo: false`**: el vault trae la URL de catálogo de Mercado
Libre, no el link de afiliado. Un producto sin link no monetiza y le saca el lugar a uno que sí.

Para activar uno hacen falta cuatro cosas, no una: `link_afiliado`, `tipos_piel`, `preocupaciones`
y `prioridad`. Sólo con el link, el motor pierde todos los desempates y nunca lo elige —
`npm run auditar -- --proyectar` lo demuestra.

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
