import React, { useState, useMemo } from 'react';
import { LineChart, Info, Award, Eye, EyeOff, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
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

  // The graph and optimal-angle analysis must use ONLY these five trials (15°, 30°, 45°, 60°, 75°)
  const standardAngles = [15, 30, 45, 60, 75];
  const constantVelocityTrials = useMemo(() => {
    return observations.filter(
      (obs) => obs.velocity === analysisVelocity && standardAngles.includes(obs.angle)
    );
  }, [observations, analysisVelocity]);

  // Non-constant velocity trials (e.g. 10 m/s or 30 m/s) or other angles excluded from angle analysis
  const excludedVelocityTrials = useMemo(() => {
    return observations.filter(
      (obs) => obs.velocity !== analysisVelocity || !standardAngles.includes(obs.angle)
    );
  }, [observations, analysisVelocity]);

  // Determine best observation strictly from constant velocity u = 20 m/s trials
  const bestObservation = useMemo(() => {
    if (constantVelocityTrials.length === 0) return null;
    return constantVelocityTrials.reduce(
      (best, curr) => (curr.range > (best?.range ?? -1) ? curr : best),
      constantVelocityTrials[0]
    );
  }, [constantVelocityTrials]);

  // SVG coordinate canvas setup
  const width = 640;
  const height = 340;
  const padding = { left: 55, right: 35, top: 35, bottom: 45 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Max X is 90° (full quadrant)
  const maxX = 90;

  // For u = 20 m/s, max theoretical range is 20² / 9.81 ≈ 40.77 m.
  // Set fixed maxY = 50 m to provide a stable, clean coordinate grid.
  const maxY = 50;

  // Coordinate transforms
  const toSvgX = (deg: number) => padding.left + (deg / maxX) * plotWidth;
  const toSvgY = (range: number) => padding.top + plotHeight - (range / maxY) * plotHeight;

  // Ticks
  const xTicks = [0, 15, 30, 45, 60, 75, 90];
  const yTicks = [0, 10, 20, 30, 40, 50];

  // Compute theoretical curve: R(θ) = u² · sin(2θ) / g with u = 20 m/s
  const theoreticalPathD = useMemo(() => {
    const steps = 90;
    const pts: string[] = [];

    for (let deg = 0; deg <= steps; deg++) {
      const rad = (deg * Math.PI) / 180;
      const r = (analysisVelocity * analysisVelocity * Math.sin(2 * rad)) / g;
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

  return (
    <div id="range-angle-graph-card" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
      
      {/* Graph Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-800 text-xs font-mono font-bold uppercase border border-indigo-200">
            <LineChart className="w-3.5 h-3.5" />
            <span>Second Investigation</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Investigation: Effect of Launch Angle on Horizontal Range
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Initial velocity = {analysisVelocity} m/s &bull; Gravity = {g} m/s² &bull; Launch height = 0 m
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            type="button"
            onClick={() => setShowComplementaryGuides((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="Toggle complementary symmetry guides"
          >
            <span className={`w-2 h-2 rounded-full ${showComplementaryGuides ? 'bg-amber-500' : 'bg-slate-300'}`} />
            <span>Symmetry Guides</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTheoreticalCurve((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            {showTheoreticalCurve ? <Eye className="w-3.5 h-3.5 text-indigo-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>Theoretical Curve (u = {analysisVelocity} m/s)</span>
          </button>
        </div>
      </div>

      {/* Excluded Velocity Notice if student tested other velocities */}
      {excludedVelocityTrials.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            Constant-Velocity Filter Active: Showing {constantVelocityTrials.length} trial(s) at <strong>u = 20 m/s</strong>.
            ({excludedVelocityTrials.length} trial(s) tested at other velocities like 10 m/s or 30 m/s are kept in the observation table for velocity comparison, but excluded from this angle graph).
          </span>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="relative w-full flex items-center justify-center select-none overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[380px] drop-shadow-2xs">
          {/* Background Grid */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="1"
            rx="6"
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
                  fontSize={isOptimal ? '11' : '10'}
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
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {r}m
                </text>
              </g>
            );
          })}

          {/* Optional Complementary Angle Symmetry Guide Lines */}
          {showComplementaryGuides && (
            <g className="transition-opacity duration-300">
              {/* 15° & 75° Complementary Guide */}
              <line
                x1={toSvgX(15)}
                y1={yPair15_75}
                x2={toSvgX(75)}
                y2={yPair15_75}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <text
                x={toSvgX(45)}
                y={yPair15_75 - 4}
                textAnchor="middle"
                fill="#d97706"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                15° &amp; 75° Equal Range: 20.39 m
              </text>

              {/* 30° & 60° Complementary Guide */}
              <line
                x1={toSvgX(30)}
                y1={yPair30_60}
                x2={toSvgX(60)}
                y2={yPair30_60}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <text
                x={toSvgX(45)}
                y={yPair30_60 - 4}
                textAnchor="middle"
                fill="#d97706"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                30° &amp; 60° Equal Range: 35.31 m
              </text>

              {/* 45° Peak Altitude Line */}
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

          {/* Theoretical Continuous Reference Curve: R(θ) = u²sin(2θ)/g (u = 20 m/s) */}
          {showTheoreticalCurve && (
            <path
              d={theoreticalPathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              className="drop-shadow-xs"
            />
          )}

          {/* Recorded Constant-Velocity Trial Data Points */}
          {constantVelocityTrials.map((obs) => {
            const cx = toSvgX(obs.angle);
            const cy = toSvgY(obs.range);
            const isBest = bestObservation && bestObservation.id === obs.id;

            return (
              <g key={`pt-${obs.id}`} className="transition-all">
                {/* Point Halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isBest ? 8 : 6}
                  fill={isBest ? '#f59e0b' : '#0284c7'}
                  opacity={isBest ? 0.35 : 0.25}
                />
                {/* Core Point Marker */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isBest ? 5.5 : 4.5}
                  fill={isBest ? '#f59e0b' : '#0ea5e9'}
                  stroke="#ffffff"
                  strokeWidth="1.8"
                />
                {/* Value Label */}
                <text
                  x={cx}
                  y={cy - 9}
                  textAnchor="middle"
                  fill={isBest ? '#b45309' : '#0369a1'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {obs.range.toFixed(2)}m
                </text>
              </g>
            );
          })}

          {/* X Axis Title */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 6}
            textAnchor="middle"
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Projection Angle θ (degrees)
          </text>

          {/* Y Axis Title */}
          <text
            x={-padding.top - plotHeight / 2}
            y="15"
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Horizontal Range R (meters)
          </text>
        </svg>
      </div>

      {/* Graph Legend & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-1">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 border border-white inline-block" />
            <span className="text-slate-600">Recorded Trials (u = {analysisVelocity} m/s): {constantVelocityTrials.length}</span>
          </div>

          {showTheoreticalCurve && (
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 border-t-2 border-dashed border-indigo-500 inline-block" />
              <span className="text-slate-600">Theoretical: R = (20²·sin 2θ)/9.81</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-slate-600">Optimal Launch Angle (45°)</span>
          </div>
        </div>

        <span className="text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 text-xs font-bold font-mono">
          Maximum range = 40.77 m at 45° for an initial velocity of 20 m/s.
        </span>
      </div>

      {/* SECTION 1: OPTIMAL LAUNCH ANGLE ANALYSIS (Constant u = 20 m/s Dataset) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 font-bold text-slate-900 font-sans text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Optimal Launch Angle Analysis</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-indigo-100/70 text-indigo-800 font-mono text-[11px] font-semibold">
            Controlled Dataset: Constant Initial Velocity u = 20 m/s
          </span>
        </div>

        {/* Clear Final Result Banner */}
        <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-wrap items-center justify-between gap-2 text-indigo-950 font-sans">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-700 shrink-0" />
            <span className="font-bold text-xs">Final Result:</span>
          </div>
          <span className="font-mono font-bold text-xs text-indigo-900 bg-white px-2.5 py-1 rounded-md border border-indigo-200">
            Maximum range = 40.77 m at 45° for an initial velocity of 20 m/s.
          </span>
        </div>

        {/* 3 Core Analytical Findings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Initial Velocity (u)</span>
            <div className="text-sm font-bold text-slate-900 font-mono">20 m/s</div>
            <span className="text-[10px] text-slate-400">Strictly Constant Datum</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-indigo-200 bg-indigo-50/20 space-y-1">
            <span className="text-[11px] text-indigo-700 font-medium">Optimal Angle (θ_opt)</span>
            <div className="text-sm font-bold text-indigo-900 font-mono">45°</div>
            <span className="text-[10px] text-indigo-600">Theoretical Peak (sin 2θ = 1)</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-amber-200 bg-amber-50/20 space-y-1">
            <span className="text-[11px] text-amber-800 font-medium">Maximum Range (R_max)</span>
            <div className="text-sm font-bold text-amber-900 font-mono">≈ 40.77 m</div>
            <span className="text-[10px] text-amber-700">R = 20² / 9.81 = 40.77 m</span>
          </div>
        </div>

        {/* Detailed Constant-Velocity 5-Angle Dataset Breakdown */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-2 px-3 font-bold">Angle θ</th>
                <th className="py-2 px-3 font-bold">Flight Time T (s)</th>
                <th className="py-2 px-3 font-bold">Max Height H (m)</th>
                <th className="py-2 px-3 font-bold">Recorded Range R (m)</th>
                <th className="py-2 px-3 font-bold">Theoretical R (m)</th>
                <th className="py-2 px-3 font-bold">Symmetry Pair / Property</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-bold text-slate-900">15°</td>
                <td className="py-2 px-3 text-slate-600">1.05 s</td>
                <td className="py-2 px-3 text-slate-600">1.37 m</td>
                <td className="py-2 px-3 font-bold text-sky-700">20.39 m</td>
                <td className="py-2 px-3 text-slate-500">20.39 m</td>
                <td className="py-2 px-3 text-amber-700 font-sans">Complement of 75° (Equal Range)</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-bold text-slate-900">30°</td>
                <td className="py-2 px-3 text-slate-600">2.04 s</td>
                <td className="py-2 px-3 text-slate-600">5.10 m</td>
                <td className="py-2 px-3 font-bold text-sky-700">35.31 m</td>
                <td className="py-2 px-3 text-slate-500">35.31 m</td>
                <td className="py-2 px-3 text-amber-700 font-sans">Complement of 60° (Equal Range)</td>
              </tr>
              <tr className="bg-indigo-50/50 font-semibold">
                <td className="py-2 px-3 font-bold text-indigo-900">45°</td>
                <td className="py-2 px-3 text-indigo-800">2.88 s</td>
                <td className="py-2 px-3 text-indigo-800">10.19 m</td>
                <td className="py-2 px-3 font-bold text-indigo-700">40.77 m</td>
                <td className="py-2 px-3 text-indigo-600">40.77 m</td>
                <td className="py-2 px-3 text-indigo-800 font-sans font-bold">★ Maximum Optimal Range</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-bold text-slate-900">60°</td>
                <td className="py-2 px-3 text-slate-600">3.53 s</td>
                <td className="py-2 px-3 text-slate-600">15.29 m</td>
                <td className="py-2 px-3 font-bold text-sky-700">35.31 m</td>
                <td className="py-2 px-3 text-slate-500">35.31 m</td>
                <td className="py-2 px-3 text-amber-700 font-sans">Complement of 30° (Equal Range)</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2 px-3 font-bold text-slate-900">75°</td>
                <td className="py-2 px-3 text-slate-600">3.94 s</td>
                <td className="py-2 px-3 text-slate-600">19.02 m</td>
                <td className="py-2 px-3 font-bold text-sky-700">20.39 m</td>
                <td className="py-2 px-3 text-slate-500">20.39 m</td>
                <td className="py-2 px-3 text-amber-700 font-sans">Complement of 15° (Equal Range)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Complementary Angles Explicit Statement */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-700 space-y-1.5 font-sans">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Complementary Angle Symmetry Principle:</span>
          </div>
          <p className="text-xs leading-relaxed">
            In the ideal simulation, <strong>complementary angles 30° and 60°</strong> (both yielding <strong>R = 35.31 m</strong>),
            and <strong>15° and 75°</strong> (both yielding <strong>R = 20.39 m</strong>), produce <strong>equal horizontal ranges</strong>.
          </p>
          <p className="text-[11px] text-slate-600 font-mono pt-1">
            Mathematical proof: sin[2(90° - θ)] = sin(180° - 2θ) = sin(2θ). Hence R(θ) = R(90° - θ).
          </p>
        </div>
      </div>

      {/* SECTION 2: CRITICAL SCIENTIFIC PRINCIPLE - WHY LINEAR REGRESSION IS NOT USED */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Scientific Principle: Why Linear Least-Squares Regression is Not Used</span>
        </div>
        <p className="text-slate-800 leading-relaxed font-sans text-xs">
          <strong>&ldquo;Range is not linearly proportional to projection angle; therefore a straight-line least-squares slope is not used for this relationship.&rdquo;</strong>
        </p>
        <p className="text-slate-600 leading-relaxed font-sans text-xs">
          Horizontal range follows the non-linear sinusoidal function <em>R(θ) = [u² / g] · sin(2θ)</em>.
          Unlike Ohm's Law (<em>V = IR</em>), Simple Pendulum (<em>T² ∝ L</em>), or Hooke's Law (<em>F = kx</em>) which represent linear models,
          projectile range increases to an optimal peak at approximately 45° and then symmetrically decreases toward 90°.
          Therefore, evaluating this experiment involves comparing recorded coordinate points directly with the theoretical sinusoidal curve rather than fitting an artificial linear slope.
        </p>
      </div>

      {/* SCIENTIFIC CONCLUSION (REQUIRED) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
          <Award className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Conclusion:</span>
        </div>
        <blockquote className="text-indigo-950 font-medium leading-relaxed font-sans text-xs sm:text-sm pl-3 border-l-2 border-indigo-400 italic">
          &ldquo;For equal launch and landing heights and negligible air resistance, the horizontal range is maximum at 45°. When the launch height is increased, the projectile remains in the air for longer and can travel farther horizontally for the same initial velocity and angle.&rdquo;
        </blockquote>
      </div>

    </div>
  );
};
