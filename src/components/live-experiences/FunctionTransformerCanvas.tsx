import React, { useRef, useEffect, useState, useMemo } from 'react';
import { RotateCcw, ExternalLink, Sparkles, Table, Crosshair, Check } from 'lucide-react';

export const FunctionTransformerCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // General polynomial coefficients: y = Ax^2 + Bx + C
  const [coeffA, setCoeffA] = useState<number>(0.5);
  const [coeffB, setCoeffB] = useState<number>(0);
  const [coeffC, setCoeffC] = useState<number>(-2);

  // Text inputs for direct editing without input locking
  const [inputA, setInputA] = useState<string>('0.5');
  const [inputB, setInputB] = useState<string>('0');
  const [inputC, setInputC] = useState<string>('-2');

  // Dragging vertex ref
  const isDraggingVertexRef = useRef<boolean>(false);

  // Coordinate system grid parameters
  const gridScale = 22; // pixels per math unit

  // Safe coefficient parsing
  const a = coeffA === 0 ? 0.0001 : coeffA; // Avoid division by zero
  const b = coeffB;
  const c = coeffC;

  // Vertex calculation: h = -b / (2a), k = f(h) = ah^2 + bh + c
  const h = -b / (2 * a);
  const k = a * h * h + b * h + c;

  // Discriminant & roots
  const discriminant = b * b - 4 * a * c;
  let root1: number | null = null;
  let root2: number | null = null;
  if (discriminant >= 0) {
    root1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    root2 = (-b + Math.sqrt(discriminant)) / (2 * a);
  }

  // 5 key table points around the axis of symmetry (x = h)
  const step = 1;
  const tablePoints = useMemo(() => {
    const xs = [h - 2 * step, h - step, h, h + step, h + 2 * step];
    return xs.map((xVal) => {
      const yVal = a * xVal * xVal + b * xVal + c;
      const isVertex = Math.abs(xVal - h) < 0.0001;
      return {
        x: xVal,
        y: yVal,
        isVertex,
        label: isVertex ? 'Vértice (Eje de simetría)' : xVal < h ? `Vértice - ${Math.abs(Math.round((h - xVal) / step))}` : `Vértice + ${Math.round((xVal - h) / step)}`
      };
    });
  }, [a, b, c, h]);

  const applyCoefficients = (newA: number, newB: number, newC: number) => {
    const validA = newA === 0 ? 0.1 : newA;
    setCoeffA(validA);
    setCoeffB(newB);
    setCoeffC(newC);
    setInputA(validA.toString());
    setInputB(newB.toString());
    setInputC(newC.toString());
  };

  const handleInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsedA = parseFloat(inputA);
    const parsedB = parseFloat(inputB);
    const parsedC = parseFloat(inputC);

    const safeA = isNaN(parsedA) || parsedA === 0 ? 0.5 : parsedA;
    const safeB = isNaN(parsedB) ? 0 : parsedB;
    const safeC = isNaN(parsedC) ? -2 : parsedC;

    applyCoefficients(safeA, safeB, safeC);
  };

  const resetParams = () => {
    applyCoefficients(0.5, 0, -2);
  };

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

      const originX = width / 2;
      const originY = height / 2;

      // Coordinate conversions
      const toScreenX = (mathX: number) => originX + mathX * gridScale;
      const toScreenY = (mathY: number) => originY - mathY * gridScale;

      // Grid Lines
      ctx.strokeStyle = '#F0F0F0';
      ctx.lineWidth = 1;

      for (let x = originX % gridScale; x < width; x += gridScale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = originY % gridScale; y < height; y += gridScale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Main Axes
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1.5;

      // X Axis
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();

      // Y Axis
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();

      // Axis ticks and numbers
      ctx.fillStyle = '#888888';
      ctx.font = '9px ui-monospace, monospace';
      for (let mx = -15; mx <= 15; mx += 2) {
        if (mx === 0) continue;
        const sx = toScreenX(mx);
        if (sx > 10 && sx < width - 10) {
          ctx.fillText(`${mx}`, sx - 4, originY + 12);
        }
      }
      for (let my = -10; my <= 10; my += 2) {
        if (my === 0) continue;
        const sy = toScreenY(my);
        if (sy > 10 && sy < height - 10) {
          ctx.fillText(`${my}`, originX + 5, sy + 3);
        }
      }

      // Draw Axis of Symmetry (x = h)
      const symX = toScreenX(h);
      ctx.beginPath();
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(symX, 0);
      ctx.lineTo(symX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label Axis of Symmetry
      if (symX > 20 && symX < width - 20) {
        ctx.fillStyle = '#2563EB';
        ctx.font = 'bold 9px ui-monospace, monospace';
        ctx.fillText(`Eje: x = ${h.toFixed(2)}`, symX + 4, 18);
      }

      // Draw Parabola Curve
      ctx.beginPath();
      ctx.strokeStyle = a >= 0 ? '#1A1A1A' : '#DC2626';
      ctx.lineWidth = 2.5;

      let first = true;
      for (let sx = 0; sx <= width; sx += 2) {
        const mathX = (sx - originX) / gridScale;
        const mathY = a * mathX * mathX + b * mathX + c;
        const sy = toScreenY(mathY);

        if (first) {
          ctx.moveTo(sx, sy);
          first = false;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();

      // Draw 5 Symmetric Key Points from Table
      tablePoints.forEach((pt) => {
        const px = toScreenX(pt.x);
        const py = toScreenY(pt.y);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          if (pt.isVertex) {
            // Vertex point with glowing halo
            ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
            ctx.beginPath();
            ctx.arc(px, py, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#2563EB';
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();

            // Only vertex retains coordinate label on the canvas (placed cleanly below/above the point depending on concavity)
            ctx.fillStyle = '#1E40AF';
            ctx.font = 'bold 10px ui-monospace, monospace';
            ctx.textAlign = 'center';
            const labelOffsetY = a >= 0 ? 18 : -12;
            ctx.fillText(`Vértice (${h.toFixed(1)}, ${k.toFixed(1)})`, px, py + labelOffsetY);
            ctx.textAlign = 'start';
          } else {
            // Symmetric companion points (dots without text clutter)
            ctx.fillStyle = '#D97706';
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Y-intercept point (0, c) - dot only
      const yIntX = toScreenX(0);
      const yIntY = toScreenY(c);
      if (yIntY >= 0 && yIntY <= height && Math.abs(h) > 0.3) {
        ctx.fillStyle = '#7C3AED';
        ctx.beginPath();
        ctx.arc(yIntX, yIntY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Roots on X-axis if they exist (dots only)
      if (root1 !== null && root2 !== null) {
        [root1, root2].forEach((r) => {
          const rx = toScreenX(r);
          if (rx >= 0 && rx <= width) {
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.arc(rx, originY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [a, b, c, h, k, tablePoints, root1, root2]);

  // Pointer interaction: drag vertex on plane
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingVertexRef.current = true;
    updateVertexFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingVertexRef.current) return;
    updateVertexFromPointer(e);
  };

  const handlePointerUp = () => {
    isDraggingVertexRef.current = false;
  };

  const updateVertexFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const originX = canvas.clientWidth / 2;
    const originY = canvas.clientHeight / 2;

    const newH = Math.round(((x - originX) / gridScale) * 2) / 2;
    const newK = Math.round(((originY - y) / gridScale) * 2) / 2;

    // Convert new (h, k) to (A, B, C) preserving A
    const newB = -2 * a * newH;
    const newC = a * newH * newH + newK;

    setCoeffB(Math.round(newB * 100) / 100);
    setCoeffC(Math.round(newC * 100) / 100);
    setInputB((Math.round(newB * 100) / 100).toString());
    setInputC((Math.round(newC * 100) / 100).toString());
  };

  return (
    <div ref={containerRef} className="bg-white border border-[#E5E5E5] text-[#1A1A1A] rounded-none overflow-hidden flex flex-col">
      {/* Top Input Bar: Coefficients A, B, C */}
      <div className="p-3 bg-[#F9FAFB] border-b border-[#EAEAEA]">
        <form onSubmit={handleInputSubmit} className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#1A1A1A] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Coeficientes de la Ecuación General:
            </span>

            {/* Input A */}
            <div className="flex items-center gap-1 bg-white border border-[#CCCCCC] px-2 py-1 shadow-xs">
              <label htmlFor="coeff-a-input" className="text-xs font-mono font-bold text-[#1A1A1A]">A =</label>
              <input
                id="coeff-a-input"
                type="number"
                step="0.1"
                value={inputA}
                onChange={(e) => {
                  setInputA(e.target.value);
                  const p = parseFloat(e.target.value);
                  if (!isNaN(p) && p !== 0) setCoeffA(p);
                }}
                className="w-14 text-xs font-mono text-[#1A1A1A] focus:outline-none"
                placeholder="0.5"
              />
            </div>

            {/* Input B */}
            <div className="flex items-center gap-1 bg-white border border-[#CCCCCC] px-2 py-1 shadow-xs">
              <label htmlFor="coeff-b-input" className="text-xs font-mono font-bold text-[#1A1A1A]">B =</label>
              <input
                id="coeff-b-input"
                type="number"
                step="0.5"
                value={inputB}
                onChange={(e) => {
                  setInputB(e.target.value);
                  const p = parseFloat(e.target.value);
                  if (!isNaN(p)) setCoeffB(p);
                }}
                className="w-14 text-xs font-mono text-[#1A1A1A] focus:outline-none"
                placeholder="0"
              />
            </div>

            {/* Input C */}
            <div className="flex items-center gap-1 bg-white border border-[#CCCCCC] px-2 py-1 shadow-xs">
              <label htmlFor="coeff-c-input" className="text-xs font-mono font-bold text-[#1A1A1A]">C =</label>
              <input
                id="coeff-c-input"
                type="number"
                step="0.5"
                value={inputC}
                onChange={(e) => {
                  setInputC(e.target.value);
                  const p = parseFloat(e.target.value);
                  if (!isNaN(p)) setCoeffC(p);
                }}
                className="w-14 text-xs font-mono text-[#1A1A1A] focus:outline-none"
                placeholder="-2"
              />
            </div>

            <button
              type="submit"
              className="px-3 py-1 bg-[#1A1A1A] hover:bg-black text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3 h-3" />
              <span>Graficar</span>
            </button>
          </div>

          <button
            type="button"
            onClick={resetParams}
            className="p-1.5 bg-white hover:bg-[#F5F5F5] border border-[#CCCCCC] text-[#555555] hover:text-[#1A1A1A] transition-colors shadow-xs flex items-center gap-1 text-xs font-mono"
            title="Restablecer valores iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>
        </form>
      </div>

      {/* Main Grid: Interactive Canvas + Live Symmetry Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#EAEAEA]">
        {/* Live Canvas Area (7 cols on large screens) */}
        <div className="lg:col-span-7 relative w-full h-[300px] sm:h-[350px] select-none touch-none bg-white border-b lg:border-b-0 lg:border-r border-[#EAEAEA]">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* Top Canvas Invitation */}
          <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-[#E0E0E0] shadow-xs">
            <Crosshair className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-mono font-medium text-[#1A1A1A]">
              Parábola en el Plano
            </span>
            <span className="text-[10px] font-mono text-[#666666] hidden sm:inline">
              — Arrastra el vértice azul para trasladarla
            </span>
          </div>

          {/* Curvature indicator */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-[#E5E5E5] px-2.5 py-1 text-[10px] font-mono text-[#555555] shadow-xs">
            <span>Concavidad: <strong className="text-[#1A1A1A]">{a > 0 ? 'Hacia arriba (∪)' : 'Hacia abajo (∩)'}</strong></span>
          </div>
        </div>

        {/* Live Symmetry & Key Points Table (5 cols on large screens) */}
        <div className="lg:col-span-5 p-4 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
              <div className="flex items-center gap-1.5">
                <Table className="w-4 h-4 text-[#1A1A1A]" />
                <h4 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Tabla de Puntos Principales
                </h4>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200">
                Eje: x = {h.toFixed(2)}
              </span>
            </div>

            <p className="text-[11px] font-mono text-[#666666] leading-tight">
              Puntos simétricos equidistantes al eje del vértice:
            </p>

            {/* Table */}
            <div className="overflow-x-auto border border-[#E0E0E0] bg-white shadow-xs">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-[#F0F2F5] text-[#555555] border-b border-[#E0E0E0] text-[11px]">
                  <tr>
                    <th className="px-2.5 py-2 font-semibold text-center">x</th>
                    <th className="px-2.5 py-2 font-semibold text-center">y = f(x)</th>
                    <th className="px-2.5 py-2 font-semibold text-center">Punto (x, y)</th>
                    <th className="px-2.5 py-2 font-semibold text-center">Propiedad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {tablePoints.map((pt, idx) => {
                    const isV = pt.isVertex;
                    const isPartner = idx === 0 || idx === 4; // h-2 & h+2
                    const isClosePartner = idx === 1 || idx === 3; // h-1 & h+1

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isV
                            ? 'bg-blue-50/80 font-bold text-blue-900 border-y-2 border-blue-300'
                            : isClosePartner
                            ? 'hover:bg-[#FFFBEB]'
                            : 'hover:bg-[#F9FAFB]'
                        }`}
                      >
                        <td className="px-2.5 py-1.5 text-center font-mono">
                          {pt.x.toFixed(2)}
                        </td>
                        <td className="px-2.5 py-1.5 text-center font-mono">
                          {pt.y.toFixed(2)}
                        </td>
                        <td className="px-2.5 py-1.5 text-center font-mono text-[11px]">
                          ({pt.x.toFixed(1)}, {pt.y.toFixed(1)})
                        </td>
                        <td className="px-2.5 py-1.5 text-center text-[10px]">
                          {isV ? (
                            <span className="px-1.5 py-0.5 bg-blue-600 text-white font-bold">
                              VÉRTICE
                            </span>
                          ) : isClosePartner ? (
                            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-200">
                              Simétrico (±1)
                            </span>
                          ) : (
                            <span className="text-gray-600 bg-gray-100 px-1.5 py-0.5">
                              Simétrico (±2)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Equation Box placed cleanly below the Table */}
            <div className="bg-white border border-[#E5E5E5] p-3 shadow-xs space-y-1.5">
              <div>
                <span className="text-[#2563EB] text-[9px] font-semibold uppercase tracking-wider block">
                  FORMA GENERAL (y = Ax² + Bx + C)
                </span>
                <strong className="text-[#1E40AF] text-xs sm:text-sm">
                  y = {a.toFixed(2)}x² {b >= 0 ? `+ ${b.toFixed(2)}x` : `- ${Math.abs(b).toFixed(2)}x`} {c >= 0 ? `+ ${c.toFixed(2)}` : `- ${Math.abs(c).toFixed(2)}`}
                </strong>
              </div>

              <div className="pt-1.5 border-t border-[#EAEAEA]">
                <span className="text-[#666666] text-[9px] font-semibold uppercase tracking-wider block">
                  FORMA CANÓNICA (VÉRTICE)
                </span>
                <strong className="text-[#1A1A1A] text-xs sm:text-sm">
                  y = {a.toFixed(2)}(x {h >= 0 ? `- ${h.toFixed(2)}` : `+ ${Math.abs(h).toFixed(2)}`})² {k >= 0 ? `+ ${k.toFixed(2)}` : `- ${Math.abs(k).toFixed(2)}`}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders Strip for fine-tuning */}
      <div className="px-4 py-3 bg-[#FAFAFA] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono items-center">
        <div className="flex items-center gap-2">
          <label className="text-[#666666] whitespace-nowrap">Apertura (A): <strong className="text-[#1A1A1A]">{a.toFixed(2)}</strong></label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={a}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              applyCoefficients(val, b, c);
            }}
            className="w-full h-1.5 bg-[#DDDDDD] rounded-none appearance-none accent-[#1A1A1A] cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[#666666] whitespace-nowrap">Lineal (B): <strong className="text-[#1A1A1A]">{b.toFixed(2)}</strong></label>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.5"
            value={b}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              applyCoefficients(a, val, c);
            }}
            className="w-full h-1.5 bg-[#DDDDDD] rounded-none appearance-none accent-[#1A1A1A] cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[#666666] whitespace-nowrap">Independiente (C): <strong className="text-[#1A1A1A]">{c.toFixed(2)}</strong></label>
          <input
            type="range"
            min="-6"
            max="6"
            step="0.5"
            value={c}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              applyCoefficients(a, b, val);
            }}
            className="w-full h-1.5 bg-[#DDDDDD] rounded-none appearance-none accent-[#1A1A1A] cursor-pointer"
          />
        </div>
      </div>

      {/* Discrete Footer Attribution */}
      <div className="px-4 py-2 bg-[#F5F5F5] border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#666666]">
        <span>Demostración matemática interactiva propia — Forma General y Canónica</span>
        <div className="flex items-center gap-3">
          <a
            href="https://phet.colorado.edu/sims/html/graphing-quadratics/latest/graphing-quadratics_es.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
          >
            <span>PhET Cuadráticas</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href="https://www.desmos.com/3d?lang=es"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
          >
            <span>Desmos 3D</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

