// app/admin/layout.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner"; // <-- 1. Importamos el Toaster
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
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { obtenerPerfilAdmin, cerrarSesion } from "@/actions/auth.action";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Nuevo estado para la "Cortina de Seguridad" (evita el flasheo visual)
  const [isValidando, setIsValidando] = useState(true);

  // Tipamos el estado estrictamente
  const [usuario, setUsuario] = useState<{
    nombre: string;
    apellidos: string;
  } | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Llamada segura sin 'any' y con salvavidas para nulos
    obtenerPerfilAdmin().then((res) => {
      if (res) {
        setUsuario({
          nombre: res.nombre || "",
          apellidos: res.apellidos || "",
        });
        setIsValidando(false); // ¡Pasó la prueba! Quitamos la cortina.
      } else {
        // Destruimos la cookie y lo mandamos al login directamente aquí
        cerrarSesion().then(() => {
          router.push("/login");
        });
      }
    });

    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (ruta: string) => {
    if (ruta === "/admin") return pathname === "/admin";
    return pathname.startsWith(ruta);
  };

  const handleLogout = async () => {
    await cerrarSesion();
    router.push("/login");
  };

  // La Cortina de Seguridad: No mostramos NADA del panel si 'isValidando' es true
  if (isSidebarOpen === null || isValidando) {
    return (
      <div className="flex h-screen bg-slate-100 items-center justify-center">
        <div className="animate-pulse text-slate-500 font-medium">
          Validando seguridad...
        </div>
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const iniciales = usuario
    ? `${usuario.nombre.charAt(0)}${usuario.apellidos.charAt(0)}`.toUpperCase()
    : "";

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
      {/* 2. Colocamos el Toaster para que los mensajes se vean en todo el panel */}
      <Toaster position="top-right" richColors />

      {/* ========== SIDEBAR ========== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link
            href="/admin"
            className="block transition-transform hover:scale-105"
          >
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
          <button
            className="md:hidden text-slate-400 hover:text-white shrink-0 ml-2"
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {[
            { href: "/admin", label: "Panel", icon: LayoutDashboard },
            { href: "/admin/cursos", label: "Cursos", icon: BookOpen },
            {
              href: "/admin/categorias",
              label: "Categorías",
              icon: FolderTree,
            },
            {
              href: "/admin/subcategorias",
              label: "Subcategorías",
              icon: ListTree,
            },
            { href: "/admin/perfil", label: "Perfil", icon: CircleUser },
          ].map((link) => {
            const Icono = link.icon;
            const activo = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                  activo
                    ? "bg-orange-600 text-white shadow-md shadow-orange-900/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icono
                  className={`w-4 h-4 ${activo ? "text-white" : "text-orange-500"}`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
      >
        {/* Cabecera */}
        <header className="bg-white border-b border-slate-200 flex items-center justify-between px-4 py-3 shrink-0 h-[64px] shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              aria-label="Alternar menú"
            >
              <span className="hidden md:block">
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeft className="w-5 h-5" />
                )}
              </span>
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
            {/* Avatar / Perfil Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-100 border-2 border-slate-200 hover:border-orange-500 hover:shadow-md transition cursor-pointer font-semibold tracking-wider text-sm"
              >
                {iniciales ? iniciales : <UserIcon className="w-5 h-5" />}
              </button>

              {/* Menú Desplegable */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {usuario ? `${usuario.nombre}` : "Administrador"}
                    </p>
                    <p className="text-xs text-slate-500">Sesión iniciada</p>
                  </div>

                  <Link
                    href="/admin/perfil"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <CircleUser className="w-4 h-4 text-slate-400" />
                    Mi Perfil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido Dinámico */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}