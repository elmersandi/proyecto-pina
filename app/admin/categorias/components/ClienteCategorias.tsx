"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { CategoriaConRelaciones } from "../types";
import { eliminarCategoria } from "@/actions/categoria.action";
import Filtros from "./Filtros";
import Tabla from "./Tabla";
import Formulario from "./Formulario";
import Detalle from "./Detalle";
import EliminarConfirmacion from "./EliminarConfirmacion";

type Vista = "lista" | "formulario" | "detalle" | "eliminar";

interface Props {
  categoriasIniciales: CategoriaConRelaciones[];
}

export default function ClienteCategorias({ categoriasIniciales }: Props) {
  const router = useRouter();
  const [vista, setVista] = useState<Vista>("lista");
  const [modo, setModo] = useState<"crear" | "editar">("crear");
  const [seleccionada, setSeleccionada] = useState<CategoriaConRelaciones | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [limite, setLimite] = useState(15);

  // Filtrado solo por nombre o slug (ya no hay tipo)
  const categoriasFiltradas = useMemo(() => {
    return categoriasIniciales.filter((cat) => {
      const texto = busqueda.toLowerCase();
      return (
        cat.nombre.toLowerCase().includes(texto) ||
        cat.slug.toLowerCase().includes(texto)
      );
    });
  }, [categoriasIniciales, busqueda]);

  const categoriasVisibles = useMemo(
    () => categoriasFiltradas.slice(0, limite),
    [categoriasFiltradas, limite]
  );

  const volverALista = useCallback(() => {
    setVista("lista");
    setSeleccionada(null);
    router.refresh();
  }, [router]);

  const handleEliminar = async () => {
    if (!seleccionada) return;
    const res = await eliminarCategoria(seleccionada.id);
    if (res.success) {
      toast.success("Categoría eliminada");
      volverALista();
    } else {
      toast.error(res.error || "Error al eliminar");
    }
  };

  return (
    <div className="w-full space-y-6">
      {vista !== "eliminar" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Categorías</h1>
            <p className="text-slate-400 text-sm mt-1">
              Administra las categorías, subcategorías y cursos.
            </p>
          </div>
          {vista === "lista" && (
            <button
              onClick={() => {
                setModo("crear");
                setSeleccionada(null);
                setVista("formulario");
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <Plus size={18} /> Nueva categoría
            </button>
          )}
          {(vista === "formulario" || vista === "detalle") && (
            <button
              onClick={volverALista}
              className="text-slate-600 hover:text-slate-800 font-semibold text-sm cursor-pointer"
            >
              ← Volver al listado
            </button>
          )}
        </div>
      )}

      {vista === "lista" && (
        <>
          <Filtros busqueda={busqueda} setBusqueda={setBusqueda} />
          <Tabla
            categorias={categoriasVisibles}
            onVerDetalle={(cat) => {
              setSeleccionada(cat);
              setVista("detalle");
            }}
            onEditar={(cat) => {
              setModo("editar");
              setSeleccionada(cat);
              setVista("formulario");
            }}
            onEliminar={(cat) => {
              setSeleccionada(cat);
              setVista("eliminar");
            }}
          />
          {categoriasFiltradas.length > limite && (
            <div className="flex justify-center">
              <button
                onClick={() => setLimite((prev) => prev + 15)}
                className="bg-white border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition"
              >
                Ver más categorías…
              </button>
            </div>
          )}
        </>
      )}

      {vista === "formulario" && (
        <Formulario
          modo={modo}
          categoria={seleccionada}
          onGuardado={volverALista}
          onCancelar={volverALista}
        />
      )}

      {vista === "detalle" && seleccionada && (
        <Detalle categoria={seleccionada} onVolver={volverALista} />
      )}

      {vista === "eliminar" && seleccionada && (
        <EliminarConfirmacion
          nombre={seleccionada.nombre}
          slug={seleccionada.slug}
          onConfirmar={handleEliminar}
          onCancelar={volverALista}
        />
      )}
    </div>
  );
}