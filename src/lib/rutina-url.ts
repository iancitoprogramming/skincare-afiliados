// La URL de la rutina viene del cliente y termina en un mail que firmamos
// nosotros: no se manda tal cual. Se acepta sólo si es de este sitio y de
// /rutina, y se reconstruye desde cero con su query. Cualquier otra cosa se
// descarta en silencio: el mail sale sin rutina, nunca con un link ajeno.
export function rutinaValida(valor: unknown, sitio: string): string | undefined {
  if (typeof valor !== "string" || valor.length > 400) return undefined;
  try {
    const origen = new URL(sitio);
    const url = new URL(valor);
    if (url.origin !== origen.origin || url.pathname !== "/rutina") return undefined;
    return `${origen.origin}/rutina${url.search}`;
  } catch {
    return undefined;
  }
}
