import { describe, expect, it } from "vitest";
import { respaldoDe } from "./respaldo";
import { productos } from "../niches/skincare/productos";
import { UMBRALES_RESPALDO as U } from "../niches/skincare/config";

describe("respaldoDe", () => {
  it("clasifica por cantidad de opiniones", () => {
    expect(respaldoDe({ rating: 4.8, opiniones: 3207 }, U)).toBe("muy_probado");
    expect(respaldoDe({ rating: 4.8, opiniones: 141 }, U)).toBe("probado");
    expect(respaldoDe({ rating: 5, opiniones: 1 }, U)).toBe("poca_prueba");
  });

  it("los bordes caen del lado que corresponde", () => {
    expect(respaldoDe({ rating: 4.5, opiniones: U.muyProbado }, U)).toBe("muy_probado");
    expect(respaldoDe({ rating: 4.5, opiniones: U.muyProbado - 1 }, U)).toBe("probado");
    expect(respaldoDe({ rating: 4.5, opiniones: U.probado }, U)).toBe("probado");
    expect(respaldoDe({ rating: 4.5, opiniones: U.probado - 1 }, U)).toBe("poca_prueba");
  });

  it("sin rating no hay respaldo, por muchas opiniones que figuren", () => {
    expect(respaldoDe({ opiniones: 99999 }, U)).toBe("poca_prueba");
  });

  it("los tres niveles tienen productos: si uno queda vacío el filtro sobra", () => {
    const activos = productos.filter((p) => p.activo);
    const niveles = new Set(activos.map((p) => respaldoDe(p, U)));
    expect([...niveles].sort()).toEqual(["muy_probado", "poca_prueba", "probado"]);
  });

  // Deja constancia del problema que este componente existe para hacer visible.
  // Si algún día deja de ser cierto —porque se cargaron coreanos con volumen o
  // se sumó un occidental nuevo— el test avisa y hay que revisar el copy.
  it("hoy los de poca prueba son todos coreanos", () => {
    const flojos = productos
      .filter((p) => p.activo && respaldoDe(p, U) === "poca_prueba")
      .map((p) => p.origen);
    expect(flojos.length).toBeGreaterThan(0);
    expect([...new Set(flojos)]).toEqual(["coreano"]);
  });
});
