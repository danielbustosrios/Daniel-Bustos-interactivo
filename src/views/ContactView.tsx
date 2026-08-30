import React, { useRef, useState } from 'react';
import { Send, Clock, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const sendingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendingRef.current) return;
    const data = new FormData(e.currentTarget);
    if (data.get('_gotcha')) return;
    sendingRef.current = true;
    setIsSending(true);
    setFeedbackSent(false);
    setSendError('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://formspree.io/f/meaqeqpy', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Submission failed');
      setFeedbackSent(true);
      setSenderName('');
      setSenderEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setSendError('No pudimos confirmar el envío. Conservamos tu mensaje; comprueba tu conexión e inténtalo de nuevo más tarde.');
    } finally {
      window.clearTimeout(timeout);
      sendingRef.current = false;
      setIsSending(false);
    }
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
              Para consultas de aula o asesorías sobre talleres, puedes enviar tu mensaje mediante el formulario.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-5 text-xs text-[#666666] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A] font-mono uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Criterio de privacidad</span>
            </div>
            <p className="leading-relaxed font-sans">
              Tu nombre, correo y mensaje se enviarán a través de Formspree para atender tu consulta. No incluyas información sensible ni datos personales de estudiantes.
            </p>
          </div>
        </div>

        {/* Message Preparer Form */}
        <div className="md:col-span-7 bg-white border border-[#E5E5E5] p-6 sm:p-8">
          <h3 className="font-light text-2xl text-[#1A1A1A] tracking-tight mb-6">
            Redactar Consulta
          </h3>

          <form action="https://formspree.io/f/meaqeqpy" method="POST" onSubmit={handleSubmit} aria-busy={isSending} className="space-y-4">
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <fieldset disabled={isSending} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-1.5">
                  Nombre o institución:
                </label>
                <input
                  type="text"
                  required
                  id="contact-name"
                  name="name"
                  maxLength={150}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Ej. Estudiante / Docente"
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] focus:border-[#1A1A1A] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-1.5">
                  Correo de contacto:
                </label>
                <input
                  type="email"
                  required
                  id="contact-email"
                  name="email"
                  maxLength={254}
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] focus:border-[#1A1A1A] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-1.5">
                Asunto:
              </label>
              <input
                type="text"
                required
                id="contact-subject"
                  name="subject"
                  maxLength={200}
                  value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej. Consulta sobre simulación o propuesta de taller"
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] focus:border-[#1A1A1A] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-1.5">
                Mensaje:
              </label>
              <textarea
                rows={5}
                required
                id="contact-message"
                  name="message"
                  maxLength={5000}
                  value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje o consulta pedagógica..."
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] focus:border-[#1A1A1A] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-[#888888] font-mono">
                Al enviar, compartes estos datos para recibir respuesta a tu consulta.
              </span>
              <button
                type="submit"
                className="px-6 py-3 bg-[#1A1A1A] text-white text-xs font-mono font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Enviando…' : 'Enviar mensaje'}</span>
              </button>
            </div>
            </fieldset>
          </form>
          {sendError && <p role="alert" className="mt-4 p-4 border border-red-200 bg-red-50 text-sm text-red-800">{sendError}</p>}

          {feedbackSent && (
            <div role="status" className="mt-4 p-4 bg-[#F9F9F9] border border-[#E5E5E5] text-xs text-[#555555] font-mono">
              ✓ Tu consulta se ha enviado correctamente. Gracias por escribir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
