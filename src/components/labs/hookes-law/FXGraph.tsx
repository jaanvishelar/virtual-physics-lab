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

  // Raw coordinates
  const rawPtA_x = domainMin + posRatioA * domainSpan;
  const rawPtA_F = lineFit ? lineFit.m * rawPtA_x + lineFit.c : 0;

  const rawPtB_x = domainMin + posRatioB * domainSpan;
  const rawPtB_F = lineFit ? lineFit.m * rawPtB_x + lineFit.c : 0;

  // Formatted displayed coordinates (3 decimals for extension in m, 2 decimals for Force in N)
  const ptA_x_disp = Number(rawPtA_x.toFixed(3));
  const ptA_F_disp = Number(rawPtA_F.toFixed(2));

  const ptB_x_disp = Number(rawPtB_x.toFixed(3));
  const ptB_F_disp = Number(rawPtB_F.toFixed(2));

  // Differences computed directly from displayed coordinates for 100% numerical consistency
  const deltaX = Number((ptB_x_disp - ptA_x_disp).toFixed(3));
  const deltaF = Number((ptB_F_disp - ptA_F_disp).toFixed(2));
  const isZeroDivision = Math.abs(deltaX) < 1e-6;

  // Slope m = ΔF / Δx
  const calculatedSlope = !isZeroDivision ? deltaF / deltaX : 0;
  const experimentalK = calculatedSlope > 0.001 ? calculatedSlope : null;
  const percentageError =
    experimentalK !== null ? (Math.abs(experimentalK - theoreticalK) / theoreticalK) * 100 : null;

  // SVG viewport dimensions
  const width = 560;
  const height = 350;
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

  // Pixel coordinates for Point A (Blue), Point B (Orange), and triangle vertex
  const pxA = { x: scaleX(ptA_x_disp), y: scaleY(ptA_F_disp) };
  const pxB = { x: scaleX(ptB_x_disp), y: scaleY(ptB_F_disp) };
  const pxCorner = { x: scaleX(ptB_x_disp), y: scaleY(ptA_F_disp) };

  // Theoretical line
  const theoX2 = maxX;
  const theoY2 = theoreticalK * maxX;

  const resetToRecommendedPoints = () => {
    setPosRatioA(0.2);
    setPosRatioB(0.8);
  };

  return (
    <div id="hooke-graph-analysis-card" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
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
            Plotting applied force (F = mg) against measured extension (x). Select two well-separated points on the best-fit line to calculate slope m = &Delta;F / &Delta;x, which directly gives the spring constant k.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {hasEnoughData && (
            <button
              onClick={resetToRecommendedPoints}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
              title="Reset to recommended well-separated points"
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

      {/* Main Grid: Left = SVG Plot, Right = Standardized 6-Step Calculation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        
        {/* Left: SVG Canvas (Span 7) */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
            <span className="font-bold text-slate-800">Cartesian Plot: Applied Force F (N) vs Extension x (m)</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                Observations
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block" />
                Best-Fit Line
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                Point A
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                Point B
              </span>
            </div>
          </div>

          {/* SVG Plot */}
          <div className="w-full relative flex items-center justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[560px] h-auto select-none">
              <defs>
                <linearGradient id="hookeSlopeTriangleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Background Canvas */}
              <rect
                x={padding.left}
                y={padding.top}
                width={plotWidth}
                height={plotHeight}
                fill="#ffffff"
                stroke="#cbd5e1"
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
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <line
                      x1={xPx}
                      y1={padding.top + plotHeight}
                      x2={xPx}
                      y2={padding.top + plotHeight + 5}
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    <text
                      x={xPx}
                      y={padding.top + plotHeight + 18}
                      textAnchor="middle"
                      fill="#64748b"
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
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <line
                      x1={padding.left - 5}
                      y1={yPx}
                      x2={padding.left}
                      y2={yPx}
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 8}
                      y={yPx + 3.5}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      {yVal.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Axes lines */}
              <line
                x1={padding.left}
                y1={padding.top + plotHeight}
                x2={padding.left + plotWidth}
                y2={padding.top + plotHeight}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + plotHeight}
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* X-Axis Label */}
              <text
                x={padding.left + plotWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fill="#334155"
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
                fill="#334155"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Applied Force F (N)
              </text>

              {/* Theoretical line (F = 20 * x, dashed amber) */}
              <line
                x1={scaleX(0)}
                y1={scaleY(0)}
                x2={scaleX(theoX2)}
                y2={scaleY(theoY2)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.7"
              />

              {/* Best-Fit Straight Line (Indigo Solid) */}
              {hasEnoughData && (
                <line
                  x1={scaleX(lineX1)}
                  y1={scaleY(lineY1)}
                  x2={scaleX(lineX2)}
                  y2={scaleY(lineY2)}
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
              )}

              {/* Right-Angled Slope Triangle between Point A (Blue) and Point B (Orange) */}
              {hasEnoughData && !isZeroDivision && (
                <g className="slope-triangle">
                  <polygon
                    points={`${pxA.x},${pxA.y} ${pxCorner.x},${pxCorner.y} ${pxB.x},${pxB.y}`}
                    fill="url(#hookeSlopeTriangleGrad2)"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Horizontal Guide: Δx (Blue dashed) */}
                  <line
                    x1={pxA.x}
                    y1={pxA.y}
                    x2={pxCorner.x}
                    y2={pxCorner.y}
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Vertical Guide: ΔF (Orange dashed) */}
                  <line
                    x1={pxCorner.x}
                    y1={pxCorner.y}
                    x2={pxB.x}
                    y2={pxB.y}
                    stroke="#ea580c"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Corner right angle */}
                  <rect
                    x={pxCorner.x - 7}
                    y={pxCorner.y - 7}
                    width="7"
                    height="7"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1"
                  />

                  {/* Δx Label */}
                  <text
                    x={(pxA.x + pxCorner.x) / 2}
                    y={pxCorner.y + 14}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#1d4ed8"
                  >
                    Δx = {deltaX.toFixed(3)} m
                  </text>

                  {/* ΔF Label */}
                  <text
                    x={pxCorner.x + 8}
                    y={(pxCorner.y + pxB.y) / 2 + 3}
                    textAnchor="start"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#c2410c"
                  >
                    ΔF = {deltaF.toFixed(2)} N
                  </text>
                </g>
              )}

              {/* Actual Experimental Observation Points */}
              {observations.map((obs, idx) => {
                const cx = scaleX(obs.extensionMeters);
                const cy = scaleY(obs.force);

                return (
                  <g
                    key={obs.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(obs)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle cx={cx} cy={cy} r="4.5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                    <circle cx={cx} cy={cy} r="2" fill="#4f46e5" />
                    <text
                      x={cx + 6}
                      y={cy - 5}
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="#475569"
                    >
                      #{idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* Point A Marker (Blue) */}
              {hasEnoughData && (
                <g>
                  <circle cx={pxA.x} cy={pxA.y} r="8" fill="#2563eb" fillOpacity="0.3" />
                  <circle cx={pxA.x} cy={pxA.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  <rect
                    x={pxA.x - 30}
                    y={pxA.y - 24}
                    width="60"
                    height="16"
                    rx="4"
                    fill="#1e3a8a"
                  />
                  <text
                    x={pxA.x}
                    y={pxA.y - 13}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    A ({ptA_x_disp.toFixed(3)}, {ptA_F_disp.toFixed(2)})
                  </text>
                </g>
              )}

              {/* Point B Marker (Orange) */}
              {hasEnoughData && (
                <g>
                  <circle cx={pxB.x} cy={pxB.y} r="8" fill="#ea580c" fillOpacity="0.3" />
                  <circle cx={pxB.x} cy={pxB.y} r="5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                  <rect
                    x={pxB.x - 30}
                    y={pxB.y - 24}
                    width="60"
                    height="16"
                    rx="4"
                    fill="#7c2d12"
                  />
                  <text
                    x={pxB.x}
                    y={pxB.y - 13}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    B ({ptB_x_disp.toFixed(3)}, {ptB_F_disp.toFixed(2)})
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Sliders for Adjusting Point A and Point B on the Line */}
          {hasEnoughData && (
            <div className="w-full mt-3 p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  Adjust Point Positions Along Best-Fit Line:
                </span>
                <span className="text-[11px] text-slate-500">
                  Select well-separated points to minimize reading errors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Point A Slider (Blue) */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-blue-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      Point A (x₁, F₁): ({ptA_x_disp.toFixed(3)} m, {ptA_F_disp.toFixed(2)} N)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.48"
                    step="0.01"
                    value={posRatioA}
                    onChange={(e) => setPosRatioA(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-label="Adjust position of Point A along best-fit line"
                  />
                </div>

                {/* Point B Slider (Orange) */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-orange-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-600 inline-block" />
                      Point B (x₂, F₂): ({ptB_x_disp.toFixed(3)} m, {ptB_F_disp.toFixed(2)} N)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.52"
                    max="0.95"
                    step="0.01"
                    value={posRatioB}
                    onChange={(e) => setPosRatioB(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    aria-label="Adjust position of Point B along best-fit line"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hovered Point Inspection */}
          <div className="w-full mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
            {hoveredPoint ? (
              <div className="text-indigo-700 flex items-center gap-2">
                <span className="font-bold">Trial #{hoveredPoint.srNo}:</span>
                <span>x = {hoveredPoint.extensionMeters.toFixed(4)} m</span>
                <span>F = {hoveredPoint.force.toFixed(2)} N</span>
                <span className="font-bold">m = {hoveredPoint.massGrams} g</span>
              </div>
            ) : (
              <div className="text-slate-500">
                Hover over data points to inspect experimental values
              </div>
            )}
            <div className="text-slate-400 text-[11px]">
              Dashed line: Theoretical reference (k = {theoreticalK} N/m)
            </div>
          </div>
        </div>

        {/* Right: Standardized 6-Step Two-Point Slope Calculation Panel (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span>Two-Point Slope Calculation</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Physics Practical Method
              </span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 font-mono text-xs">
                
                {/* 1. Selected Points */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 text-[11px] font-bold">1. Selected Points on Best-Fit Line:</div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-blue-400 font-semibold">Point A (x₁, F₁):</span>
                    <span className="font-bold text-white">
                      ({ptA_x_disp.toFixed(3)} m, {ptA_F_disp.toFixed(2)} N)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-orange-400 font-semibold">Point B (x₂, F₂):</span>
                    <span className="font-bold text-white">
                      ({ptB_x_disp.toFixed(3)} m, {ptB_F_disp.toFixed(2)} N)
                    </span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                    <span>Δx = x₂ − x₁ = {deltaX.toFixed(3)} m</span>
                    <span>ΔF = F₂ − F₁ = {deltaF.toFixed(2)} N</span>
                  </div>
                </div>

                {/* 2. Slope Formula */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold">2. Slope Formula:</div>
                  <div className="text-indigo-300 text-sm font-bold">
                    m = (F₂ − F₁) / (x₂ − x₁) = ΔF / Δx
                  </div>
                  <div className="text-[11px] text-slate-400">
                    From Hooke's Law: F = kx
                  </div>
                </div>

                {/* 3. Numerical Substitution */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold">3. Numerical Substitution:</div>
                  <div className="text-slate-300">
                    m = ({ptB_F_disp.toFixed(2)} − {ptA_F_disp.toFixed(2)}) / ({ptB_x_disp.toFixed(3)} − {ptA_x_disp.toFixed(3)})
                  </div>
                  <div className="text-emerald-400 font-bold">
                    m = {deltaF.toFixed(2)} / {deltaX.toFixed(3)}
                  </div>
                </div>

                {/* 4. Final Calculated Slope */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-bold">4. Final Calculated Slope:</span>
                  <span className="text-emerald-400 text-sm font-bold">
                    m = {calculatedSlope.toFixed(2)} N/m
                  </span>
                </div>

                {/* 5. Physical Interpretation */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-sans">
                  <div className="text-slate-400 text-[11px] font-bold font-mono">5. Physical Interpretation:</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Under Hooke's Law within elastic limits, applied force is directly proportional to extension (<strong className="font-mono text-white">F = kx</strong>). The slope <strong className="font-mono text-indigo-300">m = ΔF/Δx</strong> directly represents the <strong className="font-mono text-emerald-300">spring constant k</strong>.
                  </p>
                </div>

                {/* 6. Final Experimental Result */}
                <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-emerald-300 text-[10px] font-bold uppercase font-mono">
                        6. Final Experimental Result:
                      </div>
                      <div className="text-white font-bold text-sm">
                        Spring Constant (k = Slope m)
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-300 font-mono">
                      {experimentalK !== null ? `${experimentalK.toFixed(2)} N/m` : '—'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200 font-mono">
                    <span>Theoretical k: {theoreticalK.toFixed(2)} N/m</span>
                    {percentageError !== null && (
                      <span className="font-bold">Deviation: {percentageError.toFixed(2)}%</span>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <p>Record at least 2 load observations to draw the best-fit line and calculate slope.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
