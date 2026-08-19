import { obtenerCategorias } from "@/actions/categoria.action";
import { CategoriaConRelaciones } from "./types";
import ClienteCategorias from "./components/ClienteCategorias";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function CategoriasPage() {
  const res = await obtenerCategorias();
  const categorias: CategoriaConRelaciones[] = res.success ? res.data ?? [] : [];

  return <ClienteCategorias categoriasIniciales={categorias} />;
}