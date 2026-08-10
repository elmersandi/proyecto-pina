// app/(web)/components/Hero.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full bg-blue-950 pt-20 pb-32 md:pt-28 md:pb-48 flex items-center justify-center overflow-hidden">
      
      {/* 1. CSS Integrado para las animaciones de entrada (Fade In Up) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
        
        {/* Etiqueta superior */}
        <div className="animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full border border-yellow-500/50 text-yellow-500 text-xs md:text-sm font-semibold tracking-wide uppercase mb-6 bg-blue-950/50">
            Academia Pre-Universitaria
          </span>
        </div>

        {/* Título Principal (Sin brillos, máximo semibold) */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight font-heading animate-fade-in-up delay-100">
          Academia <span className="text-yellow-500">Proyecto Piña</span>
        </h1>

        {/* Párrafo Descriptivo */}
        <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed font-medium animate-fade-in-up delay-200">
          Asegura tu ingreso a la universidad en los primeros lugares con nuestra preparación de excelencia y plana docente especializada.
        </p>

        {/* Botones de Acción (Planos, sólidos) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link 
            href="/cursos" 
            className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-semibold rounded-full transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
          >
            Ver Cursos
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/contacto" 
            className="w-full sm:w-auto px-6 py-3 bg-transparent border border-slate-400 hover:border-slate-200 text-slate-300 hover:text-white font-semibold rounded-full transition-colors flex items-center justify-center text-sm md:text-base"
          >
            Conoce más
          </Link>
        </div>
      </div>

      {/* 2. El Divisor en forma de Ola (Wave) en la parte inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
        {/* El fill-slate-50 hace que la ola sea del mismo color que el fondo de tu Layout */}
        <svg 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px] md:h-[110px]"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.81,119.28,197.8,109.14,242.49,102.3,283.47,75.92,321.39,56.44Z" 
            className="fill-slate-50"
          ></path>
        </svg>
      </div>
    </section>
  );
}