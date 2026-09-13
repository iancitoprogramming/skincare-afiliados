// El mail de bienvenida es copy que sale con nuestra firma a una casilla ajena:
// pasa por el mismo filtro de claims que todo lo demás, y tiene que cumplir lo
// que la pantalla prometió ("te guardamos la rutina, revisá tu correo").

import { describe, expect, it } from "vitest";
import { bienvenida, bienvenidaAsunto, bienvenidaHtml, bienvenidaTexto } from "./bienvenida";
import { PROHIBIDAS } from "../../niches/skincare/claims";

const sitio = "https://clubdepiel.store";
const rutinaUrl = `${sitio}/rutina?p=mixta&o=manchas&b=2&k=tanto&n=1`;
const baja = "{{{RESEND_UNSUBSCRIBE_URL}}}";

describe("mail de bienvenida", () => {
  it("no promete lo que el sitio no puede sostener", () => {
    const textos = [
      ...Object.values(bienvenida).map((v) => (typeof v === "function" ? v("x") : v)),
      bienvenidaTexto({ sitio, rutinaUrl, bajaUrl: baja }),
      bienvenidaTexto({ sitio }),
    ].map(String);
    const problemas: string[] = [];
    for (const texto of textos) {
      for (const [re, motivo] of PROHIBIDAS) {
        if (re.test(texto)) problemas.push(`"${texto.slice(0, 60)}…": ${motivo}`);
      }
    }
    expect(problemas).toEqual([]);
  });

  // "Una vez por semana" era la primera promesa incumplida: no hay newsletter.
  it("no promete una frecuencia de envío", () => {
    expect(bienvenidaTexto({ sitio })).not.toMatch(/semana|semanal|todos los d[ií]as|cada d[ií]a/i);
  });

  it("con rutina, el mail la trae y lo dice en el asunto", () => {
    expect(bienvenidaAsunto({ rutinaUrl })).toBe("Tu rutina, guardada");
    expect(bienvenidaTexto({ sitio, rutinaUrl })).toContain(rutinaUrl);
    // En el HTML el & de la query va como &amp;, que es lo que un href necesita.
    expect(bienvenidaHtml({ sitio, rutinaUrl })).toContain(`href="${rutinaUrl.replace(/&/g, "&amp;")}"`);
  });

  it("sin rutina, manda al quiz", () => {
    expect(bienvenidaAsunto({})).toBe("Ya estás en el Club");
    expect(bienvenidaTexto({ sitio })).toContain(`${sitio}/rutina`);
    expect(bienvenidaHtml({ sitio })).toContain(`href="${sitio}/rutina"`);
  });

  it("el link de baja queda intacto para que Resend lo reemplace", () => {
    expect(bienvenidaHtml({ sitio, bajaUrl: baja })).toContain(`href="${baja}"`);
    expect(bienvenidaTexto({ sitio, bajaUrl: baja })).toContain(baja);
    expect(bienvenidaHtml({ sitio })).not.toContain("Darte de baja");
  });

  it("lleva los avisos de afiliación y dermatólogo en el pie", () => {
    const html = bienvenidaHtml({ sitio, rutinaUrl });
    expect(html).toContain("comisión");
    expect(html).toContain("dermatólogo");
  });

  it("escapa lo que interpola en el HTML", () => {
    const html = bienvenidaHtml({ sitio: "https://x.test", rutinaUrl: 'https://x.test/rutina?p="<b>' });
    expect(html).not.toContain('?p="<b>');
    expect(html).toContain("&quot;&lt;b&gt;");
  });
});
