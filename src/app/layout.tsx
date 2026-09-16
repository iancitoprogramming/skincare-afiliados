import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Medicion } from "@/components/Medicion";
import { copy } from "@/niches/skincare/copy";
import { informarMetadata, urlDelSitio } from "@/lib/sitio";
import "./globals.css";

// Dos familias. Newsreader para los títulos: la referencia visual es Beauty of
// Joseon, que titula en una serif (Proxima Sera, que es paga), y de las libres
// es la más parecida —híbrida, con x-height amplia—. Es variable y trae eje de
// tamaño óptico, así que el mismo archivo sirve para el titular grande y para un
// título chico. Instrument Sans va en el texto y en las etiquetas.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  axes: ["opsz"],
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
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
      className={`${newsreader.variable} ${instrument.variable}`}
    >
      <body className="min-h-[100dvh] bg-porcelana font-body text-tinta antialiased">
        {children}
        <Analytics />
        <Medicion />
      </body>
    </html>
  );
}
