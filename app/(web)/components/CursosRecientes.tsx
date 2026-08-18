// app/(web)/components/CursosRecientes.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CarruselCursos from "./CarruselCursos"; // Importamos nuestro nuevo cliente

export default async function CursosRecientes() {
  const ultimosCursos = await prisma.curso.findMany({
    where: { publicado: true },
    orderBy: { createdAt: "desc" },
    take: 10, // <-- Cambiado a los 10 últimos
    include: {
      categoria: {
        select: { nombre: true },
      },
    },
  });

  if (ultimosCursos.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Título de la sección */}
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-950 mb-4">
            Últimos Agregados
          </h2>
          <p className="text-slate-600 max-w-2xl font-medium text-base md:text-lg">
            Descarga de inmediato el material más nuevo que hemos preparado para asegurar tu ingreso a la universidad.
          </p>
        </div>

        {/* Carrusel interactivo */}
        <CarruselCursos cursos={ultimosCursos} />

        {/* Botón de Explorar Más */}
        <div className="mt-6 md:mt-10 flex justify-center">
          <Link 
            href="/cursos" 
            className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Explorar más cursos <ArrowRight size={18} />
          </Link>
        </div>

      </div>

      {/* Estilos globales para ocultar la barra de scroll (si no la tienes ya global) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />
    </section>
  );
}