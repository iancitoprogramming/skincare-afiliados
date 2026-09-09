// Audita que los links de afiliado del catálogo salgan todos de la misma cuenta.
//
//   npm run cuentas          reporta y devuelve exit 1 si algo está mal
//
// ─────────────────────────────────────────────────────────────────────────────
// POR QUÉ ESTE SCRIPT YA NO LE PEGA A MERCADO LIBRE
//
// Antes resolvía la cuenta siguiendo el redirect del shortlink `meli.la` hasta
// `/social/<cuenta>`, con un User-Agent de navegador puesto a mano porque sin él
// el Location no llegaba. Eso es acceso automatizado para extraer información de
// Mercado Libre, que es exactamente lo que prohíbe la obligación (e) del
// Programa de Afiliados — ver `docs/proyecto/07-AFILIADOS.md` §4. Que hiciera
// falta falsear el User-Agent para obtener la respuesta era la señal más clara
// de que el camino no estaba sancionado.
//
// LO QUE CAMBIA, Y NO ES SÓLO SACAR UN `fetch`
//
// La cuenta pasa de DESCUBRIRSE a DECLARARSE. Antes se infería después, pegándole
// a ML; ahora la escribe `links-aplicar` en el momento en que el link entra al
// catálogo, que es cuando de verdad se sabe: el link se acaba de generar en el
// panel de una cuenta concreta. El dato se anota donde nace en vez de
// reconstruirse desde afuera.
//
// Este script deja de ser un resolvedor y pasa a ser un auditor: compara lo
// declarado contra `CUENTA_PRINCIPAL` y grita cuando no coincide o cuando falta.
//
// LO QUE SE PIERDE, DICHO SIN VUELTAS
//
// Ya no detecta que un link cambió de cuenta *en Mercado Libre* sin que nadie
// tocara el repo. Antes eso se veía; ahora no. El caso real que motivó el script
// —8 productos que se movieron de goldenvalhalla a maurobilat al recargar los
// links— hoy tiene otra defensa: los links se regeneran de a uno desde un solo
// panel y `links-aplicar` deja constancia de cuál. Si algún día se vuelve a
// necesitar la verificación contra ML, el camino es la API oficial con OAuth, no
// el redirect.

import { productos } from "../src/niches/skincare/productos";
import { KITS_UNICOS } from "../src/niches/skincare/kits";
import { clasificar, CUENTA_PRINCIPAL } from "../src/lib/links";

interface Item {
  ml_id: string;
  etiqueta: string;
  link: string;
  cuenta?: string;
  activo: boolean;
}

const items: Item[] = [
  ...productos.map((p) => ({
    ml_id: p.ml_id ?? "",
    etiqueta: `${p.marca ?? ""} ${p.nombre}`.trim(),
    link: p.link_afiliado,
    cuenta: p.cuenta,
    activo: p.activo,
  })),
  ...KITS_UNICOS.map((k) => ({
    ml_id: k.ml_id,
    etiqueta: `[kit] ${k.marca} ${k.nombre}`,
    link: k.link_afiliado,
    cuenta: k.cuenta,
    activo: true,
  })),
];

// Sólo tiene sentido preguntar por la cuenta de un link que efectivamente
// monetiza. Un producto sin link todavía no tiene cuenta que auditar.
const conLink = items.filter((it) => clasificar(it.link, it.activo) === "afiliado");

const correctos = conLink.filter((it) => it.cuenta === CUENTA_PRINCIPAL);
const ajenos = conLink.filter((it) => it.cuenta && it.cuenta !== CUENTA_PRINCIPAL);
const sinDeclarar = conLink.filter((it) => !it.cuenta);

console.log(`\n${items.length} ítems · ${conLink.length} con link que monetiza\n`);
console.log(`CUENTA ÚNICA: ${CUENTA_PRINCIPAL}`);
console.log(`  ${String(correctos.length).padStart(3)}  declaran la cuenta correcta`);
console.log(`  ${String(ajenos.length).padStart(3)}  declaran otra cuenta`);
console.log(`  ${String(sinDeclarar.length).padStart(3)}  no declaran cuenta`);

// Los activos primero: son los que están publicados cobrando a quien no debe.
const porUrgencia = (a: Item, b: Item) =>
  Number(b.activo) - Number(a.activo) || a.etiqueta.localeCompare(b.etiqueta);

if (ajenos.length) {
  console.log(`\n⛔ COBRAN A OTRA CUENTA — ${ajenos.length}`);
  console.log("   Hay que regenerarlos desde el panel de " + CUENTA_PRINCIPAL + ".");
  console.log("   `npm run links-pendientes` los lista arriba de todo.\n");
  for (const it of [...ajenos].sort(porUrgencia)) {
    console.log(`  ${it.activo ? "ACTIVO  " : "inactivo"}  ${it.ml_id}  ${it.cuenta} → ${CUENTA_PRINCIPAL}`);
    console.log(`            ${it.etiqueta}`);
  }
}

// Un link sin cuenta declarada no está mal, está sin verificar — y esa distinción
// importa: son los que se cargaron antes de que `links-aplicar` empezara a dejar
// constancia. Se listan aparte, sin alarma, porque gritar sobre lo que no se sabe
// entrena a ignorar la lista.
if (sinDeclarar.length) {
  console.log(`\n⚠️  SIN CUENTA DECLARADA — ${sinDeclarar.length}`);
  console.log("   Monetizan, pero no sabemos a quién. Se cargaron antes de que");
  console.log("   `links-aplicar` dejara constancia, o se editaron a mano.");
  console.log("   Al regenerarlos desde el panel único, la constancia queda sola.\n");
  for (const it of [...sinDeclarar].sort(porUrgencia)) {
    console.log(`  ${it.activo ? "ACTIVO  " : "inactivo"}  ${it.ml_id}  ${it.etiqueta}`);
  }
}

if (!ajenos.length && !sinDeclarar.length) {
  console.log(`\n✓ Los ${conLink.length} links declaran ${CUENTA_PRINCIPAL}.\n`);
}

// Exit 1 sólo por los ajenos: son plata que se está acreditando a una cuenta que
// no declaró este sitio como Medio. Lo que falta declarar no rompe nada todavía.
process.exit(ajenos.length ? 1 : 0);
