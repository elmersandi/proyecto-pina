"use client";

import { useState, useMemo } from "react";
import Buscador from "./Buscador"; // Quitamos el ícono Filter porque ya no usamos el título
import Sidebar from "./Sidebar";
import FiltrosMovil from "./FiltrosMovil";
import Grid from "./Grid";

// =====================================================================
// INTERFACES (Adaptadas al modelo Curso)
// =====================================================================
interface Categoria { id: string; nombre: string; }
interface Subcategoria { id: string; nombre: string; categoriaId: string; }
interface Curso {
  id: string; 
  titulo: string; 
  slug: string; 
  descripcionCorta: string;
  portadaUrl?: string | null;
  esGratis: boolean;
  precio?: number | null;
  categoriaId: string; 
  subcategoriaId?: string | null; 
  categoria?: { nombre: string }; 
  subcategoria?: { nombre: string } | null;
}

interface CatalogoProps {
  cursosIniciales: Curso[];
  categoriasIniciales: Categoria[];
  subcategoriasIniciales: Subcategoria[];
}

export default function Catalogo({
  cursosIniciales,
  categoriasIniciales,
  subcategoriasIniciales,
}: CatalogoProps) {
  
  // =====================================================================
  // ESTADOS DEL COMPONENTE
  // =====================================================================
  const [busqueda, setBusqueda] = useState<string>("");
  const [categoriaSel, setCategoriaSel] = useState<string>("");
  const [subcategoriaSel, setSubcategoriaSel] = useState<string>("");

  // =====================================================================
  // MOTOR DE FILTRADO INSTANTÁNEO
  // =====================================================================
  const cursosFiltrados = useMemo(() => {
    return cursosIniciales.filter((curso) => {
      const coincideCat = categoriaSel === "" || curso.categoriaId === categoriaSel;
      const coincideSub = subcategoriaSel === "" || curso.subcategoriaId === subcategoriaSel;

      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        termino === "" ||
        (curso.titulo?.toLowerCase() || "").includes(termino) ||
        (curso.categoria?.nombre?.toLowerCase() || "").includes(termino) ||
        (curso.subcategoria?.nombre?.toLowerCase() || "").includes(termino);

      return coincideCat && coincideSub && coincideBusqueda;
    });
  }, [cursosIniciales, categoriaSel, subcategoriaSel, busqueda]);

  const tieneFiltrosActivos = busqueda !== "" || categoriaSel !== "" || subcategoriaSel !== "";

  const limpiarFiltros = () => {
    setBusqueda(""); setCategoriaSel(""); setSubcategoriaSel("");
  };

  // Scrollbar elegante para el panel izquierdo
  const scrollbarClasses = "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 transition-colors";

  return (
    <>
      <div className="relative w-full bg-slate-50 border-t border-slate-200">
        <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto">
          
          {/* --- VISTA MÓVIL COMPACTA --- */}
          <div className="lg:hidden px-3 py-2 border-b border-slate-200 bg-white/95 backdrop-blur-md shrink-0 sticky top-[65px] z-20 shadow-sm flex flex-col gap-2">
            <Buscador busqueda={busqueda} setBusqueda={setBusqueda} totalResultados={cursosFiltrados.length} />
            <div className="w-full">
              <FiltrosMovil 
                categorias={categoriasIniciales} 
                subcategorias={subcategoriasIniciales} 
                categoriaSel={categoriaSel} 
                setCategoriaSel={setCategoriaSel} 
                subcategoriaSel={subcategoriaSel} 
                setSubcategoriaSel={setSubcategoriaSel} 
              />
            </div>
          </div>

          {/* --- PANEL IZQUIERDO: SIDEBAR FIJO --- */}
          <div className="hidden lg:flex flex-col w-[300px] shrink-0 border-r border-slate-200 bg-white/60 backdrop-blur-xl sticky top-[65px] h-[calc(100vh-65px)] z-20">
            
            {/* 🚀 NUEVA UBICACIÓN DEL BUSCADOR: Reemplaza al título de "Filtrar por Área" */}
            <div className="p-4 sm:px-6 py-5 border-b border-slate-200 shrink-0">
              <Buscador busqueda={busqueda} setBusqueda={setBusqueda} totalResultados={cursosFiltrados.length} />
            </div>

            <div className={`flex-1 overflow-y-auto overflow-x-hidden p-6 ${scrollbarClasses}`}>
              <Sidebar 
                categorias={categoriasIniciales} 
                subcategorias={subcategoriasIniciales} 
                categoriaSel={categoriaSel} 
                setCategoriaSel={setCategoriaSel} 
                subcategoriaSel={subcategoriaSel} 
                setSubcategoriaSel={setSubcategoriaSel} 
              />
            </div>
          </div>

          {/* --- PANEL DERECHO: GRID LÍMPIO --- */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* 🚀 ELIMINADO EL BUSCADOR SUPERIOR PEGAJOSO */}

            {/* Grilla de tarjetas maximizando el espacio. Le di un poco más de padding superior (py-6) para que respire */}
            <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 relative">
              <Grid 
                cursos={cursosFiltrados} 
                busquedaActual={busqueda} 
                tieneFiltros={tieneFiltrosActivos} 
                onLimpiarFiltros={limpiarFiltros} 
              />
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}