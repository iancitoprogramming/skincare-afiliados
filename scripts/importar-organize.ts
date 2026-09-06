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
  urlReferencia: string;
  ingredientes: string | null;
  carpeta: string;
  archivo: string;
  nota?: string;
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

  // Tipos de piel: la carpeta manda si es de las orientadas; si no, se deja
  // vacío para que lo complete una persona. Un producto sin tipos de piel no
  // se puede recomendar, y eso es mejor que recomendarlo a la piel equivocada.
  const tiposPiel = PIEL_POR_CARPETA.find(([re]) => re.test(carpeta))?.[1] ?? [];

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
    urlReferencia: `https://www.mercadolibre.com.ar/${urlKind}/${mlId}`,
    ingredientes: ing,
    carpeta,
    archivo: rel,
    nota: ov?.nota,
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
  lineas.push(`    // ${f.carpeta}${f.nota ? ` · ${f.nota}` : ""}`);
  lineas.push(`    id: ${JSON.stringify(uuidDe(f.mlId))},`);
  lineas.push(`    ml_id: ${JSON.stringify(f.mlId)},`);
  lineas.push(`    nombre: ${JSON.stringify(f.nombre)},`);
  if (f.marca) lineas.push(`    marca: ${JSON.stringify(f.marca)},`);
  lineas.push(`    categoria: ${JSON.stringify(f.categoria)},`);
  lineas.push(`    paso: 0, // TODO`);
  lineas.push(`    momento: ${JSON.stringify(f.momento)},`);
  lineas.push(`    tipos_piel: ${JSON.stringify(f.tiposPiel)}, ${f.tiposPiel.length ? "" : "// TODO: el vault no lo declara"}`);
  lineas.push(`    preocupaciones: [], // TODO`);
  lineas.push(`    origen: "europeo", // TODO: verificar`);
  lineas.push(`    apto_sensible: false, // TODO: decidir contra la lista de ingredientes`);
  lineas.push(`    rango_precio: 2, // TODO`);
  lineas.push(`    link_afiliado: "", // TODO: sin esto el producto NO monetiza`);
  lineas.push(`    url_referencia: ${JSON.stringify(f.urlReferencia)},`);
  lineas.push(`    prioridad: 3,`);
  lineas.push(`    comodin: false,`);
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
console.log(`\nSin tipos de piel declarados: ${filas.filter((f) => !f.tiposPiel.length).length}`);
console.log(`Sin lista de ingredientes: ${filas.filter((f) => !f.ingredientes).length}`);
if (problemas.length) {
  console.log(`\nPROBLEMAS (${problemas.length}):`);
  for (const p of problemas) console.log(`  · ${p}`);
}
console.log(`\nEscrito: ${relative(process.cwd(), destino)}`);
console.log(`Escrito: scripts/ingredientes-organize.json`);
