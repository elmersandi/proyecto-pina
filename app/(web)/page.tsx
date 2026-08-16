// app/(web)/page.tsx
import type { Metadata } from "next";
import Hero from "./components/Hero";
import Beneficios from "./components/Beneficios";
import CursosRecientes from "./components/CursosRecientes";   
import Estadisticas from "./components/Estadisticas";
import Logros from "./components/Logros";
import Modalidades from "./components/Modalidades";
import Servicios from "./components/Servicios";
import Conocenos from "./components/Conocenos";
import Ubicacion from "./components/Ubicacion";

export const metadata: Metadata = {
  title: "Proyecto Piña | Academia Pre-Universitaria en Iquitos",
  description: "Asegura tu ingreso a la universidad con Proyecto Piña. Preparación pre-universitaria de excelencia en Ciencias, Letras y más.",
};

export default function InicioPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Beneficios />
      <CursosRecientes/>
      <Estadisticas />
      <Logros />
      <Modalidades />
      <Servicios />
      <Conocenos />
      <Ubicacion />
    </main>
  );
}