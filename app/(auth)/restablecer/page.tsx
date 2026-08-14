"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { restablecerPassword } from "@/actions/auth.action";
import { Eye, EyeOff, Lock, Check, X, Loader2, AlertCircle } from "lucide-react";

function FormularioRestablecer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Capturamos los datos que vienen en el link del correo
  const correo = searchParams.get("correo") || "";
  const token = searchParams.get("token") || "";

  const [cargando, setCargando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfPass, setMostrarConfPass] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validadores en tiempo real
  const reqs = {
    longitud: password.length >= 8 && password.length <= 12,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /[0-9]/.test(password),
    especial: /[^A-Za-z0-9]/.test(password),
  };
  
  const passEsValida = Object.values(reqs).every(Boolean);
  const passwordsCoinciden = password !== "" && password === confirmPassword;
  const listoParaGuardar = passEsValida && passwordsCoinciden;

  // Si alguien entra a la página sin el link correcto, lo bloqueamos visualmente
  if (!correo || !token) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-sm">Enlace inválido</h3>
          <p className="text-xs font-medium mt-1">Este enlace de recuperación no es válido o está incompleto. Por favor, solicita uno nuevo.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listoParaGuardar) return;

    setCargando(true);
    
    // Llamamos a la función que ya habíamos creado en auth.action.ts
    const res = await restablecerPassword({ 
      correo: correo, 
      codigo: token, 
      nuevaPass: password 
    });
    
    if (res.success) {
      toast.success("¡Contraseña actualizada con éxito!");
      // Lo mandamos al login después de un segundito
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      toast.error(res.error);
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nueva Contraseña */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Nueva Contraseña</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock size={18} className="text-slate-400" />
          </div>
          <input type={mostrarPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400" 
            placeholder="Crea tu nueva contraseña" />
          <button type="button" onClick={() => setMostrarPass(!mostrarPass)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
            {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Validadores Visuales */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
        <ul className="text-xs space-y-1.5 font-medium">
          <li className={`flex items-center gap-2 ${reqs.longitud ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.longitud ? <Check size={14}/> : <X size={14}/>} De 8 a 12 caracteres</li>
          <li className={`flex items-center gap-2 ${reqs.mayuscula ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.mayuscula ? <Check size={14}/> : <X size={14}/>} Al menos una mayúscula</li>
          <li className={`flex items-center gap-2 ${reqs.minuscula ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.minuscula ? <Check size={14}/> : <X size={14}/>} Al menos una minúscula</li>
          <li className={`flex items-center gap-2 ${reqs.numero ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.numero ? <Check size={14}/> : <X size={14}/>} Al menos un número</li>
          <li className={`flex items-center gap-2 ${reqs.especial ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.especial ? <Check size={14}/> : <X size={14}/>} Un carácter especial (@, $, etc.)</li>
        </ul>
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Confirmar Contraseña</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock size={18} className="text-slate-400" />
          </div>
          <input type={mostrarConfPass ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full pl-11 pr-10 py-3.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 text-sm font-semibold text-slate-900 placeholder:text-slate-400
              ${confirmPassword.length > 0 ? (passwordsCoinciden ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : 'border-slate-200 focus:ring-blue-950'}`}
            placeholder="Repite tu contraseña" />
          <button type="button" onClick={() => setMostrarConfPass(!mostrarConfPass)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
            {mostrarConfPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPassword.length > 0 && !passwordsCoinciden && <p className="text-xs text-red-500 mt-1 font-bold">Las contraseñas no coinciden.</p>}
        {confirmPassword.length > 0 && passwordsCoinciden && <p className="text-xs text-green-600 mt-1 font-bold flex items-center gap-1"><Check size={14}/> ¡Las contraseñas coinciden!</p>}
      </div>

      <button type="submit" disabled={!listoParaGuardar || cargando}
        className="w-full bg-blue-950 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4 cursor-pointer">
        {cargando ? <><Loader2 size={18} className="animate-spin" /> Guardando...</> : "Guardar y Entrar"}
      </button>
    </form>
  );
}

export default function RestablecerPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <Toaster position="top-center" richColors />
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col items-center">
          
          <Link href="/" className="mb-4 cursor-pointer">
            <Image src="/logo.png" alt="Logo" width={130} height={45} className="object-contain" />
          </Link>

          <h1 className="text-xl font-semibold text-slate-900 text-center mb-1">Crea una nueva contraseña</h1>
          <p className="text-slate-600 text-sm text-center mb-8 font-medium">
            Asegúrate de que sea segura y fácil de recordar.
          </p>

          <div className="w-full">
            <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-950" size={32}/></div>}>
              <FormularioRestablecer />
            </Suspense>
          </div>
          
        </div>
      </div>
    </main>
  );
}