import React from 'react';
import { projectsData } from '../data/projects';
import { Calendar, ArrowUpRight } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto text-left">
      {/* Header */}
      <header className="space-y-3 border-b border-[#E5E5E5] pb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block">
          Espacio Pedagógico • Proyectos y experiencias
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight">
          Proyectos y experiencias
        </h1>
        <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-3xl font-sans">
          Iniciativas pedagógicas, semilleros de investigación escolar y bancos de recursos interactivos desarrollados en el aula. Cada proyecto documenta metodología, estado y enlaces para réplica o adaptación en otros contextos educativos.
        </p>
      </header>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <article
            key={project.id}
            className="bg-white border border-[#E5E5E5] p-6 sm:p-7 flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
          >
            <div>
              {/* Header Status & Metaphor */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F9F9F9] text-[#1A1A1A] border border-[#E5E5E5]">
                  {project.institutionMetaphor}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#888888]">
                  <Calendar className="w-3 h-3 text-[#888888]" />
                  <span>{project.year}</span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-light text-xl text-[#1A1A1A] tracking-tight leading-snug">
                {project.title}
              </h3>
              <p className="text-xs text-[#888888] font-sans mt-1">
                {project.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs text-[#666666] leading-relaxed mt-3.5 font-sans">
                {project.description}
              </p>

              {/* Role */}
              <div className="mt-4 pt-3 border-t border-[#EEEEEE] text-xs font-mono text-[#666666]">
                <span className="font-semibold text-[#1A1A1A]">Rol:</span> {project.role}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-[#888888] bg-[#F9F9F9] border border-[#E5E5E5] px-2 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Link Footer */}
            {project.linkText && (
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                  {project.status}
                </span>
                <a
                  href={project.linkUrl}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#1A1A1A] hover:underline"
                >
                  <span>{project.linkText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* How to add new projects note */}
      <div className="p-6 bg-[#F9F9F9] border border-[#E5E5E5] text-xs font-mono text-[#555555] space-y-1.5">
        <div className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
          [Ampliación Modular de Proyectos]
        </div>
        <p className="text-[#666666] font-sans text-xs">
          Puedes registrar nuevas iniciativas y semilleros editando el esquema en <code className="bg-white px-1.5 py-0.5 border border-[#E5E5E5] text-[#1A1A1A]">src/data/projects.ts</code>. Los cambios se renderizan automáticamente en la cuadrícula.
        </p>
      </div>
    </div>
  );
};
