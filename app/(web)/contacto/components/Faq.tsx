"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    pregunta: "¿Cuáles son los métodos de pago aceptados?",
    respuesta: "Aceptamos pagos a través de Yape, Plin y transferencias bancarias directas. Todo el proceso es 100% seguro."
  },
  {
    pregunta: "¿Cómo accedo al material después del pago?",
    respuesta: "Una vez verificado tu pago, tu cuenta se activará automáticamente y podrás descargar el material las 24 horas del día."
  },
  {
    pregunta: "¿El pago por el curso es mensual o único?",
    respuesta: "El pago es único. No hay mensualidades ni cobros ocultos; pagas una vez y tienes acceso al material."
  },
  {
    pregunta: "¿Tengo asesoría si no entiendo algún tema?",
    respuesta: "¡Por supuesto! Contamos con un botón de 'Consulta Académica' que te conectará directamente con nuestros asesores."
  },
  {
    pregunta: "¿Los cursos incluyen algún certificado?",
    respuesta: "Sí, al finalizar y aprobar las evaluaciones correspondientes, se emite un certificado digital a nombre de la academia."
  },
  {
    pregunta: "¿Por cuánto tiempo tengo acceso a mi cuenta?",
    respuesta: "El acceso a los materiales que adquieras es de por vida, incluyendo las futuras actualizaciones que se le hagan al curso."
  },
  {
    pregunta: "¿Puedo estudiar desde mi celular o tablet?",
    respuesta: "Totalmente. Nuestra plataforma está optimizada para que puedas leer y descargar tus PDFs desde cualquier dispositivo móvil."
  },
  {
    pregunta: "¿Qué hago si olvido mi contraseña?",
    respuesta: "En la pantalla de ingreso encontrarás la opción 'Olvidé mi contraseña' para recuperarla fácilmente con tu correo."
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
            className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
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