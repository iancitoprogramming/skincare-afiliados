import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, DM_Mono, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { copy } from "@/niches/skincare/copy";
import { informarMetadata, urlDelSitio } from "@/lib/sitio";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
// La cara de etiqueta. Era Space Mono, y sus serifas de máquina de escribir
// se leían como retro sobre la foto de la home. DM Mono conserva lo que la
// mono aporta —etiquetas cortas y números alineados— sin ese aire. Nunca se
// usó en negrita, así que con 400 y 500 alcanza.
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-ui",
  display: "swap",
});

// Corre una vez al cargar el módulo: en Vercel eso es durante el build, que es
// donde sirve verlo.
informarMetadata();

const verificacionPinterest = process.env.NEXT_PUBLIC_PINTEREST_VERIFY;

export const metadata: Metadata = {
  metadataBase: new URL(urlDelSitio()),
  title: copy.meta.title,
  description: copy.meta.description,
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
    siteName: copy.marca,
    locale: "es_AR",
    type: "website",
  },
  // Condicional a propósito. Un <meta ... content=""> vacío es peor que no
  // tener el tag: Pinterest lo encuentra, no coincide con el código, y el
  // error dice "no verificado" sin explicar por qué.
  ...(verificacionPinterest
    ? { other: { "p:domain_verify": verificacionPinterest } }
    : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es-AR"
      className={`${bricolage.variable} ${instrument.variable} ${dmMono.variable}`}
    >
      <body className="min-h-[100dvh] bg-porcelana font-body text-tinta antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
