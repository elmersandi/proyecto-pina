"use client";

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Categoria {
  id: string;
  nombre: string;
}

interface Subcategoria {
  id: string;
  nombre: string;
  categoriaId: string;
}

interface SidebarProps {
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  categoriaSel: string;
  setCategoriaSel: (id: string) => void;
  subcategoriaSel: string;
  setSubcategoriaSel: (id: string) => void;
}

export default function Sidebar({
  categorias,
  subcategorias,
  categoriaSel,
  setCategoriaSel,
  subcategoriaSel,
  setSubcategoriaSel
}: SidebarProps) {
  const [abiertas, setAbiertas] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();

  useEffect(() => {
    const catUrl = searchParams.get('categoria');
    const subUrl = searchParams.get('subcategoria');

    // Usamos setTimeout para pasar la actualización al siguiente "tick" de JavaScript.
    // Esto evita el error rojo de "Cascading renders" en React.
    const timer = setTimeout(() => {
      if (subUrl) {
        const subObj = subcategorias.find(s => s.id === subUrl);
        if (subObj) {
          setCategoriaSel(subObj.categoriaId);
          setSubcategoriaSel(subUrl);
          setAbiertas(prev => ({ ...prev, [subObj.categoriaId]: true }));
        }
      } else if (catUrl) {
        setCategoriaSel(catUrl);
        setSubcategoriaSel('');
        setAbiertas(prev => ({ ...prev, [catUrl]: true }));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams, subcategorias, setCategoriaSel, setSubcategoriaSel]);

  const toggleCategoria = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAbiertas(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div className="w-full">
      <div className="space-y-1.5 w-full">
        {/* Botón principal "Todas las Áreas" */}
        <button 
          onClick={() => { setCategoriaSel(''); setSubcategoriaSel(''); }} 
          className={`w-full text-left font-medium text-sm py-2.5 px-3 rounded-xl transition-colors cursor-pointer ${
            categoriaSel === '' 
              ? 'bg-blue-950 text-white shadow-md shadow-blue-950/20' 
              : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
          }`}
        >
          Todas las Áreas
        </button>

        {categorias.map(cat => {
          const estaActiva = categoriaSel === cat.id;
          const subcatsDeEsta = subcategorias.filter(sub => sub.categoriaId === cat.id);
          const estaExpandida = abiertas[cat.id];

          // Lógica de colores diferenciados
          const isOnlyCatSelected = estaActiva && subcategoriaSel === '';

          return (
            <div key={cat.id} className="space-y-1 w-full">
              {/* Botón de Categoría Individual */}
              <div 
                onClick={() => { setCategoriaSel(cat.id); setSubcategoriaSel(''); }}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-colors border ${
                  isOnlyCatSelected 
                    ? 'bg-blue-100 text-blue-950 font-semibold border-blue-200' 
                    : estaActiva
                      ? 'bg-slate-50 text-blue-950 font-medium border-slate-200' 
                      : 'border-transparent text-slate-600 hover:text-blue-950 hover:bg-slate-100'
                }`}
              >
                <span className="pr-2 text-sm line-clamp-2 leading-snug">{cat.nombre}</span>
                
                {subcatsDeEsta.length > 0 && (
                  <button 
                    onClick={(e) => toggleCategoria(cat.id, e)}
                    className={`p-1.5 rounded-lg hover:bg-slate-200/60 transition-transform duration-300 shrink-0 cursor-pointer ${
                      estaExpandida ? 'rotate-180 text-blue-950' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown size={14} />
                  </button>
                )}
              </div>

              {/* Acordeón de Subcategorías */}
              {estaExpandida && subcatsDeEsta.length > 0 && (
                <div className="pl-4 space-y-1 my-1 border-l-2 border-blue-100 ml-3 w-full">
                  {subcatsDeEsta.map(sub => {
                    const isSubSelected = subcategoriaSel === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => { setCategoriaSel(cat.id); setSubcategoriaSel(sub.id); }}
                        className={`w-full text-left text-xs py-2 px-2.5 rounded-lg transition-colors cursor-pointer line-clamp-2 leading-snug border ${
                          isSubSelected 
                            ? 'bg-blue-100 text-blue-950 font-semibold border-blue-200' 
                            : 'font-medium text-slate-500 border-transparent hover:text-blue-950 hover:bg-slate-100'
                        }`}
                      >
                        {sub.nombre}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}