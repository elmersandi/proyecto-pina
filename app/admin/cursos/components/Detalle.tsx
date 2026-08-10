import Image from "next/image";
import { ArrowLeft, Calendar, Tag, FileText, Download } from "lucide-react";
import { CursoConRelaciones } from "../../cursos/types";

interface Props {
  curso: CursoConRelaciones;
  onVolver: () => void;
}

export default function Detalle({ curso, onVolver }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row gap-6">
          {curso.portadaUrl && (
            <div className="relative w-full lg:w-64 h-48 rounded-lg overflow-hidden shrink-0">
              <Image
                src={curso.portadaUrl}
                alt={curso.titulo}
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-800">{curso.titulo}</h2>
            <p className="text-slate-500 text-sm mt-1">{curso.descripcionCorta}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                Creado: {curso.createdAt ? new Date(curso.createdAt).toLocaleDateString() : "—"}
              </p>
              <p className="flex items-center gap-2">
                <Tag size={14} className="text-slate-400" />
                Categoría: {curso.categoria?.nombre} {curso.subcategoria ? `/ ${curso.subcategoria.nombre}` : ""}
              </p>
              <p className="flex items-center gap-2">
                <Tag size={14} className="text-slate-400" />
                {curso.esGratis ? "Gratuito" : `S/ ${curso.precio?.toFixed(2)}`}
              </p>
              <p className="flex items-center gap-2">
                <Tag size={14} className="text-slate-400" />
                {curso.publicado ? "Publicado" : "No publicado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">Descripción completa</h3>
          <div className="prose prose-sm max-w-none text-slate-600">{curso.descripcion}</div>
        </div>

        {curso.pdfUrl && (
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">PDF del curso</h3>
            <a
              href={curso.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
            >
              <FileText size={16} />
              Ver PDF
              <Download size={16} />
            </a>
          </div>
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