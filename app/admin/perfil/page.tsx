"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { obtenerPerfilAdmin, actualizarPerfilAdmin } from "@/actions/auth.action";
import { User, Mail, Lock, Loader2, Check, X, ShieldCheck } from "lucide-react";

export default function PerfilAdminPage() {
  const [cargandoInfo, setCargandoInfo] = useState(true);
  const [cargandoGuardar, setCargandoGuardar] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");

  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarNueva, setConfirmarNueva] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      const data = await obtenerPerfilAdmin();
      if (data) {
        setNombre(data.nombre || "");
        setApellidos(data.apellidos || "");
        setCorreo(data.email || "");
        setRol(data.rol || "");
      }
      setCargandoInfo(false);
    }
    cargarDatos();
  }, []);

  const reqs = {
    longitud: nuevaPassword.length === 0 || (nuevaPassword.length >= 8 && nuevaPassword.length <= 12),
    mayuscula: nuevaPassword.length === 0 || /[A-Z]/.test(nuevaPassword),
    minuscula: nuevaPassword.length === 0 || /[a-z]/.test(nuevaPassword),
    numero: nuevaPassword.length === 0 || /[0-9]/.test(nuevaPassword),
    especial: nuevaPassword.length === 0 || /[^A-Za-z0-9]/.test(nuevaPassword),
  };
  const passValida = nuevaPassword.length === 0 || Object.values(reqs).every(Boolean);
  const passwordsCoinciden = nuevaPassword === confirmarNueva;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaPassword && (!passwordActual || !passValida || !passwordsCoinciden)) {
      toast.error("Por favor verifica los campos de contraseña.");
      return;
    }

    setCargandoGuardar(true);
    const res = await actualizarPerfilAdmin({
      nombre,
      apellidos,
      passwordActual: passwordActual || undefined,
      nuevaPassword: nuevaPassword || undefined,
    });

    if (res.success) {
      toast.success("¡Perfil actualizado correctamente!");
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarNueva("");
    } else {
      toast.error(res.error);
    }
    setCargandoGuardar(false);
  };

  // SKELETON EXACTO DE TUS OTROS MÓDULOS MIENTRAS CARGA
  if (cargandoInfo) {
    return (
      <div className="w-full">
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 h-[3px] bg-orange-100/50 overflow-hidden relative mb-8">
          <div
            className="absolute top-0 left-0 h-full bg-orange-600 shadow-[0_0_12px_#ea580c]"
            style={{ width: "40%", animation: "slide 1s infinite linear" }}
          ></div>
        </div>

        <style>{`
          @keyframes slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-80 bg-slate-100 rounded-md animate-pulse"></div>
          </div>

          <div className="w-full h-96 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm animate-pulse mt-6 space-y-4">
            <div className="h-6 w-36 bg-slate-200 rounded"></div>
            <div className="space-y-4 pt-2">
              <div className="h-12 w-full bg-slate-100 rounded-lg"></div>
              <div className="h-12 w-full bg-slate-50 rounded-lg"></div>
              <div className="h-12 w-full bg-slate-50 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-10">
      <Toaster position="top-center" richColors />

      {/* Cabecera compacta estilo categorías */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-xs font-medium text-slate-500">
            Administra tu información personal y credenciales de acceso.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-5">
        
        {/* Sección Datos Personales */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Información Personal
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={15} className="text-slate-400" />
                </div>
                <input 
                  type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold text-slate-900" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Apellidos</label>
              <input 
                type="text" required value={apellidos} onChange={(e) => setApellidos(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold text-slate-900" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={15} className="text-slate-400" />
                </div>
                <input 
                  type="email" disabled value={correo}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Rol Asignado</label>
              <div className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg text-xs font-bold w-full">
                <ShieldCheck size={15} /> {rol}
              </div>
            </div>
          </div>
        </div>

        {/* Sección Seguridad / Contraseña */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1">
            Seguridad y Contraseña (Opcional)
          </h2>
          <p className="text-xs font-medium text-slate-500">Deja estos campos en blanco si no deseas modificar tu clave.</p>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Contraseña Actual</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={15} className="text-slate-400" />
              </div>
              <input 
                type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" 
                placeholder="Ingresa tu clave actual para validar"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nueva Contraseña</label>
              <input 
                type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400" 
                placeholder="Nueva clave"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Confirmar Nueva Contraseña</label>
              <input 
                type="password" value={confirmarNueva} onChange={(e) => setConfirmarNueva(e.target.value)}
                className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 text-sm font-semibold text-slate-900 placeholder:text-slate-400
                  ${confirmarNueva.length > 0 ? (passwordsCoinciden ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : 'border-slate-200 focus:ring-orange-500'}`}
                placeholder="Repite la nueva clave"
              />
            </div>
          </div>

          {/* Validadores dinámicos */}
          {nuevaPassword.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <ul className="text-xs space-y-1 font-medium">
                <li className={`flex items-center gap-2 ${reqs.longitud ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.longitud ? <Check size={13}/> : <X size={13}/>} De 8 a 12 caracteres</li>
                <li className={`flex items-center gap-2 ${reqs.mayuscula ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.mayuscula ? <Check size={13}/> : <X size={13}/>} Al menos una mayúscula</li>
                <li className={`flex items-center gap-2 ${reqs.minuscula ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.minuscula ? <Check size={13}/> : <X size={13}/>} Al menos una minúscula</li>
                <li className={`flex items-center gap-2 ${reqs.numero ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.numero ? <Check size={13}/> : <X size={13}/>} Al menos un número</li>
                <li className={`flex items-center gap-2 ${reqs.especial ? 'text-green-600 font-bold' : 'text-slate-500'}`}>{reqs.especial ? <Check size={13}/> : <X size={13}/>} Un carácter especial (@, $, etc.)</li>
              </ul>
            </div>
          )}
        </div>

        {/* Botón de Guardar */}
        <div className="pt-2 flex justify-end">
          <button 
            type="submit" disabled={cargandoGuardar}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer text-sm">
            {cargandoGuardar ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : "Guardar Cambios"}
          </button>
        </div>

      </form>
    </div>
  );
}