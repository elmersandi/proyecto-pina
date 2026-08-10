export interface CursoBasico {
  id: string;
  titulo: string;
}

export interface SubcategoriaConRelaciones {
  id: string;
  nombre: string;
  slug: string;
  categoriaId: string;
  categoria: {
    id: string;
    nombre: string;
  };
  _count?: {
    cursos: number;
  };
  cursos?: CursoBasico[];
  createdAt?: string | Date; 
  updatedAt?: string | Date; 
}

export interface CategoriaOption {
  id: string;
  nombre: string;
}