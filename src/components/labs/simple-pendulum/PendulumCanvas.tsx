import React from 'react';

interface PendulumCanvasProps {
  length: number; // in metres (0.20 to 1.50)
  currentAngleDeg: number; // current instantaneous angle in degrees
  initialAngleDeg: number; // initial amplitude angle in degrees
  isRunning: boolean;
  oscillations: number;
  targetOscillations: number;
  measuredTime: number;
}

export const PendulumCanvas: React.FC<PendulumCanvasProps> = ({
  length,
  currentAngleDeg,
  initialAngleDeg,
  isRunning,
  oscillations,
  targetOscillations,
  measuredTime
}) => {
  // SVG viewport dimensions
  const svgWidth = 500;
  const svgHeight = 440;

  // Pivot coordinates (split cork clamp position)
  const pivotX = 220;
  const pivotY = 70;

  // Scale length for visual representation:
  // L range 0.20m to 1.50m mapped to pixel length 100px to 300px
  const minL = 0.20;
  const maxL = 1.50;
  const minPixelL = 110;
  const maxPixelL = 300;
  const pixelLength = minPixelL + ((length - minL) / (maxL - minL)) * (maxPixelL - minPixelL);

  // Convert current angle to radians
  const angleRad = (currentAngleDeg * Math.PI) / 180;
  const initialAngleRad = (initialAngleDeg * Math.PI) / 180;

  // Calculate bob position
  const bobX = pivotX + pixelLength * Math.sin(angleRad);
  const bobY = pivotY + pixelLength * Math.cos(angleRad);

  // Bob geometry
  const bobRadius = 14;

  // Trajectory arc path between -initialAngleDeg and +initialAngleDeg
  const arcLeftX = pivotX + pixelLength * Math.sin(-initialAngleRad);
  const arcLeftY = pivotY + pixelLength * Math.cos(-initialAngleRad);
  const arcRightX = pivotX + pixelLength * Math.sin(initialAngleRad);
  const arcRightY = pivotY + pixelLength * Math.cos(initialAngleRad);

  // Protractor radius at the top
  const protractorR = 48;

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col items-center">
      
      {/* Simulation Title & Overlay Badges */}
      <div className="w-full flex items-center justify-between z-10 mb-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Oscillation Bench &bull; Planar SHM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
            L = {length.toFixed(2)} m
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
            θ = {currentAngleDeg >= 0 ? `+${currentAngleDeg.toFixed(1)}°` : `${currentAngleDeg.toFixed(1)}°`}
          </span>
        </div>
      </div>

      {/* Main SVG Simulation Canvas */}
      <div className="w-full aspect-[5/4] max-h-[440px] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
          aria-label="Interactive Simple Pendulum Simulation"
        >
          <defs>
            {/* Bob Metallic Radial Gradient */}
            <radialGradient id="brassBobGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="85%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </radialGradient>

            {/* Stand Metallic Gradient */}
            <linearGradient id="metalStandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Wood cork split pad gradient */}
            <linearGradient id="corkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Background Grid Accent */}
          <g opacity="0.15">
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`bg-h-${i}`}
                x1="0"
                y1={i * 40}
                x2={svgWidth}
                y2={i * 40}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line
                key={`bg-v-${i}`}
                x1={i * 40}
                y1="0"
                x2={i * 40}
                y2={svgHeight}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            ))}
          </g>

          {/* RETORT STAND / SUPPORT (Fixed to Bench) */}
          {/* Base of Retort Stand */}
          <rect
            x="40"
            y="410"
            width="120"
            height="18"
            rx="3"
            fill="url(#metalStandGrad)"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <line x1="40" y1="414" x2="160" y2="414" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />

          {/* Vertical Metallic Pillar */}
          <rect
            x="76"
            y="45"
            width="12"
            height="365"
            rx="1"
            fill="url(#metalStandGrad)"
            stroke="#0f172a"
            strokeWidth="1.5"
          />

          {/* Horizontal Arm Clamp */}
          <rect
            x="72"
            y="55"
            width="155"
            height="12"
            rx="2"
            fill="url(#metalStandGrad)"
            stroke="#0f172a"
            strokeWidth="1.5"
          />

          {/* Stand Clamp Tightening Knob */}
          <circle cx="78" cy="61" r="7" fill="#475569" stroke="#0f172a" strokeWidth="1" />
          <rect x="74" y="58" width="8" height="6" fill="#94a3b8" rx="1" />

          {/* SPLIT CORK SUSPENSION BLOCK */}
          <rect
            x={pivotX - 10}
            y={pivotY - 14}
            width="20"
            height="14"
            rx="2"
            fill="url(#corkGrad)"
            stroke="#451a03"
            strokeWidth="1"
          />
          {/* Cork split line */}
          <line
            x1={pivotX}
            y1={pivotY - 14}
            x2={pivotX}
            y2={pivotY}
            stroke="#451a03"
            strokeWidth="1.5"
          />
          {/* Rigid suspension pin */}
          <circle cx={pivotX} cy={pivotY} r="3" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />

          {/* ANGULAR PROTRACTOR ARC AT PIVOT */}
          <path
            d={`M ${pivotX - protractorR} ${pivotY} A ${protractorR} ${protractorR} 0 0 0 ${pivotX + protractorR} ${pivotY}`}
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          {/* Protractor degree markings: -15°, -10°, -5°, 0°, +5°, +10°, +15° */}
          {[-15, -10, -5, 0, 5, 10, 15].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = pivotX + (protractorR - 5) * Math.sin(rad);
            const y1 = pivotY + (protractorR - 5) * Math.cos(rad);
            const x2 = pivotX + (protractorR + 3) * Math.sin(rad);
            const y2 = pivotY + (protractorR + 3) * Math.cos(rad);
            return (
              <g key={`tick-${deg}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1" />
                {Math.abs(deg) === 15 && (
                  <text
                    x={deg > 0 ? x2 + 3 : x2 - 14}
                    y={y2 + 4}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {deg > 0 ? `+${deg}°` : `${deg}°`}
                  </text>
                )}
              </g>
            );
          })}

          {/* Active angle sector fill (from 0 to currentAngleDeg) */}
          <path
            d={`M ${pivotX} ${pivotY} L ${pivotX + (protractorR - 2) * Math.sin(0)} ${pivotY + (protractorR - 2) * Math.cos(0)} A ${protractorR - 2} ${protractorR - 2} 0 0 ${currentAngleDeg >= 0 ? 1 : 0} ${pivotX + (protractorR - 2) * Math.sin(angleRad)} ${pivotY + (protractorR - 2) * Math.cos(angleRad)} Z`}
            fill="#6366f1"
            fillOpacity="0.25"
          />

          {/* VERTICAL EQUILIBRIUM REFERENCE LINE (Mean Position) */}
          <line
            x1={pivotX}
            y1={pivotY}
            x2={pivotX}
            y2={pivotY + pixelLength + bobRadius + 20}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={pivotX - 28}
            y={pivotY + pixelLength + bobRadius + 32}
            fill="#94a3b8"
            fontSize="10"
            fontFamily="monospace"
          >
            Mean (θ=0°)
          </text>

          {/* TRAJECTORY MOTION ARC (Faint dotted guide) */}
          <path
            d={`M ${arcLeftX} ${arcLeftY} A ${pixelLength} ${pixelLength} 0 0 0 ${arcRightX} ${arcRightY}`}
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* PENDULUM STRING (Inextensible cotton thread) */}
          <line
            x1={pivotX}
            y1={pivotY}
            x2={bobX}
            y2={bobY - bobRadius + 2}
            stroke="#f8fafc"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* PENDULUM BOB (Brass Sphere) */}
          <g>
            {/* Bob hook attached to string */}
            <circle
              cx={bobX}
              cy={bobY - bobRadius + 1}
              r="3.5"
              fill="none"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            {/* Solid brass spherical bob */}
            <circle
              cx={bobX}
              cy={bobY}
              r={bobRadius}
              fill="url(#brassBobGrad)"
              stroke="#854d0e"
              strokeWidth="1.5"
              className="filter drop-shadow-md"
            />
            {/* Center-of-mass indicator crosshair */}
            <circle cx={bobX} cy={bobY} r="2" fill="#451a03" />
            <line
              x1={bobX - 4}
              y1={bobY}
              x2={bobX + 4}
              y2={bobY}
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <line
              x1={bobX}
              y1={bobY - 4}
              x2={bobX}
              y2={bobY + 4}
              stroke="#451a03"
              strokeWidth="0.8"
            />
          </g>

          {/* METRIC LENGTH DIMENSION RULER (On the right side of the bench) */}
          <g className="text-slate-400 font-mono text-[10px]">
            {/* Vertical dimension line with arrowheads */}
            <line
              x1="390"
              y1={pivotY}
              x2="390"
              y2={pivotY + pixelLength}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            {/* Top guide horizontal line */}
            <line x1={pivotX + 20} y1={pivotY} x2="415" y2={pivotY} stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
            {/* Bottom guide horizontal line (at center of bob) */}
            <line x1={bobX + bobRadius + 5} y1={bobY} x2="415" y2={bobY} stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
            {/* Arrow caps */}
            <polygon points={`387,${pivotY + 6} 390,${pivotY} 393,${pivotY + 6}`} fill="#94a3b8" />
            <polygon points={`387,${pivotY + pixelLength - 6} 390,${pivotY + pixelLength} 393,${pivotY + pixelLength - 6}`} fill="#94a3b8" />

            {/* Length Label Box */}
            <rect
              x="396"
              y={pivotY + pixelLength / 2 - 18}
              width="90"
              height="34"
              rx="4"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1"
            />
            <text x="402" y={pivotY + pixelLength / 2 - 4} fill="#94a3b8" fontSize="9" fontFamily="monospace">
              Effective L:
            </text>
            <text x="402" y={pivotY + pixelLength / 2 + 10} fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              {length.toFixed(2)} m
            </text>
          </g>

          {/* LIVE OSCILLATION HUD OVERLAY (Bottom of canvas) */}
          <g>
            <rect
              x="15"
              y="15"
              width="145"
              height="48"
              rx="6"
              fill="#0f172a"
              fillOpacity="0.85"
              stroke="#334155"
              strokeWidth="1"
            />
            <text x="25" y="32" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              Oscillations:
            </text>
            <text x="25" y="52" fill="#34d399" fontSize="15" fontWeight="bold" fontFamily="monospace">
              {oscillations} / {targetOscillations}
            </text>
          </g>

        </svg>
      </div>

      {/* Footer Simulation Status Bar */}
      <div className="w-full mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Motion:</span>
          <span className="text-slate-300">
            {isRunning ? 'Oscillating (Active SHM Loop)' : 'Stationary at Release Position'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Timer:</span>
          <span className="text-emerald-400 font-bold">{measuredTime.toFixed(3)} s</span>
        </div>
      </div>

    </div>
  );
};
