import { prisma } from "@/lib/prisma";
import Hero from "./components/Hero";
import Catalogo from "./components/Catalogo";

export const revalidate = 60; // (Opcional) Revalida los datos cada 60 segundos para mayor velocidad

export default async function CursosPage() {
  // Consultamos los datos reales de la base de datos en el servidor en paralelo
  const [cursosData, categoriasData, subcategoriasData] = await Promise.all([
    prisma.curso.findMany({
      where: { publicado: true }, // Solo mostramos los cursos que marcaste como "Publicado"
      include: {
        categoria: { select: { id: true, nombre: true } },
        subcategoria: { select: { id: true, nombre: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.categoria.findMany({ 
      orderBy: { nombre: "asc" } 
    }),
    prisma.subcategoria.findMany({ 
      orderBy: { nombre: "asc" } 
    }),
  ]);

  return (
    <>
      <Hero />
      <Catalogo
        cursosIniciales={cursosData}
        categoriasIniciales={categoriasData}
        subcategoriasIniciales={subcategoriasData}
      />
    </>
  );
}