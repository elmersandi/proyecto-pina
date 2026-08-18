import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { nombre: string } }
) {
  const fileName = params.nombre;
  // Calculamos la ruta
  const PROJECT_ROOT = process.cwd();
  const PERSISTENT_DIR = path.join(PROJECT_ROOT, "..", "storage_pina");
  const filePath = path.join(PERSISTENT_DIR, fileName);

  // 1. Si NO existe, que nos muestre en la pantalla DÓNDE lo buscó
  if (!fs.existsSync(filePath)) {
    return new NextResponse(`ERROR: Archivo no encontrado.\nLa API está buscando en la ruta falsa: ${filePath}`, { status: 404 });
  }

  // 2. Si existe, lo lee y lo muestra
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(fileName).toLowerCase();
    
    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".webp") contentType = "image/webp";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    // Si falla al leer, que nos diga por qué
    return new NextResponse(`ERROR DE LECTURA: ${error}`, { status: 500 });
  }
}