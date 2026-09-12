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
// El 12/9/2026 había tres productos activos marcados `apto_sensible: true`
// declarando un aceite esencial en su mapa de activos. Dos se corrigieron —el
// COSRX Low pH Good Morning y el Skin1004 Tea-trica B5, los dos con
// `Melaleuca Alternifolia (Tea Tree) Leaf Oil` verificado en el INCI—. El mapeo
// de activos del COSRX ya decía por escrito que el tea tree "lo saca de las
// rutinas de piel sensible", pero el dato del catálogo nunca se cambió: la prosa
// y el dato decían cosas opuestas y ganaba el dato. Este test es para que no se
// pueda volver a escribir una cosa y cargar la otra.
//
// SOBRE EL VETO
//
// No es una regla nueva: el diccionario ya clasifica a los tres aceites
// esenciales que modela —tea tree, romero y menta— con `grupos:
// ["irritante-potencial"]` y carga propia, y su campo `evidencia` dice que son
// causa conocida de dermatitis de contacto. El respaldo externo es de Groot &
// Schmidt, "Tea tree oil: contact allergy and chemical composition", *Contact
// Dermatitis* 2016: el tea tree es el aceite esencial con más reacciones
// alérgicas publicadas, con 0,1% a 3,5% de parches positivos en testeo de
// rutina, y los sensibilizantes son los productos de oxidación de sus
// monoterpenos.
//
// La `fragancia` NO está vetada acá a propósito. Hay dos productos activos que la
// declaran estando marcados apto_sensible, y decidir si eso los veta es una
// decisión de criterio de producto, no de carga de datos. Queda planteada en
// docs/AUDITORIA-PRODUCTOS.md, sin que este test la resuelva por su cuenta.

import { describe, expect, it } from "vitest";
import { productos } from "./productos";
import { ACTIVOS, ACTIVOS_POR_PRODUCTO } from "./activos";

/**
 * Productos que declaran un activo de familia "aceite-esencial" y SIGUEN siendo
 * aptos para piel sensible, cada uno con el motivo escrito.
 *
 * Es la misma forma que `SIN_NIVEL_DE_EVIDENCIA` en `activos.ts`: la excepción se
 * permite, pero hay que fundarla, y el test de abajo exige que el motivo sea una
 * oración de verdad. Una excepción sin motivo es el agujero que este archivo
 * viene a tapar.
 */
const CON_ACEITE_ESENCIAL_Y_APTO: Record<string, string> = {
  MLAU3481553718:
    "TIRTIR Milk Skin Toner. El INCI trae `Mentha Piperita (Peppermint) Leaf Extract` " +
    "—extracto de hoja, en la cola de una lista de 35 ingredientes— y no aceite esencial " +
    "de menta ni mentol. El mapeo lo apunta a `menta`, cuyo id es 'Menta / mentol', y esa " +
    "equivalencia es más fuerte que lo que dice el envase. Antes de vetar el producto hay " +
    "que decidir si el extracto y el aceite son el mismo activo; ver docs/AUDITORIA-PRODUCTOS.md.",
};

// `ml_id` es opcional en `Producto`, y sin él no hay con qué buscar en el mapa de
// activos. Los que no lo tienen quedan fuera de este test en vez de colarse como
// "sin aceites": no se sabe, y no saber no es un permiso. Hoy no hay ninguno; si
// aparece uno, el último test de este archivo lo deja a la vista.
const activos = productos.filter((p) => p.activo && p.ml_id);
const familiaDe = (id: string) => ACTIVOS[id]?.familia;
const aceitesDe = (mlId: string) =>
  (ACTIVOS_POR_PRODUCTO[mlId] ?? []).filter((a) => familiaDe(a) === "aceite-esencial");

describe("apto_sensible contra el mapa de activos", () => {
  it("ningún producto apto para sensible declara un aceite esencial sin excepción escrita", () => {
    const malos = activos
      .filter((p) => p.apto_sensible && aceitesDe(p.ml_id!).length)
      .filter((p) => !CON_ACEITE_ESENCIAL_Y_APTO[p.ml_id!])
      .map((p) => `${p.ml_id} ${p.nombre} → ${aceitesDe(p.ml_id!).join(", ")}`);
    expect(malos).toEqual([]);
  });

  it("cada excepción dice por qué, en una oración de verdad", () => {
    const flojas = Object.entries(CON_ACEITE_ESENCIAL_Y_APTO)
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
    const sobrantes = Object.keys(CON_ACEITE_ESENCIAL_Y_APTO).filter((mlId) => {
      const p = activos.find((x) => x.ml_id === mlId);
      return !p || !p.apto_sensible || !aceitesDe(mlId).length;
    });
    expect(sobrantes).toEqual([]);
  });

  // Los dos que se corrigieron el 12/9/2026, clavados por ml_id. Si alguien los
  // vuelve a marcar apto, el test de arriba ya falla; este dice cuáles eran.
  it("los dos que se corrigieron siguen corregidos", () => {
    for (const mlId of ["MLA11139349", "MLA37722163"]) {
      const p = activos.find((x) => x.ml_id === mlId);
      expect(p, `${mlId} salió del catálogo activo`).toBeDefined();
      expect(p!.apto_sensible, `${mlId} (${p!.nombre}) volvió a apto_sensible`).toBe(false);
    }
  });
});
