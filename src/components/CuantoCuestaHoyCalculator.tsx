import React, { useState, useId } from 'react';
import { DollarSign, ArrowRightLeft, TrendingUp, TrendingDown, Info, ExternalLink, Calculator, RotateCcw, Sparkles } from 'lucide-react';

interface CuantoCuestaHoyCalculatorProps {
  embedded?: boolean;
}

export const CuantoCuestaHoyCalculator: React.FC<CuantoCuestaHoyCalculatorProps> = ({ embedded = false }) => {
  const usdInputId = useId();
  const rate1InputId = useId();
  const rate2InputId = useId();

  // Initial values as required by specification: USD 20, 4.000 COP/USD, 4.200 COP/USD
  const [usdPrice, setUsdPrice] = useState<number>(20);
  const [rate1, setRate1] = useState<number>(4000);
  const [rate2, setRate2] = useState<number>(4200);

  // Formatting helpers
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  // Mathematical calculations
  const cost1 = (usdPrice > 0 && rate1 > 0) ? usdPrice * rate1 : 0;
  const cost2 = (usdPrice > 0 && rate2 > 0) ? usdPrice * rate2 : 0;
  const diffCOP = cost2 - cost1;
  const pctChange = cost1 > 0 ? ((cost2 - cost1) / cost1) * 100 : 0;

  // Max value for comparative bar scaling
  const maxCost = Math.max(cost1, cost2, 1);
  const widthPct1 = Math.max((cost1 / maxCost) * 100, 4);
  const widthPct2 = Math.max((cost2 / maxCost) * 100, 4);

  // Preset scenarios
  const applyPreset = (usd: number, r1: number, r2: number) => {
    setUsdPrice(usd);
    setRate1(r1);
    setRate2(r2);
  };

  const resetToDefault = () => {
    setUsdPrice(20);
    setRate1(4000);
    setRate2(4200);
  };

  return (
    <div id="cuanto-cuesta-hoy" className={`bg-white border border-[#E5E5E5] text-left transition-all ${embedded ? 'p-5 sm:p-7' : 'p-6 sm:p-10 shadow-xs'}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#1A1A1A] text-white text-[10px] font-mono uppercase tracking-wider font-semibold">
              Actividad interactiva de la plataforma
            </span>
            <span className="px-2 py-0.5 bg-[#F4F4F4] text-[#666666] border border-[#E0E0E0] text-[10px] font-mono">
              Recurso propio
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-[#1A1A1A] tracking-tight flex items-center gap-2 pt-1">
            <Calculator className="w-5 h-5 text-[#1A1A1A]" />
            <span>¿Cuánto cuesta hoy? — Tasa de cambio y compra real</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] font-sans">
            Compara el impacto de la cotización del dólar en una compra cotidiana y analiza la variación absoluta y porcentual.
          </p>
        </div>

        <button
          type="button"
          onClick={resetToDefault}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F9] hover:bg-[#EAEAEA] border border-[#E5E5E5] text-xs font-mono text-[#444444] transition-colors"
          title="Restablecer valores iniciales (USD 20, 4.000 vs 4.200)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer ejemplo</span>
        </button>
      </div>

      {/* Interactive controls grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 pb-4">
        {/* Input 1: Precio en USD */}
        <div className="p-4 bg-[#FAFAFA] border border-[#EAEAEA] space-y-2">
          <label htmlFor={usdInputId} className="block text-xs font-mono font-semibold text-[#1A1A1A]">
            1. Precio del producto (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#888888]">
              $
            </span>
            <input
              id={usdInputId}
              type="number"
              min="0.01"
              step="1"
              value={usdPrice || ''}
              onChange={(e) => setUsdPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-7 pr-3 py-2 bg-white border border-[#CCCCCC] focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm font-mono text-[#1A1A1A] outline-none"
              placeholder="Ej. 20"
            />
          </div>
          <span className="text-[11px] text-[#777777] font-sans block">
            Valor de referencia: {formatUSD(usdPrice)}
          </span>
        </div>

        {/* Input 2: Tasa de cambio 1 (COP/USD) */}
        <div className="p-4 bg-[#FAFAFA] border border-[#EAEAEA] space-y-2">
          <label htmlFor={rate1InputId} className="block text-xs font-mono font-semibold text-[#1A1A1A]">
            2. Tasa de cambio inicial (COP/USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#888888]">
              COP
            </span>
            <input
              id={rate1InputId}
              type="number"
              min="1"
              step="50"
              value={rate1 || ''}
              onChange={(e) => setRate1(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-12 pr-3 py-2 bg-white border border-[#CCCCCC] focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm font-mono text-[#1A1A1A] outline-none"
              placeholder="Ej. 4000"
            />
          </div>
          <span className="text-[11px] text-[#777777] font-sans block">
            Tasa 1: ${rate1.toLocaleString('es-CO')} COP por 1 USD
          </span>
        </div>

        {/* Input 3: Tasa de cambio 2 (COP/USD) */}
        <div className="p-4 bg-[#FAFAFA] border border-[#EAEAEA] space-y-2">
          <label htmlFor={rate2InputId} className="block text-xs font-mono font-semibold text-[#1A1A1A]">
            3. Tasa de cambio comparada (COP/USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#888888]">
              COP
            </span>
            <input
              id={rate2InputId}
              type="number"
              min="1"
              step="50"
              value={rate2 || ''}
              onChange={(e) => setRate2(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-12 pr-3 py-2 bg-white border border-[#CCCCCC] focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm font-mono text-[#1A1A1A] outline-none"
              placeholder="Ej. 4200"
            />
          </div>
          <span className="text-[11px] text-[#777777] font-sans block">
            Tasa 2: ${rate2.toLocaleString('es-CO')} COP por 1 USD
          </span>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-6 text-xs">
        <span className="text-[11px] font-mono text-[#777777] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#1A1A1A]" />
          <span>Casos prácticos:</span>
        </span>
        <button
          type="button"
          onClick={() => applyPreset(20, 4000, 4200)}
          className="px-2.5 py-1 bg-[#F9F9F9] hover:bg-[#1A1A1A] hover:text-white border border-[#E5E5E5] text-[11px] font-mono transition-colors"
        >
          Ejemplo base: USD 20 (4.000 vs 4.200)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(15, 3950, 4350)}
          className="px-2.5 py-1 bg-[#F9F9F9] hover:bg-[#1A1A1A] hover:text-white border border-[#E5E5E5] text-[11px] font-mono transition-colors"
        >
          Suscripción digital: USD 15
        </button>
        <button
          type="button"
          onClick={() => applyPreset(120, 4400, 4050)}
          className="px-2.5 py-1 bg-[#F9F9F9] hover:bg-[#1A1A1A] hover:text-white border border-[#E5E5E5] text-[11px] font-mono transition-colors"
        >
          Apreciación del peso (Baja: 4.400 a 4.050)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(250, 4100, 4600)}
          className="px-2.5 py-1 bg-[#F9F9F9] hover:bg-[#1A1A1A] hover:text-white border border-[#E5E5E5] text-[11px] font-mono transition-colors"
        >
          Artículo de tecnología: USD 250
        </button>
      </div>

      {/* Results Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-[#F9F9F9] border border-[#E5E5E5] mb-6">
        {/* Costo 1 */}
        <div className="space-y-1 bg-white p-3.5 border border-[#E5E5E5]">
          <span className="text-[10px] font-mono text-[#888888] uppercase block">
            Costo con Tasa 1 (${rate1.toLocaleString('es-CO')})
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#1A1A1A]">
            {formatCOP(cost1)}
          </div>
          <span className="text-[10px] text-[#777777] font-mono block">
            {usdPrice} USD × ${rate1.toLocaleString('es-CO')} COP
          </span>
        </div>

        {/* Costo 2 */}
        <div className="space-y-1 bg-white p-3.5 border border-[#E5E5E5]">
          <span className="text-[10px] font-mono text-[#888888] uppercase block">
            Costo con Tasa 2 (${rate2.toLocaleString('es-CO')})
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#1A1A1A]">
            {formatCOP(cost2)}
          </div>
          <span className="text-[10px] text-[#777777] font-mono block">
            {usdPrice} USD × ${rate2.toLocaleString('es-CO')} COP
          </span>
        </div>

        {/* Diferencia en COP */}
        <div className="space-y-1 bg-white p-3.5 border border-[#E5E5E5]">
          <span className="text-[10px] font-mono text-[#888888] uppercase block">
            Diferencia en pesos
          </span>
          <div className={`text-lg sm:text-xl font-bold font-mono flex items-center gap-1.5 ${diffCOP > 0 ? 'text-amber-700' : diffCOP < 0 ? 'text-emerald-700' : 'text-[#1A1A1A]'}`}>
            {diffCOP > 0 ? <TrendingUp className="w-4 h-4" /> : diffCOP < 0 ? <TrendingDown className="w-4 h-4" /> : null}
            <span>{diffCOP >= 0 ? `+${formatCOP(diffCOP)}` : `-${formatCOP(Math.abs(diffCOP))}`}</span>
          </div>
          <span className="text-[10px] text-[#777777] font-mono block">
            {diffCOP > 0 ? 'Sobrecosto en COP' : diffCOP < 0 ? 'Ahorro en COP' : 'Sin variación'}
          </span>
        </div>

        {/* Variación porcentual */}
        <div className="space-y-1 bg-white p-3.5 border border-[#E5E5E5]">
          <span className="text-[10px] font-mono text-[#888888] uppercase block">
            Variación porcentual
          </span>
          <div className={`text-lg sm:text-xl font-bold font-mono flex items-center gap-1.5 ${pctChange > 0 ? 'text-amber-700' : pctChange < 0 ? 'text-emerald-700' : 'text-[#1A1A1A]'}`}>
            <span>{pctChange >= 0 ? `+${pctChange.toFixed(2)}%` : `${pctChange.toFixed(2)}%`}</span>
          </div>
          <span className="text-[10px] text-[#777777] font-mono block">
            ((Costo 2 - Costo 1) / Costo 1) × 100
          </span>
        </div>
      </div>

      {/* Visual Representation Bar Chart */}
      <div className="p-5 bg-white border border-[#E5E5E5] space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-[#1A1A1A]">
            Representación visual comparativa de costos
          </span>
          <span className="text-[11px] font-mono text-[#888888]">
            Base de escala: {formatCOP(maxCost)}
          </span>
        </div>

        {/* Bar 1 */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#555555]">Tasa 1 (${rate1.toLocaleString('es-CO')} COP/USD)</span>
            <span className="font-semibold text-[#1A1A1A]">{formatCOP(cost1)}</span>
          </div>
          <div className="w-full h-7 bg-[#F0F0F0] border border-[#E0E0E0] p-0.5">
            <div
              className="h-full bg-[#555555] transition-all duration-300 flex items-center justify-end px-2 text-[10px] font-mono text-white"
              style={{ width: `${widthPct1}%` }}
            >
              {widthPct1 > 20 && `${formatCOP(cost1)}`}
            </div>
          </div>
        </div>

        {/* Bar 2 */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#555555]">Tasa 2 (${rate2.toLocaleString('es-CO')} COP/USD)</span>
            <span className="font-semibold text-[#1A1A1A]">{formatCOP(cost2)}</span>
          </div>
          <div className="w-full h-7 bg-[#F0F0F0] border border-[#E0E0E0] p-0.5">
            <div
              className={`h-full transition-all duration-300 flex items-center justify-end px-2 text-[10px] font-mono text-white ${
                diffCOP > 0 ? 'bg-[#1A1A1A]' : diffCOP < 0 ? 'bg-emerald-800' : 'bg-[#555555]'
              }`}
              style={{ width: `${widthPct2}%` }}
            >
              {widthPct2 > 20 && `${formatCOP(cost2)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic pedagogical explanation */}
      <div className="p-4 bg-[#FBFBFB] border-l-4 border-[#1A1A1A] border-y border-r border-[#E5E5E5] space-y-2 mb-6 text-left">
        <div className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span>Explicación pedagógica del resultado</span>
        </div>
        <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-sans">
          {cost1 === cost2 ? (
            <>
              Al mantener la misma tasa de cambio de <strong>${rate1.toLocaleString('es-CO')} COP/USD</strong>, el costo de un producto de <strong>{formatUSD(usdPrice)}</strong> permanece en <strong>{formatCOP(cost1)}</strong> con una variación del <strong>0.00%</strong>.
            </>
          ) : diffCOP > 0 ? (
            <>
              Para un producto que cuesta <strong>{formatUSD(usdPrice)}</strong>, el paso de una tasa de <strong>${rate1.toLocaleString('es-CO')} COP/USD</strong> a <strong>${rate2.toLocaleString('es-CO')} COP/USD</strong> genera un incremento en moneda local de <strong>+{formatCOP(diffCOP)}</strong> (un aumento del <strong>+{pctChange.toFixed(2)}%</strong>). Esto implica que se requieren más pesos colombianos para adquirir exactamente el mismo bien o servicio.
            </>
          ) : (
            <>
              Para un producto que cuesta <strong>{formatUSD(usdPrice)}</strong>, la disminución de la tasa de <strong>${rate1.toLocaleString('es-CO')} COP/USD</strong> a <strong>${rate2.toLocaleString('es-CO')} COP/USD</strong> produce una reducción de <strong>-{formatCOP(Math.abs(diffCOP))}</strong> (un ahorro del <strong>{pctChange.toFixed(2)}%</strong> en pesos colombianos).
            </>
          )}
        </p>
      </div>

      {/* Explicit Formulas Box */}
      <div className="p-4 bg-white border border-[#E5E5E5] space-y-3 mb-6">
        <span className="text-[11px] font-mono font-semibold text-[#1A1A1A] block uppercase tracking-wider">
          Fundamento matemático de la actividad
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-[#F9F9F9] border border-[#EAEAEA]">
            <span className="text-[#888888] block text-[10px]">Cálculo de Costo en Moneda Local:</span>
            <code className="text-[#1A1A1A] font-semibold">
              Costo en COP = Precio en USD × Tasa de cambio
            </code>
          </div>
          <div className="p-2.5 bg-[#F9F9F9] border border-[#EAEAEA]">
            <span className="text-[#888888] block text-[10px]">Cálculo de Variación Relativa (%):</span>
            <code className="text-[#1A1A1A] font-semibold">
              Variación % = ((Costo 2 - Costo 1) / Costo 1) × 100
            </code>
          </div>
        </div>
      </div>

      {/* Footer Notes & Official BanRep Links */}
      <div className="pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px]">
        <div className="space-y-1 text-[#777777]">
          <div className="inline-flex items-center gap-1 font-mono font-medium text-[#444444] bg-[#F5F5F5] px-2 py-0.5 border border-[#E0E0E0]">
            <span>Ejemplo hipotético editable</span>
          </div>
          <p className="font-sans">
            El cálculo excluye impuestos locales, aranceles de importación y comisiones bancarias o de pasarelas de pago.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <a
            href="https://suameca.banrep.gov.co/graficador-interactivo/grafica.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-blue-600 hover:text-blue-800 underline decoration-blue-300 font-medium"
          >
            <span>Consultar TRM oficial (BanRep)</span>
            <ExternalLink className="w-3 h-3 text-blue-600 flex-shrink-0" />
          </a>

          <a
            href="https://www.banrep.gov.co/es/como-consultar-datos-historicos-tasa-representativa-mercado-trm-nuevo-portal-estadisticas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[#555555] hover:text-[#1A1A1A] underline decoration-gray-300"
          >
            <span>Guía de consulta</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
