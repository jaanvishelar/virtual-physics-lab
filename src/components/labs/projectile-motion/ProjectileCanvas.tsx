import React, { useMemo } from 'react';
import { Compass, Target, ArrowUpRight, Gauge, Activity, CheckCircle2 } from 'lucide-react';

interface ProjectileCanvasProps {
  velocity: number; // u in m/s
  angle: number; // θ in degrees
  currentTime: number; // t in seconds
  currentX: number; // x(t) in meters
  currentY: number; // y(t) in meters
  currentVx: number; // v_x in m/s
  currentVy: number; // v_y in m/s
  trajectoryPoints: Array<{ x: number; y: number }>;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  timeOfFlight: number; // T in s
  maxHeight: number; // H in m
  theoreticalRange: number; // R in m
}

export const ProjectileCanvas: React.FC<ProjectileCanvasProps> = ({
  velocity,
  angle,
  currentTime,
  currentX,
  currentY,
  currentVx,
  currentVy,
  trajectoryPoints,
  isRunning,
  isPaused,
  isCompleted,
  timeOfFlight,
  maxHeight,
  theoreticalRange,
}) => {
  // SVG viewport dimensions
  const svgWidth = 720;
  const svgHeight = 400;
  const padding = { left: 65, right: 45, top: 45, bottom: 55 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Dynamically scale axes so trajectory always fits comfortably with margin
  const maxX = useMemo(() => {
    const minSpan = 25;
    const peakRange = Math.max(theoreticalRange * 1.15, currentX * 1.1, (velocity * velocity / 9.81) * 1.05);
    return Math.max(minSpan, Math.ceil(peakRange / 5) * 5);
  }, [theoreticalRange, currentX, velocity]);

  const maxY = useMemo(() => {
    const minSpan = 12;
    const peakHeight = Math.max(maxHeight * 1.35, currentY * 1.25, 10);
    return Math.max(minSpan, Math.ceil(peakHeight / 5) * 5);
  }, [maxHeight, currentY]);

  // Coordinate transforms: Physical meters (x, y) -> SVG pixels (px, py)
  const toSvgX = (x: number) => padding.left + (x / maxX) * plotWidth;
  const toSvgY = (y: number) => padding.top + plotHeight - (y / maxY) * plotHeight;

  // Grid tick intervals
  const numXTicks = 6;
  const xTicks = Array.from({ length: numXTicks + 1 }, (_, i) => (maxX * i) / numXTicks);

  const numYTicks = 5;
  const yTicks = Array.from({ length: numYTicks + 1 }, (_, i) => (maxY * i) / numYTicks);

  // Path string for the progressive trajectory
  const trajectoryPathD = useMemo(() => {
    if (trajectoryPoints.length < 2) return '';
    return trajectoryPoints.reduce((acc, pt, idx) => {
      const sx = toSvgX(pt.x).toFixed(1);
      const sy = toSvgY(pt.y).toFixed(1);
      return idx === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
    }, '');
  }, [trajectoryPoints, maxX, maxY, plotWidth, plotHeight]);

  // Full theoretical parabolic curve for reference
  const fullTheoreticalPathD = useMemo(() => {
    const steps = 60;
    const rad = (angle * Math.PI) / 180;
    const u = velocity;
    const g = 9.81;
    const pts: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = (timeOfFlight * i) / steps;
      const x = u * Math.cos(rad) * t;
      const y = Math.max(0, u * Math.sin(rad) * t - 0.5 * g * t * t);
      const sx = toSvgX(x).toFixed(1);
      const sy = toSvgY(y).toFixed(1);
      pts.push(i === 0 ? `M ${sx} ${sy}` : `L ${sx} ${sy}`);
    }
    return pts.join(' ');
  }, [velocity, angle, timeOfFlight, maxX, maxY, plotWidth, plotHeight]);

  // Cannon barrel geometry (pivot at origin x=0, y=0)
  const barrelLength = 36;
  const rad = (angle * Math.PI) / 180;
  const muzzleX = toSvgX(0) + Math.cos(rad) * barrelLength;
  const muzzleY = toSvgY(0) - Math.sin(rad) * barrelLength;

  // Maximum height coordinate
  const apexX = theoreticalRange / 2;
  const apexY = maxHeight;

  return (
    <div id="projectile-canvas-card" className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-slate-200 font-bold uppercase tracking-wider">
            Interactive Kinematic Runway &bull; Gravity g = 9.81 m/s²
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isRunning && !isPaused ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold animate-pulse">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              In Flight (Parabolic Arc)
            </span>
          ) : isPaused ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold">
              Simulation Paused
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Touchdown (y = 0 m)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Ready to Launch
            </span>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative my-3 w-full flex items-center justify-center select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[460px] drop-shadow-md"
        >
          <defs>
            {/* Sky Background Gradient */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#090d16" />
              <stop offset="70%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Ground Linear Gradient */}
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="25%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Ball Radial Gradient */}
            <radialGradient id="ballShine" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>

            {/* Cannon Metal Gradient */}
            <linearGradient id="cannonMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Trajectory Glow Filter */}
            <filter id="glowTrajectory" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Coordinate Grid Background */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="url(#skyGrad)"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Vertical Grid Lines (X-Ticks) */}
          {xTicks.map((xVal, i) => {
            const px = toSvgX(xVal);
            return (
              <g key={`x-grid-${i}`}>
                <line
                  x1={px}
                  y1={padding.top}
                  x2={px}
                  y2={padding.top + plotHeight}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Scale Tick on Ground */}
                <line
                  x1={px}
                  y1={toSvgY(0)}
                  x2={px}
                  y2={toSvgY(0) + 5}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
                <text
                  x={px}
                  y={toSvgY(0) + 18}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {xVal.toFixed(0)}m
                </text>
              </g>
            );
          })}

          {/* Horizontal Grid Lines (Y-Ticks) */}
          {yTicks.map((yVal, i) => {
            const py = toSvgY(yVal);
            return (
              <g key={`y-grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={py}
                  x2={padding.left + plotWidth}
                  y2={py}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Tick on Y Axis */}
                <line
                  x1={padding.left - 5}
                  y1={py}
                  x2={padding.left}
                  y2={py}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
                <text
                  x={padding.left - 10}
                  y={py + 3.5}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {yVal.toFixed(0)}m
                </text>
              </g>
            );
          })}

          {/* Solid Ground Surface Strip */}
          <rect
            x={padding.left}
            y={toSvgY(0)}
            width={plotWidth}
            height={svgHeight - toSvgY(0) - 2}
            fill="url(#groundGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Theoretical Trajectory Guideline (subtle dashed arc) */}
          <path
            d={fullTheoreticalPathD}
            fill="none"
            stroke="#6366f1"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.35"
          />

          {/* Progressive Realized Trajectory Arc */}
          {trajectoryPathD && (
            <path
              d={trajectoryPathD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowTrajectory)"
            />
          )}

          {/* Apex (Maximum Height) Marker & Vertical Drop Line */}
          {(currentX >= apexX || isCompleted) && (
            <g className="transition-all duration-300">
              {/* Vertical Dashed Line from Apex to Ground */}
              <line
                x1={toSvgX(apexX)}
                y1={toSvgY(apexY)}
                x2={toSvgX(apexX)}
                y2={toSvgY(0)}
                stroke="#fbbf24"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              {/* Apex Marker Circle */}
              <circle
                cx={toSvgX(apexX)}
                cy={toSvgY(apexY)}
                r="4.5"
                fill="#fbbf24"
                stroke="#78350f"
                strokeWidth="1.5"
              />
              {/* Apex Label Badge */}
              <g transform={`translate(${toSvgX(apexX)}, ${toSvgY(apexY) - 12})`}>
                <rect
                  x="-42"
                  y="-14"
                  width="84"
                  height="16"
                  rx="4"
                  fill="#0f172a"
                  stroke="#fbbf24"
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x="0"
                  y="-3"
                  textAnchor="middle"
                  fill="#fde68a"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  H_max = {maxHeight.toFixed(2)}m
                </text>
              </g>
            </g>
          )}

          {/* Landing Target Marker & Range Bracket */}
          {isCompleted && (
            <g className="transition-all duration-300">
              {/* Landing Point Impact Ring */}
              <circle
                cx={toSvgX(currentX)}
                cy={toSvgY(0)}
                r="9"
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <circle
                cx={toSvgX(currentX)}
                cy={toSvgY(0)}
                r="4"
                fill="#10b981"
                stroke="#064e3b"
                strokeWidth="1.5"
              />

              {/* Horizontal Range Dimension Line on Ground */}
              <g transform={`translate(0, ${toSvgY(0) + 26})`}>
                <line
                  x1={toSvgX(0)}
                  y1="0"
                  x2={toSvgX(currentX)}
                  y2="0"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <line
                  x1={toSvgX(0)}
                  y1="-4"
                  x2={toSvgX(0)}
                  y2="4"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <line
                  x1={toSvgX(currentX)}
                  y1="-4"
                  x2={toSvgX(currentX)}
                  y2="4"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                {/* Range Pill Text */}
                <rect
                  x={toSvgX(currentX / 2) - 48}
                  y="-9"
                  width="96"
                  height="18"
                  rx="4"
                  fill="#064e3b"
                  stroke="#34d399"
                  strokeWidth="1"
                />
                <text
                  x={toSvgX(currentX / 2)}
                  y="4"
                  textAnchor="middle"
                  fill="#d1fae5"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Range R = {currentX.toFixed(2)}m
                </text>
              </g>
            </g>
          )}

          {/* Cannon Launcher Assembly at Origin (0, 0) */}
          <g>
            {/* Cannon Stand Base */}
            <polygon
              points={`
                ${toSvgX(0) - 18},${toSvgY(0)}
                ${toSvgX(0) + 18},${toSvgY(0)}
                ${toSvgX(0) + 10},${toSvgY(0) - 14}
                ${toSvgX(0) - 10},${toSvgY(0) - 14}
              `}
              fill="url(#cannonMetal)"
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Protractor Angle Arc */}
            <path
              d={`
                M ${toSvgX(0) + 26} ${toSvgY(0)}
                A 26 26 0 0 0 ${toSvgX(0) + 26 * Math.cos(rad)} ${toSvgY(0) - 26 * Math.sin(rad)}
              `}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            {/* Angle Indicator Tag */}
            <text
              x={toSvgX(0) + 32 * Math.cos(rad / 2)}
              y={toSvgY(0) - 32 * Math.sin(rad / 2) - 2}
              fill="#fbbf24"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {angle}°
            </text>

            {/* Swiveling Cannon Barrel */}
            <g
              transform={`translate(${toSvgX(0)}, ${toSvgY(0)}) rotate(${-angle})`}
            >
              <rect
                x="0"
                y="-6"
                width={barrelLength}
                height="12"
                rx="2"
                fill="url(#cannonMetal)"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <line
                x1={barrelLength - 3}
                y1="-6"
                x2={barrelLength - 3}
                y2="6"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
            </g>

            {/* Pivot Wheel */}
            <circle
              cx={toSvgX(0)}
              cy={toSvgY(0)}
              r="7"
              fill="#334155"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <circle
              cx={toSvgX(0)}
              cy={toSvgY(0)}
              r="2"
              fill="#ffffff"
            />

            {/* Velocity Vector Arrow at Muzzle (when ready or in flight) */}
            <g>
              <line
                x1={muzzleX}
                y1={muzzleY}
                x2={muzzleX + Math.cos(rad) * 22}
                y2={muzzleY - Math.sin(rad) * 22}
                stroke="#38bdf8"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <text
                x={muzzleX + Math.cos(rad) * 28}
                y={muzzleY - Math.sin(rad) * 28 - 2}
                fill="#38bdf8"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                u={velocity}m/s
              </text>
            </g>
          </g>

          {/* Active Projectile Ball */}
          <g transform={`translate(${toSvgX(currentX)}, ${toSvgY(currentY)})`}>
            {/* Motion Blur / Shadow */}
            <circle
              cx="0"
              cy="0"
              r="7"
              fill="url(#ballShine)"
              stroke="#e0f2fe"
              strokeWidth="1"
              className="drop-shadow-sm"
            />

            {/* Velocity Vector on Moving Ball during flight */}
            {isRunning && !isCompleted && (
              <g>
                <line
                  x1="0"
                  y1="0"
                  x2={Math.min(30, currentVx * 0.9)}
                  y2={Math.max(-30, Math.min(30, -currentVy * 0.9))}
                  stroke="#fb7185"
                  strokeWidth="1.8"
                />
              </g>
            )}
          </g>

          {/* X Axis Label */}
          <text
            x={padding.left + plotWidth / 2}
            y={svgHeight - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Horizontal Distance x (meters)
          </text>

          {/* Y Axis Label */}
          <text
            x={-padding.top - plotHeight / 2}
            y="18"
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Vertical Height y (meters)
          </text>
        </svg>
      </div>

      {/* Real-Time Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Flight Time (t)</span>
          <span className="text-sm font-bold text-white">
            {currentTime.toFixed(2)} <span className="text-xs text-slate-400 font-normal">s</span>
          </span>
          <span className="text-[10px] text-slate-500 block">T_tot = {timeOfFlight.toFixed(2)}s</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Current x(t)</span>
          <span className="text-sm font-bold text-emerald-400">
            {currentX.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m</span>
          </span>
          <span className="text-[10px] text-slate-500 block">R_target = {theoreticalRange.toFixed(2)}m</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Current y(t)</span>
          <span className="text-sm font-bold text-sky-400">
            {currentY.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m</span>
          </span>
          <span className="text-[10px] text-slate-500 block">H_apex = {maxHeight.toFixed(2)}m</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Instant Velocity (v)</span>
          <span className="text-sm font-bold text-indigo-400">
            {Math.sqrt(currentVx * currentVx + currentVy * currentVy).toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">m/s</span>
          </span>
          <span className="text-[10px] text-slate-500 block">
            vₓ={currentVx.toFixed(1)} &bull; vᵧ={currentVy.toFixed(1)}
          </span>
        </div>
      </div>

    </div>
  );
};
