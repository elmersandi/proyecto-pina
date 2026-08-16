"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { cursoSchema } from "@/lib/validations/curso.schema";
// Importamos las herramientas nativas de Node.js para guardar en el disco duro
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

// --- Función auxiliar para guardar archivos LOCALMENTE (Hostinger) ---
async function uploadFile(
  file: File,
  tipoLog: string // Solo para saber en la terminal qué estamos subiendo
): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${ext}`;

  // Convertir el archivo web a un Buffer de servidor
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Definir la ruta física exacta: public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, fileName);

  console.log(`Guardando ${fileName} (${tipoLog}) en el disco local...`);

  try {
    // Por seguridad, asegurarnos de que la carpeta exista antes de guardar
    await mkdir(uploadsDir, { recursive: true });
    
    // Escribir el archivo en el disco duro
    await writeFile(filePath, buffer);
    console.log(`Archivo guardado exitosamente: /uploads/${fileName}`);
    
    // Retornamos la ruta pública para que el navegador y la base de datos la usen
    return `/uploads/${fileName}`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error al guardar el archivo en el disco:`, error.message);
    }
    throw new Error(`Error al guardar archivo en el servidor`);
  }
}

// --- Función auxiliar para eliminar archivo antiguo local ---
async function deleteFile(url: string) {
  // La url que llega es tipo "/uploads/mi-archivo.pdf", extraemos solo el nombre
  const fileName = url.split("/").pop();
  if (!fileName) return;

  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  try {
    console.log(`Eliminando archivo antiguo del disco: ${filePath}`);
    await unlink(filePath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`No se pudo eliminar el archivo (quizás ya no existe):`, error.message);
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

    // Subimos el PDF localmente
    const pdfUrl = await uploadFile(pdfFile, "PDF");

    let portadaUrl: string | null = null;
    if (portadaFile && portadaFile.size > 0) {
      // Subimos la Portada localmente
      portadaUrl = await uploadFile(portadaFile, "Portada");
    }

    const curso = await prisma.curso.create({
      data: {
        ...datosValidados,
        precio: datosValidados.precio ?? null,
        subcategoriaId: datosValidados.subcategoriaId ?? null,
        tituloBusqueda: datosValidados.titulo
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase(),
        portadaUrl,
        pdfUrl,
      },
    });

    revalidatePath("/admin/cursos");
    return { success: true, data: curso };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en crearCurso:", error.message);
    }
    
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
      if (portadaUrl) await deleteFile(portadaUrl); // Eliminamos la vieja
      portadaUrl = await uploadFile(portadaFile, "Portada"); // Subimos la nueva
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
        tituloBusqueda: datosValidados.titulo
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase(),
        portadaUrl,
        pdfUrl,
      },
    });

    revalidatePath("/admin/cursos");
    return { success: true, data: curso };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en actualizarCurso:", error.message);
    }
    
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

    // Eliminar archivos físicos del servidor Hostinger
    if (curso.portadaUrl) await deleteFile(curso.portadaUrl);
    if (curso.pdfUrl) await deleteFile(curso.pdfUrl);

    await prisma.curso.delete({ where: { id } });
    revalidatePath("/admin/cursos");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en eliminarCurso:", error.message);
    }
    
    if (isPrismaError(error) && error.code === "P2003") {
      return { success: false, error: "No se puede eliminar: tiene dependencias." };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al eliminar." };
  }
}

export async function buscarCursosRapido(termino: string) {
  try {
    console.log("Buscando el curso:", termino);

    // Usamos SQL puro para evitar conflictos de Collation en Hostinger
    // Se buscan los que contengan el término y estén publicados (publicado = 1)
    const cursosRaw = await prisma.$queryRaw`
      SELECT id, titulo, slug 
      FROM Curso 
      WHERE publicado = 1 AND titulo LIKE ${`%${termino}%`}
      LIMIT 5
    `;

    // Convertimos el resultado bruto a un arreglo que React entienda
    const cursos = Array.isArray(cursosRaw) ? cursosRaw : [];

    console.log("Cursos encontrados:", cursos.length);
    
    return { success: true, data: cursos };
  } catch (error) {
    console.error("Error en el buscador rápido:", error);
    return { success: false, error: "Error al buscar cursos" };
  }
}