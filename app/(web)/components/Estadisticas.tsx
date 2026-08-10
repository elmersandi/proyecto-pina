"use client";

import { useEffect, useState, useRef } from "react";

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
        // Si el elemento entra en pantalla y no se ha animado aún
        if (entry.isIntersecting && !yaAnimado) {
          setYaAnimado(true);
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duracion, 1);
            // Función easeOutQuad para que el final del conteo sea más suave
            const easeProgress = progress * (2 - progress); 
            setContador(Math.floor(easeProgress * fin));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 } // Se activa cuando el 50% del elemento es visible
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
    <section className="w-full bg-gradient-to-r from-slate-900 to-blue-950 py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Título de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight font-heading">
            Estadísticas
          </h2>
        </div>

        {/* Grid de números */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-heading">
                {stat.prefijo}
                <ContadorAnimado fin={stat.valor} />
                {stat.sufijo}
              </div>
              <p className="text-slate-300 font-medium text-sm md:text-base">
                {stat.texto}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}