"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { cursoSchema } from "@/lib/validations/curso.schema";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

// --- Guachimán de Tipos para Prisma ---
interface PrismaError extends Error {
  code: string;
}

function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "string"
  );
}

// =========================================================================
// LA BÓVEDA PERSISTENTE: Guardamos 1 nivel arriba del código de Next.js
// =========================================================================
const PROJECT_ROOT = process.cwd();
const PERSISTENT_DIR = path.join(PROJECT_ROOT, "..", "storage_pina");

async function uploadFile(file: File, tipoLog: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${ext}`;
  const filePath = path.join(PERSISTENT_DIR, fileName);

  console.log(`Guardando ${fileName} (${tipoLog}) en la Bóveda Persistente...`);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    await mkdir(PERSISTENT_DIR, { recursive: true }); // Crea la bóveda si no existe
    await writeFile(filePath, buffer);
    console.log(`Archivo guardado exitosamente: ${filePath}`);
    
    // Devolvemos la ruta de la API que crearemos en el Paso 2
    return `/api/archivos/${fileName}`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error al guardar archivo:`, error.message);
    }
    throw new Error(`Error al guardar archivo en el servidor`);
  }
}

async function deleteFile(url: string) {
  // Extraemos solo el nombre del archivo de la url (ej: /api/archivos/mi-foto.png -> mi-foto.png)
  const fileName = url.split("/").pop();
  if (!fileName) return;

  const filePath = path.join(PERSISTENT_DIR, fileName);

  try {
    console.log(`Eliminando archivo de la bóveda: ${filePath}`);
    await unlink(filePath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`No se pudo eliminar:`, error.message);
    }
  }
}

// --- Obtener cursos con relaciones ---
export async function obtenerCursos() {
  try {
    const cursos = await prisma.curso.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categoria: { select: { id: true, nombre: true } },
        subcategoria: { select: { id: true, nombre: true } },
      },
    });
    return { success: true, data: cursos };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("obtenerCursos:", error.message);
    }
    return { success: false, error: "No se pudieron cargar los cursos." };
  }
}

// --- Crear curso ---
export async function crearCurso(formData: FormData) {
  try {
    const raw = {
      titulo: formData.get("titulo")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      descripcionCorta: formData.get("descripcionCorta")?.toString() || "",
      descripcion: formData.get("descripcion")?.toString() || "",
      esGratis: formData.get("esGratis") === "true",
      precio: formData.get("precio") ? parseFloat(formData.get("precio") as string) : undefined,
      publicado: formData.get("publicado") === "true",
      categoriaId: formData.get("categoriaId")?.toString() || "",
      subcategoriaId: formData.get("subcategoriaId")?.toString() || undefined,
    };

    const { portada: _p, pdf: _pdf, ...schemaSinArchivos } = cursoSchema.shape;
    const schemaParcial = z.object(schemaSinArchivos);
    const validacion = schemaParcial.safeParse(raw);

    if (!validacion.success) {
      return { success: false, error: validacion.error.issues[0].message };
    }

    const datosValidados = validacion.data;
    const portadaFile = formData.get("portada") as File | null;
    const pdfFile = formData.get("pdf") as File | null;

    if (!pdfFile || pdfFile.size === 0) {
      throw new Error("El archivo PDF es obligatorio.");
    }

    const pdfUrl = await uploadFile(pdfFile, "PDF");
    let portadaUrl: string | null = null;
    if (portadaFile && portadaFile.size > 0) {
      portadaUrl = await uploadFile(portadaFile, "Portada");
    }

    const curso = await prisma.curso.create({
      data: {
        ...datosValidados,
        precio: datosValidados.precio ?? null,
        subcategoriaId: datosValidados.subcategoriaId ?? null,
        tituloBusqueda: datosValidados.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
        portadaUrl,
        pdfUrl,
      },
    });

    // ¡CACHÉ ARREGLADA!
    revalidatePath("/admin/cursos");
    revalidatePath("/"); 
    revalidatePath("/cursos");
    return { success: true, data: curso };
  } catch (error: unknown) {
    if (isPrismaError(error) && error.code === "P2002") {
      return { success: false, error: "El título o slug ya existe." };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al crear el curso." };
  }
}

// --- Actualizar curso ---
export async function actualizarCurso(id: string, formData: FormData) {
  try {
    const cursoActual = await prisma.curso.findUnique({ where: { id } });
    if (!cursoActual) throw new Error("Curso no encontrado.");

    const raw = {
      titulo: formData.get("titulo")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      descripcionCorta: formData.get("descripcionCorta")?.toString() || "",
      descripcion: formData.get("descripcion")?.toString() || "",
      esGratis: formData.get("esGratis") === "true",
      precio: formData.get("precio") ? parseFloat(formData.get("precio") as string) : undefined,
      publicado: formData.get("publicado") === "true",
      categoriaId: formData.get("categoriaId")?.toString() || "",
      subcategoriaId: formData.get("subcategoriaId")?.toString() || undefined,
    };

    const { portada: _p, pdf: _pdf, ...schemaSinArchivos } = cursoSchema.shape;
    const schemaParcial = z.object(schemaSinArchivos);
    const validacion = schemaParcial.safeParse(raw);

    if (!validacion.success) {
      return { success: false, error: validacion.error.issues[0].message };
    }

    const datosValidados = validacion.data;
    const portadaFile = formData.get("portada") as File | null;
    const pdfFile = formData.get("pdf") as File | null;

    let portadaUrl = cursoActual.portadaUrl;
    let pdfUrl = cursoActual.pdfUrl;

    if (portadaFile && portadaFile.size > 0) {
      if (portadaUrl) await deleteFile(portadaUrl); 
      portadaUrl = await uploadFile(portadaFile, "Portada"); 
    }

    if (pdfFile && pdfFile.size > 0) {
      if (pdfUrl) await deleteFile(pdfUrl);
      pdfUrl = await uploadFile(pdfFile, "PDF");
    }

    const curso = await prisma.curso.update({
      where: { id },
      data: {
        ...datosValidados,
        precio: datosValidados.precio ?? null,
        subcategoriaId: datosValidados.subcategoriaId ?? null,
        tituloBusqueda: datosValidados.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
        portadaUrl,
        pdfUrl,
      },
    });

    // ¡CACHÉ ARREGLADA!
    revalidatePath("/admin/cursos");
    revalidatePath("/"); 
    revalidatePath("/cursos");
    revalidatePath(`/cursos/${datosValidados.slug}`);
    return { success: true, data: curso };
  } catch (error: unknown) {
    if (isPrismaError(error) && error.code === "P2002") {
      return { success: false, error: "El título o slug ya está en uso." };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al actualizar el curso." };
  }
}

// --- Eliminar curso ---
export async function eliminarCurso(id: string) {
  try {
    const curso = await prisma.curso.findUnique({ where: { id } });
    if (!curso) throw new Error("Curso no encontrado.");

    if (curso.portadaUrl) await deleteFile(curso.portadaUrl);
    if (curso.pdfUrl) await deleteFile(curso.pdfUrl);

    await prisma.curso.delete({ where: { id } });
    
    // ¡CACHÉ ARREGLADA!
    revalidatePath("/admin/cursos");
    revalidatePath("/"); 
    revalidatePath("/cursos");
    return { success: true };
  } catch (error: unknown) {
    if (isPrismaError(error) && error.code === "P2003") {
      return { success: false, error: "No se puede eliminar: tiene dependencias." };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al eliminar." };
  }
}

export async function buscarCursosRapido(termino: string) {
  try {
    const cursosRaw = await prisma.$queryRaw`
      SELECT id, titulo, slug 
      FROM Curso 
      WHERE publicado = 1 AND titulo LIKE ${`%${termino}%`}
      LIMIT 5
    `;
    const cursos = Array.isArray(cursosRaw) ? cursosRaw : [];
    return { success: true, data: cursos };
  } catch (error) {
    console.error("Error en el buscador rápido:", error);
    return { success: false, error: "Error al buscar cursos" };
  }
}