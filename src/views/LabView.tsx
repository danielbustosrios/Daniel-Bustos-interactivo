import React from 'react';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';

export const LabView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      <h1 className="text-3xl sm:text-4xl font-light text-[#1A1A1A] tracking-tight">Laboratorio</h1>
      <p id="course-access-notice" className="rounded-xl border border-[#d6e4e1] bg-[#eef5f3] p-5 text-base leading-relaxed text-[#345b60]">
        Trigonometría ya está disponible. El ingreso a Cálculo continúa deshabilitado por el momento.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="https://2026-trigonometria-decimos.vercel.app/"
          className="min-h-52 w-full rounded-2xl border border-[#246b73] bg-white p-8 sm:p-10 text-left flex flex-col justify-center gap-5 transition-colors hover:bg-[#eef5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246b73]"
        >
          <ArrowUpRight aria-hidden="true" className="h-7 w-7 text-[#246b73]" />
          <span className="text-2xl sm:text-3xl font-medium leading-snug text-[#246b73]">Trigonometría 2026-Décimos</span>
          <span className="text-sm text-[#246b73]">Entrar al curso</span>
        </a>
        {['Cálculo 2026-Onces'].map((course) => (
          <button
            key={course}
            type="button"
            disabled
            aria-describedby="course-access-notice"
            className="min-h-52 w-full rounded-2xl border border-[#d6e4e1] bg-white p-8 sm:p-10 text-left cursor-not-allowed flex flex-col justify-center gap-5"
          >
            <LockKeyhole aria-hidden="true" className="h-7 w-7 text-[#246b73]" />
            <span className="text-2xl sm:text-3xl font-medium leading-snug text-[#246b73]">{course}</span>
            <span className="text-sm text-[#666666]">Ingreso deshabilitado</span>
          </button>
        ))}
      </div>
    </div>
  );
};
