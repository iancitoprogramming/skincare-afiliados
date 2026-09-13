import { describe, expect, it } from "vitest";
import type { PasoRutina, Producto, Rutina, RutinaSlot } from "../recomendacion";
import { anclaDePaso, pasosPorMomento } from "./repetidos";

function paso(categoria: string, momento: RutinaSlot["momento"], id = categoria): PasoRutina {
  return { slot: { categoria, momento }, producto: { id, nombre: id } as Producto, fallback: "match" };
}

// Arma las dos listas igual que el motor: un paso "ambos" es el MISMO objeto en
// mañana y en noche. Si el test las armara con copias, no probaría el caso real.
function rutinaDe(pasos: PasoRutina[]): Rutina {
  return {
    am: pasos.filter((p) => p.slot.momento === "am" || p.slot.momento === "ambos"),
    pm: pasos.filter((p) => p.slot.momento === "pm" || p.slot.momento === "ambos"),
  };
}

describe("pasosPorMomento", () => {
  it("un paso de mañana y noche se muestra entero a la mañana y resumido a la noche", () => {
    const { am, pm } = pasosPorMomento(rutinaDe([paso("limpiador", "ambos")]));
    expect(am.map((m) => m.repetido)).toEqual([false]);
    expect(pm.map((m) => m.repetido)).toEqual([true]);
  });

  it("el caso medido, piel mixta con sérum: 4 enteros a la mañana y 3 resumidos a la noche", () => {
    const { am, pm } = pasosPorMomento(
      rutinaDe([
        paso("limpiador", "ambos"),
        paso("serum_activo", "ambos"),
        paso("hidratante", "ambos"),
        paso("protector_solar", "am"),
      ]),
    );
    expect(am.filter((m) => !m.repetido)).toHaveLength(4);
    expect(pm.map((m) => [m.paso.slot.categoria, m.repetido])).toEqual([
      ["limpiador", true],
      ["serum_activo", true],
      ["hidratante", true],
    ]);
  });

  it("un paso sólo de noche va entero, porque a la mañana no apareció", () => {
    const { pm } = pasosPorMomento(rutinaDe([paso("limpiador", "ambos"), paso("retinoide", "pm")]));
    expect(pm.map((m) => [m.paso.slot.categoria, m.repetido])).toEqual([
      ["limpiador", true],
      ["retinoide", false],
    ]);
  });

  // Hoy no pasa: los tiers no tienen un paso con un producto a la mañana y otro
  // a la noche. Pero si pasara, resumirlo escondería un producto distinto detrás
  // de un "el mismo de la mañana" que sería mentira.
  it("el mismo paso con otro producto a la noche no es una repetición", () => {
    const rutina: Rutina = { am: [paso("hidratante", "am", "LIVIANO")], pm: [paso("hidratante", "pm", "DENSO")] };
    expect(pasosPorMomento(rutina).pm[0].repetido).toBe(false);
  });

  it("numera cada momento desde 1, que es el orden en que se aplica", () => {
    const { am, pm } = pasosPorMomento(
      rutinaDe([paso("limpiador", "ambos"), paso("protector_solar", "am"), paso("hidratante", "ambos")]),
    );
    expect(am.map((m) => m.numero)).toEqual([1, 2, 3]);
    expect(pm.map((m) => m.numero)).toEqual([1, 2]);
  });

  it("el ancla de la tarjeta de la mañana es estable por paso", () => {
    expect(anclaDePaso(paso("limpiador", "ambos"))).toBe("paso-manana-limpiador");
  });
});
