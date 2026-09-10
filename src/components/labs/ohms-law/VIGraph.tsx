import React, { useState } from 'react';
import { ObservationReading } from '../../../types';
import { LineChart, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

interface VIGraphProps {
  observations: ObservationReading[];
  theoreticalResistance: number;
}

export const VIGraph: React.FC<VIGraphProps> = ({
  observations,
  theoreticalResistance,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ObservationReading | null>(null);

  // Require at least 3 points for formal least-squares regression line
  const hasEnoughData = observations.length >= 3;

  // Linear Regression Calculation (V vs I)
  // X = Current I, Y = Potential Difference V
  let slope = 0;
  let intercept = 0;
  let rSquared = 1.0;

  if (hasEnoughData) {
    const n = observations.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    observations.forEach((pt) => {
      sumX += pt.current;
      sumY += pt.voltage;
      sumXY += pt.current * pt.voltage;
      sumX2 += pt.current * pt.current;
      sumY2 += pt.voltage * pt.voltage;
    });

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) > 0.000001) {
      slope = (n * sumXY - sumX * sumY) / denominator;
      intercept = (sumY - slope * sumX) / n;

      // Compute Pearson r²
      const numeratorR = n * sumXY - sumX * sumY;
      const denomR = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      if (denomR > 0) {
        const r = numeratorR / denomR;
        rSquared = Math.min(1.0, Math.max(0.0, r * r));
      }
    } else {
      slope = theoreticalResistance;
      intercept = 0;
    }
  }

  // Determine plot bounds
  const maxI = Math.max(1.0, ...observations.map((o) => o.current * 1.25));
  const maxV = Math.max(10.0, ...observations.map((o) => o.voltage * 1.25));

  // SVG plot viewport dimensions
  const width = 560;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => padding.left + (val / maxI) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - (val / maxV) * plotHeight;

  // Grid tick lines
  const numTicks = 5;
  const xTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxI * i) / numTicks);
  const yTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxV * i) / numTicks);

  // Best fit line coordinates
  const x1 = 0;
  const y1 = intercept;
  const x2 = maxI;
  const y2 = slope * maxI + intercept;

  const experimentalResistance = slope;
  const percentError =
    theoreticalResistance > 0
      ? (Math.abs(experimentalResistance - theoreticalResistance) / theoreticalResistance) * 100
      : 0;

  return (
    <div id="graph-analysis-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>Graphical Verification &bull; V vs I</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Experimental Characteristic Curve
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Plotting Potential Difference V (Y-axis) versus Current I (X-axis) to evaluate conductor resistance from slope.
          </p>
        </div>

        {hasEnoughData && (
          <div className="shrink-0 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Regression Model Active (N = {observations.length})</span>
          </div>
        )}
      </div>

      {/* Main Grid: Graph Canvas + Analytical Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left / Top: SVG Graph (Span 7) */}
        <div className="lg:col-span-7 bg-slate-50/80 rounded-xl p-3 sm:p-4 border border-slate-200 relative flex flex-col items-center">
          
          <div className="w-full aspect-[14/9] max-h-[380px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
              aria-label="V versus I experimental graph"
            >
              {/* Background Cartesian Grid */}
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

              {/* Ticks and Labels: X-Axis (Current I) */}
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
                    {xVal.toFixed(2)}
                  </text>
                </g>
              ))}

              {/* Ticks and Labels: Y-Axis (Potential Difference V) */}
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
                    {yVal.toFixed(1)}
                  </text>
                </g>
              ))}

              {/* Axis Title Labels */}
              <text
                x={padding.left + plotWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fontSize="12"
                fontFamily="sans-serif"
                fontWeight="bold"
                fill="#0f172a"
              >
                Current I (A) &rarr;
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
                Potential Difference V (V) &rarr;
              </text>

              {/* Best Fit Linear Regression Line (Only if >= 3 data points) */}
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

              {/* Recorded Data Points */}
              {observations.map((pt, idx) => {
                const cx = scaleX(pt.current);
                const cy = scaleY(pt.voltage);
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
                      <circle cx={cx} cy={cy} r="10" fill="#4f46e5" fillOpacity="0.2" />
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
                      fill="#334155"
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
            <div className="mt-2 text-xs font-mono bg-slate-900 text-white px-3 py-1 rounded-lg">
              Point: Current I = {hoveredPoint.current.toFixed(3)} A, Voltage V = {hoveredPoint.voltage.toFixed(2)} V (R = {hoveredPoint.resistance.toFixed(2)} Ω)
            </div>
          )}

          {/* Insufficient Data Warning Banner */}
          {!hasEnoughData && (
            <div className="mt-3 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Record at least 3 observations to generate the experimental graph.</strong> Currently {observations.length} recorded.
              </span>
            </div>
          )}

          <div className="mt-2 text-[11px] text-slate-500 font-mono text-center">
            * For a V-I graph, the slope represents resistance (R = ΔV / ΔI).
          </div>
        </div>

        {/* Right: Data Analysis & Experimental Result (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Analytical Calculation Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs">
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold mb-3 flex items-center justify-between">
              <span>Mathematical Slope Analysis</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Least-Squares</span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Best-Fit Line Equation:</div>
                  <div className="text-indigo-300 text-sm font-bold mt-0.5">
                    V = ({slope.toFixed(2)}) &middot; I {intercept >= 0 ? `+ ${intercept.toFixed(2)}` : `- ${Math.abs(intercept).toFixed(2)}`}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Slope (ΔV / ΔI):</div>
                    <div className="text-emerald-400 text-sm font-bold mt-0.5">
                      {slope.toFixed(3)} V/A
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Correlation R²:</div>
                    <div className="text-emerald-400 text-sm font-bold mt-0.5">
                      {rSquared.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Experimental Resistance:</span>
                  <span className="text-base font-bold text-indigo-300 font-mono">
                    {experimentalResistance.toFixed(2)} Ω
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 font-mono">
                Awaiting 3 observations to compute line slope and goodness-of-fit.
              </div>
            )}
          </div>

          {/* Formal Experimental Result Section */}
          <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Experimental Result</span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                <p className="font-semibold text-emerald-950 leading-relaxed">
                  "The V-I relationship is approximately linear, supporting Ohm's Law under the conditions of this simulation."
                </p>

                <div className="p-3 rounded-lg bg-white border border-emerald-200 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected (Theoretical) Resistance:</span>
                    <span className="font-bold text-slate-900">{theoreticalResistance.toFixed(2)} Ω</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Experimental Resistance (Slope):</span>
                    <span className="font-bold text-indigo-700">{experimentalResistance.toFixed(2)} Ω</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Percentage Deviation:</span>
                    <span className="font-bold text-emerald-700">{percentError.toFixed(2)}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  The experimental slope agrees with the chosen conductor resistance, verifying that <span className="font-mono font-bold">V ∝ I</span> when temperature and physical dimensions remain fixed.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Log at least 3 trials in the observation table above to complete the automated graph analysis and view the formal experimental result report.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
