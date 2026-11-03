import React, { useState, useMemo } from 'react';
import { PendulumObservation } from '../../../types';
import { LineChart, CheckCircle2, AlertCircle, RotateCcw, Target } from 'lucide-react';

interface TLGraphProps {
  observations: PendulumObservation[];
  theoreticalG?: number;
}

export const TLGraph: React.FC<TLGraphProps> = ({
  observations,
  theoreticalG = 9.81
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

  // Actual coordinates of Point A and Point B on the best-fit line
  const ptA_L = domainMin + posRatioA * domainSpan;
  const ptA_T2 = lineFit ? lineFit.m * ptA_L + lineFit.c : 0;

  const ptB_L = domainMin + posRatioB * domainSpan;
  const ptB_T2 = lineFit ? lineFit.m * ptB_L + lineFit.c : 0;

  // Traditional two-point slope calculation: m = (T₂² - T₁²) / (L₂ - L₁)
  const deltaL = ptB_L - ptA_L;
  const deltaT2 = ptB_T2 - ptA_T2;
  const isZeroDivision = Math.abs(deltaL) < 1e-6;

  const calculatedSlope = !isZeroDivision ? deltaT2 / deltaL : 0;

  // Calculation of g: g = 4π² / slope
  const fourPiSq = 4 * Math.PI * Math.PI; // ~39.4784
  const experimentalG = calculatedSlope > 0.001 ? fourPiSq / calculatedSlope : null;
  const percentageError =
    experimentalG !== null ? (Math.abs(experimentalG - theoreticalG) / theoreticalG) * 100 : null;

  // Location reading stats
  const groundObservations = observations.filter((o) => o.location === 'Ground');
  const fourthFloorObservations = observations.filter((o) => o.location === '4th Floor');

  // SVG viewport dimensions
  const width = 560;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };

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

  // Pixel coordinates for selected Point A and Point B
  const pxA = { x: scaleX(ptA_L), y: scaleY(ptA_T2) };
  const pxB = { x: scaleX(ptB_L), y: scaleY(ptB_T2) };
  const pxCorner = { x: scaleX(ptB_L), y: scaleY(ptA_T2) };

  const resetToRecommendedPoints = () => {
    setPosRatioA(0.2);
    setPosRatioB(0.8);
  };

  return (
    <div id="graph-analysis-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
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
            Plotting Time Period Squared T² against Length L. Select two well-separated points on the best-fit line to calculate slope m = ΔT² / ΔL, then deduce g = 4π² / m.
          </p>
        </div>

        {hasEnoughData && (
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={resetToRecommendedPoints}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
              title="Reset to recommended points"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Points</span>
            </button>
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Best-Fit Line Active ({observations.length} points)</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: SVG Graph + Two-Point Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left: SVG Graph Canvas (Span 7) */}
        <div className="lg:col-span-7 bg-slate-50/80 rounded-xl p-3 sm:p-4 border border-slate-200 relative flex flex-col items-center">
          
          <div className="w-full aspect-[14/9] max-h-[380px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
              aria-label="T² versus L experimental graph with two-point slope triangle"
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

              {/* Main Cartesian Axes */}
              <line
                x1={padding.left}
                y1={padding.top + plotHeight}
                x2={padding.left + plotWidth}
                y2={padding.top + plotHeight}
                stroke="#1e293b"
                strokeWidth="2"
              />
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

              {/* Ticks & Labels: X-Axis (Length L in m) */}
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

              {/* Ticks & Labels: Y-Axis (T² in s²) */}
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
                Length L (m) &rarr;
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
                Time Period Squared T² (s²) &rarr;
              </text>

              {/* Best-Fit Line through observations */}
              {hasEnoughData && lineFit && (
                <line
                  x1={lineStartCanvas.x}
                  y1={lineStartCanvas.y}
                  x2={lineEndCanvas.x}
                  y2={lineEndCanvas.y}
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Traditional Right-Angled Slope Triangle between Point A and Point B */}
              {hasEnoughData && !isZeroDivision && (
                <g>
                  {/* Shaded triangle */}
                  <polygon
                    points={`${pxA.x},${pxA.y} ${pxCorner.x},${pxCorner.y} ${pxB.x},${pxB.y}`}
                    fill="#6366f1"
                    fillOpacity="0.10"
                  />

                  {/* Horizontal base: ΔL */}
                  <line
                    x1={pxA.x}
                    y1={pxA.y}
                    x2={pxCorner.x}
                    y2={pxCorner.y}
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Vertical height: ΔT² */}
                  <line
                    x1={pxCorner.x}
                    y1={pxCorner.y}
                    x2={pxB.x}
                    y2={pxB.y}
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Corner mark */}
                  <circle cx={pxCorner.x} cy={pxCorner.y} r="2.5" fill="#475569" />

                  {/* ΔL label */}
                  <text
                    x={(pxA.x + pxCorner.x) / 2}
                    y={pxCorner.y + 14}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#0369a1"
                  >
                    ΔL = {Math.abs(deltaL).toFixed(2)} m
                  </text>

                  {/* ΔT² label */}
                  <text
                    x={pxCorner.x + 8}
                    y={(pxCorner.y + pxB.y) / 2}
                    textAnchor="start"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#b91c1c"
                  >
                    ΔT² = {Math.abs(deltaT2).toFixed(3)} s²
                  </text>
                </g>
              )}

              {/* Plotted Experimental Observations */}
              {observations.map((obs) => {
                const cx = scaleX(obs.length);
                const cy = scaleY(obs.periodSquared);
                const isHovered = hoveredPoint?.id === obs.id;
                const isGround = obs.location === 'Ground';
                const strokeColor = isGround ? '#059669' : '#4338ca';
                const fillColor = isGround ? '#ecfdf5' : '#eef2ff';
                const coreColor = isGround ? '#059669' : '#4338ca';

                return (
                  <g
                    key={obs.id}
                    onMouseEnter={() => setHoveredPoint(obs)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer transition-all"
                  >
                    {isHovered && (
                      <circle cx={cx} cy={cy} r="11" fill={coreColor} fillOpacity="0.25" />
                    )}
                    <circle cx={cx} cy={cy} r="5.5" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
                    <circle cx={cx} cy={cy} r="2" fill={coreColor} />
                  </g>
                );
              })}

              {/* Point A Marker on the Line */}
              {hasEnoughData && (
                <g className="cursor-pointer">
                  <circle cx={pxA.x} cy={pxA.y} r="8" fill="#0284c7" fillOpacity="0.25" />
                  <circle cx={pxA.x} cy={pxA.y} r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  <rect
                    x={pxA.x - 28}
                    y={pxA.y - 24}
                    width="56"
                    height="16"
                    rx="4"
                    fill="#0f172a"
                    fillOpacity="0.9"
                  />
                  <text
                    x={pxA.x}
                    y={pxA.y - 13}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#38bdf8"
                  >
                    Pt A ({ptA_L.toFixed(2)}m, {ptA_T2.toFixed(2)}s²)
                  </text>
                </g>
              )}

              {/* Point B Marker on the Line */}
              {hasEnoughData && (
                <g className="cursor-pointer">
                  <circle cx={pxB.x} cy={pxB.y} r="8" fill="#d97706" fillOpacity="0.25" />
                  <circle cx={pxB.x} cy={pxB.y} r="5" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                  <rect
                    x={pxB.x - 28}
                    y={pxB.y - 24}
                    width="56"
                    height="16"
                    rx="4"
                    fill="#0f172a"
                    fillOpacity="0.9"
                  />
                  <text
                    x={pxB.x}
                    y={pxB.y - 13}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#fbbf24"
                  >
                    Pt B ({ptB_L.toFixed(2)}m, {ptB_T2.toFixed(2)}s²)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span className="text-slate-700">● Ground ({groundObservations.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              <span className="text-slate-700">● 4th Floor ({fourthFloorObservations.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-indigo-600 inline-block" />
              <span className="text-slate-700">Best-Fit Line</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 border border-dashed border-indigo-400 bg-indigo-50/50 inline-block" />
              <span className="text-slate-700">Slope Triangle (ΔL, ΔT²)</span>
            </div>
          </div>

          {/* Interactive Sliders for Adjusting Point A and Point B on the Line */}
          {hasEnoughData && (
            <div className="w-full mt-3 p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  Adjust Slope Points Along Best-Fit Line:
                </span>
                <span className="text-[11px] text-slate-500">
                  Select well-separated points to minimize reading errors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Point A Slider */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-sky-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-600 inline-block" />
                      Point A (L₁): {ptA_L.toFixed(2)} m
                    </span>
                    <span className="text-slate-400">T₁² = {ptA_T2.toFixed(3)} s²</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.48"
                    step="0.01"
                    value={posRatioA}
                    onChange={(e) => setPosRatioA(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    aria-label="Adjust Point A along best-fit line"
                  />
                </div>

                {/* Point B Slider */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                      Point B (L₂): {ptB_L.toFixed(2)} m
                    </span>
                    <span className="text-slate-400">T₂² = {ptB_T2.toFixed(3)} s²</span>
                  </div>
                  <input
                    type="range"
                    min="0.52"
                    max="0.95"
                    step="0.01"
                    value={posRatioB}
                    onChange={(e) => setPosRatioB(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    aria-label="Adjust Point B along best-fit line"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Insufficient Data Notice */}
          {!hasEnoughData && (
            <div className="mt-3 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Record at least 2 observations across different lengths to generate the best-fit line and slope triangle.</strong> Currently {observations.length} recorded.
              </span>
            </div>
          )}

          <div className="mt-2 text-[11px] text-slate-500 font-mono text-center">
            * Governing physics: T² = (4π²/g)L &rarr; Slope m = ΔT² / ΔL &rarr; g = 4π² / m.
          </div>
        </div>

        {/* Right: Traditional Two-Point Slope Calculation & Result Card (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Two-Point Slope Calculation Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs">
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Two-Point Slope Calculation</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                School Practical Method
              </span>
            </div>

            {hasEnoughData ? (
              <div className="space-y-3 font-mono text-xs">
                
                {/* 1. Selected Points */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold">1. Selected Points on Line:</div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-sky-400 font-semibold">Point A (L₁, T₁²):</span>
                    <span>({ptA_L.toFixed(2)} m, {ptA_T2.toFixed(3)} s²)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-amber-400 font-semibold">Point B (L₂, T₂²):</span>
                    <span>({ptB_L.toFixed(2)} m, {ptB_T2.toFixed(3)} s²)</span>
                  </div>
                </div>

                {/* 2. Slope Formula */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] font-bold">2. Practical Slope Formula:</div>
                  <div className="text-indigo-300 text-sm font-bold mt-0.5">
                    Slope (m) = (T₂² − T₁²) / (L₂ − L₁) = ΔT² / ΔL
                  </div>
                </div>

                {/* 3. Numerical Substitution */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px] font-bold">3. Numerical Substitution:</div>
                  <div className="text-slate-300 mt-0.5">
                    m = ({ptB_T2.toFixed(3)} − {ptA_T2.toFixed(3)}) / ({ptB_L.toFixed(2)} − {ptA_L.toFixed(2)})
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    m = {deltaT2.toFixed(3)} / {deltaL.toFixed(2)}
                  </div>
                </div>

                {/* 4. Evaluated Slope */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-bold">4. Final Calculated Slope:</span>
                  <span className="text-emerald-400 text-sm font-bold">
                    m = {calculatedSlope.toFixed(3)} s²/m
                  </span>
                </div>

                {/* 5. Calculation of g */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px] font-bold">5. Determination of g:</div>
                  <div className="text-[11px] text-slate-300">
                    g = 4π² / Slope = 4(3.14159)² / {calculatedSlope.toFixed(3)}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-300 font-bold">Calculated g:</span>
                    <span className="text-base font-bold text-emerald-400">
                      {experimentalG !== null ? `${experimentalG.toFixed(2)} m/s²` : '—'}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 font-mono">
                Log at least 2 observations across different lengths to view the two-point slope calculation.
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
                <p className="font-semibold text-emerald-950 leading-relaxed font-sans">
                  "The value of acceleration due to gravity was determined using the traditional two-point slope method from the T²–L best-fit line."
                </p>

                <div className="p-3 rounded-lg bg-white border border-emerald-200 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Theoretical g:</span>
                    <span className="font-bold text-slate-900">{theoreticalG.toFixed(2)} m/s²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Experimental g (4π² / m):</span>
                    <span className="font-bold text-indigo-700">{experimentalG.toFixed(2)} m/s²</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Percentage Error:</span>
                    <span className="font-bold text-emerald-700">
                      {percentageError !== null ? `${percentageError.toFixed(2)}%` : '—'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  The linear T²–L graph verifies that <span className="font-mono font-bold">T² ∝ L</span>. By picking two well-separated points on the straight line, students obtain a reliable estimate of local gravitational acceleration g.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Log at least 2 readings across different lengths (e.g., 0.40 m, 0.60 m, 0.80 m) to draw the best-fit line and deduce g from the slope.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
