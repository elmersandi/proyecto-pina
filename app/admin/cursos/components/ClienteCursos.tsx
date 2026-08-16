"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { CursoConRelaciones, CategoriaBasica } from "../../cursos/types";
import { eliminarCurso } from "@/actions/curso.action";
import Filtros from "./Filtros";
import Tabla from "./Tabla";
import Formulario from "./Formulario";
import Detalle from "./Detalle";
import EliminarConfirmacion from "./EliminarConfirmacion";

type Vista = "lista" | "formulario" | "detalle" | "eliminar";

interface Props {
  cursosIniciales: CursoConRelaciones[];
  categorias: CategoriaBasica[];
}

export default function ClienteCursos({ cursosIniciales, categorias }: Props) {
  const router = useRouter();
  const [vista, setVista] = useState<Vista>("lista");
  const [modo, setModo] = useState<"crear" | "editar">("crear");
  const [seleccionado, setSeleccionado] = useState<CursoConRelaciones | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODOS");
  const [filtroPublicado, setFiltroPublicado] = useState<string>("TODOS");
  const [limite, setLimite] = useState(15);

  const cursosFiltrados = useMemo(() => {
    return cursosIniciales.filter((curso) => {
      const texto = busqueda.toLowerCase();
      const matchTexto =
        curso.titulo.toLowerCase().includes(texto) ||
        curso.slug.toLowerCase().includes(texto);
      const matchCat =
        filtroCategoria === "TODOS" || curso.categoriaId === filtroCategoria;
      const matchPub =
        filtroPublicado === "TODOS" ||
        (filtroPublicado === "true" ? curso.publicado : !curso.publicado);
      return matchTexto && matchCat && matchPub;
    });
  }, [cursosIniciales, busqueda, filtroCategoria, filtroPublicado]);

  const cursosVisibles = useMemo(() => cursosFiltrados.slice(0, limite), [cursosFiltrados, limite]);

  const volverALista = useCallback(() => {
    setVista("lista");
    setSeleccionado(null);
    router.refresh();
  }, [router]);

  const handleEliminar = async () => {
    if (!seleccionado) return;
    const res = await eliminarCurso(seleccionado.id);
    if (res.success) {
      // --- AQUÍ ESTÁ EL MENSAJE DE ELIMINAR ACTUALIZADO ---
      toast.success("Se eliminó correctamente el curso");
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
            <h1 className="text-2xl font-bold text-slate-800">Cursos</h1>
            <p className="text-slate-400 text-sm mt-1">
              Administra los cursos, sus detalles y archivos asociados.
            </p>
          </div>
          {vista === "lista" && (
            <button
              onClick={() => {
                setModo("crear");
                setSeleccionado(null);
                setVista("formulario");
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <Plus size={18} /> Nuevo curso
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
            filtroPublicado={filtroPublicado}
            setFiltroPublicado={setFiltroPublicado}
            categorias={categorias}
          />
          <Tabla
            cursos={cursosVisibles}
            onVerDetalle={(curso) => {
              setSeleccionado(curso);
              setVista("detalle");
            }}
            onEditar={(curso) => {
              setModo("editar");
              setSeleccionado(curso);
              setVista("formulario");
            }}
            onEliminar={(curso) => {
              setSeleccionado(curso);
              setVista("eliminar");
            }}
          />
          {cursosFiltrados.length > limite && (
            <div className="flex justify-center">
              <button
                onClick={() => setLimite((l) => l + 15)}
                className="bg-white border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition cursor-pointer"
              >
                Ver más cursos…
              </button>
            </div>
          )}
        </>
      )}

      {vista === "formulario" && (
        <Formulario
          modo={modo}
          curso={seleccionado}
          categorias={categorias}
          onGuardado={volverALista}
          onCancelar={volverALista}
        />
      )}

      {vista === "detalle" && seleccionado && (
        <Detalle curso={seleccionado} onVolver={volverALista} />
      )}

      {vista === "eliminar" && seleccionado && (
        <EliminarConfirmacion
          titulo={seleccionado.titulo}
          slug={seleccionado.slug}
          onConfirmar={handleEliminar}
          onCancelar={volverALista}
        />
      )}
    </div>
  );
}