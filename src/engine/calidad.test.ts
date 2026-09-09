import { describe, expect, it } from "vitest";
import { calidadFormula, type ConfigCalidad } from "./calidad";
import type { Activo, CatalogoActivos } from "./compatibilidad";

// Diccionario mínimo e inventado: lo que se prueba acá es la forma del cálculo,
// no el criterio de skincare. El criterio vive en niches/skincare/calidad.ts y se
// prueba abajo, contra el catálogo real.
const act = (id: string, familia: string, nivel?: "A" | "B" | "C" | "D"): Activo => ({
  id,
  nombre: id,
  familia,
  carga: 0,
  ...(nivel ? { nivelEvidencia: nivel } : {}),
});

const catalogo = {
  activos: Object.fromEntries(
    [
      act("a1", "uno", "A"),
      act("a2", "uno", "A"),
      act("b1", "dos", "B"),
      act("b2", "tres", "B"),
      act("c1", "cuatro", "C"),
      act("d1", "cinco", "D"),
      act("perfume", "fragancia"),
    ].map((a) => [a.id, a]),
  ),
  reglas: [],
  acumulacion: [],
  sinergias: [],
  mitos: [],
  porProducto: {},
} as CatalogoActivos;

const cfg: ConfigCalidad = {
  peso: { A: 4, B: 3, C: 1.5, D: 0.5 },
  lastre: { perfume: 1.5 },
  exposicion: (_id, categoria) => (categoria === "limpiador" ? 0.25 : 1),
};

const puntaje = (ids: string[], categoria = "serum_activo") =>
  calidadFormula(ids, catalogo, categoria, cfg).puntaje;

describe("calidadFormula", () => {
  it("una fórmula sin activos declarados vale cero, no undefined", () => {
    const c = calidadFormula([], catalogo, "hidratante", cfg);
    expect(c.puntaje).toBe(0);
    expect(c.mejorNivel).toBeUndefined();
  });

  // La regla anti-relleno. Sin esto gana el producto con más ingredientes, que es
  // justo lo que INGREDIENTES.md §10.3 trata como trampa y no como virtud.
  it("dos activos de la misma familia cuentan una vez", () => {
    expect(puntaje(["a1", "a2"])).toBe(puntaje(["a1"]));
  });

  it("de una misma familia cuenta el mejor, no el primero", () => {
    const conPeor = { ...catalogo, activos: { ...catalogo.activos, a2: act("a2", "uno", "D") } };
    expect(calidadFormula(["a2", "a1"], conPeor, "serum_activo", cfg).mejorNivel).toBe("A");
  });

  it("cada familia siguiente aporta la mitad que la anterior", () => {
    const uno = puntaje(["a1"]);
    const dos = puntaje(["a1", "b1"]);
    const tres = puntaje(["a1", "b1", "b2"]);
    expect(dos - uno).toBeCloseTo(3 / 2);
    expect(tres - dos).toBeCloseTo(3 / 4);
  });

  // La tesis del proyecto, hecha número: una fórmula no mejora sumando renglones.
  it("apilar familias flojas nunca alcanza a un solo activo de nivel A", () => {
    const muchos = {
      ...catalogo,
      activos: {
        ...catalogo.activos,
        c2: act("c2", "seis", "C"),
        c3: act("c3", "siete", "C"),
        c4: act("c4", "ocho", "C"),
        c5: act("c5", "nueve", "C"),
      },
    };
    const apilado = calidadFormula(["c1", "c2", "c3", "c4", "c5"], muchos, "serum_activo", cfg);
    expect(apilado.puntaje).toBeLessThan(puntaje(["a1"]));
  });

  it("un activo A vale más que dos C, que es lo que dice la regla de la casa", () => {
    const dosC = { ...catalogo, activos: { ...catalogo.activos, c2: act("c2", "seis", "C") } };
    expect(puntaje(["a1"])).toBeGreaterThan(
      calidadFormula(["c1", "c2"], dosC, "serum_activo", cfg).puntaje,
    );
  });

  it("el lastre resta, pero no hunde una fórmula bien respaldada", () => {
    expect(puntaje(["a1", "perfume"])).toBeCloseTo(4 - 1.5);
    // 2,5 sigue arriba de una fórmula impecable cuyo mejor activo es un C.
    expect(puntaje(["a1", "perfume"])).toBeGreaterThan(puntaje(["c1"]));
  });

  it("en algo que se enjuaga el lastre cuesta menos", () => {
    expect(puntaje(["a1", "perfume"], "limpiador")).toBeCloseTo(4 - 1.5 * 0.25);
  });

  it("un activo que no está en el diccionario se ignora en vez de romper", () => {
    expect(puntaje(["a1", "no_existe"])).toBe(puntaje(["a1"]));
  });
});
