import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Hero from "./components/Hero";
import Catalogo from "./components/Catalogo";

export const revalidate = 60; // Revalida los datos cada 60 segundos

export default async function CursosPage() {
  const [cursosData, categoriasData, subcategoriasData] = await Promise.all([
    prisma.curso.findMany({
      where: { publicado: true },
      include: {
        categoria: { select: { id: true, nombre: true } },
        subcategoria: { select: { id: true, nombre: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.categoria.findMany({
      orderBy: { nombre: "asc" },
    }),
    prisma.subcategoria.findMany({
      orderBy: { nombre: "asc" },
    }),
  ]);

  return (
    <>
      <Hero />
      <Suspense fallback={<div className="text-center py-24 text-slate-500 font-medium">Cargando catálogo...</div>}>
        <Catalogo
          cursosIniciales={cursosData}
          categoriasIniciales={categoriasData}
          subcategoriasIniciales={subcategoriasData}
        />
      </Suspense>
    </>
  );
}