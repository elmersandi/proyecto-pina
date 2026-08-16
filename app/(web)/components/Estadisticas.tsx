"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Sub-componente lógico para el contador
interface ContadorProps {
  fin: number;
  duracion?: number; // en milisegundos
}

function ContadorAnimado({ fin, duracion = 2000 }: ContadorProps) {
  const [contador, setContador] = useState(0);
  const [yaAnimado, setYaAnimado] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !yaAnimado) {
          setYaAnimado(true);
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duracion, 1);
            const easeProgress = progress * (2 - progress); 
            setContador(Math.floor(easeProgress * fin));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 } 
    );

    observer.observe(elemento);
    return () => observer.disconnect();
  }, [fin, duracion, yaAnimado]);

  return <span ref={ref}>{contador}</span>;
}

export default function Estadisticas() {
  const stats = [
    { id: 1, valor: 1200, prefijo: "+", sufijo: "", texto: "Alumnos Inscritos" },
    { id: 2, valor: 600, prefijo: "+", sufijo: "", texto: "Cursos Publicados" },
    { id: 3, valor: 900, prefijo: "+", sufijo: "", texto: "Certificados ISO" },
    { id: 4, valor: 10, prefijo: "+", sufijo: "", texto: "Años de Experiencia" },
  ];

  return (
    // Cambiamos bg-slate-950 a bg-black puro
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-black">
      
      {/* ==================== FONDOS OPTIMIZADOS ==================== */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/bg-estadisticas.jpg" 
          alt="Oficina de instructores Proyecto Piña" 
          fill 
          sizes="100vw"
          className="object-cover object-center" 
        />
        {/* Capa NEGRA PURA al 75% (bg-black/75) para revelar más la imagen sin tono azul */}
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      {/* ==================== CONTENIDO PRINCIPAL ==================== */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Título de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-heading drop-shadow-md">
            Estadísticas
          </h2>
        </div>

        {/* Grid de números */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-3 font-heading drop-shadow-lg">
                <span className="text-yellow-500">{stat.prefijo}</span>
                <ContadorAnimado fin={stat.valor} />
                {stat.sufijo}
              </div>
              <p className="text-slate-300 font-medium text-sm md:text-base tracking-wide uppercase">
                {stat.texto}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}