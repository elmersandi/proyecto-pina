"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // <-- IMPORTANTE: Importamos el router
import { categoriaSchema, CategoriaFormData } from "@/lib/validations/categoria.schema";
import { crearCategoria, actualizarCategoria } from "@/actions/categoria.action";
import type { CategoriaConRelaciones } from "../types";

interface Props {
  modo: "crear" | "editar";
  categoria: CategoriaConRelaciones | null;
  onGuardado: () => void;
  onCancelar: () => void;
}

// Función maestra para generar slugs limpios sin perder las vocales con tilde
const generarSlugLimpio = (texto: string) => {
  return texto
    .normalize("NFD") // Separa la letra de la tilde (ej: 'á' -> 'a' + '´')
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos huérfanos
    .toLowerCase()
    .replace(/\s+/g, "-") // Cambia espacios por guiones
    .replace(/[^a-z0-9-]/g, ""); // Borra cualquier otro símbolo extraño
};

export default function Formulario({ modo, categoria, onGuardado, onCancelar }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // <-- IMPORTANTE: Inicializamos el router aquí

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: categoria?.nombre || "",
      slug: categoria?.slug || "",
      descripcion: categoria?.descripcion || "",
    },
  });

  // Reiniciar el formulario si cambia el modo o la categoría seleccionada
  useEffect(() => {
    reset({
      nombre: categoria?.nombre || "",
      slug: categoria?.slug || "",
      descripcion: categoria?.descripcion || "",
    });
  }, [categoria, reset]);

  const onSubmit = async (data: CategoriaFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("slug", data.slug);
    if (data.descripcion) formData.append("descripcion", data.descripcion);

    try {
      const res =
        modo === "crear"
          ? await crearCategoria(formData)
          : await actualizarCategoria(categoria!.id, formData);

      if (res.success) {
        toast.success(
          modo === "crear" ? "Categoría creada" : "Categoría actualizada"
        );
        
        // 🔥 LA SOLUCIÓN DEFINITIVA A LA CACHÉ DEL NAVEGADOR 🔥
        router.refresh(); // Forza al navegador a pedir los datos frescos a la BD
        reset();          // Limpia los campos del formulario
        onGuardado();     // Ejecuta la función para cerrar el modal o volver
        
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
        {modo === "crear" ? "Nueva categoría" : "Editar categoría"}
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
              setValue("slug", generarSlugLimpio(e.target.value));
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Slug
          </label>
          <input
            {...register("slug")}
            onChange={(e) => {
              e.target.value = generarSlugLimpio(e.target.value);
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
            Descripción
          </label>
          <textarea
            {...register("descripcion")}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:ring-1 focus:ring-orange-500 outline-none"
            placeholder="Opcional"
          />
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
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition flex items-center gap-2 cursor-pointer shadow-sm"
        >
          {/* Siempre reservamos el espacio del loader, solo cambiamos opacidad */}
          <span className={`inline-flex ${isSubmitting ? 'opacity-100 w-4 mr-1' : 'opacity-0 w-0'} transition-all overflow-hidden`}>
            <Loader2 size={16} className="animate-spin" />
          </span>
          {modo === "crear" ? "Crear categoría" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}