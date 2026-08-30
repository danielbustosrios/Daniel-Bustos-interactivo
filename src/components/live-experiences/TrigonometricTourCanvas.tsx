import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Compass } from 'lucide-react';

export const TrigonometricTourCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showSin, setShowSin] = useState<boolean>(true);
  const [showCos, setShowCos] = useState<boolean>(true);
  const [showTan, setShowTan] = useState<boolean>(true);
  const [showTriangle, setShowTriangle] = useState<boolean>(true);
  const [showWave, setShowWave] = useState<boolean>(true);

  const isDraggingRef = useRef<boolean>(false);
  const angleRef = useRef<number>(angleDeg);
  angleRef.current = angleDeg;

  // Exact angle helper
  const getExactValues = (deg: number) => {
    const norm = ((deg % 360) + 360) % 360;
    switch (norm) {
      case 0:
      case 360:
        return { radText: '0 rad', sinExact: '0', cosExact: '1', tanExact: '0' };
      case 30:
        return { radText: 'π/6 rad', sinExact: '1/2', cosExact: '√3/2', tanExact: '√3/3' };
      case 45:
        return { radText: 'π/4 rad', sinExact: '√2/2', cosExact: '√2/2', tanExact: '1' };
      case 60:
        return { radText: 'π/3 rad', sinExact: '√3/2', cosExact: '1/2', tanExact: '√3' };
      case 90:
        return { radText: 'π/2 rad', sinExact: '1', cosExact: '0', tanExact: 'Indefinido (∞)' };
      case 120:
        return { radText: '2π/3 rad', sinExact: '√3/2', cosExact: '-1/2', tanExact: '-√3' };
      case 135:
        return { radText: '3π/4 rad', sinExact: '√2/2', cosExact: '-√2/2', tanExact: '-1' };
      case 150:
        return { radText: '5π/6 rad', sinExact: '1/2', cosExact: '-√3/2', tanExact: '-√3/3' };
      case 180:
        return { radText: 'π rad', sinExact: '0', cosExact: '-1', tanExact: '0' };
      case 210:
        return { radText: '7π/6 rad', sinExact: '-1/2', cosExact: '-√3/2', tanExact: '√3/3' };
      case 225:
        return { radText: '5π/4 rad', sinExact: '-√2/2', cosExact: '-√2/2', tanExact: '1' };
      case 240:
        return { radText: '4π/3 rad', sinExact: '-√3/2', cosExact: '-1/2', tanExact: '√3' };
      case 270:
        return { radText: '3π/2 rad', sinExact: '-1', cosExact: '0', tanExact: 'Indefinido (-∞)' };
      case 300:
        return { radText: '5π/3 rad', sinExact: '-√3/2', cosExact: '1/2', tanExact: '-√3' };
      case 315:
        return { radText: '7π/4 rad', sinExact: '-√2/2', cosExact: '√2/2', tanExact: '-1' };
      case 330:
        return { radText: '11π/6 rad', sinExact: '-1/2', cosExact: '√3/2', tanExact: '-√3/3' };
      default: {
        const rad = (norm * Math.PI) / 180;
        return {
          radText: `${rad.toFixed(2)} rad`,
          sinExact: Math.sin(rad).toFixed(3),
          cosExact: Math.cos(rad).toFixed(3),
          tanExact: Math.abs(Math.cos(rad)) < 0.0001 ? 'Indefinido' : Math.tan(rad).toFixed(3)
        };
      }
    }
  };

  const angleRad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(angleRad);
  const cosVal = Math.cos(angleRad);
  const isTanUndefined = Math.abs(cosVal) < 0.0001;
  const tanVal = isTanUndefined ? Infinity : Math.tan(angleRad);
  const exact = getExactValues(angleDeg);

  // Quadrant determination
  const normalizedDeg = ((angleDeg % 360) + 360) % 360;
  let quadrant = 'I';
  if (normalizedDeg > 90 && normalizedDeg < 180) quadrant = 'II';
  else if (normalizedDeg > 180 && normalizedDeg < 270) quadrant = 'III';
  else if (normalizedDeg > 270 && normalizedDeg < 360) quadrant = 'IV';
  else if (normalizedDeg === 0 || normalizedDeg === 360 || normalizedDeg === 90 || normalizedDeg === 180 || normalizedDeg === 270) {
    quadrant = 'Eje';
  }

  // Animation Loop when playing
  useEffect(() => {
    if (!isPlaying) return;
    let animationFrame: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setAngleDeg((prev) => {
        const next = (prev + delta * 30) % 360;
        return parseFloat(next.toFixed(1));
      });
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  // Main Canvas Rendering
  useEffect(() => {
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Layout split: If wide enough and showWave is true, split horizontally
      const isSplit = width >= 560 && showWave;
      const circleCenterX = isSplit ? width * 0.32 : width * 0.5;
      const circleCenterY = height * 0.5;
      const radius = Math.min(circleCenterX - 35, circleCenterY - 35, 120);

      // ----------------------------------------------------
      // 1. DRAW UNIT CIRCLE SECTION
      // ----------------------------------------------------

      // Subdued background concentric guides
      ctx.strokeStyle = '#F3F4F6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Main Axes
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1.5;

      // X Axis
      ctx.beginPath();
      ctx.moveTo(circleCenterX - radius - 25, circleCenterY);
      ctx.lineTo(circleCenterX + radius + 25, circleCenterY);
      ctx.stroke();

      // Y Axis
      ctx.beginPath();
      ctx.moveTo(circleCenterX, circleCenterY - radius - 25);
      ctx.lineTo(circleCenterX, circleCenterY + radius + 25);
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = '#6B7280';
      ctx.font = '10px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('+1', circleCenterX + radius, circleCenterY + 5);
      ctx.fillText('-1', circleCenterX - radius, circleCenterY + 5);
      ctx.fillText('X (cos)', circleCenterX + radius + 20, circleCenterY + 12);

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('+1', circleCenterX - 6, circleCenterY - radius);
      ctx.fillText('-1', circleCenterX - 6, circleCenterY + radius);
      ctx.fillText('Y (sen)', circleCenterX - 6, circleCenterY - radius - 15);

      // Unit Circle Outline
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Current Point P Coordinates on canvas
      const rad = (angleRef.current * Math.PI) / 180;
      const curCos = Math.cos(rad);
      const curSin = Math.sin(rad);

      const px = circleCenterX + curCos * radius;
      const py = circleCenterY - curSin * radius;

      // Fill Angle Sector (Subtle wedge)
      ctx.fillStyle = 'rgba(31, 41, 55, 0.04)';
      ctx.beginPath();
      ctx.moveTo(circleCenterX, circleCenterY);
      ctx.arc(circleCenterX, circleCenterY, radius * 0.35, 0, -rad, true);
      ctx.closePath();
      ctx.fill();

      // Angle Arc
      ctx.strokeStyle = '#4B5563';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, Math.min(28, radius * 0.35), 0, -rad, true);
      ctx.stroke();

      // Angle Text Label inside arc
      const halfRad = rad / 2;
      const arcTextDist = 38;
      const arcTextX = circleCenterX + Math.cos(halfRad) * arcTextDist;
      const arcTextY = circleCenterY - Math.sin(halfRad) * arcTextDist;
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`θ = ${Math.round(angleRef.current)}°`, arcTextX, arcTextY);

      // Right Triangle and Trigonometric Segments
      if (showTriangle) {
        // Triangle Fill
        ctx.fillStyle = 'rgba(59, 130, 246, 0.07)';
        ctx.beginPath();
        ctx.moveTo(circleCenterX, circleCenterY);
        ctx.lineTo(px, circleCenterY);
        ctx.lineTo(px, py);
        ctx.closePath();
        ctx.fill();

        // Right angle marker
        const markerSize = 8;
        const sgnX = curCos >= 0 ? 1 : -1;
        const sgnY = curSin >= 0 ? -1 : 1;
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - sgnX * markerSize, circleCenterY);
        ctx.lineTo(px - sgnX * markerSize, circleCenterY + sgnY * markerSize);
        ctx.lineTo(px, circleCenterY + sgnY * markerSize);
        ctx.stroke();
      }

      // 1. COSINE Segment (Base on X axis)
      if (showCos) {
        ctx.strokeStyle = '#2563EB'; // Blue
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(circleCenterX, circleCenterY);
        ctx.lineTo(px, circleCenterY);
        ctx.stroke();

        // Cosine label
        ctx.fillStyle = '#2563EB';
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = curSin >= 0 ? 'top' : 'bottom';
        ctx.fillText(`cos = ${curCos.toFixed(2)}`, (circleCenterX + px) / 2, circleCenterY + (curSin >= 0 ? 6 : -6));
      }

      // 2. SINE Segment (Height vertical line)
      if (showSin) {
        ctx.strokeStyle = '#059669'; // Emerald / Green
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px, circleCenterY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Sine label
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = curCos >= 0 ? 'left' : 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`sen = ${curSin.toFixed(2)}`, px + (curCos >= 0 ? 8 : -8), (circleCenterY + py) / 2);
      }

      // 3. TANGENT Segment
      if (showTan && Math.abs(curCos) > 0.05) {
        // Tangent line at x = 1 (or x = -1 depending on quadrant standard representation)
        const tanX = circleCenterX + radius;
        const tanY = circleCenterY - Math.tan(rad) * radius;

        // Tangent baseline at x = 1
        ctx.strokeStyle = '#F59E0B'; // Amber
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(tanX, circleCenterY);
        ctx.lineTo(tanX, Math.max(10, Math.min(height - 10, tanY)));
        ctx.stroke();

        // Secant ray extended to tangent line
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(circleCenterX, circleCenterY);
        ctx.lineTo(tanX, Math.max(10, Math.min(height - 10, tanY)));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Hypotenuse / Radius Vector
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(circleCenterX, circleCenterY);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Radius Label "r = 1"
      ctx.fillStyle = '#4B5563';
      ctx.font = '9px ui-monospace, monospace';
      ctx.textAlign = 'center';
      const midHypoX = (circleCenterX + px) / 2 - Math.sin(rad) * 10;
      const midHypoY = (circleCenterY + py) / 2 - Math.cos(rad) * 10;
      ctx.fillText('r = 1', midHypoX, midHypoY);

      // Point P Glow and Circle Handle
      ctx.fillStyle = 'rgba(31, 41, 55, 0.15)';
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.stroke();

      // Point coordinates label
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.textAlign = curCos >= 0 ? 'left' : 'right';
      ctx.textBaseline = curSin >= 0 ? 'bottom' : 'top';
      ctx.fillText(`P(${curCos.toFixed(2)}, ${curSin.toFixed(2)})`, px + (curCos >= 0 ? 12 : -12), py + (curSin >= 0 ? -10 : 10));

      // ----------------------------------------------------
      // 2. DRAW WAVEFORM GRAPH SECTION (IF SPLIT)
      // ----------------------------------------------------
      if (isSplit) {
        const waveStartX = width * 0.58;
        const waveEndX = width - 25;
        const waveWidth = waveEndX - waveStartX;
        const waveCenterY = circleCenterY;
        const waveAmp = radius; // Matches unit circle radius exactly for perfect horizontal projection

        // Wave Section Divider
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width * 0.55, 20);
        ctx.lineTo(width * 0.55, height - 20);
        ctx.stroke();

        // Wave Horizontal Axis
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(waveStartX, waveCenterY);
        ctx.lineTo(waveEndX, waveCenterY);
        ctx.stroke();

        // Wave Upper and Lower Bound lines (+1, -1)
        ctx.strokeStyle = '#F3F4F6';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(waveStartX, waveCenterY - waveAmp);
        ctx.lineTo(waveEndX, waveCenterY - waveAmp);
        ctx.moveTo(waveStartX, waveCenterY + waveAmp);
        ctx.lineTo(waveEndX, waveCenterY + waveAmp);
        ctx.stroke();
        ctx.setLineDash([]);

        // Wave Axis Angle Markers
        const markers = [
          { deg: 0, label: '0' },
          { deg: 90, label: 'π/2' },
          { deg: 180, label: 'π' },
          { deg: 270, label: '3π/2' },
          { deg: 360, label: '2π' }
        ];

        ctx.fillStyle = '#6B7280';
        ctx.font = '9px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        markers.forEach((m) => {
          const x = waveStartX + (m.deg / 360) * waveWidth;
          ctx.beginPath();
          ctx.moveTo(x, waveCenterY - 3);
          ctx.lineTo(x, waveCenterY + 3);
          ctx.stroke();
          ctx.fillText(m.label, x, waveCenterY + 6);
        });

        // 1. Plot Cosine Wave
        if (showCos) {
          ctx.strokeStyle = '#93C5FD'; // Soft blue
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let d = 0; d <= 360; d += 2) {
            const r = (d * Math.PI) / 180;
            const x = waveStartX + (d / 360) * waveWidth;
            const y = waveCenterY - Math.cos(r) * waveAmp;
            if (d === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // 2. Plot Sine Wave
        if (showSin) {
          ctx.strokeStyle = '#34D399'; // Soft emerald
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let d = 0; d <= 360; d += 2) {
            const r = (d * Math.PI) / 180;
            const x = waveStartX + (d / 360) * waveWidth;
            const y = waveCenterY - Math.sin(r) * waveAmp;
            if (d === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Current Angle Vertical Tracking Line on Wave
        const normAngle = ((angleRef.current % 360) + 360) % 360;
        const currentWaveX = waveStartX + (normAngle / 360) * waveWidth;

        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(currentWaveX, waveCenterY - waveAmp - 10);
        ctx.lineTo(currentWaveX, waveCenterY + waveAmp + 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Active Dots on Wave
        if (showSin) {
          const waveSinY = waveCenterY - curSin * waveAmp;
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.arc(currentWaveX, waveSinY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Horizontal projection line from unit circle to wave
          ctx.strokeStyle = 'rgba(5, 150, 105, 0.3)';
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(currentWaveX, waveSinY);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (showCos) {
          const waveCosY = waveCenterY - curCos * waveAmp;
          ctx.fillStyle = '#2563EB';
          ctx.beginPath();
          ctx.arc(currentWaveX, waveCosY, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Wave Legend Header
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('ONDA CONTINUA (0 → 2π)', waveStartX, 15);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [showSin, showCos, showTan, showTriangle, showWave]);

  // Pointer / Drag Interaction on Unit Circle
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const isSplit = canvas.clientWidth >= 560 && showWave;
    const circleCenterX = isSplit ? canvas.clientWidth * 0.32 : canvas.clientWidth * 0.5;
    const circleCenterY = canvas.clientHeight * 0.5;

    const dx = clientX - circleCenterX;
    const dy = circleCenterY - clientY; // Math standard Cartesian

    // Calculate angle
    let rad = Math.atan2(dy, dx);
    if (rad < 0) rad += Math.PI * 2;
    const deg = Math.round((rad * 180) / Math.PI);

    isDraggingRef.current = true;
    setIsPlaying(false);
    setAngleDeg(deg);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const isSplit = canvas.clientWidth >= 560 && showWave;
    const circleCenterX = isSplit ? canvas.clientWidth * 0.32 : canvas.clientWidth * 0.5;
    const circleCenterY = canvas.clientHeight * 0.5;

    const dx = clientX - circleCenterX;
    const dy = circleCenterY - clientY;

    let rad = Math.atan2(dy, dx);
    if (rad < 0) rad += Math.PI * 2;
    const deg = Math.round((rad * 180) / Math.PI);

    setAngleDeg(deg);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const setPresetAngle = (deg: number) => {
    setIsPlaying(false);
    setAngleDeg(deg);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white border border-[#E5E5E5] p-4 sm:p-6 space-y-6 text-left"
    >
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F0F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 bg-[#1A1A1A] text-white font-semibold">
              Circunferencia Unitaria
            </span>
            <span className="text-xs font-mono text-[#888888]">Radio r = 1</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#1A1A1A] tracking-tight mt-1 flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#1A1A1A]" />
            <span>Tour Trigonométrico Interactivo</span>
          </h2>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors ${
              isPlaying
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#1A1A1A] border border-[#E0E0E0]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Rotar continuo</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setAngleDeg(45);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F9F9F9] hover:bg-[#EFEFEF] border border-[#E5E5E5] text-xs font-mono text-[#555555] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar (45°)</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Canvas */}
      <div className="relative bg-[#FAFAFA] border border-[#E5E5E5] overflow-hidden">
        {/* Canvas instruction overlay */}
        <div className="absolute top-2.5 left-3 text-[11px] font-mono text-[#666666] pointer-events-none z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Arrastra el punto P en el círculo o ajusta el deslizador inferior</span>
        </div>

        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-80 sm:h-96 cursor-crosshair touch-none select-none block"
        />
      </div>

      {/* Interactive Angle Slider and Presets */}
      <div className="space-y-4 bg-[#F9F9F9] p-4 border border-[#EAEAEA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-[#1A1A1A]">
              Ángulo θ:
            </span>
            <span className="text-base font-mono font-bold text-[#1A1A1A]">
              {Math.round(angleDeg)}°
            </span>
            <span className="text-xs font-mono text-[#666666] bg-white px-2 py-0.5 border border-[#E0E0E0]">
              {exact.radText}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#666666]">
            <span>Cuadrante:</span>
            <span className="px-2 py-0.5 bg-[#1A1A1A] text-white font-bold">
              {quadrant}
            </span>
          </div>
        </div>

        {/* Continuous Slider */}
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={Math.round(angleDeg)}
          onChange={(e) => {
            setIsPlaying(false);
            setAngleDeg(parseFloat(e.target.value));
          }}
          className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
        />

        {/* Quick Angle Presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-mono text-[#888888] mr-1">Ángulos notables:</span>
          {[0, 30, 45, 60, 90, 120, 135, 180, 270, 360].map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => setPresetAngle(deg)}
              className={`px-2 py-1 text-xs font-mono border transition-colors ${
                Math.round(angleDeg) === deg
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                  : 'bg-white text-[#444444] border-[#D5D5D5] hover:border-[#888888]'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-xs font-mono pt-1">
        <span className="text-[#888888] font-semibold">Capas visibles:</span>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSin}
            onChange={(e) => setShowSin(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-emerald-700 font-semibold">Seno (Y)</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showCos}
            onChange={(e) => setShowCos(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-blue-700 font-semibold">Coseno (X)</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showTan}
            onChange={(e) => setShowTan(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
          />
          <span className="text-amber-700 font-semibold">Tangente</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showTriangle}
            onChange={(e) => setShowTriangle(e.target.checked)}
            className="w-4 h-4 rounded text-gray-700"
          />
          <span className="text-[#444444]">Triángulo rectángulo</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showWave}
            onChange={(e) => setShowWave(e.target.checked)}
            className="w-4 h-4 rounded text-gray-700"
          />
          <span className="text-[#444444]">Onda continua</span>
        </label>
      </div>

      {/* Real-Time Trigonometric Values Grid - Dynamically synced with active checkboxes */}
      {(() => {
        const showPythagoras = showSin && showCos;
        const visibleCount = (showSin ? 1 : 0) + (showCos ? 1 : 0) + (showTan ? 1 : 0) + (showPythagoras ? 1 : 0);

        if (visibleCount === 0) return null;

        const gridColsClass =
          visibleCount === 1
            ? 'grid-cols-1'
            : visibleCount === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : visibleCount === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

        return (
          <div className={`grid ${gridColsClass} gap-3`}>
            {/* Seno Card */}
            {showSin && (
              <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-800">
                  <span className="font-bold">sen(θ) = y / r</span>
                  <span>Cateto Opuesto</span>
                </div>
                <div className="text-xl font-mono font-bold text-emerald-900">
                  {sinVal.toFixed(4)}
                </div>
                <div className="text-[11px] font-mono text-emerald-700">
                  Valor exacto: <span className="font-semibold">{exact.sinExact}</span>
                </div>
              </div>
            )}

            {/* Coseno Card */}
            {showCos && (
              <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-blue-800">
                  <span className="font-bold">cos(θ) = x / r</span>
                  <span>Cateto Adyacente</span>
                </div>
                <div className="text-xl font-mono font-bold text-blue-900">
                  {cosVal.toFixed(4)}
                </div>
                <div className="text-[11px] font-mono text-blue-700">
                  Valor exacto: <span className="font-semibold">{exact.cosExact}</span>
                </div>
              </div>
            )}

            {/* Tangente Card */}
            {showTan && (
              <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-800">
                  <span className="font-bold">tan(θ) = y / x</span>
                  <span>sen(θ) / cos(θ)</span>
                </div>
                <div className="text-xl font-mono font-bold text-amber-900">
                  {isTanUndefined ? 'Indefinido (∞)' : tanVal.toFixed(4)}
                </div>
                <div className="text-[11px] font-mono text-amber-700">
                  Valor exacto: <span className="font-semibold">{exact.tanExact}</span>
                </div>
              </div>
            )}

            {/* Identidad Fundamental Card (se muestra cuando están activos Seno y Coseno) */}
            {showPythagoras && (
              <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-700">
                  <span className="font-bold">sen²θ + cos²θ</span>
                  <span>Pitágoras</span>
                </div>
                <div className="text-xl font-mono font-bold text-gray-900">
                  {(sinVal * sinVal + cosVal * cosVal).toFixed(4)} = 1.0
                </div>
                <div className="text-[11px] font-mono text-gray-600">
                  ({sinVal.toFixed(2)})² + ({cosVal.toFixed(2)})² = 1
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
