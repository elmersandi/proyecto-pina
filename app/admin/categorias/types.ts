export interface SubcategoriaBasica {
  id: string;
  nombre: string;
  _count?: { cursos: number };
}

export interface CursoBasico {
  id: string;
  titulo: string;
}

export interface CategoriaConRelaciones {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _count?: {
    subcategorias: number;
    cursos: number;
  };
  subcategorias?: SubcategoriaBasica[];
  cursos?: CursoBasico[];
}