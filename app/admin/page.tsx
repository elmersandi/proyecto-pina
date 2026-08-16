// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, FolderTree, ListTree, ArrowRight, Clock } from "lucide-react";

// Forzamos a que esta página sea dinámica para que siempre muestre los datos más recientes
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Obtenemos los conteos y los últimos 5 cursos al mismo tiempo (Promise.all para que sea más rápido)
  const [totalCursos, totalCategorias, totalSubcategorias, ultimosCursos] = await Promise.all([
    prisma.curso.count(),
    prisma.categoria.count(),
    prisma.subcategoria.count(),
    prisma.curso.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        categoria: {
          select: { nombre: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Encabezado del Dashboard */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Panel de Control</h1>
        <p className="text-sm text-slate-500 mt-1">
          Resumen general del estado de tu plataforma.
        </p>
      </div>

      {/* Grid de Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Cursos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Cursos Activos</p>
              <h3 className="text-4xl font-semibold text-slate-800 mt-2">{totalCursos}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <BookOpen size={24} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link 
              href="/admin/cursos" 
              className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Administrar cursos <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Tarjeta 2: Categorías */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Categorías</p>
              <h3 className="text-4xl font-semibold text-slate-800 mt-2">{totalCategorias}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FolderTree size={24} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link 
              href="/admin/categorias" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Administrar categorías <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Tarjeta 3: Subcategorías */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Subcategorías</p>
              <h3 className="text-4xl font-semibold text-slate-800 mt-2">{totalSubcategorias}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <ListTree size={24} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link 
              href="/admin/subcategorias" 
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Administrar subcategorías <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>

      {/* Tabla de Últimos Cursos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" />
            Últimos cursos agregados
          </h2>
          <Link href="/admin/cursos" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Ver todos
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Título del curso</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ultimosCursos.length > 0 ? (
                ultimosCursos.map((curso) => (
                  <tr key={curso.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {curso.titulo}
                    </td>
                    <td className="px-6 py-4">
                      {curso.categoria?.nombre || "Sin categoría"}
                    </td>
                    <td className="px-6 py-4">
                      {curso.esGratis ? (
                        <span className="text-emerald-600 font-semibold">Gratis</span>
                      ) : (
                        `S/ ${curso.precio?.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {curso.publicado ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                          Borrador
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Aún no hay cursos registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}