import React, { useState } from 'react';
import { Send, Clock, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto text-left">
      {/* Header */}
      <header className="space-y-3 border-b border-[#E5E5E5] pb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block">
          Espacio Pedagógico • Contacto
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight">
          Contacto y Consultas
        </h1>
        <p className="text-sm sm:text-base text-[#666666] leading-relaxed font-sans max-w-3xl">
          Espacio para estudiantes, colegas docentes e interesados en los recursos educativos, proyectos didácticos o adaptaciones de aula.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Information & Channel Status Column */}
        <div className="md:col-span-5 space-y-4">
          {/* Attention guidance */}
          <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-5 text-xs text-[#666666] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A] font-mono uppercase tracking-wider text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>Atención y consultas académicas</span>
            </div>
            <p className="leading-relaxed font-sans">
              Para consultas de aula o asesorías sobre talleres, puedes preparar tu mensaje mediante el formulario.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-5 text-xs text-[#666666] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A] font-mono uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Criterio de privacidad</span>
            </div>
            <p className="leading-relaxed font-sans">
              Este sitio web respeta la privacidad de los datos personales. No se publican correos privados, teléfonos ni documentos con información sensible no divulgable.
            </p>
          </div>
        </div>

        {/* Message Preparer Form */}
        <div className="md:col-span-7 bg-white border border-[#E5E5E5] p-6 sm:p-8">
          <h3 className="font-light text-2xl text-[#1A1A1A] tracking-tight mb-6">
            Redactar Consulta
          </h3>

          <form onSubmit={handleSimulateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-1.5">
                  Nombre o institución:
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Ej. Estudiante / Docente"
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] focus:border-[#1A1A1A] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-1.5">
                  Correo de contacto:
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] focus:border-[#1A1A1A] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-1.5">
                Asunto:
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej. Consulta sobre simulación o propuesta de taller"
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] focus:border-[#1A1A1A] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-1.5">
                Mensaje:
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje o consulta pedagógica..."
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] focus:border-[#1A1A1A] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-[#888888] font-mono">
                * Comunicación pedagógica
              </span>
              <button
                type="submit"
                className="px-6 py-3 bg-[#1A1A1A] text-white text-xs font-mono font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Registrar Mensaje</span>
              </button>
            </div>
          </form>

          {feedbackSent && (
            <div className="mt-4 p-4 bg-[#F9F9F9] border border-[#E5E5E5] text-xs text-[#555555] font-mono">
              ✓ Mensaje registrado correctamente para el canal de atención pedagógica.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
