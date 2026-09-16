import { describe, expect, it } from "vitest";
import { productos } from "../niches/skincare/productos";
import { PROHIBIDAS } from "../niches/skincare/claims";
import { MAX_DESCRIPCION, descripcionPin, nombreConMarca, urlGuardarPin } from "./pinterest";

const activos = productos.filter((p) => p.activo);

describe("lo que el botón Guardar le pasa a Pinterest", () => {
  it("no repite la marca cuando el nombre ya la trae", () => {
    expect(nombreConMarca({ marca: "Cleanex", nombre: "Cleanex Free Gel Limpiador 150 g" })).toBe(
      "Cleanex Free Gel Limpiador 150 g",
    );
    expect(nombreConMarca({ marca: "La Roche-Posay", nombre: "La Roche Posay Retinol B3" })).toBe(
      "La Roche Posay Retinol B3",
    );
    expect(nombreConMarca({ marca: "NIVEA", nombre: "Protector Solar Facial FPS 50" })).toBe(
      "NIVEA Protector Solar Facial FPS 50",
    );
  });

  it("la descripción de cada producto entra en el límite de Pinterest", () => {
    const largas = activos.filter((p) => descripcionPin(p).length > MAX_DESCRIPCION).map((p) => p.id);
    expect(largas).toEqual([]);
  });

  it("corta una descripción larga en un espacio, no en el medio de una palabra", () => {
    const d = descripcionPin({ nombre: "Sérum", por_que: "palabra ".repeat(100) });
    expect(d.length).toBeLessThanOrEqual(MAX_DESCRIPCION);
    expect(d.endsWith(" palabra…")).toBe(true);
  });

  // La descripción viaja a Pinterest y queda en el pin: pasa por el mismo filtro
  // de claims que el copy del sitio, con el nombre incluido, porque los nombres
  // son títulos de Mercado Libre y ahí nadie filtra nada.
  it("ninguna descripción promete lo que un cosmético no puede sostener", () => {
    const problemas: string[] = [];
    for (const p of activos) {
      const d = descripcionPin(p);
      for (const [re, motivo] of PROHIBIDAS) if (re.test(d)) problemas.push(`${p.id}: ${motivo}`);
    }
    expect(problemas).toEqual([]);
  });

  it("arma el formulario de creación con los tres datos codificados", () => {
    const href = urlGuardarPin({
      url: "https://clubdepiel.store/producto/un-serum",
      media: "https://clubdepiel.store/api/pin/producto/un-serum",
      descripcion: "Sérum con niacinamida & zinc",
    });
    const u = new URL(href);
    expect(u.origin + u.pathname).toBe("https://www.pinterest.com/pin/create/button/");
    expect(u.searchParams.get("url")).toBe("https://clubdepiel.store/producto/un-serum");
    expect(u.searchParams.get("media")).toBe("https://clubdepiel.store/api/pin/producto/un-serum");
    expect(u.searchParams.get("description")).toBe("Sérum con niacinamida & zinc");
    expect(href).not.toContain("+");
  });
});
