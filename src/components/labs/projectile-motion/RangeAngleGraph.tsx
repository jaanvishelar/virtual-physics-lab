import React, { useState, useMemo } from 'react';
import { LineChart, Info, Award, Eye, EyeOff, Sparkles, Filter, CheckCircle2, RotateCcw, Target } from 'lucide-react';
import { ProjectileObservation } from '../../../types';

interface RangeAngleGraphProps {
  observations: ProjectileObservation[];
  currentVelocity: number;
}

export const RangeAngleGraph: React.FC<RangeAngleGraphProps> = ({
  observations,
}) => {
  const [showTheoreticalCurve, setShowTheoreticalCurve] = useState<boolean>(true);
  const [showComplementaryGuides, setShowComplementaryGuides] = useState<boolean>(true);

  // Controlled variable for angle investigation: Constant u = 20 m/s, g = 9.81 m/s²
  const analysisVelocity = 20;
  const g = 9.81;

  // The graph and optimal-angle analysis use constant velocity u = 20 m/s trials
  const standardAngles = [15, 30, 45, 60, 75];
  const constantVelocityTrials = useMemo(() => {
    return observations.filter(
      (obs) => obs.velocity === analysisVelocity && standardAngles.includes(obs.angle)
    );
  }, [observations, analysisVelocity]);

  // Non-constant velocity trials excluded from angle graph
  const excludedVelocityTrials = useMemo(() => {
    return observations.filter(
      (obs) => obs.velocity !== analysisVelocity || !standardAngles.includes(obs.angle)
    );
  }, [observations, analysisVelocity]);

  // Two selectable angles along the non-linear sinusoidal curve: θ₁ and θ₂
  const [angleA, setAngleA] = useState<number>(15);
  const [angleB, setAngleB] = useState<number>(45);

  // Helper: Theoretical Range for a given angle in degrees at u = 20 m/s
  const getRangeAtAngle = (deg: number): number => {
    const rad = (deg * Math.PI) / 180;
    return (analysisVelocity * analysisVelocity * Math.sin(2 * rad)) / g;
  };

  // Formatted displayed coordinates for 100% numerical consistency (Section 8)
  const ptA_theta_disp = angleA;
  const ptA_R_disp = Number(getRangeAtAngle(angleA).toFixed(2));

  const ptB_theta_disp = angleB;
  const ptB_R_disp = Number(getRangeAtAngle(angleB).toFixed(2));

  // Differences computed directly from displayed coordinates
  const deltaTheta = ptB_theta_disp - ptA_theta_disp;
  const deltaR = Number((ptB_R_disp - ptA_R_disp).toFixed(2));
  const isZeroDivision = Math.abs(deltaTheta) < 1e-4;

  // Secant Average Gradient: m_avg = ΔR / Δθ in m/degree
  const secantSlope = !isZeroDivision ? deltaR / deltaTheta : 0;

  // SVG coordinate canvas setup
  const width = 640;
  const height = 350;
  const padding = { left: 55, right: 35, top: 35, bottom: 50 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Max X is 90° (quadrant)
  const maxX = 90;
  const maxY = 50;

  // Coordinate transforms
  const toSvgX = (deg: number) => padding.left + (deg / maxX) * plotWidth;
  const toSvgY = (range: number) => padding.top + plotHeight - (range / maxY) * plotHeight;

  // Ticks
  const xTicks = [0, 15, 30, 45, 60, 75, 90];
  const yTicks = [0, 10, 20, 30, 40, 50];

  // Compute theoretical continuous curve: R(θ) = u² · sin(2θ) / g with u = 20 m/s
  const theoreticalPathD = useMemo(() => {
    const steps = 90;
    const pts: string[] = [];

    for (let deg = 0; deg <= steps; deg++) {
      const r = getRangeAtAngle(deg);
      const sx = toSvgX(deg).toFixed(1);
      const sy = toSvgY(r).toFixed(1);
      pts.push(deg === 0 ? `M ${sx} ${sy}` : `L ${sx} ${sy}`);
    }
    return pts.join(' ');
  }, [analysisVelocity, g, plotWidth, plotHeight]);

  // Y positions for complementary pairs at u = 20 m/s
  const yPair15_75 = toSvgY(20.39);
  const yPair30_60 = toSvgY(35.31);
  const yPeak45 = toSvgY(40.77);

  // Pixel coordinates for Point A (Blue), Point B (Orange), and triangle corner
  const pxA = { x: toSvgX(ptA_theta_disp), y: toSvgY(ptA_R_disp) };
  const pxB = { x: toSvgX(ptB_theta_disp), y: toSvgY(ptB_R_disp) };
  const pxCorner = { x: toSvgX(ptB_theta_disp), y: toSvgY(ptA_R_disp) };

  const resetToRecommendedPoints = () => {
    setAngleA(15);
    setAngleB(45);
  };

  return (
    <div id="range-angle-graph-card" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      
      {/* Section Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            <span>Non-Linear Curve &bull; Interval Average Rate Analysis</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Horizontal Range R versus Launch Angle &theta;
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Initial velocity = {analysisVelocity} m/s &bull; Gravity = {g} m/s² &bull; Launch height = 0 m. Note: This relationship is sinusoidal; select two points to evaluate the average rate of change &Delta;R / &Delta;&theta;.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={resetToRecommendedPoints}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
            title="Reset to recommended points (15° and 45°)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Points</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComplementaryGuides((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${showComplementaryGuides ? 'bg-amber-500' : 'bg-slate-300'}`} />
            <span>Symmetry</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTheoreticalCurve((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            {showTheoreticalCurve ? <Eye className="w-3.5 h-3.5 text-indigo-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>Curve</span>
          </button>
        </div>
      </div>

      {/* Excluded Velocity Notice if student tested other velocities */}
      {excludedVelocityTrials.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            Constant-Velocity Filter Active: Showing {constantVelocityTrials.length} trial(s) at <strong>u = 20 m/s</strong>.
            ({excludedVelocityTrials.length} trial(s) tested at other velocities are kept in the observation table).
          </span>
        </div>
      )}

      {/* Main Grid: Left = SVG Plot with Secant Guides, Right = Standardized 6-Step Calculation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: SVG Canvas (Span 7) */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
            <span className="font-bold text-slate-800">Trajectory Curve: Range R (m) vs Angle &theta; (&deg;)</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                Trials
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block" />
                Sinusoidal Curve
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

          {/* SVG Canvas */}
          <div className="w-full relative flex items-center justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[560px] h-auto select-none">
              <defs>
                <linearGradient id="projSlopeTriangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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

              {/* Vertical Grid Lines (Angle Degrees) */}
              {xTicks.map((deg) => {
                const px = toSvgX(deg);
                const isOptimal = deg === 45;
                return (
                  <g key={`xtick-${deg}`}>
                    <line
                      x1={px}
                      y1={padding.top}
                      x2={px}
                      y2={padding.top + plotHeight}
                      stroke={isOptimal ? '#cbd5e1' : '#f1f5f9'}
                      strokeWidth={isOptimal ? 1.5 : 1}
                      strokeDasharray={isOptimal ? '4 4' : undefined}
                    />
                    <line
                      x1={px}
                      y1={padding.top + plotHeight}
                      x2={px}
                      y2={padding.top + plotHeight + 5}
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    <text
                      x={px}
                      y={padding.top + plotHeight + 18}
                      textAnchor="middle"
                      fill={isOptimal ? '#4338ca' : '#64748b'}
                      fontSize={isOptimal ? '10.5' : '9.5'}
                      fontFamily="monospace"
                      fontWeight={isOptimal ? 'bold' : 'normal'}
                    >
                      {deg}°
                    </text>
                  </g>
                );
              })}

              {/* Horizontal Grid Lines (Range Meters) */}
              {yTicks.map((r) => {
                const py = toSvgY(r);
                return (
                  <g key={`ytick-${r}`}>
                    <line
                      x1={padding.left}
                      y1={py}
                      x2={padding.left + plotWidth}
                      y2={py}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <line
                      x1={padding.left - 5}
                      y1={py}
                      x2={padding.left}
                      y2={py}
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 8}
                      y={py + 3}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      {r}m
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

              {/* Complementary Angle Symmetry Guides */}
              {showComplementaryGuides && (
                <g>
                  {/* 15° & 75° */}
                  <line
                    x1={toSvgX(15)}
                    y1={yPair15_75}
                    x2={toSvgX(75)}
                    y2={yPair15_75}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                  {/* 30° & 60° */}
                  <line
                    x1={toSvgX(30)}
                    y1={yPair30_60}
                    x2={toSvgX(60)}
                    y2={yPair30_60}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.7"
                  />
                  {/* 45° Peak */}
                  <line
                    x1={toSvgX(45)}
                    y1={padding.top}
                    x2={toSvgX(45)}
                    y2={yPeak45}
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.7"
                  />
                </g>
              )}

              {/* Continuous Theoretical Sinusoidal Curve: R(θ) = u²·sin(2θ)/g */}
              {showTheoreticalCurve && (
                <path
                  d={theoreticalPathD}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
              )}

              {/* Interval Secant Slope Triangle between Point A (Blue) and Point B (Orange) */}
              {!isZeroDivision && (
                <g className="slope-triangle">
                  <polygon
                    points={`${pxA.x},${pxA.y} ${pxCorner.x},${pxCorner.y} ${pxB.x},${pxB.y}`}
                    fill="url(#projSlopeTriangleGrad)"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Secant line connecting A and B */}
                  <line
                    x1={pxA.x}
                    y1={pxA.y}
                    x2={pxB.x}
                    y2={pxB.y}
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />

                  {/* Horizontal Guide: Δθ (Blue dashed) */}
                  <line
                    x1={pxA.x}
                    y1={pxA.y}
                    x2={pxCorner.x}
                    y2={pxCorner.y}
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Vertical Guide: ΔR (Orange dashed) */}
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

                  {/* Δθ Label */}
                  <text
                    x={(pxA.x + pxCorner.x) / 2}
                    y={pxCorner.y + 14}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#1d4ed8"
                  >
                    Δθ = {deltaTheta}°
                  </text>

                  {/* ΔR Label */}
                  <text
                    x={pxCorner.x + 8}
                    y={(pxCorner.y + pxB.y) / 2 + 3}
                    textAnchor="start"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="#c2410c"
                  >
                    ΔR = {deltaR > 0 ? `+${deltaR.toFixed(2)}` : deltaR.toFixed(2)} m
                  </text>
                </g>
              )}

              {/* Recorded Constant-Velocity Trial Points */}
              {constantVelocityTrials.map((obs) => {
                const cx = toSvgX(obs.angle);
                const cy = toSvgY(obs.range);

                return (
                  <g key={`pt-${obs.id}`}>
                    <circle cx={cx} cy={cy} r="4.5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                    <circle cx={cx} cy={cy} r="2" fill="#4f46e5" />
                    <text
                      x={cx}
                      y={cy - 7}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {obs.angle}°
                    </text>
                  </g>
                );
              })}

              {/* Point A (Blue Marker) on the curve */}
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
                  A ({ptA_theta_disp}°, {ptA_R_disp.toFixed(1)}m)
                </text>
              </g>

              {/* Point B (Orange Marker) on the curve */}
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
                  B ({ptB_theta_disp}°, {ptB_R_disp.toFixed(1)}m)
                </text>
              </g>

              {/* X Axis Title */}
              <text
                x={padding.left + plotWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fill="#334155"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Projection Angle &theta; (degrees)
              </text>

              {/* Y Axis Title */}
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
                Horizontal Range R (meters)
              </text>
            </svg>
          </div>

          {/* Interactive Sliders for Point A and Point B Angles along the curve */}
          <div className="w-full mt-3 p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                Select Two Points on the Trajectory Curve:
              </span>
              <span className="text-[11px] text-slate-500">
                Observe how the average gradient changes across regions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Point A Slider (Blue) */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-blue-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    Point A (&theta;₁, R₁): ({ptA_theta_disp}°, {ptA_R_disp.toFixed(2)} m)
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="44"
                  step="1"
                  value={angleA}
                  onChange={(e) => setAngleA(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-label="Adjust launch angle for Point A"
                />
              </div>

              {/* Point B Slider (Orange) */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-orange-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-600 inline-block" />
                    Point B (&theta;₂, R₂): ({ptB_theta_disp}°, {ptB_R_disp.toFixed(2)} m)
                  </span>
                </div>
                <input
                  type="range"
                  min="46"
                  max="85"
                  step="1"
                  value={angleB}
                  onChange={(e) => setAngleB(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  aria-label="Adjust launch angle for Point B"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 font-mono text-center">
            * Blue point = Point A, Orange point = Point B. Purple dashed line = Secant interval guide.
          </div>
        </div>

        {/* Right: Standardized 6-Step Two-Point Analysis Panel (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span>Two-Point Interval Rate Analysis</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Non-Linear Physics Practical
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              
              {/* 1. Selected Points */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-[11px] font-bold">1. Selected Points on Trajectory Curve:</div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-blue-400 font-semibold">Point A (θ₁, R₁):</span>
                  <span className="font-bold text-white">
                    ({ptA_theta_disp}°, {ptA_R_disp.toFixed(2)} m)
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-orange-400 font-semibold">Point B (θ₂, R₂):</span>
                  <span className="font-bold text-white">
                    ({ptB_theta_disp}°, {ptB_R_disp.toFixed(2)} m)
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                  <span>Δθ = θ₂ − θ₁ = {deltaTheta}°</span>
                  <span>ΔR = R₂ − R₁ = {deltaR > 0 ? `+${deltaR.toFixed(2)}` : deltaR.toFixed(2)} m</span>
                </div>
              </div>

              {/* 2. Slope / Rate Formula */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px] font-bold">2. Secant Average Gradient Formula:</div>
                <div className="text-indigo-300 text-sm font-bold">
                  m_avg = (R₂ − R₁) / (θ₂ − θ₁) = ΔR / Δθ
                </div>
                <div className="text-[11px] text-slate-400">
                  Measures the average rate of change of range per degree over [θ₁, θ₂].
                </div>
              </div>

              {/* 3. Numerical Substitution */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px] font-bold">3. Numerical Substitution:</div>
                <div className="text-slate-300">
                  m_avg = ({ptB_R_disp.toFixed(2)} − {ptA_R_disp.toFixed(2)}) / ({ptB_theta_disp}° − {ptA_theta_disp}°)
                </div>
                <div className="text-emerald-400 font-bold">
                  m_avg = {deltaR.toFixed(2)} m / {deltaTheta}°
                </div>
              </div>

              {/* 4. Final Calculated Slope / Rate */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold">4. Final Calculated Rate:</span>
                <span className={`text-sm font-bold ${secantSlope >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  m_avg = {secantSlope >= 0 ? `+${secantSlope.toFixed(3)}` : secantSlope.toFixed(3)} m/°
                </span>
              </div>

              {/* 5. Physical Interpretation */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-sans">
                <div className="text-slate-400 text-[11px] font-bold font-mono">5. Physical Interpretation & Non-Linearity:</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Why a constant straight-line slope is not applicable:</strong> The trajectory range equation is sinusoidal (<strong className="font-mono text-white">R = [u²/g]·sin 2θ</strong>).
                  Because the slope changes continuously (positive below 45°, zero at 45°, and negative above 45°), a single constant slope does not exist. The secant gradient <strong className="font-mono text-indigo-300">ΔR/Δθ</strong> represents the <em>average sensitivity of range to launch angle</em> across that specific interval.
                </p>
              </div>

              {/* 6. Final Experimental Result */}
              <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-emerald-300 text-[10px] font-bold uppercase font-mono">
                      6. Final Experimental Deduction:
                    </div>
                    <div className="text-white font-bold text-sm">
                      Maximum Range & Complementary Angles
                    </div>
                  </div>
                  <span className="text-base font-bold text-emerald-300 font-mono">
                    R_max = 40.77 m at 45°
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-800/80 text-xs text-emerald-200 font-sans leading-relaxed">
                  Complementary angles (e.g. 15° & 75° &rArr; R = 20.39 m, and 30° & 60° &rArr; R = 35.31 m) produce identical horizontal ranges because sin[2(90° − θ)] = sin 2θ.
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
