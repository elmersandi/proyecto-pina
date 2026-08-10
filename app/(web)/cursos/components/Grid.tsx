"use client";

import { Filter, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// =====================================================================
// INTERFACES
// =====================================================================
interface Curso {
  id: string;
  titulo: string;
  slug: string;
  descripcionCorta: string;
  portadaUrl?: string | null;
  esGratis: boolean;
  precio?: number | null;
  categoria?: { nombre: string };
  subcategoria?: { nombre: string } | null;
}

interface GridProps {
  cursos: Curso[];
  busquedaActual: string;
  tieneFiltros: boolean;
  onLimpiarFiltros: () => void;
}

export default function Grid({
  cursos,
  busquedaActual,
  tieneFiltros,
  onLimpiarFiltros,
}: GridProps) {
  
  // =====================================================================
  // ESTADO VACÍO
  // =====================================================================
  if (cursos.length === 0) {
    return (
      <div className="w-full bg-white border border-slate-200 border-dashed rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center my-4 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-950 rounded-2xl flex items-center justify-center mb-4">
          <Filter size={28} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          No encontramos material con esos criterios
        </h3>
        <p className="text-slate-500 text-sm max-w-md mb-6">
          {busquedaActual
            ? `No hay resultados que coincidan con "${busquedaActual}". Intenta con otro término.`
            : "No hay documentos registrados en esta área en este momento."}
        </p>
        {tieneFiltros && (
          <button
            onClick={onLimpiarFiltros}
            className="bg-blue-950 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-950/20 active:scale-95 cursor-pointer"
          >
            Limpiar filtros y ver todo
          </button>
        )}
      </div>
    );
  }

  // =====================================================================
  // GRILLA TIPO LIBRO / SCRIBD
  // =====================================================================
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {cursos.map((curso) => (
        <Link
          href={`/cursos/${curso.slug}`}
          key={curso.id}
          // Bordes más sutiles y sin tanto redondeo para parecer un documento
          className="bg-white rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex flex-col overflow-hidden group cursor-pointer"
        >
          {/* Imagen Principal con proporción de libro (3:4) */}
          <div className="w-full aspect-[3/4] bg-slate-100 relative overflow-hidden border-b border-slate-100">
            {curso.portadaUrl ? (
              <Image
                src={curso.portadaUrl}
                alt={`Portada de ${curso.titulo}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                <BookOpen size={32} className="mb-2 opacity-50" />
                <span className="text-[10px] font-medium uppercase tracking-widest opacity-60">Sin Portada</span>
              </div>
            )}

            {/* Etiqueta de Gratis / Premium (Hicimos la letra un poco más pequeña para móvil) */}
            {curso.esGratis ? (
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold uppercase px-2 py-1 rounded tracking-wider shadow-sm z-10">
                GRATIS
              </span>
            ) : (
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-yellow-500 text-blue-950 text-[9px] sm:text-[10px] font-bold uppercase px-2 py-1 rounded tracking-wider shadow-sm z-10">
                PREMIUM
              </span>
            )}
          </div>

          {/* Contenedor de Texto Limpio */}
          <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug mb-1.5 group-hover:text-blue-700 transition-colors line-clamp-2">
              {curso.titulo}
            </h3>

            {curso.descripcionCorta && (
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 font-medium">
                {curso.descripcionCorta}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}