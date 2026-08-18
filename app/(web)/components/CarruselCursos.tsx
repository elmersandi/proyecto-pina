"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CarruselCursos({ cursos }: { cursos: any[] }) {
  const carruselRef = useRef<HTMLDivElement>(null);

  const scroll = (direccion: "izq" | "der") => {
    if (carruselRef.current) {
      const { scrollLeft, clientWidth } = carruselRef.current;
      // Desplaza el tamaño exacto de la pantalla actual
      const scrollTo = direccion === "izq" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carruselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Botón Izquierda (Solo Laptop) */}
      <button 
        onClick={() => scroll("izq")} 
        className="hidden md:flex absolute -left-5 top-[40%] -translate-y-1/2 z-10 w-12 h-12 bg-white border border-slate-200 shadow-lg rounded-full items-center justify-center text-blue-950 hover:bg-orange-50 hover:text-orange-600 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* Botón Derecha (Solo Laptop) */}
      <button 
        onClick={() => scroll("der")} 
        className="hidden md:flex absolute -right-5 top-[40%] -translate-y-1/2 z-10 w-12 h-12 bg-white border border-slate-200 shadow-lg rounded-full items-center justify-center text-blue-950 hover:bg-orange-50 hover:text-orange-600 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronRight size={24} />
      </button>

      {/* Contenedor del Carrusel Horizontal */}
      <div 
        ref={carruselRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide scroll-smooth"
      >
        {cursos.map((curso) => (
          <Link 
            key={curso.id} 
            href={`/cursos/${curso.slug}`} 
            className="
              snap-start shrink-0 
              w-[calc((100%-1rem)/2)]      /* 2 items en móvil */
              md:w-[calc((100%-3rem)/4)]   /* 4 items en tablet */
              lg:w-[calc((100%-4rem)/5)]   /* 5 items en laptop/desktop */
              group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer
            "
          >
            {/* Portada */}
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden rounded-t-2xl">
              {curso.portadaUrl ? (
                <Image 
                  src={curso.portadaUrl} 
                  alt={curso.titulo} 
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <BookOpen size={48} />
                </div>
              )}
              
              {/* Etiqueta de Categoría (Reemplazó al 'Gratis') */}
              <span className="absolute top-2 left-2 bg-blue-950/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded md:rounded-md uppercase tracking-wider shadow-sm z-10">
                {curso.categoria?.nombre || "General"}
              </span>
            </div>

            {/* Contenido (Centrado) */}
            <div className="p-3 md:p-4 flex-1 flex flex-col justify-between items-center text-center">
              <h3 className="text-sm md:text-[15px] font-bold text-blue-950 line-clamp-3 group-hover:text-blue-700 transition-colors leading-snug mb-3">
                {curso.titulo}
              </h3>
              
              <div className="mt-auto flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                Ver detalle <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}