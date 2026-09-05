import type { Producto } from "./recomendacion";

// URL legible y estable por producto. Estable importa más de lo que parece: un pin
// de Pinterest vive años, y si el slug cambia el pin queda apuntando a un 404.
// Por eso se deriva de marca + nombre, que no cambian, y no de la categoría o el
// tier, que sí.

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugProducto(p: Pick<Producto, "marca" | "nombre">): string {
  const marca = (p.marca ?? "").trim();
  // Varios nombres ya empiezan con la marca ("Cleanex Free Gel..."). Repetirla
  // daría "cleanex-cleanex-free-gel".
  const yaLaTiene = marca && p.nombre.toLowerCase().startsWith(marca.toLowerCase());
  const base = yaLaTiene || !marca ? p.nombre : `${marca} ${p.nombre}`;
  return slugify(base).slice(0, 70).replace(/-+$/, "");
}

/** Índice slug → producto. Falla fuerte si dos productos colisionan. */
export function indicePorSlug(productos: Producto[]): Map<string, Producto> {
  const idx = new Map<string, Producto>();
  for (const p of productos) {
    const s = slugProducto(p);
    const previo = idx.get(s);
    if (previo) {
      throw new Error(
        `Slug duplicado "${s}": ${previo.ml_id} y ${p.ml_id}. ` +
          `Diferenciá el nombre de alguno de los dos.`,
      );
    }
    idx.set(s, p);
  }
  return idx;
}
