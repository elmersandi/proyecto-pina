// app/admin/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Cursos Activos</h3>
          <p className="text-4xl font-bold text-slate-800 mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Categorías</h3>
          <p className="text-4xl font-bold text-slate-800 mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Estado de la Base de Datos</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xl font-bold text-green-600">Conectada</p>
          </div>
        </div>
      </div>
    </div>
  );
}