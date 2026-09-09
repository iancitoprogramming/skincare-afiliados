import { describe, it, expect } from "vitest";
import { normalizarPrecio, normalizarImagen, bandaDePrecio } from "./relevamiento";

describe("normalizarPrecio", () => {
  it("acepta los formatos que uno copia de Mercado Libre", () => {
    for (const crudo of ["24.693", "$24.693", "24693", "$ 24.693", "24.693,00", "ARS 24.693"]) {
      expect(normalizarPrecio(crudo), crudo).toEqual({ precio: 24693 });
    }
  });

  it("el punto es separador de miles, no decimal", () => {
    // Es el error que más caro sale: un parser que lea 24.693 a la inglesa
    // guarda "24,69" y el número se ve perfectamente normal en el JSON.
    expect(normalizarPrecio("24.693")).toEqual({ precio: 24693 });
    expect(normalizarPrecio("114.414")).toEqual({ precio: 114414 });
  });

  it("descarta los centavos en vez de tomarlos como miles", () => {
    expect(normalizarPrecio("32.661,50")).toEqual({ precio: 32661 });
  });

  it("rechaza lo que no es un número", () => {
    for (const crudo of ["", "—", "ver en ML", "USD 30"]) {
      expect(normalizarPrecio(crudo), crudo).toHaveProperty("error");
    }
  });

  it("rechaza precios fuera de rango: son casi siempre un error de tipeo", () => {
    expect(normalizarPrecio("50")).toEqual({ error: "precio_fuera_de_rango" });
    expect(normalizarPrecio("9.999.999")).toEqual({ error: "precio_fuera_de_rango" });
  });
});

describe("normalizarImagen", () => {
  const cuadrada =
    "https://http2.mlstatic.com/D_Q_NP_2X_832048-MLA104005799796_012026-V.webp";
  const original =
    "https://http2.mlstatic.com/D_NQ_NP_2X_832048-MLA104005799796_012026-F.webp";

  it("deriva las dos variantes a partir de cualquiera de las dos", () => {
    expect(normalizarImagen(cuadrada)).toEqual({ url: cuadrada, hd: original });
    expect(normalizarImagen(original)).toEqual({ url: cuadrada, hd: original });
  });

  it("limpia parámetros y sufijos pegados de más", () => {
    expect(normalizarImagen(`${cuadrada}?v=2`)).toEqual({ url: cuadrada, hd: original });
    expect(normalizarImagen(` <${cuadrada}> `)).toEqual({ url: cuadrada, hd: original });
  });

  it("rechaza lo que no es de Mercado Libre", () => {
    expect(normalizarImagen("https://ejemplo.com/foto.webp")).toEqual({
      error: "imagen_no_es_ml",
    });
  });

  it("rechaza la miniatura", () => {
    // Sin _2X_ es la versión chica: se ve borrosa en una card de catálogo.
    expect(
      normalizarImagen("https://http2.mlstatic.com/D_Q_NP_832048-MLA104005799796_012026-V.webp"),
    ).toEqual({ error: "imagen_miniatura" });
  });
});

// La banda es lo único de precio que se publica (docs/PRECIO.md), así que el
// relevamiento tiene que producirla, no dejarla para traducir a mano.
describe("bandaDePrecio", () => {
  it("respeta los tres grupos medidos del catálogo", () => {
    expect(bandaDePrecio(15_488)).toBe(1); // el más barato del rango 1
    expect(bandaDePrecio(32_999)).toBe(1); // el más caro del rango 1
    expect(bandaDePrecio(36_719)).toBe(2); // el más barato del rango 2
    expect(bandaDePrecio(54_739)).toBe(2); // el más caro del rango 2
    expect(bandaDePrecio(55_620)).toBe(3); // el más barato del rango 3
    expect(bandaDePrecio(114_414)).toBe(3); // el más caro del catálogo
  });

  it("clasifica igual que la mano en los 26 productos que ya tenían banda", async () => {
    const { productos } = await import("../niches/skincare/productos");
    const discrepan = productos
      .filter((p) => typeof p.precio_ars === "number")
      .filter((p) => bandaDePrecio(p.precio_ars!) !== p.rango_precio)
      .map((p) => `${p.nombre}: $${p.precio_ars} → ${bandaDePrecio(p.precio_ars!)} vs ${p.rango_precio}`);
    expect(discrepan).toEqual([]);
  });
});
