import { describe, it, expect } from "vitest";
import { armarRutina, type Rutina } from "./recomendacion";
import { productos } from "../niches/skincare/productos";
import { RUTINAS, skincareQuiz } from "../niches/skincare/config";

const valores = (urlKey: string) =>
  skincareQuiz.questions.find((q) => q.urlKey === urlKey)!.options.map((o) => o.value);

const pieles = valores("p");
const objetivos = valores("o");
const presupuestos = valores("b").map(Number);
const niveles = valores("n") as ("0" | "1")[];

function pasoValido(p: Rutina["am"][number]) {
  expect(p.producto).toBeDefined();
  expect(p.producto.link_afiliado.length).toBeGreaterThan(0);
  expect(p.producto.activo).toBe(true);
}

describe("armarRutina", () => {
  it("nunca deja un paso vacío en ninguna combinación", () => {
    let combos = 0;
    for (const nivel of niveles) {
      for (const piel of pieles) {
        for (const objetivo of objetivos) {
          for (const presupuesto of presupuestos) {
            combos++;
            const rutina = armarRutina(productos, RUTINAS[nivel], {
              piel,
              objetivo,
              presupuesto,
            });
            expect(rutina.am.length).toBeGreaterThan(0);
            expect(rutina.pm.length).toBeGreaterThan(0);
            [...rutina.am, ...rutina.pm].forEach(pasoValido);
          }
        }
      }
    }
    // 4 pieles × 4 objetivos × 3 presupuestos = 48, por 2 niveles = 96
    expect(combos).toBe(96);
  });

  it("el protector solar va siempre a la mañana, nunca a la noche", () => {
    for (const nivel of niveles) {
      for (const piel of pieles) {
        for (const objetivo of objetivos) {
          for (const presupuesto of presupuestos) {
            const rutina = armarRutina(productos, RUTINAS[nivel], {
              piel,
              objetivo,
              presupuesto,
            });
            expect(rutina.am.some((p) => p.slot.categoria === "protector_solar")).toBe(true);
            expect(rutina.pm.some((p) => p.slot.categoria === "protector_solar")).toBe(false);
          }
        }
      }
    }
  });

  it("respeta el presupuesto salvo cuando cae al comodín (garantía de no dejar vacío)", () => {
    for (const nivel of niveles) {
      for (const piel of pieles) {
        for (const objetivo of objetivos) {
          for (const presupuesto of presupuestos) {
            const rutina = armarRutina(productos, RUTINAS[nivel], {
              piel,
              objetivo,
              presupuesto,
            });
            [...rutina.am, ...rutina.pm].forEach((p) => {
              if (p.fallback !== "comodin") {
                expect(p.producto.rango_precio).toBeLessThanOrEqual(presupuesto);
              }
            });
          }
        }
      }
    }
  });
});

describe("catálogo", () => {
  it("tiene un comodín por cada categoría que usa la rutina", () => {
    const categorias = new Set(
      [...RUTINAS["0"], ...RUTINAS["1"]].map((slot) => slot.categoria),
    );
    for (const categoria of categorias) {
      const tieneComodin = productos.some(
        (p) => p.activo && p.comodin && p.categoria === categoria,
      );
      expect(tieneComodin, `falta comodín en la categoría "${categoria}"`).toBe(true);
    }
  });
});
