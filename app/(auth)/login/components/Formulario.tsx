"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { iniciarSesion } from "@/actions/auth.action";

export default function FormularioLogin() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo || !password) return;

    setCargando(true);
    const res = await iniciarSesion({ correo, password });

    if (res.success) {
      toast.success("¡Bienvenido de vuelta!");
      // Lo mandamos directo al panel de control (que luego crearemos)
      router.push("/admin"); 
    } else {
      toast.error(res.error);
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Correo */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Correo Electrónico</label>
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

      {/* Contraseña */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-[11px] font-bold text-slate-700 uppercase">Contraseña</label>
          <Link href="/recuperar" className="text-[11px] font-bold text-blue-950 hover:underline cursor-pointer">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock size={18} className="text-slate-400" />
          </div>
          <input type={mostrarPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400" 
            placeholder="Ingresa tu contraseña" />
          <button type="button" onClick={() => setMostrarPass(!mostrarPass)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
            {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={!correo || !password || cargando}
        className="w-full bg-blue-950 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2 cursor-pointer">
        {cargando ? <><Loader2 size={18} className="animate-spin" /> Ingresando...</> : "Iniciar Sesión"}
      </button>
    </form>
  );
}