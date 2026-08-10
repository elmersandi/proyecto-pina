"use client";

import { useEffect, useState, useRef } from "react";
import { Users, BookOpen, ClipboardCheck, HeartHandshake } from "lucide-react";

export default function Servicios() {
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
      { threshold: 0.15 } // Se activa apenas asoma el 15% del bloque
    );

    if (seccionRef.current) observer.observe(seccionRef.current);
    return () => observer.disconnect();
  }, []);

  const listaServicios = [
    {
      id: 1,
      titulo: "Plana Docente de Primer Nivel",
      descripcion: "Contamos con profesionales de amplia trayectoria y metodologías comprobadas para asegurar tu aprendizaje.",
      icono: Users,
      delay: "delay-[0ms]",
    },
    {
      id: 2,
      titulo: "Material Didáctico Actualizado",
      descripcion: "Te brindamos compendios teóricos y prácticos alineados a los prospectos de admisión universitarios actuales.",
      icono: BookOpen,
      delay: "delay-[150ms]",
    },
    {
      id: 3,
      titulo: "Simulacros Tipo Examen de Admisión",
      descripcion: "Evaluaciones constantes con el mismo formato, tiempo y nivel de exigencia que enfrentarán en la universidad.",
      icono: ClipboardCheck,
      delay: "delay-[300ms]",
    },
    {
      id: 4,
      titulo: "Asesoría Psicológica y Vocacional",
      descripcion: "Acompañamiento integral para ayudarte a descubrir tu verdadera vocación y manejar el estrés preuniversitario.",
      icono: HeartHandshake,
      delay: "delay-[450ms]",
    },
  ];

  return (
    <section ref={seccionRef} className="w-full bg-white py-16 md:py-24">
      {/* Animación de entrada suave */}
      <style>{`
        @keyframes fadeInUpService {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-service {
          opacity: 0;
          animation: fadeInUpService 0.7s ease-out forwards;
        }
      `}</style>

      <div className="container mx-auto px-4 md:px-6">
        {/* Grid de 4 columnas en PC, 2 en Tablet, 1 en Móvil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {listaServicios.map((item) => (
            <div 
              key={item.id} 
              className={`flex flex-col items-center text-center group ${isVisible ? `anim-service ${item.delay}` : 'opacity-0'}`}
            >
              {/* Ícono con un fondo circular sutil que reacciona al hover */}
              <div className="w-20 h-20 mb-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-blue-50 group-hover:border-blue-100">
                <item.icono className="w-10 h-10 text-blue-950 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
              </div>
              
              {/* Contenedor del título con altura mínima (h-14) para alinear perfectamente todas las columnas */}
              <div className="flex items-center justify-center min-h-[3.5rem] mb-3">
                <h3 className="font-heading font-semibold text-xl text-blue-950 leading-tight">
                  {item.titulo}
                </h3>
              </div>
              
              {/* Párrafo descriptivo */}
              <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
                {item.descripcion}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}