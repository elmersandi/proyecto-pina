"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    pregunta: "¿Tengo que pagar para descargar los materiales?",
    respuesta: "No, todo el material disponible actualmente en nuestra plataforma es 100% gratuito. Nuestro objetivo es ayudarte en tu preparación pre-universitaria sin barreras."
  },
  {
    pregunta: "¿Necesito registrarme o crear una cuenta?",
    respuesta: "No es necesario crear ninguna cuenta ni dejar tus datos. Puedes explorar nuestro catálogo y descargar el contenido que necesites de forma directa e inmediata."
  },
  {
    pregunta: "¿En qué formato se encuentran los cursos?",
    respuesta: "Los materiales de estudio se encuentran organizados y optimizados en formato PDF de alta calidad, listos para que los leas en pantalla o los imprimas."
  },
  {
    pregunta: "¿Puedo estudiar y descargar desde mi celular?",
    respuesta: "¡Totalmente! Nuestra plataforma está diseñada para funcionar a la perfección en dispositivos móviles. Puedes buscar y descargar tu material desde cualquier lugar."
  },
  {
    pregunta: "¿El material está actualizado para los exámenes recientes?",
    respuesta: "Sí, nuestro equipo académico revisa y actualiza constantemente el contenido basándose en los prospectos y últimos exámenes de admisión de la región."
  },
  {
    pregunta: "¿Qué hago si tengo dudas con algún ejercicio?",
    respuesta: "Aunque la plataforma es de descarga y autoestudio, puedes comunicarte con nosotros a través de nuestras redes sociales o WhatsApp en la sección de Contacto para orientarte."
  },
  {
    pregunta: "¿Este material me sirve para cualquier universidad?",
    respuesta: "Los cursos cubren los temas exigidos en los prospectos generales a nivel nacional, con un enfoque estratégico en los temas más recurrentes de las universidades amazónicas."
  },
  {
    pregunta: "¿Puedo compartir los PDFs con mis compañeros?",
    respuesta: "¡Claro que sí! Te invitamos a compartir el enlace de Proyecto Piña con todos tus amigos del colegio para que también puedan prepararse para su examen de admisión."
  }
];

export default function FaqContacto() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-slate-300 h-max"
        >
          <button
            onClick={() => setAbierto(abierto === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left focus:outline-none cursor-pointer"
          >
            <span className="font-semibold text-slate-800 text-[13px] sm:text-sm pr-4">{faq.pregunta}</span>
            <ChevronDown 
              size={18} 
              className={`text-slate-400 transition-transform duration-300 shrink-0 ${abierto === index ? 'rotate-180 text-blue-950' : ''}`} 
            />
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${abierto === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-4 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-50 mt-1">
              {faq.respuesta}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}