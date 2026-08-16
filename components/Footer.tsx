// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
// 1. Quitamos Facebook, Instagram y Youtube de aquí:
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 pt-16 pb-8 border-t-4">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* ================= GRID PRINCIPAL (4 Columnas) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Columna 1: Logo y Descripción */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="bg-white px-5 py-3 rounded-2xl mb-5 inline-block shadow-lg">
              <Image 
                src="/logo.png" 
                alt="Logo Proyecto Piña" 
                width={180} 
                height={55} 
                className="h-12 w-auto" 
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Preparación pre-universitaria y prepolicial de excelencia en la Amazonía peruana. Asegura tu ingreso a la universidad con nuestra metodología.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold text-lg mb-5 font-heading">
              Enlaces Rápidos
            </h4>
            <ul className="flex flex-col gap-3">
              {['Inicio', 'Cursos', 'Contacto'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase() === 'inicio' ? '' : item.toLowerCase()}`} className="text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1 text-sm font-medium group">
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Información de Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold text-lg mb-5 font-heading">
              Contáctanos
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400 font-medium">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>
                  Alférez West # 429 <br/>
                  Iquitos 16001, Perú
                </span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span>+51 999 999 999</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span>informes@proyectopina.com</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Horarios y Redes Sociales */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold text-lg mb-5 font-heading">
              Síguenos
            </h4>
            <p className="text-sm text-slate-400 mb-4 text-center md:text-left font-medium">
              Únete a nuestra comunidad y entérate de los próximos simulacros y seminarios.
            </p>
            
            {/* 2. Reemplazamos los componentes por SVGs puros con el mismo estilo de Lucide */}
            <div className="flex items-center gap-4">
              {/* FACEBOOK */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-yellow-500 hover:text-blue-950 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              
              {/* INSTAGRAM */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-yellow-500 hover:text-blue-950 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              
              {/* YOUTUBE */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-yellow-500 hover:text-blue-950 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M2.5 7.1C2.6 6.3 3.3 5.6 4.1 5.5C5.9 5.2 12 5.2 12 5.2s6.1 0 7.9.3c.8.1 1.5.8 1.6 1.6.3 2 .3 4.9.3 4.9s0 2.9-.3 4.9c-.1.8-.8 1.5-1.6 1.6-1.8.3-7.9.3-7.9.3s-6.1 0-7.9-.3c-.8-.1-1.5-.8-1.6-1.6C2.2 14.8 2.2 11.9 2.2 11.9s0-2.9.3-4.8z"></path>
                  <polygon points="9.5 15.5 15.5 11.9 9.5 8.3 9.5 15.5"></polygon>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* ================= BARRA DE COPYRIGHT ================= */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            © {currentYear} Academia Proyecto Piña. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 font-medium justify-center md:justify-start">
            <Link href="/terminos" className="hover:text-yellow-400 transition-colors">
              Términos de servicio
            </Link>
            <Link href="/privacidad" className="hover:text-yellow-400 transition-colors">
              Políticas de privacidad
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}