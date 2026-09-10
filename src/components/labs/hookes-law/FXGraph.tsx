import React, { useState } from 'react';
import { HookeObservation } from '../../../types';
import { LineChart, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface FXGraphProps {
  observations: HookeObservation[];
  theoreticalK?: number;
}

export const FXGraph: React.FC<FXGraphProps> = ({
  observations,
  theoreticalK = 20.0,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<HookeObservation | null>(null);

  // Filter observations: at least 2 non-zero points or 2 total points with distinct extension
  const validObservations = observations.filter((o) => o.extensionMeters > 0 || o.force > 0);
  const hasEnoughData = validObservations.length >= 2;

  // Linear Regression Calculation for F vs x:
  // X = Extension x (m), Y = Force F (N)
  // Equation: F = kx + c
  let slope = 0;
  let intercept = 0;
  let rSquared = 1.0;
  let experimentalK: number | null = null;
  let percentageError: number | null = null;

  if (hasEnoughData) {
    const n = validObservations.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    validObservations.forEach((pt) => {
      const x = pt.extensionMeters;
      const y = pt.force;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
    });

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) > 0.0000001) {
      slope = (n * sumXY - sumX * sumY) / denominator;
      intercept = (sumY - slope * sumX) / n;

      // Pearson r²
      const numeratorR = n * sumXY - sumX * sumY;
      const denomR = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      if (denomR > 0) {
        const r = numeratorR / denomR;
        rSquared = Math.min(1.0, Math.max(0.0, r * r));
      }

      if (slope > 0.001) {
        experimentalK = slope;
        percentageError = (Math.abs(experimentalK - theoreticalK) / theoreticalK) * 100;
      }
    }
  }

  // Determine graph bounds
  const maxX = Math.max(0.20, ...observations.map((o) => o.extensionMeters * 1.3));
  const maxY = Math.max(4.0, ...observations.map((o) => o.force * 1.3));

  // SVG viewport dimensions
  const width = 560;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 65 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => padding.left + (val / maxX) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - (val / maxY) * plotHeight;

  // Grid tick marks
  const numTicks = 5;
  const xTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxX * i) / numTicks);
  const yTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxY * i) / numTicks);

  // Best-fit line coordinates
  const lineX1 = 0;
  const lineY1 = intercept;
  const lineX2 = maxX;
  const lineY2 = slope * maxX + intercept;

  // Theoretical line: F = k_theoretical * x = 20 * x
  const theoX2 = maxX;
  const theoY2 = theoreticalK * maxX;

  return (
    <div id="hooke-graph-analysis-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>Graphical Determination of Spring Constant &bull; F vs x</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Force F versus Extension x Dynamic Graph &amp; Regression
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Plotting applied force (F = mg) against measured extension (x) verifies linear elasticity and yields spring constant k from slope.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {hasEnoughData ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Regression Solved ({validObservations.length} points)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Need &ge; 2 Non-Zero Points</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left = SVG Graph, Right = Analytical Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        
        {/* Graph SVG Plot (Span 7) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="text-slate-300 font-bold">Cartesian Plot: Force F vs Extension x</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                Data Points
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-indigo-400 inline-block" />
                Best-Fit Line
              </span>
            </div>
          </div>

          {/* SVG Plot */}
          <div className="w-full relative flex items-center justify-center">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full max-w-[560px] h-auto select-none"
            >
              <defs>
                <linearGradient id="plotGridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Background */}
              <rect
                x={padding.left}
                y={padding.top}
                width={plotWidth}
                height={plotHeight}
                fill="url(#plotGridGrad)"
                stroke="#334155"
                strokeWidth="1"
              />

              {/* Grid Lines & X-Ticks */}
              {xTicks.map((xVal, i) => {
                const xPx = scaleX(xVal);
                return (
                  <g key={`x-tick-${i}`}>
                    <line
                      x1={xPx}
                      y1={padding.top}
                      x2={xPx}
                      y2={padding.top + plotHeight}
                      stroke="#334155"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1={xPx}
                      y1={padding.top + plotHeight}
                      x2={xPx}
                      y2={padding.top + plotHeight + 5}
                      stroke="#64748b"
                      strokeWidth="1"
                    />
                    <text
                      x={xPx}
                      y={padding.top + plotHeight + 18}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      {xVal.toFixed(3)}
                    </text>
                  </g>
                );
              })}

              {/* Grid Lines & Y-Ticks */}
              {yTicks.map((yVal, i) => {
                const yPx = scaleY(yVal);
                return (
                  <g key={`y-tick-${i}`}>
                    <line
                      x1={padding.left}
                      y1={yPx}
                      x2={padding.left + plotWidth}
                      y2={yPx}
                      stroke="#334155"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1={padding.left - 5}
                      y1={yPx}
                      x2={padding.left}
                      y2={yPx}
                      stroke="#64748b"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 10}
                      y={yPx + 3.5}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      {yVal.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Theoretical Reference Line (dashed amber line) */}
              <line
                x1={scaleX(0)}
                y1={scaleY(0)}
                x2={scaleX(theoX2)}
                y2={scaleY(theoY2)}
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.65"
              />

              {/* Best-Fit Regression Line (indigo solid) */}
              {hasEnoughData && (
                <line
                  x1={scaleX(lineX1)}
                  y1={scaleY(lineY1)}
                  x2={scaleX(lineX2)}
                  y2={scaleY(lineY2)}
                  stroke="#818cf8"
                  strokeWidth="2.5"
                />
              )}

              {/* Observed Experimental Points */}
              {observations.map((obs) => {
                const cx = scaleX(obs.extensionMeters);
                const cy = scaleY(obs.force);
                const isHovered = hoveredPoint?.id === obs.id;

                return (
                  <g
                    key={obs.id}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(obs)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Outer pulse circle on hover */}
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="11"
                        fill="#34d399"
                        opacity="0.3"
                      />
                    )}
                    {/* Outer ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5.5"
                      fill="#065f46"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    {/* Inner core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="2.5"
                      fill="#ecfdf5"
                    />
                  </g>
                );
              })}

              {/* X-Axis Label */}
              <text
                x={padding.left + plotWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Extension x (m)
              </text>

              {/* Y-Axis Label */}
              <text
                x={-padding.top - plotHeight / 2}
                y="18"
                transform="rotate(-90)"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Applied Force F (N)
              </text>
            </svg>
          </div>

          {/* Hovered Point Inspection Callout */}
          <div className="w-full mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            {hoveredPoint ? (
              <div className="text-emerald-400 flex items-center gap-2">
                <span>Trial #{hoveredPoint.srNo}:</span>
                <span className="text-white">x = {hoveredPoint.extensionMeters.toFixed(4)} m</span>
                <span className="text-sky-300">F = {hoveredPoint.force.toFixed(3)} N</span>
                <span className="text-yellow-300">m = {hoveredPoint.massGrams} g</span>
              </div>
            ) : (
              <div className="text-slate-500">
                Hover over any experimental point to inspect exact coordinates
              </div>
            )}
            <div className="text-slate-400 text-[11px]">
              Dashed amber line: Theoretical reference (k = {theoreticalK} N/m)
            </div>
          </div>
        </div>

        {/* Analytical Regression & Result Breakdown (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Least-Squares Regression Summary Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 font-mono space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase text-slate-500">
                Least-Squares Regression
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Linear Model: F = kx + c
              </span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Best-Fit Line Equation:</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    F = {slope.toFixed(2)} &bull; x {intercept >= 0 ? `+ ${intercept.toFixed(3)}` : `- ${Math.abs(intercept).toFixed(3)}`}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                  <div>
                    <div className="text-slate-500 text-[11px]">Graph Slope (m):</div>
                    <div className="text-sm font-bold text-indigo-600">
                      {slope.toFixed(2)} <span className="text-[10px] text-slate-500">N/m</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Correlation (R²):</div>
                    <div className="text-sm font-bold text-emerald-600">
                      {rSquared.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <div className="text-slate-500 text-[11px]">Physical Slope Meaning:</div>
                  <div className="text-[11px] text-slate-700 mt-0.5">
                    Since <span className="font-bold text-slate-900">F = kx</span>, the slope <span className="font-bold text-indigo-600">ΔF/Δx = k</span> directly yields the spring constant.
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 space-y-1">
                <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <p>Record at least 2 non-zero load observations to evaluate the regression slope.</p>
              </div>
            )}
          </div>

          {/* Theoretical vs Experimental Comparison Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 font-mono space-y-3">
            <div className="text-xs font-bold uppercase text-slate-500 border-b border-slate-100 pb-2">
              Theoretical Reference &amp; Error Analysis
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-400 text-[10px]">Theoretical k:</div>
                <div className="text-base font-bold text-slate-700 mt-0.5">
                  {theoreticalK.toFixed(2)} <span className="text-[10px]">N/m</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="text-indigo-600 text-[10px]">Experimental k:</div>
                <div className="text-base font-bold text-indigo-700 mt-0.5">
                  {experimentalK !== null ? `${experimentalK.toFixed(2)} N/m` : '—'}
                </div>
              </div>
            </div>

            {percentageError !== null && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                <span className="text-emerald-800">Percentage Deviation:</span>
                <span className="font-bold text-emerald-700">
                  {percentageError.toFixed(2)}%
                </span>
              </div>
            )}
          </div>

          {/* 12. EXPERIMENTAL RESULT CARD */}
          {hasEnoughData && experimentalK !== null ? (
            <div id="hooke-result-card" className="p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Experimental Result</span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100 font-sans leading-relaxed">
                The Force–Extension relationship is approximately linear within the simulated elastic region, supporting Hooke's Law.
              </p>

              <div className="pt-2 border-t border-emerald-800/80 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-emerald-300">Theoretical Spring Constant:</span>
                  <span className="font-bold text-white">{theoreticalK.toFixed(2)} N/m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Experimental Spring Constant:</span>
                  <span className="font-bold text-white">{experimentalK.toFixed(2)} N/m</span>
                </div>
                {percentageError !== null && (
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Percentage Error:</span>
                    <span className="font-bold text-emerald-200">{percentageError.toFixed(2)}%</span>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] font-sans text-emerald-300">
                Hooke's Law is verified within the elastic range represented by this simulation.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-sans text-center">
              Complete at least two trial recordings with different loads to finalize the experimental deduction.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
