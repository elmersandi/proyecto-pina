"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { subcategoriaSchema } from "@/lib/validations/subcategoria.schema";

export async function obtenerSubcategorias() {
  try {
    const subcategorias = await prisma.subcategoria.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categoria: {
          select: { id: true, nombre: true },
        },
        _count: { select: { cursos: true } },
        cursos: {
          select: { id: true, titulo: true },
        },
      },
    });
    return { success: true, data: subcategorias };
  } catch (error) {
    console.error("obtenerSubcategorias:", error);
    return { success: false, error: "No se pudieron cargar las subcategorías." };
  }
}

export async function crearSubcategoria(formData: FormData) {
  try {
    const raw = {
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      categoriaId: formData.get("categoriaId"),
    };
    const datos = subcategoriaSchema.parse(raw);

    const nueva = await prisma.subcategoria.create({ data: datos });
    revalidatePath("/admin/subcategorias");
    return { success: true, data: nueva };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "El nombre o slug ya existe." };
      }
    }
    return { success: false, error: "Error al crear la subcategoría." };
  }
}

export async function actualizarSubcategoria(id: string, formData: FormData) {
  try {
    const raw = {
      nombre: formData.get("nombre"),
      slug: formData.get("slug"),
      categoriaId: formData.get("categoriaId"),
    };
    const datos = subcategoriaSchema.parse(raw);

    const actualizada = await prisma.subcategoria.update({
      where: { id },
      data: datos,
    });
    revalidatePath("/admin/subcategorias");
    return { success: true, data: actualizada };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "El nombre o slug ya está en uso." };
      }
    }
    return { success: false, error: "Error al actualizar la subcategoría." };
  }
}

export async function eliminarSubcategoria(id: string) {
  try {
    await prisma.subcategoria.delete({ where: { id } });
    revalidatePath("/admin/subcategorias");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          success: false,
          error: "Primero elimina o reasigna los cursos asociados.",
        };
      }
    }
    return { success: false, error: "No se pudo eliminar la subcategoría." };
  }
}