import type { ConfigCalidad } from "@/engine/calidad";
import { calidadFormula } from "../../engine/calidad";
import type { Producto } from "@/engine/recomendacion";
import { catalogoActivos } from "./activos";

// Los pesos con los que el motor de calidad lee este nicho. El algoritmo está en
// `src/engine/calidad.ts`; acá van los números, que son criterio de skincare y
// no de software.

export const CONFIG_CALIDAD: ConfigCalidad = {
  /**
   * El salto grande está entre B y C, no repartido parejo. Es a propósito: es la
   * regla de la casa hecha número. `INGREDIENTES.md` §0 dice que en la landing
   * sólo se afirma lo que está en A o B, y que lo C y D "puede estar en la
   * fórmula y mencionarse como acompañamiento, pero nunca como el motivo para
   * comprar". Una escala lineal (4-3-2-1) diría que un activo C es dos tercios
   * de un B, y eso contradice al documento.
   */
  peso: { A: 4, B: 3, C: 1.5, D: 0.5 },

  /**
   * Lo que `INGREDIENTES.md` §9 llama "lo que no aporta y sí suma costo".
   *
   * La fragancia y los aceites esenciales pesan más que el alcohol porque el
   * costo es distinto: el alcohol reseca —molesta— y la fragancia es la primera
   * causa de dermatitis de contacto alérgica en cosmética.
   *
   * Ninguno alcanza para hundir una fórmula buena, y está bien que así sea: un
   * producto con un activo de nivel A y fragancia (4 − 1,5 = 2,5) sigue arriba de
   * uno impecable cuyo mejor activo es un C (1,5). Lo que la fragancia hace es
   * perder los empates, que es exactamente lo que merece.
   */
  lastre: {
    fragancia: 1.5,
    aceite_esencial_tea_tree: 1.5,
    aceite_esencial_romero: 1.5,
    aceite_esencial_manzanilla: 1.5,
    aceite_esencial_salvia: 1.5,
    aceite_esencial_artemisa: 1.5,
    aceite_esencial_albahaca: 1.5,
    alcanfor: 1.5,
    menta: 1.5,
    alcohol_denat: 1,
  },

  exposicion(activoId, categoria) {
    // Lo que se enjuaga a los treinta segundos casi no llega a la piel. Es el
    // mismo argumento que `INGREDIENTES.md` §4.1 hace sobre el salicílico en un
    // limpiador, aplicado al otro lado del balance.
    if (categoria === "limpiador" || categoria === "limpiador_oleoso") return 0.25;

    // La excepción del alcohol en protector solar, y es una excepción razonada,
    // no una gentileza. §9.1: en un protector el alcohol es lo que da la textura
    // liviana y el secado rápido, y un protector que se usa todos los días
    // protege infinitamente más que uno perfecto que queda en el cajón. La
    // fragancia y los aceites esenciales no tienen ese argumento y no la reciben.
    if (activoId === "alcohol_denat" && categoria === "protector_solar") return 0.25;

    return 1;
  },
};

/**
 * Devuelve el catálogo con el criterio de orden ya calculado.
 *
 * Vive en el nicho porque necesita conocimiento de skincare: el mapa
 * `ml_id → activos`. Antes calculaba también `respaldo_orden`, que graduaba
 * popularidad en Mercado Libre; se retiró porque las ventas no miden la calidad
 * de una fórmula. Se aplica en un solo lugar —donde se arma `productos`— para que
 * no haya forma de que un consumidor se olvide de llamarla y ordene peor sin
 * enterarse.
 *
 * Un producto sin activos mapeados queda en 0, no sin campo: 0 es "no sabemos
 * con qué está hecho", y en un desempate eso tiene que perder contra "sabemos y
 * es bueno" y empatar con otro del que tampoco sabemos nada. Es la misma postura
 * que el resto del proyecto — sin INCI verificado no se afirma nada, pero
 * tampoco se premia el silencio.
 */
export function conCriteriosDeOrden(productos: Producto[]): Producto[] {
  return productos.map((p) => ({
    ...p,
    calidad_formula: calidadDe(p).puntaje,
  }));
}

/** La versión con detalle, para explicar un número en la auditoría o en un test. */
export function calidadDe(p: Producto) {
  const activos = catalogoActivos.porProducto[p.ml_id ?? p.id] ?? [];
  return calidadFormula(activos, catalogoActivos, p.categoria, CONFIG_CALIDAD);
}
