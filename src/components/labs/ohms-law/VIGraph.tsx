import React, { useState } from 'react';
import { ObservationReading, OhmsLawMode } from '../../../types';
import { OHMS_LAW_MODES } from '../../../data/ohmsLawData';
import { LineChart, CheckCircle2, AlertCircle, Info, Sparkles, TrendingUp } from 'lucide-react';

interface VIGraphProps {
  observations: ObservationReading[];
  mode: OhmsLawMode;
  theoreticalResistance?: number;
  theoreticalCurrent?: number;
  theoreticalVoltage?: number;
}

export const VIGraph: React.FC<VIGraphProps> = ({
  observations,
  mode,
  theoreticalResistance = 10.0,
  theoreticalCurrent = 0.20,
  theoreticalVoltage = 2.0,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ObservationReading | null>(null);
  const currentConfig = OHMS_LAW_MODES[mode];

  // Map observations to (x, y) based on active mode
  // Mode 1 (Find Current): X = Voltage V, Y = Current I
  // Mode 2 (Find Resistance): X = Current I, Y = Voltage V
  // Mode 3 (Find Voltage): X = Resistance R, Y = Voltage V
  const getXY = (obs: ObservationReading): { x: number; y: number } => {
    switch (mode) {
      case 'find-current':
        return { x: obs.voltage, y: obs.current };
      case 'find-resistance':
        return { x: obs.current, y: obs.voltage };
      case 'find-voltage':
        return { x: obs.resistance, y: obs.voltage };
      default:
        return { x: obs.current, y: obs.voltage };
    }
  };

  const dataPoints = observations.map((o) => ({
    ...o,
    ...getXY(o),
  }));

  // Require at least 3 points for formal least-squares regression line
  const hasEnoughData = dataPoints.length >= 3;

  // Linear Regression Calculation: Y = slope * X + intercept
  let slope = 0;
  let intercept = 0;
  let rSquared = 1.0;

  if (hasEnoughData) {
    const n = dataPoints.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    dataPoints.forEach((pt) => {
      sumX += pt.x;
      sumY += pt.y;
      sumXY += pt.x * pt.y;
      sumX2 += pt.x * pt.x;
      sumY2 += pt.y * pt.y;
    });

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) > 0.000001) {
      slope = (n * sumXY - sumX * sumY) / denominator;
      intercept = (sumY - slope * sumX) / n;

      const numeratorR = n * sumXY - sumX * sumY;
      const denomR = Math.sqrt(Math.max(0, (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)));
      if (denomR > 0.000001) {
        const r = numeratorR / denomR;
        rSquared = Math.min(1.0, Math.max(0.0, r * r));
      }
    } else {
      slope = 0;
      intercept = sumY / n;
    }
  }

  // Determine dynamic plot bounds with sensible default mins
  const defaultMaxX = mode === 'find-current' ? 12.0 : mode === 'find-resistance' ? 2.5 : 50.0;
  const defaultMaxY = mode === 'find-current' ? 2.5 : mode === 'find-resistance' ? 15.0 : 15.0;

  const maxX = Math.max(defaultMaxX, ...dataPoints.map((d) => d.x * 1.2));
  const maxY = Math.max(defaultMaxY, ...dataPoints.map((d) => d.y * 1.2));

  // SVG plot viewport dimensions
  const width = 560;
  const height = 360;
  const padding = { top: 30, right: 35, bottom: 55, left: 65 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => padding.left + (val / maxX) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - (val / maxY) * plotHeight;

  // Grid tick lines
  const numTicks = 5;
  const xTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxX * i) / numTicks);
  const yTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxY * i) / numTicks);

  // Line coordinates across the visible domain
  const x1 = 0;
  const y1 = Math.max(0, intercept);
  const x2 = maxX;
  const y2 = slope * maxX + intercept;

  // Mode-specific interpretation metrics
  let derivedQuantityLabel = '';
  let derivedQuantityValue = '';
  let derivedUnit = '';
  let interpretationSentence = '';

  if (mode === 'find-current') {
    derivedQuantityLabel = 'Evaluated Resistance (R = 1 / Slope)';
    const calculatedR = slope > 0.0001 ? 1 / slope : 0;
    derivedQuantityValue = calculatedR > 0 ? calculatedR.toFixed(2) : '—';
    derivedUnit = 'Ω';
    interpretationSentence =
      'Under constant resistance, the graph of Current (I) versus Voltage (V) is a straight line passing near the origin. The slope equals Conductance (G = 1/R), confirming I ∝ V.';
  } else if (mode === 'find-resistance') {
    derivedQuantityLabel = 'Evaluated Resistance (Slope R = ΔV / ΔI)';
    derivedQuantityValue = slope > 0 ? slope.toFixed(2) : '—';
    derivedUnit = 'Ω';
    interpretationSentence =
      'For an ohmic conductor, the slope of Potential Difference (V) versus Current (I) is constant and directly equals the conductor resistance R (V = IR).';
  } else {
    // find-voltage
    derivedQuantityLabel = 'Evaluated Current (Slope I = ΔV / ΔR)';
    derivedQuantityValue = slope > 0 ? slope.toFixed(3) : '—';
    derivedUnit = 'A';
    interpretationSentence =
      'Under constant current, the potential difference across a conductor is directly proportional to its resistance (V ∝ R). The slope ΔV / ΔR directly represents the circuit current I.';
  }

  return (
    <div id="graph-analysis-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Graph Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>{currentConfig.name} &bull; Graphical Analysis</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {currentConfig.graphTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {currentConfig.graphSubtitle}
          </p>
        </div>

        {hasEnoughData && (
          <div className="shrink-0 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Linear Fit Active ({dataPoints.length} points)</span>
          </div>
        )}
      </div>

      {/* Main Grid: SVG Canvas + Analytical Slope Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left: SVG Cartesian Graph Canvas (Span 7) */}
        <div className="lg:col-span-7 bg-slate-50/80 rounded-xl p-3 sm:p-4 border border-slate-200 relative flex flex-col items-center">
          
          <div className="w-full aspect-[14/9] max-h-[380px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
              aria-label={`${currentConfig.graphTitle} laboratory plot`}
            >
              {/* Background Cartesian Grid Lines */}
              <g opacity="0.65">
                {xTicks.map((xVal, i) => (
                  <line
                    key={`grid-x-${i}`}
                    x1={scaleX(xVal)}
                    y1={padding.top}
                    x2={scaleX(xVal)}
                    y2={padding.top + plotHeight}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}
                {yTicks.map((yVal, i) => (
                  <line
                    key={`grid-y-${i}`}
                    x1={padding.left}
                    y1={scaleY(yVal)}
                    x2={padding.left + plotWidth}
                    y2={scaleY(yVal)}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}
              </g>

              {/* Main Cartesian Axes */}
              {/* X Axis */}
              <line
                x1={padding.left}
                y1={padding.top + plotHeight}
                x2={padding.left + plotWidth}
                y2={padding.top + plotHeight}
                stroke="#1e293b"
                strokeWidth="2"
              />
              {/* Y Axis */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + plotHeight}
                stroke="#1e293b"
                strokeWidth="2"
              />

              {/* Axis Arrowheads */}
              <polygon
                points={`${padding.left + plotWidth},${padding.top + plotHeight - 4} ${padding.left + plotWidth + 6},${padding.top + plotHeight} ${padding.left + plotWidth},${padding.top + plotHeight + 4}`}
                fill="#1e293b"
              />
              <polygon
                points={`${padding.left - 4},${padding.top} ${padding.left},${padding.top - 6} ${padding.left + 4},${padding.top}`}
                fill="#1e293b"
              />

              {/* X-Axis Ticks & Labels */}
              {xTicks.map((xVal, i) => (
                <g key={`lbl-x-${i}`}>
                  <line
                    x1={scaleX(xVal)}
                    y1={padding.top + plotHeight}
                    x2={scaleX(xVal)}
                    y2={padding.top + plotHeight + 5}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  <text
                    x={scaleX(xVal)}
                    y={padding.top + plotHeight + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fill="#475569"
                  >
                    {mode === 'find-resistance' ? xVal.toFixed(2) : xVal.toFixed(1)}
                  </text>
                </g>
              ))}

              {/* Y-Axis Ticks & Labels */}
              {yTicks.map((yVal, i) => (
                <g key={`lbl-y-${i}`}>
                  <line
                    x1={padding.left - 5}
                    y1={scaleY(yVal)}
                    x2={padding.left}
                    y2={scaleY(yVal)}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  <text
                    x={padding.left - 10}
                    y={scaleY(yVal) + 3}
                    textAnchor="end"
                    fontSize="10"
                    fontFamily="monospace"
                    fill="#475569"
                  >
                    {mode === 'find-current' ? yVal.toFixed(2) : yVal.toFixed(1)}
                  </text>
                </g>
              ))}

              {/* Axis Titles */}
              <text
                x={padding.left + plotWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fontSize="12"
                fontFamily="sans-serif"
                fontWeight="bold"
                fill="#0f172a"
              >
                {currentConfig.xAxisLabel} ({currentConfig.xAxisUnit}) &rarr;
              </text>

              <text
                x={-(padding.top + plotHeight / 2)}
                y={18}
                transform="rotate(-90)"
                textAnchor="middle"
                fontSize="12"
                fontFamily="sans-serif"
                fontWeight="bold"
                fill="#0f172a"
              >
                {currentConfig.yAxisLabel} ({currentConfig.yAxisUnit}) &rarr;
              </text>

              {/* Best-Fit Linear Regression Line */}
              {hasEnoughData && (
                <g>
                  <line
                    x1={scaleX(x1)}
                    y1={scaleY(y1)}
                    x2={scaleX(x2)}
                    y2={scaleY(y2)}
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Actual Recorded Data Points */}
              {dataPoints.map((pt, idx) => {
                const cx = scaleX(pt.x);
                const cy = scaleY(pt.y);
                const isHovered = hoveredPoint?.id === pt.id;

                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Outer glow ring on hover */}
                    {isHovered && (
                      <circle cx={cx} cy={cy} r="10" fill="#4f46e5" fillOpacity="0.25" />
                    )}
                    {/* Data point circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? '6' : '4.5'}
                      fill="#ffffff"
                      stroke="#4f46e5"
                      strokeWidth="2"
                    />
                    <circle cx={cx} cy={cy} r="2" fill="#4f46e5" />

                    {/* Point Label */}
                    <text
                      x={cx + 7}
                      y={cy - 6}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="#1e293b"
                    >
                      P{idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hovered Point Callout */}
          {hoveredPoint && (
            <div className="mt-2 text-xs font-mono bg-slate-900 text-white px-3.5 py-1.5 rounded-lg shadow-sm">
              Point: {currentConfig.xAxisLabel} = {getXY(hoveredPoint).x.toFixed(2)} {currentConfig.xAxisUnit},{' '}
              {currentConfig.yAxisLabel} = {getXY(hoveredPoint).y.toFixed(3)} {currentConfig.yAxisUnit}{' '}
              (V = {hoveredPoint.voltage.toFixed(2)}V, I = {hoveredPoint.current.toFixed(3)}A, R = {hoveredPoint.resistance.toFixed(1)}Ω)
            </div>
          )}

          {/* Insufficient Data Warning Banner */}
          {!hasEnoughData && (
            <div className="mt-3 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Record at least 3 observations in {currentConfig.shortName} to plot the best-fit line.</strong> Currently {dataPoints.length} logged.
              </span>
            </div>
          )}

          <div className="mt-2 text-[11px] text-slate-500 font-mono text-center">
            * {currentConfig.slopeExplanation}
          </div>
        </div>

        {/* Right: Mathematical Analysis & Formal Experimental Conclusion (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Analytical Calculation Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs">
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold mb-3 flex items-center justify-between">
              <span>Mathematical Slope Analysis</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Least-Squares Method
              </span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Fitted Line Equation */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Best-Fit Line Equation:</div>
                  <div className="text-indigo-300 text-sm font-bold mt-0.5">
                    {mode === 'find-current' ? 'I' : 'V'} = ({slope.toFixed(4)}) &middot;{' '}
                    {mode === 'find-current' ? 'V' : mode === 'find-resistance' ? 'I' : 'R'}{' '}
                    {intercept >= 0 ? `+ ${intercept.toFixed(3)}` : `- ${Math.abs(intercept).toFixed(3)}`}
                  </div>
                </div>

                {/* Slope and R2 Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Slope (ΔY / ΔX):</div>
                    <div className="text-emerald-400 text-sm font-bold mt-0.5">
                      {slope.toFixed(4)} {currentConfig.slopeUnit}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Correlation R²:</div>
                    <div className="text-emerald-400 text-sm font-bold mt-0.5">
                      {rSquared.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Derived Physical Quantity */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{derivedQuantityLabel}:</span>
                  <span className="text-base font-bold text-amber-300 font-mono">
                    {derivedQuantityValue} {derivedUnit}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 font-mono">
                Log at least 3 trials in {currentConfig.shortName} to evaluate the mathematical slope and R² fit.
              </div>
            )}
          </div>

          {/* Formal Experimental Conclusion Card */}
          <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Experimental Conclusion</span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                <p className="font-semibold text-emerald-950 leading-relaxed">
                  "{interpretationSentence}"
                </p>

                <div className="p-3 rounded-lg bg-white border border-emerald-200 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected Mode:</span>
                    <span className="font-bold text-slate-900">{currentConfig.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{currentConfig.slopeLabel}:</span>
                    <span className="font-bold text-indigo-700">
                      {slope.toFixed(4)} {currentConfig.slopeUnit}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Goodness-of-Fit (R²):</span>
                    <span className="font-bold text-emerald-700">{(rSquared * 100).toFixed(2)}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  The linear correlation coefficient of {rSquared.toFixed(4)} demonstrates that experimental points lie along a straight line, verifying Ohm's Law relationship under controlled conditions.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Log at least 3 trials for {currentConfig.shortName} to view the automated graph interpretation and experimental result verification report.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
