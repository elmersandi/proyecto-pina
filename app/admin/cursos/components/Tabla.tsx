import { Edit2, Trash2, Eye, BookOpen } from "lucide-react";
import { CursoConRelaciones } from "../../cursos/types";

interface Props {
  cursos: CursoConRelaciones[];
  onVerDetalle: (curso: CursoConRelaciones) => void;
  onEditar: (curso: CursoConRelaciones) => void;
  onEliminar: (curso: CursoConRelaciones) => void;
}

export default function Tabla({ cursos, onVerDetalle, onEditar, onEliminar }: Props) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-300">
            <tr>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Título</th>
              <th className="hidden md:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Categoría</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Gratis</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs">Precio</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Publicado</th>
              <th className="hidden sm:table-cell px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Ver</th>
              <th className="px-5 py-4 text-slate-400 font-semibold uppercase text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cursos.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center mb-4">
                      <BookOpen size={28} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No se encontraron cursos</p>
                    <p className="text-xs text-slate-400 mt-1">Ajusta los filtros o crea uno nuevo.</p>
                  </div>
                </td>
              </tr>
            )}
            {cursos.map((curso) => (
              <tr key={curso.id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-4 font-semibold text-slate-800 truncate max-w-[200px]">
                  {curso.titulo}
                </td>
                <td className="hidden md:table-cell px-5 py-4 text-slate-700 font-medium">
                  {curso.categoria?.nombre ?? "—"}
                </td>
                <td className="hidden sm:table-cell px-5 py-4">
                  {curso.esGratis ? (
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Sí
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200">
                      No
                    </span>
                  )}
                </td>
                <td className="hidden sm:table-cell px-5 py-4">
                  {curso.esGratis ? (
                    <span className="text-slate-400">—</span>
                  ) : (
                    <span className="font-bold text-slate-700">
                      S/ {curso.precio?.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="hidden sm:table-cell px-5 py-4 text-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      curso.publicado ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </td>
                <td className="hidden sm:table-cell px-5 py-4 text-center">
                  <button
                    onClick={() => onVerDetalle(curso)}
                    className="p-1.5 text-slate-400 hover:text-orange-600 transition cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center gap-1.5">
                    <button
                      onClick={() => onVerDetalle(curso)}
                      className="sm:hidden p-1.5 text-orange-600 hover:text-orange-700 cursor-pointer"
                      title="Ver"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEditar(curso)}
                      className="p-1.5 text-slate-400 hover:text-orange-600 transition cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onEliminar(curso)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer"
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