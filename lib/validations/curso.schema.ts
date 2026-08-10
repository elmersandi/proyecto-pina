import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB para portada
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB para PDF
const ACCEPTED_PDF_TYPE = "application/pdf";

export const cursoSchema = z.object({
  titulo: z.string().min(2, "Mínimo 2 caracteres").max(150, "Máximo 150 caracteres"),
  slug: z
    .string()
    .min(2, "Slug obligatorio")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  descripcionCorta: z
    .string()
    .min(10, "Mínimo 10 caracteres")
    .max(160, "Máximo 160 caracteres"),
  descripcion: z.string().min(10, "Mínimo 10 caracteres"),
  
  // CORRECCIÓN: Quitamos el "coerce" para evitar el tipo "unknown"
  esGratis: z.boolean(),
  precio: z.number().positive("Debe ser positivo").optional().nullable(),
  publicado: z.boolean(),
  
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  subcategoriaId: z.string().optional().nullable(),
  
  portada: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0] instanceof File, "Se requiere un archivo válido")
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, "Máximo 5MB")
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Solo .jpg, .png, .webp"
    ),

  pdf: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0] instanceof File, "Se requiere un archivo válido")
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_PDF_SIZE, "Máximo 20MB")
    .refine(
      (files) => !files || files.length === 0 || files[0].type === ACCEPTED_PDF_TYPE,
      "Solo PDF"
    ),
});

export type CursoFormData = z.infer<typeof cursoSchema>;