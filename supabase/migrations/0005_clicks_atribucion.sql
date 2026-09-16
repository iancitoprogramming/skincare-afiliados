-- De dónde vino cada clic a Mercado Libre.
--
-- Hasta acá un clic guardaba sesión, producto y posición. Alcanzaba mientras el
-- único camino era el quiz: la sesión traía los utm_* y por ahí se atribuía. Pero
-- los clics desde /producto, /kits y /catalogo no tienen sesión (sesion_id null) y
-- quedaban sueltos: se sabía que alguien clickeó, no desde qué pieza llegó.
--
-- Con la campaña, cada pieza va a tener su link con utm_* y puede aterrizar en
-- cualquier página. Así que la entrada (utm, página y referrer del primer
-- pageview) se guarda en el navegador durante la visita y viaja con cada clic.
--
-- Las tres son nulas a propósito: un clic sin campaña sigue siendo un clic. El
-- orden importa: esta migración va ANTES del deploy que manda las columnas,
-- porque PostgREST rechaza el insert entero si le llega una columna que no existe
-- y el clic se pierde. src/engine/tracking.test.ts lo vigila desde el repo.

alter table clicks add column if not exists utm      jsonb;
alter table clicks add column if not exists pagina   text;
alter table clicks add column if not exists referrer text;
