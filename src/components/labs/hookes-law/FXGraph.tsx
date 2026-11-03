import React, { useState, useMemo } from 'react';
import { HookeObservation } from '../../../types';
import { LineChart, CheckCircle2, AlertCircle, RotateCcw, Target } from 'lucide-react';

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

  // Best-fit straight line calculation: F = m_fit * x + c_fit
  const lineFit = useMemo(() => {
    if (!hasEnoughData) return null;
    const n = validObservations.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    validObservations.forEach((pt) => {
      const x = pt.extensionMeters;
      const y = pt.force;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) < 1e-9) {
      return { m: theoreticalK, c: 0, minX: 0, maxX: 0.15 };
    }

    const m = (n * sumXY - sumX * sumY) / denominator;
    const c = (sumY - m * sumX) / n;

    const xVals = validObservations.map((d) => d.extensionMeters);
    const minX = Math.min(0, ...xVals);
    const maxX = Math.max(0.1, ...xVals);

    return { m, c, minX, maxX };
  }, [validObservations, hasEnoughData, theoreticalK]);

  // Two selectable points on the best-fit line: normalized positions [0, 1] across domain
  const [posRatioA, setPosRatioA] = useState<number>(0.2);
  const [posRatioB, setPosRatioB] = useState<number>(0.8);

  // Determine graph bounds
  const maxX = Math.max(0.20, ...observations.map((o) => o.extensionMeters * 1.3));
  const maxY = Math.max(4.0, ...observations.map((o) => o.force * 1.3));

  // Domain for point selection along the best-fit line
  const domainMin = lineFit ? Math.max(0, lineFit.minX) : 0;
  const domainMax = lineFit ? Math.max(lineFit.maxX * 1.05, 0.12) : 0.20;
  const domainSpan = domainMax - domainMin;

  // Actual coordinates of Point A (x₁, F₁) and Point B (x₂, F₂) on the best-fit line
  const ptA_x = domainMin + posRatioA * domainSpan;
  const ptA_F = lineFit ? lineFit.m * ptA_x + lineFit.c : 0;

  const ptB_x = domainMin + posRatioB * domainSpan;
  const ptB_F = lineFit ? lineFit.m * ptB_x + lineFit.c : 0;

  // Traditional two-point slope calculation: m = (F₂ - F₁) / (x₂ - x₁)
  const deltaX = ptB_x - ptA_x;
  const deltaF = ptB_F - ptA_F;
  const isZeroDivision = Math.abs(deltaX) < 1e-6;

  const calculatedSlope = !isZeroDivision ? deltaF / deltaX : 0;
  const experimentalK = calculatedSlope > 0.001 ? calculatedSlope : null;
  const percentageError =
    experimentalK !== null ? (Math.abs(experimentalK - theoreticalK) / theoreticalK) * 100 : null;

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

  // Best-fit line endpoints
  const lineX1 = 0;
  const lineY1 = lineFit ? lineFit.c : 0;
  const lineX2 = maxX;
  const lineY2 = lineFit ? lineFit.m * maxX + lineFit.c : theoreticalK * maxX;

  // Pixel coordinates for Point A, Point B, and the slope triangle vertex
  const pxA = { x: scaleX(ptA_x), y: scaleY(ptA_F) };
  const pxB = { x: scaleX(ptB_x), y: scaleY(ptB_F) };
  const pxCorner = { x: scaleX(ptB_x), y: scaleY(ptA_F) };

  // Theoretical line
  const theoX2 = maxX;
  const theoY2 = theoreticalK * maxX;

  const resetToRecommendedPoints = () => {
    setPosRatioA(0.2);
    setPosRatioB(0.8);
  };

  return (
    <div id="hooke-graph-analysis-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>Traditional Two-Point Slope Practical Method</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Force F versus Extension x &bull; Determination of Spring Constant k
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Plotting applied force (F = mg) against extension (x). Select two well-separated points on the best-fit line to calculate slope m = &Delta;F / &Delta;x, which directly gives spring constant k.
          </p>
        </div>

        {/* Action Buttons & Status */}
        <div className="flex items-center gap-2 shrink-0">
          {hasEnoughData && (
            <button
              onClick={resetToRecommendedPoints}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
              title="Reset to recommended points"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Points</span>
            </button>
          )}
          {hasEnoughData ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Best-Fit Line Active ({validObservations.length} points)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Need &ge; 2 Non-Zero Points</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left = SVG Graph with Slope Triangle, Right = Analytical Results */}
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
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
                Selected Points
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
                <linearGradient id="hookePlotGridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="hookeSlopeTriangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.10" />
                </linearGradient>
              </defs>

              {/* Background */}
              <rect
                x={padding.left}
                y={padding.top}
                width={plotWidth}
                height={plotHeight}
                fill="url(#hookePlotGridGrad)"
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

              {/* Best-Fit Straight Line (indigo solid) */}
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

              {/* Traditional Practical Slope Triangle (Δx base, ΔF height) */}
              {hasEnoughData && !isZeroDivision && (
                <g className="slope-triangle">
                  {/* Shaded triangle area */}
                  <polygon
                    points={`${pxA.x},${pxA.y} ${pxCorner.x},${pxCorner.y} ${pxB.x},${pxB.y}`}
                    fill="url(#hookeSlopeTriangleGrad)"
                    stroke="#ec4899"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Horizontal base: Δx */}
                  <line
                    x1={pxA.x}
                    y1={pxA.y}
                    x2={pxCorner.x}
                    y2={pxCorner.y}
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Vertical height: ΔF */}
                  <line
                    x1={pxCorner.x}
                    y1={pxCorner.y}
                    x2={pxB.x}
                    y2={pxB.y}
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Δx Label */}
                  <text
                    x={(pxA.x + pxCorner.x) / 2}
                    y={pxA.y + 14}
                    fill="#38bdf8"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    &Delta;x = {Math.abs(deltaX).toFixed(3)} m
                  </text>

                  {/* ΔF Label */}
                  <text
                    x={pxCorner.x + 8}
                    y={(pxCorner.y + pxB.y) / 2 + 3}
                    fill="#c084fc"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    &Delta;F = {Math.abs(deltaF).toFixed(2)} N
                  </text>
                </g>
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
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="11"
                        fill="#34d399"
                        opacity="0.3"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5.5"
                      fill="#065f46"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="2.5"
                      fill="#ecfdf5"
                    />
                  </g>
                );
              })}

              {/* Selected Two Points on Best-Fit Line (Point A and Point B) */}
              {hasEnoughData && (
                <g>
                  {/* Point A */}
                  <g className="cursor-pointer">
                    <circle
                      cx={pxA.x}
                      cy={pxA.y}
                      r="8"
                      fill="#ec4899"
                      opacity="0.3"
                    />
                    <circle
                      cx={pxA.x}
                      cy={pxA.y}
                      r="5"
                      fill="#ec4899"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={pxA.x}
                      y={pxA.y - 10}
                      fill="#f472b6"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      A ({ptA_x.toFixed(3)}, {ptA_F.toFixed(2)})
                    </text>
                  </g>

                  {/* Point B */}
                  <g className="cursor-pointer">
                    <circle
                      cx={pxB.x}
                      cy={pxB.y}
                      r="8"
                      fill="#a855f7"
                      opacity="0.3"
                    />
                    <circle
                      cx={pxB.x}
                      cy={pxB.y}
                      r="5"
                      fill="#a855f7"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={pxB.x}
                      y={pxB.y - 10}
                      fill="#c084fc"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      B ({ptB_x.toFixed(3)}, {ptB_F.toFixed(2)})
                    </text>
                  </g>
                </g>
              )}

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

          {/* Interactive Sliders to Choose Points on the Best-Fit Line */}
          {hasEnoughData && (
            <div className="w-full mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-pink-400" />
                  Select Two Points on the Best-Fit Line:
                </span>
                <span className="text-slate-400 text-[11px]">
                  Keep points well-separated for practical accuracy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Slider for Point A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-pink-400 font-bold">Point A (x₁, F₁)</span>
                    <span className="text-slate-300">
                      ({ptA_x.toFixed(3)} m, {ptA_F.toFixed(2)} N)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.45"
                    step="0.01"
                    value={posRatioA}
                    onChange={(e) => setPosRatioA(parseFloat(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
                  />
                </div>

                {/* Slider for Point B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-purple-400 font-bold">Point B (x₂, F₂)</span>
                    <span className="text-slate-300">
                      ({ptB_x.toFixed(3)} m, {ptB_F.toFixed(2)} N)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.55"
                    max="0.95"
                    step="0.01"
                    value={posRatioB}
                    onChange={(e) => setPosRatioB(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hovered Point Inspection Callout */}
          <div className="w-full mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            {hoveredPoint ? (
              <div className="text-emerald-400 flex items-center gap-2">
                <span>Trial #{hoveredPoint.srNo}:</span>
                <span className="text-white">x = {hoveredPoint.extensionMeters.toFixed(4)} m</span>
                <span className="text-sky-300">F = {hoveredPoint.force.toFixed(3)} N</span>
                <span className="text-yellow-300">m = {hoveredPoint.massGrams} g</span>
              </div>
            ) : (
              <div className="text-slate-500">
                Hover over data points to inspect experimental coordinates
              </div>
            )}
            <div className="text-slate-400 text-[11px]">
              Dashed amber line: Theoretical reference (k = {theoreticalK} N/m)
            </div>
          </div>
        </div>

        {/* Analytical Step-by-Step Practical Slope Panel (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Traditional Two-Point Slope Calculation Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 font-mono space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase text-slate-700">
                Two-Point Slope Calculation
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Practical Method
              </span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 text-xs">
                {/* Selected Points Coordinates */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                  <div>
                    <span className="text-[10px] text-pink-600 font-bold block">Point A (x₁, F₁):</span>
                    <span className="text-slate-900 font-bold text-[11px]">
                      ({ptA_x.toFixed(3)} m, {ptA_F.toFixed(2)} N)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 font-bold block">Point B (x₂, F₂):</span>
                    <span className="text-slate-900 font-bold text-[11px]">
                      ({ptB_x.toFixed(3)} m, {ptB_F.toFixed(2)} N)
                    </span>
                  </div>
                </div>

                {/* Slope Formula */}
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <div className="text-indigo-900 text-[11px] font-bold">Standard Slope Formula:</div>
                  <div className="text-xs font-bold text-indigo-800">
                    Slope (m) = (F₂ &minus; F₁) / (x₂ &minus; x₁) = &Delta;F / &Delta;x
                  </div>
                </div>

                {/* Step-by-Step Substitution */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="text-slate-500 text-[10px]">Step-by-Step Substitution:</div>
                  <div className="text-[11px] text-slate-800">
                    m = ({ptB_F.toFixed(2)} &minus; {ptA_F.toFixed(2)}) / ({ptB_x.toFixed(3)} &minus; {ptA_x.toFixed(3)})
                  </div>
                  <div className="text-[11px] text-slate-800">
                    m = {deltaF.toFixed(2)} N / {deltaX.toFixed(3)} m
                  </div>
                  <div className="text-sm font-bold text-indigo-700 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>Calculated Slope:</span>
                    <span>{calculatedSlope.toFixed(2)} N/m</span>
                  </div>
                </div>

                {/* Physical Deduction: Spring Constant k */}
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">
                    Physical Quantity Deduction:
                  </div>
                  <div className="text-xs text-emerald-950 font-sans">
                    Since <strong className="font-mono">F = k &bull; x</strong>, the slope <strong className="font-mono">&Delta;F / &Delta;x</strong> directly represents the spring constant <strong className="font-mono">k</strong>.
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-emerald-200 text-xs">
                    <span className="text-emerald-900 font-bold">Spring Constant (k):</span>
                    <span className="text-base font-bold text-emerald-800 font-mono">
                      {experimentalK !== null ? `${experimentalK.toFixed(2)} N/m` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 space-y-1">
                <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p>Record at least 2 non-zero load observations to plot the best-fit line and calculate slope.</p>
              </div>
            )}
          </div>

          {/* Theoretical vs Experimental Comparison Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 font-mono space-y-3">
            <div className="text-xs font-bold uppercase text-slate-600 border-b border-slate-100 pb-2">
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

          {/* Experimental Result Card */}
          {hasEnoughData && experimentalK !== null ? (
            <div id="hooke-result-card" className="p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Experimental Result</span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100 font-sans leading-relaxed">
                The Force&ndash;Extension relationship is linear within the elastic region, verifying Hooke's Law.
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
                Hooke's Law is verified using the traditional two-point slope practical method.
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
