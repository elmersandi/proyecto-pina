import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Detalle from './components/Detalle';

export const revalidate = 3600;

interface CursoData {
  id: string;
  titulo: string;
  slug: string;
  descripcionCorta: string;
  descripcion: string;
  portadaUrl: string | null;
  pdfUrl: string;
  esGratis: boolean;
  precio: number | null;
  publicado: boolean;
  categoriaId: string;
  categoria: { nombre: string } | null;
  subcategoria: { nombre: string } | null;
}

interface RelacionadoData {
  id: string;
  titulo: string;
  slug: string;
  portadaUrl: string | null;
  esGratis: boolean;
  precio: number | null;
  categoria?: { nombre: string } | null;
}

async function getCursoData(slug: string) {
  if (!slug) return { curso: null, relacionados: [] };

  try {
    const cursoRaw = await prisma.curso.findFirst({
      where: { slug: slug, publicado: true },
      include: { 
        categoria: { select: { nombre: true } },
        subcategoria: { select: { nombre: true } }
      }
    });

    if (!cursoRaw) return { curso: null, relacionados: [] };

    const curso: CursoData = {
      id: cursoRaw.id,
      titulo: cursoRaw.titulo,
      slug: cursoRaw.slug,
      descripcionCorta: cursoRaw.descripcionCorta,
      descripcion: cursoRaw.descripcion,
      portadaUrl: cursoRaw.portadaUrl,
      pdfUrl: cursoRaw.pdfUrl,
      esGratis: cursoRaw.esGratis,
      precio: cursoRaw.precio,
      publicado: cursoRaw.publicado,
      categoriaId: cursoRaw.categoriaId,
      categoria: cursoRaw.categoria ? { nombre: cursoRaw.categoria.nombre } : null,
      subcategoria: cursoRaw.subcategoria ? { nombre: cursoRaw.subcategoria.nombre } : null
    };

    // Buscamos cursos relacionados de la misma categoría
    const relRaw = await prisma.curso.findMany({
      where: {
        categoriaId: cursoRaw.categoriaId,
        id: { not: cursoRaw.id },
        publicado: true
      },
      include: {
        categoria: { select: { nombre: true } }
      },
      orderBy: {
        createdAt: 'desc' 
      },
      take: 4,
    });

    const relacionados: RelacionadoData[] = relRaw.map(r => ({
      id: r.id,
      slug: r.slug,
      titulo: r.titulo,
      portadaUrl: r.portadaUrl,
      esGratis: r.esGratis,
      precio: r.precio,
      categoria: r.categoria ? { nombre: r.categoria.nombre } : null
    }));

    return { curso, relacionados };
  } catch (error) {
    console.error("Error en BD (Curso Detalle):", error);
    return { curso: null, relacionados: [] };
  }
}

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const { curso } = await getCursoData(resolvedParams.slug);
  
  if (!curso) {
    return { title: 'Curso no encontrado | Proyecto Piña' };
  }

  return {
    title: `${curso.titulo} | Proyecto Piña - Centro Preuniversitario`,
    description: curso.descripcionCorta ? curso.descripcionCorta.substring(0, 160) : curso.descripcion.substring(0, 160),
    openGraph: {
      images: curso.portadaUrl ? [curso.portadaUrl] : [],
    },
  };
}

export default async function CursoDetallePage(props: PageProps) {
  const resolvedParams = await props.params;
  const { curso, relacionados } = await getCursoData(resolvedParams.slug);

  if (!curso) {
    notFound(); 
  }

  return <Detalle curso={curso} relacionados={relacionados} />;
}