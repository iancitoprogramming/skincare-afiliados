// El criterio de calidad aplicado al catálogo de verdad. Estos tests fijan
// decisiones, no implementación: si alguno se pone en rojo, o cambió un grado de
// evidencia o cambió el criterio, y las dos cosas hay que decidirlas a mano.

import { describe, expect, it } from "vitest";
import { calidadDe, CONFIG_CALIDAD } from "./calidad";
import { productos } from "./productos";
import { ACTIVOS, SIN_NIVEL_DE_EVIDENCIA } from "./activos";

const por = (mlId: string) => {
  const p = productos.find((x) => x.ml_id === mlId);
  if (!p) throw new Error(`No está en el catálogo: ${mlId}`);
  return p;
};

// Los tres sérums de vitamina C pura del catálogo, que sirven de caso testigo.
const CE_FERULIC = "MLA24840827"; // SkinCeuticals C E Ferulic
const KOSMOS = "MLA45672941"; // Kosmos: el mismo trío C+E+ferúlico, y suma ceramida
const PURE_C12 = "MLA47223033"; // LRP Pure Vitamin C12: C pura, pero con alcohol y fragancia

describe("calidad de fórmula sobre el catálogo real", () => {
  it("todo producto sale con el campo calculado", () => {
    const sinCampo = productos.filter((p) => typeof p.calidad_formula !== "number");
    expect(sinCampo.map((p) => p.nombre)).toEqual([]);
  });

  // La trampa №5 de INGREDIENTES.md §10.3: el sérum con más activos por
  // mililitro del catálogo. Que apile no puede alcanzarle para ganar.
  it("apilar activos no gana: el Garnier no supera a la fórmula del paper", () => {
    const garnier = por("MLA18957818");
    expect(garnier.calidad_formula!).toBeLessThan(por(CE_FERULIC).calidad_formula!);
  });

  // El mismo activo de nivel A en los dos, y la diferencia la hace lo que
  // arrastran: alcohol denat y fragancia en un producto que queda puesto.
  it("entre dos sérums de vitamina C pura, gana el que no trae lastre", () => {
    expect(por(CE_FERULIC).calidad_formula!).toBeGreaterThan(por(PURE_C12).calidad_formula!);
  });

  // Es el resultado que menos gusta y el que más vale tener escrito. Kosmos
  // replica el trío C + E + ferúlico y encima suma ceramida, así que por
  // composición gana. Lo que el puntaje NO ve es la concentración: la fórmula del
  // paper es 15% de ascórbico, 1% de E y 0,5% de ferúlico, y ninguna de las dos
  // marcas está obligada a declararla. Si algún día se verifica el porcentaje,
  // este test es el lugar donde va a doler, y está bien que duela ahí.
  it("Kosmos le gana a C E Ferulic por composición, no por precio", () => {
    expect(por(KOSMOS).calidad_formula!).toBeGreaterThan(por(CE_FERULIC).calidad_formula!);
    expect(por(KOSMOS).rango_precio).toBeLessThan(por(CE_FERULIC).rango_precio);
  });

  it("un producto sin INCI verificado queda en cero, no en negativo ni en nulo", () => {
    // Avène Hydrance SPF30: INGREDIENTES.md lo declara sin verificar a propósito.
    expect(por("MLA67629151").calidad_formula).toBe(0);
  });
});

describe("configuración del nicho", () => {
  it("el salto grande de peso está entre B y C, que es la regla de la casa", () => {
    const { A, B, C, D } = CONFIG_CALIDAD.peso;
    expect(B - C).toBeGreaterThan(A - B);
    expect(B - C).toBeGreaterThan(C - D);
  });

  it("todo lo que pesa como lastre está declarado exento de nivel de evidencia", () => {
    const incoherentes = Object.keys(CONFIG_CALIDAD.lastre).filter(
      (id) => !ACTIVOS[id] || ACTIVOS[id].nivelEvidencia || !SIN_NIVEL_DE_EVIDENCIA[id],
    );
    expect(incoherentes).toEqual([]);
  });

  it("el alcohol cuesta menos en un protector solar que en un sérum", () => {
    expect(CONFIG_CALIDAD.exposicion("alcohol_denat", "protector_solar")).toBeLessThan(
      CONFIG_CALIDAD.exposicion("alcohol_denat", "serum_activo"),
    );
    // La excepción es del alcohol y de nadie más: la fragancia no tiene el
    // argumento de la textura, así que en un protector cuesta lo mismo.
    expect(CONFIG_CALIDAD.exposicion("fragancia", "protector_solar")).toBe(
      CONFIG_CALIDAD.exposicion("fragancia", "serum_activo"),
    );
  });

  it("calidadDe explica el número que ordena", () => {
    const c = calidadDe(por(CE_FERULIC));
    expect(c.mejorNivel).toBe("A");
    expect(c.contados.map((x) => x.activo.id)).toContain("vit_c_laa");
    expect(c.puntaje).toBeCloseTo(por(CE_FERULIC).calidad_formula!);
  });
});

// El caso que fijó la forma del descuento. Con un descuento suave el Garnier
// —seis familias apiladas más fragancia— quedaba a 0,15 de la fórmula de
// Pinnell, y INGREDIENTES.md §10.1 dice que esa es la única del catálogo que "se
// puede afirmar sin matices". No es un empate técnico: es una distancia que el
// número tiene que mostrar.
describe("el descuento por familia separa apilar de estar bien construido", () => {
  it("la distancia entre el Garnier y la fórmula del paper se ve", () => {
    const garnier = por("MLA18957818").calidad_formula!;
    const paper = por(CE_FERULIC).calidad_formula!;
    expect(paper - garnier).toBeGreaterThan(0.5);
  });
});
