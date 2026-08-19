import { ReactNode } from "react";
import AdminClientLayout from "./AdminClientLayout"; // Importamos tu diseño cliente

// 🔥 EL ESCUDO: ESTAS LÍNEAS DESTRUYEN LA CACHÉ DE HOSTINGER SOLO PARA EL ADMIN 🔥
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}