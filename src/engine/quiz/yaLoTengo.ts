import { useCallback, useEffect, useMemo, useState } from "react";

// "Ya tengo uno": la persona marca que ya tiene algo para un paso, y ese paso
// deja de ofrecerle comprar. Es la promesa de la home —"sin comprar dos veces lo
// mismo"— cumplida en la pantalla que vende.
//
// SE GUARDA POR CATEGORÍA, NO POR PRODUCTO, y a propósito: "tengo un limpiador"
// es un dato de la persona, no de esta rutina. Si rehace el quiz y le toca otro
// limpiador, lo sigue teniendo.
//
// SE GUARDA EN EL NAVEGADOR DE QUIEN LO MARCA, y en ningún otro lado. No va a la
// URL: el resultado se comparte, y el que abre el link no tiene el mismo baño.
// Y no va a la base: hoy no hay tabla para esto y el tracking está apagado. El
// día que se quiera medir cuánta gente lo usa, el evento se agrega ahí.
//
// localStorage puede no estar —modo privado, datos del sitio bloqueados—, así
// que todo acceso va con try/catch y la pantalla funciona igual sin él.

/** Lee lo guardado y se queda sólo con lo que tiene forma de lista de categorías. */
export function leerTengo(guardado: string | null): string[] {
  if (!guardado) return [];
  try {
    const valor: unknown = JSON.parse(guardado);
    if (!Array.isArray(valor)) return [];
    const categorias = valor.filter((x): x is string => typeof x === "string" && x.length > 0);
    return [...new Set(categorias)];
  } catch {
    return [];
  }
}

/** Marca o desmarca una categoría, sin duplicar y conservando el orden. */
export function alternarTengo(lista: string[], categoria: string): string[] {
  return lista.includes(categoria) ? lista.filter((c) => c !== categoria) : [...lista, categoria];
}

export function useYaLoTengo(clave: string): [Set<string>, (categoria: string) => void] {
  const [lista, setLista] = useState<string[]>([]);

  // Se lee después de montar y no durante el render: el primer render tiene que
  // coincidir con el del servidor, y el servidor no ve el localStorage.
  useEffect(() => {
    try {
      setLista(leerTengo(window.localStorage.getItem(clave)));
    } catch {
      // sin almacenamiento: se arranca vacío
    }
  }, [clave]);

  // Se escribe al alternar y NO en un efecto que mire `lista`. Ese efecto
  // correría también con la lista vacía del primer render, antes de que el de
  // arriba termine de leer, y pisaría lo guardado con []. En desarrollo React
  // puede llamar dos veces a la función de actualización: escribe dos veces lo
  // mismo, que es inocuo.
  const alternar = useCallback(
    (categoria: string) => {
      setLista((actual) => {
        const siguiente = alternarTengo(actual, categoria);
        try {
          window.localStorage.setItem(clave, JSON.stringify(siguiente));
        } catch {
          // sin almacenamiento: vale para esta visita y nada más
        }
        return siguiente;
      });
    },
    [clave],
  );

  const conjunto = useMemo(() => new Set(lista), [lista]);
  return [conjunto, alternar];
}
