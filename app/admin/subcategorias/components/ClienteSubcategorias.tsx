"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { SubcategoriaConRelaciones, CategoriaOption } from "../types";
import { eliminarSubcategoria } from "@/actions/subcategoria.action";
import Filtros from "./Filtros";
import Tabla from "./Tabla";
import Formulario from "./Formulario";
import Detalle from "./Detalle";
import EliminarConfirmacion from "./EliminarConfirmacion";

type Vista = "lista" | "formulario" | "detalle" | "eliminar";

interface Props {
  subcategoriasIniciales: SubcategoriaConRelaciones[];
  categorias: CategoriaOption[];
}

export default function ClienteSubcategorias({
  subcategoriasIniciales,
  categorias,
}: Props) {
  const router = useRouter();
  const [vista, setVista] = useState<Vista>("lista");
  const [modo, setModo] = useState<"crear" | "editar">("crear");
  const [seleccionada, setSeleccionada] =
    useState<SubcategoriaConRelaciones | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODOS");
  const [limite, setLimite] = useState(15);

  const subcategoriasFiltradas = useMemo(() => {
    return subcategoriasIniciales.filter((sub) => {
      const matchTexto =
        sub.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        sub.slug.toLowerCase().includes(busqueda.toLowerCase());
      const matchCat =
        filtroCategoria === "TODOS" || sub.categoriaId === filtroCategoria;
      return matchTexto && matchCat;
    });
  }, [subcategoriasIniciales, busqueda, filtroCategoria]);

  const subcategoriasVisibles = useMemo(
    () => subcategoriasFiltradas.slice(0, limite),
    [subcategoriasFiltradas, limite]
  );

  const volverALista = useCallback(() => {
    setVista("lista");
    setSeleccionada(null);
    router.refresh();
  }, [router]);

  const handleEliminar = async () => {
    if (!seleccionada) return;
    const res = await eliminarSubcategoria(seleccionada.id);
    if (res.success) {
      toast.success("Subcategoría eliminada");
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
            <h1 className="text-2xl font-bold text-slate-800">Subcategorías</h1>
            <p className="text-slate-400 text-sm mt-1">
              Administra las subcategorías y sus cursos asociados.
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
              <Plus size={18} /> Nueva subcategoría
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
          <Filtros
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
            categorias={categorias}
          />
          <Tabla
            subcategorias={subcategoriasVisibles}
            onVerDetalle={(sub) => {
              setSeleccionada(sub);
              setVista("detalle");
            }}
            onEditar={(sub) => {
              setModo("editar");
              setSeleccionada(sub);
              setVista("formulario");
            }}
            onEliminar={(sub) => {
              setSeleccionada(sub);
              setVista("eliminar");
            }}
          />
          {subcategoriasFiltradas.length > limite && (
            <div className="flex justify-center">
              <button
                onClick={() => setLimite((prev) => prev + 15)}
                className="bg-white border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition cursor-pointer"
              >
                Ver más subcategorías…
              </button>
            </div>
          )}
        </>
      )}

      {vista === "formulario" && (
        <Formulario
          modo={modo}
          subcategoria={seleccionada}
          categorias={categorias}
          onGuardado={volverALista}
          onCancelar={volverALista}
        />
      )}

      {vista === "detalle" && seleccionada && (
        <Detalle subcategoria={seleccionada} onVolver={volverALista} />
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