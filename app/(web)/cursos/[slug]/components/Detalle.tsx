"use client";

import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

export default function Detalle({ 
  curso, 
  relacionados 
}: { 
  curso: CursoData, 
  relacionados: RelacionadoData[] 
}) {
  
  const todasLasImagenes: string[] = [];
  if (curso.portadaUrl) todasLasImagenes.push(curso.portadaUrl);

  const [imgActiva, setImgActiva] = useState<string | null>(
    todasLasImagenes.length > 0 ? todasLasImagenes[0] : null
  );
  const [imgCargada, setImgCargada] = useState<string | null>(null);
  const [descargando, setDescargando] = useState(false);

  const imagenAMostrar = imgActiva;
  const isImageLoading = imagenAMostrar !== imgCargada;

  const numeroWa = "51925030648"; 
  const msjWa = encodeURIComponent(`Hola Proyecto Piña, deseo solicitar información sobre el curso:\n✔️ ${curso.titulo}`);
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWa}&text=${msjWa}`;

  // =====================================================================
  // FUNCIÓN: FORZAR DESCARGA DIRECTA DE PDF
  // =====================================================================
  const handleDescargaDirecta = async (e: React.MouseEvent, url: string, titulo: string) => {
    e.preventDefault();
    if (!url) return;
    
    setDescargando(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const nombreArchivo = titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
      link.download = `proyecto-pina-${nombreArchivo}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error forzando la descarga del PDF:", error);
      window.open(url, '_blank');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen pt-10 lg:pt-14 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Migas de pan */}
        <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 mb-6 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/cursos" className="hover:text-blue-950 transition-colors">Cursos</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-600">
            {curso.categoria ? curso.categoria.nombre : 'General'}
          </span>
          {curso.subcategoria && (
            <>
              <ChevronRight size={14} className="shrink-0" />
              <span className="text-slate-600">{curso.subcategoria.nombre}</span>
            </>
          )}
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-800 truncate max-w-[200px] sm:max-w-none">{curso.titulo}</span>
        </nav>

        {/* Sección Principal del Curso */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-20 w-full">
          
          {/* Columna Izquierda: Portada Garantizada */}
          <div className="w-full md:w-5/12 lg:w-1/2 flex justify-center md:justify-start lg:justify-center h-max">
            
            {/* Contenedor limpio y seguro */}
            <div className="w-full max-w-[340px] aspect-[3/4] min-h-[400px] bg-slate-200 rounded-2xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden relative shadow-lg">
              
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm z-20 ${
                curso.esGratis ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-blue-950'
              }`}>
                {curso.esGratis ? 'Gratuito' : 'Premium'}
              </span>

              {imagenAMostrar ? (
                <>
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse z-0"></div>
                  )}
                  <Image 
                    src={imagenAMostrar} 
                    alt={curso.titulo} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 340px" 
                    priority 
                    unoptimized 
                    onLoad={() => setImgCargada(imagenAMostrar)}
                    className={`object-cover z-10 transition-opacity duration-500 ease-in-out ${isImageLoading ? 'opacity-0' : 'opacity-100'}`} 
                  />
                </>
              ) : (
                <div className="text-slate-500 flex flex-col items-center z-10">
                  <BookOpen size={56} className="mb-4 opacity-50" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest">Sin portada</span>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Información */}
          <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col">
            
            <div className="mb-6 border-b border-slate-200 pb-5">
              <span className="text-xs font-semibold text-yellow-600 uppercase tracking-widest mb-2 block">
                {curso.categoria?.nombre || "Academia Preuniversitaria"}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight">
                {curso.titulo}
              </h1>
            </div>

            {/* Inversión (Oculto si es gratis) */}
            {!curso.esGratis && (
              <div className="mb-6">
                <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-1">Inversión</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-blue-950 font-mono tracking-tight">
                    S/ {curso.precio?.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Botones más holgados y menos apretados */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
              
              <button 
                onClick={(e) => handleDescargaDirecta(e, curso.pdfUrl, curso.titulo)}
                disabled={descargando || !curso.pdfUrl}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 min-h-[48px] rounded-xl font-semibold text-sm transition-all shadow-sm ${
                  descargando || !curso.pdfUrl
                    ? 'bg-slate-300 text-slate-600 cursor-not-allowed shadow-none'
                    : 'bg-blue-950 text-white hover:bg-blue-900 shadow-blue-950/20 active:scale-[0.98]'
                }`}
              >
                {descargando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Preparando...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} /> 
                    <span>Descargar Material</span>
                  </>
                )}
              </button>
              
              <a 
                href={urlWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white font-semibold text-sm py-3 px-4 min-h-[48px] rounded-xl hover:bg-[#20bd5a] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Consulta Académica</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <p className="text-[10px] font-semibold text-slate-600 uppercase leading-tight mb-1">Contenido</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">Verificado Preu</p>
                </div>
                <ShieldCheck className="text-emerald-500 shrink-0 ml-2" size={24} />
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <p className="text-[10px] font-semibold text-slate-600 uppercase leading-tight mb-1">Formato</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">Acceso Digital 24/7</p>
                </div>
                <FileText className="text-blue-500 shrink-0 ml-2" size={24} />
              </div>
            </div>

            {/* Resumen sin cuadro (tarjeta eliminada) */}
            {curso.descripcionCorta && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Resumen del Curso</h3>
                <p className="text-slate-800 text-[14px] leading-relaxed">
                  {curso.descripcionCorta}
                </p>
              </div>
            )}

            <div className="mb-0">
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Descripción Completa</h3>
              <div className="text-slate-800 text-[14px] leading-relaxed whitespace-pre-wrap">
                {curso.descripcion}
              </div>
            </div>
            
          </div>
        </div>

        {/* Cursos Similares / Relacionados */}
        {relacionados.length > 0 && (
          <section className="pt-12 border-t border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-8">
              Material Recomendado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relacionados.map((rel) => (
                <Link 
                  key={rel.id} 
                  href={`/cursos/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full overflow-hidden"
                >
                  
                  <div className="aspect-[3/4] w-full bg-slate-100 relative border-b border-slate-100 overflow-hidden">
                    <span className={`absolute top-3 left-3 text-[10px] font-semibold px-3 py-1 rounded-full z-10 uppercase tracking-widest shadow-sm ${
                      rel.esGratis ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-blue-950'
                    }`}>
                      {rel.esGratis ? 'GRATIS' : 'PREMIUM'}
                    </span>
                    
                    {rel.portadaUrl ? (
                      <Image 
                        src={rel.portadaUrl} 
                        alt={rel.titulo} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        unoptimized 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen size={32} />
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                      {rel.titulo}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      {rel.esGratis ? (
                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Acceso Libre</p>
                      ) : (
                        <>
                          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Inversión</p>
                          <p className="text-lg font-semibold text-blue-950 font-mono tracking-tight">
                            S/ {rel.precio?.toFixed(2)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}