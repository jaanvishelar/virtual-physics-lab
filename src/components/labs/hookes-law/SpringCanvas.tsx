import React from 'react';

interface SpringCanvasProps {
  massGrams: number; // 0 to 500 g
  force: number; // Applied force F = mg (N)
  extensionMeters: number; // Extension x (m)
  extensionCm: number; // Extension x (cm)
  theoreticalK: number; // 20 N/m
}

export const SpringCanvas: React.FC<SpringCanvasProps> = ({
  massGrams,
  force,
  extensionMeters,
  extensionCm,
  theoreticalK,
}) => {
  // SVG viewport
  const svgWidth = 520;
  const svgHeight = 580;

  // Stand and Suspension Geometry
  const standX = 65;
  const baseBottomY = 540;
  const clampY = 65;
  const springAnchorX = 195;
  const springAnchorY = 82;

  // Scale: 1 cm on vertical ruler = 10 px
  // At mass = 0 g, extension = 0 cm, pointer sits at y = 220
  const zeroRefY = 220;
  const pxPerCm = 10.5; // Slightly scaled for comfortable viewport
  const extensionPx = extensionCm * pxPerCm;
  const pointerY = zeroRefY + extensionPx;

  // Helical Spring Path Generation
  const springTopY = springAnchorY + 12; // Start of coil
  const springBottomY = pointerY - 14; // End of coil
  const coilHeight = springBottomY - springTopY;
  const numberOfCoils = 14;
  const coilRadius = 15;

  // Generate SVG path for helical spring
  const generateSpringPath = () => {
    let d = `M ${springAnchorX} ${springAnchorY} L ${springAnchorX} ${springTopY} `;
    const segmentHeight = coilHeight / numberOfCoils;

    for (let i = 0; i < numberOfCoils; i++) {
      const yStart = springTopY + i * segmentHeight;
      const yMid = yStart + segmentHeight / 2;
      const yEnd = yStart + segmentHeight;

      // Draw each coil loop with cubic Bezier for smooth spring curvature
      d += `C ${springAnchorX - coilRadius * 1.3} ${yStart + segmentHeight * 0.2}, ` +
           `${springAnchorX - coilRadius * 1.3} ${yMid}, ` +
           `${springAnchorX} ${yMid} `;
      d += `C ${springAnchorX + coilRadius * 1.3} ${yMid}, ` +
           `${springAnchorX + coilRadius * 1.3} ${yEnd - segmentHeight * 0.2}, ` +
           `${springAnchorX} ${yEnd} `;
    }

    d += `L ${springAnchorX} ${pointerY}`;
    return d;
  };

  // Ruler Geometry
  const rulerX = 265;
  const rulerWidth = 55;
  const rulerTopY = 170;
  const rulerBottomY = 530;

  // Marks on ruler in cm (-2 to 28 cm)
  const rulerMarks = [];
  for (let cm = 0; cm <= 26; cm += 1) {
    const markY = zeroRefY + cm * pxPerCm;
    if (markY <= rulerBottomY) {
      rulerMarks.push({ cm, y: markY, isMajor: cm % 2 === 0 });
    }
  }

  // Calculate number of slotted 50g discs (each disc is ~6px tall)
  const discCount = Math.min(10, Math.floor(massGrams / 50));
  const hangerPanY = pointerY + 65;

  const isNearingLimit = massGrams > 350;

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col items-center">
      
      {/* Simulation Header & Status Badges */}
      <div className="w-full flex items-center justify-between z-10 mb-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Helical Spring Apparatus &bull; k = {theoreticalK.toFixed(0)} N/m
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
              isNearingLimit
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isNearingLimit ? 'Upper Elastic Range' : 'Elastic / Linear Region'}
          </span>
        </div>
      </div>

      {/* Main SVG Laboratory Canvas */}
      <div className="relative w-full flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[520px] h-auto select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Metallic Linear Gradients */}
            <linearGradient id="standRodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="clampGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="springGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="30%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="rulerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="70%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            <filter id="canvasGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Pattern */}
          <pattern id="bgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
          <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="url(#bgGrid)" opacity="0.6" />

          {/* RETORT STAND BASE */}
          <rect
            x="20"
            y={baseBottomY}
            width="170"
            height="22"
            rx="4"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {/* Beveled stand base top */}
          <rect
            x="25"
            y={baseBottomY - 4}
            width="160"
            height="5"
            rx="2"
            fill="#334155"
          />
          <text
            x="105"
            y={baseBottomY + 15}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="1"
          >
            RETORT STAND BASE
          </text>

          {/* VERTICAL CHROME ROD */}
          <rect
            x={standX - 6}
            y="35"
            width="12"
            height={baseBottomY - 35}
            rx="3"
            fill="url(#standRodGrad)"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* CLAMP ASSEMBLY */}
          <g>
            {/* Clamp Boss Head on vertical rod */}
            <rect
              x={standX - 12}
              y={clampY - 8}
              width="24"
              height="30"
              rx="3"
              fill="url(#clampGrad)"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* Tightening knob */}
            <circle cx={standX - 16} cy={clampY + 7} r="6" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <line x1={standX - 22} y1={clampY + 7} x2={standX - 10} y2={clampY + 7} stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Horizontal Clamp Arm extending to spring anchor */}
            <rect
              x={standX + 12}
              y={clampY}
              width={springAnchorX - standX - 12 + 18}
              height="14"
              rx="2"
              fill="url(#standRodGrad)"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Suspension hook attachment block */}
            <rect
              x={springAnchorX - 8}
              y={clampY - 4}
              width="16"
              height="22"
              rx="2"
              fill="url(#clampGrad)"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* Fixed suspension loop */}
            <path
              d={`M ${springAnchorX} ${clampY + 18} Q ${springAnchorX} ${springAnchorY} ${springAnchorX} ${springAnchorY}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* VERTICAL METRE SCALE / RULER */}
          <g>
            {/* Wooden/Plastic Ruler Body */}
            <rect
              x={rulerX}
              y={rulerTopY}
              width={rulerWidth}
              height={rulerBottomY - rulerTopY}
              rx="3"
              fill="url(#rulerGrad)"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Anti-parallax Mirror Strip in middle of ruler */}
            <rect
              x={rulerX + 10}
              y={rulerTopY + 10}
              width="12"
              height={rulerBottomY - rulerTopY - 20}
              fill="#cbd5e1"
              opacity="0.6"
              stroke="#94a3b8"
              strokeWidth="0.5"
            />
            {/* Mirror reflection streak */}
            <line
              x1={rulerX + 16}
              y1={rulerTopY + 15}
              x2={rulerX + 16}
              y2={rulerBottomY - 15}
              stroke="#f8fafc"
              strokeWidth="1"
              strokeDasharray="10 20"
            />

            {/* Ruler Header Title */}
            <text
              x={rulerX + rulerWidth / 2}
              y={rulerTopY - 8}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              SCALE (cm)
            </text>

            {/* Graduations & Numbers */}
            {rulerMarks.map((mark) => (
              <g key={mark.cm}>
                {/* Major or Minor Tick */}
                <line
                  x1={rulerX}
                  y1={mark.y}
                  x2={rulerX + (mark.isMajor ? 14 : 7)}
                  y2={mark.y}
                  stroke={mark.cm === 0 ? '#ef4444' : '#1e293b'}
                  strokeWidth={mark.cm === 0 ? 2 : mark.isMajor ? 1.2 : 0.75}
                />

                {/* Sub-millimeter ticks (half cm) */}
                <line
                  x1={rulerX}
                  y1={mark.y + pxPerCm / 2}
                  x2={rulerX + 5}
                  y2={mark.y + pxPerCm / 2}
                  stroke="#64748b"
                  strokeWidth="0.5"
                />

                {/* Number Labels for Major cm */}
                {mark.isMajor && (
                  <text
                    x={rulerX + rulerWidth - 8}
                    y={mark.y + 3.5}
                    textAnchor="end"
                    fill={mark.cm === 0 ? '#ef4444' : '#1e293b'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight={mark.cm === 0 ? 'bold' : 'normal'}
                  >
                    {mark.cm}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* INITIAL ZERO LOAD (x₀) REFERENCE LINE */}
          <g>
            <line
              x1="160"
              y1={zeroRefY}
              x2={rulerX + 8}
              y2={zeroRefY}
              stroke="#ef4444"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.85"
            />
            {/* Zero tag badge */}
            <rect
              x="130"
              y={zeroRefY - 9}
              width="26"
              height="16"
              rx="3"
              fill="#ef4444"
              opacity="0.9"
            />
            <text
              x="143"
              y={zeroRefY + 2.5}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              x₀
            </text>
          </g>

          {/* EXTENSION BRACKET & ANNOTATION (Only if extension > 0) */}
          {extensionCm > 0.1 && (
            <g>
              {/* Vertical dimension span line */}
              <line
                x1={rulerX + rulerWidth + 14}
                y1={zeroRefY}
                x2={rulerX + rulerWidth + 14}
                y2={pointerY}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              {/* Top and bottom bracket ticks */}
              <line
                x1={rulerX + rulerWidth + 8}
                y1={zeroRefY}
                x2={rulerX + rulerWidth + 20}
                y2={zeroRefY}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <line
                x1={rulerX + rulerWidth + 8}
                y1={pointerY}
                x2={rulerX + rulerWidth + 20}
                y2={pointerY}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />

              {/* Dynamic Extension Callout Box */}
              <rect
                x={rulerX + rulerWidth + 24}
                y={(zeroRefY + pointerY) / 2 - 18}
                width="112"
                height="36"
                rx="6"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1"
              />
              <text
                x={rulerX + rulerWidth + 80}
                y={(zeroRefY + pointerY) / 2 - 5}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                x = {extensionCm.toFixed(2)} cm
              </text>
              <text
                x={rulerX + rulerWidth + 80}
                y={(zeroRefY + pointerY) / 2 + 10}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
              >
                ({extensionMeters.toFixed(4)} m)
              </text>
            </g>
          )}

          {/* HELICAL SPRING COIL */}
          <path
            d={generateSpringPath()}
            fill="none"
            stroke="url(#springGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'd 0.25s cubic-bezier(0.2, 0.8, 0.3, 1)',
            }}
          />

          {/* HORIZONTAL POINTER ASSEMBLY */}
          <g
            style={{
              transform: `translateY(0px)`,
              transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.3, 1)',
            }}
          >
            {/* Clamp collar on bottom of spring */}
            <circle cx={springAnchorX} cy={pointerY} r="4.5" fill="#334155" stroke="#94a3b8" strokeWidth="1" />

            {/* Horizontal pointer rod */}
            <line
              x1={springAnchorX}
              y1={pointerY}
              x2={rulerX - 2}
              y2={pointerY}
              stroke="#ef4444"
              strokeWidth="2"
            />

            {/* Fine pointer needle tip touching ruler */}
            <polygon
              points={`${rulerX - 2},${pointerY - 3.5} ${rulerX + 4},${pointerY} ${rulerX - 2},${pointerY + 3.5}`}
              fill="#ef4444"
            />

            {/* Pointer reflection on mirror strip */}
            <circle
              cx={rulerX + 16}
              cy={pointerY}
              r="2.5"
              fill="#f87171"
              opacity="0.75"
            />
          </g>

          {/* WEIGHT HANGER & SLOTTED MASSES */}
          <g
            style={{
              transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.3, 1)',
            }}
          >
            {/* Hanger suspension loop */}
            <path
              d={`M ${springAnchorX} ${pointerY} L ${springAnchorX} ${pointerY + 12}`}
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Vertical Hanger Rod */}
            <line
              x1={springAnchorX}
              y1={pointerY + 12}
              x2={springAnchorX}
              y2={hangerPanY}
              stroke="url(#brassGrad)"
              strokeWidth="3"
            />

            {/* Base Pan of Hanger (counts as support) */}
            <rect
              x={springAnchorX - 22}
              y={hangerPanY}
              width="44"
              height="6"
              rx="2"
              fill="url(#brassGrad)"
              stroke="#78350f"
              strokeWidth="1"
            />

            {/* Slotted Weights Stacked on the pan */}
            {Array.from({ length: discCount }).map((_, idx) => {
              const discHeight = 6;
              const discY = hangerPanY - (idx + 1) * (discHeight + 1);
              return (
                <g key={idx}>
                  {/* Slotted disc body */}
                  <rect
                    x={springAnchorX - 20}
                    y={discY}
                    width="40"
                    height={discHeight}
                    rx="1.5"
                    fill="url(#brassGrad)"
                    stroke="#78350f"
                    strokeWidth="0.8"
                  />
                  {/* Center slot slit */}
                  <line
                    x1={springAnchorX - 1}
                    y1={discY}
                    x2={springAnchorX - 1}
                    y2={discY + discHeight}
                    stroke="#451a03"
                    strokeWidth="1.2"
                  />
                  {/* 50g text on top disc */}
                  {idx === discCount - 1 && (
                    <text
                      x={springAnchorX + 11}
                      y={discY + 4.5}
                      textAnchor="middle"
                      fill="#78350f"
                      fontSize="5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      50g
                    </text>
                  )}
                </g>
              );
            })}

            {/* Total Hanging Mass Tag */}
            <g>
              <rect
                x={springAnchorX - 35}
                y={hangerPanY + 10}
                width="70"
                height="22"
                rx="4"
                fill="#0f172a"
                stroke="#eab308"
                strokeWidth="1"
              />
              <text
                x={springAnchorX}
                y={hangerPanY + 24}
                textAnchor="middle"
                fill="#fde047"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                m = {massGrams} g
              </text>
            </g>
          </g>

          {/* LIVE OVERLAY HUD (Bottom-left of canvas) */}
          <g transform="translate(20, 420)">
            <rect
              x="0"
              y="0"
              width="130"
              height="80"
              rx="8"
              fill="#0f172a"
              opacity="0.95"
              stroke="#334155"
              strokeWidth="1"
            />
            <text x="12" y="18" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              SIMULATED FORCES
            </text>
            <text x="12" y="36" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
              Mass: <tspan fill="#fde047" fontWeight="bold">{massGrams} g</tspan>
            </text>
            <text x="12" y="52" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
              F = mg: <tspan fill="#38bdf8" fontWeight="bold">{force.toFixed(3)} N</tspan>
            </text>
            <text x="12" y="68" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
              Ext x: <tspan fill="#4ade80" fontWeight="bold">{extensionCm.toFixed(2)} cm</tspan>
            </text>
          </g>

        </svg>
      </div>

      {/* Educational Note Below Canvas */}
      <div className="w-full mt-2 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-red-400 font-bold">x₀</span>
          <span>= Unloaded Reference Level (0.0 cm)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sky-400 font-bold">x</span>
          <span>= Elongation from x₀ under tensile load</span>
        </div>
      </div>

    </div>
  );
};
