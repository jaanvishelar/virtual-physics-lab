import React, { useState } from 'react';
import { PendulumObservation } from '../../../types';
import { LineChart, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface TLGraphProps {
  observations: PendulumObservation[];
  theoreticalG?: number;
}

export const TLGraph: React.FC<TLGraphProps> = ({
  observations,
  theoreticalG = 9.81
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<PendulumObservation | null>(null);

  // Require at least 2 observations for regression line
  const hasEnoughData = observations.length >= 2;

  // Linear Regression Calculation for T² vs L:
  // X = Length L (m), Y = T² (s²)
  // y = mx + c
  let slope = 0;
  let intercept = 0;
  let rSquared = 1.0;
  let experimentalG: number | null = null;
  let percentageError: number | null = null;

  if (hasEnoughData) {
    const n = observations.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    observations.forEach((pt) => {
      const x = pt.length;
      const y = pt.periodSquared;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
    });

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) > 0.000001) {
      slope = (n * sumXY - sumX * sumY) / denominator;
      intercept = (sumY - slope * sumX) / n;

      // Pearson r²
      const numeratorR = n * sumXY - sumX * sumY;
      const denomR = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      if (denomR > 0) {
        const r = numeratorR / denomR;
        rSquared = Math.min(1.0, Math.max(0.0, r * r));
      }

      // g = 4π² / slope
      if (slope > 0.001) {
        const fourPiSq = 4 * Math.PI * Math.PI; // ~39.4784
        experimentalG = fourPiSq / slope;
        percentageError = (Math.abs(experimentalG - theoreticalG) / theoreticalG) * 100;
      }
    }
  }

  // Determine graph bounds
  const maxL = Math.max(1.2, ...observations.map((o) => o.length * 1.25));
  const maxT2 = Math.max(4.0, ...observations.map((o) => o.periodSquared * 1.25));

  // SVG viewport dimensions
  const width = 560;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => padding.left + (val / maxL) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - (val / maxT2) * plotHeight;

  // Grid tick marks
  const numTicks = 5;
  const xTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxL * i) / numTicks);
  const yTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxT2 * i) / numTicks);

  // Best-fit line coordinates
  const lineX1 = 0;
  const lineY1 = intercept;
  const lineX2 = maxL;
  const lineY2 = slope * maxL + intercept;

  // Theoretical line: T² = (4π² / 9.81) * L ≈ 4.024 * L
  const theoreticalSlope = (4 * Math.PI * Math.PI) / theoreticalG;
  const theoX2 = maxL;
  const theoY2 = theoreticalSlope * maxL;

  return (
    <div id="graph-analysis-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>Graphical Determination of g &bull; T² vs L</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            T² versus L Dynamic Graph &amp; Least-Squares Regression
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Plotting Time Period Squared T² (Y-axis) against Effective Length L (X-axis) to evaluate g from slope.
          </p>
        </div>

        {hasEnoughData && (
          <div className="shrink-0 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Regression Model Active (N = {observations.length})</span>
          </div>
        )}
      </div>

      {/* Main Grid: SVG Graph + Analytical Calculations & Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left: SVG Graph Canvas (Span 7) */}
        <div className="lg:col-span-7 bg-slate-50/80 rounded-xl p-3 sm:p-4 border border-slate-200 relative flex flex-col items-center">
          
          <div className="w-full aspect-[14/9] max-h-[380px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
              aria-label="T² versus L experimental graph"
            >
              {/* Grid Lines */}
              <g opacity="0.6">
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

              {/* Main Axes */}
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

              {/* Ticks and Labels: X-Axis (Length L in m) */}
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
                    fill="#475569"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {xVal.toFixed(2)}
                  </text>
                </g>
              ))}

              {/* Ticks and Labels: Y-Axis (T² in s²) */}
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
                    y={scaleY(yVal) + 4}
                    textAnchor="end"
                    fill="#475569"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {yVal.toFixed(1)}
                  </text>
                </g>
              ))}

              {/* Axis Titles */}
              <text
                x={padding.left + plotWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                Length L (m)
              </text>

              <text
                x={-padding.top - plotHeight / 2}
                y={18}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
                transform="rotate(-90)"
              >
                Time Period Squared T² (s²)
              </text>

              {/* Theoretical Reference Line (Faint guide) */}
              <line
                x1={scaleX(0)}
                y1={scaleY(0)}
                x2={scaleX(theoX2)}
                y2={scaleY(theoY2)}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Experimental Best-Fit Line (Least-Squares) */}
              {hasEnoughData && (
                <line
                  x1={scaleX(lineX1)}
                  y1={scaleY(lineY1)}
                  x2={scaleX(lineX2)}
                  y2={scaleY(lineY2)}
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Plotted Experimental Observations */}
              {observations.map((obs) => {
                const cx = scaleX(obs.length);
                const cy = scaleY(obs.periodSquared);
                const isHovered = hoveredPoint?.id === obs.id;

                return (
                  <g
                    key={obs.id}
                    onMouseEnter={() => setHoveredPoint(obs)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer transition-all"
                  >
                    {/* Pulsing ring on hover */}
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="12"
                        fill="#818cf8"
                        fillOpacity="0.3"
                      />
                    )}
                    {/* Outer border circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6"
                      fill="#ffffff"
                      stroke="#4338ca"
                      strokeWidth="2.5"
                    />
                    {/* Inner core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="2.5"
                      fill="#4338ca"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600 border-2 border-white inline-block shadow-xs" />
              <span className="text-slate-700">Recorded Observations (L, T²)</span>
            </div>
            {hasEnoughData && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-indigo-600 inline-block" />
                <span className="text-slate-700">Best-Fit Line (T² = mL + c)</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t border-slate-400 border-dashed inline-block" />
              <span className="text-slate-400">Theoretical Slope (4π²/9.81)</span>
            </div>
          </div>

          {/* Hovered Point Callout */}
          {hoveredPoint && (
            <div className="mt-2 text-xs font-mono bg-slate-900 text-white px-3 py-1 rounded-lg shadow-sm">
              Point: L = {hoveredPoint.length.toFixed(2)} m, T² = {hoveredPoint.periodSquared.toFixed(3)} s² (T = {hoveredPoint.period.toFixed(3)} s, N = {hoveredPoint.oscillations})
            </div>
          )}

          {/* Insufficient Data Notice */}
          {!hasEnoughData && (
            <div className="mt-3 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Record at least 2 observations to generate the experimental graph and slope line.</strong> Currently {observations.length} recorded.
              </span>
            </div>
          )}

          <div className="mt-2 text-[11px] text-slate-500 font-mono text-center">
            * Linear relationship: T² = (4π²/g)L &rarr; Slope m = 4π²/g &rarr; g = 4π²/m.
          </div>
        </div>

        {/* Right: Least-Squares Analysis & Experimental Result Card (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Least-Squares Slope Analysis Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs">
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold mb-3 flex items-center justify-between">
              <span>Least-Squares Regression Analysis</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                y = T², x = L
              </span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Best-Fit Equation */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Best-Fit Line Equation:</div>
                  <div className="text-indigo-300 text-sm font-bold mt-0.5">
                    T² = ({slope.toFixed(3)}) &middot; L {intercept >= 0 ? `+ ${intercept.toFixed(3)}` : `- ${Math.abs(intercept).toFixed(3)}`}
                  </div>
                </div>

                {/* Slope & R² */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Slope m (s²/m):</div>
                    <div className="text-emerald-400 text-sm font-bold mt-0.5">
                      {slope.toFixed(3)}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Correlation R²:</div>
                    <div className="text-emerald-400 text-sm font-bold mt-0.5">
                      {rSquared.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Theoretical derivation note */}
                <div className="p-2 rounded-lg bg-slate-950/70 text-[10px] text-slate-400 border border-slate-800 space-y-0.5">
                  <div>T² = (4π²/g)L  &rarr;  m = 4π²/g</div>
                  <div className="text-indigo-300 font-semibold">g = 4π² / slope = 39.4784 / {slope.toFixed(3)}</div>
                </div>

                {/* Experimental g from slope */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Experimental g:</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {experimentalG !== null ? `${experimentalG.toFixed(2)} m/s²` : '—'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 font-mono">
                Awaiting at least 2 observations to compute regression line and slope.
              </div>
            )}
          </div>

          {/* Experimental Result Card */}
          <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Experimental Result</span>
            </div>

            {hasEnoughData && experimentalG !== null ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                <p className="font-semibold text-emerald-950 leading-relaxed">
                  "The value of acceleration due to gravity was determined from the slope of the T²–L graph."
                </p>

                <div className="p-3 rounded-lg bg-white border border-emerald-200 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Theoretical g:</span>
                    <span className="font-bold text-slate-900">{theoreticalG.toFixed(2)} m/s²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Experimental g (4π² / slope):</span>
                    <span className="font-bold text-indigo-700">{experimentalG.toFixed(2)} m/s²</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Percentage Error:</span>
                    <span className="font-bold text-emerald-700">
                      {percentageError !== null ? `${percentageError.toFixed(2)}%` : '—'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  The linear relationship between length L and period squared T² confirms that <span className="font-mono font-bold">T² ∝ L</span> for small angular amplitudes, and the slope accurately determines Earth’s gravitational acceleration.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Log at least 2 readings across different lengths (e.g., 0.40 m, 0.60 m, 0.80 m) to compute the regression slope and view the acceleration due to gravity result report.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
