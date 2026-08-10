import { ArrowLeft, Calendar, Layers, BookOpen } from "lucide-react";
import { CategoriaConRelaciones } from "../types";

interface Props {
  categoria: CategoriaConRelaciones;
  onVolver: () => void;
}

export default function Detalle({ categoria, onVolver }: Props) {
  const subcategorias = categoria.subcategorias || [];
  const cursos = categoria.cursos || [];

  return (
    <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">{categoria.nombre}</h2>
            <p className="text-slate-400 text-sm mt-1">
              {categoria.descripcion || "Sin descripción"}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                {categoria.createdAt &&
                  new Date(categoria.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Layers size={14} className="text-slate-400" />
                {subcategorias.length} subcategorías
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} className="text-slate-400" />
                {cursos.length} cursos directos
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {subcategorias.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Subcategorías</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subcategorias.map((sub) => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center p-3 border border-slate-200 rounded-lg"
                >
                  <span className="font-semibold text-slate-700">{sub.nombre}</span>
                  <span className="text-xs text-slate-400">
                    {sub._count?.cursos ?? 0} cursos
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {cursos.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Cursos directos (sin subcategoría)</h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              {cursos.map((curso) => (
                <li key={curso.id}>{curso.titulo}</li>
              ))}
            </ul>
          </div>
        )}
        {subcategorias.length === 0 && cursos.length === 0 && (
          <p className="text-slate-400 text-sm">No hay subcategorías ni cursos asociados.</p>
        )}
      </div>

      <div className="border-t border-slate-200 px-6 py-4">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>
      </div>
    </div>
  );
}