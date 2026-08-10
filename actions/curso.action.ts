"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { supabase } from "@/lib/supabase-server";
import { v4 as uuidv4 } from "uuid";
import { cursoSchema } from "@/lib/validations/curso.schema";

// ─── Función auxiliar para subir archivos a Supabase Storage ───
async function uploadFile(
  file: File,
  bucket: "portadas" | "pdfs"
): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${ext}`;

  // Convertir el archivo web a un Buffer de servidor
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`📤 Subiendo ${fileName} a bucket '${bucket}'...`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error(`❌ Error al subir a bucket '${bucket}':`, error);
    throw new Error(`Error al subir archivo: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  console.log(`✅ Archivo subido exitosamente. URL: ${urlData.publicUrl}`);
  return urlData.publicUrl;
}

// ─── Función auxiliar para eliminar archivo antiguo si existe ───
async function deleteFile(url: string, bucket: "portadas" | "pdfs") {
  const regex = new RegExp(`/${bucket}/(.+)$`);
  const match = url.match(regex);
  if (match && match[1]) {
    const filePath = match[1];
    console.log(`🗑️ Eliminando archivo antiguo: ${filePath}`);
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      console.error(`⚠️ No se pudo eliminar el archivo antiguo: ${error.message}`);
    }
  }
}

// ─── Obtener cursos con relaciones ───
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
  } catch (error) {
    console.error("obtenerCursos:", error);
    return { success: false, error: "No se pudieron cargar los cursos." };
  }
}

// ─── Crear curso ───
export async function crearCurso(formData: FormData) {
  try {
    // 1. Extraer datos del formulario (solo texto)
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

    console.log("📥 Datos recibidos para crear:", raw);

    // 2. Validar campos de texto con Zod
    const { portada: _p, pdf: _pdf, ...schemaSinArchivos } = cursoSchema.shape;
    const schemaParcial = z.object(schemaSinArchivos);
    const validacion = schemaParcial.safeParse(raw);

    if (!validacion.success) {
      console.error("❌ Error de validación:", validacion.error.format());
      return { success: false, error: validacion.error.issues[0].message };
    }

    const datosValidados = validacion.data;
    console.log("✔️ Datos validados:", datosValidados);

    // 3. Procesar archivos
    const portadaFile = formData.get("portada") as File | null;
    const pdfFile = formData.get("pdf") as File | null;

    if (!pdfFile || pdfFile.size === 0) {
      throw new Error("El archivo PDF es obligatorio.");
    }

    console.log(`📄 Archivo PDF: ${pdfFile.name} (${(pdfFile.size / 1024).toFixed(1)} KB)`);
    const pdfUrl = await uploadFile(pdfFile, "pdfs");

    let portadaUrl: string | null = null;
    if (portadaFile && portadaFile.size > 0) {
      console.log(`🖼️ Archivo Portada: ${portadaFile.name} (${(portadaFile.size / 1024).toFixed(1)} KB)`);
      portadaUrl = await uploadFile(portadaFile, "portadas");
    }

    // 4. Insertar en la base de datos
    console.log("💾 Insertando en la base de datos...");
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

    console.log(`🎉 Curso creado exitosamente (ID: ${curso.id})`);
    revalidatePath("/admin/cursos");
    return { success: true, data: curso };
  } catch (error) {
    console.error("🚨 Error en crearCurso:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "El título o slug ya existe." };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al crear el curso." };
  }
}

// ─── Actualizar curso ───
export async function actualizarCurso(id: string, formData: FormData) {
  try {
    const cursoActual = await prisma.curso.findUnique({ where: { id } });
    if (!cursoActual) throw new Error("Curso no encontrado.");

    // 1. Extraer datos de texto
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

    console.log("📥 Datos recibidos para actualizar:", raw);

    // 2. Validar
    const { portada: _p, pdf: _pdf, ...schemaSinArchivos } = cursoSchema.shape;
    const schemaParcial = z.object(schemaSinArchivos);
    const validacion = schemaParcial.safeParse(raw);

    if (!validacion.success) {
      console.error("❌ Error de validación:", validacion.error.format());
      return { success: false, error: validacion.error.issues[0].message };
    }

    const datosValidados = validacion.data;
    console.log("✔️ Datos validados:", datosValidados);

    // 3. Procesar archivos (solo si se enviaron nuevos)
    const portadaFile = formData.get("portada") as File | null;
    const pdfFile = formData.get("pdf") as File | null;

    let portadaUrl = cursoActual.portadaUrl;
    let pdfUrl = cursoActual.pdfUrl;

    if (portadaFile && portadaFile.size > 0) {
      if (portadaUrl) await deleteFile(portadaUrl, "portadas");
      portadaUrl = await uploadFile(portadaFile, "portadas");
    }

    if (pdfFile && pdfFile.size > 0) {
      if (pdfUrl) await deleteFile(pdfUrl, "pdfs");
      pdfUrl = await uploadFile(pdfFile, "pdfs");
    }

    // 4. Actualizar en BD
    console.log("✏️ Actualizando en la base de datos...");
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

    console.log(`🎉 Curso actualizado (ID: ${id})`);
    revalidatePath("/admin/cursos");
    return { success: true, data: curso };
  } catch (error) {
    console.error("🚨 Error en actualizarCurso:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "El título o slug ya está en uso." };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al actualizar el curso." };
  }
}

// ─── Eliminar curso ───
export async function eliminarCurso(id: string) {
  try {
    const curso = await prisma.curso.findUnique({ where: { id } });
    if (!curso) throw new Error("Curso no encontrado.");

    // Eliminar archivos asociados en Supabase
    if (curso.portadaUrl) await deleteFile(curso.portadaUrl, "portadas");
    if (curso.pdfUrl) await deleteFile(curso.pdfUrl, "pdfs");

    await prisma.curso.delete({ where: { id } });
    console.log(`🗑️ Curso eliminado (ID: ${id})`);
    revalidatePath("/admin/cursos");
    return { success: true };
  } catch (error) {
    console.error("🚨 Error en eliminarCurso:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return { success: false, error: "No se puede eliminar: tiene dependencias." };
    }
    return { success: false, error: error instanceof Error ? error.message : "Error al eliminar." };
  }
}