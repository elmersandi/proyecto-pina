import ErrorState from "@/components/ErrorState";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <ErrorState 
        titulo="Página no encontrada (404)"
        mensaje="Ups, parece que te perdiste. La ruta a la que intentas acceder no existe, fue movida o eliminada."
        rutaVolver="/"
      />
    </div>
  );
}