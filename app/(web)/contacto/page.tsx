import React, { Suspense } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import FaqContacto from './components/Faq';
import FormularioContacto from './components/Formulario';

function ContenidoContacto() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. HERO SECTION (Limpio y directo) */}
      <div className="mb-10 lg:mb-12 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 mb-4 leading-tight">
          ¿Tienes dudas? Estamos aquí para ayudarte
        </h1>
        <p className="text-slate-600 max-w-2xl text-[15px] sm:text-base">
          Déjanos un mensaje a través del formulario o visítanos directamente en nuestra sede. Nuestro equipo académico resolverá todas tus inquietudes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* COLUMNA IZQUIERDA: Tarjetas y Mapa */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Tarjetas de Información */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white p-6 rounded-2xl flex flex-col items-start gap-4 border border-slate-200 shadow-sm">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">Horario de Atención</h3>
                <p className="text-slate-500 text-sm font-medium">Lun - Sáb: 8:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl flex flex-col items-start gap-4 border border-slate-200 shadow-sm">
              <div className="bg-blue-50 text-blue-900 p-3 rounded-full">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1">Contacto Telefónico</h3>
                <p className="text-slate-500 text-sm font-medium">+51 925 030 648</p>
              </div>
            </div>

          </div>

          {/* Mapa Interactivo Compacto de la Sede */}
          <div className="w-full bg-slate-200 rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-[280px] lg:h-[320px] relative group">
            <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-2">
              <MapPin size={16} className="text-red-500" />
              Alférez W 429, Iquitos
            </span>
            <iframe 
              src="https://maps.google.com/maps?q=Alf%C3%A9rez%20W%20429,%20Iquitos,%20Per%C3%BA&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>

        </div>

        {/* COLUMNA DERECHA: Formulario */}
        <div className="lg:col-span-5">
          <FormularioContacto />
        </div>

      </div>

      {/* SECCIÓN FAQ */}
      <div className="mt-20 lg:mt-28 w-full">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 mb-3">Preguntas Frecuentes</h2>
          <p className="text-slate-600 text-sm sm:text-base">Revisa las consultas más comunes de nuestros estudiantes.</p>
        </div>
        
        <FaqContacto />
      </div>

    </div>
  );
}

export default function ContactoPage() {
  return (
    <main className="bg-slate-50 min-h-screen pt-12 lg:pt-16 pb-20 font-sans">
      <Suspense fallback={<div className="text-center py-24 text-slate-500 font-medium">Cargando información de contacto...</div>}>
        <ContenidoContacto />
      </Suspense>
    </main>
  );
}