import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Info, Eye, Compass } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
  neighbors: number[];
}

interface Edge {
  from: number;
  to: number;
  // Arc parameters if curved; if null, straight line
  arc?: {
    cx: number;
    cy: number;
    r: number;
    startAngle: number;
    endAngle: number;
    counterClockwise: boolean;
  };
}

export const PoincareDisk: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showNetwork, setShowNetwork] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isInViewport, setIsInViewport] = useState<boolean>(true);

  // Animation state stored in refs to prevent unnecessary re-renders in 60fps loop
  const animState = useRef({
    currentNodeIndex: 0,
    targetNodeIndex: 1,
    progress: 0,
    mouthAngle: 0.2,
    mouthDir: 1,
    rotation: 0,
    lastTime: 0,
    speed: 0.008,
  });

  // Build the geometric path network for Pac-Man
  const networkRef = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }
    const listener = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches) setIsPlaying(false);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // IntersectionObserver to pause when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Initialize network of nodes along visible hyperbolic geodesics
  useEffect(() => {
    const radius = 160; // Base canonical disk radius
    const cx = 180;
    const cy = 180;

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Node 0: Center
    nodes.push({ id: 0, x: cx, y: cy, neighbors: [1, 2, 3, 4, 5, 6, 7, 8] });

    // Inner ring (r = radius * 0.35) - 8 nodes
    const r1 = radius * 0.38;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const nx = cx + Math.cos(angle) * r1;
      const ny = cy + Math.sin(angle) * r1;
      const nextI = ((i + 1) % 8) + 1;
      const prevI = ((i + 7) % 8) + 1;
      const outerI = 9 + i * 2;
      nodes.push({
        id: i + 1,
        x: nx,
        y: ny,
        neighbors: [0, nextI, prevI, outerI],
      });
      // Edge to center
      edges.push({ from: 0, to: i + 1 });
      // Edge along inner ring
      edges.push({ from: i + 1, to: nextI });
    }

    // Mid ring (r = radius * 0.68) - 16 nodes in safe visible zone
    const r2 = radius * 0.68;
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      const nx = cx + Math.cos(angle) * r2;
      const ny = cy + Math.sin(angle) * r2;
      const nextI = 9 + ((i + 1) % 16);
      const prevI = 9 + ((i + 15) % 16);
      const innerParent = 1 + Math.floor(i / 2);
      
      nodes.push({
        id: 9 + i,
        x: nx,
        y: ny,
        neighbors: [nextI, prevI, innerParent],
      });

      edges.push({ from: 9 + i, to: nextI });
      if (i % 2 === 0) {
        edges.push({ from: innerParent, to: 9 + i });
      }
    }

    networkRef.current = { nodes, edges };
  }, []);

  // Main drawing and animation canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
      const dpr = window.devicePixelRatio || 1;
      const displaySize = 360;
      if (canvas.width !== displaySize * dpr || canvas.height !== displaySize * dpr) {
        canvas.width = displaySize * dpr;
        canvas.height = displaySize * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displaySize, displaySize);

      const cx = displaySize / 2;
      const cy = displaySize / 2;
      const R = 160;

      // 1. Draw Disk Background (Clean minimal off-white/monochrome gradient)
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Subtle boundary drop shadow and inner shadow
      ctx.strokeStyle = '#18181B'; // Deep neutral charcoal/black
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Draw Poincaré Geometric Tessellation / Geodesic Lines
      // Clip to disk interior
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2);
      ctx.clip();

      // Radial Diameters (Straight Geodesics through origin)
      const numDiameters = 16;
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.28)';
      ctx.lineWidth = 0.85;
      for (let i = 0; i < numDiameters; i++) {
        const angle = (i * Math.PI) / numDiameters;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
        ctx.lineTo(cx - Math.cos(angle) * R, cy - Math.sin(angle) * R);
        ctx.stroke();
      }

      // Orthogonal Hyperbolic Geodesic Arcs (Tiers getting progressively denser towards border)
      // Tier 1: Large primary arcs (d = 1.35 * R)
      drawOrthogonalArcs(ctx, cx, cy, R, 1.38 * R, 8, 'rgba(24, 24, 27, 0.45)', 0.95);
      // Tier 2: Mid arcs (d = 1.18 * R)
      drawOrthogonalArcs(ctx, cx, cy, R, 1.18 * R, 16, 'rgba(24, 24, 27, 0.32)', 0.75);
      // Tier 3: Dense boundary arcs (d = 1.08 * R)
      drawOrthogonalArcs(ctx, cx, cy, R, 1.075 * R, 32, 'rgba(24, 24, 27, 0.22)', 0.55);
      // Tier 4: Ultra-dense border mesh (d = 1.025 * R)
      drawOrthogonalArcs(ctx, cx, cy, R, 1.028 * R, 64, 'rgba(24, 24, 27, 0.16)', 0.4);
      // Tier 5: Micro boundary fringe (d = 1.008 * R)
      drawOrthogonalArcs(ctx, cx, cy, R, 1.008 * R, 96, 'rgba(24, 24, 27, 0.12)', 0.3);

      // Concentric hyperbolic horocycles / concentric reference circles
      const concentricFractions = [0.25, 0.45, 0.65, 0.82, 0.92, 0.97];
      concentricFractions.forEach((frac, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * frac, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(24, 24, 27, ${0.12 + idx * 0.02})`;
        ctx.lineWidth = 0.6;
        ctx.setLineDash(idx % 2 === 1 ? [2, 3] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Optional Network Debug View
      if (showNetwork) {
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.4)';
        ctx.lineWidth = 1;
        networkRef.current.edges.forEach((edge) => {
          const fromNode = networkRef.current.nodes.find((n) => n.id === edge.from);
          const toNode = networkRef.current.nodes.find((n) => n.id === edge.to);
          if (fromNode && toNode) {
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();
          }
        });

        networkRef.current.nodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#18181B';
          ctx.fill();
        });
      }

      ctx.restore(); // Restore clip

      // Outer border circle ring for crisp boundary
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = '#09090B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Update & Draw Yellow Pac-Man Character (8-12px)
      const { nodes } = networkRef.current;
      if (nodes.length > 0) {
        const state = animState.current;
        const fromNode = nodes.find((n) => n.id === state.currentNodeIndex) || nodes[0];
        const toNode = nodes.find((n) => n.id === state.targetNodeIndex) || nodes[1];

        // Animate position if active
        if (isPlaying && isInViewport && !isReducedMotion) {
          state.progress += state.speed * speedMultiplier;
          if (state.progress >= 1) {
            state.progress = 0;
            state.currentNodeIndex = state.targetNodeIndex;

            // Pick next connected neighbor (avoid immediately turning 180° back unless only option)
            const currNode = nodes.find((n) => n.id === state.currentNodeIndex) || nodes[0];
            const possibleNext = currNode.neighbors.filter((nId) => nId !== fromNode.id);
            const candidates = possibleNext.length > 0 ? possibleNext : currNode.neighbors;
            const chosen = candidates[Math.floor(Math.random() * candidates.length)];
            state.targetNodeIndex = chosen ?? 0;
          }

          // Animate mouth
          state.mouthAngle += 0.05 * state.mouthDir * speedMultiplier;
          if (state.mouthAngle > 0.35) {
            state.mouthAngle = 0.35;
            state.mouthDir = -1;
          } else if (state.mouthAngle < 0.03) {
            state.mouthAngle = 0.03;
            state.mouthDir = 1;
          }
        }

        // Interpolate position
        const posX = fromNode.x + (toNode.x - fromNode.x) * state.progress;
        const posY = fromNode.y + (toNode.y - fromNode.y) * state.progress;

        // Target angle based on direction of motion
        const targetAngle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        
        // Smooth rotation angle interpolation
        let angleDiff = targetAngle - state.rotation;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        state.rotation += angleDiff * 0.2;

        // Draw Pac-Man (10px diameter: r = 5.2px)
        const pacmanRadius = 5.5;

        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate(state.rotation);

        // Character Body (Vibrant Yellow #FACC15 / #FDE047 with crisp dark border)
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          pacmanRadius,
          state.mouthAngle * Math.PI,
          (2 - state.mouthAngle) * Math.PI
        );
        ctx.lineTo(0, 0);
        ctx.closePath();

        ctx.fillStyle = '#EAB308'; // Classic warm yellow
        ctx.fill();
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();

      if (isPlaying && isInViewport && !isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isInViewport, isReducedMotion, showNetwork, speedMultiplier]);

  // Helper to draw orthogonal circles in hyperbolic Poincaré model
  const drawOrthogonalArcs = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    R: number,
    d: number,
    count: number,
    strokeColor: string,
    lineWidth: number
  ) => {
    // Orthogonal radius formula: r^2 = d^2 - R^2
    const r = Math.sqrt(d * d - R * R);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      const circleCenterX = cx + Math.cos(angle) * d;
      const circleCenterY = cy + Math.sin(angle) * d;

      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    animState.current.currentNodeIndex = 0;
    animState.current.targetNodeIndex = 1;
    animState.current.progress = 0;
    animState.current.rotation = 0;
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleStep = () => {
    setIsPlaying(false);
    const state = animState.current;
    state.progress += 0.2;
    if (state.progress >= 1) {
      state.progress = 0;
      state.currentNodeIndex = state.targetNodeIndex;
      const nodes = networkRef.current.nodes;
      const currNode = nodes.find((n) => n.id === state.currentNodeIndex) || nodes[0];
      const nextCandidates = currNode.neighbors;
      state.targetNodeIndex = nextCandidates[Math.floor(Math.random() * nextCandidates.length)] ?? 0;
    }
    // Re-render once
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // trigger redraw
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[480px] bg-[#FDFDFD] border border-[#EEEEEE] flex flex-col items-center justify-center p-6 sm:p-8 select-none overflow-hidden ${className}`}
      id="poincare-disk-widget"
    >
      {/* Concentric Geometric Guide Circles from Geometric Balance Theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border border-[#EEEEEE] opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#EEEEEE] opacity-80 pointer-events-none" />

      {/* Visual Canvas */}
      <div className="relative z-10">
        <canvas
          ref={canvasRef}
          className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[360px] md:h-[360px] block cursor-crosshair"
          title="Disco de Poincaré animado con recorrido de geodésicas"
        />
      </div>

      {/* Minimal Float Controls Overlay matching Geometric Balance pill */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white border border-[#EEEEEE] px-3.5 py-1.5 rounded-full shadow-sm text-xs text-[#1A1A1A]">
        <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">
          Disco de Poincaré
        </span>

        <div className="w-[1px] h-3 bg-[#E5E5E5] mx-1" />

        <button
          type="button"
          id="btn-pause-poincare"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Pausar animación del disco" : "Reanudar animación del disco"}
          className="p-1 hover:text-[#000000] text-[#555555] transition-colors focus:outline-none"
          title={isPlaying ? "Pausar animación" : "Reanudar animación"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          id="btn-reset-poincare"
          onClick={handleReset}
          aria-label="Reiniciar posición de recorrido"
          className="p-1 hover:text-[#000000] text-[#555555] transition-colors focus:outline-none"
          title="Reiniciar al centro"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          id="btn-toggle-network"
          onClick={() => setShowNetwork(!showNetwork)}
          aria-label="Mostrar u ocultar red de caminos"
          className={`p-1 transition-colors ${showNetwork ? 'text-[#1A1A1A] font-bold' : 'text-[#888888] hover:text-[#1A1A1A]'}`}
          title={showNetwork ? "Ocultar red de caminos" : "Visualizar red de caminos"}
        >
          <Compass className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          id="btn-info-poincare"
          onClick={() => setShowInfo(!showInfo)}
          aria-label="Información geométrica del disco"
          className={`p-1 transition-colors ${showInfo ? 'text-[#1A1A1A]' : 'text-[#888888] hover:text-[#1A1A1A]'}`}
          title="Detalles didácticos"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reduced motion badge */}
      {isReducedMotion && (
        <div className="absolute top-4 left-4 z-20 bg-white border border-[#E5E5E5] text-[#555555] text-[10px] px-2.5 py-0.5 rounded-full font-mono">
          Movimiento reducido
        </div>
      )}

      {/* Popover Info drawer */}
      {showInfo && (
        <div className="mt-4 relative z-20 p-4 bg-white border border-[#E5E5E5] text-left text-xs text-[#555555] leading-normal space-y-1.5 max-w-sm">
          <div className="flex items-center justify-between font-mono font-medium text-[#1A1A1A]">
            <span className="text-[11px] uppercase tracking-wider">Parámetros del Modelo</span>
            <span className="text-[10px] bg-[#F9F9F9] border border-[#E5E5E5] px-1.5 py-0.5 text-[#1A1A1A]">
              Nodo: {animState.current.currentNodeIndex}
            </span>
          </div>
          <p className="text-[11px] text-[#666666]">
            • Geodésicas ortogonales hiperbólicas intersectan el horizonte asintótico perpendicularmente.
          </p>
          <p className="text-[11px] text-[#666666]">
            • Densidad incremental hacia la frontera: r_n = √(d_n² - R²).
          </p>
        </div>
      )}
    </div>
  );
};
