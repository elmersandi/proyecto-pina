"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation"; // <-- 1. Importamos el router
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

// 1. Función maestra para generar slugs limpios (Convierte "Matemática" en "matematica")
const generarSlugLimpio = (texto: string) => {
  return texto
    .normalize("NFD") // Separa las letras de sus tildes (e.g., 'á' -> 'a' + '´')
    .replace(/[\u0300-\u036f]/g, "") // Borra los acentos huérfanos
    .toLowerCase()
    .replace(/\s+/g, "-") // Cambia espacios por guiones
    .replace(/[^a-z0-9-]/g, ""); // Borra cualquier otro símbolo raro
};

export default function Formulario({
  modo,
  subcategoria,
  categorias,
  onGuardado,
  onCancelar,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // <-- 2. Inicializamos el router aquí

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<SubcategoriaFormData>({
    resolver: zodResolver(subcategoriaSchema),
    defaultValues: {
      nombre: subcategoria?.nombre || "",
      slug: subcategoria?.slug || "",
      categoriaId: subcategoria?.categoriaId || "",
    },
  });

  // Observamos el valor actual para nuestro Dropdown personalizado
  const categoriaSeleccionadaId = watch("categoriaId");
  const categoriaSeleccionada = categorias.find(
    (c) => c.id === categoriaSeleccionadaId
  );

  useEffect(() => {
    reset({
      nombre: subcategoria?.nombre || "",
      slug: subcategoria?.slug || "",
      categoriaId: subcategoria?.categoriaId || "",
    });
  }, [subcategoria, reset]);

  // 2. Efecto para cerrar el Dropdown si hacemos clic afuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        
        // 🔥 3. LA MAGIA: Forzamos al cliente a refrescar los datos 🔥
        router.refresh(); 
        reset();
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
        {/* --- CAMPO NOMBRE --- */}
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
            <p className="text-red-500 text-xs mt-1">
              {errors.nombre.message}
            </p>
          )}
        </div>

        {/* --- CAMPO SLUG --- */}
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

        {/* --- DROPDOWN PERSONALIZADO --- */}
        <div className="md:col-span-2" ref={dropdownRef}>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Categoría padre
          </label>
          
          <div className="relative">
            {/* El botón que simula el select */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full px-3 py-2 border rounded-lg bg-white text-sm font-semibold text-left flex items-center justify-between transition-colors ${
                isDropdownOpen ? "border-orange-500 ring-1 ring-orange-500" : "border-slate-300"
              } ${!categoriaSeleccionada ? "text-slate-400" : "text-slate-800"}`}
            >
              <span className="truncate">
                {categoriaSeleccionada ? categoriaSeleccionada.nombre : "Seleccionar categoría"}
              </span>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* La lista de opciones (Dropdown) */}
            {isDropdownOpen && (
              <ul className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
                <li
                  onClick={() => {
                    setValue("categoriaId", "", { shouldValidate: true });
                    setIsDropdownOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  Seleccionar categoría
                </li>
                {categorias.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => {
                      setValue("categoriaId", cat.id, { shouldValidate: true });
                      setIsDropdownOpen(false);
                    }}
                    className={`px-3 py-2 text-sm font-semibold cursor-pointer transition-colors ${
                      categoriaSeleccionadaId === cat.id
                        ? "bg-orange-50 text-orange-700"
                        : "text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                    }`}
                  >
                    {cat.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {errors.categoriaId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categoriaId.message}
            </p>
          )}
        </div>
      </div>

      {/* --- BOTONES DE ACCIÓN --- */}
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
          <span
            className={`inline-flex ${
              isSubmitting ? "opacity-100 w-4 mr-1" : "opacity-0 w-0"
            } transition-all overflow-hidden`}
          >
            <Loader2 size={16} className="animate-spin" />
          </span>
          {modo === "crear" ? "Crear subcategoría" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}