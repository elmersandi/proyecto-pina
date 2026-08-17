import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// La misma ruta de la Bóveda Persistente
const PERSISTENT_DIR = path.resolve(process.cwd(), "../storage_pina");

export async function GET(
  request: NextRequest,
  { params }: { params: { nombre: string } }
) {
  const fileName = params.nombre;
  const filePath = path.join(PERSISTENT_DIR, fileName);

  // Seguridad: Evitar navegación de directorios maliciosa
  if (!filePath.startsWith(PERSISTENT_DIR)) {
    return new NextResponse("Acceso denegado", { status: 403 });
  }

  // Verificar si el archivo existe
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Archivo no encontrado", { status: 404 });
  }

  // Leer el archivo de la bóveda
  const fileBuffer = fs.readFileSync(filePath);
  
  // Asignar el tipo de archivo correcto para el navegador
  const ext = path.extname(fileName).toLowerCase();
  let contentType = "application/octet-stream";
  
  if (ext === ".pdf") contentType = "application/pdf";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  if (ext === ".png") contentType = "image/png";
  if (ext === ".webp") contentType = "image/webp";

  // Retornar el archivo con cabeceras de caché
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}