import React from 'react';
import { ResourceItem } from '../types';
import { X, Clock, ArrowLeft } from 'lucide-react';
import { PoincareDisk } from './PoincareDisk';
import { InteractiveWaveLab } from './InteractiveWaveLab';

interface InternalGuideModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const InternalGuideModal: React.FC<InternalGuideModalProps> = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-[#E5E5E5] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-left">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-10 bg-white px-6 sm:px-8 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#1A1A1A] hover:text-[#555555] p-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cerrar guía</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-wider bg-[#F9F9F9] text-[#1A1A1A] px-2.5 py-1 border border-[#E5E5E5]">
              {resource.category}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#888888] hover:text-[#1A1A1A] border border-transparent hover:border-[#E5E5E5] transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Article Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-8 space-y-8">
          {/* Header info */}
          <header className="space-y-3 pb-6 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2 font-mono text-xs text-[#888888]">
              <span>{resource.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {resource.readingTimeMinutes} min de lectura interactiva
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-light text-[#1A1A1A] tracking-tight leading-tight">
              {resource.title}
            </h1>
            {resource.subtitle && (
              <p className="text-base text-[#666666] font-sans">
                {resource.subtitle}
              </p>
            )}
          </header>

          {/* Conditional Interactive Embed based on resource ID */}
          {resource.id === 'disco-poincare-intro' ? (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 bg-[#F9F9F9] border border-[#E5E5E5] flex flex-col md:flex-row items-center justify-center gap-8">
                <PoincareDisk />
                <div className="max-w-sm space-y-3">
                  <h4 className="text-lg font-medium text-[#1A1A1A]">
                    ¿Qué observamos en este disco?
                  </h4>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    En la geometría euclidiana clásica, por un punto exterior a una recta pasa una sola paralela (el Quinto Postulado de Euclides). En la <strong>geometría hiperbólica</strong> de Lobachevski y Poincaré, pasan <em>infinitas</em> paralelas.
                  </p>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Para representar este plano infinito dentro de un círculo acotado, la distancia métrica se distorsiona: los triángulos y caminos tienen el mismo tamaño intrínseco en la geometría hiperbólica, pero se ven infinitesimalmente pequeños a medida que se aproximan al horizonte circular.
                  </p>
                </div>
              </div>

              <div className="text-[#444444] text-sm leading-relaxed space-y-4 font-sans">
                <h3 className="text-lg font-medium text-[#1A1A1A] pt-4">
                  1. Las geodésicas como arcos ortogonales
                </h3>
                <p>
                  Una <em>geodésica</em> es el camino más corto entre dos puntos. En el disco de Poincaré, las geodésicas son:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[#555555] pl-2">
                  <li>Segmentos de recta que pasan exactamente por el centro del disco (diámetros).</li>
                  <li>Arcos de circunferencia que intersecan la circunferencia límite en un ángulo estrictamente recto de 90° (ortogonalidad).</li>
                </ul>

                <h3 className="text-lg font-medium text-[#1A1A1A] pt-4">
                  2. La analogía del explorador hiperbólico
                </h3>
                <p>
                  El personaje animado en nuestro modelo sigue una red continua de geodésicas. Desde su perspectiva interna hiperbólica, viaja a velocidad constante y todas las baldosas tienen idéntica proporción; es solo nuestro ojo exterior el que percibe la compresión geométrica hacia el borde asintótico.
                </p>
              </div>
            </div>
          ) : resource.id === 'ondas-interferencia-ciechanowski' ? (
            <div className="space-y-6">
              <InteractiveWaveLab />
              <div className="text-[#444444] text-sm leading-relaxed space-y-4 font-sans">
                <h3 className="text-lg font-medium text-[#1A1A1A] pt-2">
                  Principio de Superposición y Patrones de Interferencia
                </h3>
                <p>
                  Cuando dos perturbaciones periódicas se encuentran en el mismo medio espacial, la perturbación resultante en cualquier coordenada $(x,y)$ es simplemente la suma algebraica directa de las amplitudes individuales:
                </p>
                <div className="p-4 bg-[#F9F9F9] font-mono text-xs text-center text-[#1A1A1A] border border-[#E5E5E5]">
                  {'Ψ_total(x,y,t) = A₁·cos(k·r₁ - ωt) + A₂·cos(k·r₂ - ωt)'}
                </div>
                <p className="text-xs text-[#666666]">
                  Utiliza los deslizadores superiores para variar la separación {'d'} entre fuentes y observa cómo las líneas nodales (donde {'Δr = (n + ½)λ'}) se abren o se concentran en el campo de visión.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-5 bg-[#F9F9F9] border border-[#E5E5E5] font-mono text-xs text-[#555555]">
                [Guía Didáctica en desarrollo continuo — Diseñada para el aula de ciencias]
              </div>
              <p className="text-sm text-[#555555] leading-relaxed font-sans">
                {resource.description}
              </p>
              <p className="text-xs text-[#888888] italic">
                Para editar este contenido o añadir nuevas guías completas, consulta el archivo <code className="font-mono bg-[#F9F9F9] border border-[#E5E5E5] px-1.5 py-0.5 text-[#1A1A1A]">src/data/resources.ts</code>.
              </p>
            </div>
          )}

          {/* Article tags footer */}
          <footer className="pt-6 border-t border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((t) => (
                <span key={t} className="text-[11px] font-mono text-[#888888] bg-[#F9F9F9] border border-[#E5E5E5] px-2.5 py-1">
                  #{t}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-mono font-medium hover:bg-[#333333] transition-colors"
            >
              Cerrar lectura
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};
