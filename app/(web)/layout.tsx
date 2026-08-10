// app/(web)/layout.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { obtenerCategorias } from "@/actions/categoria.action";

// 1. Tipado estricto para las Subcategorías
interface Subcategoria {
  id: string;
  nombre: string;
}

// 2. Tipado exacto de lo que devuelve Prisma (la BD)
interface CategoriaBD {
  id: string;
  nombre: string;
  subcategorias?: Subcategoria[];
}

// 3. Tipado de lo que requiere el Navbar
interface Categoria {
  id: string;
  nombre: string;
  subcategorias: Subcategoria[];
}

export default async function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtenemos las categorías desde la BD
  const resCats = await obtenerCategorias();
  
  // Mapeo 100% tipado, sin un solo 'any'
  const categorias: Categoria[] = resCats.success && resCats.data
    ? (resCats.data as CategoriaBD[]).map((c) => ({
        id: c.id,
        nombre: c.nombre,
        subcategorias: c.subcategorias ?? [],
      }))
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Pasamos las categorías limpias al Navbar */}
      <Navbar categorias={categorias} />
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}