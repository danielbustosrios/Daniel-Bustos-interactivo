import React from 'react';
import { ExploreResource } from '../types';
import { ExternalLink, Compass, HelpCircle, Lightbulb, Sparkles, Layers, Globe } from 'lucide-react';

interface ExploreResourceCardProps {
  resource: ExploreResource;
  onOpenInternalActivity?: (resourceId: string) => void;
}

export const ExploreResourceCard: React.FC<ExploreResourceCardProps> = ({
  resource,
  onOpenInternalActivity
}) => {
  const isInternal = resource.type === 'internal';

  const handleActionClick = (e: React.MouseEvent) => {
    if (isInternal && onOpenInternalActivity) {
      e.preventDefault();
      onOpenInternalActivity(resource.id);
    }
  };

  return (
    <article className="bg-white border border-[#E5E5E5] hover:border-[#1A1A1A] transition-all duration-200 p-6 flex flex-col justify-between text-left group">
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#F9F9F9] border border-[#E5E5E5] text-[#1A1A1A] font-semibold">
              {resource.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isInternal ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium bg-[#1A1A1A] text-white">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Actividad propia</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[#555555] bg-[#F5F5F5] border border-[#E0E0E0]" title="Abre en otra pestaña">
                <span>Recurso externo</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] tracking-tight group-hover:text-black">
            {resource.title}
          </h3>
          {resource.subtitle && (
            <p className="text-xs text-[#777777] font-sans mt-0.5">
              {resource.subtitle}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-sans">
          {resource.description}
        </p>

        {/* Suggested Question / Pedagogical Challenge */}
        {resource.suggestedQuestion && (
          <div className="p-3 bg-[#FAFAFA] border border-[#EAEAEA] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A]">
              <HelpCircle className="w-3.5 h-3.5 text-[#666666]" />
              <span>Pregunta de indagación sugerida</span>
            </div>
            <p className="text-xs text-[#444444] font-serif italic leading-relaxed">
              “{resource.suggestedQuestion}”
            </p>
          </div>
        )}

        {/* Student Tip (e.g. for BanRep) */}
        {resource.studentTip && (
          <div className="p-2.5 bg-[#FFFDF5] border border-[#EFE5C6] text-[11px] text-[#70551E] flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[#9C792B] flex-shrink-0 mt-0.5" />
            <span className="font-sans leading-snug">{resource.studentTip}</span>
          </div>
        )}

        {/* Chapter Info / Difficulty Guide (e.g. Seeing Theory) */}
        {resource.chapterInfo && (
          <div className="p-3 bg-[#FBFBFB] border border-[#E8E8E8] space-y-2 text-[11px]">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#1A1A1A]">
              <Layers className="w-3 h-3 text-[#555555]" />
              <span>{resource.chapterInfo.entryPoint}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {resource.chapterInfo.chapters.map((ch) => (
                <span
                  key={ch.name}
                  className={`px-1.5 py-0.5 text-[10px] font-mono border ${
                    ch.difficulty === 'Básico'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                      : ch.difficulty === 'Intermedio'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  {ch.name} • {ch.difficulty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata: Provider & Language */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] font-mono text-[#777777] pt-1">
          <div className="flex items-center gap-1">
            <span className="text-[#999999]">Autor / Institución:</span>
            <strong className="text-[#333333] font-medium">{resource.provider}</strong>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#888888]" />
            <span>{resource.language}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-[#888888] bg-[#F9F9F9] px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {resource.secondaryUrl ? (
          <a
            href={resource.secondaryUrl.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-blue-600 hover:text-blue-800 underline decoration-blue-300 inline-flex items-center gap-1"
          >
            <span>{resource.secondaryUrl.label}</span>
            <ExternalLink className="w-3 h-3 text-blue-600 flex-shrink-0" />
          </a>
        ) : (
          <span className="text-[10px] font-mono text-[#888888]">
            {isInternal ? 'Actividad integrada' : 'Abre en otra pestaña'}
          </span>
        )}

        {isInternal ? (
          <button
            type="button"
            onClick={handleActionClick}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-mono font-medium transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explorar actividad</span>
          </button>
        ) : (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-mono font-medium transition-colors"
          >
            <span>Explorar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
};
