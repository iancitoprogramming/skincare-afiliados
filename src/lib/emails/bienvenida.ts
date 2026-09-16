import { copy } from "../../niches/skincare/copy";
import { PALETA } from "../../niches/skincare/paleta";

// El mail que sale cuando alguien deja su correo. Uno solo para los dos casos:
// desde la home (sin rutina todavía) y desde el resultado del quiz (con el
// link a su rutina, que es lo que la pantalla prometió: "te guardamos la
// rutina, revisá tu correo").
//
// Todo inline y con tablas: Gmail y Outlook descartan <style> y clases. Los
// colores salen de PALETA, la misma de theme.css. Hasta el 15/9 estaban copiados
// a mano y habían quedado con la paleta anterior.
//
// Desde el 15/9 tiene el lenguaje del sitio: fondo marfil, tarjeta recta con una
// línea fina, título en serif y botón en tinta. El botón no es terracota porque
// no lleva a comprar, y el terracota es sólo para comprar. La serif del título es
// Georgia y no Newsreader: un mail no puede contar con que el cliente cargue una
// fuente web.
//
// El texto sale del copy del sitio o dice cosas que el sitio hace. No promete
// frecuencia de envío: no hay newsletter armado, y "una vez por semana" sería
// la primera promesa incumplida.
const TEMA = {
  porcelana: PALETA.porcelana,
  blanco: "#ffffff",
  tinta: PALETA.tinta,
  piedra: PALETA.piedra,
  salvia: PALETA.salvia,
  niebla: PALETA.niebla,
} as const;

export type Bienvenida = {
  /** URL absoluta del sitio, sin barra final. */
  sitio: string;
  /** URL absoluta de la rutina armada, si el mail sale desde el resultado. */
  rutinaUrl?: string;
  /** URL de baja. Con topicId va el token {{{RESEND_UNSUBSCRIBE_URL}}}, que Resend reemplaza. */
  bajaUrl?: string;
};

export const bienvenida = {
  asunto: ({ rutinaUrl }: Pick<Bienvenida, "rutinaUrl">) =>
    rutinaUrl ? "Tu rutina, guardada" : "Ya estás en el Club",
  saludo: "Hola,",
  conRutina: "Acá está la rutina que armaste, para que la abras cuando quieras:",
  botonRutina: "Ver mi rutina",
  sinRutina:
    "Gracias por dejarnos tu correo. Lo más útil que te podemos decir es lo mismo que dice el sitio:",
  botonQuiz: "Armar mi rutina",
  // Sin frecuencia: se escribe cuando hay algo que decir. Es la misma frase que
  // la home muestra debajo de la captura de mail, y vive en copy.ts.
  frecuencia: copy.correo.frecuencia,
  porQue: (sitio: string) => `Recibís este mail porque dejaste tu correo en ${sitio.replace(/^https?:\/\//, "")}.`,
  baja: "Darte de baja",
} as const;

export function bienvenidaAsunto(props: Pick<Bienvenida, "rutinaUrl">): string {
  return bienvenida.asunto(props);
}

export function bienvenidaTexto({ sitio, rutinaUrl, bajaUrl }: Bienvenida): string {
  const lineas = [bienvenida.saludo, ""];
  if (rutinaUrl) {
    lineas.push(bienvenida.conRutina, "", rutinaUrl, "", copy.ventana, "");
  } else {
    lineas.push(bienvenida.sinRutina, "", copy.home.titulo, copy.tagline, "", `${bienvenida.botonQuiz}: ${sitio}/rutina`, "");
  }
  lineas.push(bienvenida.frecuencia, "", copy.marca, "", `* ${copy.afiliacion}`, `* ${copy.dermatologo}`);
  if (bajaUrl) lineas.push("", `${bienvenida.baja}: ${bajaUrl}`);
  return lineas.join("\n");
}

export function bienvenidaHtml({ sitio, rutinaUrl, bajaUrl }: Bienvenida): string {
  const fuente = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";
  const serif = "font-family:Georgia,'Times New Roman',serif;";
  const boton = (href: string, texto: string) => `
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:${TEMA.tinta};">
                    <a href="${escapar(href)}" style="display:inline-block;padding:16px 28px;${fuente}font-size:14px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${TEMA.porcelana};text-decoration:none;">${escapar(texto)}</a>
                  </td>
                </tr>
              </table>`;

  const cuerpo = rutinaUrl
    ? `
              <p style="margin:0 0 20px 0;">${escapar(bienvenida.conRutina)}</p>
              ${boton(rutinaUrl, bienvenida.botonRutina)}
              <p style="margin:24px 0 0 0;font-size:15px;color:${TEMA.piedra};">${escapar(copy.ventana)}</p>`
    : `
              <p style="margin:0 0 20px 0;">${escapar(bienvenida.sinRutina)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;border-left:2px solid ${TEMA.salvia};">
                <tr>
                  <td style="padding:4px 0 4px 16px;${fuente}font-size:17px;line-height:1.45;color:${TEMA.tinta};">
                    <span style="${serif}font-size:21px;line-height:1.3;">${escapar(copy.home.titulo)}</span><br>
                    <span style="color:${TEMA.piedra};">${escapar(copy.tagline)}</span>
                  </td>
                </tr>
              </table>
              ${boton(`${sitio}/rutina`, bienvenida.botonQuiz)}`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapar(bienvenida.asunto({ rutinaUrl }))}</title>
</head>
<body style="margin:0;padding:0;background-color:${TEMA.porcelana};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapar(rutinaUrl ? bienvenida.conRutina : copy.tagline)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${TEMA.porcelana};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${TEMA.blanco};border:1px solid ${TEMA.niebla};">
          <tr>
            <td style="padding:36px 36px 0 36px;${fuente}">
              <p style="margin:0;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:${TEMA.piedra};">${escapar(copy.marca)}</p>
              <h1 style="margin:14px 0 0 0;${serif}font-size:28px;line-height:1.2;font-weight:400;color:${TEMA.tinta};">${escapar(bienvenida.asunto({ rutinaUrl }))}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 36px 36px;${fuente}font-size:16px;line-height:1.6;color:${TEMA.tinta};">
              <p style="margin:0 0 16px 0;">${escapar(bienvenida.saludo)}</p>${cuerpo}
              <p style="margin:28px 0 0 0;font-size:15px;line-height:1.6;color:${TEMA.piedra};">${escapar(bienvenida.frecuencia)}</p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
          <tr>
            <td style="padding:20px 36px;${fuente}font-size:12px;line-height:1.6;color:${TEMA.piedra};">
              <p style="margin:0 0 6px 0;">* ${escapar(copy.afiliacion)}</p>
              <p style="margin:0 0 6px 0;">* ${escapar(copy.dermatologo)}</p>
              <p style="margin:0 0 6px 0;">${escapar(bienvenida.porQue(sitio))}</p>
              ${bajaUrl ? `<p style="margin:0;"><a href="${escapar(bajaUrl)}" style="color:${TEMA.piedra};text-decoration:underline;">${escapar(bienvenida.baja)}</a></p>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapar(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
