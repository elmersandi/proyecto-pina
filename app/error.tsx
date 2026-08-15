"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  
  useEffect(() => {
    console.error("Error crítico capturado por Next.js:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <ErrorState 
        titulo="Error en el Sistema"
        mensaje="Ocurrió un problema inesperado al cargar esta sección. Nuestro equipo ya ha sido notificado."
        onRetry={reset}
        rutaVolver="/"
      />
    </div>
  );
}