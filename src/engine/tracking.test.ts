import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { extraerUtm, referrerExterno, resolverEntrada } from "./tracking";

// La atribución por utm_* se rompió sin que nadie lo viera: el quiz reescribe la
// query al elegir la primera respuesta y, al terminar, ya no había utm que leer.
// Las ocho sesiones que había el 16/9 tenían utm = null. Estos tests fijan lo que
// tiene que pasar con la entrada de una visita, que es lo que la campaña mide.

describe("extraerUtm", () => {
  it("se queda sólo con los utm_*", () => {
    expect(extraerUtm("?o=manchas&utm_source=pinterest&utm_campaign=manchas")).toEqual({
      utm_source: "pinterest",
      utm_campaign: "manchas",
    });
  });

  it("sin utm devuelve undefined, no un objeto vacío", () => {
    expect(extraerUtm("?o=manchas&p=mixta")).toBeUndefined();
    expect(extraerUtm("")).toBeUndefined();
    expect(extraerUtm("?utm_source=")).toBeUndefined();
  });
});

describe("referrerExterno", () => {
  it("el propio sitio no cuenta como referrer", () => {
    expect(referrerExterno("https://clubdepiel.store/catalogo", "clubdepiel.store")).toBeUndefined();
  });

  it("de otro sitio guarda el origen, sin la ruta", () => {
    expect(referrerExterno("https://www.pinterest.com/pin/123/", "clubdepiel.store")).toBe(
      "https://www.pinterest.com",
    );
  });

  it("vacío o roto es undefined", () => {
    expect(referrerExterno("", "clubdepiel.store")).toBeUndefined();
    expect(referrerExterno("no es una url", "clubdepiel.store")).toBeUndefined();
  });
});

describe("resolverEntrada", () => {
  const pin = { utm: { utm_source: "pinterest" }, pagina: "/rutina", referrer: "https://www.pinterest.com" };

  it("la primera página de la pestaña es la entrada", () => {
    expect(
      resolverEntrada(
        { search: "?o=manchas&utm_source=pinterest", pathname: "/rutina", referrer: "https://www.pinterest.com" },
        null,
      ),
    ).toEqual(pin);
  });

  it("navegar después no la pisa: la que entró por el pin sigue siendo del pin", () => {
    expect(resolverEntrada({ search: "?o=manchas&p=mixta", pathname: "/rutina" }, pin)).toEqual(pin);
    expect(resolverEntrada({ search: "", pathname: "/producto/x" }, pin)).toEqual(pin);
  });

  it("una URL con utm nuevos sí la pisa: es otra pieza", () => {
    expect(
      resolverEntrada({ search: "?utm_source=instagram", pathname: "/kits" }, pin),
    ).toEqual({ utm: { utm_source: "instagram" }, pagina: "/kits", referrer: undefined });
  });

  it("sin utm ni entrada previa guarda página y referrer igual", () => {
    expect(
      resolverEntrada({ search: "", pathname: "/", referrer: "https://www.google.com" }, null),
    ).toEqual({ pagina: "/", referrer: "https://www.google.com" });
  });
});

// Lo que /api/clicks inserta tiene que tener columna. Si un deploy manda una
// columna que la tabla no tiene, PostgREST rechaza el insert entero y el clic se
// pierde en silencio; la migración va antes del deploy, y este test es lo que
// impide que el código se adelante al esquema en el repo.
describe("clicks y su tabla", () => {
  const RAIZ = join(__dirname, "..", "..");
  const NO_ES_COLUMNA = /^(primary|unique|check|constraint|foreign|references|exclude)$/i;

  function columnasDeClicks(): Set<string> {
    const columnas = new Set<string>();
    const dir = join(RAIZ, "supabase", "migrations");
    for (const archivo of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
      const sql = readFileSync(join(dir, archivo), "utf8").replace(/--.*$/gm, "");
      const tabla = /create table if not exists clicks\s*\(([\s\S]*?)\r?\n\);/i.exec(sql);
      if (tabla) {
        for (const linea of tabla[1].split(/\r?\n/)) {
          const m = /^\s*([a-z_][a-z0-9_]*)\s+/i.exec(linea);
          if (m && !NO_ES_COLUMNA.test(m[1])) columnas.add(m[1].toLowerCase());
        }
      }
      const agregadas =
        /alter table\s+clicks\s+add\s+(?:column\s+)?(?:if not exists\s+)?([a-z_][a-z0-9_]*)/gi;
      for (const m of sql.matchAll(agregadas)) columnas.add(m[1].toLowerCase());
    }
    return columnas;
  }

  function camposQueInsertaLaRuta(): string[] {
    const fuente = readFileSync(join(RAIZ, "src/app/api/clicks/route.ts"), "utf8");
    const insert = /\.from\("clicks"\)\s*\.insert\(\{([\s\S]*?)\}\)/.exec(fuente);
    if (!insert) throw new Error("no se encontró el insert en /api/clicks");
    return [...insert[1].matchAll(/^\s*([a-z_]+):/gm)].map((m) => m[1]);
  }

  it("todo lo que inserta /api/clicks tiene su columna en alguna migración", () => {
    const columnas = columnasDeClicks();
    const campos = camposQueInsertaLaRuta();
    expect(campos.length).toBeGreaterThanOrEqual(3);
    expect(campos.filter((c) => !columnas.has(c))).toEqual([]);
  });
});
