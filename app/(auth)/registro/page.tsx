import Image from "next/image";
import Link from "next/link";
import { Toaster } from "sonner";
import FormularioRegistro from "./components/Formulario";

export default function RegistroPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <Toaster position="top-center" richColors />
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col items-center">
          
          {/* Logo más chiquito y dentro de la tarjeta */}
          <Link href="/" className="mb-4 cursor-pointer">
            <Image src="/logo.png" alt="Logo" width={130} height={45} className="object-contain" />
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Registrarme</h1>
          <p className="text-slate-600 text-sm text-center mb-8 font-medium">
            Crea tu cuenta de administrador
          </p>

          <div className="w-full">
            <FormularioRegistro />
          </div>
          
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-sm text-slate-700 font-medium">
            ¿Ya tienes cuenta? <Link href="/login" className="font-bold text-blue-950 hover:underline cursor-pointer">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </main>
  );
}