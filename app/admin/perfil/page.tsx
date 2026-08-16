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

  if (cargandoInfo) {
    return (
      <div className="w-full space-y-8">
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

          <div className="w-full h-96 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
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
    // Aquí está el cambio clave: 'w-full space-y-8' para que iguale al Dashboard
    <div className="space-y-8">

      {/* Cabecera idéntica al Dashboard */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Mi Perfil</h1>
        <p className="text-sm text-slate-500 mt-1">
          Administra tu información personal y credenciales de acceso.
        </p>
      </div>

      {/* Formulario a todo el ancho */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* Sección Datos Personales */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
            Información Personal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-400" />
                </div>
                <input 
                  type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm font-semibold text-slate-800" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Apellidos</label>
              <input 
                type="text" required value={apellidos} onChange={(e) => setApellidos(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm font-semibold text-slate-800" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input 
                  type="email" disabled value={correo}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Rol Asignado</label>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold w-full">
                <ShieldCheck size={16} /> {rol}
              </div>
            </div>
          </div>
        </div>

        {/* Sección Seguridad / Contraseña */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1">
              Seguridad y Contraseña (Opcional)
            </h2>
            <p className="text-sm text-slate-500">Deja estos campos en blanco si no deseas modificar tu clave.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Contraseña Actual</label>
              <div className="relative md:w-1/2 pr-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input 
                  type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm font-semibold text-slate-800 placeholder:text-slate-400" 
                  placeholder="Ingresa tu clave actual para validar"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Nueva Contraseña</label>
              <input 
                type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm font-semibold text-slate-800 placeholder:text-slate-400" 
                placeholder="Nueva clave"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Confirmar Nueva Contraseña</label>
              <input 
                type="password" value={confirmarNueva} onChange={(e) => setConfirmarNueva(e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 text-sm font-semibold text-slate-800 placeholder:text-slate-400
                  ${confirmarNueva.length > 0 ? (passwordsCoinciden ? 'border-emerald-500 focus:ring-emerald-500' : 'border-red-500 focus:ring-red-500') : 'border-slate-200 focus:ring-orange-500'}`}
                placeholder="Repite la nueva clave"
              />
            </div>
          </div>

          {/* Validadores dinámicos */}
          {nuevaPassword.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                <li className={`flex items-center gap-2 ${reqs.longitud ? 'text-emerald-600' : 'text-slate-500'}`}>{reqs.longitud ? <Check size={14}/> : <X size={14}/>} De 8 a 12 caracteres</li>
                <li className={`flex items-center gap-2 ${reqs.mayuscula ? 'text-emerald-600' : 'text-slate-500'}`}>{reqs.mayuscula ? <Check size={14}/> : <X size={14}/>} Al menos una mayúscula</li>
                <li className={`flex items-center gap-2 ${reqs.minuscula ? 'text-emerald-600' : 'text-slate-500'}`}>{reqs.minuscula ? <Check size={14}/> : <X size={14}/>} Al menos una minúscula</li>
                <li className={`flex items-center gap-2 ${reqs.numero ? 'text-emerald-600' : 'text-slate-500'}`}>{reqs.numero ? <Check size={14}/> : <X size={14}/>} Al menos un número</li>
                <li className={`flex items-center gap-2 ${reqs.especial ? 'text-emerald-600' : 'text-slate-500'}`}>{reqs.especial ? <Check size={14}/> : <X size={14}/>} Un carácter especial (@, $, etc.)</li>
              </ul>
            </div>
          )}
        </div>

        {/* Botón de Guardar */}
        <div className="pt-4 flex justify-end border-t border-slate-100">
          <button 
            type="submit" disabled={cargandoGuardar}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer text-sm">
            {cargandoGuardar ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : "Guardar Cambios"}
          </button>
        </div>

      </form>
    </div>
  );
}