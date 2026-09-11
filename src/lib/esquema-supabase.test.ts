// El catálogo y la tabla `productos` de Supabase no se pueden separar.
//
// Ya pasó: productos.ts sumó diez campos —el relevamiento de Mercado Libre,
// `cuenta`, `en_rutina`— y ninguna migración les dio columna. `npm run sync` sube
// los objetos enteros, así que el upsert fallaba completo. No se notaba: sin
// Supabase configurado, el sitio lee el archivo local. El día que se prendiera el
// tracking, el catálogo de producción iba a salir de una copia sin `en_rutina`, y
// los productos que se venden pero no se recomiendan volvían a recomendarse.
//
// Se testea leyendo las migraciones, igual que `precio.test.ts` lee los
// componentes: lo que hay que impedir es que un campo entre al catálogo sin su
// columna, y eso se ve en los archivos, no en una base que corre en otro lado.

import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { productos } from "../niches/skincare/productos";
import { CAMPOS_DERIVADOS, filaDeProducto } from "../engine/catalogo";

const MIGRACIONES = join(__dirname, "..", "..", "supabase", "migrations");

/** Palabras que abren una restricción, no una columna. */
const NO_ES_COLUMNA = /^(primary|unique|check|constraint|foreign|references|exclude)$/i;

function columnasDeProductos(): Set<string> {
  const columnas = new Set<string>();
  const archivos = readdirSync(MIGRACIONES)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const archivo of archivos) {
    const sql = readFileSync(join(MIGRACIONES, archivo), "utf8").replace(/--.*$/gm, "");

    const tabla = /create table if not exists productos\s*\(([\s\S]*?)\r?\n\);/i.exec(sql);
    if (tabla) {
      for (const linea of tabla[1].split(/\r?\n/)) {
        const m = /^\s*([a-z_][a-z0-9_]*)\s+/i.exec(linea);
        if (m && !NO_ES_COLUMNA.test(m[1])) columnas.add(m[1].toLowerCase());
      }
    }

    // En Postgres la palabra `column` es opcional: `add rating real` también vale.
    const agregadas =
      /alter table\s+productos\s+add\s+(?:column\s+)?(?:if not exists\s+)?([a-z_][a-z0-9_]*)/gi;
    for (const m of sql.matchAll(agregadas)) {
      if (!NO_ES_COLUMNA.test(m[1])) columnas.add(m[1].toLowerCase());
    }
  }
  return columnas;
}

describe("catálogo y tabla productos", () => {
  it("el lector de migraciones encuentra columnas que se sabe que existen", () => {
    // Si esto falla, el test de abajo estaría aprobando por no leer nada.
    const columnas = columnasDeProductos();
    for (const c of ["id", "nombre", "categoria", "link_afiliado", "origen", "relevado"]) {
      expect(columnas.has(c), `falta ${c}`).toBe(true);
    }
  });

  it("todo lo que sube `sync` tiene su columna en alguna migración", () => {
    const columnas = columnasDeProductos();
    const sinColumna = new Set<string>();
    for (const p of productos) {
      for (const campo of Object.keys(filaDeProducto(p))) {
        if (!columnas.has(campo)) sinColumna.add(campo);
      }
    }
    expect([...sinColumna].sort()).toEqual([]);
  });

  it("los campos derivados no se suben: se calculan al leer", () => {
    for (const p of productos) {
      const fila = filaDeProducto(p);
      for (const campo of CAMPOS_DERIVADOS) expect(fila).not.toHaveProperty(campo);
    }
  });
});
