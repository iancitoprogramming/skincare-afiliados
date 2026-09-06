import { describe, it, expect } from "vitest";
import { armarRutina, elegirPaso, type Rutina } from "./recomendacion";
import { productos } from "../niches/skincare/productos";
import { TIERS, tierEfectivo, skincareQuiz, CATEGORIAS_OPCIONALES } from "../niches/skincare/config";

const valores = (urlKey: string) =>
  skincareQuiz.questions.find((q) => q.urlKey === urlKey)!.options.map((o) => o.value);

const pieles = valores("p");
const objetivos = valores("o");
const presupuestos = valores("b").map(Number);
const tiers = valores("n");

// Tiers que el catálogo puede servir hoy. Los demás tienen categorías sin un solo
// producto (limpiador oleoso, tónico, ampolla, contorno, retinoide) y el motor
// levanta excepción a propósito: es un hueco de catálogo, no un bug.
const CATEGORIAS_CON_STOCK = new Set(productos.filter((p) => p.activo).map((p) => p.categoria));
const tiersServibles = tiers.filter((t) =>
  TIERS[t as keyof typeof TIERS].every((s) => CATEGORIAS_CON_STOCK.has(s.categoria)),
);

// Recorre la grilla completa del quiz aplicando el techo por tipo de piel, igual
// que producción.
function cadaCombo(fn: (r: { piel: string; objetivo: string; presupuesto: number }, rutina: Rutina) => void) {
  for (const tier of tiersServibles) {
    for (const piel of pieles) {
      for (const objetivo of objetivos) {
        for (const presupuesto of presupuestos) {
          const slots = TIERS[tierEfectivo(tier, piel)];
          fn({ piel, objetivo, presupuesto }, armarRutina(productos, slots, { piel, objetivo, presupuesto }));
        }
      }
    }
  }
}

describe("armarRutina", () => {
  it("nunca deja un paso vacío en ninguna combinación", () => {
    let combos = 0;
    cadaCombo((_r, rutina) => {
      combos++;
      expect(rutina.am.length).toBeGreaterThan(0);
      expect(rutina.pm.length).toBeGreaterThan(0);
      for (const p of [...rutina.am, ...rutina.pm]) {
        expect(p.producto).toBeDefined();
        expect(p.producto.link_afiliado.length).toBeGreaterThan(0);
        expect(p.producto.activo).toBe(true);
      }
    });
    // 5 pieles × 4 objetivos × 3 presupuestos × los tiers servibles
    expect(combos).toBe(60 * tiersServibles.length);
  });

  it("el protector solar va siempre a la mañana, nunca a la noche", () => {
    cadaCombo((_r, rutina) => {
      expect(rutina.am.some((p) => p.slot.categoria === "protector_solar")).toBe(true);
      expect(rutina.pm.some((p) => p.slot.categoria === "protector_solar")).toBe(false);
    });
  });

  it("el limpiador oleoso va sólo de noche (segunda mitad de la doble limpieza)", () => {
    cadaCombo((_r, rutina) => {
      expect(rutina.am.some((p) => p.slot.categoria === "limpiador_oleoso")).toBe(false);
    });
  });

  it("respeta el presupuesto salvo cuando cae al comodín", () => {
    cadaCombo((r, rutina) => {
      for (const p of [...rutina.am, ...rutina.pm]) {
        if (p.fallback !== "comodin") {
          expect(p.producto.rango_precio).toBeLessThanOrEqual(r.presupuesto);
        }
      }
    });
  });
});

describe("piel sensible", () => {
  it("topea en Tier 3: nunca recibe ampolla, contorno ni retinoide", () => {
    const prohibidas = ["serum_secundario", "contorno", "retinoide"];
    for (const tier of tiers) {
      const slots = TIERS[tierEfectivo(tier, "sensible")];
      for (const slot of slots) {
        expect(prohibidas).not.toContain(slot.categoria);
      }
    }
  });

  it("si entrega algo no apto, lo marca — nunca lo pasa por apto", () => {
    for (const objetivo of objetivos) {
      for (const presupuesto of presupuestos) {
        const slots = TIERS[tierEfectivo("1", "sensible")];
        const rutina = armarRutina(productos, slots, { piel: "sensible", objetivo, presupuesto });
        for (const p of [...rutina.am, ...rutina.pm]) {
          if (!p.producto.apto_sensible) {
            expect(["no_apto_sensible", "comodin"]).toContain(p.fallback);
          }
        }
      }
    }
  });
});

describe("origen", () => {
  it("respeta la preferencia cuando hay stock de ese origen", () => {
    const r = { piel: "grasa", objetivo: "acne", presupuesto: 3, origenes: ["europeo"] };
    const paso = elegirPaso(productos, { categoria: "limpiador", momento: "ambos" }, r);
    expect(paso.producto.origen).toBe("europeo");
    expect(paso.fallback).not.toBe("otro_origen");
  });

  it("marca otro_origen cuando cae fuera de la preferencia", () => {
    // Antes este test fijaba a mano un hueco concreto (no había protector solar
    // nacional) y traía su propio aviso de "si aparece uno, actualizá el test".
    // Apareció: el Dermaglós FPS 30 pasó de hidratante a protector solar. Así
    // que ahora el hueco se busca solo — el test prueba la REGLA, no un dato
    // del catálogo que cambia cada vez que se carga un producto.
    const slots = Object.values(TIERS).flat();
    const origenes = ["coreano", "europeo", "nacional"];
    const hueco = slots
      .flatMap((s) => origenes.map((origen) => ({ slot: s, origen })))
      .find(
        ({ slot, origen }) =>
          !productos.some((p) => p.activo && p.categoria === slot.categoria && p.origen === origen),
      );
    expect(hueco, "no quedan huecos de origen: el catálogo cubre todo, borrá este test").toBeDefined();

    const r = { piel: "grasa", objetivo: "acne", presupuesto: 3, origenes: [hueco!.origen] };
    const paso = elegirPaso(productos, hueco!.slot, r);
    expect(paso.producto.origen).not.toBe(hueco!.origen);
    expect(["otro_origen", "comodin"]).toContain(paso.fallback);
  });
});

describe("rama coreana / occidental", () => {
  const rama = skincareQuiz.recomendacion.rama!;
  const slotsDe = (tier: string, respuesta: string) =>
    TIERS[tier as keyof typeof TIERS].filter(
      (s) => !(rama.quitarCategorias?.[respuesta] ?? []).includes(s.categoria),
    );

  // Antes acá había dos tests que fijaban que la rama coreana sumaba el tónico y
  // la occidental lo sacaba. Quedaron obsoletos por una decisión de producto: un
  // tónico nunca es un paso necesario, así que no ocupa un slot en ningún tier.
  // Estos dos los reemplazan, y son más fuertes: en vez de fijar dónde va el
  // tónico, fijan que NO va a ninguna parte.

  it("ningún tier incluye tónico ni exfoliante: son pasos opcionales, no esenciales", () => {
    for (const tier of Object.keys(TIERS) as (keyof typeof TIERS)[]) {
      const categorias = TIERS[tier].map((s) => s.categoria);
      expect(categorias).not.toContain("tonico");
      expect(categorias).not.toContain("exfoliante");
    }
  });

  it("la rama de origen ya no agrega ni saca pasos: sólo cambia la procedencia", () => {
    // Si alguna vez vuelve a sacar categorías, que sea una decisión explícita y
    // no un resto de la mecánica vieja del tónico.
    expect(rama.quitarCategorias ?? {}).toEqual({});
    for (const tier of tiersServibles) {
      expect(slotsDe(tier, "si").map((s) => s.categoria)).toEqual(
        slotsDe(tier, "no").map((s) => s.categoria),
      );
    }
  });

  it("pidiendo coreanos, cada paso es coreano salvo que no haya stock", () => {
    for (const tier of tiersServibles) {
      const rutina = armarRutina(productos, slotsDe(tier, "si"), {
        piel: "mixta",
        objetivo: "textura",
        presupuesto: 3,
        origenes: rama.origenes["si"],
      });
      for (const p of [...rutina.am, ...rutina.pm]) {
        // Si no es coreano, el motor tiene que haberlo marcado. Nunca en silencio.
        if (p.producto.origen !== "coreano") {
          expect(["otro_origen", "comodin", "no_apto_sensible"]).toContain(p.fallback);
        }
      }
    }
  });

  it("pidiendo NO coreanos, ningún paso coreano pasa sin marcar", () => {
    for (const tier of tiersServibles) {
      const rutina = armarRutina(productos, slotsDe(tier, "no"), {
        piel: "mixta",
        objetivo: "textura",
        presupuesto: 3,
        origenes: rama.origenes["no"],
      });
      for (const p of [...rutina.am, ...rutina.pm]) {
        if (p.producto.origen === "coreano") {
          expect(["otro_origen", "comodin", "no_apto_sensible"]).toContain(p.fallback);
        }
      }
    }
  });

  it("cada respuesta de la rama tiene su explicación", () => {
    const valores = skincareQuiz.questions.find((q) => q.urlKey === rama.key)!.options.map((o) => o.value);
    for (const v of valores) {
      expect(rama.origenes[v], `falta origenes["${v}"]`).toBeDefined();
      expect(rama.nota?.[v], `falta nota["${v}"]`).toBeTruthy();
    }
  });
});

describe("catálogo", () => {
  it("todos los escalones definidos son servibles", () => {
    // Ofrecer un escalón que el catálogo no puede llenar es una pantalla de
    // error después del quiz. Se compara contra TIERS y no contra una lista
    // fija: los escalones cambian por decisión de producto, y el test tiene que
    // seguir valiendo cuando eso pasa.
    expect(tiersServibles).toEqual(Object.keys(TIERS));
  });

  it("la base es exactamente limpiador, hidratante y protector solar", () => {
    // Es el único conjunto no negociable. Si alguien agrega un paso acá, que
    // sea rompiendo un test y no de casualidad.
    expect(TIERS["1"].map((s) => s.categoria).sort()).toEqual([
      "hidratante",
      "limpiador",
      "protector_solar",
    ]);
  });

  it("cada escalón contiene íntegramente al anterior", () => {
    // Un escalón que saca un paso del anterior no es "más completo": es otra
    // rutina. Si eso hace falta alguna vez, que sea una decisión explícita.
    const claves = Object.keys(TIERS) as (keyof typeof TIERS)[];
    const cats = (t: keyof typeof TIERS) => TIERS[t].map((s) => s.categoria);
    for (let i = 1; i < claves.length; i++) {
      for (const c of cats(claves[i - 1])) {
        expect(cats(claves[i]), `T${claves[i]} perdió "${c}"`).toContain(c);
      }
    }
  });

  it("el sérum va después del limpiador y antes del hidratante", () => {
    // El orden del array ES el orden de aplicación que ve la persona.
    for (const t of Object.keys(TIERS) as (keyof typeof TIERS)[]) {
      const cats = TIERS[t].map((s) => s.categoria);
      const serum = cats.indexOf("serum_activo");
      if (serum === -1) continue;
      expect(serum, "el sérum va después del limpiador").toBeGreaterThan(cats.indexOf("limpiador"));
      expect(serum, "el sérum va antes del hidratante").toBeLessThan(cats.indexOf("hidratante"));
    }
  });

  it("ningún producto queda inalcanzable por incompatibilidad de momento", () => {
    // Hay dos motivos por los que un producto puede no mostrarse nunca, y no
    // son lo mismo:
    //
    //   · pierde el desempate — otro producto de la misma categoría le gana por
    //     prioridad o precio. Es competencia, no un bug. Lo reporta
    //     `npm run auditar` para que se decida como curaduría de catálogo.
    //
    //   · incompatibilidad de momento — el producto es "am" y el slot pide
    //     "ambos", así que `momentoCompatible` lo descarta SIEMPRE, para
    //     cualquier respuesta. Nadie lo va a ver jamás. Eso sí es un bug de
    //     datos, y es el que fija este test.
    //
    // El caso que lo motivó: el sérum de Garnier, el más vendido del catálogo
    // con 66.616 opiniones, tenía momento:"am" contra un slot "ambos" y su link
    // de afiliado no se le mostraba a nadie.
    const slots = Object.values(TIERS).flat();
    const rotos = productos
      .filter((p) => p.activo)
      .filter((p) => {
        const suyos = slots.filter((s) => s.categoria === p.categoria);
        if (!suyos.length) return false; // categoría opcional: vive en /catalogo
        return !suyos.some((s) => (s.momento === "ambos" ? p.momento === "ambos" : true));
      })
      .map((p) => `${p.marca} ${p.nombre} — categoría ${p.categoria}, momento "${p.momento}"`);
    expect(rotos).toEqual([]);
  });

  it("ninguna categoría opcional aparece como paso de una rutina", () => {
    const enTiers = new Set(Object.values(TIERS).flat().map((s) => s.categoria));
    for (const c of CATEGORIAS_OPCIONALES) expect(enTiers.has(c)).toBe(false);
  });

  it("tiene comodín en cada categoría de los tiers servibles", () => {
    const categorias = new Set(
      tiersServibles.flatMap((t) => TIERS[t as keyof typeof TIERS]).map((s) => s.categoria),
    );
    for (const c of categorias) {
      const tiene = productos.some((p) => p.activo && p.comodin && p.categoria === c);
      expect(tiene, `falta comodín en "${c}"`).toBe(true);
    }
  });
});
