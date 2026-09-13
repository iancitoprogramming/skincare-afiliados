import { describe, expect, it } from "vitest";
import { alternarTengo, leerTengo } from "./yaLoTengo";

describe("leerTengo", () => {
  it("sin nada guardado arranca vacío", () => {
    expect(leerTengo(null)).toEqual([]);
    expect(leerTengo("")).toEqual([]);
  });

  it("lee una lista de categorías", () => {
    expect(leerTengo('["limpiador","hidratante"]')).toEqual(["limpiador", "hidratante"]);
  });

  // Lo que hay en el localStorage lo pudo haber escrito cualquier cosa: una
  // versión vieja del sitio, una extensión, alguien a mano en la consola. Leer
  // mal ahí no puede romper la pantalla del resultado.
  it("descarta lo que no tiene forma de lista de categorías, sin romper", () => {
    expect(leerTengo("{roto")).toEqual([]);
    expect(leerTengo('{"limpiador":true}')).toEqual([]);
    expect(leerTengo('"limpiador"')).toEqual([]);
    expect(leerTengo('["limpiador", 3, null, ""]')).toEqual(["limpiador"]);
  });

  it("no duplica", () => {
    expect(leerTengo('["limpiador","limpiador"]')).toEqual(["limpiador"]);
  });
});

describe("alternarTengo", () => {
  it("marca lo que no estaba", () => {
    expect(alternarTengo(["limpiador"], "hidratante")).toEqual(["limpiador", "hidratante"]);
  });

  it("desmarca lo que estaba", () => {
    expect(alternarTengo(["limpiador", "hidratante"], "limpiador")).toEqual(["hidratante"]);
  });

  it("marcar y desmarcar vuelve al punto de partida", () => {
    const inicio = ["protector_solar"];
    expect(alternarTengo(alternarTengo(inicio, "limpiador"), "limpiador")).toEqual(inicio);
  });
});
