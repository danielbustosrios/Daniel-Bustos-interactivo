import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw, ExternalLink, Wind, Sparkles, Target, Trophy } from 'lucide-react';

interface TrajectoryPoint {
  x: number;
  y: number;
}

interface SavedShot {
  angle: number;
  speed: number;
  points: TrajectoryPoint[];
  color: string;
  maxH: number;
  range: number;
}

export const ProjectileMotionCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Physics parameters
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const [initialSpeed, setInitialSpeed] = useState<number>(24);
  const [airResistance, setAirResistance] = useState<boolean>(false);
  const [targetDistance, setTargetDistance] = useState<number>(55); // target at 55m

  // Live state
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [liveStats, setLiveStats] = useState<{ maxH: number; range: number; time: number }>({ maxH: 0, range: 0, time: 0 });
  const [bestRecord, setBestRecord] = useState<number>(0);
  const [hitTarget, setHitTarget] = useState<boolean>(false);

  // Physics simulation refs
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentTrailRef = useRef<TrajectoryPoint[]>([]);
  const previousShotsRef = useRef<SavedShot[]>([]);
  const flightTimeRef = useRef<number>(0);
  const maxHRef = useRef<number>(0);
  const isDraggingArrowRef = useRef<boolean>(false);
  const hasAutoFiredRef = useRef<boolean>(false);

  const colors = ['#1A1A1A', '#2563EB', '#059669', '#D97706', '#7C3AED'];

  // Theoretical calculations in vacuum (g = 9.81 m/s^2)
  const gConst = 9.81;
  const theoreticalRange = (initialSpeed * initialSpeed * Math.sin((2 * angleDeg * Math.PI) / 180)) / gConst;
  const theoreticalMaxAchievable = (initialSpeed * initialSpeed) / gConst; // at 45 deg

  const launchProjectile = (angle: number = angleDeg, speed: number = initialSpeed) => {
    const rad = (angle * Math.PI) / 180;
    velRef.current = {
      x: speed * Math.cos(rad),
      y: speed * Math.sin(rad)
    };
    posRef.current = { x: 0, y: 0 };
    currentTrailRef.current = [{ x: 0, y: 0 }];
    flightTimeRef.current = 0;
    maxHRef.current = 0;
    setHitTarget(false);
    setIsFlying(true);
  };

  const clearTrajectories = () => {
    previousShotsRef.current = [];
    currentTrailRef.current = [];
    setLiveStats({ maxH: 0, range: 0, time: 0 });
    setBestRecord(0);
    setHitTarget(false);
    setIsFlying(false);
  };

  // Canvas scale mappings: 1 meter = X pixels
  const originX = 50; // px from left
  const groundMargin = 45; // px from bottom
  const meterScale = 7.2; // pixels per meter

  useEffect(() => {
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting && !hasAutoFiredRef.current) {
          hasAutoFiredRef.current = true;
          setTimeout(() => {
            launchProjectile(45, 24);
          }, 300);
        }
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

    let lastTimestamp = performance.now();
    const g = 9.81; // m/s^2

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

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

      // Clean background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const groundY = height - groundMargin;

      // Draw subtle grid
      ctx.strokeStyle = '#F0F0F0';
      ctx.lineWidth = 1;
      for (let x = originX; x < width; x += 10 * meterScale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, groundY);
        ctx.stroke();

        // Meter labels
        const meters = Math.round((x - originX) / meterScale);
        if (meters > 0 && meters % 10 === 0) {
          ctx.fillStyle = '#AAAAAA';
          ctx.font = '9px ui-monospace, monospace';
          ctx.fillText(`${meters}m`, x - 8, groundY + 14);
        }
      }

      // Height ticks
      for (let y = groundY; y > 20; y -= 5 * meterScale) {
        ctx.beginPath();
        ctx.moveTo(originX, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        const hMeters = Math.round((groundY - y) / meterScale);
        if (hMeters > 0 && hMeters % 5 === 0) {
          ctx.fillStyle = '#AAAAAA';
          ctx.font = '9px ui-monospace, monospace';
          ctx.fillText(`${hMeters}m`, originX - 25, y + 3);
        }
      }

      // Draw ground line
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Draw Target Flag / Diana
      const targetScreenX = originX + targetDistance * meterScale;
      if (targetScreenX < width - 20) {
        // Target base zone
        ctx.fillStyle = hitTarget ? '#10B98122' : '#EF444418';
        ctx.fillRect(targetScreenX - 15, groundY - 4, 30, 6);

        // Target pole
        ctx.strokeStyle = hitTarget ? '#10B981' : '#EF4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(targetScreenX, groundY);
        ctx.lineTo(targetScreenX, groundY - 32);
        ctx.stroke();

        // Target flag
        ctx.fillStyle = hitTarget ? '#10B981' : '#EF4444';
        ctx.beginPath();
        ctx.moveTo(targetScreenX, groundY - 32);
        ctx.lineTo(targetScreenX + 16, groundY - 24);
        ctx.lineTo(targetScreenX, groundY - 16);
        ctx.closePath();
        ctx.fill();

        // Target label
        ctx.fillStyle = hitTarget ? '#047857' : '#B91C1C';
        ctx.font = 'bold 9px ui-monospace, monospace';
        ctx.fillText(`DIANA ${targetDistance}m`, targetScreenX - 18, groundY - 36);
      }

      // Physics update if flying
      if (isFlying) {
        const subSteps = 6;
        const subDt = dt / subSteps;

        for (let i = 0; i < subSteps; i++) {
          flightTimeRef.current += subDt;

          let ax = 0;
          let ay = -g;

          if (airResistance) {
            const dragCoeff = 0.035;
            const vMag = Math.hypot(velRef.current.x, velRef.current.y);
            ax -= dragCoeff * velRef.current.x * vMag;
            ay -= dragCoeff * velRef.current.y * vMag;
          }

          velRef.current.x += ax * subDt;
          velRef.current.y += ay * subDt;

          posRef.current.x += velRef.current.x * subDt;
          posRef.current.y += velRef.current.y * subDt;

          if (posRef.current.y > maxHRef.current) {
            maxHRef.current = posRef.current.y;
          }

          currentTrailRef.current.push({ x: posRef.current.x, y: posRef.current.y });

          // Landed on ground
          if (posRef.current.y <= 0 && flightTimeRef.current > 0.05) {
            posRef.current.y = 0;
            setIsFlying(false);

            const landingX = posRef.current.x;
            const landedNearTarget = Math.abs(landingX - targetDistance) <= 2.5;
            if (landedNearTarget) {
              setHitTarget(true);
            }

            // Save to previous shots
            const color = colors[previousShotsRef.current.length % colors.length];
            previousShotsRef.current.push({
              angle: angleDeg,
              speed: initialSpeed,
              points: [...currentTrailRef.current],
              color,
              maxH: maxHRef.current,
              range: landingX
            });

            setLiveStats({
              maxH: maxHRef.current,
              range: landingX,
              time: flightTimeRef.current
            });

            setBestRecord((prev) => Math.max(prev, landingX));
            break;
          }
        }
      }

      // Draw previous shots
      previousShotsRef.current.forEach((shot) => {
        if (shot.points.length < 2) return;
        ctx.beginPath();
        const startScreenX = originX + shot.points[0].x * meterScale;
        const startScreenY = groundY - shot.points[0].y * meterScale;
        ctx.moveTo(startScreenX, startScreenY);

        for (let i = 1; i < shot.points.length; i++) {
          const sx = originX + shot.points[i].x * meterScale;
          const sy = groundY - shot.points[i].y * meterScale;
          ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = `${shot.color}55`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Landing marker
        const last = shot.points[shot.points.length - 1];
        const lx = originX + last.x * meterScale;
        ctx.fillStyle = shot.color;
        ctx.beginPath();
        ctx.arc(lx, groundY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw current trail
      if (currentTrailRef.current.length > 1) {
        ctx.beginPath();
        const startX = originX + currentTrailRef.current[0].x * meterScale;
        const startY = groundY - currentTrailRef.current[0].y * meterScale;
        ctx.moveTo(startX, startY);

        for (let i = 1; i < currentTrailRef.current.length; i++) {
          const sx = originX + currentTrailRef.current[i].x * meterScale;
          const sy = groundY - currentTrailRef.current[i].y * meterScale;
          ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw cannon / launcher base
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.arc(originX, groundY, 8, Math.PI, 0);
      ctx.fill();

      // Draw Aiming Vector Arrow
      const arrowLength = Math.min(initialSpeed * 2.2, 70);
      const rad = (angleDeg * Math.PI) / 180;
      const arrowEndX = originX + Math.cos(rad) * arrowLength;
      const arrowEndY = groundY - Math.sin(rad) * arrowLength;

      ctx.beginPath();
      ctx.moveTo(originX, groundY);
      ctx.lineTo(arrowEndX, arrowEndY);
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(arrowEndX, arrowEndY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Angle arc
      ctx.beginPath();
      ctx.arc(originX, groundY, 24, -rad, 0);
      ctx.strokeStyle = '#2563EB88';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Angle text
      ctx.fillStyle = '#2563EB';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillText(`${angleDeg}°`, originX + 28, groundY - 8);

      // Draw flying projectile
      if (isFlying) {
        const px = originX + posRef.current.x * meterScale;
        const py = groundY - posRef.current.y * meterScale;

        // Glowing ball
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [isFlying, angleDeg, initialSpeed, airResistance, targetDistance, hitTarget]);

  // Pointer drag to change angle and speed
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingArrowRef.current = true;
    updateAngleFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingArrowRef.current) return;
    updateAngleFromPointer(e);
  };

  const handlePointerUp = () => {
    isDraggingArrowRef.current = false;
  };

  const updateAngleFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const groundY = canvas.clientHeight - groundMargin;
    const dx = x - originX;
    const dy = groundY - y;

    if (dx > 5 && dy > 0) {
      let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      deg = Math.max(10, Math.min(85, deg));
      setAngleDeg(deg);

      const dist = Math.hypot(dx, dy);
      const speed = Math.max(10, Math.min(38, Math.round(dist / 2.2)));
      setInitialSpeed(speed);
    }
  };

  return (
    <div ref={containerRef} className="bg-white border border-[#E5E5E5] text-[#1A1A1A] rounded-none overflow-hidden flex flex-col">
      {/* Live Canvas Area */}
      <div className="relative w-full h-[290px] sm:h-[340px] select-none touch-none bg-white">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-full cursor-crosshair"
        />

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-xs px-3 py-1.5 border border-[#E0E0E0] shadow-xs">
            <Target className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-mono font-semibold text-[#1A1A1A]">
              ¿Hasta dónde puedes llegar?
            </span>
            <span className="text-[10px] font-mono text-[#666666] hidden md:inline">
              — Ajusta el ángulo a 45° para maximizar el alcance
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                setAngleDeg(45);
                setTimeout(() => launchProjectile(45, initialSpeed), 50);
              }}
              disabled={isFlying}
              className="px-2.5 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Ajustar al ángulo de alcance máximo (45°)"
            >
              <Sparkles className="w-3 h-3 text-[#1D4ED8]" />
              <span>Alcance Máximo (45°)</span>
            </button>

            <button
              type="button"
              onClick={() => launchProjectile()}
              disabled={isFlying}
              className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isFlying ? 'En vuelo...' : 'Lanzar'}</span>
            </button>

            <button
              type="button"
              onClick={clearTrajectories}
              className="p-1.5 bg-white hover:bg-[#F5F5F5] border border-[#E0E0E0] text-[#555555] hover:text-[#1A1A1A] transition-colors"
              title="Limpiar trayectorias"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time stats and challenge badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs border border-[#E5E5E5] px-3.5 py-2 text-[11px] font-mono text-[#444444] shadow-xs flex items-center gap-3.5">
          <div>
            <span className="text-[#888888] text-[9px] block">ALCANCE ACTUAL</span>
            <strong className="text-[#1A1A1A] text-sm">{liveStats.range > 0 ? `${liveStats.range.toFixed(1)} m` : '—'}</strong>
          </div>
          <div className="border-l border-[#E5E5E5] pl-3">
            <span className="text-[#888888] text-[9px] block">MÁXIMO POSIBLE (45°)</span>
            <strong className="text-blue-700 text-sm">{theoreticalMaxAchievable.toFixed(1)} m</strong>
          </div>
          <div className="border-l border-[#E5E5E5] pl-3 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <div>
              <span className="text-[#888888] text-[9px] block">RÉCORD LOGRADO</span>
              <strong className="text-emerald-700 text-sm">{bestRecord > 0 ? `${bestRecord.toFixed(1)} m` : '—'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Sliders Row */}
      <div className="px-4 py-3 bg-[#FAFAFA] border-t border-[#EAEAEA] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono items-center">
        {/* Angle Slider */}
        <div className="flex items-center gap-2">
          <label className="text-[#666666] whitespace-nowrap">Ángulo: <strong className="text-[#1A1A1A]">{angleDeg}°</strong></label>
          <input
            type="range"
            min="10"
            max="85"
            value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className="w-full h-1.5 bg-[#DDDDDD] rounded-none appearance-none accent-[#1A1A1A] cursor-pointer"
          />
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2">
          <label className="text-[#666666] whitespace-nowrap">Rapidez: <strong className="text-[#1A1A1A]">{initialSpeed} m/s</strong></label>
          <input
            type="range"
            min="10"
            max="38"
            value={initialSpeed}
            onChange={(e) => setInitialSpeed(Number(e.target.value))}
            className="w-full h-1.5 bg-[#DDDDDD] rounded-none appearance-none accent-[#1A1A1A] cursor-pointer"
          />
        </div>

        {/* Target Slider */}
        <div className="flex items-center gap-2">
          <label className="text-[#666666] whitespace-nowrap">Diana: <strong className="text-red-700">{targetDistance}m</strong></label>
          <input
            type="range"
            min="20"
            max="90"
            step="5"
            value={targetDistance}
            onChange={(e) => {
              setTargetDistance(Number(e.target.value));
              setHitTarget(false);
            }}
            className="w-full h-1.5 bg-[#DDDDDD] rounded-none appearance-none accent-red-600 cursor-pointer"
          />
        </div>

        {/* Air Resistance Toggle */}
        <div className="flex items-center justify-start sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => setAirResistance(!airResistance)}
            className={`px-2.5 py-1 text-[11px] font-mono border transition-colors flex items-center gap-1.5 ${
              airResistance
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#666666] border-[#CCCCCC] hover:border-[#888888]'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Aire: {airResistance ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Reach Metrics Bar */}
      <div className="px-4 py-2.5 bg-[#F9FAFB] border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4 text-[#555555]">
          <span>
            Fórmula de Alcance: <strong className="text-[#1A1A1A]">R = (v₀² · sen(2θ)) / g</strong>
          </span>
          <span className="text-[#888888]">|</span>
          <span>
            Alcance Teórico Calculado: <strong className="text-[#1A1A1A]">{theoreticalRange.toFixed(1)} m</strong>
          </span>
        </div>

        {hitTarget && (
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-[11px]">
            🎯 ¡Diana alcanzada!
          </span>
        )}
      </div>

      {/* Discrete Footer Attribution */}
      <div className="px-4 py-2 bg-[#F5F5F5] border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#666666]">
        <span>Demostración interactiva propia</span>
        <a
          href="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_es.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
        >
          <span>Abrir simulador completo en PhET</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};
