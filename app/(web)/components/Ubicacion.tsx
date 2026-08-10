"use client";

import { useEffect, useState, useRef } from "react";

export default function Ubicacion() {
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

   {/* 1. Redujimos el padding vertical general de py-24 a py-16 */}
  return (
   
    <section ref={seccionRef} className="w-full bg-white py-10 md:py-16">
      
      <style>{`
        @keyframes fadeUpMapBlock {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-map-block {
          opacity: 0;
          animation: fadeUpMapBlock 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="container mx-auto px-4 md:px-6">
        
        {/* 2. Redujimos el margen debajo del título (mb-10 en vez de mb-14) */}
        <div className={`text-center mb-8 md:mb-10 ${isVisible ? 'anim-map-block delay-[0ms]' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-950 font-heading mb-6 tracking-tight">
            Visítanos en nuestra <span className="text-yellow-500">Sede</span>
          </h2>

          <div className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto">
            {/* 3. Cambiamos h-[2px] por h-0.5 como sugirió VS Code */}
            <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent to-yellow-500 rounded-full"></div>
            
            <div className="flex items-center gap-2">
              {/* 4. Cambiamos flex-shrink-0 por shrink-0 como sugirió VS Code */}
              <div className="w-2.5 h-2.5 bg-yellow-500 rotate-45 shrink-0"></div>
              <div className="w-3.5 h-3.5 bg-yellow-500 rotate-45 shrink-0"></div>
              <div className="w-4 h-4 bg-yellow-500 rotate-45 shrink-0 shadow-sm"></div>
              <div className="w-3.5 h-3.5 bg-yellow-500 rotate-45 shrink-0"></div>
              <div className="w-2.5 h-2.5 bg-yellow-500 rotate-45 shrink-0"></div>
            </div>

            {/* 3. Cambiamos h-[2px] por h-0.5 */}
            <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent to-yellow-500 rounded-full"></div>
          </div>
        </div>

        <div className={`w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 ${isVisible ? 'anim-map-block delay-[200ms]' : 'opacity-0'}`}>
          <iframe 
            src="https://maps.google.com/maps?q=Alf%C3%A9rez%20W%20429,%20Iquitos,%20Per%C3%BA&t=&z=18&ie=UTF8&iwloc=&output=embed"
            className="w-full"
            style={{ border: 0, minHeight: '400px' }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Proyecto Piña"
          ></iframe>
        </div>

      </div>
    </section>
  );
}