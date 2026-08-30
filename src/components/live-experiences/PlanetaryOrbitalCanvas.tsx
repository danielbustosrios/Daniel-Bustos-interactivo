import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, ExternalLink, Orbit } from 'lucide-react';

interface Planet {
  name: string;
  distance: number; // orbital radius in px
  radius: number; // body radius in px
  color: string;
  speed: number; // orbital speed factor
  angle: number;
  info: string;
  realPeriod: string;
  hasRing?: boolean;
}

export const PlanetaryOrbitalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [trailsEnabled, setTrailsEnabled] = useState<boolean>(true);

  // Dragging state
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const viewOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const zoomRef = useRef<number>(1);

  // Planets data (scaled for aesthetic pedagogical visualization)
  const planetsRef = useRef<Planet[]>([
    { name: 'Mercurio', distance: 48, radius: 3.5, color: '#A09B93', speed: 0.040, angle: 0.2, info: 'El planeta más cercano al Sol y el más rápido en su órbita.', realPeriod: '88 días' },
    { name: 'Venus', distance: 74, radius: 5.5, color: '#E3BB7B', speed: 0.024, angle: 1.5, info: 'Atmósfera densa y temperatura superficial uniforme y extrema.', realPeriod: '225 días' },
    { name: 'Tierra', distance: 108, radius: 6.0, color: '#4E89FF', speed: 0.016, angle: 3.1, info: 'Hogar con agua líquida y Luna orbital que acompaña su traslación.', realPeriod: '365.25 días' },
    { name: 'Marte', distance: 146, radius: 4.5, color: '#E05A47', speed: 0.011, angle: 4.8, info: 'El planeta rojo, con el monte Olimpo y delgados casquetes polares.', realPeriod: '687 días' },
    { name: 'Júpiter', distance: 205, radius: 11.0, color: '#D9A066', speed: 0.0055, angle: 2.3, info: 'El gigante gaseoso más grande del Sistema Solar y su Gran Mancha Roja.', realPeriod: '11.8 años' },
    { name: 'Saturno', distance: 265, radius: 9.0, color: '#ECD096', speed: 0.0035, angle: 5.4, info: 'Famoso por su espectacular y brillante sistema de anillos.', realPeriod: '29.4 años', hasRing: true },
  ]);

  // Trail history points
  const trailsRef = useRef<Map<string, { x: number; y: number }[]>>(new Map());

  // Stars background
  const starsRef = useRef<{ x: number; y: number; size: number; alpha: number }[]>([]);

  useEffect(() => {
    // Generate starfield once
    const stars: { x: number; y: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    starsRef.current = stars;
  }, []);

  const resetView = () => {
    viewOffsetRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    setSelectedPlanet(null);
  };

  useEffect(() => {
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Handle canvas resolution
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep space night-sky background
      const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, Math.max(width, height) / 1.2);
      grad.addColorStop(0, '#0E1322');
      grad.addColorStop(0.5, '#080C16');
      grad.addColorStop(1, '#030509');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      starsRef.current.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const centerX = width / 2 + viewOffsetRef.current.x;
      const centerY = height / 2 + viewOffsetRef.current.y;
      const zoom = zoomRef.current;

      // Draw orbital tracks
      planetsRef.current.forEach((p) => {
        const orbitRadius = p.distance * zoom;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw Glowing Sun
      const sunGlow = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, 32 * zoom);
      sunGlow.addColorStop(0, '#FFF5CC');
      sunGlow.addColorStop(0.2, '#FFB732');
      sunGlow.addColorStop(0.5, 'rgba(255, 140, 0, 0.35)');
      sunGlow.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 32 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      ctx.fillStyle = '#FFEAA7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 13 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw planets
      planetsRef.current.forEach((p) => {
        if (isPlaying) {
          p.angle += p.speed * speedMultiplier * delta * 40;
        }

        const orbitRadius = p.distance * zoom;
        const px = centerX + Math.cos(p.angle) * orbitRadius;
        const py = centerY + Math.sin(p.angle) * orbitRadius;

        // Manage trails
        if (trailsEnabled) {
          if (!trailsRef.current.has(p.name)) {
            trailsRef.current.set(p.name, []);
          }
          const trail = trailsRef.current.get(p.name)!;
          trail.push({ x: px, y: py });
          if (trail.length > 25) trail.shift();

          // Draw trail
          if (trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for (let i = 1; i < trail.length; i++) {
              ctx.lineTo(trail[i].x, trail[i].y);
            }
            ctx.strokeStyle = `${p.color}33`;
            ctx.lineWidth = 1.5 * zoom;
            ctx.stroke();
          }
        }

        // Selected planet highlight ring
        if (selectedPlanet?.name === p.name) {
          ctx.beginPath();
          ctx.arc(px, py, (p.radius + 6) * zoom, 0, Math.PI * 2);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Saturn Rings
        if (p.hasRing) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(0.3);
          ctx.beginPath();
          ctx.ellipse(0, 0, (p.radius + 7) * zoom, (p.radius + 2) * zoom, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(236, 208, 150, 0.6)';
          ctx.lineWidth = 2.5 * zoom;
          ctx.stroke();
          ctx.restore();
        }

        // Planet Body
        ctx.beginPath();
        ctx.arc(px, py, p.radius * zoom, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Atmospheric shading
        const shadeGrad = ctx.createRadialGradient(
          px - (p.radius * 0.3 * zoom),
          py - (p.radius * 0.3 * zoom),
          p.radius * 0.1 * zoom,
          px,
          py,
          p.radius * zoom
        );
        shadeGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
        shadeGrad.addColorStop(0.8, 'rgba(0,0,0,0.1)');
        shadeGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = shadeGrad;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * zoom, 0, Math.PI * 2);
        ctx.fill();

        // Moon for Earth
        if (p.name === 'Tierra') {
          const moonDist = 13 * zoom;
          const moonAngle = p.angle * 6;
          const mx = px + Math.cos(moonAngle) * moonDist;
          const my = py + Math.sin(moonAngle) * moonDist;

          ctx.beginPath();
          ctx.arc(mx, my, 1.8 * zoom, 0, Math.PI * 2);
          ctx.fillStyle = '#DCDCDC';
          ctx.fill();
        }

        // Planet Label
        ctx.font = `${Math.max(10, 11 * zoom)}px ui-monospace, monospace`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(p.name, px + (p.radius + 4) * zoom, py + 3);
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [isPlaying, speedMultiplier, selectedPlanet, trailsEnabled]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Check if clicked near a planet
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.clientWidth / 2 + viewOffsetRef.current.x;
    const centerY = canvas.clientHeight / 2 + viewOffsetRef.current.y;
    const zoom = zoomRef.current;

    let found: Planet | null = null;
    planetsRef.current.forEach((p) => {
      const orbitRadius = p.distance * zoom;
      const px = centerX + Math.cos(p.angle) * orbitRadius;
      const py = centerY + Math.sin(p.angle) * orbitRadius;
      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < (p.radius + 12) * zoom) {
        found = p;
      }
    });

    if (found) {
      setSelectedPlanet(found);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    viewOffsetRef.current = {
      x: viewOffsetRef.current.x + dx,
      y: viewOffsetRef.current.y + dy
    };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div ref={containerRef} className="bg-[#0A0D14] border border-[#222736] text-white rounded-none overflow-hidden flex flex-col">
      {/* Visual Canvas Area (~80% height) */}
      <div className="relative w-full h-[360px] sm:h-[430px] lg:h-[480px] select-none touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Floating Top Bar: Micro-invitation & Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-[#0A0D14]/80 backdrop-blur-md px-3 py-1.5 border border-[#2A3144]">
            <Orbit className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="text-xs font-mono font-medium text-white tracking-wide">
              Ventana orbital
            </span>
            <span className="text-[10px] font-mono text-[#8C96AB] hidden sm:inline">
              — Arrastra el espacio o toca un planeta
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto bg-[#0A0D14]/80 backdrop-blur-md p-1 border border-[#2A3144]">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pausar simulación' : 'Reanudar simulación'}
              className="p-1.5 hover:bg-[#1E2536] text-white transition-colors"
              title={isPlaying ? 'Pausar' : 'Reanudar'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={resetView}
              aria-label="Centrar vista"
              className="p-1.5 hover:bg-[#1E2536] text-[#A6B2C8] hover:text-white transition-colors text-xs font-mono"
              title="Centrar vista"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed selector */}
            <div className="flex items-center gap-0.5 border-l border-[#2A3144] pl-1.5 ml-0.5 text-[10px] font-mono">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-1.5 py-0.5 transition-colors ${
                    speedMultiplier === s
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-[#8C96AB] hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Planet Floating Card */}
        {selectedPlanet && (
          <div className="absolute bottom-4 left-4 max-w-xs bg-[#0F1420]/90 backdrop-blur-md border border-[#2E374D] p-3 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between gap-2 border-b border-[#222A3E] pb-1.5 mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: selectedPlanet.color }}
                />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {selectedPlanet.name}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-400">
                Periodo: {selectedPlanet.realPeriod}
              </span>
            </div>
            <p className="text-[11px] text-[#A6B2C8] font-sans leading-relaxed">
              {selectedPlanet.info}
            </p>
          </div>
        )}

        {/* Official NASA Badge & Direct Link */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <a
            href="https://eyes.nasa.gov/apps/solar-system/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F1420]/80 hover:bg-[#1A2234] border border-[#2E374D] text-[11px] font-mono text-white transition-colors"
          >
            <span>Explorar en 3D con NASA Eyes</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
        </div>
      </div>

      {/* Discrete Footer Attribution */}
      <div className="px-5 py-2.5 bg-[#04060A] border-t border-[#141A26] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#606E88]">
        <span>Demostración interactiva propia estilizada</span>
        <span>Referencia oficial: NASA Jet Propulsion Laboratory (Eyes on the Solar System)</span>
      </div>
    </div>
  );
};
