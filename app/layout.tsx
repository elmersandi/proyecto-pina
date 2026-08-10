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

// Aprovechamos para ponerle el nombre real de tu academia para el SEO global
export const metadata: Metadata = {
  title: "Proyecto Piña | Academia Pre-Universitaria",
  description: "Asegura tu ingreso a la universidad con nuestra preparación de excelencia en Proyecto Piña.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es" // 1. Cambiamos el idioma a español
      suppressHydrationWarning // 2. Agregamos este escudo contra extensiones del navegador
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}