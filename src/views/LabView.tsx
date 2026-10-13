import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const LabView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      <h1 className="text-3xl sm:text-4xl font-light text-[#1A1A1A] tracking-tight">Laboratorio</h1>
      <p id="course-access-notice" className="rounded-xl border border-[#d6e4e1] bg-[#eef5f3] p-5 text-base leading-relaxed text-[#345b60]">
        Valle Esmeralda para Cálculo está disponible. Trigonometría está temporalmente deshabilitada.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          aria-disabled="true"
          className="min-h-52 w-full rounded-2xl border border-[#d6e4e1] bg-[#f3f4f3] p-8 sm:p-10 text-left flex flex-col justify-center gap-5 cursor-not-allowed"
        >
          <span className="text-2xl sm:text-3xl font-medium leading-snug text-[#667572]">Trigonometría 2026-Décimos</span>
          <span className="text-sm text-[#667572]">Temporalmente no disponible</span>
        </div>
        <a
          href="https://danielbustosrios.github.io/valle-esmeralda/"
          className="min-h-52 w-full rounded-2xl border border-[#246b73] bg-white p-8 sm:p-10 text-left flex flex-col justify-center gap-5 transition-colors hover:bg-[#eef5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246b73]"
        >
          <ArrowUpRight aria-hidden="true" className="h-7 w-7 text-[#246b73]" />
          <span className="text-2xl sm:text-3xl font-medium leading-snug text-[#246b73]">Cálculo 2026-Onces</span>
          <span className="text-sm text-[#246b73]">Entrar a Valle Esmeralda</span>
        </a>
      </div>
    </div>
  );
};
