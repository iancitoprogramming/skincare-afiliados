import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Instrument_Sans, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { copy } from "@/niches/skincare/copy";
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
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

/**
 * Base absoluta para og:image y demás URLs de metadata.
 *
 * Importa más de lo que parece: si queda en localhost, la imagen que Pinterest,
 * WhatsApp o Instagram muestran al compartir el link apunta a una máquina que
 * nadie puede ver, y el preview sale vacío.
 *
 * Orden: dominio propio si está configurado → dominio estable de producción de
 * Vercel → URL del deploy puntual → localhost en desarrollo. Los tres del medio
 * los setea Vercel solo, no hay que configurar nada.
 */
function baseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: copy.meta.title,
  description: copy.meta.description,
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
    siteName: copy.marca,
    locale: "es_AR",
    type: "website",
  },
  other: {
    // Pinterest da un código para reclamar el dominio. Se pega en la env var y
    // listo: no hace falta tocar código ni volver a deployar a mano.
    ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFY
      ? { "p:domain_verify": process.env.NEXT_PUBLIC_PINTEREST_VERIFY }
      : {}),
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es-AR"
      className={`${bricolage.variable} ${instrument.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-[100dvh] bg-porcelana font-body text-tinta antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
