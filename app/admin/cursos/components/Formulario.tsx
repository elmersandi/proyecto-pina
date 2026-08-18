"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Loader2, ChevronDown, X } from "lucide-react";
import { useRouter } from "next/navigation"; // <-- 1. Importamos el router
import { cursoSchema, CursoFormData } from "@/lib/validations/curso.schema";
import { crearCurso, actualizarCurso } from "@/actions/curso.action";
import type { CursoConRelaciones, CategoriaBasica } from "../../cursos/types";

// ─── Tipos locales ───
interface SubcategoriaBasica {
  id: string;
  nombre: string;
}

interface CategoriaConSubcategorias extends CategoriaBasica {
  subcategorias?: SubcategoriaBasica[];
}

interface Props {
  modo: "crear" | "editar";
  curso: CursoConRelaciones | null;
  categorias: CategoriaConSubcategorias[];
  onGuardado: () => void;
  onCancelar: () => void;
}

// ─── Dropdown genérico (reutilizable) ───
function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="w-full flex items-center justify-between bg-white border border-slate-300 text-sm font-semibold text-slate-700 py-2 px-3.5 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} className={`transition ${open ? "rotate-180 text-orange-500" : "text-slate-400"}`} />
      </button>
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                value === opt.value ? "bg-orange-50 text-orange-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Formulario({ modo, curso, categorias, onGuardado, onCancelar }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // <-- 2. Inicializamos el router aquí
  
  // Estados para los archivos y previsualizaciones
  const [portadaPreview, setPortadaPreview] = useState<string | null>(curso?.portadaUrl || null);
  const [portadaFileName, setPortadaFileName] = useState<string | null>(
    curso?.portadaUrl ? curso.portadaUrl.split("/").pop() || "Imagen actual" : null
  );
  
  const [pdfFileName, setPdfFileName] = useState<string | null>(
    curso?.pdfUrl ? curso.pdfUrl.split("/").pop() || "PDF actual" : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CursoFormData>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      titulo: curso?.titulo || "",
      slug: curso?.slug || "",
      descripcionCorta: curso?.descripcionCorta || "",
      descripcion: curso?.descripcion || "",
      esGratis: curso?.esGratis ?? true,
      precio: curso?.precio ?? undefined,
      publicado: curso?.publicado ?? false,
      categoriaId: curso?.categoriaId || "",
      subcategoriaId: curso?.subcategoriaId || "",
      portada: undefined,
      pdf: undefined,
    },
  });

  const esGratis = watch("esGratis");
  const categoriaSeleccionadaId = watch("categoriaId");

  const categoriaSeleccionada = categorias.find((cat) => cat.id === categoriaSeleccionadaId);
  const subcategoriasFiltradas: SubcategoriaBasica[] = categoriaSeleccionada?.subcategorias || [];

  useEffect(() => {
    if (categoriaSeleccionadaId !== curso?.categoriaId) {
      setValue("subcategoriaId", "");
    }
  }, [categoriaSeleccionadaId, setValue, curso]);

  useEffect(() => {
    reset({
      titulo: curso?.titulo || "",
      slug: curso?.slug || "",
      descripcionCorta: curso?.descripcionCorta || "",
      descripcion: curso?.descripcion || "",
      esGratis: curso?.esGratis ?? true,
      precio: curso?.precio ?? undefined,
      publicado: curso?.publicado ?? false,
      categoriaId: curso?.categoriaId || "",
      subcategoriaId: curso?.subcategoriaId || "",
      portada: undefined,
      pdf: undefined,
    });
    setPortadaPreview(curso?.portadaUrl || null);
    setPortadaFileName(curso?.portadaUrl ? curso.portadaUrl.split("/").pop() || "Imagen actual" : null);
    setPdfFileName(curso?.pdfUrl ? curso.pdfUrl.split("/").pop() || "PDF actual" : null);
  }, [curso, reset]);

  const onSubmit = async (data: CursoFormData) => {
    // Validaciones estrictas manuales
    if (modo === "crear") {
      if (!data.portada || data.portada.length === 0) {
        toast.error("La portada es obligatoria para crear un curso");
        return;
      }
      if (!data.pdf || data.pdf.length === 0) {
        toast.error("El archivo PDF es obligatorio para crear un curso");
        return;
      }
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("titulo", data.titulo);
    formData.append("slug", data.slug);
    formData.append("descripcionCorta", data.descripcionCorta);
    formData.append("descripcion", data.descripcion);
    formData.append("esGratis", String(data.esGratis));
    formData.append("publicado", String(data.publicado));
    formData.append("categoriaId", data.categoriaId);
    if (data.subcategoriaId) formData.append("subcategoriaId", data.subcategoriaId);
    if (!data.esGratis && data.precio != null) formData.append("precio", String(data.precio));

    if (data.portada && data.portada.length > 0) {
      formData.append("portada", data.portada[0]);
    }
    if (data.pdf && data.pdf.length > 0) {
      formData.append("pdf", data.pdf[0]);
    }

    try {
      const res = modo === "crear"
        ? await crearCurso(formData)
        : await actualizarCurso(curso!.id, formData);

      if (res.success) {
        toast.success(modo === "crear" ? "Se creó correctamente el curso" : "Se actualizó correctamente el curso");
        
        // 🔥 3. LA MAGIA: Forzamos al cliente a refrescar los datos para evitar que "retroceda" 🔥
        router.refresh(); 
        reset();
        onGuardado();
      } else {
        toast.error(res.error || "Error inesperado");
      }
    } catch (err) {
      toast.error("Error de conexión");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generarSlug = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // Funciones para limpiar los inputs de archivo
  const limpiarPortada = () => {
    setPortadaPreview(null);
    setPortadaFileName(null);
    setValue("portada", undefined);
  };

  const limpiarPdf = () => {
    setPdfFileName(null);
    setValue("pdf", undefined);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-300 p-6 space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">
        {modo === "crear" ? "Nuevo curso" : "Editar curso"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Título *</label>
          <input
            {...register("titulo")}
            onChange={(e) => {
              register("titulo").onChange(e);
              setValue("slug", generarSlug(e.target.value));
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Slug *</label>
          <input
            {...register("slug")}
            onChange={(e) => {
              const limpio = generarSlug(e.target.value);
              e.target.value = limpio;
              register("slug").onChange(e);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        {/* Descripción corta */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción corta *</label>
          <input
            {...register("descripcionCorta")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-orange-500 outline-none"
            placeholder="Máx. 160 caracteres"
          />
          {errors.descripcionCorta && <p className="text-red-500 text-xs mt-1">{errors.descripcionCorta.message}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Categoría *</label>
          <CustomDropdown
            value={categoriaSeleccionadaId || ""}
            onChange={(val) => setValue("categoriaId", val)}
            options={categorias.map((cat) => ({ value: cat.id, label: cat.nombre }))}
            placeholder="Seleccionar"
          />
          <input type="hidden" {...register("categoriaId")} />
          {errors.categoriaId && <p className="text-red-500 text-xs mt-1">{errors.categoriaId.message}</p>}
        </div>

        {/* Subcategoría */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Subcategoría (opcional)</label>
          <CustomDropdown
            value={watch("subcategoriaId") || ""}
            onChange={(val) => setValue("subcategoriaId", val)}
            options={subcategoriasFiltradas.map((sub) => ({ value: sub.id, label: sub.nombre }))}
            placeholder={
              !categoriaSeleccionadaId
                ? "Primero elige una categoría"
                : subcategoriasFiltradas.length === 0
                ? "Sin subcategorías"
                : "Seleccionar subcategoría"
            }
            disabled={!categoriaSeleccionadaId || subcategoriasFiltradas.length === 0}
          />
          <input type="hidden" {...register("subcategoriaId")} />
        </div>

        {/* Descripción completa */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción completa *</label>
          <textarea
            {...register("descripcion")}
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
        </div>

        {/* ─── ZONA DE ARCHIVOS REDISEÑADA ─── */}
        
        {/* Portada */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">
            Portada {modo === "crear" ? "*" : "(opcional)"}
          </label>
          <div className="flex items-start gap-3">
            {/* Botón Personalizado */}
            <div className="flex flex-col items-start gap-1">
              <label className="cursor-pointer text-orange-600 hover:text-orange-700 font-semibold text-sm underline decoration-2 underline-offset-4 transition">
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                  className="hidden" // <-- Ocultamos el input feo
                  {...register("portada")}
                  onChange={(e) => {
                    register("portada").onChange(e);
                    const file = e.target.files?.[0];
                    if (file) {
                      setPortadaPreview(URL.createObjectURL(file));
                      setPortadaFileName(file.name);
                    } else {
                      limpiarPortada();
                    }
                  }}
                />
              </label>
              {/* Nombre del archivo abajo */}
              {portadaFileName && (
                <span className="text-xs text-slate-500 max-w-[150px] truncate" title={portadaFileName}>
                  {portadaFileName}
                </span>
              )}
            </div>
            
            {/* Previsualización pegada */}
            {portadaPreview && (
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                <img src={portadaPreview} alt="Vista previa" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={limpiarPortada}
                  className="absolute top-0 right-0 bg-red-500/90 hover:bg-red-600 text-white p-0.5 rounded-bl-lg transition cursor-pointer"
                  title="Quitar imagen"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
          {errors.portada && <p className="text-red-500 text-xs">{errors.portada.message}</p>}
        </div>

        {/* PDF */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">
            PDF {modo === "crear" ? "*" : "(dejar vacío para no cambiar)"}
          </label>
          <div className="flex flex-col items-start gap-1">
            <label className="cursor-pointer text-orange-600 hover:text-orange-700 font-semibold text-sm underline decoration-2 underline-offset-4 transition">
              Seleccionar archivo
              <input
                type="file"
                accept="application/pdf"
                className="hidden" // <-- Ocultamos el input feo
                {...register("pdf")}
                onChange={(e) => {
                  register("pdf").onChange(e);
                  const file = e.target.files?.[0];
                  if (file) setPdfFileName(file.name);
                  else limpiarPdf();
                }}
              />
            </label>
            {/* Nombre del archivo PDF con botón de quitar */}
            {pdfFileName && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 max-w-[200px] truncate" title={pdfFileName}>
                  {pdfFileName}
                </span>
                <button
                  type="button"
                  onClick={limpiarPdf}
                  className="text-red-500 hover:text-red-700 cursor-pointer transition"
                  title="Quitar archivo"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          {errors.pdf && <p className="text-red-500 text-xs">{errors.pdf.message}</p>}
        </div>

        {/* ─── FIN ZONA DE ARCHIVOS ─── */}

        {/* Es gratis + precio */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("esGratis")} className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
            <span className="text-sm font-semibold text-slate-700">Es gratis</span>
          </label>
          {!esGratis && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Precio (S/)</label>
              <input
                type="number"
                step="0.01"
                {...register("precio", {
                  setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : parseFloat(v)),
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="0.00"
              />
              {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>}
            </div>
          )}
        </div>

        {/* Publicado */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("publicado")}
            className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
          />
          <label className="text-sm font-semibold text-slate-700 cursor-pointer">Publicado</label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancelar}
          disabled={isSubmitting}
          className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition flex items-center gap-2 cursor-pointer"
        >
          <span className={`inline-flex ${isSubmitting ? "opacity-100" : "opacity-0"} transition-opacity`}>
            <Loader2 size={16} className="animate-spin" />
          </span>
          {modo === "crear" ? "Crear curso" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}