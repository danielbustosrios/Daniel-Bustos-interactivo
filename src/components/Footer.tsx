import React from 'react';
import { SpaceType } from '../types';
import { Github, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { teacherProfileData } from '../data/profile';

interface FooterProps {
  onNavigate: (space: SpaceType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-[#E5E5E5] bg-[#FFFFFF] mt-24">
      {/* Institutional Context & Open Source Bar */}
      <div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1A1A1A] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
              <span>Espacio Pedagógico Personal</span>
            </div>
            <p className="text-xs text-[#777777] leading-relaxed font-sans">
              Portal personal creado por <strong className="text-[#1A1A1A]">{teacherProfileData.name}</strong>, {teacherProfileData.role.toLowerCase()} vinculado a la <strong className="text-[#1A1A1A]">{teacherProfileData.institution}</strong>.
            </p>
            <p className="text-[11px] text-[#888888] leading-relaxed font-sans pt-0.5">
              Este sitio web no constituye la página oficial ni el canal administrativo oficial de la Institución Educativa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={teacherProfileData.githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Código Abierto</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate('contacto')}
              className="px-4 py-2 bg-[#1A1A1A] text-white hover:bg-[#333333] text-xs font-mono transition-colors"
            >
              Contacto
            </button>
          </div>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-[#E5E5E5] bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#888888] font-mono gap-2">
          <span>
            Matemáticas, Exploración y Aprendizaje Activo
          </span>
        </div>
      </div>
    </footer>
  );
};
