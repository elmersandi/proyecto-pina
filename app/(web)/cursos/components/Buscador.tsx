"use client";

import { Search, X } from 'lucide-react';

interface BuscadorProps {
  busqueda: string;
  setBusqueda: (val: string) => void;
  totalResultados: number; // Lo mantenemos en la interfaz por si se usa en la versión de escritorio
}

export default function Buscador({ busqueda, setBusqueda }: BuscadorProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-stretch w-full">
        
        {/* CAJA DEL BUSCADOR MÁS DELGADA */}
        <div className="flex-1 bg-white py-1.5 px-3 rounded-lg border border-slate-200 flex items-center gap-2 transition-all focus-within:border-blue-950 focus-within:ring-1 focus-within:ring-blue-950 shadow-sm">
          <Search className="text-slate-400 shrink-0" size={14} />
          
          <input 
            type="text" 
            placeholder="Buscar cursos..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            className="w-full text-xs text-slate-800 placeholder:text-slate-400 font-medium bg-transparent outline-none border-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none shadow-none" 
          />

          {/* BOTÓN "X" PARA LIMPIAR BÚSQUEDA */}
          {busqueda.length > 0 && (
            <button 
              onClick={() => setBusqueda("")}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-blue-950 transition-colors shrink-0 outline-none cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}