import React, { useRef, useEffect } from 'react';
import { Compass, Sparkles, Orbit, Layers } from 'lucide-react';
import { PlanetaryOrbitalCanvas } from '../components/live-experiences/PlanetaryOrbitalCanvas';
import { ProjectileMotionCanvas } from '../components/live-experiences/ProjectileMotionCanvas';
import { FunctionTransformerCanvas } from '../components/live-experiences/FunctionTransformerCanvas';
import { DollarTimelineExperience } from '../components/live-experiences/DollarTimelineExperience';
import { TrigonometricTourCanvas } from '../components/live-experiences/TrigonometricTourCanvas';

interface ExploreViewProps {
  initialScrollTarget?: string | null;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ initialScrollTarget }) => {
  const dollarRef = useRef<HTMLDivElement>(null);
  const planetsRef = useRef<HTMLDivElement>(null);
  const projectileRef = useRef<HTMLDivElement>(null);
  const trigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialScrollTarget === 'cuanto-cuesta-hoy' || window.location.hash === '#cuanto-cuesta-hoy') {
      setTimeout(() => {
        dollarRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [initialScrollTarget]);

  return (
    <div className="space-y-16 max-w-6xl mx-auto text-left">
      {/* Header Section: Declaración de Principio Pedagógico */}
      <header className="space-y-3 border-b border-[#E5E5E5] pb-8">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block">
            Galería de Experiencias Vivas
          </span>
          <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[10px] font-mono uppercase font-semibold">
            Interactivas
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight flex items-center gap-3">
          <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-[#1A1A1A]" />
          <span>Explora y experimenta</span>
        </h1>

        <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono text-[#666666]">
          <span className="bg-[#F5F5F5] px-2.5 py-1 border border-[#E0E0E0] text-[#1A1A1A] font-semibold">
            Principio central: Primero ver, después tocar y finalmente comprender.
          </span>
        </div>
      </header>

      {/* 1. ESCENA PRINCIPAL AMPLIA: PLANETAS Y SISTEMA ORBITAL */}
      <section ref={planetsRef} className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-[#1A1A1A]" />
            <h2 className="text-xl sm:text-2xl font-light text-[#1A1A1A] tracking-tight">
              Planetas: Una ventana al espacio
            </h2>
          </div>
          <span className="text-xs font-mono text-[#666666]">
            Arrastra el espacio, cambia la velocidad y observa las velocidades relativas
          </span>
        </div>

        {/* Panoramic Planetary Canvas */}
        <PlanetaryOrbitalCanvas />
      </section>

      {/* 2. ESCENA: PROYECTILES */}
      <section className="space-y-4">
        <div ref={projectileRef} className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-[#1A1A1A] tracking-tight">
                ¿Hasta dónde puedes llegar?
              </h3>
            </div>
          </div>

          <ProjectileMotionCanvas />
        </div>
      </section>

      {/* 3. EXPERIENCIAS DE FUNCIONES Y ECONOMÍA COTIDIANA (STACK HORIZONTAL COMPLETO) */}
      <section className="space-y-8">
        <div className="border-b border-[#E5E5E5] pb-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block">
            Modelación Geométrica y Datos Reales
          </span>
        </div>

        {/* Módulo C: Funciones que se transforman (Ancho completo) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1A1A1A]" />
              <h3 className="text-lg font-medium text-[#1A1A1A] tracking-tight">
                Funciones que se transforman
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#777777]">
              Arrastra el vértice azul en el plano
            </span>
          </div>

          <FunctionTransformerCanvas />
        </div>

        {/* Módulo D: El Dólar en Colombia (Ancho completo) */}
        <div ref={dollarRef} className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
              <h3 className="text-lg font-medium text-[#1A1A1A] tracking-tight">
                El Dólar: Línea de tiempo interactiva
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#777777]">
              Recorre la curva con el cursor o el dedo
            </span>
          </div>

          <DollarTimelineExperience />
        </div>
      </section>

      {/* 4. EXPERIENCIA VIVA: TOUR TRIGONOMÉTRICO */}
      <section ref={trigRef} className="space-y-4 pt-4 border-t border-[#E5E5E5]">
        <div className="border-b border-[#E5E5E5] pb-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block">
            Geometría y Razones Trigonométricas
          </span>
        </div>

        <TrigonometricTourCanvas />
      </section>
    </div>
  );
};
