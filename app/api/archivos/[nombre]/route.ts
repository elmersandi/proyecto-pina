import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  // 1. En Next.js 16, params es una Promesa
  props: { params: Promise<{ nombre: string }> } 
) {
  try {
    // 2. Tenemos que hacer 'await' obligatoriamente
    const params = await props.params; 
    const fileName = params.nombre;
    
    // Calculamos la ruta
    const PROJECT_ROOT = process.cwd();
    const PERSISTENT_DIR = path.join(PROJECT_ROOT, "..", "storage_pina");
    const filePath = path.join(PERSISTENT_DIR, fileName);

    // Si NO existe, nos chismea la ruta (con status 200 para que Chrome lo muestre)
    if (!fs.existsSync(filePath)) {
      return new NextResponse(`ERROR: Archivo no encontrado.\nLa API buscó en: ${filePath}`, { status: 200 });
    }

    // Si existe, lo lee
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
    // Si hay otro error (como permisos), que nos lo diga sin crashear
    return new NextResponse(`ERROR DE SERVIDOR: ${error}`, { status: 200 });
  }
}