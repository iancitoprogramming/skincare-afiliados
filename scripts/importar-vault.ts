// Importa el vault de Obsidian "Club de Piel" al formato del catálogo.
//
//   npm run importar-vault -- "<ruta a la carpeta Club de Piel>"
//
// El vault organiza por carpetas: <Piel>/<Tier>/<NN - Categoría>/<Producto>.md
// Un mismo producto aparece repetido en varias pieles: acá se deduplica por ID de
// Mercado Libre y se fusionan los `tipos_piel`.
//
// Todo lo que el vault NO tiene (precio, por qué, cómo usar, link de afiliado) sale
// marcado como TODO y el producto sale con `activo: false`. Nada entra a producción
// sin que alguien lo complete a mano. Es a propósito.

import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename, resolve } from "node:path";
import { createHash } from "node:crypto";

// El id de la tabla es uuid, pero la clave natural del vault es el id de Mercado
// Libre. Derivamos un UUID v5 determinístico del ml_id: re-importar da siempre el
// mismo id, así el upsert actualiza en vez de duplicar.
const NS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"; // namespace DNS, RFC 4122
function uuidDe(mlId: string): string {
  const ns = Buffer.from(NS.replace(/-/g, ""), "hex");
  const h = createHash("sha1").update(Buffer.concat([ns, Buffer.from(mlId, "utf8")])).digest();
  h[6] = (h[6] & 0x0f) | 0x50; // versión 5
  h[8] = (h[8] & 0x3f) | 0x80; // variante RFC 4122
  const x = h.subarray(0, 16).toString("hex");
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

const RAIZ = process.argv[2];
if (!RAIZ) {
  console.error("Falta la ruta del vault.");
  console.error('  npm run importar-vault -- "C:/ruta/Club de Piel"');
  process.exit(1);
}

// ── Normalizadores de nombre de carpeta ─────────────────────────────────────
const PIELES: [RegExp, string][] = [
  [/grasa/i, "grasa"],
  [/mixta/i, "mixta"],
  [/normal/i, "normal"],
  [/seca/i, "seca"],
  [/sensible/i, "sensible"],
];

// El orden importa: "limpiador oleoso" tiene que ganarle a "limpiador".
const CATEGORIAS: [RegExp, string][] = [
  [/limpiador\s+oleoso/i, "limpiador_oleoso"],
  [/limpiador/i, "limpiador"],
  [/t[oó]nico|esencia/i, "tonico"],
  [/serum\s+secundario|ampolla/i, "serum_secundario"],
  [/serum/i, "serum_activo"],
  [/contorno/i, "contorno"],
  [/hidratante/i, "hidratante"],
  [/protector\s+solar/i, "protector_solar"],
  [/exfoliante/i, "exfoliante"],
  [/retinoide/i, "retinoide"],
];

const MOMENTO: Record<string, "am" | "pm" | "ambos"> = {
  protector_solar: "am",
  limpiador_oleoso: "pm",
  exfoliante: "pm",
  retinoide: "pm",
};

const MARCAS = ["Skin1004", "COSRX", "Beauty Of Joseon", "Mixsoon"];

// Palabras que delatan un producto archivado en la categoría equivocada.
const DELATORES: [RegExp, string][] = [
  [/cleansing\s+oil|aceite\s+limpiador/i, "limpiador_oleoso"],
  [/cleanser|cleansing\s+foam|espuma\s+limpiadora/i, "limpiador"],
  [/sunscreen|protector\s+solar|sun\s+serum/i, "protector_solar"],
  [/\bcream\b|crema|moisturi/i, "hidratante"],
];

function matchear(nombre: string, tabla: [RegExp, string][]): string | null {
  for (const [re, valor] of tabla) if (re.test(nombre)) return valor;
  return null;
}

function dirs(p: string): string[] {
  try {
    return readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory());
  } catch {
    return [];
  }
}

interface Fila {
  ml_id: string;
  nombre: string;
  marca: string;
  categoria: string;
  paso: number;
  tipos_piel: Set<string>;
  tiers: Set<string>;
  url: string;
  sensible: boolean;
}

const porMlId = new Map<string, Fila>();
const avisos: string[] = [];
let notas = 0;

for (const dPiel of dirs(RAIZ)) {
  const piel = matchear(dPiel, PIELES);
  if (!piel) {
    avisos.push(`carpeta de piel no reconocida: "${dPiel}"`);
    continue;
  }
  for (const dTier of dirs(join(RAIZ, dPiel))) {
    const tier = dTier.match(/Tier\s*(\d)/i)?.[1];
    if (!tier) continue; // "Sustitutos suaves" y demás carpetas de apoyo
    for (const dCat of dirs(join(RAIZ, dPiel, dTier))) {
      const categoria = matchear(dCat, CATEGORIAS);
      if (!categoria) {
        avisos.push(`categoría no reconocida: "${dPiel}/${dTier}/${dCat}"`);
        continue;
      }
      const paso = Number(dCat.match(/^(\d+)/)?.[1] ?? 0);
      const carpeta = join(RAIZ, dPiel, dTier, dCat);
      for (const f of readdirSync(carpeta).filter((x) => x.endsWith(".md"))) {
        notas++;
        const texto = readFileSync(join(carpeta, f), "utf8");
        const url = texto.match(/https:\/\/[^\s)]+/)?.[0] ?? "";
        const ml_id = url.match(/\/(MLAU?\d+)/)?.[1] ?? "";
        // Obsidian numera los duplicados con " 1", " 2"… al final del nombre.
        const nombre = basename(f, ".md").replace(/\s+\d+$/, "").trim();

        if (!ml_id) {
          avisos.push(`sin ID de Mercado Libre: "${dPiel}/${dTier}/${dCat}/${f}"`);
          continue;
        }

        // ¿El producto pertenece a la categoría donde está archivado?
        const delator = matchear(nombre, DELATORES);
        if (delator && delator !== categoria) {
          avisos.push(
            `MAL ARCHIVADO: "${nombre}" está en ${categoria} pero parece ${delator} (${dPiel}/${dTier})`,
          );
        }

        const previo = porMlId.get(ml_id);
        if (previo) {
          previo.tipos_piel.add(piel);
          previo.tiers.add(tier);
          if (piel === "sensible") previo.sensible = true;
          if (previo.categoria !== categoria) {
            avisos.push(
              `"${nombre}" figura como ${previo.categoria} y como ${categoria}. Se usa ${previo.categoria}.`,
            );
          }
          continue;
        }

        porMlId.set(ml_id, {
          ml_id,
          nombre,
          marca: MARCAS.find((m) => nombre.toLowerCase().includes(m.toLowerCase())) ?? "",
          categoria,
          paso,
          tipos_piel: new Set([piel]),
          tiers: new Set([tier]),
          url,
          sensible: piel === "sensible",
        });
      }
    }
  }
}

// ── Salida ──────────────────────────────────────────────────────────────────
const filas = [...porMlId.values()].sort(
  (a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre),
);

const arr = (xs: string[]) => `[${xs.map((x) => `"${x}"`).join(", ")}]`;

const cuerpo = filas
  .map((f) => {
    const momento = MOMENTO[f.categoria] ?? "ambos";
    return [
      "  {",
      `    // ${f.ml_id} · aparece en Tier ${[...f.tiers].sort().join(", ")}`,
      `    id: "${uuidDe(f.ml_id)}",`,
      `    ml_id: "${f.ml_id}",`,
      `    nombre: ${JSON.stringify(f.nombre)},`,
      `    marca: ${JSON.stringify(f.marca)},${f.marca ? "" : " // TODO: marca"}`,
      `    categoria: "${f.categoria}",`,
      `    paso: ${f.paso},`,
      `    momento: "${momento}",`,
      `    tipos_piel: ${arr([...f.tipos_piel].sort())},`,
      "    preocupaciones: [], // TODO: acne | manchas | textura | deshidratacion",
      '    origen: "coreano",',
      `    apto_sensible: ${f.sensible},`,
      "    rango_precio: 2, // TODO: 1 económico · 2 medio · 3 premium",
      "    precio_ars: undefined, // TODO: el vault no trae precio",
      "    link_afiliado: LINK_PLACEHOLDER, // TODO: generar en el panel de Afiliados de ML",
      `    url_referencia: ${JSON.stringify(f.url)},`,
      '    por_que: "", // TODO: una línea nuestra, en español. No copiar al fabricante.',
      '    como_usar: "", // TODO',
      `    relevado: "${new Date().toISOString().slice(0, 10)}",`,
      "    prioridad: 3,",
      "    comodin: false,",
      "    activo: false, // se prende cuando esté completo",
      "  },",
    ].join("\n");
  })
  .join("\n");

const salida = [
  'import type { Producto } from "@/engine/recomendacion";',
  "",
  "// GENERADO por scripts/importar-vault.ts a partir del vault de Obsidian.",
  `// ${filas.length} productos únicos salidos de ${notas} notas.`,
  "//",
  "// Todos salen con activo:false y con TODO en lo que el vault no trae.",
  "// Completalos y pasalos a productos.ts. No edites este archivo esperando",
  "// regenerarlo después: se pisa entero.",
  "",
  'const LINK_PLACEHOLDER = "https://www.mercadolibre.com.ar/#REEMPLAZAR-LINK-AFILIADO";',
  "",
  "export const importados: Producto[] = [",
  cuerpo,
  "];",
  "",
].join("\n");

const destino = resolve(process.cwd(), "src/niches/skincare/productos.importados.ts");
writeFileSync(destino, salida, "utf8");

console.log(`\n${notas} notas → ${filas.length} productos únicos`);
console.log(`→ ${destino}\n`);

const porCat = new Map<string, number>();
for (const f of filas) porCat.set(f.categoria, (porCat.get(f.categoria) ?? 0) + 1);
console.log("Por categoría:");
for (const [c, n] of [...porCat].sort()) console.log(`  ${c.padEnd(20)} ${n}`);

const pieles = new Map<string, number>();
for (const f of filas) for (const p of f.tipos_piel) pieles.set(p, (pieles.get(p) ?? 0) + 1);
console.log("\nPor tipo de piel:");
for (const [p, n] of [...pieles].sort()) console.log(`  ${p.padEnd(20)} ${n}`);

if (avisos.length) {
  console.log(`\n${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`  · ${a}`);
}
console.log("");
