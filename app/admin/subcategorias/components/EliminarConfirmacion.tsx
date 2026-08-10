import { AlertTriangle } from "lucide-react";

interface Props {
  nombre: string;
  slug: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function EliminarConfirmacion({
  nombre,
  slug,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl border border-slate-300 p-6 text-center shadow-sm">
      <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-slate-800 mb-2">
        ¿Eliminar subcategoría?
      </h2>
      <p className="text-sm text-slate-500 mb-1">
        Se eliminará <strong className="text-slate-700">{nombre}</strong>
      </p>
      <p className="text-xs text-slate-400 font-mono mb-6">Slug: {slug}</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancelar}
          className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold cursor-pointer"
        >
          Sí, eliminar
        </button>
      </div>
    </div>
  );
}