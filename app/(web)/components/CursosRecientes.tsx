// app/(web)/components/CursosRecientes.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react";

export default async function CursosRecientes() {
  const ultimosCursos = await prisma.curso.findMany({
    where: { publicado: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      categoria: {
        select: { nombre: true },
      },
    },
  });

  if (ultimosCursos.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Título de la sección */}
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-950 mb-4">
            Últimos Agregados
          </h2>
          <p className="text-slate-600 max-w-2xl font-medium text-base md:text-lg">
            Descarga de inmediato el material más nuevo que hemos preparado para asegurar tu ingreso a la universidad.
          </p>
        </div>

        {/* 
          CARRUSEL MÓVIL / GRID ESCRITORIO
        */}
        <div className="
          flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4
          md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible md:snap-none md:gap-6 md:pb-0 md:mx-0 md:px-0
          scrollbar-hide
        ">
          {ultimosCursos.map((curso) => (
            <Link 
              key={curso.id} 
              href={`/cursos/${curso.slug}`} 
              className="
                snap-start shrink-0 w-[65vw] sm:w-[45vw] md:w-auto
                group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer
              "
            >
              {/* Portada Optimizada con next/image */}
              <div className="aspect-[5/4] sm:aspect-[4/3] bg-slate-100 relative overflow-hidden rounded-t-2xl">
                {curso.portadaUrl ? (
                  <Image 
                    src={curso.portadaUrl} 
                    alt={curso.titulo} 
                    fill
                    sizes="(max-width: 768px) 65vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <BookOpen size={48} />
                  </div>
                )}
                
                {/* Etiqueta Gratis */}
                {curso.esGratis && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm z-10">
                    Gratis
                  </span>
                )}
              </div>

              {/* Contenido de la Tarjeta */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-2">
                    {curso.categoria?.nombre || "General"}
                  </p>
                  <h3 className="text-sm md:text-base font-bold text-blue-950 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
                    {curso.titulo}
                  </h3>
                </div>
                
                {/* Pequeño detalle visual al final de la tarjeta */}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                  Ver detalle <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Botón de Explorar Más */}
        <div className="mt-8 md:mt-14 flex justify-center">
          <Link 
            href="/cursos" 
            className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Explorar más cursos <ArrowRight size={18} />
          </Link>
        </div>

      </div>

      {/* Estilos globales rápidos para ocultar la barra de scroll fea en móviles */}
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