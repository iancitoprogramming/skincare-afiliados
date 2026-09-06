// Lista los productos activos cuyo relevamiento de precio y prueba social quedó
// viejo. Se corre a mano antes de publicar, igual que check-links.
//
// Por qué NO está cableado a `next build`: un precio de 15 días no debería
// bloquear un deploy de UI. check-links sí puede fallar duro porque un link roto
// no tiene grados; la frescura sí los tiene.

import { productos } from "../src/niches/skincare/productos";
import { KITS_UNICOS } from "../src/niches/skincare/kits";
import { DIAS_FRESCURA } from "../src/niches/skincare/config";

// 'YYYY-MM-DD' → Date local a medianoche.
// new Date('2026-09-05') parsea como UTC: en AR (UTC-3) rinde el 4 de
// septiembre y el conteo de días se corre uno. Por eso se parte a mano.
function aFechaLocal(iso: string): Date {
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) throw new Error(`relevado inválido: "${iso}"`);
  return new Date(a, m - 1, d);
}

function diasDesde(iso: string): number {
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  return Math.round((hoy.getTime() - aFechaLocal(iso).getTime()) / 86_400_000);
}

// Los kits de compra única también tienen precio y prueba social relevados a
// mano, así que envejecen igual que un producto. Se revisan en la misma pasada.
interface Item {
  etiqueta: string;
  relevado: string;
  precio_ars?: number;
  url: string;
}

const items: Item[] = [
  ...productos
    .filter((p) => p.activo)
    .map((p) => ({
      etiqueta: `${p.marca ?? ""} ${p.nombre}`.trim(),
      relevado: p.relevado,
      precio_ars: p.precio_ars,
      url: p.url_referencia ?? p.link_afiliado,
    })),
  ...KITS_UNICOS.map((k) => ({
    etiqueta: `[kit] ${k.marca} ${k.nombre}`,
    relevado: k.relevado,
    precio_ars: k.precio_ars,
    url: `https://www.mercadolibre.com.ar/p/${k.ml_id}`,
  })),
];

const conEdad = items
  .map((i) => ({ i, dias: diasDesde(i.relevado) }))
  .sort((a, b) => b.dias - a.dias);

// Una fecha futura es un dato mal cargado, no un relevamiento fresco.
// Se separa porque el orden por antigüedad lo mandaría al fondo de la lista.
const futuros = conEdad.filter((x) => x.dias < 0);
const vencidos = conEdad.filter((x) => x.dias > DIAS_FRESCURA);
const vigentes = conEdad.length - futuros.length - vencidos.length;

const plata = (n?: number) => (typeof n === "number" ? `$${n.toLocaleString("es-AR")}` : "sin precio");

console.log(
  `\n${items.length} ítems activos · ${vigentes} vigentes · ` +
    `${vencidos.length} a revisar (más de ${DIAS_FRESCURA} días)\n`,
);

if (futuros.length) {
  console.log("FECHAS FUTURAS — dato mal cargado:");
  for (const { i, dias } of futuros) {
    console.log(`  ${i.relevado}  ${i.etiqueta}  (${-dias} días adelante)`);
  }
  console.log("");
}

if (vencidos.length) {
  console.log("A REVISAR EN ML — precio, rating, opiniones, ventas, reputación:");
  for (const { i, dias } of vencidos) {
    console.log(`  ${String(dias).padStart(3)}d  ${i.etiqueta}\n        ${plata(i.precio_ars)}  ${i.url}`);
  }
  console.log(
    "\nAl actualizar un número, actualizar `relevado` en el mismo edit.\n" +
      "Después: npm run gen-seed && npm run sync\n",
  );
}

if (futuros.length || vencidos.length) process.exit(1);

console.log("Todo el catálogo activo está dentro de la ventana.\n");
