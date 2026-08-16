"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { categoriaSchema } from "@/lib/validations/categoria.schema";

// 1. Creamos nuestra propia interfaz estricta (Cero "any")
interface PrismaError extends Error {
  code: string;
}

// 2. Creamos un "Guachimán de Tipos" (Type Guard)
function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "string"
  );
}

export async function obtenerCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { subcategorias: true, cursos: true } },
        subcategorias: {
          select: {
            id: true,
            nombre: true,
            _count: { select: { cursos: true } },
          },
        },
        cursos: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });
    return { success: true, data: categorias };
  } catch (error: unknown) {
    // Validación segura para consola
    if (error instanceof Error) {
      console.error("obtenerCategorias:", error.message);
    } else {
      console.error("obtenerCategorias:", "Error desconocido");
    }
    return { success: false, error: "No se pudieron cargar las categorías." };
  }
}

export async function crearCategoria(formData: FormData) {
  try {
    const raw = {
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      descripcion: formData.get("descripcion"),
    };
    const datos = categoriaSchema.parse(raw);

    const nueva = await prisma.categoria.create({ data: datos });
    revalidatePath("/admin/categorias");
    return { success: true, data: nueva };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    
    // 3. Usamos nuestro validador estricto para leer el código de error
    if (isPrismaError(error)) {
      if (error.code === "P2002") {
        return { success: false, error: "El nombre o slug ya existe." };
      }
    }
    return { success: false, error: "Error al crear la categoría." };
  }
}

export async function actualizarCategoria(id: string, formData: FormData) {
  try {
    const raw = {
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      descripcion: formData.get("descripcion"),
    };
    const datos = categoriaSchema.parse(raw);

    const actualizada = await prisma.categoria.update({
      where: { id },
      data: datos,
    });
    revalidatePath("/admin/categorias");
    return { success: true, data: actualizada };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (isPrismaError(error)) {
      if (error.code === "P2002") {
        return { success: false, error: "El nombre o slug ya está en uso." };
      }
    }
    return { success: false, error: "Error al actualizar la categoría." };
  }
}

export async function eliminarCategoria(id: string) {
  try {
    await prisma.categoria.delete({ where: { id } });
    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (error: unknown) {
    if (isPrismaError(error)) {
      if (error.code === "P2003") {
        return {
          success: false,
          error: "Primero elimina o reasigna las subcategorías y cursos asociados.",
        };
      }
    }
    return { success: false, error: "No se pudo eliminar la categoría." };
  }
}