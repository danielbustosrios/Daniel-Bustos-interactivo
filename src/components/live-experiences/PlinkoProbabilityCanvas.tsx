import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, ExternalLink, Sparkles, Plus } from 'lucide-react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isResting: boolean;
}

interface Pin {
  x: number;
  y: number;
  row: number;
  col: number;
}

export const PlinkoProbabilityCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [totalDropped, setTotalDropped] = useState<number>(0);
  const [isAutoDropping, setIsAutoDropping] = useState<boolean>(false);
  const [showTheoreticalCurve, setShowTheoreticalCurve] = useState<boolean>(true);

  // Simulation parameters
  const rows = 9;
  const numBins = rows + 1; // 10 bins
  const binsRef = useRef<number[]>(new Array(numBins).fill(0));
  const ballsRef = useRef<Ball[]>([]);
  const pinsRef = useRef<Pin[]>([]);

  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  const dropBall = (offsetX: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const spawnX = width / 2 + (Math.random() - 0.5) * 6 + offsetX;

    ballsRef.current.push({
      x: spawnX,
      y: 20,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 1 + Math.random() * 0.5,
      radius: 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      isResting: false
    });

    setTotalDropped((prev) => prev + 1);
  };

  const dropMultiple = (count: number) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        dropBall((Math.random() - 0.5) * 10);
      }, i * 70);
    }
  };

  const resetBoard = () => {
    ballsRef.current = [];
    binsRef.current = new Array(numBins).fill(0);
    setTotalDropped(0);
    setIsAutoDropping(false);
  };

  // Binomial PMF for theoretical curve: n = rows, p = 0.5
  const getBinomialPmf = (n: number, k: number): number => {
    const factorial = (num: number): number => {
      let r = 1;
      for (let i = 2; i <= num; i++) r *= i;
      return r;
    };
    const comb = factorial(n) / (factorial(k) * factorial(n - k));
    return comb * Math.pow(0.5, n);
  };

  useEffect(() => {
    let animationFrameId: number;
    let isVisible = true;
    let autoDropInterval: NodeJS.Timeout | null = null;
    let hasAutoDroppedInitial = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting && !hasAutoDroppedInitial) {
          hasAutoDroppedInitial = true;
          dropMultiple(15);
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

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

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

      // Layout geometry
      const pinTopY = 48;
      const binTopY = height - 90;
      const binBottomY = height - 12;
      const pinSpacingY = (binTopY - pinTopY) / (rows + 0.5);
      const pinSpacingX = Math.min(28, (width - 40) / (rows + 1));
      const boardCenterX = width / 2;

      // Recompute pins position
      const pins: Pin[] = [];
      for (let r = 0; r < rows; r++) {
        const count = r + 1;
        const rowY = pinTopY + r * pinSpacingY;
        const startX = boardCenterX - ((count - 1) * pinSpacingX) / 2;

        for (let c = 0; c < count; c++) {
          pins.push({
            x: startX + c * pinSpacingX,
            y: rowY,
            row: r,
            col: c
          });
        }
      }
      pinsRef.current = pins;

      // Calculate Bins X boundaries
      const binWidth = pinSpacingX;
      const binsStartX = boardCenterX - (numBins * binWidth) / 2;

      // Draw Funnel Top
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boardCenterX - 25, 10);
      ctx.lineTo(boardCenterX - 8, 35);
      ctx.lineTo(boardCenterX - 8, pinTopY - 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(boardCenterX + 25, 10);
      ctx.lineTo(boardCenterX + 8, 35);
      ctx.lineTo(boardCenterX + 8, pinTopY - 10);
      ctx.stroke();

      // Draw Pins
      pins.forEach((pin) => {
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Bins Separators
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= numBins; i++) {
        const bx = binsStartX + i * binWidth;
        ctx.beginPath();
        ctx.moveTo(bx, binTopY - 10);
        ctx.lineTo(bx, binBottomY);
        ctx.stroke();
      }

      // Draw Bin Base Line
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(binsStartX, binBottomY);
      ctx.lineTo(binsStartX + numBins * binWidth, binBottomY);
      ctx.stroke();

      // Draw Real Empirical Histogram in Bins
      const maxCount = Math.max(...binsRef.current, 1);
      const maxHistogramH = binBottomY - binTopY - 8;

      binsRef.current.forEach((count, i) => {
        if (count === 0) return;
        const bx = binsStartX + i * binWidth;
        const barH = (count / maxCount) * maxHistogramH;

        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(bx + 2, binBottomY - barH, binWidth - 4, barH);

        // Count number text
        ctx.fillStyle = count > 0 ? '#6B7280' : '#D1D5DB';
        ctx.font = '9px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${count}`, bx + binWidth / 2, binBottomY + 10);
      });

      // Draw Theoretical Binomial Curve Overlay
      if (showTheoreticalCurve && totalDropped > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 2]);

        for (let i = 0; i < numBins; i++) {
          const prob = getBinomialPmf(rows - 1, i);
          const theoreticalH = prob * maxHistogramH * (maxCount / (Math.max(1, totalDropped) * 0.28 || 1));
          const boundedH = Math.min(maxHistogramH, theoreticalH);
          const px = binsStartX + i * binWidth + binWidth / 2;
          const py = binBottomY - boundedH;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Physics update for active balls
      const g = 380; // gravity in px/s^2

      ballsRef.current.forEach((ball) => {
        if (ball.isResting) return;

        ball.vy += g * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        // Air damping
        ball.vx *= 0.99;

        // Pin collisions
        pins.forEach((pin) => {
          const dx = ball.x - pin.x;
          const dy = ball.y - pin.y;
          const dist = Math.hypot(dx, dy);
          const minDist = ball.radius + 2.5;

          if (dist < minDist && dist > 0) {
            // Elastic collision bounce
            const nx = dx / dist;
            const ny = dy / dist;

            // Push out
            ball.x = pin.x + nx * minDist;
            ball.y = pin.y + ny * minDist;

            // Add probabilistic randomness on bounce
            const impulse = Math.hypot(ball.vx, ball.vy) * 0.55;
            const randomJitter = (Math.random() - 0.5) * 40;
            ball.vx = nx * impulse + randomJitter;
            ball.vy = Math.max(15, Math.abs(ny) * impulse * 0.7);
          }
        });

        // Left/Right container walls
        if (ball.x < 15) {
          ball.x = 15;
          ball.vx = Math.abs(ball.vx) * 0.5;
        } else if (ball.x > width - 15) {
          ball.x = width - 15;
          ball.vx = -Math.abs(ball.vx) * 0.5;
        }

        // Entering bottom bins
        if (ball.y >= binBottomY - ball.radius) {
          ball.y = binBottomY - ball.radius;
          ball.isResting = true;
          ball.vx = 0;
          ball.vy = 0;

          // Determine bin index
          let binIndex = Math.floor((ball.x - binsStartX) / binWidth);
          binIndex = Math.max(0, Math.min(numBins - 1, binIndex));
          binsRef.current[binIndex] += 1;
        }

        // Draw active ball
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Filter out resting balls from array to keep memory and CPU low
      ballsRef.current = ballsRef.current.filter((b) => !b.isResting);

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (autoDropInterval) clearInterval(autoDropInterval);
      observer.disconnect();
    };
  }, [totalDropped, showTheoreticalCurve, isAutoDropping]);

  // Handle continuous auto drop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAutoDropping) {
      interval = setInterval(() => {
        dropBall((Math.random() - 0.5) * 8);
      }, 120);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoDropping]);

  return (
    <div ref={containerRef} className="bg-white border border-[#E5E5E5] text-[#1A1A1A] rounded-none overflow-hidden flex flex-col">
      {/* Live Canvas Area (~80% space) */}
      <div className="relative w-full h-[280px] sm:h-[320px] select-none touch-none bg-white">
        <canvas
          ref={canvasRef}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const offset = clickX - rect.width / 2;
            dropBall(Math.max(-20, Math.min(20, offset * 0.3)));
          }}
          className="w-full h-full cursor-pointer"
        />

        {/* Top Floating Invitation & Interactive Buttons */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-xs px-2.5 py-1 border border-[#E0E0E0] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span className="text-xs font-mono font-medium text-[#1A1A1A]">
              Tablero de Galton (Plinko)
            </span>
            <span className="text-[10px] font-mono text-[#666666] hidden sm:inline">
              — Toca el tablero o usa los botones
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => dropBall()}
              className="px-2.5 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-mono font-medium transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>1 bolita</span>
            </button>

            <button
              type="button"
              onClick={() => dropMultiple(10)}
              className="px-2.5 py-1.5 bg-[#F4F4F4] hover:bg-[#EAEAEA] border border-[#CCCCCC] text-[#1A1A1A] text-xs font-mono font-medium transition-colors shadow-xs"
            >
              +10
            </button>

            <button
              type="button"
              onClick={() => setIsAutoDropping(!isAutoDropping)}
              className={`p-1.5 border transition-colors shadow-xs ${
                isAutoDropping
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white hover:bg-[#F5F5F5] border-[#CCCCCC] text-[#555555]'
              }`}
              title={isAutoDropping ? 'Pausar lluvia' : 'Lluvia continua'}
            >
              {isAutoDropping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={resetBoard}
              className="p-1.5 bg-white hover:bg-[#F5F5F5] border border-[#CCCCCC] text-[#555555] hover:text-[#1A1A1A] transition-colors shadow-xs"
              title="Reiniciar bolitas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-[#E5E5E5] px-2.5 py-1 text-[11px] font-mono text-[#444444] shadow-xs flex items-center gap-2">
          <span className="text-[#888888]">Bolitas caídas:</span>
          <strong className="text-[#1A1A1A] font-bold">{totalDropped}</strong>
        </div>
      </div>

      {/* Control Strip */}
      <div className="px-4 py-2.5 bg-[#FAFAFA] border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <label className="flex items-center gap-2 cursor-pointer text-[#444444] hover:text-[#1A1A1A]">
          <input
            type="checkbox"
            checked={showTheoreticalCurve}
            onChange={(e) => setShowTheoreticalCurve(e.target.checked)}
            className="accent-[#2563EB] rounded-none"
          />
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#2563EB] inline-block border-t border-dashed border-[#2563EB]" />
            <span>Curva teórica binomial / Campana de Gauss</span>
          </span>
        </label>

        <span className="text-[11px] text-[#777777]">
          P(izq) = 50% | P(der) = 50% en cada clavo
        </span>
      </div>

      {/* Discrete Footer Attribution */}
      <div className="px-4 py-2 bg-[#F5F5F5] border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#666666]">
        <span>Demostración física interactiva propia</span>
        <a
          href="https://phet.colorado.edu/sims/html/plinko-probability/latest/plinko-probability_es.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
        >
          <span>Explorar Plinko en PhET</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};
