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
  //
  // ESTO CAMBIÓ, Y EL CAMBIO IMPORTA. Hasta que el catálogo tuvo 25 productos
  // activos, los de poca prueba eran todos coreanos, y la lectura era "los
  // coreanos todavía no vendieron acá". Al prender los 30 de la primera tanda
  // aparecieron europeos y nacionales con la misma señal: Anthelios,
  // SkinCeuticals, Vichy, Neutrogena, L'Oréal.
  //
  // O sea que "poca prueba" no mide origen. Pero tampoco mide antigüedad del
  // listado, que fue la segunda lectura equivocada: `respaldoDe` devuelve
  // `poca_prueba` en cuanto falta `rating`, y los 30 de la primera tanda vienen
  // del vault, que no trae ni rating ni opiniones. Hoy la señal mide **si
  // cargamos el dato**. Hasta que se carguen, un Anthelios con miles de
  // opiniones en ML se muestra igual que un coreano con una.
  it("la poca prueba ya no es cosa de un solo origen", () => {
    const flojos = productos
      .filter((p) => p.activo && respaldoDe(p, U) === "poca_prueba")
      .map((p) => p.origen);
    expect(flojos.length).toBeGreaterThan(0);
    // Si volviera a quedar un solo origen, el catálogo cambió de forma y hay
    // que revisar el copy otra vez.
    expect(new Set(flojos).size).toBeGreaterThan(1);
  });
});
