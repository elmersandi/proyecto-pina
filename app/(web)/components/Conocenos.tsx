"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle2, UserCheck, MonitorPlay, Layers, Medal } from "lucide-react";

export default function Conocenos() {
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
      { threshold: 0.15 }
    );

    if (seccionRef.current) observer.observe(seccionRef.current);
    return () => observer.disconnect();
  }, []);

  const listaBeneficios = [
    "Departamento psicológico",
    "Horario full time",
    "Lunes exclusivos para simulacros",
    "Asesorías virtuales",
    "Materiales actualizados según los últimos exámenes de admisión",
    "Seguimiento académico y estrategias para optimizar tus posibilidades de ingreso",
    "Comunicación constante con los padres de familia",
  ];

  const caracteristicas = [
    { texto: "Tutoría personalizada", icono: UserCheck },
    { texto: "Aula Virtual de clase mundial", icono: MonitorPlay },
    { texto: "Material educativo diferenciado", icono: Layers },
    { texto: "Docentes expertos", icono: Medal },
  ];

  return (
    <section ref={seccionRef} className="w-full bg-slate-50 py-16 md:py-24">
      {/* Animación en cascada */}
      <style>{`
        @keyframes fadeUpConocenos {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-conocenos {
          opacity: 0;
          animation: fadeUpConocenos 0.7s ease-out forwards;
        }
      `}</style>

      <div className="container mx-auto px-4 md:px-6">
        
        {/* 
          Grid Principal: 
          - 1 columna en móvil, 2 columnas en PC.
          - items-stretch asegura que el video alcance la altura de los beneficios en PC.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-16 lg:gap-y-20 items-stretch">
          
          {/* ================= BLOQUE 1: BENEFICIOS ================= */}
          {/* Orden: 1ro en móvil | 1ro en PC (Arriba Izquierda) */}
          <div className={`flex flex-col order-1 lg:order-1 justify-center ${isVisible ? 'anim-conocenos delay-[0ms]' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-semibold text-blue-950 mb-8 font-heading">
              Beneficios que nos <span className="text-yellow-500">diferencian</span>
            </h2>
            
            <ul className="flex flex-col gap-4 md:gap-5">
              {listaBeneficios.map((beneficio, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110" strokeWidth={2} />
                  <span className="text-base md:text-lg text-slate-700 font-medium leading-snug">
                    {beneficio}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= BLOQUE 2: VIDEO YOUTUBE ================= */}
          {/* Orden: 3ro en móvil (Al fondo) | 2do en PC (Arriba Derecha) */}
          {/* Truco: aspect-video en móvil, h-full en PC para calzar con la columna izquierda */}
          <div className={`order-3 lg:order-2 w-full aspect-video lg:aspect-auto lg:h-full rounded-2xl overflow-hidden shadow-lg bg-black border border-slate-200 ${isVisible ? 'anim-conocenos delay-[400ms]' : 'opacity-0'}`}>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/etnJAYTFRTs?si=O92x1dlNU7yEFiLl"
              title="Proyecto PIÑA Preuniversitaria y Prepolicial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* ================= BLOQUE 3: ¿EN QUÉ CONSISTE? (TARJETAS) ================= */}
          {/* Orden: 2do en móvil | 3ro en PC (Fila inferior completa) */}
          {/* col-span-2 hace que ocupe las dos columnas enteras en la PC */}
          <div className={`order-2 lg:order-3 lg:col-span-2 flex flex-col items-center ${isVisible ? 'anim-conocenos delay-[200ms]' : 'opacity-0'}`}>
            <h3 className="text-2xl md:text-3xl font-semibold text-blue-950 mb-8 font-heading text-center">
              ¿En qué consiste el método?
            </h3>
            
            {/* Sub-grid de 4 columnas para que las tarjetas queden en una sola fila en PC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {caracteristicas.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center text-center md:text-left gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icono className="w-7 h-7 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <span className="text-base font-semibold text-blue-950 leading-tight">
                    {item.texto}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}