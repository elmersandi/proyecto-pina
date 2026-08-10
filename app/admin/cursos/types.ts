export interface CategoriaBasica {
  id: string;
  nombre: string;
}

export interface SubcategoriaBasica {
  id: string;
  nombre: string;
}

export interface CursoConRelaciones {
  id: string;
  titulo: string;
  slug: string;
  descripcionCorta: string;
  descripcion: string;
  portadaUrl?: string | null;
  pdfUrl: string;
  esGratis: boolean;
  precio?: number | null;
  publicado: boolean;
  categoriaId: string;
  subcategoriaId?: string | null;
  categoria: CategoriaBasica;
  subcategoria?: SubcategoriaBasica | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}