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

  // Actual coordinates of Point A (X₁, Y₁) and Point B (X₂, Y₂) on the best-fit line
  const ptA_oneOverU = domainMin + posRatioA * domainSpan;
  const ptA_oneOverV = lineFit ? lineFit.m * ptA_oneOverU + lineFit.c : 1.0 * ptA_oneOverU + (1 / theoreticalFocalLength);

  const ptB_oneOverU = domainMin + posRatioB * domainSpan;
  const ptB_oneOverV = lineFit ? lineFit.m * ptB_oneOverU + lineFit.c : 1.0 * ptB_oneOverU + (1 / theoreticalFocalLength);

  // Traditional two-point slope calculation: m = (Y₂ - Y₁) / (X₂ - X₁)
  const deltaX = ptB_oneOverU - ptA_oneOverU;
  const deltaY = ptB_oneOverV - ptA_oneOverV;
  const isZeroDivision = Math.abs(deltaX) < 1e-7;

  const calculatedSlope = !isZeroDivision ? deltaY / deltaX : 1.0;

  // Y-intercept calculation from two-point method: c = Y₁ - m * X₁
  const calculatedIntercept = ptA_oneOverV - calculatedSlope * ptA_oneOverU;

  // Experimental focal length f = 1 / intercept
  const experimentalF = calculatedIntercept > 0.001 ? 1 / calculatedIntercept : null;
  const percentageError =
    experimentalF !== null
      ? (Math.abs(experimentalF - theoreticalFocalLength) / theoreticalFocalLength) * 100
      : null;

  // SVG dimensions
  const graphWidth = 600;
  const graphHeight = 340;
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

  // Pixel coordinates for Point A, Point B, and the slope triangle vertex
  const pxA = { x: scaleX(ptA_oneOverU), y: scaleY(ptA_oneOverV) };
  const pxB = { x: scaleX(ptB_oneOverU), y: scaleY(ptB_oneOverV) };
  const pxCorner = { x: scaleX(ptB_oneOverU), y: scaleY(ptA_oneOverV) };

  const resetToRecommendedPoints = () => {
    setPosRatioA(0.2);
    setPosRatioB(0.8);
  };

  return (
    <div id="lens-graph-analysis-section" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>Traditional Two-Point Slope Practical Method</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Determination of Focal Length &bull; 1/v versus 1/u Graph
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Plotting reciprocal image distance (1/v) against reciprocal object distance (1/u). Select two points on the best-fit line to calculate slope m and Y-intercept c = 1/f.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SVG Plot Column (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-inner select-none flex flex-col justify-between">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="text-slate-300 font-bold">Cartesian Plot: 1/v vs 1/u</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                Observations
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

          <div className="w-full relative flex items-center justify-center">
            <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-auto block">
              <defs>
                <linearGradient id="lensSlopeTriangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.10" />
                </linearGradient>
              </defs>

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
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
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
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
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

              {/* Solid Coordinate Axes */}
              {/* X-axis (Y = 0) */}
              <line
                x1={padding.left}
                y1={scaleY(0)}
                x2={padding.left + plotWidth}
                y2={scaleY(0)}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              {/* Y-axis (X = 0, at right edge of negative domain) */}
              <line
                x1={scaleX(0)}
                y1={padding.top}
                x2={scaleX(0)}
                y2={padding.top + plotHeight}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Axis Titles */}
              <text
                x={padding.left + plotWidth / 2}
                y={graphHeight - 8}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                1/u (cm⁻¹) &rarr; Signed Object Distance
              </text>

              <text
                x={18}
                y={padding.top + plotHeight / 2}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-90 18 ${padding.top + plotHeight / 2})`}
              >
                1/v (cm⁻¹) &rarr; Signed Image Distance
              </text>

              {/* Theoretical Line of Fit (Reference: slope = 1, intercept = 1/20 = 0.05) */}
              <line
                x1={scaleX(-0.045)}
                y1={scaleY(-0.045 + 0.05)}
                x2={scaleX(0.00)}
                y2={scaleY(0.05)}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.5"
              />

              {/* Best-Fit Line from Recorded Data */}
              {hasEnoughData && (
                <line
                  x1={scaleX(regLineStartX)}
                  y1={scaleY(regLineStartY)}
                  x2={scaleX(regLineEndX)}
                  y2={scaleY(regLineEndY)}
                  stroke="#818cf8"
                  strokeWidth="2.5"
                />
              )}

              {/* Traditional Practical Slope Triangle */}
              {hasEnoughData && !isZeroDivision && (
                <g className="slope-triangle">
                  <polygon
                    points={`${pxA.x},${pxA.y} ${pxCorner.x},${pxCorner.y} ${pxB.x},${pxB.y}`}
                    fill="url(#lensSlopeTriangleGrad)"
                    stroke="#ec4899"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Horizontal base: Δ(1/u) */}
                  <line
                    x1={pxA.x}
                    y1={pxA.y}
                    x2={pxCorner.x}
                    y2={pxCorner.y}
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Vertical height: Δ(1/v) */}
                  <line
                    x1={pxCorner.x}
                    y1={pxCorner.y}
                    x2={pxB.x}
                    y2={pxB.y}
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Labels */}
                  <text
                    x={(pxA.x + pxCorner.x) / 2}
                    y={pxA.y + 14}
                    fill="#38bdf8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    &Delta;(1/u) = {Math.abs(deltaX).toFixed(4)}
                  </text>

                  <text
                    x={pxCorner.x + 8}
                    y={(pxCorner.y + pxB.y) / 2 + 3}
                    fill="#c084fc"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    &Delta;(1/v) = {Math.abs(deltaY).toFixed(4)}
                  </text>
                </g>
              )}

              {/* Y-intercept marker (0, 1/f) */}
              <circle
                cx={scaleX(0)}
                cy={scaleY(calculatedIntercept)}
                r="4.5"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={scaleX(0) - 10}
                y={scaleY(calculatedIntercept) - 6}
                fill="#ec4899"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="end"
              >
                Intercept c = {calculatedIntercept.toFixed(4)} cm⁻¹
              </text>

              {/* Data Points from Observations */}
              {observations.map((obs, idx) => {
                const cx = scaleX(obs.oneOverU);
                const cy = scaleY(obs.oneOverV);
                const isHovered = hoveredPoint?.id === obs.id;

                return (
                  <g
                    key={obs.id}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(obs)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {isHovered && (
                      <circle cx={cx} cy={cy} r="8" fill="#818cf8" opacity="0.4" />
                    )}
                    <circle cx={cx} cy={cy} r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                    <text
                      x={cx}
                      y={cy - 8}
                      fill="#cbd5e1"
                      fontSize="8.5"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      #{idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* Selected Two Points on Best-Fit Line (Point A and Point B) */}
              {hasEnoughData && (
                <g>
                  {/* Point A */}
                  <g>
                    <circle cx={pxA.x} cy={pxA.y} r="7" fill="#ec4899" opacity="0.3" />
                    <circle cx={pxA.x} cy={pxA.y} r="4.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={pxA.x}
                      y={pxA.y - 9}
                      fill="#f472b6"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      A ({ptA_oneOverU.toFixed(4)}, {ptA_oneOverV.toFixed(4)})
                    </text>
                  </g>

                  {/* Point B */}
                  <g>
                    <circle cx={pxB.x} cy={pxB.y} r="7" fill="#a855f7" opacity="0.3" />
                    <circle cx={pxB.x} cy={pxB.y} r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={pxB.x}
                      y={pxB.y - 9}
                      fill="#c084fc"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      B ({ptB_oneOverU.toFixed(4)}, {ptB_oneOverV.toFixed(4)})
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Sliders to Choose Points on the Best-Fit Line */}
          {hasEnoughData && (
            <div className="w-full mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
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
                    <span className="text-pink-400 font-bold">Point A (1/u₁, 1/v₁)</span>
                    <span className="text-slate-300">
                      ({ptA_oneOverU.toFixed(4)}, {ptA_oneOverV.toFixed(4)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.45"
                    step="0.01"
                    value={posRatioA}
                    onChange={(e) => setPosRatioA(parseFloat(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>

                {/* Slider for Point B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-purple-400 font-bold">Point B (1/u₂, 1/v₂)</span>
                    <span className="text-slate-300">
                      ({ptB_oneOverU.toFixed(4)}, {ptB_oneOverV.toFixed(4)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.55"
                    max="0.95"
                    step="0.01"
                    value={posRatioB}
                    onChange={(e) => setPosRatioB(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hovered Point Inspection Callout */}
          <div className="w-full mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            {hoveredPoint ? (
              <div className="text-sky-400 flex items-center gap-2">
                <span>Reading #{hoveredPoint.trialNo}:</span>
                <span className="text-white">u = {hoveredPoint.u} cm</span>
                <span className="text-emerald-300">v = {hoveredPoint.v} cm</span>
                <span className="text-yellow-300">f = {hoveredPoint.focalLength.toFixed(2)} cm</span>
              </div>
            ) : (
              <div className="text-slate-500">
                Hover over data points to inspect experimental coordinates
              </div>
            )}
            <div className="text-slate-400 text-[11px]">
              Dashed line: Theoretical Model (f = {theoreticalFocalLength} cm)
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
                    <span className="text-[10px] text-pink-600 font-bold block">Point A (X₁, Y₁):</span>
                    <span className="text-slate-900 font-bold text-[11px]">
                      ({ptA_oneOverU.toFixed(4)}, {ptA_oneOverV.toFixed(4)})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-600 font-bold block">Point B (X₂, Y₂):</span>
                    <span className="text-slate-900 font-bold text-[11px]">
                      ({ptB_oneOverU.toFixed(4)}, {ptB_oneOverV.toFixed(4)})
                    </span>
                  </div>
                </div>

                {/* Slope Formula */}
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <div className="text-indigo-900 text-[11px] font-bold">Lens Equation Linear Form:</div>
                  <div className="text-xs font-bold text-indigo-800">
                    1/v = m &bull; (1/u) + c &nbsp;&nbsp;(where c = 1/f)
                  </div>
                  <div className="text-[11px] text-indigo-900 font-semibold pt-1">
                    Slope (m) = &Delta;(1/v) / &Delta;(1/u)
                  </div>
                </div>

                {/* Step-by-Step Substitution */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="text-slate-500 text-[10px]">Step-by-Step Substitution:</div>
                  <div className="text-[11px] text-slate-800">
                    m = ({ptB_oneOverV.toFixed(4)} &minus; {ptA_oneOverV.toFixed(4)}) / ({ptB_oneOverU.toFixed(4)} &minus; {ptA_oneOverU.toFixed(4)})
                  </div>
                  <div className="text-[11px] text-slate-800">
                    m = {deltaY.toFixed(4)} / {deltaX.toFixed(4)}
                  </div>
                  <div className="text-sm font-bold text-indigo-700 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>Evaluated Slope (m):</span>
                    <span>{calculatedSlope.toFixed(3)} <span className="text-[10px] text-slate-500 font-normal">(Theory = 1.00)</span></span>
                  </div>
                </div>

                {/* Intercept & Focal Length Deduction */}
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">
                    Focal Length Deduction from Y-Intercept:
                  </div>
                  <div className="text-[11px] text-slate-700">
                    c = Y₁ &minus; m &bull; X₁ = <strong>{calculatedIntercept.toFixed(4)} cm⁻¹</strong>
                  </div>
                  <div className="text-[11px] text-emerald-950 font-sans">
                    Since <strong className="font-mono">c = 1 / f</strong>, the focal length is <strong className="font-mono">f = 1 / c</strong>:
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-emerald-200 text-xs">
                    <span className="text-emerald-900 font-bold">Focal Length (f):</span>
                    <span className="text-base font-bold text-emerald-800 font-mono">
                      {experimentalF !== null ? `+${experimentalF.toFixed(2)} cm` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 space-y-1">
                <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p>Record at least 2 optical bench observations to plot the best-fit line and calculate slope.</p>
              </div>
            )}
          </div>

          {/* Theoretical Reference & Error Analysis */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 font-mono space-y-3">
            <div className="text-xs font-bold uppercase text-slate-600 border-b border-slate-100 pb-2">
              Theoretical Reference &amp; Deviation
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-400 text-[10px]">Theoretical f:</div>
                <div className="text-base font-bold text-slate-700 mt-0.5">
                  +{theoreticalFocalLength.toFixed(2)} <span className="text-[10px]">cm</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="text-indigo-600 text-[10px]">Experimental f:</div>
                <div className="text-base font-bold text-indigo-700 mt-0.5">
                  {experimentalF !== null ? `+${experimentalF.toFixed(2)} cm` : '—'}
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
          {hasEnoughData && experimentalF !== null ? (
            <div id="lens-result-card" className="p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Experimental Result</span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100 font-sans leading-relaxed">
                The experimental focal length of the convex lens determined via the two-point slope practical method is approximately{' '}
                <strong className="text-white font-mono font-bold">+{experimentalF.toFixed(2)} cm</strong>.
              </p>

              <div className="pt-2 border-t border-emerald-800/80 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-emerald-300">Theoretical Focal Length:</span>
                  <span className="font-bold text-white">+{theoreticalFocalLength.toFixed(2)} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Experimental Focal Length:</span>
                  <span className="font-bold text-white">+{experimentalF.toFixed(2)} cm</span>
                </div>
                {percentageError !== null && (
                  <div className="flex justify-between">
                    <span className="text-emerald-300">Percentage Error:</span>
                    <span className="font-bold text-emerald-200">{percentageError.toFixed(2)}%</span>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] font-sans text-emerald-300">
                Verified with {observations.length} optical bench data points using the traditional two-point slope method.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-sans text-center">
              Complete at least two trial recordings with different object distances to finalize the focal length deduction.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
