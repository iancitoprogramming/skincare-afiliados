import { describe, expect, it } from "vitest";
import { rutinaValida } from "./rutina-url";

const sitio = "https://clubdepiel.store";

describe("la URL de la rutina que va en el mail", () => {
  it("acepta la del sitio y la reconstruye con su query", () => {
    expect(rutinaValida(`${sitio}/rutina?p=mixta&o=manchas`, sitio)).toBe(`${sitio}/rutina?p=mixta&o=manchas`);
    // Fragmentos y credenciales no viajan.
    expect(rutinaValida(`https://u:p@clubdepiel.store/rutina?p=seca#x`, sitio)).toBe(`${sitio}/rutina?p=seca`);
  });

  it("descarta cualquier link que no sea /rutina de este sitio", () => {
    expect(rutinaValida("https://otro.sitio/rutina?p=mixta", sitio)).toBeUndefined();
    expect(rutinaValida(`${sitio}/catalogo`, sitio)).toBeUndefined();
    expect(rutinaValida(`${sitio}.evil.com/rutina`, sitio)).toBeUndefined();
    expect(rutinaValida("javascript:alert(1)", sitio)).toBeUndefined();
    expect(rutinaValida(42, sitio)).toBeUndefined();
    expect(rutinaValida("x".repeat(401), sitio)).toBeUndefined();
  });
});
