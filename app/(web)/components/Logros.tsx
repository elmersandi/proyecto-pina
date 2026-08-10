"use client";

import { useEffect, useState, useRef } from "react";

export default function Logros() {
  const [isVisible, setIsVisible] = useState(false);
  const seccionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="w-full bg-slate-50 py-16">
      <style>{`
        @keyframes popUp {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .anim-logro {
          opacity: 0;
          animation: popUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="container mx-auto px-4 md:px-6">
        <div 
          ref={seccionRef}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 w-full max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-slate-100">
            
            {/* ================= LOGRO 1 ================= */}
            <div className={`flex flex-col items-center text-center px-4 ${isVisible ? 'anim-logro delay-[0ms]' : 'opacity-0'}`}>
              {/* PRIMER SPAN: Dato principal (Tamaño estricto 5xl) */}
              <div className="relative isolate flex items-center justify-center h-20 mb-2">
                <div className="absolute -left-2 top-2 w-12 h-12 bg-emerald-400/70 rounded-full -z-10"></div>
                <span className="text-4xl md:text-5xl font-bold text-blue-950 font-heading tracking-tight">
                  20 Años
                </span>
              </div>
              
              {/* SEGUNDO SPAN: Subtítulo (Tamaño estricto lg) */}
              <div className="flex flex-col items-center justify-start h-16">
                <span className="text-base md:text-lg text-slate-600 font-medium">
                  De experiencia preparando cachimbos
                </span>
              </div>
            </div>

            {/* ================= LOGRO 2 ================= */}
            <div className={`flex flex-col items-center text-center px-4 py-6 md:py-0 ${isVisible ? 'anim-logro delay-[150ms]' : 'opacity-0'}`}>
              {/* PRIMER SPAN: Dato principal (Tamaño estricto 5xl) */}
              <div className="relative isolate flex items-center justify-center h-20 mb-2">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[16px] border-t-transparent border-l-[24px] border-l-yellow-400/80 border-b-[16px] border-b-transparent -z-10"></div>
                <span className="text-4xl md:text-5xl font-bold text-blue-950 font-heading tracking-tight flex items-baseline">
                  1<sup className="text-xl md:text-2xl font-semibold">er</sup> 
                  <span className="mx-2 text-2xl md:text-3xl">y</span> 
                  2<sup className="text-xl md:text-2xl font-semibold">do</sup>
                </span>
              </div>
              
              {/* SEGUNDO SPAN: Subtítulo (Tamaño estricto lg) */}
              <div className="flex flex-col items-center justify-start h-16">
                <span className="text-base md:text-lg text-slate-600 font-medium leading-snug">
                  Puesto Cómputo General <br/>
                  <strong className="text-blue-950">UNAP 2025 - I</strong>
                </span>
              </div>
            </div>

            {/* ================= LOGRO 3 ================= */}
            <div className={`flex flex-col items-center text-center px-4 ${isVisible ? 'anim-logro delay-[300ms]' : 'opacity-0'}`}>
              {/* PRIMER SPAN: Dato principal (Tamaño estricto 5xl) */}
              <div className="relative isolate flex items-center justify-center h-20 mb-2">
                <div className="absolute -left-2 top-2 w-11 h-11 bg-blue-400/70 rounded-sm -z-10"></div>
                <span className="text-4xl md:text-5xl font-bold text-blue-950 font-heading tracking-tight flex items-baseline">
                  1<sup className="text-xl md:text-2xl font-semibold">er</sup> 
                  <span className="ml-2 uppercase text-3xl md:text-4xl">Puesto</span>
                </span>
              </div>
              
              {/* SEGUNDO SPAN: Subtítulo (Tamaño estricto lg) */}
              <div className="flex flex-col items-center justify-start h-16">
                <span className="text-base md:text-lg text-slate-600 font-medium leading-snug">
                  Cómputo General <br/>
                  <strong className="text-blue-950">UNAP 2023-2024-2025</strong>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}