import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configuración de SEO Global para Google y Redes Sociales
export const metadata: Metadata = {
  title: "Proyecto Piña | Academia Pre-Universitaria en Loreto",
  description: "Descarga materiales gratuitos, PDFs, prácticas y simulacros tipo examen de admisión. Prepárate con la mejor academia de la Amazonía peruana.",
  keywords: ["academia preuniversitaria", "Iquitos", "Loreto", "exámenes de admisión", "UNAP", "cursos gratis", "Proyecto Piña"],
  authors: [{ name: "Proyecto Piña" }],
  openGraph: {
    title: "Proyecto Piña | Academia Pre-Universitaria",
    description: "Material preuniversitario gratuito y actualizado para asegurar tu ingreso a la universidad.",
    url: "https://proyectopiña.com",
    siteName: "Proyecto Piña",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Logo de Proyecto Piña",
      }
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proyecto Piña | Academia Pre-Universitaria",
    description: "Descarga materiales preuniversitarios gratuitos en Iquitos.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="xstR5789p9plzlKqM-klBaAmVaGhstNECu94G-7Wq9c" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}