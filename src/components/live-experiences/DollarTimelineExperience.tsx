import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ExternalLink, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { CuantoCuestaHoyCalculator } from '../CuantoCuestaHoyCalculator';

interface HistoricalDataPoint {
  dateStr: string;
  year: number;
  month: string;
  rate: number; // TRM COP/USD
  context: string;
}

export const DollarTimelineExperience: React.FC = () => {
  // Representative historical TRM series from official Banco de la República records (monthly averages / key dates)
  const historicalData: HistoricalDataPoint[] = useMemo(() => [
    { dateStr: 'Ene 2021', year: 2021, month: 'Ene', rate: 3480, context: 'Recuperación post-pandemia' },
    { dateStr: 'May 2021', year: 2021, month: 'May', rate: 3750, context: 'Presiones inflacionarias globales' },
    { dateStr: 'Sep 2021', year: 2021, month: 'Sep', rate: 3820, context: 'Inicio de alza en tasas internacionales' },
    { dateStr: 'Ene 2022', year: 2022, month: 'Ene', rate: 3980, context: 'Inicio de 2022' },
    { dateStr: 'Jun 2022', year: 2022, month: 'Jun', rate: 4150, context: 'Elecciones presidenciales y contexto global' },
    { dateStr: 'Oct 2022', year: 2022, month: 'Oct', rate: 4850, context: 'Fuerte incertidumbre internacional y tasas Fed' },
    { dateStr: 'Nov 2022', year: 2022, month: 'Nov', rate: 4990, context: 'Máximo histórico del dólar en Colombia (~$5.000 COP)' },
    { dateStr: 'Feb 2023', year: 2023, month: 'Feb', rate: 4780, context: 'Ajustes en expectativas de inflación' },
    { dateStr: 'Jun 2023', year: 2023, month: 'Jun', rate: 4180, context: 'Apreciación del peso colombiano' },
    { dateStr: 'Dic 2023', year: 2023, month: 'Dic', rate: 3822, context: 'Cierre de año con fortalecimiento del peso' },
    { dateStr: 'Abr 2024', year: 2024, month: 'Abr', rate: 3880, context: 'Estabilidad cambiaria relativa' },
    { dateStr: 'Ago 2024', year: 2024, month: 'Ago', rate: 4050, context: 'Volatilidad en mercados emergentes' },
    { dateStr: 'Nov 2024', year: 2024, month: 'Nov', rate: 4420, context: 'Elecciones en EE.UU. y fortaleza del dólar global' },
    { dateStr: 'Ene 2025', year: 2025, month: 'Ene', rate: 4280, context: 'Ajuste estacional' },
    { dateStr: 'May 2025', year: 2025, month: 'May', rate: 4190, context: 'Tendencia de mediano plazo' },
    { dateStr: 'Reciente', year: 2025, month: 'Ref', rate: 4150, context: 'Nivel representativo actual' },
  ], []);

  // Products available to simulate
  const products = [
    { id: 'sub', name: 'Suscripción digital', usdPrice: 15, icon: '📱' },
    { id: 'book', name: 'Libro académico', usdPrice: 35, icon: '📚' },
    { id: 'tech', name: 'Artículo tecnológico', usdPrice: 120, icon: '🎧' },
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedIndex, setSelectedIndex] = useState<number>(6); // Default to peak Nov 2022
  const [baselineIndex, setBaselineIndex] = useState<number>(0); // Baseline Jan 2021
  const [showAdvancedCalculator, setShowAdvancedCalculator] = useState<boolean>(false);

  const activePoint = historicalData[selectedIndex];
  const baselinePoint = historicalData[baselineIndex];

  // Calculations
  const activeCostCOP = selectedProduct.usdPrice * activePoint.rate;
  const baselineCostCOP = selectedProduct.usdPrice * baselinePoint.rate;
  const diffCOP = activeCostCOP - baselineCostCOP;
  const pctDiff = baselineCostCOP > 0 ? (diffCOP / baselineCostCOP) * 100 : 0;

  // Chart layout math
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const minRate = 3200;
  const maxRate = 5200;

  const getX = (index: number) => {
    return paddingX + (index / (historicalData.length - 1)) * (svgWidth - paddingX * 2);
  };

  const getY = (rate: number) => {
    const norm = (rate - minRate) / (maxRate - minRate);
    return svgHeight - paddingBottom - norm * (svgHeight - paddingTop - paddingBottom);
  };

  // Build SVG path
  const pathD = useMemo(() => {
    return historicalData.reduce((acc, point, index) => {
      const x = getX(index);
      const y = getY(point.rate);
      return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [historicalData]);

  // Build gradient area path
  const areaD = useMemo(() => {
    const firstX = getX(0);
    const lastX = getX(historicalData.length - 1);
    const bottomY = svgHeight - paddingBottom;
    return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathD, historicalData]);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  return (
    <div className="bg-white border border-[#E5E5E5] text-[#1A1A1A] rounded-none overflow-hidden flex flex-col">
      {/* 1. Main Visual Timeline Graph Area (~80% visual priority) */}
      <div className="p-4 sm:p-6 bg-white space-y-4">
        {/* Header Strip with interactive invite */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0F0] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[10px] font-mono uppercase font-semibold">
                Gráfica Histórica Interactiva
              </span>
              <span className="text-[11px] font-mono text-[#666666]">
                TRM en Colombia (COP/USD)
              </span>
            </div>
            <p className="text-xs text-[#555555] font-sans">
              Recorre la línea de tiempo con el cursor o el dedo para ver cómo evoluciona la cotización y el costo de compra en moneda local.
            </p>
          </div>

          {/* Product selector tabs */}
          <div className="flex items-center gap-1 bg-[#F5F5F5] p-1 border border-[#E0E0E0] self-start sm:self-auto text-xs font-mono">
            <span className="text-[10px] text-[#888888] px-1.5 hidden md:inline">Producto:</span>
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProduct(p)}
                className={`px-2.5 py-1 transition-colors flex items-center gap-1.5 ${
                  selectedProduct.id === p.id
                    ? 'bg-white text-[#1A1A1A] font-bold border border-[#D5D5D5] shadow-xs'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name} (${p.usdPrice} USD)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive SVG Graph */}
        <div className="relative w-full overflow-hidden bg-[#FAFAFA] border border-[#EAEAEA] select-none touch-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-[220px] sm:h-[260px] cursor-crosshair"
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = ((e.clientX - rect.left) / rect.width) * svgWidth;
              const usableWidth = svgWidth - paddingX * 2;
              const ratio = Math.max(0, Math.min(1, (clickX - paddingX) / usableWidth));
              const newIndex = Math.round(ratio * (historicalData.length - 1));
              setSelectedIndex(newIndex);
            }}
          >
            <defs>
              <linearGradient id="trmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[3500, 4000, 4500, 5000].map((r) => {
              const y = getY(r);
              return (
                <g key={r}>
                  <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={paddingX - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#9CA3AF" fontFamily="ui-monospace, monospace">
                    ${r.toLocaleString('es-CO')}
                  </text>
                </g>
              );
            })}

            {/* Filled Area */}
            <path d={areaD} fill="url(#trmGradient)" />

            {/* Main Trend Line */}
            <path d={pathD} fill="none" stroke="#1A1A1A" strokeWidth="2.5" />

            {/* Data points */}
            {historicalData.map((pt, i) => {
              const x = getX(i);
              const y = getY(pt.rate);
              const isSelected = selectedIndex === i;
              const isBase = baselineIndex === i;

              return (
                <g key={pt.dateStr} className="transition-all">
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : isBase ? 4.5 : 3}
                    fill={isSelected ? '#1A1A1A' : isBase ? '#2563EB' : '#FFFFFF'}
                    stroke={isSelected ? '#FFFFFF' : isBase ? '#2563EB' : '#1A1A1A'}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />

                  {/* Year marker on bottom */}
                  {(i === 0 || i === 3 || i === 7 || i === 10 || i === 13 || i === historicalData.length - 1) && (
                    <text x={x} y={svgHeight - 14} textAnchor="middle" fontSize="9" fill="#6B7280" fontFamily="ui-monospace, monospace">
                      {pt.month} {pt.year}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Active Vertical Scrubber Line */}
            <line
              x1={getX(selectedIndex)}
              y1={paddingTop - 10}
              x2={getX(selectedIndex)}
              y2={svgHeight - paddingBottom}
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </svg>

          {/* Floating dynamic product cost tooltip */}
          <div
            className="absolute top-3 pointer-events-none transition-all duration-75"
            style={{
              left: `clamp(10px, ${(selectedIndex / (historicalData.length - 1)) * 85}%, calc(100% - 240px))`
            }}
          >
            <div className="bg-white/95 backdrop-blur-xs border border-[#1A1A1A] p-2.5 shadow-md text-left space-y-1 w-56">
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-1">
                <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase">
                  {activePoint.dateStr}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#2563EB]">
                  ${activePoint.rate.toLocaleString('es-CO')} COP/USD
                </span>
              </div>
              <div className="text-xs font-mono flex items-center justify-between text-[#333333]">
                <span>{selectedProduct.icon} {selectedProduct.name}:</span>
                <strong className="text-[#1A1A1A] text-sm">{formatCOP(activeCostCOP)}</strong>
              </div>
              <div className="text-[10px] text-[#777777] font-sans truncate">
                {activePoint.context}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono pt-1">
          <span className="text-[11px] text-[#888888] flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Hitos históricos:</span>
          </span>
          {[
            { label: 'Ene 2021 (Base: $3.480)', index: 0 },
            { label: 'Nov 2022 (Pico: $4.990)', index: 6 },
            { label: 'Dic 2023 (Baja: $3.822)', index: 9 },
            { label: 'Nov 2024 ($4.420)', index: 12 },
            { label: 'Actualidad', index: historicalData.length - 1 }
          ].map((h) => (
            <button
              key={h.label}
              type="button"
              onClick={() => setSelectedIndex(h.index)}
              className={`px-2.5 py-1 border transition-colors ${
                selectedIndex === h.index
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                  : 'bg-white text-[#555555] border-[#E0E0E0] hover:border-[#999999]'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>

        {/* Dynamic Impact Comparison Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#F9F9F9] border border-[#E5E5E5] text-xs font-mono text-left">
          <div>
            <span className="text-[#888888] text-[10px] block uppercase">Punto seleccionado ({activePoint.dateStr})</span>
            <div className="text-base font-bold text-[#1A1A1A]">{formatCOP(activeCostCOP)}</div>
            <span className="text-[10px] text-[#666666]">{selectedProduct.usdPrice} USD × ${activePoint.rate.toLocaleString('es-CO')}</span>
          </div>

          <div>
            <span className="text-[#888888] text-[10px] block uppercase">Variación vs. Ene 2021 (${baselinePoint.rate.toLocaleString('es-CO')})</span>
            <div className={`text-base font-bold flex items-center gap-1 ${diffCOP > 0 ? 'text-amber-800' : diffCOP < 0 ? 'text-emerald-800' : 'text-[#1A1A1A]'}`}>
              {diffCOP > 0 ? <TrendingUp className="w-4 h-4" /> : diffCOP < 0 ? <TrendingDown className="w-4 h-4" /> : null}
              <span>{diffCOP >= 0 ? `+${formatCOP(diffCOP)}` : `-${formatCOP(Math.abs(diffCOP))}`}</span>
            </div>
            <span className="text-[10px] text-[#666666]">{pctDiff >= 0 ? `+${pctDiff.toFixed(1)}%` : `${pctDiff.toFixed(1)}%`} en moneda local</span>
          </div>

          <div className="flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-[#E5E5E5] pt-2 sm:pt-0 sm:pl-3">
            <button
              type="button"
              onClick={() => setShowAdvancedCalculator(!showAdvancedCalculator)}
              className="text-xs text-blue-600 hover:text-blue-800 underline font-medium flex items-center gap-1"
            >
              <span>{showAdvancedCalculator ? 'Ocultar calculadora editable' : 'Abrir calculadora personalizada'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedCalculator ? 'rotate-180' : ''}`} />
            </button>
            <span className="text-[10px] text-[#888888] mt-0.5">Permite ingresar cualquier valor y dos tasas a medida.</span>
          </div>
        </div>

        {/* 2. Secondary Collapsible: Full Custom Calculator */}
        {showAdvancedCalculator && (
          <div className="border border-[#E0E0E0] p-4 bg-white animate-in fade-in duration-200">
            <CuantoCuestaHoyCalculator embedded={true} />
          </div>
        )}
      </div>

      {/* Discrete Footer Attribution */}
      <div className="px-4 py-2 bg-[#F5F5F5] border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#666666]">
        <span>Demostración interactiva con serie histórica representativa del Banco de la República</span>
        <div className="flex items-center gap-3">
          <a
            href="https://suameca.banrep.gov.co/graficador-interactivo/grafica.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
          >
            <span>Graficador TRM oficial (BanRep)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href="https://www.banrep.gov.co/es/como-consultar-datos-historicos-tasa-representativa-mercado-trm-nuevo-portal-estadisticas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#555555] hover:text-[#1A1A1A] underline"
          >
            <span>Guía de consulta</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
