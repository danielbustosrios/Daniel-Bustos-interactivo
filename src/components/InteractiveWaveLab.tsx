import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sliders, Activity, Sparkles, HelpCircle } from 'lucide-react';

export const InteractiveWaveLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<number>(1.2);
  const [wavelength, setWavelength] = useState<number>(38);
  const [sourceSeparation, setSourceSeparation] = useState<number>(90);
  const [damping, setDamping] = useState<number>(0.003);
  const [mode, setMode] = useState<'double' | 'single' | 'standing'>('double');
  const [probePos, setProbePos] = useState<{ x: number; y: number }>({ x: 220, y: 150 });
  const [probeValue, setProbeValue] = useState<{ amp1: number; amp2: number; total: number }>({ amp1: 0, amp2: 0, total: 0 });
  const [activeStep, setActiveStep] = useState<number>(1);

  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;

    const render = () => {
      const width = 480;
      const height = 300;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#E4E4E7';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (isPlaying) {
        timeRef.current += 0.045 * frequency;
      }
      const t = timeRef.current;
      const k = (2 * Math.PI) / wavelength;
      const omega = 2 * Math.PI * frequency;

      // Sources
      const s1 = { x: 80, y: 150 - (mode === 'double' ? sourceSeparation / 2 : 0) };
      const s2 = { x: 80, y: 150 + (mode === 'double' ? sourceSeparation / 2 : 0) };

      // Render wave field using density / contour lines
      const step = 8;
      for (let x = 100; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          const d1 = Math.hypot(x - s1.x, y - s1.y);
          const att1 = Math.exp(-damping * d1);
          const val1 = Math.cos(k * d1 - t) * att1;

          let totalVal = val1;

          if (mode === 'double') {
            const d2 = Math.hypot(x - s2.x, y - s2.y);
            const att2 = Math.exp(-damping * d2);
            const val2 = Math.cos(k * d2 - t) * att2;
            totalVal = (val1 + val2) * 0.5;
          } else if (mode === 'standing') {
            // Standing wave reflection
            const dRef = Math.hypot(width - (x - 80), y - s1.y);
            totalVal = (val1 + Math.cos(k * dRef + t) * Math.exp(-damping * dRef)) * 0.5;
          }

          // Convert amplitude to grayscale intensity
          // 0 -> #FAFAFA, positive -> darker, negative -> brighter/subtle outline
          const normalized = (totalVal + 1) / 2; // [0, 1]
          const intensity = Math.floor(255 - normalized * 180);
          ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
          ctx.fillRect(x - step / 2, y - step / 2, step, step);
        }
      }

      // Draw wavefront circles from sources
      const drawWavefronts = (src: { x: number; y: number }) => {
        ctx.strokeStyle = 'rgba(24, 24, 27, 0.4)';
        ctx.lineWidth = 1;
        const maxR = 400;
        const phaseOffset = (t % (2 * Math.PI)) / k;
        for (let r = phaseOffset; r < maxR; r += wavelength) {
          if (r > 5) {
            ctx.beginPath();
            ctx.arc(src.x, src.y, r, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
          }
        }
      };

      drawWavefronts(s1);
      if (mode === 'double') {
        drawWavefronts(s2);
      }

      // Draw source emitters
      const drawSourceIcon = (src: { x: number; y: number }, label: string) => {
        ctx.beginPath();
        ctx.arc(src.x, src.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#18181B';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '10px Fira Code, monospace';
        ctx.fillStyle = '#18181B';
        ctx.fillText(label, src.x - 18, src.y - 10);
      };

      drawSourceIcon(s1, 'S₁');
      if (mode === 'double') {
        drawSourceIcon(s2, 'S₂');
      }

      // Calculate probe readings
      const d1Probe = Math.hypot(probePos.x - s1.x, probePos.y - s1.y);
      const v1 = Math.cos(k * d1Probe - t) * Math.exp(-damping * d1Probe);
      let v2 = 0;
      if (mode === 'double') {
        const d2Probe = Math.hypot(probePos.x - s2.x, probePos.y - s2.y);
        v2 = Math.cos(k * d2Probe - t) * Math.exp(-damping * d2Probe);
      }
      const vTotal = mode === 'double' ? (v1 + v2) / 2 : v1;

      // Draw Probe Cursor
      ctx.beginPath();
      ctx.arc(probePos.x, probePos.y, 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#09090B';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();

      // Crosshairs on probe
      ctx.beginPath();
      ctx.moveTo(probePos.x - 10, probePos.y);
      ctx.lineTo(probePos.x + 10, probePos.y);
      ctx.moveTo(probePos.x, probePos.y - 10);
      ctx.lineTo(probePos.x, probePos.y + 10);
      ctx.strokeStyle = '#09090B';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, frequency, wavelength, sourceSeparation, damping, mode, probePos]);

  // Update probe calculation for UI readout
  useEffect(() => {
    const k = (2 * Math.PI) / wavelength;
    const t = timeRef.current;
    const s1 = { x: 80, y: 150 - (mode === 'double' ? sourceSeparation / 2 : 0) };
    const s2 = { x: 80, y: 150 + (mode === 'double' ? sourceSeparation / 2 : 0) };

    const d1 = Math.hypot(probePos.x - s1.x, probePos.y - s1.y);
    const v1 = Math.cos(k * d1 - t) * Math.exp(-damping * d1);
    let v2 = 0;
    if (mode === 'double') {
      const d2 = Math.hypot(probePos.x - s2.x, probePos.y - s2.y);
      v2 = Math.cos(k * d2 - t) * Math.exp(-damping * d2);
    }
    const total = mode === 'double' ? (v1 + v2) / 2 : v1;

    setProbeValue({
      amp1: Number(v1.toFixed(3)),
      amp2: Number(v2.toFixed(3)),
      total: Number(total.toFixed(3)),
    });
  }, [probePos, wavelength, sourceSeparation, damping, mode, frequency]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(105, Math.min(470, e.clientX - rect.left));
    const y = Math.max(10, Math.min(290, e.clientY - rect.top));
    setProbePos({ x, y });
  };

  return (
    <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 text-left">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono">
              Demostración Didáctica
            </span>
            <span className="text-[11px] text-[#888888] font-mono">• Inspirado en B. Ciechanowski</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-light text-[#1A1A1A] tracking-tight">
            Superposición de Ondas e Interferencia Espacial
          </h3>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white hover:bg-[#333333] text-xs font-mono transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFrequency(1.2);
              setWavelength(38);
              setSourceSeparation(90);
              setMode('double');
              setProbePos({ x: 220, y: 150 });
            }}
            className="p-2 border border-[#E5E5E5] hover:border-[#1A1A1A] text-[#1A1A1A] bg-white transition-colors"
            title="Restablecer parámetros iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Guided Steps / Concepts: Divided Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#E5E5E5] bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E5] my-6">
        {[
          { step: 1, title: "1. Fuente Única", desc: "Propagación radial pura", set: () => setMode('single') },
          { step: 2, title: "2. Dos Fuentes", desc: "Interferencia constructiva/destructiva", set: () => setMode('double') },
          { step: 3, title: "3. Onda Estacionaria", desc: "Reflexión y nodos fijos", set: () => setMode('standing') },
        ].map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => {
              setActiveStep(item.step);
              item.set();
            }}
            className={`p-4 text-left transition-colors ${
              activeStep === item.step
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white hover:bg-[#F9F9F9] text-[#1A1A1A]'
            }`}
          >
            <p className={`text-xs font-medium ${activeStep === item.step ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {item.title}
            </p>
            <p className={`text-[11px] truncate mt-1 ${activeStep === item.step ? 'text-[#888888]' : 'text-[#666666]'}`}>
              {item.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Main Simulation Viewport & Probe Readouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Stage */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full border border-[#E5E5E5] bg-[#FFFFFF] overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-auto block aspect-[16/10]"
              title="Haz clic en cualquier punto para ubicar la sonda de amplitud"
            />

            <div className="absolute top-3 right-3 bg-white/95 border border-[#E5E5E5] text-[#1A1A1A] text-[10px] font-mono px-2.5 py-1">
              Haz clic para posicionar la sonda ⌖
            </div>
          </div>
          <p className="text-xs text-[#777777] mt-3 text-center italic font-serif max-w-lg">
            Fig 1.1 — Campo de interferencia escalar. Las zonas oscuras corresponden a crestas acumuladas de máxima compresión, mientras las franjas intermedias muestran cancelaciones destructivas (nodos).
          </p>
        </div>

        {/* Live Parameters & Sliders */}
        <div className="lg:col-span-4 space-y-4">
          {/* Probe Metric Box */}
          <div className="p-4 bg-[#1A1A1A] text-white font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between text-[#888888] border-b border-[#333333] pb-2">
              <span className="flex items-center gap-1.5 text-white">
                <Activity className="w-3.5 h-3.5 text-[#FFFFFF]" />
                <span>Sonda puntual (x: {probePos.x}, y: {probePos.y})</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-[#888888] block">Amplitud $S_1$:</span>
                <p className="text-white font-semibold text-sm mt-0.5">{probeValue.amp1}</p>
              </div>
              {mode === 'double' && (
                <div>
                  <span className="text-[#888888] block">Amplitud $S_2$:</span>
                  <p className="text-white font-semibold text-sm mt-0.5">{probeValue.amp2}</p>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-[#333333] flex items-center justify-between">
              <span className="text-[#888888]">Amplitud Resultante $\Psi$:</span>
              <span className="px-2 py-0.5 font-bold text-xs bg-[#333333] text-white">
                {probeValue.total}
              </span>
            </div>
          </div>

          {/* Sliders Container */}
          <div className="p-4 bg-[#F9F9F9] border border-[#E5E5E5] space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-[#555555] mb-1.5">
                <span>Longitud de onda ($\lambda$):</span>
                <span className="font-semibold text-[#1A1A1A]">{wavelength} px</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                step="1"
                value={wavelength}
                onChange={(e) => setWavelength(Number(e.target.value))}
                className="w-full accent-[#1A1A1A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-[#555555] mb-1.5">
                <span>Frecuencia ($f$):</span>
                <span className="font-semibold text-[#1A1A1A]">{frequency.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-[#1A1A1A] cursor-pointer"
              />
            </div>

            {mode === 'double' && (
              <div>
                <div className="flex justify-between text-xs font-mono text-[#555555] mb-1.5">
                  <span>Separación de fuentes ($d$):</span>
                  <span className="font-semibold text-[#1A1A1A]">{sourceSeparation} px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="160"
                  step="2"
                  value={sourceSeparation}
                  onChange={(e) => setSourceSeparation(Number(e.target.value))}
                  className="w-full accent-[#1A1A1A] cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
