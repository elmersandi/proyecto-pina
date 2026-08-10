// app/admin/loading.tsx (o en tu módulo correspondiente)
export default function DashboardLoading() {
  return (
    <div className="w-full">
      
      {/* 1. LA BARRA MÁGICA TIPO YOUTUBE (En tonos naranjas corporativos) */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 h-[3px] bg-orange-100/50 overflow-hidden relative mb-8">
        <div
          className="absolute top-0 left-0 h-full bg-orange-600 shadow-[0_0_12px_#ea580c]"
          style={{
            width: "40%",
            animation: "slide 1s infinite linear"
          }}
        ></div>
      </div>

      {/* Inyectamos la animación CSS clave para el movimiento fluido */}
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>

      {/* 2. SKELETON UI MEJORADO */}
      <div className="space-y-6">
        {/* Simulación del Título */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-md animate-pulse"></div>
        </div>

        {/* Simulación de las Tarjetas Superiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="h-32 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm animate-pulse flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-8 w-8 bg-orange-100 rounded-lg"></div>
              </div>
              <div className="h-8 w-16 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Simulación de la Tabla Inferior */}
        <div className="w-full h-64 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm animate-pulse mt-6 space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
          <div className="space-y-3 pt-2">
            <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
            <div className="h-10 w-full bg-slate-50 rounded-lg"></div>
            <div className="h-10 w-full bg-slate-50 rounded-lg"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
}