export default function Hero() {
  return (
    <div 
      // =====================================================================
      // FONDO GRADIENTE A PRUEBA DE BALAS (CSS Puro)
      // #020617 = Azul muy oscuro casi negro (Izquierda)
      // #172554 = Azul Institucional Piña (Centro)
      // #1e3a8a = Azul un poco más claro (Derecha)
      // =====================================================================
      style={{ background: "linear-gradient(to right, #020617, #172554, #1e3a8a)" }}
    >
      {/* 🔥 Ya no nos preocupamos por el navbar, usamos py-10 sm:py-12 para centrar el texto perfecto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col items-center justify-center text-center">
        
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 shadow-sm font-heading tracking-tight">
            Catálogo de <span className="text-yellow-500">Cursos</span>
          </h1>
          
          {/* 🔥 Añadimos my-0 para eliminar el margen fantasma de 16px del navegador */}
          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto my-0 drop-shadow-md">
            Explora nuestro material diseñado estratégicamente para asegurar tu ingreso. Teoría, práctica y simulacros tipo examen de admisión en un solo lugar.
          </p>
        </div>
        
      </div>
    </div>
  );
}