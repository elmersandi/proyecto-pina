import { obtenerCursos } from "@/actions/curso.action";
import { obtenerCategorias } from "@/actions/categoria.action";
import { CursoConRelaciones } from "./types";
import ClienteCursos from "./components/ClienteCursos";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// 1. Definimos la estructura estricta que esperamos de la base de datos
interface CategoriaResponse {
  id: string;
  nombre: string;
  subcategorias?: {
    id: string;
    nombre: string;
  }[];
}

export default async function CursosPage() {
  const [resCursos, resCats] = await Promise.all([
    obtenerCursos(),
    obtenerCategorias(),
  ]);

  const cursos: CursoConRelaciones[] = resCursos.success
    ? resCursos.data ?? []
    : [];

  // 2. Tipamos resCats.data como CategoriaResponse[] y mapeamos limpiamente (cero any)
  const categorias = resCats.success
    ? (resCats.data as CategoriaResponse[])?.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        subcategorias: c.subcategorias ?? [],
      })) ?? []
    : [];

  return (
    <ClienteCursos
      cursosIniciales={cursos}
      categorias={categorias}
    />
  );
}