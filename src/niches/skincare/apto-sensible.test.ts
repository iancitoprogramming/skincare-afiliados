// `apto_sensible` no puede contradecir al mapa de activos.
//
// POR QUÉ EXISTE
//
// El flag `apto_sensible` es lo único que el motor mira para decidir si un
// producto se le puede servir a alguien que declaró piel sensible: en
// `elegirPaso`, `aptos = enCategoria.filter((p) => p.apto_sensible)`. Y la ficha
// de producto lo imprime como "piel sensible: apto". O sea que un `true` mal
// cargado no es un dato flojo: es una afirmación que la persona lee y una puerta
// que el motor abre.
//
// El 12/9/2026 había cuatro productos activos marcados `apto_sensible: true`
// declarando un irritante potencial de los que este diccionario sí modela. Los
// cuatro se corrigieron. En dos de ellos —el COSRX Low pH y el Cleanex Free Gel—
// la prosa del propio mapeo o del propio `por_que` ya decía lo contrario que el
// dato, y el que lee el motor es el dato. Este test es para que no se pueda
// volver a escribir una cosa y cargar la otra.
//
// LAS DOS FAMILIAS QUE VETAN, Y POR QUÉ ESAS
//
// No son reglas nuevas: las dos salen de lo que el diccionario ya dice de cada
// familia, y en las dos el catálogo ya las seguía en la mayoría de los casos.
//
//   aceite-esencial — Los tres que se modelan (tea tree, romero, menta) llevan
//     `grupos: ["irritante-potencial"]` y carga propia, y su campo `evidencia`
//     dice que son causa conocida de dermatitis de contacto. De Groot & Schmidt,
//     *Contact Dermatitis* 2016: el tea tree es el aceite esencial con más
//     reacciones alérgicas publicadas, 0,1% a 3,5% de parches positivos en
//     testeo de rutina, y los sensibilizantes son los productos de oxidación de
//     sus monoterpenos.
//
//   fragancia — El diccionario ya la define como "primera causa de dermatitis de
//     contacto alérgica en cosmética. Para piel que reacciona, es lo primero que
//     conviene sacar". En el panel del North American Contact Dermatitis Group
//     2019-2020, la mezcla de fragancias I dio 12,8% de parches positivos y los
//     hidroperóxidos de linalol 11,1%. Y de los 8 productos del motor que
//     declaran fragancia, 6 ya estaban cargados como no aptos: los 2 que faltaban
//     eran la excepción, no otra política.
//
// LO QUE ESTE TEST NO DECIDE
//
// Que un producto declare una de esas dos familias es lo que se mira; que el
// mapeo APUNTE BIEN es otra cosa y no se puede verificar desde acá. El caso que
// lo enseñó es el TIRTIR Milk Skin Toner, que declaraba `menta` por un
// `Mentha Piperita Leaf Extract` —extracto de hoja, no el aceite esencial ni el
// mentol—. La regla que el resto del mapa ya seguía es que un id de aceite
// esencial es para un ACEITE que el INCI nombre; está escrita en `activos.ts`
// sobre esa entrada.

import { describe, expect, it } from "vitest";
import { productos } from "./productos";
import { ACTIVOS, ACTIVOS_POR_PRODUCTO } from "./activos";

/** Familias de activo que vetan `apto_sensible`. Ver la nota de arriba. */
const FAMILIAS_QUE_VETAN = ["aceite-esencial", "fragancia"];

/**
 * Productos que declaran una familia que veta y SIGUEN marcados aptos para piel
 * sensible, cada uno con el motivo escrito.
 *
 * Está vacía y la idea es que siga así. Existe igual, y con la misma forma que
 * `SIN_NIVEL_DE_EVIDENCIA` en `activos.ts`, porque una excepción puede llegar a
 * tener sentido y entonces hay que fundarla: el test de abajo exige que el
 * motivo sea una oración de verdad. Una excepción sin motivo es el agujero que
 * este archivo viene a tapar.
 */
const VETADO_PERO_APTO: Record<string, string> = {};

// `ml_id` es opcional en `Producto`, y sin él no hay con qué buscar en el mapa de
// activos. Los que no lo tienen quedan fuera de este test en vez de colarse como
// "sin irritantes": no se sabe, y no saber no es un permiso. Hoy no hay ninguno;
// si aparece uno, el test de `ml_id` de más abajo lo deja a la vista.
const activos = productos.filter((p) => p.activo && p.ml_id);
const familiaDe = (id: string) => ACTIVOS[id]?.familia;
const vetantesDe = (mlId: string) =>
  (ACTIVOS_POR_PRODUCTO[mlId] ?? []).filter((a) => FAMILIAS_QUE_VETAN.includes(familiaDe(a) ?? ""));

describe("apto_sensible contra el mapa de activos", () => {
  it("ningún producto apto para sensible declara fragancia ni aceite esencial sin excepción escrita", () => {
    const malos = activos
      .filter((p) => p.apto_sensible && vetantesDe(p.ml_id!).length)
      .filter((p) => !VETADO_PERO_APTO[p.ml_id!])
      .map((p) => `${p.ml_id} ${p.nombre} → ${vetantesDe(p.ml_id!).join(", ")}`);
    expect(malos).toEqual([]);
  });

  it("cada excepción dice por qué, en una oración de verdad", () => {
    const flojas = Object.entries(VETADO_PERO_APTO)
      .filter(([, motivo]) => motivo.trim().length < 60)
      .map(([id]) => id);
    expect(flojas).toEqual([]);
  });

  // Todo producto activo tiene que tener `ml_id`, porque es la clave con la que se
  // lo busca en el mapa de activos. Sin esto, un producto sin `ml_id` saldría del
  // conjunto que mira el primer test y el archivo entero lo dejaría pasar.
  it("todo producto activo tiene ml_id, que es con lo que se lo mira", () => {
    const sinId = productos.filter((p) => p.activo && !p.ml_id).map((p) => p.nombre);
    expect(sinId).toEqual([]);
  });

  // Sin esto la lista se podría llenar de excepciones que ya no aplican, y la
  // próxima persona no tendría cómo saber cuáles siguen vivas.
  it("la lista de excepciones no nombra productos que ya no la necesitan", () => {
    const sobrantes = Object.keys(VETADO_PERO_APTO).filter((mlId) => {
      const p = activos.find((x) => x.ml_id === mlId);
      return !p || !p.apto_sensible || !vetantesDe(mlId).length;
    });
    expect(sobrantes).toEqual([]);
  });

  // Los cuatro que se corrigieron el 12/9/2026, clavados por ml_id. Si alguno
  // vuelve a apto, el primer test ya falla; éste dice cuáles eran y por qué.
  it("los cuatro que se corrigieron siguen corregidos", () => {
    const corregidos: Record<string, string> = {
      MLA11139349: "COSRX Low pH Good Morning · aceite de tea tree + BHA",
      MLA37722163: "Skin1004 Tea-trica B5 · aceite de tea tree + mandélico",
      MLA27603374: "Cleanex Free Gel · fragancia en la posición 10, y es su único activo",
      MLA19474747: "Lidherma Hyaluronic 4D · fragancia + 5 alérgenos de declaración obligatoria",
    };
    for (const [mlId, quien] of Object.entries(corregidos)) {
      const p = activos.find((x) => x.ml_id === mlId);
      expect(p, `${mlId} (${quien}) salió del catálogo activo`).toBeDefined();
      expect(p!.apto_sensible, `${mlId} (${quien}) volvió a apto_sensible`).toBe(false);
    }
  });

  // El TIRTIR queda clavado del otro lado: se decidió que un extracto de hoja NO
  // es el aceite esencial, así que su mapeo no debe volver a declarar `menta` sin
  // que alguien lo decida de nuevo. Si el criterio cambia, se cambia este test.
  it("el TIRTIR sigue sin declarar aceite esencial por un extracto de hoja", () => {
    const tirtir = activos.find((p) => p.ml_id === "MLAU3481553718");
    expect(tirtir, "el TIRTIR salió del catálogo activo").toBeDefined();
    expect(vetantesDe("MLAU3481553718")).toEqual([]);
    expect(tirtir!.apto_sensible).toBe(true);
  });
});
