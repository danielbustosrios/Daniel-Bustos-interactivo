import React from 'react';
import { SpaceType, ResourceItem } from '../types';
import { PoincareDisk } from '../components/PoincareDisk';
import { teacherProfileData } from '../data/profile';
import { ProjectileMotionCanvas } from '../components/live-experiences/ProjectileMotionCanvas';
import { 
  BookOpen, 
  FolderKanban, 
  ArrowRight, 
  User, 
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

      {/* 3. SPACES OVERVIEW: Cuadrícula con los 4 espacios de exploración (Debajo de la simulación) */}
      <section className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E5E5] pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] block mb-1">
              Estructura
            </span>
            <h2 className="text-2xl font-light tracking-tight text-[#1A1A1A]">
              Espacios de exploración
            </h2>
          </div>
          <p className="text-xs text-[#777777] font-sans max-w-sm">
            Recursos didácticos, simulaciones interactivas e iniciativas de aula.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#E5E5E5] bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E5]">
          {[
            {
              id: 'sobre-mi' as SpaceType,
              title: 'Sobre mí',
              subtitle: 'Trayectoria & Formación',
              description: 'Perfil docente, formación académica y fundamentos pedagógicos.',
              icon: <User className="w-4 h-4 text-[#1A1A1A]" />,
            },
            {
              id: 'explora-experimenta' as SpaceType,
              title: 'Explora y experimenta',
              subtitle: 'Simulaciones & Indagación',
              description: 'Experiencias interactivas de física, astronomía, matemáticas y economía.',
              icon: <Compass className="w-4 h-4 text-[#1A1A1A]" />,
            },
            {
              id: 'recursos' as SpaceType,
              title: 'Biblioteca',
              subtitle: 'Recursos Didácticos',
              description: 'Guías modulares, explicaciones visuales y materiales de libre acceso.',
              icon: <BookOpen className="w-4 h-4 text-[#1A1A1A]" />,
            },
            {
              id: 'proyectos' as SpaceType,
              title: 'Proyectos',
              subtitle: 'Iniciativas de Aula',
              description: 'Propuestas pedagógicas, experiencias de indagación matemática y proyectos.',
              icon: <FolderKanban className="w-4 h-4 text-[#1A1A1A]" />,
            },
          ].map((space) => (
            <button
              key={space.id}
              type="button"
              onClick={() => onNavigate(space.id)}
              className="p-6 sm:p-8 text-left flex flex-col justify-between hover:bg-[#F9F9F9] transition-colors group"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-[#F9F9F9] border border-[#E5E5E5] flex items-center justify-center mb-5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                  {space.icon}
                </div>
                <h3 className="text-base font-medium text-[#1A1A1A] tracking-tight">
                  {space.title}
                </h3>
                <span className="text-[11px] font-mono text-[#888888] block mt-0.5 mb-2">
                  {space.subtitle}
                </span>
                <p className="text-xs text-[#666666] leading-relaxed font-sans">
                  {space.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#EEEEEE] flex items-center justify-between text-xs font-mono text-[#1A1A1A] group-hover:underline">
                <span>Acceder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};


