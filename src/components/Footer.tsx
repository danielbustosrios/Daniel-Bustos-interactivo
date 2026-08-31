import React from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { teacherProfileData } from '../data/profile';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E5E5E5] bg-[#FFFFFF] mt-24">
      {/* Institutional Context & Contact */}
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

          <div className="min-w-0 max-w-full space-y-2 text-left">
            <p className="text-xs text-[#777777]">Correo institucional</p>
            <a
              href="mailto:daniel.bustos.rios@carlosvieco.edu.co"
              className="inline-flex max-w-full items-start gap-2 text-sm text-[#246b73] underline underline-offset-4 hover:text-[#1A1A1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="break-all">daniel.bustos.rios@carlosvieco.edu.co</span>
            </a>
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
