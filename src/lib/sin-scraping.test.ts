// Nada del proyecto le pide datos a Mercado Libre por fuera de la API oficial.
//
// La obligación (e) del Programa de Afiliados prohíbe "cualquier medio o forma
// automatizada de desarticulación u otros métodos de extracción de datos para
// acceder, consultar, recopilar o utilizar la propiedad intelectual y/o
// información de Mercado Libre, incluyendo web scraping". El detalle está en
// `docs/proyecto/07-AFILIADOS.md` §4.
//
// Se testea leyendo los archivos, igual que `precio.test.ts`, y por el mismo
// motivo: lo que hay que impedir es que el scraping VUELVA. Es la clase de código
// que se reintroduce con la mejor intención — alguien quiere verificar una cuenta,
// medir un precio o contar opiniones, escribe seis líneas y funciona. Y funciona
// hasta que Mercado Libre lo nota, que es cuando ya no importa cuál era la
// intención.
//
// Romper esta regla no da error en ningún lado: el script anda, los datos entran
// y las comisiones se siguen pagando. Por eso hace falta un test.

import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const RAIZ = join(__dirname, "..", "..");
const CARPETAS = ["src", "scripts"];

/**
 * La única salida a un dominio de Mercado Libre que se acepta hoy.
 *
 * `/api/og/producto/[slug]` descarga la foto del producto del CDN para hornearla
 * en la imagen de Open Graph. Es un asset que ya mostramos, no extracción de
 * datos: no se parsea nada ni se consulta información que la publicación no
 * exhiba. Queda anotado igual porque es la excepción, y una excepción sin nombre
 * es una puerta abierta.
 */
const PERMITIDO = [{ archivo: "src/app/api/og/producto/[slug]/route.tsx", host: "mlstatic.com" }];

const HOSTS = /https?:\/\/[^"'`\s]*(mercadolibre\.com|mercadolibre\.com\.ar|meli\.la|mlstatic\.com)/gi;

function archivos(dir: string, ext: string[]): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return archivos(p, ext);
    return ext.some((e) => n.endsWith(e)) ? [p] : [];
  });
}

const sinComentarios = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/** Archivos que ejecutan una llamada de red, con el destino que usan. */
function llamadasDeRed(): { archivo: string; host: string }[] {
  const salida: { archivo: string; host: string }[] = [];
  for (const carpeta of CARPETAS) {
    for (const ruta of archivos(join(RAIZ, carpeta), [".ts", ".tsx"])) {
      if (ruta.endsWith(".test.ts") || ruta.endsWith(".test.tsx")) continue;
      const codigo = sinComentarios(readFileSync(ruta, "utf8"));
      if (!/\bfetch\s*\(|\baxios\b|node:https?\b|require\(["']https?["']\)/.test(codigo)) continue;
      const relativo = ruta.slice(RAIZ.length + 1).split(sep).join("/");
      for (const m of codigo.matchAll(HOSTS)) salida.push({ archivo: relativo, host: m[1] });
    }
  }
  return salida;
}

describe("nada le extrae datos a Mercado Libre", () => {
  it("ningún archivo hace una llamada de red a un dominio de ML fuera de la excepción", () => {
    const infractores = llamadasDeRed().filter(
      (x) => !PERMITIDO.some((p) => p.archivo === x.archivo && x.host.includes(p.host)),
    );
    expect(infractores).toEqual([]);
  });

  // El script que hacía esto es `cuentas.ts`, y la señal de que el camino no
  // estaba sancionado era justamente ésta: sin un User-Agent de navegador puesto
  // a mano, `meli.la` no devolvía el Location. Falsear el agente para obtener una
  // respuesta que de otro modo no llega es la definición práctica del problema.
  it("nadie falsea un User-Agent de navegador", () => {
    const culpables: string[] = [];
    for (const carpeta of CARPETAS) {
      for (const ruta of archivos(join(RAIZ, carpeta), [".ts", ".tsx"])) {
        if (ruta.endsWith(".test.ts")) continue;
        const codigo = sinComentarios(readFileSync(ruta, "utf8"));
        if (/["']user-agent["']\s*:|Mozilla\/5\.0/i.test(codigo)) {
          culpables.push(ruta.slice(RAIZ.length + 1).split(sep).join("/"));
        }
      }
    }
    expect(culpables).toEqual([]);
  });

  it("cuentas.ts no vuelve a resolver la cuenta contra Mercado Libre", () => {
    const codigo = sinComentarios(readFileSync(join(RAIZ, "scripts", "cuentas.ts"), "utf8"));
    expect(codigo).not.toMatch(/\bfetch\s*\(/);
    expect(codigo).not.toMatch(/\/social\//);
  });
});
