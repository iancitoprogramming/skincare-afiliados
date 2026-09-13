import { analizarRutina, type CatalogoActivos } from "./compatibilidad";
import { cascadaPaso, type PasoRutina, type Producto, type RespuestasRutina, type Rutina } from "./recomendacion";

// Otras opciones para un paso de la rutina, sin romper lo que la rutina resolvió.
//
// La tesis del sitio es "cuál va con cuál". Una alternativa que no se chequea
// contra el resto de la rutina la contradice en la misma pantalla: la persona
// cambia el hidratante por otro que "también sirve" y se lleva un choque que
// la recomendada había esquivado. Por eso cada candidata se prueba de verdad:
// se la pone en el lugar de la recomendada, se corre el mismo análisis de
// compatibilidad que ve la persona, y si suma aunque sea un conflicto, afuera.
//
// DE DÓNDE SALEN. Del mismo escalón de `cascadaPaso` que la recomendada: el
// mismo nivel de match para la piel y el objetivo, y el mismo lado de la banda.
// Nunca de un escalón peor, así que una alternativa no puede encajar peor con lo
// que la persona respondió. Y en el orden de la cascada —prioridad, calidad de
// fórmula, banda, id—, que es el mismo criterio que eligió la recomendada. La
// popularidad no entra, igual que en el resto del motor.
//
// CUÁNDO NO HAY. Si el paso cayó en "no apto para sensible" o en comodín, la
// recomendada ya es un parche avisado; ofrecer más de lo mismo, sin el aviso en
// cada una, sería peor que no ofrecer nada.

export const MAXIMO_ALTERNATIVAS = 2;

type Conflictos = ReturnType<typeof analizarRutina>["conflictos"];

function contar(conflictos: Conflictos) {
  const c = { separar: 0, cuidado: 0, nota: 0 };
  for (const x of conflictos) c[x.severidad]++;
  return c;
}

const mismoPaso = (a: PasoRutina, b: PasoRutina) =>
  a.slot.categoria === b.slot.categoria && a.producto.id === b.producto.id;

export function alternativasDePaso(
  productos: Producto[],
  rutina: Rutina,
  paso: PasoRutina,
  r: RespuestasRutina,
  catalogo: CatalogoActivos,
  clave: (p: PasoRutina) => string,
  maximo = MAXIMO_ALTERNATIVAS,
): Producto[] {
  if (paso.fallback === "no_apto_sensible" || paso.fallback === "comodin") return [];

  let escalones: ReturnType<typeof cascadaPaso>;
  try {
    escalones = cascadaPaso(productos, paso.slot, r);
  } catch {
    // Sin candidatos ni comodín para esta categoría: no hay nada que ofrecer.
    return [];
  }

  const escalon = escalones.find((g) => g.productos.some((p) => p.id === paso.producto.id));
  if (!escalon) return [];

  const base = contar(analizarRutina(rutina, catalogo, clave).conflictos);
  const alternativas: Producto[] = [];

  for (const candidata of escalon.productos) {
    if (alternativas.length >= maximo) break;
    if (candidata.id === paso.producto.id) continue;

    // Un paso de "mañana y noche" está en las dos listas: se reemplaza en las
    // dos, porque la persona no va a usar un limpiador a la mañana y otro a la
    // noche por haber elegido una alternativa.
    const reemplazo: PasoRutina = { ...paso, producto: candidata };
    const cambiar = (lista: PasoRutina[]) => lista.map((x) => (mismoPaso(x, paso) ? reemplazo : x));
    const con = contar(
      analizarRutina({ am: cambiar(rutina.am), pm: cambiar(rutina.pm) }, catalogo, clave).conflictos,
    );

    if (con.separar <= base.separar && con.cuidado <= base.cuidado && con.nota <= base.nota) {
      alternativas.push(candidata);
    }
  }

  return alternativas;
}
