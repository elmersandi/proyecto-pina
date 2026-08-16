// app/(web)/components/Hero.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full pt-24 pb-32 md:pt-32 md:pb-48 flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* ==================== FONDOS OPTIMIZADOS ==================== */}
      <div className="absolute inset-0 z-0">
        {/* Imagen para Celulares (Se oculta en md o superior) */}
        <div className="block md:hidden w-full h-full relative">
          <Image 
            src="/hero-movil.jpg" 
            alt="Estudiantes Proyecto Piña" 
            fill 
            sizes="100vw"
            priority
            className="object-cover object-center" 
          />
        </div>

        {/* Imagen para PC/Laptop (Se oculta en móviles) */}
        <div className="hidden md:block w-full h-full relative">
          <Image 
            src="/hero-desktop.jpg" 
            alt="Estudiantes universitarios estudiando" 
            fill 
            sizes="100vw"
            priority
            className="object-cover object-center" 
          />
        </div>

        {/* Overlay Oscuro: Negro puro semitransparente para máxima legibilidad */}
        <div className="absolute inset-0 bg-black/75"></div>
      </div>
      {/* ============================================================ */}

      {/* CSS Integrado para las animaciones de entrada (Fade In Up) */}
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

      {/* ==================== CONTENIDO DEL HERO ==================== */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
        
        {/* Etiqueta superior */}
        <div className="animate-fade-in-up">
          <span className="inline-block py-1.5 px-4 rounded-full border border-yellow-500/40 text-yellow-400 text-xs md:text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-md bg-black/30 shadow-sm">
            Academia Pre-Universitaria
          </span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight font-heading animate-fade-in-up delay-100 drop-shadow-md">
          Academia <span className="text-yellow-400">Proyecto Piña</span>
        </h1>

        {/* Párrafo Descriptivo */}
        <p className="text-base md:text-lg text-slate-200 mb-10 max-w-xl mx-auto leading-relaxed font-medium animate-fade-in-up delay-200 drop-shadow-sm">
          Asegura tu ingreso a la universidad en los primeros lugares con nuestra preparación de excelencia y plana docente especializada en la Amazonía peruana.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link 
            href="/cursos" 
            className="w-full sm:w-auto px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-full transition-colors flex items-center justify-center gap-2 text-sm md:text-base shadow-lg hover:shadow-yellow-500/20"
          >
            Ver Cursos
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/contacto" 
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border-2 border-slate-300/50 hover:border-white text-slate-200 hover:text-white font-semibold rounded-full transition-colors flex items-center justify-center text-sm md:text-base backdrop-blur-sm hover:bg-white/10"
          >
            Conoce más
          </Link>
        </div>
      </div>

      {/* ==================== DIVISOR TIPO OLA (SMOOTH WAVE) ==================== */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-10 pointer-events-none">
        <svg 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px] md:h-[120px]"
        >
          <path 
            className="fill-slate-50" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}