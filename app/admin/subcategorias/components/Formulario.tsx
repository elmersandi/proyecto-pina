"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  subcategoriaSchema,
  SubcategoriaFormData,
} from "@/lib/validations/subcategoria.schema";
import {
  crearSubcategoria,
  actualizarSubcategoria,
} from "@/actions/subcategoria.action";
import type { SubcategoriaConRelaciones, CategoriaOption } from "../types";

interface Props {
  modo: "crear" | "editar";
  subcategoria: SubcategoriaConRelaciones | null;
  categorias: CategoriaOption[];
  onGuardado: () => void;
  onCancelar: () => void;
}

export default function Formulario({
  modo,
  subcategoria,
  categorias,
  onGuardado,
  onCancelar,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SubcategoriaFormData>({
    resolver: zodResolver(subcategoriaSchema),
    defaultValues: {
      nombre: subcategoria?.nombre || "",
      slug: subcategoria?.slug || "",
      categoriaId: subcategoria?.categoriaId || "",
    },
  });

  useEffect(() => {
    reset({
      nombre: subcategoria?.nombre || "",
      slug: subcategoria?.slug || "",
      categoriaId: subcategoria?.categoriaId || "",
    });
  }, [subcategoria, reset]);

  const onSubmit = async (data: SubcategoriaFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("slug", data.slug);
    formData.append("categoriaId", data.categoriaId);

    try {
      const res =
        modo === "crear"
          ? await crearSubcategoria(formData)
          : await actualizarSubcategoria(subcategoria!.id, formData);

      if (res.success) {
        toast.success(
          modo === "crear"
            ? "Subcategoría creada"
            : "Subcategoría actualizada"
        );
        onGuardado();
      } else {
        toast.error(res.error || "Error inesperado");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-slate-300 p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-slate-800">
        {modo === "crear" ? "Nueva subcategoría" : "Editar subcategoría"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Nombre
          </label>
          <input
            {...register("nombre")}
            onChange={(e) => {
              register("nombre").onChange(e);
              setValue(
                "slug",
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nombre.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Slug
          </label>
          <input
            {...register("slug")}
            onChange={(e) => {
              e.target.value = e.target.value
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              register("slug").onChange(e);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          {errors.slug && (
            <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Categoría padre
          </label>
          <select
            {...register("categoriaId")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 focus:ring-1 focus:ring-orange-500 outline-none cursor-pointer"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.categoriaId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categoriaId.message}
            </p>
          )}
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
          <span
            className={`inline-flex ${
              isSubmitting ? "opacity-100" : "opacity-0"
            } transition-opacity`}
          >
            <Loader2 size={16} className="animate-spin" />
          </span>
          {modo === "crear" ? "Crear subcategoría" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}