import { Edit2, Trash2, Eye, Layers } from "lucide-react";
import { CategoriaConRelaciones } from "../types";

interface Props {
  categorias: CategoriaConRelaciones[];
  onVerDetalle: (cat: CategoriaConRelaciones) => void;
  onEditar: (cat: CategoriaConRelaciones) => void;
  onEliminar: (cat: CategoriaConRelaciones) => void;
}

export default function Tabla({ categorias, onVerDetalle, onEditar, onEliminar }: Props) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-300">
            <tr>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Nombre</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Slug</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Subcategorías</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Cursos</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Ver</th>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categorias.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center mb-4">
                      <Layers size={28} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No se encontraron categorías</p>
                    <p className="text-xs text-slate-400 mt-1">Ajusta la búsqueda o crea una nueva.</p>
                  </div>
                </td>
              </tr>
            )}
            {categorias.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-4 font-semibold text-slate-800 truncate max-w-[200px]">
                  {cat.nombre}
                </td>
                <td className="hidden md:table-cell px-5 py-4 font-mono text-xs text-slate-500">
                  {cat.slug}
                </td>
                <td className="hidden sm:table-cell px-5 py-4 text-center font-bold text-slate-700">
                  {cat._count?.subcategorias ?? 0}
                </td>
                <td className="hidden sm:table-cell px-5 py-4 text-center font-bold text-slate-700">
                  {cat._count?.cursos ?? 0}
                </td>
                <td className="hidden sm:table-cell px-5 py-4 text-center">
                  <button
                    onClick={() => onVerDetalle(cat)}
                    className="p-1.5 text-slate-400 hover:text-orange-600 transition"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center gap-1.5">
                    <button
                      onClick={() => onVerDetalle(cat)}
                      className="sm:hidden p-1.5 text-orange-600 hover:text-orange-700"
                      title="Ver"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEditar(cat)}
                      className="p-1.5 text-slate-400 hover:text-orange-600 transition"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onEliminar(cat)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}