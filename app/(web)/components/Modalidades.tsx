"use client";

import { useEffect, useState, useRef } from "react";
import { Headset, Presentation, Plus } from "lucide-react";

export default function Modalidades() {
  const [isVisible, setIsVisible] = useState(false);
  const seccionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (seccionRef.current) observer.observe(seccionRef.current);
    return () => observer.disconnect();
  }, []);

  const extras = [
    "Plataforma Intranet",
    "Sistema de tutoría académica",
    "Entrega de materiales y libros",
    "Biblioteca y sala de estudio (Presencial)"
  ];

  return (
    <section ref={seccionRef} className="w-full">
      {/* Estilos de animación integrados */}
      <style>{`
        @keyframes fadeUpMod {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-mod {
          opacity: 0;
          animation: fadeUpMod 0.6s ease-out forwards;
        }
      `}</style>

      {/* BLOQUE PRINCIPAL (Azul medio) */}
      <div className="bg-blue-700 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-center">
            
            {/* Título Principal */}
            <div className={`text-center lg:text-left ${isVisible ? 'anim-mod delay-[0ms]' : 'opacity-0'}`}>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight font-heading">
                Modalidades que <br className="hidden lg:block" />
                se ajustan a ti
              </h2>
            </div>

            {/* Modalidad 1: Virtual */}
            <div className={`flex items-start gap-4 justify-center lg:justify-start ${isVisible ? 'anim-mod delay-[150ms]' : 'opacity-0'}`}>
              {/* Contenedor de ícono fijo para que no se deforme */}
              <div className="flex-shrink-0 mt-1">
                <Headset className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-1">
                  Virtual
                </h3>
                <p className="text-sm md:text-base text-blue-100 font-medium">
                  con clases sincrónicas
                </p>
              </div>
            </div>

            {/* Modalidad 2: Presencial */}
            <div className={`flex items-start gap-4 justify-center lg:justify-start ${isVisible ? 'anim-mod delay-[300ms]' : 'opacity-0'}`}>
              {/* Contenedor de ícono fijo para que no se deforme */}
              <div className="flex-shrink-0 mt-1">
                <Presentation className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-1">
                  Presencial
                </h3>
                <p className="text-sm md:text-base text-blue-100 font-medium leading-snug">
                  Alférez West # 429 <br />
                  Iquitos, Perú 16001
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BLOQUE INFERIOR (Sub-barra Azul oscura) */}
      <div className={`bg-blue-900 py-4 border-t border-blue-800 ${isVisible ? 'anim-mod delay-[450ms]' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {extras.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-yellow-400 flex-shrink-0" strokeWidth={3} />
                <span className="text-sm md:text-base text-blue-100 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}