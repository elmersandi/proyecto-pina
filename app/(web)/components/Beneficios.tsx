"use client";

import { useEffect, useState, useRef } from "react";
import { GraduationCap, Handshake, Laptop, Headset } from "lucide-react";

export default function Beneficios() {
  const [isVisible, setIsVisible] = useState(false);
  const seccionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Dejamos de observar una vez que ya apareció
        }
      },
      { threshold: 0.2 } // Se activa cuando el 20% de la sección es visible
    );

    if (seccionRef.current) observer.observe(seccionRef.current);
    return () => observer.disconnect();
  }, []);

  const listaBeneficios = [
    {
      id: 1,
      titulo: "Cursos Certificados",
      descripcion: "Mejora tu perfil con clases interactivas y certificadas, súmate a nuestra gran comunidad creativa Proyecto Piña.",
      icono: GraduationCap,
      colorFondo: "bg-cyan-500", 
      delay: "delay-[0ms]",
    },
    {
      id: 2,
      titulo: "Profesores Expertos",
      descripcion: "Contamos con el staff de docentes altamente capacitados en el mundo de las matemáticas para tu mejor aprendizaje.",
      icono: Handshake,
      colorFondo: "bg-blue-500", 
      delay: "delay-[150ms]",
    },
    {
      id: 3,
      titulo: "Desde Casa",
      descripcion: "Estudia desde casa, descarga los materiales y últimos solucionarios de los exámenes de admisión a tu propio ritmo.",
      icono: Laptop,
      colorFondo: "bg-blue-700", 
      delay: "delay-[300ms]",
    },
    {
      id: 4,
      titulo: "Soporte 24 x 7",
      descripcion: "Te brindamos asistencia las 24 horas para monitorear, analizar y darte soporte técnico vía telefónica, e-mail o chat.",
      icono: Headset,
      colorFondo: "bg-blue-950", 
      delay: "delay-[450ms]",
    },
  ];

  return (
    <section ref={seccionRef} className="w-full">
      {/* CSS inyectado para la animación de subida */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          opacity: 0;
          animation: slideUpFade 0.7s ease-out forwards;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
        {listaBeneficios.map((item) => (
          <div 
            key={item.id} 
            className={`${item.colorFondo} flex flex-col items-center text-center px-6 py-8 md:py-10 text-white transition-all duration-300 hover:brightness-110
              ${isVisible ? `animate-slide-up ${item.delay}` : "opacity-0"}
            `}
          >
            <div className="mb-4">
              <item.icono className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-semibold text-xl md:text-2xl mb-2">
              {item.titulo}
            </h3>
            <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed">
              {item.descripcion}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}