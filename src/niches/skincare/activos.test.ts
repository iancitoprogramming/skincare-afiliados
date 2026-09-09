// El diccionario de activos tiene que estar completo en lo que el motor usa para
// decidir. Estos tests son sobre los datos, no sobre el algoritmo.

import { describe, expect, it } from "vitest";
import { ACTIVOS, ACTIVOS_POR_PRODUCTO, SIN_NIVEL_DE_EVIDENCIA } from "./activos";

describe("nivel de evidencia", () => {
  // El caso que esto evita: alguien agrega un activo nuevo, se olvida del nivel,
  // y el activo pasa a contar como cero sin que nada falle. Un cero silencioso es
  // peor que un error, porque hunde al producto que lo trae y nadie se entera.
  it("todo activo declara nivel, o está en la lista de exentos con su motivo", () => {
    const huerfanos = Object.values(ACTIVOS)
      .filter((a) => !a.nivelEvidencia && !SIN_NIVEL_DE_EVIDENCIA[a.id])
      .map((a) => a.id);
    expect(huerfanos).toEqual([]);
  });

  it("nadie está graduado y exento a la vez", () => {
    const ambos = Object.values(ACTIVOS)
      .filter((a) => a.nivelEvidencia && SIN_NIVEL_DE_EVIDENCIA[a.id])
      .map((a) => a.id);
    expect(ambos).toEqual([]);
  });

  it("la lista de exentos no nombra activos que no existen", () => {
    const fantasmas = Object.keys(SIN_NIVEL_DE_EVIDENCIA).filter((id) => !ACTIVOS[id]);
    expect(fantasmas).toEqual([]);
  });

  it("cada exención dice por qué, en una oración de verdad", () => {
    const flojas = Object.entries(SIN_NIVEL_DE_EVIDENCIA)
      .filter(([, motivo]) => motivo.trim().length < 30)
      .map(([id]) => id);
    expect(flojas).toEqual([]);
  });

  // Los grados salen de docs/INGREDIENTES.md. Se fijan los que sostienen alguna
  // afirmación del sitio o alguna decisión del motor, para que un cambio de
  // criterio tenga que ser deliberado y no un tipeo.
  it("los grados que sostienen afirmaciones son los del documento", () => {
    const esperado: Record<string, string> = {
      retinol: "A", // §1.1
      retinil_ester: "C", // §1.2 — el retinoide escondido en los Mela B3
      bakuchiol: "B", // §1.3
      vit_c_laa: "A", // §2.1
      vit_c_derivado: "B", // §2.2
      tocoferol: "C", // §2.3: "A en combinación, C sola" — se declara la sola
      ferulico: "B", // §2.4
      niacinamida: "A", // §3.1
      melasyl: "B", // §3.2
      tranexamico: "B", // §3.3
      azelaico: "A", // §3.5
      bha_salicilico: "A", // §4.1
      bha_lha: "B", // §4.2
      aha_glicolico: "A", // §4.3
      aha_citrico: "D", // §4.5 — está como ajustador de pH, no como exfoliante
      urea: "A", // §4.7
      ceramidas: "A", // §5.1
      hialuronico: "B", // §5.2
      glicerilo_glucosido: "B", // §5.3
      centella: "B", // §6
      avena: "A", // §6
      agua_termal: "D", // §6
      peptidos_cobre: "C", // §7 — no está al nivel de un retinoide ni de la C
      filtro_uva_400: "B", // §8.2
      oxidos_de_hierro: "B", // §8.3
    };
    const reales = Object.fromEntries(
      Object.keys(esperado).map((id) => [id, ACTIVOS[id]?.nivelEvidencia]),
    );
    expect(reales).toEqual(esperado);
  });
});

describe("mapa de activos por producto", () => {
  it("no nombra ningún activo que no exista en el diccionario", () => {
    const desconocidos = [
      ...new Set(Object.values(ACTIVOS_POR_PRODUCTO).flat().filter((id) => !ACTIVOS[id])),
    ];
    expect(desconocidos).toEqual([]);
  });
});
