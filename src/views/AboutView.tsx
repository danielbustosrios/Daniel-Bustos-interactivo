import React, { useState } from 'react';
import { SpaceType } from '../types';
import { teacherProfileData } from '../data/profile';
import { academicPublicationsData, academicThesesData } from '../data/publications';
import { GraduationCap, Award, ExternalLink, ChevronDown, ChevronUp, BookOpen, Layers, Cpu, Sparkles, FolderCode, Video } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (space: SpaceType) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const [isEducationExpanded, setIsEducationExpanded] = useState<boolean>(true);

  return (
    <div className="space-y-16 max-w-4xl mx-auto text-left">
      {/* Header */}
      <header className="space-y-3 border-b border-[#E5E5E5] pb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block">
          Espacio Pedagógico • Perfil & Trayectoria
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
          Sobre mí
        </h1>
        <p className="text-base text-[#666666] leading-relaxed font-sans max-w-2xl">
          Docente e investigador en matemáticas. Trayectoria académica orientada al descubrimiento, la experimentación y el aprendizaje activo.
        </p>
      </header>

      {/* Main Narrative - Exact requested text */}
      <div className="space-y-6 text-base sm:text-lg leading-relaxed text-[#333333] font-sans">
        {teacherProfileData.bioParagraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Formación Académica Compacta - Sin fechas en la vista principal */}
      <section className="space-y-6 pt-8 border-t border-[#E5E5E5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block mb-1">
            Trayectoria Académica
          </span>
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Formación
          </h2>
        </div>

        <div className="space-y-6">
          {/* Títulos académicos */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#888888] font-bold">
              Títulos Académicos
            </div>
            <div className="border border-[#E5E5E5] bg-white divide-y divide-[#E5E5E5]">
              {teacherProfileData.degrees.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#F9F9F9] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-medium text-[#1A1A1A]">
                      {item.degree}
                    </h3>
                    <p className="text-xs font-mono text-[#666666] mt-0.5">
                      {item.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distinción clara de la estancia posdoctoral */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#888888] font-bold">
              Estancia Posdoctoral
            </div>
            <div className="border border-[#E5E5E5] bg-[#FDFDFD] p-4 sm:p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-[#1A1A1A]">
                  {teacherProfileData.postdoc.description}
                </h3>
                <p className="text-xs font-mono text-[#666666] mt-0.5">
                  {teacherProfileData.postdoc.institution}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mis investigaciones y publicaciones científicas */}
      <section className="space-y-10 pt-8 border-t border-[#E5E5E5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block mb-1">
            Producción Científica
          </span>
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Mis investigaciones y publicaciones científicas
          </h2>
        </div>

        {/* 1. Artículos en revistas científicas */}
        <div className="space-y-4">
          <div className="text-base font-bold text-[#1A1A1A] tracking-tight">
            Artículos en Revistas Científicas
          </div>
          <div className="border border-[#E5E5E5] bg-white divide-y divide-[#E5E5E5]">
            {academicPublicationsData.map((pub, idx) => (
              <article key={pub.id} className="p-5 sm:p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-[#888888] mt-0.5 flex-shrink-0">
                    [{idx + 1}]
                  </span>
                  <div className="space-y-2 text-sm sm:text-base leading-relaxed text-[#1A1A1A] font-sans">
                    <div>
                      <span className="font-semibold text-[#111111]">{pub.authors}</span> ({pub.year}).{' '}
                      <span className="text-[#1A1A1A]">{pub.title}</span>.{' '}
                      <em className="font-serif italic text-[#222222]">{pub.journal}</em>
                      {pub.details ? `, ${pub.details}` : ''}.
                    </div>

                    {/* Blue DOI Link right in front */}
                    <div className="flex items-center gap-2 pt-0.5 text-xs font-mono">
                      <span className="text-[#777777] font-sans">DOI:</span>
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-800 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>https://doi.org/{pub.doi}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 2. Sección secundaria: Otras producciones */}
        <div className="space-y-4 pt-4 border-t border-[#EFEFEF]">
          <div className="text-base font-bold text-[#1A1A1A] tracking-tight">
            Otras producciones
          </div>

          <div className="border border-[#E5E5E5] bg-white divide-y divide-[#E5E5E5]">
            {academicThesesData.map((work, idx) => (
              <article key={work.id} className="p-5 sm:p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-[#888888] mt-0.5 flex-shrink-0">
                    [{idx + 1}]
                  </span>
                  <div className="space-y-2 text-sm sm:text-base leading-relaxed text-[#1A1A1A] font-sans">
                    <div>
                      <span className="font-semibold text-[#111111]">{work.type}:</span>{' '}
                      <span className="text-[#1A1A1A]">{work.title}</span>.
                    </div>
                    <div className="text-xs sm:text-sm text-[#666666] font-sans">
                      Área: <span className="text-[#333333] font-medium">{work.area}</span>
                    </div>

                    {/* Blue Link in front */}
                    {work.verifiedUrl ? (
                      <div className="flex items-center gap-2 pt-0.5 text-xs font-mono">
                        <span className="text-[#777777] font-sans">Enlace:</span>
                        <a
                          href={work.verifiedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-800 font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <span className="break-all">{work.verifiedUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        </a>
                      </div>
                    ) : (
                      <div className="pt-0.5 text-[11px] font-mono text-[#999999]">
                        (Documento no indexado en repositorio digital abierto)
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sección ampliable: Recursos y desarrollos educativos */}
      <section className="pt-8 border-t border-[#E5E5E5] space-y-4">
        <button
          type="button"
          onClick={() => setIsEducationExpanded(!isEducationExpanded)}
          className="w-full p-5 bg-[#F9F9F9] border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors flex items-center justify-between text-left group"
        >
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block mb-1">
              Desarrollo Pedagógico
            </span>
            <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight group-hover:text-black">
              Recursos y desarrollos educativos
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#666666]">
            <span>{isEducationExpanded ? 'Ocultar' : 'Desplegar'}</span>
            {isEducationExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#1A1A1A]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#1A1A1A]" />
            )}
          </div>
        </button>

        {isEducationExpanded && (
          <div className="p-6 border border-[#E5E5E5] bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* 1. Proyectos de Aula */}
              <div className="p-4 bg-[#FAFAFA] border border-[#EAEAEA] space-y-2.5 md:col-span-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                  <Layers className="w-4 h-4 text-[#666666]" />
                  <span>Experiencias de aula</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-white border border-[#E5E5E5] text-xs font-medium text-[#1A1A1A] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full flex-shrink-0" />
                    <span>Experiencia sumando emociones</span>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E5E5E5] text-xs font-medium text-[#1A1A1A] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full flex-shrink-0" />
                    <span>Observatorio de Datos Educativos CVO</span>
                  </div>
                </div>
              </div>

              {/* 2. Páginas Web y Desarrollos Independientes */}
              <div className="p-4 bg-[#FAFAFA] border border-[#EAEAEA] space-y-2.5 md:col-span-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                  <Sparkles className="w-4 h-4 text-[#666666]" />
                  <span>Páginas web y desarrollos</span>
                </div>
                <p className="text-[11px] text-[#777777] leading-relaxed">
                  Módulos web autónomos para divulgación, visualización de datos y comunicación académica.
                </p>

                <div className="pt-1">
                  <div className="p-3 bg-white border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-medium text-[#1A1A1A]">
                        Página desarrollada para el tercer encuentro de investigación de la Institución Carlos Vieco Ortiz año 2026
                      </div>
                      <a
                        href="https://danielbustosrios.github.io/III-ENCUENTRO-DE-INVESTIGACION-CVO/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <span className="break-all">https://danielbustosrios.github.io/III-ENCUENTRO-DE-INVESTIGACION-CVO/</span>
                        <ExternalLink className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      </a>
                    </div>

                    <a
                      href="https://danielbustosrios.github.io/III-ENCUENTRO-DE-INVESTIGACION-CVO/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F9] hover:bg-[#1A1A1A] hover:text-white border border-[#E5E5E5] text-[11px] font-mono text-[#1A1A1A] transition-colors flex-shrink-0"
                    >
                      <span>Visitar sitio</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 3. Materiales y Guías Curriculares */}
              <div className="p-4 bg-[#FAFAFA] border border-[#EAEAEA] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                  <BookOpen className="w-4 h-4 text-[#666666]" />
                  <span>Materiales y Guías Curriculares</span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Documentos estructurados, notas pedagógicas y secuencias de aprendizaje orientadas a la construcción del pensamiento lógico y matemático.
                </p>
              </div>

              {/* 4. Video: Teorema del Coseno */}
              <div className="p-4 bg-[#FAFAFA] border border-[#EAEAEA] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>Video Educativo</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#888888] bg-white px-2 py-0.5 border border-[#E5E5E5]">
                    2026
                  </span>
                </div>

                <div className="p-3 bg-white border border-[#E5E5E5] space-y-2">
                  <div className="font-semibold text-xs text-[#1A1A1A]">
                    Teorema del coseno
                  </div>
                  <p className="text-[11px] text-[#666666] leading-relaxed font-sans">
                    Video creado por el docente a partir de la creación dada por los estudiantes del grado décimo 2026.
                  </p>
                  <div className="pt-1 flex items-center justify-between gap-2">
                    <a
                      href="https://youtu.be/OAs2q6m_q_U?si=f71kFfhrmlpxVP5m"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 font-mono text-[11px] inline-flex items-center gap-1 font-medium"
                    >
                      <span>Ver en YouTube</span>
                      <ExternalLink className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    </a>

                    <a
                      href="https://youtu.be/OAs2q6m_q_U?si=f71kFfhrmlpxVP5m"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-mono transition-colors"
                    >
                      <Video className="w-3 h-3" />
                      <span>Reproducir</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

