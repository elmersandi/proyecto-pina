// app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  ListTree,
  CircleUser,
  PanelLeft,
  PanelLeftClose,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inicializamos como null para evitar diferencias de hidratación
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean | null>(null);

  useEffect(() => {
    // Determina el estado según el tamaño de pantalla actual
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    handleResize(); // primera ejecución
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mientras no tengamos el estado definido, mostramos un esqueleto mínimo o nada
  if (isSidebarOpen === null) {
    return (
      <div className="flex h-screen bg-slate-100 items-center justify-center">
        <div className="animate-pulse text-slate-400">Cargando panel...</div>
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
      {/* ========== SIDEBAR (siempre fixed) ========== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          
          {/* Logo con fondo blanco para que resalte sobre el fondo oscuro */}
          <Link href="/admin" className="block transition-transform hover:scale-105">
            <div className="bg-white px-3 py-2 rounded-xl shadow-sm">
              <Image
                src="/log-pina.webp"
                alt="Logo Proyecto Piña"
                width={160}
                height={60}
                className="w-auto h-10 object-contain"
                priority
              />
            </div>
          </Link>

          {/* Botón cerrar (solo móvil) */}
          <button
            className="md:hidden text-slate-400 hover:text-white shrink-0 ml-2"
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition text-sm font-medium"
          >
            <LayoutDashboard className="w-4 h-4 text-orange-600" />
            Panel
          </Link>
          <Link
            href="/admin/cursos"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition text-sm font-medium"
          >
            <BookOpen className="w-4 h-4 text-orange-600" />
            Cursos
          </Link>
          <Link
            href="/admin/categorias"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition text-sm font-medium"
          >
            <FolderTree className="w-4 h-4 text-orange-600" />
            Categorías
          </Link>
          <Link
            href="/admin/subcategorias"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition text-sm font-medium"
          >
            <ListTree className="w-4 h-4 text-orange-600" />
            Subcategorías
          </Link>
          <Link
            href="/admin/perfil"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition text-sm font-medium"
          >
            <CircleUser className="w-4 h-4 text-orange-600" />
            Perfil
          </Link>
        </nav>
      </aside>

      {/* Overlay solo en móvil cuando sidebar está abierto */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Cabecera */}
        <header className="bg-white border-b border-slate-200 flex items-center justify-between px-4 py-3 shrink-0 h-[64px]">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {/* Escritorio: ícono de panel */}
              <span className="hidden md:block">
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeft className="w-5 h-5" />
                )}
              </span>
              {/* Móvil: hamburguesa o X */}
              <span className="md:hidden">
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </span>
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
              Administración
            </h2>
          </div>

          <div className="flex items-center gap-4">

            {/* Ícono de perfil tipo avatar */}
            <Link
              href="/admin/perfil"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
            >
              <CircleUser className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}