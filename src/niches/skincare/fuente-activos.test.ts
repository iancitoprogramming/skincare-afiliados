// De dónde salió la lista de activos de cada producto, como dato y no como prosa.
//
// POR QUÉ EXISTE
//
// `Cleanex Free Gel` tenía la lista vacía y el comentario "no verificado". El
// motor lee una lista vacía como "este producto no trae nada", que es lo mismo
// que dice un producto verificado sin activos declarables. Las dos cosas se ven
// idénticas en el código y son opuestas: una es conocimiento, la otra es su
// ausencia. Cleanex pasó por limpio en 36 rutinas hasta que se leyó el INCI y
// resultó que traía fragancia.
//
// Averiguar el estado leyendo los comentarios no sirve: al intentarlo, 53 de 84
// entradas quedaron sin clasificar porque la prosa explicaba el mapeo sin decir
// la palabra. Por eso cada entrada lleva ahora un marcador explícito.
//
// LOS TRES MARCADORES
//
//   [INCI]      se leyó el INCI de fuente oficial y se mapeó
//   [vault]     viene del vault de Obsidian, sin INCI verificado
//   [pendiente] falta verificarlo
//
// El marcador vale para la entrada que le sigue y para las siguientes hasta que
// aparezca un bloque de comentario nuevo, que es como está escrito el archivo.
// El registro de qué se auditó y con qué fuente está en `docs/AUDITORIA-PRODUCTOS.md`.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ACTIVOS_POR_PRODUCTO } from "./activos";

const ARCHIVO = join(__dirname, "activos.ts");
const MARCADOR = /\[(INCI|vault|pendiente)\]/;

/** Recorre el mapa y devuelve, para cada ml_id, el marcador que le aplica. */
function marcadorPorProducto(): Map<string, string | null> {
  const sql = readFileSync(ARCHIVO, "utf8");
  const cuerpo = sql.slice(sql.indexOf("export const ACTIVOS_POR_PRODUCTO"));
  const salida = new Map<string, string | null>();

  let bloque: string[] = [];
  let vigente = "";
  let trasClave = false;

  for (const linea of cuerpo.split(/\r?\n/)) {
    const t = linea.trim();
    if (t.startsWith("//")) {
      if (trasClave) {
        bloque = [];
        trasClave = false;
      }
      bloque.push(t);
      continue;
    }
    const m = /^(MLAU?[0-9]+):/.exec(t);
    if (!m) continue;
    if (bloque.length) vigente = bloque.join(" ");
    salida.set(m[1], MARCADOR.exec(vigente)?.[1] ?? null);
    trasClave = true;
  }
  return salida;
}

describe("fuente de los activos de cada producto", () => {
  it("el lector encuentra todas las entradas del mapa", () => {
    // Si esto falla, los tests de abajo aprobarían por no leer nada.
    const leidas = marcadorPorProducto();
    expect(leidas.size).toBe(Object.keys(ACTIVOS_POR_PRODUCTO).length);
  });

  it("toda entrada declara de dónde salió su lista de activos", () => {
    const sinMarcador = [...marcadorPorProducto()]
      .filter(([, marcador]) => marcador === null)
      .map(([id]) => id);
    expect(sinMarcador).toEqual([]);
  });

  it("no se inventan marcadores nuevos", () => {
    const validos = ["INCI", "vault", "pendiente"];
    for (const [id, marcador] of marcadorPorProducto()) {
      expect(validos, `${id} usa un marcador desconocido`).toContain(marcador);
    }
  });

  // No es una meta de cobertura: es para que el número quede a la vista y el día
  // que alguien verifique una tanda, este test le recuerde actualizar el registro.
  it("deja constancia de cuánto falta auditar", () => {
    const marcadores = [...marcadorPorProducto().values()];
    const pendientes = marcadores.filter((m) => m === "pendiente").length;
    const total = marcadores.length;
    expect(pendientes).toBeLessThanOrEqual(total);
    console.log(
      `   activos: ${total - pendientes} de ${total} con fuente verificada · ${pendientes} pendientes`,
    );
  });
});
