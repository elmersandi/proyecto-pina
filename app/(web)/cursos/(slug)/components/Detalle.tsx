"use client";

import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, BookOpen, ChevronRight, Image as ImageIcon } from 'lucide-react';
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
  
  // Guardamos la portada en un array para mantener compatibilidad con el selector de miniaturas si tuviera más fotos
  const todasLasImagenes: string[] = [];
  if (curso.portadaUrl) todasLasImagenes.push(curso.portadaUrl);

  const [imgActiva, setImgActiva] = useState<string | null>(
    todasLasImagenes.length > 0 ? todasLasImagenes[0] : null
  );
  const [imgCargada, setImgCargada] = useState<string | null>(null);

  const imagenAMostrar = imgActiva;
  const isImageLoading = imagenAMostrar !== imgCargada;

  // Número de WhatsApp institucional (puedes cambiarlo si lo requieres)
  const numeroWa = "51925030648"; 
  const msjWa = encodeURIComponent(`Hola Proyecto Piña, deseo solicitar información sobre el curso:\n✔️ ${curso.titulo}`);
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWa}&text=${msjWa}`;

  return (
    <main className="bg-slate-50 min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Migas de pan (Breadcrumbs) */}
        <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-8 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/cursos" className="hover:text-blue-950 transition-colors">Cursos</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-500">
            {curso.categoria ? curso.categoria.nombre : 'General'}
          </span>
          {curso.subcategoria && (
            <>
              <ChevronRight size={14} className="shrink-0" />
              <span className="text-slate-500">{curso.subcategoria.nombre}</span>
            </>
          )}
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-800 truncate max-w-[200px] sm:max-w-none">{curso.titulo}</span>
        </nav>

        {/* Sección Principal del Curso */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 mb-20 w-full">
          
          {/* Columna Izquierda: Portada / Visualizador */}
          <div className="w-full md:w-1/2 flex flex-col-reverse sm:flex-row gap-4 h-max">
            
            {todasLasImagenes.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] pb-2 sm:pb-0 shrink-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
                {todasLasImagenes.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setImgActiva(img)}
                    className={`w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-xl border transition-all overflow-hidden bg-white flex items-center justify-center cursor-pointer relative ${
                      imgActiva === img ? 'border-blue-950 ring-1 ring-blue-950' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <Image src={img} alt={`Vista ${idx}`} fill sizes="80px" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 aspect-[3/4] bg-slate-100 rounded-3xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden relative shadow-sm">
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-20 ${
                curso.esGratis ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-blue-950'
              }`}>
                {curso.esGratis ? 'Curso Gratuito' : 'Curso Premium'}
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
                    sizes="(max-width: 768px) 100vw, 50vw" 
                    priority 
                    unoptimized 
                    onLoad={() => setImgCargada(imagenAMostrar)}
                    className={`object-cover z-10 transition-opacity duration-500 ease-in-out ${isImageLoading ? 'opacity-0' : 'opacity-100'}`} 
                  />
                </>
              ) : (
                <div className="text-slate-300 flex flex-col items-center z-10">
                  <BookOpen size={48} className="mb-2 opacity-50" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Sin Portada</span>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Información y Botones de Acción */}
          <div className="w-full md:w-1/2 flex flex-col">
            
            <div className="mb-4 border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2 block">
                {curso.categoria?.nombre || "Academia Preuniversitaria"}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {curso.titulo}
              </h1>
            </div>

            <div className="mb-5">
              <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-1">Inversión</p>
              <div className="flex items-end gap-2">
                <span className="text-xl sm:text-2xl font-bold text-blue-950 font-mono tracking-tight">
                  {curso.esGratis ? "S/ 0.00 (Gratis)" : `S/ ${curso.precio?.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Botones de Descarga PDF y Asesoría */}
            <div className="flex flex-row gap-2 sm:gap-3 mb-6 w-full">
              <a 
                href={curso.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-950 text-white font-semibold text-[11px] sm:text-sm py-3 px-2 rounded-xl hover:bg-blue-900 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg shadow-blue-950/20"
              >
                <Download size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                <span className="leading-none">Descargar Material (PDF)</span>
              </a>
              
              <a 
                href={urlWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white font-semibold text-[11px] sm:text-sm py-3 px-2 rounded-xl hover:bg-[#20bd5a] hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg shadow-green-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="leading-none">Consulta Académica</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center justify-between py-2.5 px-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase leading-tight mb-0.5">Contenido</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-800 leading-tight">Verificado Preu</p>
                </div>
                <ShieldCheck className="text-slate-400 shrink-0 ml-2" size={20} />
              </div>
              <div className="flex items-center justify-between py-2.5 px-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase leading-tight mb-0.5">Formato</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-800 leading-tight">Acceso Digital 24/7</p>
                </div>
                <FileText className="text-slate-400 shrink-0 ml-2" size={20} />
              </div>
            </div>

            {curso.descripcionCorta && (
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Resumen del Curso</h3>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {curso.descripcionCorta}
                </p>
              </div>
            )}

            <div className="mb-0">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Temario y Descripción Completa</h3>
              <p className="text-slate-600 text-[13px] leading-relaxed whitespace-pre-wrap">
                {curso.descripcion}
              </p>
            </div>
            
          </div>
        </div>

        {/* Cursos Similares / Relacionados */}
        {relacionados.length > 0 && (
          <section className="pt-10 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Cursos Similares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relacionados.map((rel) => (
                <Link 
                  key={rel.id} 
                  href={`/cursos/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden"
                >
                  
                  <div className="aspect-[3/4] w-full bg-slate-50 relative border-b border-slate-100 overflow-hidden">
                    <span className={`absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 rounded-md z-10 uppercase tracking-widest shadow-sm ${
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
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen size={24} />
                      </div>
                    )}
                  </div>

                  <div className="p-4 pt-5 flex flex-col flex-1">
                    <h3 className="text-[13px] font-semibold text-slate-800 mb-3 group-hover:text-blue-950 transition-colors line-clamp-2 leading-snug">
                      {rel.titulo}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Inversión</p>
                      <p className="text-base font-bold text-blue-950 font-mono tracking-tight">
                        {rel.esGratis ? "S/ 0.00" : `S/ ${rel.precio?.toFixed(2)}`}
                      </p>
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