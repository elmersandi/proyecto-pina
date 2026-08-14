"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { enviarOTPRegistro, verificarOTPInline, completarRegistroAdmin } from "@/actions/auth.action";

export default function FormularioRegistro() {
  const router = useRouter();
  
  // Estados de carga y validación
  const [cargandoCorreo, setCargandoCorreo] = useState(false);
  const [cargandoOTP, setCargandoOTP] = useState(false);
  const [cargandoFinal, setCargandoFinal] = useState(false);
  const [estadoCorreo, setEstadoCorreo] = useState<'idle' | 'enviado' | 'validado'>('idle');

  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfPass, setMostrarConfPass] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
  
  // ¿Se puede registrar?
  const listoParaRegistrar = estadoCorreo === 'validado' && passEsValida && passwordsCoinciden && nombre && apellidos;

  // Acción 1: Pedir código
  const handleValidarCorreo = async () => {
    if (!correo) return toast.error("Ingresa un correo primero");
    setCargandoCorreo(true);
    
    const res = await enviarOTPRegistro(correo);
    if (res.success) {
      setEstadoCorreo('enviado');
      toast.success("Código enviado a tu correo");
    } else {
      toast.error(res.error);
    }
    setCargandoCorreo(false);
  };

  // Acción 2: Validar los 4 cuadritos
  const handleChangeOTP = async (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; 

    const nuevoOtp = [...otp];
    nuevoOtp[index] = value;
    setOtp(nuevoOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    const codigoCompleto = nuevoOtp.join("");
    if (codigoCompleto.length === 4) {
      setCargandoOTP(true);
      const res = await verificarOTPInline(correo, codigoCompleto);
      if (res.success) {
        setEstadoCorreo('validado');
        toast.success("¡Correo validado con éxito!");
      } else {
        toast.error(res.error);
        setOtp(["", "", "", ""]); 
        otpRefs.current[0]?.focus();
      }
      setCargandoOTP(false);
    }
  };

  // Acción 3: Registrar Final
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listoParaRegistrar) return;

    setCargandoFinal(true);
    const res = await completarRegistroAdmin({ correo, nombre, apellidos, password });
    
    if (res.success) {
      toast.success("¡Cuenta creada exitosamente!");
      router.push("/login");
    } else {
      toast.error(res.error);
      setCargandoFinal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombres y Apellidos */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Nombre</label>
          <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400" 
            placeholder="Ej. Juan" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Apellidos</label>
          <input type="text" required value={apellidos} onChange={(e) => setApellidos(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400" 
            placeholder="Ej. Pérez" />
        </div>
      </div>

      {/* Correo y Botón Inline */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Correo Electrónico</label>
        <div className="flex gap-2">
          <input 
            type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)}
            disabled={estadoCorreo !== 'idle'}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400 disabled:opacity-60" 
            placeholder="correo@ejemplo.com" 
          />
          {estadoCorreo === 'idle' && (
            <button type="button" onClick={handleValidarCorreo} disabled={cargandoCorreo || !correo}
              className="bg-blue-950 text-white px-4 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50">
              {cargandoCorreo ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14}/> Validar</>}
            </button>
          )}
          {estadoCorreo === 'validado' && (
            <div className="bg-green-100 text-green-700 px-4 rounded-xl flex items-center justify-center font-semibold text-sm gap-1 border border-green-200">
              <Check size={16}/> Validado
            </div>
          )}
        </div>
      </div>

      {/* Los 4 Cuadritos del OTP */}
      {estadoCorreo === 'enviado' && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center animate-in fade-in zoom-in duration-300">
          <p className="text-xs text-blue-800 font-bold mb-3">Ingresa el código que enviamos a tu correo:</p>
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { otpRefs.current[index] = el }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChangeOTP(index, e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Backspace' && !digit && index > 0) otpRefs.current[index - 1]?.focus() }}
                className="w-12 h-12 text-center text-xl font-bold bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
              />
            ))}
          </div>
          {cargandoOTP && <p className="text-xs text-blue-600 mt-2 font-bold animate-pulse flex justify-center items-center gap-1"><Loader2 size={12} className="animate-spin"/> Verificando...</p>}
        </div>
      )}

      {/* Contraseña */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Contraseña</label>
        <div className="relative">
          <input type={mostrarPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
            disabled={estadoCorreo !== 'validado'}
            className="w-full px-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-950 text-sm font-semibold text-slate-900 placeholder:text-slate-400 disabled:opacity-50" 
            placeholder="Crea una contraseña" />
          <button type="button" onClick={() => setMostrarPass(!mostrarPass)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50">
            {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Validadores en tiempo real */}
      {estadoCorreo === 'validado' && (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <ul className="text-xs space-y-1.5 font-medium">
            <li className={`flex items-center gap-2 ${reqs.longitud ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.longitud ? <Check size={14}/> : <X size={14}/>} De 8 a 12 caracteres</li>
            <li className={`flex items-center gap-2 ${reqs.mayuscula ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.mayuscula ? <Check size={14}/> : <X size={14}/>} Al menos una mayúscula</li>
            <li className={`flex items-center gap-2 ${reqs.minuscula ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.minuscula ? <Check size={14}/> : <X size={14}/>} Al menos una minúscula</li>
            <li className={`flex items-center gap-2 ${reqs.numero ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.numero ? <Check size={14}/> : <X size={14}/>} Al menos un número</li>
            <li className={`flex items-center gap-2 ${reqs.especial ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.especial ? <Check size={14}/> : <X size={14}/>} Un carácter especial (@, $, etc.)</li>
          </ul>
        </div>
      )}

      {/* Confirmar Contraseña */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Confirmar Contraseña</label>
        <div className="relative">
          <input type={mostrarConfPass ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={estadoCorreo !== 'validado'}
            className={`w-full px-4 pr-10 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 text-sm font-semibold text-slate-900 placeholder:text-slate-400 disabled:opacity-50
              ${confirmPassword.length > 0 ? (passwordsCoinciden ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : 'border-slate-200 focus:ring-blue-950'}`}
            placeholder="Repite tu contraseña" />
          <button type="button" onClick={() => setMostrarConfPass(!mostrarConfPass)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50">
            {mostrarConfPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPassword.length > 0 && !passwordsCoinciden && <p className="text-xs text-red-500 mt-1 font-bold">Las contraseñas no coinciden.</p>}
        {confirmPassword.length > 0 && passwordsCoinciden && <p className="text-xs text-green-600 mt-1 font-bold flex items-center gap-1"><Check size={14}/> ¡Las contraseñas coinciden!</p>}
      </div>

      <button type="submit" disabled={!listoParaRegistrar || cargandoFinal}
        className="w-full bg-blue-950 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4 cursor-pointer">
        {cargandoFinal ? <><Loader2 size={18} className="animate-spin" /> Creando cuenta...</> : "Registrarme"}
      </button>
    </form>
  );
}