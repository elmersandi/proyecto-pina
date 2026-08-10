"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, Home, BookOpen, Phone, X, ChevronDown, ChevronRight } from "lucide-react";

interface Subcategoria {
  id: string;
  nombre: string;
}

interface Categoria {
  id: string;
  nombre: string;
  subcategorias: Subcategoria[];
}

interface NavbarProps {
  categorias: Categoria[];
}

export default function Navbar({ categorias }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const navLinks = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Cursos", href: "/cursos", icon: BookOpen },
    { name: "Contacto", href: "/contacto", icon: Phone },
  ];

  const toggleCategory = (catId: string) => {
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 flex flex-col">
        {/* Barra superior (Logo, Páginas, Buscador) */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex-1 flex items-center justify-start">
            <button 
              className="md:hidden text-blue-950 p-1 -ml-1 hover:bg-slate-100 rounded-md transition"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* LOGO ESCRITORIO */}
            <Link href="/" className="hidden md:flex items-center gap-1">
              <Image 
                src="/logo.png" 
                alt="Logo Proyecto Piña" 
                width={200} 
                height={60} 
                className="w-auto h-10" 
                priority 
              />
            </Link>
          </div>

          <div className="flex justify-center flex-shrink-0 h-full">
            <nav className="hidden md:flex items-center gap-8 h-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 h-full px-1 border-b-2 transition-colors font-medium text-sm ${
                      isActive
                        ? "border-yellow-500 text-blue-950"
                        : "border-transparent text-slate-600 hover:text-blue-950 hover:border-slate-300"
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? "text-yellow-500" : "text-slate-400"}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* LOGO MÓVIL (Centrado en la barra superior) */}
            <Link href="/" className="md:hidden flex items-center gap-1 h-full">
              <Image 
                src="/logo.png" 
                alt="Logo Proyecto Piña" 
                width={150} 
                height={45} 
                className="w-auto h-8" 
                priority 
              />
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="relative hidden md:block w-48 lg:w-64">
              <input 
                type="text" 
                placeholder="Buscar curso..." 
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent focus:bg-white focus:border-blue-950 rounded-md text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button className="md:hidden text-blue-950 p-1 -mr-1 hover:bg-slate-100 rounded-md transition">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* SUB-BARRA DE CATEGORÍAS (Solo Escritorio) */}
        <div className="hidden md:block bg-slate-800 border-b border-slate-900">
          <div className="container mx-auto px-4 flex items-center flex-wrap gap-x-8 gap-y-1">
            {categorias.map((cat) => (
              <div key={cat.id} className="relative group">
                <div className="flex items-center gap-1 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                  {cat.nombre}
                  {cat.subcategorias.length > 0 && <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-200" />}
                </div>
                
                {cat.subcategorias.length > 0 && (
                  <div className="absolute top-full left-0 hidden group-hover:block pt-1 z-50">
                    <div className="w-56 bg-white border border-slate-200 shadow-xl rounded-b-md overflow-hidden py-1">
                      {cat.subcategorias.map((sub) => (
                        <Link 
                          key={sub.id} 
                          href={`/cursos?subcategoria=${sub.id}`}
                          className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          {sub.nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ================= MENÚ MÓVIL (Con Acordeón) ================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex">
          <div className="fixed inset-0 bg-blue-950/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          <div className="relative w-[280px] h-full bg-white shadow-xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-left">
            <button className="absolute top-5 right-5 text-slate-500 hover:text-blue-950" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>

            {/* LOGO EN EL MENÚ DESPLEGABLE MÓVIL */}
            <div className="flex flex-col items-center border-b border-slate-100 pb-6 mb-6 mt-4">
              <Image 
                src="/logo.png" 
                alt="Logo Proyecto Piña" 
                width={200} 
                height={60} 
                className="w-auto h-12" 
                priority 
              />
            </div>

            {/* SECCIÓN 1: PÁGINAS */}
            <span className="text-xs font-bold text-blue-950 tracking-wider mb-4 uppercase">Navegación Principal</span>
            <nav className="flex flex-col gap-2 mb-8 border-b border-slate-100 pb-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-slate-50 text-blue-600 border-l-4 border-blue-600" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-950 border-l-4 border-transparent"
                    }`}
                  >
                    <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* SECCIÓN 2: CATEGORÍAS (Acordeón) */}
            <span className="text-xs font-bold text-blue-950 tracking-wider mb-4 uppercase">Categorías de Cursos</span>
            <div className="flex flex-col gap-1 pb-10">
              {categorias.map((cat) => {
                const isExpanded = expandedCategory === cat.id;
                
                return (
                  <div key={cat.id} className="flex flex-col">
                    <button 
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isExpanded ? "text-blue-600" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat.nombre}
                      {cat.subcategorias.length > 0 && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      )}
                    </button>
                    
                    {isExpanded && cat.subcategorias.length > 0 && (
                      <div className="flex flex-col gap-1 pl-4 pr-2 py-2 mt-1 border-l-2 border-slate-100 ml-4 animate-in slide-in-from-top-2">
                        {cat.subcategorias.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/cursos?subcategoria=${sub.id}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 py-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <ChevronRight className="w-3 h-3 opacity-50" />
                            {sub.nombre}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}