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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: copy.meta.title,
  description: copy.meta.description,
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
