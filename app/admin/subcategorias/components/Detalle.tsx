import { ArrowLeft, Calendar, Layers, BookOpen } from "lucide-react";
import { SubcategoriaConRelaciones } from "../types";

interface Props {
  subcategoria: SubcategoriaConRelaciones;
  onVolver: () => void;
}

export default function Detalle({ subcategoria, onVolver }: Props) {
  const cursos = subcategoria.cursos || [];

  return (
    <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {subcategoria.nombre}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Categoría:{" "}
              <span className="font-medium text-slate-600">
                {subcategoria.categoria?.nombre ?? "Sin categoría"}
              </span>
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                {subcategoria.createdAt
                  ? new Date(subcategoria.createdAt).toLocaleDateString()
                  : "—"}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} className="text-slate-400" />
                {cursos.length} cursos
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {cursos.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">
              Cursos asociados
            </h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              {cursos.map((curso) => (
                <li key={curso.id}>{curso.titulo}</li>
              ))}
            </ul>
          </div>
        )}
        {cursos.length === 0 && (
          <p className="text-slate-400 text-sm">No hay cursos asociados.</p>
        )}
      </div>

      <div className="border-t border-slate-200 px-6 py-4">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>
      </div>
    </div>
  );
}