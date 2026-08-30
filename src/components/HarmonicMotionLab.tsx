import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

export const HarmonicMotionLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [mass, setMass] = useState<number>(1.0);
  const [springK, setSpringK] = useState<number>(4.0);
  const [damping, setDamping] = useState<number>(0.2);

  // Physics state
  const stateRef = useRef({
    x: 80, // displacement from equilibrium
    v: 0,  // velocity
    history: [] as { x: number; v: number }[],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const width = 480;
      const height = 280;
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

      // Physics integration (Euler-Cromer or RK2)
      if (isPlaying) {
        const steps = 4;
        const subDt = dt / steps;
        for (let s = 0; s < steps; s++) {
          // F = -k * x - damping * v
          const F = -springK * stateRef.current.x - damping * stateRef.current.v;
          const a = F / mass;
          stateRef.current.v += a * subDt;
          stateRef.current.x += stateRef.current.v * subDt;
        }

        // Store phase trajectory
        stateRef.current.history.push({
          x: stateRef.current.x,
          v: stateRef.current.v,
        });
        if (stateRef.current.history.length > 200) {
          stateRef.current.history.shift();
        }
      }

      const eqX = 140; // Equilibrium X for physical oscillator
      const eqY = 120;
      const currentBobX = eqX + stateRef.current.x;

      // 1. Draw Physical Spring and Mass
      ctx.strokeStyle = '#27272A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, eqY);
      // Zigzag spring
      const coils = 12;
      const springLength = currentBobX - 30;
      for (let i = 1; i <= coils; i++) {
        const segX = 30 + (springLength / coils) * (i - 0.5);
        const segY = eqY + (i % 2 === 0 ? 12 : -12);
        ctx.lineTo(segX, segY);
      }
      ctx.lineTo(currentBobX, eqY);
      ctx.stroke();

      // Wall anchor
      ctx.fillStyle = '#18181B';
      ctx.fillRect(20, eqY - 30, 10, 60);

      // Mass block
      ctx.fillStyle = '#E4E4E7';
      ctx.strokeStyle = '#09090B';
      ctx.lineWidth = 2;
      ctx.fillRect(currentBobX - 16, eqY - 16, 32, 32);
      ctx.strokeRect(currentBobX - 16, eqY - 16, 32, 32);

      // Mass label
      ctx.fillStyle = '#18181B';
      ctx.font = '10px Fira Code, monospace';
      ctx.fillText(`m=${mass.toFixed(1)}kg`, currentBobX - 18, eqY + 30);

      // Equilibrium guide line
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.25)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(eqX, 40);
      ctx.lineTo(eqX, 200);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText('x = 0', eqX - 12, 35);

      // 2. Draw Phase Space Plot (Right panel: Velocity vs Displacement)
      const phaseCenterX = 360;
      const phaseCenterY = 120;
      const phaseScale = 0.8;

      ctx.strokeStyle = '#D4D4D8';
      ctx.lineWidth = 1;
      // Phase Axes
      ctx.beginPath();
      ctx.moveTo(phaseCenterX - 90, phaseCenterY);
      ctx.lineTo(phaseCenterX + 90, phaseCenterY);
      ctx.moveTo(phaseCenterX, phaseCenterY - 70);
      ctx.lineTo(phaseCenterX, phaseCenterY + 70);
      ctx.stroke();

      ctx.fillStyle = '#71717A';
      ctx.font = '9px Fira Code, monospace';
      ctx.fillText('Posición (x)', phaseCenterX + 35, phaseCenterY - 6);
      ctx.fillText('Velocidad (v)', phaseCenterX + 6, phaseCenterY - 58);

      // Draw trajectory spiral
      if (stateRef.current.history.length > 1) {
        ctx.beginPath();
        stateRef.current.history.forEach((pt, idx) => {
          const px = phaseCenterX + pt.x * phaseScale;
          const py = phaseCenterY - pt.v * 0.4 * phaseScale;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = '#09090B';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Current point in phase space
        const currentPt = stateRef.current.history[stateRef.current.history.length - 1];
        if (currentPt) {
          ctx.beginPath();
          ctx.arc(
            phaseCenterX + currentPt.x * phaseScale,
            phaseCenterY - currentPt.v * 0.4 * phaseScale,
            4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = '#EAB308';
          ctx.fill();
          ctx.strokeStyle = '#18181B';
          ctx.stroke();
        }
      }

      ctx.restore();

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, mass, springK, damping]);

  const handleReset = () => {
    stateRef.current.x = 80;
    stateRef.current.v = 0;
    stateRef.current.history = [];
  };

  return (
    <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block mb-1">
            Mecánica Clásica & Espacio de Fase
          </span>
          <h3 className="text-xl sm:text-2xl font-light text-[#1A1A1A] tracking-tight">
            Oscilador Armónico Amortiguado
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-mono hover:bg-[#333333] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 border border-[#E5E5E5] hover:border-[#1A1A1A] text-[#1A1A1A] bg-white transition-colors"
            title="Reiniciar desplazamiento"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 border border-[#E5E5E5] bg-[#FFFFFF] overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-auto aspect-[16/9] block" />
        </div>

        <div className="lg:col-span-4 space-y-4 bg-[#F9F9F9] p-5 border border-[#E5E5E5] text-xs font-mono">
          <div>
            <div className="flex justify-between text-[#555555] mb-1.5">
              <span>Constante elástica (k):</span>
              <span className="font-bold text-[#1A1A1A]">{springK.toFixed(1)} N/m</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={springK}
              onChange={(e) => setSpringK(Number(e.target.value))}
              className="w-full accent-[#1A1A1A] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#555555] mb-1.5">
              <span>Amortiguamiento ($\gamma$):</span>
              <span className="font-bold text-[#1A1A1A]">{damping.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className="w-full accent-[#1A1A1A] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[#555555] mb-1.5">
              <span>Masa del bloque (m):</span>
              <span className="font-bold text-[#1A1A1A]">{mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              className="w-full accent-[#1A1A1A] cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] text-[11px] text-[#666666] font-sans leading-relaxed">
            El diagrama derecho traza el <em>espacio de fase</em>: la trayectoria en espiral converge asintóticamente al punto de equilibrio $(0,0)$ a medida que la fricción disipa la energía mecánica.
          </div>
        </div>
      </div>
    </div>
  );
};
