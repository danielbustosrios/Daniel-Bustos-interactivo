import React, { useState } from 'react';
import { labExperimentsData } from '../data/labExperiments';
import { PoincareDisk } from '../components/PoincareDisk';
import { InteractiveWaveLab } from '../components/InteractiveWaveLab';
import { HarmonicMotionLab } from '../components/HarmonicMotionLab';
import { Compass } from 'lucide-react';

export const LabView: React.FC = () => {
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>('poincare-hyperbolic-lab');

  const activeExp = labExperimentsData.find((exp) => exp.id === selectedExperimentId) || labExperimentsData[0];

  return (
    <div className="space-y-12 max-w-6xl mx-auto text-left">
      {/* Header */}
      <header className="space-y-3 border-b border-[#E5E5E5] pb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block">
          Espacio Pedagógico • Laboratorio
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight">
          Laboratorio de Experimentación Manipulable
        </h1>
        <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-3xl font-sans">
          Inspirado en los principios didácticos de <strong>Bartosz Ciechanowski</strong> y <strong>Nicky Case</strong>: el conocimiento físico y matemático se construye al interactuar directamente con los parámetros del modelo, alterar las condiciones iniciales y observar las respuestas del sistema.
        </p>
      </header>

      {/* Experiment Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {labExperimentsData.map((exp) => {
          const isSelected = exp.id === selectedExperimentId;
          return (
            <button
              key={exp.id}
              type="button"
              onClick={() => setSelectedExperimentId(exp.id)}
              className={`p-6 text-left border transition-colors flex flex-col justify-between ${
                isSelected
                  ? 'border-[#1A1A1A] bg-white shadow-xs'
                  : 'border-[#E5E5E5] bg-[#F9F9F9] hover:bg-white hover:border-[#CCCCCC]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                  <span className={`px-2 py-0.5 ${isSelected ? 'bg-[#1A1A1A] text-white' : 'bg-[#E5E5E5] text-[#555555]'}`}>
                    {exp.difficulty}
                  </span>
                  <span className="text-[#888888]">~{exp.estimatedMinutes} min</span>
                </div>
                <h3 className="font-medium text-base text-[#1A1A1A] leading-snug">
                  {exp.title}
                </h3>
                <p className="text-xs text-[#666666] mt-1.5 line-clamp-2">
                  {exp.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center gap-1.5 text-[11px] font-mono text-[#1A1A1A]">
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#1A1A1A]' : 'bg-[#CCCCCC]'}`} />
                <span>{isSelected ? 'Simulación activa' : 'Seleccionar experimento'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Experiment Stage */}
      <div className="space-y-6">
        <div className="p-5 bg-white border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-light text-[#1A1A1A] tracking-tight">
              {activeExp.title}
            </h2>
            <p className="text-xs text-[#666666] font-sans mt-1">
              {activeExp.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-[10px]">
            {activeExp.concepts.map((c) => (
              <span key={c} className="bg-[#F9F9F9] border border-[#E5E5E5] text-[#555555] px-2.5 py-1">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Experiment Content Renderer */}
        {activeExp.id === 'poincare-hyperbolic-lab' && (
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex justify-center">
                <PoincareDisk />
              </div>
              <div className="lg:col-span-6 space-y-5 text-xs text-[#555555] leading-relaxed font-sans">
                <div className="p-4 bg-[#F9F9F9] border border-[#E5E5E5] space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#1A1A1A]" />
                    <span>Guía del Experimento: Geometría Hiperbólica</span>
                  </div>
                  <p className="text-[#666666]">
                    Observa la red geométrica: cada arco circular intersecta la circunferencia límite perpendicularmente (a 90°).
                  </p>
                </div>

                <h4 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] font-mono">
                  Conceptos a explorar:
                </h4>
                <ul className="space-y-2 text-[#555555]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1A1A1A] font-mono font-bold">•</span>
                    <span><strong className="text-[#1A1A1A]">Geodésicas ortogonales:</strong> En el modelo de Poincaré, la distancia métrica hiperbólica crece asintóticamente hacia el infinito en el borde circular.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1A1A1A] font-mono font-bold">•</span>
                    <span><strong className="text-[#1A1A1A]">Navegación sobre grafos:</strong> El caminante amarillo recorre la red conectada seleccionando ramas en cada intersección.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1A1A1A] font-mono font-bold">•</span>
                    <span><strong className="text-[#1A1A1A]">Control de simulación:</strong> Usa los controles en la esquina inferior para pausar el trazado continuo o aislar la red de geodésicas.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeExp.id === 'wave-superposition-lab' && (
          <InteractiveWaveLab />
        )}

        {activeExp.id === 'harmonic-motion-lab' && (
          <HarmonicMotionLab />
        )}
      </div>
    </div>
  );
};
