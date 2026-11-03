import React, { useState, useMemo } from 'react';
import { PendulumObservation } from '../../../types';
import { LineChart, CheckCircle2, AlertCircle, RotateCcw, Target } from 'lucide-react';

interface TLGraphProps {
  observations: PendulumObservation[];
  theoreticalG?: number;
}

export const TLGraph: React.FC<TLGraphProps> = ({
  observations,
  theoreticalG = 9.81,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<PendulumObservation | null>(null);

  // Require at least 2 observations for a best-fit straight line
  const hasEnoughData = observations.length >= 2;

  // Best-fit straight line parameters: T² = m_fit * L + c_fit
  const lineFit = useMemo(() => {
    if (!hasEnoughData) return null;
    const n = observations.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    observations.forEach((pt) => {
      const x = pt.length;
      const y = pt.periodSquared;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) < 1e-9) {
      return { m: 4.02, c: 0, minX: 0.2, maxX: 1.0 };
    }

    const m = (n * sumXY - sumX * sumY) / denominator;
    const c = (sumY - m * sumX) / n;

    const xVals = observations.map((d) => d.length);
    const minX = Math.min(...xVals);
    const maxX = Math.max(...xVals);

    return { m, c, minX, maxX };
  }, [observations, hasEnoughData]);

  // Two selectable points on the best-fit line: normalized positions [0, 1] across domain
  const [posRatioA, setPosRatioA] = useState<number>(0.2);
  const [posRatioB, setPosRatioB] = useState<number>(0.8);

  // Graph coordinate bounds
  const maxL = Math.max(1.2, ...observations.map((o) => o.length * 1.25));
  const maxT2 = Math.max(4.0, ...observations.map((o) => o.periodSquared * 1.25));

  const domainMin = lineFit ? Math.max(0, lineFit.minX * 0.75) : 0;
  const domainMax = lineFit ? Math.max(lineFit.maxX * 1.05, domainMin + 0.5) : 1.2;
  const domainSpan = domainMax - domainMin;

  // Raw coordinates
  const rawPtA_L = domainMin + posRatioA * domainSpan;
  const rawPtA_T2 = lineFit ? lineFit.m * rawPtA_L + lineFit.c : 0;

  const rawPtB_L = domainMin + posRatioB * domainSpan;
  const rawPtB_T2 = lineFit ? lineFit.m * rawPtB_L + lineFit.c : 0;

  // Displayed formatted coordinates (3 decimals for length, 3 decimals for T²)
  const ptA_L_disp = Number(rawPtA_L.toFixed(3));
  const ptA_T2_disp = Number(rawPtA_T2.toFixed(3));

  const ptB_L_disp = Number(rawPtB_L.toFixed(3));
  const ptB_T2_disp = Number(rawPtB_T2.toFixed(3));

  // Differences computed directly from displayed coordinates for 100% numerical consistency
  const deltaL = Number((ptB_L_disp - ptA_L_disp).toFixed(3));
  const deltaT2 = Number((ptB_T2_disp - ptA_T2_disp).toFixed(3));
  const isZeroDivision = Math.abs(deltaL) < 1e-6;

  // Slope: m = ΔT² / ΔL
  const calculatedSlope = !isZeroDivision ? deltaT2 / deltaL : 0;

  // Calculation of g: g = 4π² / slope
  const fourPiSq = 4 * Math.PI * Math.PI; // ~39.4784
  const experimentalG = calculatedSlope > 0.001 ? fourPiSq / calculatedSlope : null;
  const percentageError =
    experimentalG !== null ? (Math.abs(experimentalG - theoreticalG) / theoreticalG) * 100 : null;

  // SVG viewport dimensions
  const width = 560;
  const height = 350;
  const padding = { top: 30, right: 30, bottom: 50, left: 65 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => padding.left + (val / maxL) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - (val / maxT2) * plotHeight;

  // Grid ticks
  const numTicks = 5;
  const xTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxL * i) / numTicks);
  const yTicks = Array.from({ length: numTicks + 1 }, (_, i) => (maxT2 * i) / numTicks);

  // Pixel coordinates for best-fit line
  const lineStartCanvas = lineFit ? { x: scaleX(0), y: scaleY(lineFit.c) } : { x: 0, y: 0 };
  const lineEndCanvas = lineFit
    ? { x: scaleX(maxL), y: scaleY(lineFit.m * maxL + lineFit.c) }
    : { x: 0, y: 0 };

  // Pixel coordinates for Point A (Blue), Point B (Orange), and triangle corner
  const pxA = { x: scaleX(ptA_L_disp), y: scaleY(ptA_T2_disp) };
  const pxB = { x: scaleX(ptB_L_disp), y: scaleY(ptB_T2_disp) };
  const pxCorner = { x: scaleX(ptB_L_disp), y: scaleY(ptA_T2_disp) };

  const resetToRecommendedPoints = () => {
    setPosRatioA(0.2);
    setPosRatioB(0.8);
  };

  return (
    <div id="pendulum-graph-analysis-card" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>Traditional Two-Point Slope Practical Method</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Determination of 'g' from T² versus L Graph
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Plotting Time Period Squared (T²) against Length (L). Select two well-separated points on the best-fit line to calculate slope m = &Delta;T² / &Delta;L, then deduce g = 4&pi;² / m.
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
              <span>Best-Fit Line Active ({observations.length} points)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Need &ge; 2 Points</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left = SVG Plot, Right = Standardized 6-Step Calculation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        
        {/* Left: SVG Canvas (Span 7) */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
            <span className="font-bold text-slate-800">Cartesian Plot: T² (s²) vs L (m)</span>
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
                <linearGradient id="pendulumSlopeTriangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                      {xVal.toFixed(2)}
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
                Length of Pendulum L (m)
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
                Time Period Squared T² (s²)
              </text>

              {/* Theoretical line (m = 4π²/9.81 ≈ 4.025 s²/m, dashed amber) */}
              <line
                x1={scaleX(0)}
                y1={scaleY(0)}
                x2={scaleX(maxL)}
                y2={scaleY((fourPiSq / theoreticalG) * maxL)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.7"
              />

              {/* Best-Fit Straight Line (Indigo Solid) */}
              {hasEnoughData && lineFit && (
                <line
                  x1={lineStartCanvas.x}
                  y1={lineStartCanvas.y}
                  x2={lineEndCanvas.x}
                  y2={lineEndCanvas.y}
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
              )}

              {/* Right-Angled Slope Triangle between Point A (Blue) and Point B (Orange) */}
              {hasEnoughData && !isZeroDivision && (
                <g className="slope-triangle">
                  <polygon
                    points={`${pxA.x},${pxA.y} ${pxCorner.x},${pxCorner.y} ${pxB.x},${pxB.y}`}
                    fill="url(#pendulumSlopeTriangleGrad)"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Horizontal Guide: ΔL (Blue dashed) */}
                  <line
                    x1={pxA.x}
                    y1={pxA.y}
                    x2={pxCorner.x}
                    y2={pxCorner.y}
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Vertical Guide: ΔT² (Orange dashed) */}
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

                  {/* ΔL Label */}
                  <text
                    x={(pxA.x + pxCorner.x) / 2}
                    y={pxCorner.y + 14}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#1d4ed8"
                  >
                    ΔL = {deltaL.toFixed(3)} m
                  </text>

                  {/* ΔT² Label */}
                  <text
                    x={pxCorner.x + 8}
                    y={(pxCorner.y + pxB.y) / 2 + 3}
                    textAnchor="start"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#c2410c"
                  >
                    ΔT² = {deltaT2.toFixed(3)} s²
                  </text>
                </g>
              )}

              {/* Actual Experimental Observation Points */}
              {observations.map((obs, idx) => {
                const cx = scaleX(obs.length);
                const cy = scaleY(obs.periodSquared);

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
                    A ({ptA_L_disp.toFixed(2)}, {ptA_T2_disp.toFixed(2)})
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
                    B ({ptB_L_disp.toFixed(2)}, {ptB_T2_disp.toFixed(2)})
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
                      Point A (L₁, T₁²): ({ptA_L_disp.toFixed(3)} m, {ptA_T2_disp.toFixed(3)} s²)
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
                      Point B (L₂, T₂²): ({ptB_L_disp.toFixed(3)} m, {ptB_T2_disp.toFixed(3)} s²)
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
                <span className="font-bold">Reading #{hoveredPoint.srNo}:</span>
                <span>L = {hoveredPoint.length.toFixed(2)} m</span>
                <span>T = {hoveredPoint.period.toFixed(3)} s</span>
                <span className="font-bold">T² = {hoveredPoint.periodSquared.toFixed(3)} s²</span>
              </div>
            ) : (
              <div className="text-slate-500">
                Hover over data points to inspect experimental values
              </div>
            )}
            <div className="text-slate-400 text-[11px]">
              Dashed line: Theoretical reference (g = {theoreticalG} m/s²)
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
                    <span className="text-blue-400 font-semibold">Point A (L₁, T₁²):</span>
                    <span className="font-bold text-white">
                      ({ptA_L_disp.toFixed(3)} m, {ptA_T2_disp.toFixed(3)} s²)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-orange-400 font-semibold">Point B (L₂, T₂²):</span>
                    <span className="font-bold text-white">
                      ({ptB_L_disp.toFixed(3)} m, {ptB_T2_disp.toFixed(3)} s²)
                    </span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                    <span>ΔL = L₂ − L₁ = {deltaL.toFixed(3)} m</span>
                    <span>ΔT² = T₂² − T₁² = {deltaT2.toFixed(3)} s²</span>
                  </div>
                </div>

                {/* 2. Slope Formula */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold">2. Slope Formula:</div>
                  <div className="text-indigo-300 text-sm font-bold">
                    m = (T₂² − T₁²) / (L₂ − L₁) = ΔT² / ΔL
                  </div>
                  <div className="text-[11px] text-slate-400">
                    From T = 2π√(L/g) &rArr; T² = (4π²/g) · L
                  </div>
                </div>

                {/* 3. Numerical Substitution */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold">3. Numerical Substitution:</div>
                  <div className="text-slate-300">
                    m = ({ptB_T2_disp.toFixed(3)} − {ptA_T2_disp.toFixed(3)}) / ({ptB_L_disp.toFixed(3)} − {ptA_L_disp.toFixed(3)})
                  </div>
                  <div className="text-emerald-400 font-bold">
                    m = {deltaT2.toFixed(3)} / {deltaL.toFixed(3)}
                  </div>
                </div>

                {/* 4. Final Calculated Slope */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-bold">4. Final Calculated Slope:</span>
                  <span className="text-emerald-400 text-sm font-bold">
                    m = {calculatedSlope.toFixed(4)} s²/m
                  </span>
                </div>

                {/* 5. Physical Interpretation */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-sans">
                  <div className="text-slate-400 text-[11px] font-bold font-mono">5. Physical Interpretation:</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    According to simple harmonic motion theory, <strong className="font-mono text-white">T² = (4π²/g) · L</strong>. The slope represents <strong className="font-mono text-indigo-300">m = 4π²/g</strong>. Rearranging gives <strong className="font-mono text-emerald-300">g = 4π² / m</strong>.
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
                        Acceleration Due to Gravity (g = 4π² / m)
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-300 font-mono">
                      {experimentalG !== null ? `${experimentalG.toFixed(2)} m/s²` : '—'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200 font-mono">
                    <span>Theoretical g: {theoreticalG.toFixed(2)} m/s²</span>
                    {percentageError !== null && (
                      <span className="font-bold">Deviation: {percentageError.toFixed(2)}%</span>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <p>Record at least 2 pendulum length observations to draw the best-fit line and calculate slope.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
