import { describe, expect, it } from "vitest";
import { alternativasDePaso } from "./alternativas";
import type { CatalogoActivos } from "./compatibilidad";
import type { PasoRutina, Producto, Rutina } from "./recomendacion";
import { catalogoActivos } from "../niches/skincare/activos";

// Catálogo de juguete, como en `compatibilidad.test.ts`: estos tests fijan las
// reglas de las alternativas, no el catálogo de hoy.

const clave = (p: PasoRutina) => p.producto.ml_id ?? p.producto.id;

function prod(id: string, categoria: string, extra: Partial<Producto> = {}): Producto {
  return {
    id,
    ml_id: id,
    nombre: id,
    categoria,
    paso: 1,
    momento: "pm",
    tipos_piel: ["normal"],
    preocupaciones: ["textura"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 1,
    link_afiliado: "https://example.test",
    prioridad: 1,
    comodin: false,
    relevado: "2026-09-05",
    activo: true,
    ...extra,
  };
}

const pasoDe = (producto: Producto, fallback: PasoRutina["fallback"] = "match"): PasoRutina => ({
  slot: { categoria: producto.categoria, momento: "pm" },
  producto,
  fallback,
});

const catalogoDe = (porProducto: Record<string, string[]>): CatalogoActivos => ({
  ...catalogoActivos,
  porProducto,
});

const r = { piel: "normal", objetivo: "textura", presupuesto: 3 };

describe("alternativasDePaso", () => {
  it("ofrece otras del mismo paso y nunca la recomendada", () => {
    const h1 = prod("H1", "hidratante");
    const productos = [h1, prod("H2", "hidratante"), prod("H3", "hidratante")];
    const paso = pasoDe(h1);
    const rutina: Rutina = { am: [], pm: [paso] };
    const ids = alternativasDePaso(productos, rutina, paso, r, catalogoDe({}), clave).map((p) => p.id);
    expect(ids).toEqual(["H2", "H3"]);
  });

  it("no pasa del máximo: son alternativas, no otro catálogo", () => {
    const h1 = prod("H1", "hidratante");
    const productos = [h1, ...["H2", "H3", "H4", "H5"].map((id) => prod(id, "hidratante"))];
    const paso = pasoDe(h1);
    const rutina: Rutina = { am: [], pm: [paso] };
    expect(alternativasDePaso(productos, rutina, paso, r, catalogoDe({}), clave)).toHaveLength(2);
  });

  it("van en el orden del motor, que es el que eligió la recomendada", () => {
    const h1 = prod("H1", "hidratante", { prioridad: 9 });
    const productos = [h1, prod("POCA", "hidratante", { prioridad: 1 }), prod("MUCHA", "hidratante", { prioridad: 5 })];
    const paso = pasoDe(h1);
    const rutina: Rutina = { am: [], pm: [paso] };
    const ids = alternativasDePaso(productos, rutina, paso, r, catalogoDe({}), clave).map((p) => p.id);
    expect(ids).toEqual(["MUCHA", "POCA"]);
  });

  it("sólo del mismo escalón: no ofrece una que encaja peor con el objetivo", () => {
    const h1 = prod("H1", "hidratante"); // matchea textura
    const otroObjetivo = prod("ACNE", "hidratante", { preocupaciones: ["acne"] });
    const paso = pasoDe(h1);
    const rutina: Rutina = { am: [], pm: [paso] };
    expect(alternativasDePaso([h1, otroObjetivo], rutina, paso, r, catalogoDe({}), clave)).toEqual([]);
  });

  // El caso que justifica que existan como función y no como una lista cualquiera.
  it("descarta la que suma un choque con el resto de la rutina", () => {
    const serum = prod("SERUM", "serum_activo");
    const h1 = prod("H1", "hidratante");
    const conAcido = prod("CON_ACIDO", "hidratante");
    const limpia = prod("LIMPIA", "hidratante");
    const catalogo = catalogoDe({
      SERUM: ["retinol"],
      H1: ["ceramidas"],
      CON_ACIDO: ["aha_glicolico"], // retinoide y ácido la misma noche: "separar"
      LIMPIA: ["hialuronico"],
    });
    const paso = pasoDe(h1);
    const rutina: Rutina = { am: [], pm: [pasoDe(serum), paso] };
    const ids = alternativasDePaso([serum, h1, conAcido, limpia], rutina, paso, r, catalogo, clave).map(
      (p) => p.id,
    );
    expect(ids).toEqual(["LIMPIA"]);
  });

  it("en piel sensible nunca ofrece una que no es apta", () => {
    const sensible = { piel: "sensible", objetivo: "textura", presupuesto: 3 };
    const h1 = prod("H1", "hidratante", { tipos_piel: ["sensible"] });
    const noApta = prod("NO_APTA", "hidratante", { tipos_piel: ["sensible"], apto_sensible: false });
    const apta = prod("APTA", "hidratante", { tipos_piel: ["sensible"] });
    const paso = pasoDe(h1);
    const rutina: Rutina = { am: [], pm: [paso] };
    const ids = alternativasDePaso([h1, noApta, apta], rutina, paso, sensible, catalogoDe({}), clave).map(
      (p) => p.id,
    );
    expect(ids).toEqual(["APTA"]);
  });

  it("si el paso ya es un parche avisado, no ofrece más de lo mismo", () => {
    const h1 = prod("H1", "hidratante");
    const productos = [h1, prod("H2", "hidratante")];
    for (const fallback of ["no_apto_sensible", "comodin"] as const) {
      const paso = pasoDe(h1, fallback);
      const rutina: Rutina = { am: [], pm: [paso] };
      expect(alternativasDePaso(productos, rutina, paso, r, catalogoDe({}), clave)).toEqual([]);
    }
  });

  // La regla es "no suma", no "no cambia nada". Una candidata puede SACAR un
  // conflicto que la recomendada tenía: pasa en el catálogo real, donde el
  // hidratante recomendado repite la niacinamida del sérum y una alternativa no.
  // La recomendada ganó igual porque en el motor la prioridad pesa más que una
  // "nota" de redundancia; la alternativa es mejor en ese eje y se ofrece.
  it("ofrece la que saca un conflicto que la recomendada tenía", () => {
    const limpiador = prod("LIMP", "limpiador");
    const serum = prod("SERUM", "serum_activo");
    const h1 = prod("H1", "hidratante");
    const sinNiacinamida = prod("SIN_NIACINAMIDA", "hidratante");
    const catalogo = catalogoDe({
      LIMP: ["niacinamida"],
      SERUM: ["niacinamida"],
      H1: ["niacinamida"], // tercera vez en la misma noche: "nota" de redundancia
      SIN_NIACINAMIDA: ["hialuronico"],
    });
    const paso = pasoDe(h1);
    const rutina: Rutina = { am: [], pm: [pasoDe(limpiador), pasoDe(serum), paso] };
    const ids = alternativasDePaso([limpiador, serum, h1, sinNiacinamida], rutina, paso, r, catalogo, clave).map(
      (p) => p.id,
    );
    expect(ids).toEqual(["SIN_NIACINAMIDA"]);
  });
});
