"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorStateProps {
  titulo?: string;
  mensaje?: string;
  onRetry?: () => void;
  rutaVolver?: string;
}

export default function ErrorState({
  titulo = "¡Ups! Algo salió mal",
  mensaje = "Ha ocurrido un error inesperado al procesar tu solicitud. Por favor, inténtalo de nuevo en unos momentos.",
  onRetry,
  rutaVolver = "/admin"
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 text-center animate-in fade-in zoom-in duration-300">
      
      {/* Ícono de Error */}
      <div className="bg-red-50 p-5 rounded-full mb-6 border border-red-100 shadow-sm">
        <AlertTriangle size={56} className="text-red-500" />
      </div>
      
      {/* Textos con alto contraste */}
      <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">{titulo}</h2>
      <p className="text-base font-medium text-slate-600 mb-8 leading-relaxed">
        {mensaje}
      </p>
      
      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md"
          >
            <RotateCcw size={18} />
            Reintentar
          </button>
        )}
        
        <Link
          href={rutaVolver}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-800 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
        >
          <Home size={18} />
          Volver al Inicio
        </Link>
      </div>

    </div>
  );
}