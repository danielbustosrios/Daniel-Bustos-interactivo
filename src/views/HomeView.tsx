import React from 'react';
import { SpaceType, ResourceItem } from '../types';
import { PoincareDisk } from '../components/PoincareDisk';
import { teacherProfileData } from '../data/profile';
import { ProjectileMotionCanvas } from '../components/live-experiences/ProjectileMotionCanvas';
import { 
  BookOpen, 
  ArrowUpRight, 
  Compass
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (space: SpaceType) => void;
  onOpenResource: (resource: ResourceItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION: Tono sencillo, cercano y profesional */}
      <section className="pt-2 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Portada */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#888888] font-mono mb-3 block">
              {teacherProfileData.role}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.15] tracking-tight mb-5 text-[#1A1A1A]">
              {teacherProfileData.name}
            </h1>

            <blockquote className="text-lg sm:text-xl text-[#444444] font-normal leading-relaxed mb-8 max-w-xl border-l-2 border-[#1A1A1A] pl-4 italic font-serif">
              “{teacherProfileData.introQuote}”
            </blockquote>

            <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-8 max-w-lg font-sans">
              Recursos didácticos, explicaciones visuales y modelos interactivos diseñados para experimentar con la geometría, el álgebra, el cálculo, la física y el razonamiento lógico matemático.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onNavigate('explora-experimenta')}
                className="bg-[#1A1A1A] text-white px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-medium tracking-wide hover:bg-[#333333] transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explora y experimenta</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('recursos')}
                className="border border-[#E5E5E5] bg-white text-[#1A1A1A] px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-medium tracking-wide hover:bg-[#F9F9F9] transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#666666]" />
                <span>Ver Biblioteca</span>
              </button>
            </div>

            <div className="mt-8 pt-4 border-t border-[#EEEEEE]">
              <p className="text-[11px] text-[#888888] font-mono">
                {teacherProfileData.institution} • Espacio educativo de libre acceso
              </p>
            </div>
          </div>

          {/* Right Column: Poincaré Disk Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <PoincareDisk />
          </div>
        </div>
      </section>

      {/* 2. RECURSO INTERACTIVO EN VIVO: Lanzamiento Parabólico Manipulable */}
      <section className="space-y-3 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E5E5] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#1A1A1A] flex items-center gap-2">
              <span>¿Hasta dónde puedes llegar?</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('explora-experimenta')}
              className="text-xs font-mono font-medium text-[#1A1A1A] hover:underline flex items-center gap-1.5"
            >
              <span>Más experiencias</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Projectile Motion Simulator */}
        <div className="pt-1">
          <ProjectileMotionCanvas />
        </div>
      </section>

    </div>
  );
};


