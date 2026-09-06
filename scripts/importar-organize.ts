// Importa el vault "Club de Piel / Organize" al formato del catálogo.
//
//   npm run importar-organize -- "C:/ruta/Club de Piel/Organize"
//
// ─────────────────────────────────────────────────────────────────────────────
// POR QUÉ ES OTRO IMPORTADOR Y NO EL DE ANTES
//
// El vault viejo organizaba por <Piel>/<Tier>/<NN - Categoría>/. Éste organiza
// por activo (Vitamina C, Retinoles, Niacinamidas, Ácido Hialurónico, Ampoules)
// y por tipo de piel (ORIENTADOS A PIEL GRASA / SECA / mixta), con productos
// sueltos en la raíz. Son dos taxonomías distintas mezcladas en el mismo árbol,
// así que la categoría del producto no se puede leer de la carpeta: hay que
// deducirla del nombre del archivo, y donde el nombre no alcanza, decirlo a mano.
//
// Lo que el vault SÍ tiene y el anterior no: la lista de ingredientes completa
// de casi todos los productos. Eso es lo que hace posible la capa de activos.
//
// ─────────────────────────────────────────────────────────────────────────────
// LO QUE ESTE SCRIPT NO INVENTA
//
// Los .md traen la URL de catálogo de Mercado Libre, no el link de afiliado.
// Tampoco traen precio. Sin `link_afiliado` un producto no monetiza, así que
// todos salen con `activo: false` y un TODO. Publicar un catálogo que no cobra
// comisión es peor que no publicarlo: ocupa el lugar de uno que sí.

import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, basename } from "node:path";
import { createHash } from "node:crypto";
import { ACTIVOS, ACTIVOS_POR_PRODUCTO } from "../src/niches/skincare/activos";
import { CURADO } from "./overlay-organize";

const NS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
function uuidDe(mlId: string): string {
  const ns = Buffer.from(NS.replace(/-/g, ""), "hex");
  const h = createHash("sha1").update(Buffer.concat([ns, Buffer.from(mlId, "utf8")])).digest();
  h[6] = (h[6] & 0x0f) | 0x50;
  h[8] = (h[8] & 0x3f) | 0x80;
  const x = h.subarray(0, 16).toString("hex");
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

const RAIZ = process.argv[2];
if (!RAIZ) {
  console.error('Falta la ruta. npm run importar-organize -- "C:/ruta/Club de Piel/Organize"');
  process.exit(1);
}

// ── Taxonomía ───────────────────────────────────────────────────────────────

// El orden importa: la primera que matchea gana.
const POR_NOMBRE: [RegExp, string][] = [
  [/agua\s+micelar/i, "limpiador"],
  [/limpiador|cleanser|syndet|gel\s+limpiador/i, "limpiador"],
  [/protector\s+solar|anthelios|fps\s*\d|spf\s*\d|super\s+uv|sun\s+oil/i, "protector_solar"],
  [/retinol|retinoide|hyalu-r\b/i, "retinoide"],
  [/ampoule|ampolla/i, "serum_secundario"],
  [/contorno/i, "contorno"],
  [/s[eé]rum|serum|concentr[ée]|booster/i, "serum_activo"],
  [/crema|cream|gel\s+hidratante|hidratante|emulsi[oó]n|mat\b/i, "hidratante"],
];

// Donde el nombre del archivo no alcanza o miente. Cada línea es una decisión
// editorial, con su motivo. Es el equivalente al overlay del vault anterior.
const OVERRIDE: Record<string, { categoria?: string; nota: string }> = {
  // Effaclar Mat se llama "Mat" y no dice crema: es un hidratante matificante.
  MLA9196384: { categoria: "hidratante", nota: "hidratante matificante, no es un sérum" },
  // Minéral 89 es un booster hidratante; va al slot de ampolla, no al de activo.
  MLA18964459: { categoria: "serum_secundario", nota: "booster hidratante, no lleva activo dirigido" },
  // Los séricos de hialurónico hidratan, no corrigen: son el paso de ampolla.
  MLA45991792: { categoria: "serum_secundario", nota: "sérum de hialurónico" },
  MLA12754368: { categoria: "serum_secundario", nota: "sérum de hialurónico" },
  MLA22655637: { categoria: "serum_secundario", nota: "sérum de hialurónico" },
  MLA18956615: { categoria: "serum_secundario", nota: "sérum de hialurónico" },
  // Eucerin Hyaluron-Filler Día lleva FPS 15: es hidratante con filtro, no un
  // protector solar. FPS 15 no alcanza como protección diaria y ofrecerlo en el
  // slot de protector sería degradar el paso que más importa.
  MLA9855881: { categoria: "hidratante", nota: "FPS 15: insuficiente como protector solar" },
  // Avène Hydrance SPF30: mismo criterio, es hidratante con filtro.
  MLA67629151: { categoria: "hidratante", nota: "FPS 30 en un hidratante, no reemplaza al protector" },
  // El sérum de Garnier con FPS 50+ sí es un protector solar en formato sérum.
  MLA63460365: { categoria: "protector_solar", nota: "FPS 50+, protector en textura sérum" },
};

const MOMENTO: Record<string, "am" | "pm" | "ambos"> = {
  protector_solar: "am",
  limpiador_oleoso: "pm",
  exfoliante: "pm",
  retinoide: "pm",
};

const PIEL_POR_CARPETA: [RegExp, string[]][] = [
  [/piel\s+grasa/i, ["grasa", "mixta"]],
  [/piel\s+seca/i, ["seca", "normal"]],
  [/piel\s+mixta/i, ["mixta", "normal"]],
];

// Marcas presentes en el vault. El primer elemento del par es lo que se busca en
// el nombre del archivo; el segundo, la marca que se guarda. Hacen falta los dos
// porque varios productos se nombran por su LÍNEA y no por su marca: "Anthelios"
// y "Effaclar" son La Roche-Posay, "Liftactiv" y "Minéral 89" son Vichy.
const MARCAS: [string, string][] = [
  ["La Roche-Posay", "La Roche-Posay"],
  ["La Roche", "La Roche-Posay"],
  ["Anthelios", "La Roche-Posay"],
  ["Effaclar", "La Roche-Posay"],
  ["Lipikar", "La Roche-Posay"],
  ["Liftactiv", "Vichy"],
  ["Minéral 89", "Vichy"],
  ["Vichy", "Vichy"],
  ["SkinCeuticals", "SkinCeuticals"],
  ["Skinceuticals", "SkinCeuticals"],
  ["Neutrogena", "Neutrogena"],
  ["Eucerin", "Eucerin"],
  ["Garnier", "Garnier"],
  ["CeraVe", "CeraVe"],
  ["Cerave", "CeraVe"],
  ["Avene", "Avène"],
  ["Avène", "Avène"],
  ["Cetaphil", "Cetaphil"],
  ["Isdin", "ISDIN"],
  ["Ureadin", "ISDIN"],
  ["Eximia", "Eximia"],
  ["Dermaglós", "Dermaglós"],
  ["Dermaglos", "Dermaglós"],
  ["Skin1004", "Skin1004"],
  ["Celimax", "Celimax"],
  ["Kosmos", "Kosmos"],
  ["Beauty Of Joseon", "Beauty of Joseon"],
  ["Detenage", "Detenage"],
  ["Aveno", "Aveno"],
];

// ── Lectura ─────────────────────────────────────────────────────────────────

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const n of readdirSync(dir)) {
    if (n === ".obsidian") continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (n.endsWith(".md")) out.push(p);
  }
  return out;
}

function matchear(texto: string, tabla: [RegExp, string][]): string | null {
  for (const [re, v] of tabla) if (re.test(texto)) return v;
  return null;
}

// ── Derivación desde el INCI ────────────────────────────────────────────────
//
// Todo lo que se pueda deducir de la lista de ingredientes se deduce acá, y no
// se escribe a mano. Dos motivos: es consistente entre 46 productos, y es
// auditable — cualquiera puede seguir la regla y llegar al mismo resultado.

const TODAS_LAS_PIELES = ["grasa", "mixta", "normal", "seca", "sensible"];

/**
 * Apto para piel sensible según las reglas que el propio vault publica en
 * `SUSTITUTOS_SENSIBLE` (config.ts). Es más estricta que la etiqueta del
 * fabricante, y a propósito: si la estructura del catálogo dice "acá va un
 * sustituto suave", servir la versión fuerte es contradecir el criterio que
 * Club de Piel eligió publicar.
 */
function aptoSensible(activos: string[]): { apto: boolean; motivos: string[] } {
  const motivos: string[] = [];
  for (const id of activos) {
    const a = ACTIVOS[id];
    if (!a) continue;
    // El cítrico va casi siempre como ajustador de pH, no como exfoliante: no
    // descalifica. Está documentado en INGREDIENTES.md §4.5.
    if (id === "aha_citrico") continue;
    if ((a.grupos ?? []).includes("irritante-potencial")) motivos.push(a.nombre);
    else if (a.familia === "aha" || a.familia === "bha") motivos.push(`${a.nombre} (AHA/BHA)`);
    else if (a.familia === "retinoide") motivos.push(a.nombre);
    else if (id === "vit_c_laa") motivos.push("vitamina C pura");
    else if (id === "filtro_quimico") motivos.push("filtro solar químico");
  }
  return { apto: motivos.length === 0, motivos: [...new Set(motivos)] };
}

/**
 * Qué problema puede atacar el producto, a partir de lo que tiene adentro.
 * Un producto sin activos queda con lista vacía: el motor igual lo puede servir
 * por la vía de relajación, pero nunca lo va a vender como "para tu problema".
 */
function preocupacionesDe(activos: string[]): string[] {
  const out = new Set<string>();
  for (const id of activos) {
    const a = ACTIVOS[id];
    if (!a) continue;
    const g = a.grupos ?? [];

    // Granitos y poros: lo que entra al poro o regula sebo.
    if (a.familia === "bha" || a.familia === "seborregulador" || a.familia === "peroxido") out.add("acne");
    if (id === "aceite_esencial_tea_tree" || id === "azelaico" || id === "zinc_gluconato") out.add("acne");

    // Manchas y marcas. El protector solar entra a propósito: es el paso que
    // más define el resultado en pigmento, no un accesorio.
    if (g.includes("despigmentante") || a.familia === "filtro" || id === "oxidos_de_hierro") out.add("manchas");

    // Textura y opacidad: lo que acelera el recambio.
    if (g.includes("renovador") || id === "urea") out.add("textura");

    // Resequedad y tirantez.
    if (g.includes("barrera-reparadora") || ["humectante", "calmante", "emoliente", "barrera"].includes(a.familia)) {
      out.add("deshidratacion");
    }
  }
  return [...out];
}

function marcaDe(nombre: string): string | undefined {
  const n = nombre.toLowerCase();
  for (const [buscar, marca] of MARCAS) if (n.includes(buscar.toLowerCase())) return marca;
  return undefined;
}

// La lista de ingredientes aparece bajo encabezados muy variados.
function ingredientesDe(texto: string): string | null {
  const marcadores = [
    /lista completa de ingredientes/i,
    /^#+\s*ingredientes/im,
    /\bINGREDIENTES?\s*:/i,
    /\bINGREDIENTS?\s*:/i,
    /full ingredients/i,
    // Avène publica la lista bajo "Composición", sin la palabra "ingredientes".
    /composici[oó]n/i,
  ];
  for (const re of marcadores) {
    const m = texto.match(re);
    if (!m) continue;
    const resto = texto.slice((m.index ?? 0) + m[0].length);
    const corte = resto.search(/\n#{1,3}\s/);
    const bloque = (corte > 0 ? resto.slice(0, corte) : resto).trim();
    if (bloque.length > 20) return bloque.replace(/\s+/g, " ").slice(0, 4000);
  }
  const linea = texto
    .split("\n")
    .filter((l) => (l.match(/,/g) || []).length >= 6)
    .sort((a, b) => b.length - a.length)[0];
  if (linea && /aqua|water|glycerin|alcohol|acid/i.test(linea)) {
    return linea.replace(/\s+/g, " ").trim().slice(0, 4000);
  }
  return null;
}

interface Fila {
  mlId: string;
  urlKind: string;
  nombre: string;
  marca?: string;
  categoria: string;
  momento: string;
  tiposPiel: string[];
  preocupaciones: string[];
  aptoSensible: boolean;
  motivosSensible: string[];
  origen: string;
  rangoPrecio: number;
  prioridad: number;
  comodin: boolean;
  urlReferencia: string;
  ingredientes: string | null;
  carpeta: string;
  archivo: string;
  nota?: string;
  /** Qué piel se sacó y por qué. Va como comentario al .ts generado. */
  exclusiones: string[];
}

const filas: Fila[] = [];
const problemas: string[] = [];

for (const p of walk(resolve(RAIZ))) {
  const texto = readFileSync(p, "utf8");
  const rel = relative(resolve(RAIZ), p).replace(/\\/g, "/");
  const carpeta = rel.split("/").slice(0, -1).join("/") || "(raíz)";
  const nombreArchivo = basename(p, ".md");

  const url = texto.match(/https:\/\/[^\s)]*mercadolibre[^\s)]*/)?.[0];
  const idm = url?.match(/\/(p|up)\/(MLA[U]?\d+)/);
  if (!idm) {
    problemas.push(`sin URL de Mercado Libre: ${rel}`);
    continue;
  }
  const [, urlKind, mlId] = idm;

  const ov = OVERRIDE[mlId];
  const categoria = ov?.categoria ?? matchear(nombreArchivo, POR_NOMBRE);
  if (!categoria) {
    problemas.push(`no se pudo deducir la categoría: ${rel}`);
    continue;
  }

  const cur = CURADO[mlId];
  if (!cur) {
    problemas.push(`sin entrada en overlay-organize.ts: ${rel}`);
    continue;
  }

  const activos = ACTIVOS_POR_PRODUCTO[mlId] ?? [];
  const { apto, motivos } = aptoSensible(activos);

  // Tipos de piel: se arranca con las CINCO y se resta con motivo. La carpeta
  // ("ORIENTADOS A PIEL GRASA") dice para quién rinde mejor, no a quién se le
  // puede ofrecer — alguien de piel normal puede usar casi cualquier cosa de
  // acá, y lo que decide es su objetivo, no su tipo de piel.
  const exclusiones: string[] = [];
  let tiposPiel = [...TODAS_LAS_PIELES];

  if (!apto) {
    tiposPiel = tiposPiel.filter((p) => p !== "sensible");
    exclusiones.push(`sensible: ${motivos.join(", ")}`);
  }
  if (cur.textura === "rica") {
    tiposPiel = tiposPiel.filter((p) => p !== "grasa");
    exclusiones.push("grasa: textura rica");
  }
  for (const ex of cur.excluir ?? []) {
    tiposPiel = tiposPiel.filter((p) => p !== ex.piel);
    exclusiones.push(`${ex.piel}: ${ex.motivo}`);
  }

  const preocupaciones = [...new Set([...preocupacionesDe(activos), ...(cur.sumar ?? [])])];

  const ing = ingredientesDe(texto);
  if (!ing) problemas.push(`sin lista de ingredientes: ${rel}`);

  filas.push({
    mlId,
    urlKind,
    nombre: nombreArchivo,
    marca: marcaDe(nombreArchivo),
    categoria,
    momento: MOMENTO[categoria] ?? "ambos",
    tiposPiel,
    preocupaciones,
    aptoSensible: apto,
    motivosSensible: motivos,
    origen: cur.origen,
    rangoPrecio: cur.rangoPrecio,
    prioridad: cur.prioridad,
    comodin: cur.comodin ?? false,
    urlReferencia: `https://www.mercadolibre.com.ar/${urlKind}/${mlId}`,
    ingredientes: ing,
    carpeta,
    archivo: rel,
    nota: [ov?.nota, cur.nota].filter(Boolean).join(" · ") || undefined,
    exclusiones,
  });
}

// ── Salida ──────────────────────────────────────────────────────────────────

filas.sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre));

const destino = resolve(process.cwd(), "src/niches/skincare/productos.organize.ts");
const lineas: string[] = [
  `import type { Producto } from "@/engine/recomendacion";`,
  ``,
  `// GENERADO por scripts/importar-organize.ts desde el vault "Club de Piel / Organize".`,
  `// No editar a mano: se regenera. Lo editorial va en catalogo-overlay / activos.ts.`,
  `//`,
  `// TODOS salen con activo:false porque el vault NO trae link de afiliado ni precio.`,
  `// Para activar uno: pegar link_afiliado, precio_ars, por_que y como_usar, y poner`,
  `// activo:true. Mientras tanto no se le muestran a nadie, que es lo correcto.`,
  ``,
  `export const productosOrganize: Producto[] = [`,
];

for (const f of filas) {
  lineas.push(`  {`);
  lineas.push(`    // ${f.carpeta}`);
  if (f.nota) lineas.push(`    // ${f.nota}`);
  for (const e of f.exclusiones) lineas.push(`    // no va a → ${e}`);
  lineas.push(`    id: ${JSON.stringify(uuidDe(f.mlId))},`);
  lineas.push(`    ml_id: ${JSON.stringify(f.mlId)},`);
  lineas.push(`    nombre: ${JSON.stringify(f.nombre)},`);
  if (f.marca) lineas.push(`    marca: ${JSON.stringify(f.marca)},`);
  lineas.push(`    categoria: ${JSON.stringify(f.categoria)},`);
  lineas.push(`    paso: 0,`);
  lineas.push(`    momento: ${JSON.stringify(f.momento)},`);
  lineas.push(`    tipos_piel: ${JSON.stringify(f.tiposPiel)},`);
  lineas.push(`    preocupaciones: ${JSON.stringify(f.preocupaciones)},`);
  lineas.push(`    origen: ${JSON.stringify(f.origen)},`);
  lineas.push(`    apto_sensible: ${f.aptoSensible},`);
  lineas.push(`    rango_precio: ${f.rangoPrecio}, // provisional, por marca`);
  lineas.push(`    link_afiliado: "", // TODO: sin esto el producto NO monetiza`);
  lineas.push(`    url_referencia: ${JSON.stringify(f.urlReferencia)},`);
  lineas.push(`    prioridad: ${f.prioridad},`);
  lineas.push(`    comodin: ${f.comodin},`);
  lineas.push(`    activo: false,`);
  lineas.push(`  },`);
}
lineas.push(`];`);
lineas.push(``);

writeFileSync(destino, lineas.join("\n"), "utf8");

// Mapa de ingredientes crudo, para curar la capa de activos a mano.
const mapa = Object.fromEntries(filas.map((f) => [f.mlId, f.ingredientes]));
writeFileSync(
  resolve(process.cwd(), "scripts/ingredientes-organize.json"),
  JSON.stringify(mapa, null, 2),
  "utf8",
);

console.log(`Productos importados: ${filas.length}`);
const porCat = new Map<string, number>();
for (const f of filas) porCat.set(f.categoria, (porCat.get(f.categoria) ?? 0) + 1);
for (const [c, n] of [...porCat].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${c}`);
console.log(`\nAptos para piel sensible: ${filas.filter((f) => f.aptoSensible).length} / ${filas.length}`);
console.log("Cobertura por tipo de piel:");
for (const piel of TODAS_LAS_PIELES) {
  const n = filas.filter((f) => f.tiposPiel.includes(piel)).length;
  const barra = "█".repeat(Math.round((n / filas.length) * 30));
  console.log(`  ${piel.padEnd(10)} ${String(n).padStart(3)}/${filas.length}  ${barra}`);
}
console.log("Cobertura por preocupación:");
for (const c of ["acne", "manchas", "textura", "deshidratacion"]) {
  const n = filas.filter((f) => f.preocupaciones.includes(c)).length;
  console.log(`  ${c.padEnd(15)} ${String(n).padStart(3)}/${filas.length}`);
}
console.log(`Sin preocupación derivable: ${filas.filter((f) => !f.preocupaciones.length).length}`);
console.log(`Sin lista de ingredientes: ${filas.filter((f) => !f.ingredientes).length}`);
if (problemas.length) {
  console.log(`\nPROBLEMAS (${problemas.length}):`);
  for (const p of problemas) console.log(`  · ${p}`);
}
console.log(`\nEscrito: ${relative(process.cwd(), destino)}`);
console.log(`Escrito: scripts/ingredientes-organize.json`);
