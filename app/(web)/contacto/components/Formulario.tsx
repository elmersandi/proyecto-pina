"use client";

import { useState } from 'react';
import { Send, Mail, Loader2 } from 'lucide-react';

export default function FormularioContacto() {
  const [metodo, setMetodo] = useState<'whatsapp' | 'correo'>('whatsapp');
  const [enviando, setEnviando] = useState(false);

  // Estados de los campos
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    
    if (metodo === 'whatsapp') {
      // Envío a WhatsApp
      setTimeout(() => {
        const textoWa = encodeURIComponent(`Hola, mi nombre es ${nombre}. ${mensaje}`);
        window.open(`https://wa.me/51925030648?text=${textoWa}`, '_blank');
        setEnviando(false);
      }, 500);
    } else {
      // Simulación de envío de correo
      setTimeout(() => {
        alert(`Mensaje enviado por correo.\nNombre: ${nombre}\nCel: ${numero}`);
        setNombre(''); setNumero(''); setMensaje('');
        setEnviando(false);
      }, 1500);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Envíanos un mensaje</h3>
      
      {/* Pestañas de selección */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setMetodo('whatsapp')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${metodo === 'whatsapp' ? 'bg-white text-[#25D366] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {/* Ícono oficial de WhatsApp */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg> 
          WhatsApp
        </button>
        <button 
          onClick={() => setMetodo('correo')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${metodo === 'correo' ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Mail size={16} /> Correo
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nombre Completo</label>
          <input 
            type="text" required
            value={nombre} onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Pepe Ruiz"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
          />
        </div>
        
        {metodo === 'correo' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Celular / Teléfono</label>
            <input 
              type="tel" required
              value={numero} onChange={(e) => setNumero(e.target.value)}
              placeholder="Ej. 999 888 777"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
            />
          </div>
        )}
        
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mensaje</label>
          <textarea 
            required rows={4}
            value={mensaje} onChange={(e) => setMensaje(e.target.value)}
            placeholder="¿En qué podemos ayudarte hoy?"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" disabled={enviando}
          className={`w-full text-white font-semibold py-3.5 px-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg mt-2 ${metodo === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#20bd5a] shadow-green-500/20' : 'bg-blue-950 hover:bg-blue-900 shadow-blue-950/20'}`}
        >
          {enviando ? (
            <><Loader2 size={18} className="animate-spin" /><span>Procesando...</span></>
          ) : (
            <><Send size={18} /><span>{metodo === 'whatsapp' ? 'Enviar a WhatsApp' : 'Enviar Correo'}</span></>
          )}
        </button>
      </form>
    </div>
  );
}