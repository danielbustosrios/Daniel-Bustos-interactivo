import React from 'react';
import { ResourceItem } from '../types';
import { ExternalLink, BookOpen, Clock, ArrowUpRight, ArrowRight } from 'lucide-react';

interface ResourceCardProps {
  resource: ResourceItem;
  onOpenInternal?: (resource: ResourceItem) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onOpenInternal }) => {
  const isExternal = resource.location === 'external';

  const handleClick = (e: React.MouseEvent) => {
    if (!isExternal && onOpenInternal) {
      e.preventDefault();
      onOpenInternal(resource);
    }
  };

  return (
    <article className="group bg-white border border-[#E5E5E5] hover:border-[#1A1A1A] p-6 transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        {/* Badges bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 bg-[#F9F9F9] border border-[#E5E5E5] text-[#1A1A1A] font-semibold">
              {resource.category}
            </span>
            <span className="text-[10px] font-mono text-[#888888]">
              {resource.format}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium ${
              isExternal
                ? 'bg-[#F9F9F9] text-[#666666] border border-[#E5E5E5]'
                : 'bg-[#1A1A1A] text-white'
            }`}
          >
            {isExternal ? (
              <>
                <span>Externo</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </>
            ) : (
              <>
                <span>Guía</span>
                <BookOpen className="w-2.5 h-2.5" />
              </>
            )}
          </span>
        </div>

        {/* Title and Subtitle */}
        <h3 className="text-base font-semibold text-[#1A1A1A] leading-snug tracking-tight group-hover:underline">
          {resource.title}
        </h3>
        {resource.subtitle && (
          <p className="text-xs text-[#888888] font-sans mt-1">
            {resource.subtitle}
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-[#666666] leading-relaxed mt-3 font-sans">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-5">
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

      {/* Footer Info & Action */}
      <div className="mt-6 pt-4 border-t border-[#EEEEEE] flex items-center justify-between text-xs text-[#888888]">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          {resource.readingTimeMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#888888]" />
              <span>{resource.readingTimeMinutes} min</span>
            </span>
          )}
        </div>

        {isExternal ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#1A1A1A] hover:underline"
          >
            <span>Abrir enlace</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#1A1A1A] hover:underline focus:outline-none"
          >
            <span>Leer guía</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </article>
  );
};
