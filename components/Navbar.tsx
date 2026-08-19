"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { Menu, Search, Home, BookOpen, Phone, X, ChevronDown, ChevronRight, ChevronLeft, ArrowLeft, Loader2 } from "lucide-react";
import { buscarCursosRapido } from "@/actions/curso.action";

interface Subcategoria { id: string; nombre: string; }
interface Categoria { id: string; nombre: string; subcategorias: Subcategoria[]; }
interface NavbarProps { categorias: Categoria[]; }

function NavbarInner({ categorias }: NavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeCategoriaId = searchParams.get("categoria");
  const activeSubcategoriaId = searchParams.get("subcategoria");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<{ id: string; titulo: string; slug: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // 🔥 REFERENCIAS PARA LA BARRA ESCRITORIO 🔥
  const subNavRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
  const [dropdownLeft, setDropdownLeft] = useState<number>(0);

  const navLinks = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Cursos", href: "/cursos", icon: BookOpen },
    { name: "Contacto", href: "/contacto", icon: Phone },
  ];

  const toggleCategory = (catId: string) => setExpandedCategory(expandedCategory === catId ? null : catId);

  // Función para las flechas del carrusel
  const scrollCat = (dir: "izq" | "der") => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({ left: dir === "izq" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const hoveredCategoryData = categorias.find(c => c.id === hoveredCatId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        setShowDropdown(true);
        const res = await buscarCursosRapido(query.trim());
        if (res.success && res.data) setResultados(res.data);
        setIsSearching(false);
      } else {
        setResultados([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      setIsMobileSearchOpen(false);
      router.push(`/cursos?busqueda=${encodeURIComponent(query.trim())}`);
    }
  };

  const renderResultadosDropdown = () => {
    if (!showDropdown) return null;
    return (
      <div className="absolute top-full mt-2 left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
        {isSearching ? (
          <div className="p-4 flex justify-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : resultados.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {resultados.map((curso) => (
              <li key={curso.id}>
                <Link
                  href={`/cursos/${curso.slug}`}
                  onClick={() => { setShowDropdown(false); setIsMobileSearchOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-sm font-semibold text-slate-700 line-clamp-1">{curso.titulo}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : query.length >= 2 ? (
          <div className="p-4 text-center text-sm text-slate-500 font-medium">No se encontraron cursos.</div>
        ) : null}
      </div>
    );
  };

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header className="bg-white sticky top-0 z-50 flex flex-col shadow-sm">
        
        {/* Barra superior blanca (Logo, Páginas, Buscador) */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative border-b border-slate-200" ref={searchContainerRef}>
          <div className={`flex items-center justify-between w-full h-full ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-1 flex items-center justify-start">
              <button className="md:hidden text-blue-950 p-1 -ml-1 hover:bg-slate-100 rounded-md transition cursor-pointer" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="hidden md:flex items-center gap-1">
                <Image src="/logo.png" alt="Logo Proyecto Piña" width={200} height={60} className="w-auto h-10" priority />
              </Link>
            </div>

            <div className="flex justify-center flex-shrink-0 h-full">
              <nav className="hidden md:flex items-center gap-8 h-full">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name} href={link.href}
                      className={`flex items-center gap-2 h-full px-1 border-b-2 transition-colors font-medium text-sm ${isActive ? "border-yellow-500 text-blue-950" : "border-transparent text-slate-600 hover:text-blue-950 hover:border-slate-300"}`}
                    >
                      <link.icon className={`w-4 h-4 ${isActive ? "text-yellow-500" : "text-slate-400"}`} />{link.name}
                    </Link>
                  );
                })}
              </nav>
              <Link href="/" className="md:hidden flex items-center gap-1 h-full">
                <Image src="/logo.png" alt="Logo Proyecto Piña" width={150} height={45} className="w-auto h-8" priority />
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-end relative">
              <div className="hidden md:block w-48 lg:w-72">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input 
                    type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => query.trim().length >= 2 && setShowDropdown(true)} placeholder="Buscar curso..." 
                    className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent focus:bg-white focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 rounded-lg text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </form>
                {renderResultadosDropdown()}
              </div>
              <button className="md:hidden text-blue-950 p-1 -mr-1 hover:bg-slate-100 rounded-md transition cursor-pointer" onClick={() => setIsMobileSearchOpen(true)}>
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isMobileSearchOpen && (
            <div className="md:hidden flex items-center w-full h-full gap-2 animate-in slide-in-from-right-4 duration-200">
              <button onClick={() => { setIsMobileSearchOpen(false); setQuery(""); setShowDropdown(false); }} className="text-slate-500 hover:text-blue-950 p-1 -ml-1 transition cursor-pointer">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 relative h-10">
                <form onSubmit={handleSearchSubmit} className="h-full">
                  <input 
                    autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar curso..." 
                    className="w-full h-full pl-4 pr-10 bg-slate-100 border-none rounded-lg text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-950/20 placeholder:text-slate-400"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
                {renderResultadosDropdown()}
              </div>
            </div>
          )}
        </div>

        {/* 🔥 SUB-BARRA DE CATEGORÍAS (ESCRITORIO) 🔥 */}
        <div 
          ref={subNavRef}
          className="hidden md:block bg-slate-800 relative z-[60]"
          onMouseLeave={() => setHoveredCatId(null)}
        >
          <div className="w-full px-2 lg:px-4 flex items-stretch">
            
            {/* Flecha Izquierda sin fondo ni borde */}
            <button
              onClick={() => scrollCat("izq")}
              className="px-2 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center z-10"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Contenedor Carrusel */}
            <div ref={scrollRef} className="flex-1 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-x-8 px-2">
              {categorias.map((cat) => {
                const isCatActive = activeCategoriaId === cat.id;
                return (
                  <div
                    key={cat.id}
                    onMouseEnter={(e) => {
                      setHoveredCatId(cat.id);
                      if (subNavRef.current) {
                        const itemRect = e.currentTarget.getBoundingClientRect();
                        const containerRect = subNavRef.current.getBoundingClientRect();
                        let leftPos = itemRect.left - containerRect.left;
                        
                        // Protección para no salirse de la pantalla a la derecha
                        const dropdownWidth = 260; // Ancho base estimado del cajón
                        if (itemRect.left + dropdownWidth > window.innerWidth) {
                          leftPos = window.innerWidth - dropdownWidth - 20; // 20px de seguridad
                        }
                        
                        setDropdownLeft(leftPos);
                      }
                    }}
                    className={`flex items-center gap-1 py-2.5 text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isCatActive ? "text-yellow-400 font-semibold" : "text-slate-300 hover:text-white font-medium"
                    }`}
                  >
                    <Link href={`/cursos?categoria=${cat.id}`} className="hover:underline underline-offset-4">
                      {cat.nombre}
                    </Link>
                    {cat.subcategorias.length > 0 && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${hoveredCatId === cat.id ? "rotate-180 text-white" : ""}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Flecha Derecha sin fondo ni borde */}
            <button
              onClick={() => scrollCat("der")}
              className="px-2 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center z-10"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* 🔥 DROPDOWN FLOTANTE DINÁMICO (TIPO TOOLTIP) 🔥 */}
          {hoveredCategoryData && hoveredCategoryData.subcategorias.length > 0 && (
            <div 
              className="absolute top-full bg-white shadow-xl z-50 border border-slate-200 border-t-0 rounded-b-xl py-4 px-6 min-w-[240px]"
              style={{ left: Math.max(0, dropdownLeft) }}
            >
              <div className="flex flex-col gap-3.5">
                {hoveredCategoryData.subcategorias.map((sub) => {
                  const isSubActive = activeSubcategoriaId === sub.id;
                  return (
                    <Link
                      key={sub.id}
                      href={`/cursos?subcategoria=${sub.id}`}
                      onClick={() => setHoveredCatId(null)}
                      className={`text-sm transition-colors ${
                        isSubActive 
                          ? "text-blue-700 font-bold" 
                          : "text-slate-800 font-semibold hover:text-blue-600"
                      }`}
                    >
                      {sub.nombre}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ================= MENÚ MÓVIL ================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex">
          <div className="fixed inset-0 bg-blue-950/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-[280px] h-full bg-white shadow-xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-left">
            <button className="absolute top-5 right-5 text-slate-500 hover:text-blue-950" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center border-b border-slate-100 pb-6 mb-6 mt-4">
              <Image src="/logo.png" alt="Logo" width={200} height={60} className="w-auto h-12" priority />
            </div>
            <span className="text-xs font-bold text-blue-950 tracking-wider mb-4 uppercase">Navegación Principal</span>
            <nav className="flex flex-col gap-2 mb-8 border-b border-slate-100 pb-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-slate-50 text-blue-600 border-l-4 border-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-blue-950 border-l-4 border-transparent"}`}
                  >
                    <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />{link.name}
                  </Link>
                );
              })}
            </nav>
            <span className="text-xs font-bold text-blue-950 tracking-wider mb-4 uppercase">Categorías de Cursos</span>
            <div className="flex flex-col gap-1 pb-10">
              {categorias.map((cat) => {
                const isCatActive = activeCategoriaId === cat.id;
                const isExpanded = expandedCategory === cat.id || isCatActive;
                return (
                  <div key={cat.id} className="flex flex-col">
                    <div className={`flex items-center justify-between rounded-lg transition-colors ${isExpanded || isCatActive ? "bg-slate-50" : ""}`}>
                      <Link 
                        href={`/cursos?categoria=${cat.id}`} onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex-1 py-2.5 px-3 text-sm font-medium transition-colors ${isCatActive ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-950"}`}
                      >
                        {cat.nombre}
                      </Link>
                      {cat.subcategorias.length > 0 && (
                        <button onClick={() => toggleCategory(cat.id)} className="p-2.5 text-slate-400 hover:text-blue-600 transition-colors">
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {isExpanded && cat.subcategorias.length > 0 && (
                      <div className="flex flex-col gap-1 pl-4 pr-2 py-2 mt-1 border-l-2 border-slate-100 ml-4 animate-in slide-in-from-top-2">
                        {cat.subcategorias.map((sub) => {
                          const isSubActive = activeSubcategoriaId === sub.id;
                          return (
                            <Link
                              key={sub.id} href={`/cursos?subcategoria=${sub.id}`} onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-2 py-2 text-sm transition-colors ${isSubActive ? "text-blue-600 font-semibold" : "text-slate-500 hover:text-blue-600"}`}
                            >
                              <ChevronRight className={`w-3 h-3 ${isSubActive ? "text-blue-500 opacity-100" : "opacity-50"}`} />{sub.nombre}
                            </Link>
                          );
                        })}
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

export default function Navbar({ categorias }: NavbarProps) {
  return (
    <Suspense fallback={<header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-50"></header>}>
      <NavbarInner categorias={categorias} />
    </Suspense>
  );
}