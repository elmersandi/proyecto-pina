"use client";

import { Search, X } from 'lucide-react';

interface BuscadorProps {
  busqueda: string;
  setBusqueda: (val: string) => void;
  totalResultados: number;
}

export default function Buscador({ busqueda, setBusqueda, totalResultados }: BuscadorProps) {
  return (
    <div className="flex items-stretch gap-4 w-full">
      
      {/* CAJA DEL BUSCADOR (flex-1 para que empuje lo demás a la derecha) */}
      <div className="flex-1 bg-white py-2 px-4 rounded-xl border border-slate-200 flex items-center gap-2 transition-all focus-within:border-blue-950 focus-within:ring-1 focus-within:ring-blue-950 shadow-sm">
        <Search className="text-slate-400 shrink-0" size={16} />
        
        <input 
          type="text" 
          placeholder="Buscar cursos por título o descripción..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
          className="w-full text-sm text-slate-800 placeholder:text-slate-400 font-medium bg-transparent outline-none border-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none shadow-none" 
        />

        {/* BOTÓN "X" PARA LIMPIAR BÚSQUEDA */}
        {busqueda.length > 0 && (
          <button 
            onClick={() => setBusqueda("")}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-blue-950 transition-colors shrink-0 outline-none cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* CONTADOR DE RESULTADOS (mismo py-2 para igualar el alto vertical) */}
      <div className="flex items-center justify-center text-[11px] font-bold text-blue-950 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl shrink-0 uppercase tracking-widest shadow-sm">
        {totalResultados} {totalResultados === 1 ? 'Curso' : 'Cursos'}
      </div>
      
    </div>
  );
}