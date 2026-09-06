import { describe, it, expect } from "vitest";
import { analizarRutina, type CatalogoActivos } from "./compatibilidad";
import type { PasoRutina, Producto, Rutina } from "./recomendacion";
import { armarRutina } from "./recomendacion";
import { productos } from "../niches/skincare/productos";
import { catalogoActivos, ACTIVOS, ACTIVOS_POR_PRODUCTO } from "../niches/skincare/activos";
import { planSemanal } from "../niches/skincare/calendario";
import { TIERS, tierEfectivo, skincareQuiz } from "../niches/skincare/config";

const clave = (p: PasoRutina) => p.producto.ml_id ?? p.producto.id;

// ── Fixtures mínimos ────────────────────────────────────────────────────────
// Se testea el motor con un catálogo de juguete y no con el real: si mañana
// cambia el catálogo, estos tests tienen que seguir diciendo lo mismo sobre las
// REGLAS. Los tests contra el catálogo real están más abajo y son otra cosa.

function prod(id: string, categoria: string, momento: Producto["momento"]): Producto {
  return {
    id,
    ml_id: id,
    nombre: id,
    categoria,
    paso: 1,
    momento,
    tipos_piel: ["normal"],
    preocupaciones: ["textura"],
    origen: "europeo",
    apto_sensible: true,
    rango_precio: 1,
    link_afiliado: "https://example.test",
    prioridad: 1,
    comodin: true,
    relevado: "2026-09-05",
    activo: true,
  };
}

function rutinaDe(pares: { producto: Producto; momento: "am" | "pm" | "ambos" }[]): Rutina {
  const pasos = pares.map(({ producto, momento }) => ({
    slot: { categoria: producto.categoria, momento },
    producto,
    fallback: "match" as const,
  }));
  return {
    am: pasos.filter((p) => p.slot.momento === "am" || p.slot.momento === "ambos"),
    pm: pasos.filter((p) => p.slot.momento === "pm" || p.slot.momento === "ambos"),
  };
}

function catalogoDe(porProducto: Record<string, string[]>): CatalogoActivos {
  return { ...catalogoActivos, porProducto };
}

// ── Reglas de par ───────────────────────────────────────────────────────────

describe("reglas de degradación", () => {
  it("marca retinoide + peróxido de benzoilo cuando caen en el mismo momento", () => {
    const a = prod("A", "serum_activo", "pm");
    const b = prod("B", "hidratante", "pm");
    const analisis = analizarRutina(
      rutinaDe([
        { producto: a, momento: "pm" },
        { producto: b, momento: "pm" },
      ]),
      catalogoDe({ A: ["retinol"], B: ["peroxido_benzoilo"] }),
      clave,
    );
    const c = analisis.conflictos.find((x) => x.reglaId === "peroxido-x-retinoide");
    expect(c).toBeDefined();
    expect(c!.severidad).toBe("separar");
    expect(c!.clase).toBe("degradacion");
    expect(c!.momentos).toEqual(["pm"]);
  });

  it("NO lo marca si están en momentos distintos: separarlos es justamente la solución", () => {
    const a = prod("A", "serum_activo", "pm");
    const b = prod("B", "serum_activo", "am");
    const analisis = analizarRutina(
      rutinaDe([
        { producto: a, momento: "pm" },
        { producto: b, momento: "am" },
      ]),
      catalogoDe({ A: ["retinol"], B: ["peroxido_benzoilo"] }),
      clave,
    );
    expect(analisis.conflictos.some((x) => x.reglaId === "peroxido-x-retinoide")).toBe(false);
  });

  it("exceptúa al adapaleno, que es el retinoide que aguanta al peróxido", () => {
    const a = prod("A", "serum_activo", "pm");
    const b = prod("B", "hidratante", "pm");
    const analisis = analizarRutina(
      rutinaDe([
        { producto: a, momento: "pm" },
        { producto: b, momento: "pm" },
      ]),
      catalogoDe({ A: ["adapaleno"], B: ["peroxido_benzoilo"] }),
      clave,
    );
    expect(analisis.conflictos.some((x) => x.reglaId === "peroxido-x-retinoide")).toBe(false);
    expect(analisis.sinergias.some((s) => s.sinergiaId === "adapaleno-x-peroxido")).toBe(true);
  });

  it("no marca conflicto cuando los dos activos vienen del MISMO producto", () => {
    // Una fórmula que combina los dos ya resolvió el problema puertas adentro.
    const a = prod("A", "serum_activo", "pm");
    const analisis = analizarRutina(
      rutinaDe([{ producto: a, momento: "pm" }]),
      catalogoDe({ A: ["retinol", "peroxido_benzoilo"] }),
      clave,
    );
    expect(analisis.conflictos.some((x) => x.reglaId === "peroxido-x-retinoide")).toBe(false);
  });
});

describe("reglas de irritación", () => {
  it("separa retinoide de exfoliante ácido en la misma noche", () => {
    const a = prod("A", "serum_activo", "pm");
    const b = prod("B", "exfoliante", "pm");
    const analisis = analizarRutina(
      rutinaDe([
        { producto: a, momento: "pm" },
        { producto: b, momento: "pm" },
      ]),
      catalogoDe({ A: ["retinol"], B: ["aha_glicolico"] }),
      clave,
    );
    const c = analisis.conflictos.find((x) => x.reglaId === "retinoide-x-acidos");
    expect(c?.clase).toBe("irritacion");
  });

  it("PHA no dispara la regla del retinoide: es el reemplazo suave, no el problema", () => {
    const a = prod("A", "serum_activo", "pm");
    const b = prod("B", "exfoliante", "pm");
    const analisis = analizarRutina(
      rutinaDe([
        { producto: a, momento: "pm" },
        { producto: b, momento: "pm" },
      ]),
      catalogoDe({ A: ["retinol"], B: ["pha_gluconolactona"] }),
      clave,
    );
    expect(analisis.conflictos.some((x) => x.reglaId === "retinoide-x-acidos")).toBe(false);
  });
});

describe("momento del día", () => {
  it("avisa si un activo que la luz degrada quedó a la mañana", () => {
    const a = prod("A", "serum_activo", "am");
    const analisis = analizarRutina(
      rutinaDe([{ producto: a, momento: "am" }]),
      catalogoDe({ A: ["retinol"] }),
      clave,
    );
    const c = analisis.conflictos.find((x) => x.reglaId === "momento:retinol");
    expect(c?.severidad).toBe("separar");
  });
});

describe("acumulación", () => {
  it("cuenta productos distintos, no menciones del activo", () => {
    const a = prod("A", "tonico", "ambos");
    const b = prod("B", "hidratante", "ambos");
    const dos = analizarRutina(
      rutinaDe([
        { producto: a, momento: "ambos" },
        { producto: b, momento: "ambos" },
      ]),
      catalogoDe({ A: ["niacinamida"], B: ["niacinamida"] }),
      clave,
    );
    // El umbral de niacinamida es 3: con dos fuentes todavía no se avisa nada.
    expect(dos.conflictos.some((x) => x.reglaId === "pila-niacinamida")).toBe(false);

    const c = prod("C", "protector_solar", "am");
    const tres = analizarRutina(
      rutinaDe([
        { producto: a, momento: "ambos" },
        { producto: b, momento: "ambos" },
        { producto: c, momento: "am" },
      ]),
      catalogoDe({ A: ["niacinamida"], B: ["niacinamida"], C: ["niacinamida"] }),
      clave,
    );
    expect(tres.conflictos.some((x) => x.reglaId === "pila-niacinamida")).toBe(true);
  });

  it("junta AHA, BHA y PHA para contar carga exfoliante", () => {
    const a = prod("A", "limpiador", "ambos");
    const b = prod("B", "hidratante", "ambos");
    const analisis = analizarRutina(
      rutinaDe([
        { producto: a, momento: "ambos" },
        { producto: b, momento: "ambos" },
      ]),
      catalogoDe({ A: ["bha_salicilico"], B: ["aha_mandelico"] }),
      clave,
    );
    expect(analisis.conflictos.some((x) => x.reglaId === "pila-exfoliante")).toBe(true);
  });
});

describe("sinergias y mitos", () => {
  it("detecta niacinamida + vitamina C y desmiente el mito en la misma pasada", () => {
    const a = prod("A", "serum_activo", "ambos");
    const b = prod("B", "hidratante", "ambos");
    const analisis = analizarRutina(
      rutinaDe([
        { producto: a, momento: "ambos" },
        { producto: b, momento: "ambos" },
      ]),
      catalogoDe({ A: ["vit_c_derivado"], B: ["niacinamida"] }),
      clave,
    );
    expect(analisis.sinergias.some((s) => s.sinergiaId === "niacinamida-x-vitamina-c")).toBe(true);
    expect(analisis.mitos.some((m) => m.mitoId === "mito-vitc-niacinamida")).toBe(true);
    // Y sobre todo: no lo reporta como conflicto.
    expect(analisis.conflictos.some((c) => c.productos.includes("A") && c.productos.includes("B"))).toBe(
      false,
    );
  });
});

// ── Contra el catálogo real ─────────────────────────────────────────────────

describe("catálogo real", () => {
  it("no referencia ids de activo que no existan en el diccionario", () => {
    const huerfanos = new Set<string>();
    for (const ids of Object.values(ACTIVOS_POR_PRODUCTO)) {
      for (const id of ids) if (!ACTIVOS[id]) huerfanos.add(id);
    }
    expect([...huerfanos]).toEqual([]);
  });

  it("tiene una entrada en el mapa por cada producto activo del catálogo", () => {
    const faltantes = productos
      .filter((p) => p.activo)
      .filter((p) => !(String(p.ml_id) in ACTIVOS_POR_PRODUCTO))
      .map((p) => `${p.marca} ${p.nombre}`);
    expect(faltantes).toEqual([]);
  });

  it("ninguna rutina posible tiene un conflicto de severidad 'separar'", () => {
    // Hoy es cierto porque el catálogo no tiene retinoides, ni peróxido de
    // benzoilo, ni exfoliante activo. Cuando se compre el retinoide de Tier 4
    // este test va a fallar: eso NO es un bug, es el aviso de que hay que
    // revisar los tiers antes de publicar. Convertirlo entonces en una lista
    // explícita de conflictos esperados.
    const valores = (k: string) =>
      skincareQuiz.questions.find((q) => q.urlKey === k)!.options.map((o) => o.value);
    const conStock = new Set(productos.filter((p) => p.activo).map((p) => p.categoria));
    const tiers = valores("n").filter((t) =>
      TIERS[t as keyof typeof TIERS].every((s) => conStock.has(s.categoria)),
    );

    const encontrados: string[] = [];
    for (const tier of tiers) {
      for (const piel of valores("p")) {
        for (const objetivo of valores("o")) {
          for (const presupuesto of valores("b").map(Number)) {
            const rutina = armarRutina(productos, TIERS[tierEfectivo(tier, piel)], {
              piel,
              objetivo,
              presupuesto,
            });
            for (const c of analizarRutina(rutina, catalogoActivos, clave).conflictos) {
              if (c.severidad === "separar") encontrados.push(`${piel}/${objetivo}/T${tier}: ${c.reglaId}`);
            }
          }
        }
      }
    }
    expect(encontrados).toEqual([]);
  });

  it("no propone calendario semanal cuando no hay activos fuertes que repartir", () => {
    const rutina = armarRutina(productos, TIERS["1"], {
      piel: "normal",
      objetivo: "deshidratacion",
      presupuesto: 3,
    });
    expect(planSemanal(analizarRutina(rutina, catalogoActivos, clave))).toBeNull();
  });
});
