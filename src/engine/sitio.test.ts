import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { urlDelSitio } from "./sitio";

// Las tres variables se pisan entre tests, así que se guardan y se restauran.
const CLAVES = [
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

let original: Record<string, string | undefined>;

beforeEach(() => {
  original = Object.fromEntries(CLAVES.map((k) => [k, process.env[k]]));
  for (const k of CLAVES) delete process.env[k];
});

afterEach(() => {
  for (const k of CLAVES) {
    if (original[k] === undefined) delete process.env[k];
    else process.env[k] = original[k];
  }
});

describe("urlDelSitio", () => {
  it("sin nada configurado cae a localhost", () => {
    expect(urlDelSitio()).toBe("http://localhost:3000");
  });

  it("le agrega https:// a un dominio pelado", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "clubdepiel.com.ar";
    expect(urlDelSitio()).toBe("https://clubdepiel.com.ar");
  });

  it("saca la barra final, y las que haya de más", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://clubdepiel.com.ar///";
    expect(urlDelSitio()).toBe("https://clubdepiel.com.ar");
  });

  it("respeta http:// cuando viene explícito", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:4000/";
    expect(urlDelSitio()).toBe("http://localhost:4000");
  });

  it("una variable vacía no cuenta como configurada", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "club.vercel.app";
    expect(urlDelSitio()).toBe("https://club.vercel.app");
  });

  it("el dominio propio le gana al de producción de Vercel", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "clubdepiel.com.ar";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "club.vercel.app";
    process.env.VERCEL_URL = "club-abc123.vercel.app";
    expect(urlDelSitio()).toBe("https://clubdepiel.com.ar");
  });

  it("el de producción le gana a la URL del deploy puntual", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "club.vercel.app";
    process.env.VERCEL_URL = "club-abc123.vercel.app";
    expect(urlDelSitio()).toBe("https://club.vercel.app");
  });

  // El contrato real: metadataBase hace `new URL()` con esto. Si tira, el build
  // se cae con un error que no dice nada útil.
  it("lo que devuelve siempre entra en new URL()", () => {
    const casos = [
      undefined,
      "clubdepiel.com.ar",
      "https://clubdepiel.com.ar/",
      "http://localhost:4000",
      "CLUBDEPIEL.COM.AR",
    ];
    for (const caso of casos) {
      if (caso === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = caso;
      expect(() => new URL(urlDelSitio()), `falló con ${caso}`).not.toThrow();
    }
  });
});
