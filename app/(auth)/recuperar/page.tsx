"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { solicitarRecuperacion } from "@/actions/auth.action";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RecuperarPage() {
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo) return;

    setCargando(true);
    const res = await solicitarRecuperacion(correo);
    
    if (res.success) {
      setEnviado(true);
    } else {
      toast.error(res.error);
    }
    setCargando(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <Toaster position="top-center" richColors />
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col items-center">
          
          <Link href="/" className="mb-4 cursor-pointer">
            <Image src="/logo.png" alt="Logo" width={130} height={45} className="object-contain" />
          </Link>

          {!enviado ? (
            <>
              <h1 className="text-xl font-semibold text-slate-900 text-center mb-1">¿Olvidaste tu contraseña?</h1>
              <p className="text-slate-600 text-sm text-center mb-8 font-medium">
                Ingrese su correo para validar y enviarle un enlace de acceso seguro.
              </p>

              <form onSubmit={handleRecuperar} className="w-full space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1.5">Correo Registrado</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400" 
                      placeholder="correo@ejemplo.com" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={!correo || cargando}
                  className="w-full bg-blue-950 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2 cursor-pointer">
                  {cargando ? <><Loader2 size={18} className="animate-spin" /> Procesando...</> : "Validar correo y enviar link"}
                </button>
              </form>
            </>
          ) : (
            <div className="w-full flex flex-col items-center text-center py-4 animate-in fade-in zoom-in">
              <CheckCircle2 size={56} className="text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">¡Enlace enviado!</h2>
              <p className="text-sm font-medium text-slate-600 mb-6">
                Hemos enviado un enlace de recuperación a <span className="font-semibold text-blue-950">{correo}</span>. Revisa tu bandeja de entrada.
              </p>
            </div>
          )}
          
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-950 flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <ArrowLeft size={16} /> Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  );
}