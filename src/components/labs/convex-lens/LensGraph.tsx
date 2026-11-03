import React, { useState, useMemo } from 'react';
import { ConvexLensObservation } from '../../../types';
import { LineChart, CheckCircle2, AlertCircle, RotateCcw, Target } from 'lucide-react';

interface LensGraphProps {
  observations: ConvexLensObservation[];
  theoreticalFocalLength: number; // 20.0 cm
}

export const LensGraph: React.FC<LensGraphProps> = ({
  observations,
  theoreticalFocalLength = 20.0,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ConvexLensObservation | null>(null);

  // Require at least 2 observations for a best-fit straight line
  const hasEnoughData = observations.length >= 2;

  // Best-fit straight line: 1/v = m_fit * (1/u) + c_fit
  // X = 1/u (negative cm⁻¹), Y = 1/v (positive cm⁻¹)
  const lineFit = useMemo(() => {
    if (!hasEnoughData) return null;

    const n = observations.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (const obs of observations) {
      const x = obs.oneOverU;
      const y = obs.oneOverV;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) < 1e-12) {
      return { m: 1.0, c: 1 / theoreticalFocalLength, minX: -0.045, maxX: -0.015 };
    }

    const m = (n * sumXY - sumX * sumY) / denominator;
    const c = (sumY - m * sumX) / n;

    const xVals = observations.map((d) => d.oneOverU);
    const minX = Math.min(...xVals);
    const maxX = Math.max(...xVals);

    return { m, c, minX, maxX };
  }, [observations, hasEnoughData, theoreticalFocalLength]);

  // Two selectable points on the best-fit line: normalized positions [0, 1] across domain
  const [posRatioA, setPosRatioA] = useState<number>(0.2);
  const [posRatioB, setPosRatioB] = useState<number>(0.8);

  // Coordinate mapping bounds for SVG Graph
  // Domain for 1/u (X): [-0.05, 0.00] cm⁻¹
  // Range for 1/v (Y): [0.00, 0.06] cm⁻¹
  const minX = -0.05;
  const maxX = 0.00;
  const minY = 0.00;
  const maxY = 0.06;

  // Point selection domain along best-fit line
  const domainMin = lineFit ? Math.max(minX + 0.005, lineFit.minX * 1.1) : -0.045;
  const domainMax = lineFit ? Math.min(-0.005, lineFit.maxX * 0.9) : -0.015;
  const domainSpan = domainMax - domainMin;

  // Raw coordinates
  const rawPtA_oneOverU = domainMin + posRatioA * domainSpan;
  const rawPtA_oneOverV = lineFit ? lineFit.m * rawPtA_oneOverU + lineFit.c : 1.0 * rawPtA_oneOverU + (1 / theoreticalFocalLength);

  const rawPtB_oneOverU = domainMin + posRatioB * domainSpan;
  const rawPtB_oneOverV = lineFit ? lineFit.m * rawPtB_oneOverU + lineFit.c : 1.0 * rawPtB_oneOverU + (1 / theoreticalFocalLength);

  // Formatted displayed coordinates (4 decimals for 1/u and 1/v in cm⁻¹)
  const ptA_X_disp = Number(rawPtA_oneOverU.toFixed(4));
  const ptA_Y_disp = Number(rawPtA_oneOverV.toFixed(4));

  const ptB_X_disp = Number(rawPtB_oneOverU.toFixed(4));
  const ptB_Y_disp = Number(rawPtB_oneOverV.toFixed(4));

  // Differences computed directly from displayed coordinates for 100% numerical consistency
  const deltaX = Number((ptB_X_disp - ptA_X_disp).toFixed(4));
  const deltaY = Number((ptB_Y_disp - ptA_Y_disp).toFixed(4));
  const isZeroDivision = Math.abs(deltaX) < 1e-7;

  // Slope: m = Δ(1/v) / Δ(1/u)
  const calculatedSlope = !isZeroDivision ? deltaY / deltaX : 1.0;

  // Y-intercept calculation: c = Y₁ − m · X₁
  const calculatedIntercept = Number((ptA_Y_disp - calculatedSlope * ptA_X_disp).toFixed(4));

  // Experimental focal length f = 1 / intercept
  const experimentalF = calculatedIntercept > 0.001 ? 1 / calculatedIntercept : null;
  const percentageError =
    experimentalF !== null
      ? (Math.abs(experimentalF - theoreticalFocalLength) / theoreticalFocalLength) * 100
      : null;

  // SVG dimensions
  const graphWidth = 560;
  const graphHeight = 350;
  const padding = { top: 30, right: 35, bottom: 50, left: 65 };

  const plotWidth = graphWidth - padding.left - padding.right;
  const plotHeight = graphHeight - padding.top - padding.bottom;

  const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (y: number) => padding.top + plotHeight - ((y - minY) / (maxY - minY)) * plotHeight;

  // Best-fit line coordinates across domain
  const regLineStartX = minX + 0.005;
  const regLineStartY = lineFit
    ? lineFit.m * regLineStartX + lineFit.c
    : 1.0 * regLineStartX + 0.05;

  const regLineEndX = maxX;
  const regLineEndY = lineFit ? lineFit.c : 0.05;

  // Pixel coordinates for Point A (Blue), Point B (Orange), and triangle corner
  const pxA = { x: scaleX(ptA_X_disp), y: scaleY(ptA_Y_disp) };
  const pxB = { x: scaleX(ptB_X_disp), y: scaleY(ptB_Y_disp) };
  const pxCorner = { x: scaleX(ptB_X_disp), y: scaleY(ptA_Y_disp) };

  const resetToRecommendedPoints = () => {
    setPosRatioA(0.2);
    setPosRatioB(0.8);
  };

  return (
    <div id="lens-graph-analysis-card" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>Traditional Two-Point Slope Practical Method</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Determination of Focal Length &bull; 1/v versus 1/u Graph
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Plotting reciprocal image distance (1/v) against reciprocal object distance (1/u). Select two well-separated points on the best-fit line to calculate slope m and Y-intercept c = 1/f.
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
              <span>Need &ge; 2 Readings</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left = SVG Plot, Right = Standardized 6-Step Calculation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        
        {/* Left: SVG Canvas (Span 7) */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
            <span className="font-bold text-slate-800">Coordinate Plot: 1/v (cm⁻¹) vs 1/u (cm⁻¹)</span>
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
            <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full max-w-[560px] h-auto select-none">
              <defs>
                <linearGradient id="lensSlopeTriangleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
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

              {/* Horizontal Grid lines (Y = 0.01, 0.02, 0.03, 0.04, 0.05, 0.06) */}
              {[0.01, 0.02, 0.03, 0.04, 0.05, 0.06].map((val) => {
                const yPos = scaleY(val);
                return (
                  <g key={`ygrid-${val}`}>
                    <line
                      x1={padding.left}
                      y1={yPos}
                      x2={padding.left + plotWidth}
                      y2={yPos}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <line
                      x1={padding.left - 5}
                      y1={yPos}
                      x2={padding.left}
                      y2={yPos}
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 8}
                      y={yPos + 3}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      +{val.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Vertical Grid lines (X = -0.05, -0.04, -0.03, -0.02, -0.01, 0.00) */}
              {[-0.05, -0.04, -0.03, -0.02, -0.01, 0.00].map((val) => {
                const xPos = scaleX(val);
                return (
                  <g key={`xgrid-${val}`}>
                    <line
                      x1={xPos}
                      y1={padding.top}
                      x2={xPos}
                      y2={padding.top + plotHeight}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <line
                      x1={xPos}
                      y1={padding.top + plotHeight}
                      x2={xPos}
                      y2={padding.top + plotHeight + 5}
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    <text
                      x={xPos}
                      y={padding.top + plotHeight + 16}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {val === 0 ? '0' : val.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Solid Axes lines */}
              <line
                x1={padding.left}
                y1={scaleY(0)}
                x2={padding.left + plotWidth}
                y2={scaleY(0)}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1={scaleX(0)}
                y1={padding.top}
                x2={scaleX(0)}
                y2={padding.top + plotHeight}
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Axis Titles */}
              <text
                x={padding.left + plotWidth / 2}
                y={graphHeight - 8}
                fill="#334155"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                1/u (cm⁻¹) &rarr; Reciprocal Object Distance
              </text>

              <text
                x={18}
                y={padding.top + plotHeight / 2}
                fill="#334155"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-90 18 ${padding.top + plotHeight / 2})`}
              >
                1/v (cm⁻¹) &rarr; Reciprocal Image Distance
              </text>

              {/* Theoretical Line of Fit (Reference: slope = 1, intercept = 1/20 = 0.05) */}
              <line
                x1={scaleX(-0.045)}
                y1={scaleY(-0.045 + 0.05)}
                x2={scaleX(0.00)}
                y2={scaleY(0.05)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.7"
              />

              {/* Best-Fit Straight Line (Indigo Solid) */}
              {hasEnoughData && (
                <line
                  x1={scaleX(regLineStartX)}
                  y1={scaleY(regLineStartY)}
                  x2={scaleX(regLineEndX)}
                  y2={scaleY(regLineEndY)}
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
              )}

              {/* Right-Angled Slope Triangle between Point A (Blue) and Point B (Orange) */}
              {hasEnoughData && !isZeroDivision && (
                <g className="slope-triangle">
                  <polygon
                    points={`${pxA.x},${pxA.y} ${pxCorner.x},${pxCorner.y} ${pxB.x},${pxB.y}`}
                    fill="url(#lensSlopeTriangleGrad2)"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Horizontal Guide: Δ(1/u) (Blue dashed) */}
                  <line
                    x1={pxA.x}
                    y1={pxA.y}
                    x2={pxCorner.x}
                    y2={pxCorner.y}
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Vertical Guide: Δ(1/v) (Orange dashed) */}
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

                  {/* Labels */}
                  <text
                    x={(pxA.x + pxCorner.x) / 2}
                    y={pxCorner.y + 14}
                    fill="#1d4ed8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Δ(1/u) = {deltaX.toFixed(4)}
                  </text>

                  <text
                    x={pxCorner.x + 8}
                    y={(pxCorner.y + pxB.y) / 2 + 3}
                    fill="#c2410c"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    Δ(1/v) = {deltaY.toFixed(4)}
                  </text>
                </g>
              )}

              {/* Y-intercept marker (0, c = 1/f) */}
              <circle
                cx={scaleX(0)}
                cy={scaleY(calculatedIntercept)}
                r="4.5"
                fill="#ea580c"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={scaleX(0) - 10}
                y={scaleY(calculatedIntercept) - 6}
                fill="#c2410c"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="end"
              >
                c = 1/f ({calculatedIntercept.toFixed(4)})
              </text>

              {/* Data Points from Observations */}
              {observations.map((obs, idx) => {
                const cx = scaleX(obs.oneOverU);
                const cy = scaleY(obs.oneOverV);

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
                      x={cx}
                      y={cy - 7}
                      fill="#475569"
                      fontSize="8.5"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
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
                  <circle cx={pxA.x} cy={pxA.y} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
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
                    A ({ptA_X_disp.toFixed(4)}, {ptA_Y_disp.toFixed(4)})
                  </text>
                </g>
              )}

              {/* Point B Marker (Orange) */}
              {hasEnoughData && (
                <g>
                  <circle cx={pxB.x} cy={pxB.y} r="8" fill="#ea580c" fillOpacity="0.3" />
                  <circle cx={pxB.x} cy={pxB.y} r="4.5" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
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
                    B ({ptB_X_disp.toFixed(4)}, {ptB_Y_disp.toFixed(4)})
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
                      Point A (1/u₁, 1/v₁): ({ptA_X_disp.toFixed(4)}, {ptA_Y_disp.toFixed(4)})
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
                      Point B (1/u₂, 1/v₂): ({ptB_X_disp.toFixed(4)}, {ptB_Y_disp.toFixed(4)})
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
                <span className="font-bold">Reading #{hoveredPoint.trialNo}:</span>
                <span>u = {hoveredPoint.u} cm</span>
                <span>v = {hoveredPoint.v} cm</span>
                <span className="font-bold">f = {hoveredPoint.focalLength.toFixed(2)} cm</span>
              </div>
            ) : (
              <div className="text-slate-500">
                Hover over data points to inspect experimental values
              </div>
            )}
            <div className="text-slate-400 text-[11px]">
              Dashed line: Theoretical reference (f = {theoreticalFocalLength} cm)
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
                    <span className="text-blue-400 font-semibold">Point A (X₁, Y₁):</span>
                    <span className="font-bold text-white">
                      ({ptA_X_disp.toFixed(4)}, {ptA_Y_disp.toFixed(4)})
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-orange-400 font-semibold">Point B (X₂, Y₂):</span>
                    <span className="font-bold text-white">
                      ({ptB_X_disp.toFixed(4)}, {ptB_Y_disp.toFixed(4)})
                    </span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                    <span>Δ(1/u) = {deltaX.toFixed(4)} cm⁻¹</span>
                    <span>Δ(1/v) = {deltaY.toFixed(4)} cm⁻¹</span>
                  </div>
                </div>

                {/* 2. Slope Formula */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold">2. Lens Equation Linear Form:</div>
                  <div className="text-indigo-300 text-sm font-bold">
                    1/v = m · (1/u) + c &nbsp;(where c = 1/f)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Slope (m) = [(1/v)₂ − (1/v)₁] / [(1/u)₂ − (1/u)₁] = Δ(1/v) / Δ(1/u)
                  </div>
                </div>

                {/* 3. Numerical Substitution */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold">3. Numerical Substitution:</div>
                  <div className="text-slate-300">
                    m = ({ptB_Y_disp.toFixed(4)} − {ptA_Y_disp.toFixed(4)}) / ({ptB_X_disp.toFixed(4)} − {ptA_X_disp.toFixed(4)})
                  </div>
                  <div className="text-emerald-400 font-bold">
                    m = {deltaY.toFixed(4)} / {deltaX.toFixed(4)}
                  </div>
                </div>

                {/* 4. Final Calculated Slope */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-bold">4. Final Calculated Slope:</span>
                  <span className="text-emerald-400 text-sm font-bold">
                    m = {calculatedSlope.toFixed(3)} <span className="text-[11px] text-slate-400 font-normal">(Theory = 1.000)</span>
                  </span>
                </div>

                {/* 5. Physical Interpretation */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-sans">
                  <div className="text-slate-400 text-[11px] font-bold font-mono">5. Physical Interpretation:</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The thin lens equation <strong className="font-mono text-white">1/v − 1/u = 1/f</strong> rearranges to the linear equation <strong className="font-mono text-white">1/v = 1·(1/u) + (1/f)</strong>. The slope <strong className="font-mono text-indigo-300">m = 1.0</strong> confirms the lens formula, and the Y-intercept directly represents <strong className="font-mono text-emerald-300">c = 1/f</strong>.
                  </p>
                  <div className="pt-1 text-xs text-slate-300 font-mono">
                    c = Y₁ − m · X₁ = <strong>{calculatedIntercept.toFixed(4)} cm⁻¹</strong>
                  </div>
                </div>

                {/* 6. Final Experimental Result */}
                <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-emerald-300 text-[10px] font-bold uppercase font-mono">
                        6. Final Experimental Result:
                      </div>
                      <div className="text-white font-bold text-sm">
                        Focal Length (f = 1 / Intercept c)
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-300 font-mono">
                      {experimentalF !== null ? `+${experimentalF.toFixed(2)} cm` : '—'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200 font-mono">
                    <span>Theoretical f: +{theoreticalFocalLength.toFixed(2)} cm</span>
                    {percentageError !== null && (
                      <span className="font-bold">Deviation: {percentageError.toFixed(2)}%</span>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <p>Record at least 2 optical bench readings to draw the best-fit line and calculate slope.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
