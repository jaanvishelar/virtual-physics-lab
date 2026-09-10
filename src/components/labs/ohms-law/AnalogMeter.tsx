import React from 'react';

interface AnalogMeterProps {
  id: string;
  type: 'ammeter' | 'voltmeter';
  value: number;
  max: number;
  unit: string;
  label: string;
  isActive: boolean;
}

export const AnalogMeter: React.FC<AnalogMeterProps> = ({
  id,
  type,
  value,
  max,
  unit,
  label,
  isActive,
}) => {
  // Angle calculations: Scale sweeps from -50 degrees (0) to +50 degrees (max)
  const clampedValue = Math.max(0, Math.min(value, max));
  const fraction = max > 0 ? clampedValue / max : 0;
  const needleAngle = -50 + fraction * 100;

  // Major ticks (e.g., 5 intervals) and minor ticks
  const numMajorTicks = 5;
  const majorTicks = Array.from({ length: numMajorTicks + 1 }, (_, i) => {
    const val = ((max * i) / numMajorTicks).toFixed(type === 'ammeter' ? 2 : 1);
    const angle = -50 + (i / numMajorTicks) * 100;
    return { val, angle };
  });

  const numMinorTicks = 25;
  const minorTicks = Array.from({ length: numMinorTicks + 1 }, (_, i) => {
    const angle = -50 + (i / numMinorTicks) * 100;
    return { angle };
  });

  const isAmmeter = type === 'ammeter';
  const meterSymbol = isAmmeter ? 'A' : 'V';
  const strokeColor = isAmmeter ? '#0284c7' : '#4f46e5';

  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 flex flex-col items-center select-none"
    >
      <div className="w-full flex items-center justify-between px-1 mb-1">
        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-500">
          {label}
        </span>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold transition-colors ${
            isActive
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          {isActive ? 'MEASURING' : 'CIRCUIT OPEN'}
        </span>
      </div>

      {/* Circular Instrument Dial */}
      <div className="relative w-44 h-32 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 200 145"
          className="w-full h-full"
          aria-label={`${label} dial displaying ${clampedValue} ${unit}`}
        >
          <defs>
            {/* Mirror strip anti-parallax gradient */}
            <linearGradient id={`mirror-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.3" />
            </linearGradient>
            {/* Glass reflection */}
            <linearGradient id={`bezel-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>

          {/* Dial Face Frame */}
          <rect
            x="8"
            y="8"
            width="184"
            height="130"
            rx="12"
            fill="url(#bezel-)"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          <rect
            x="14"
            y="14"
            width="172"
            height="118"
            rx="8"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="1"
          />

          {/* Mirror strip for parallax reduction (authentic physics apparatus detail) */}
          <path
            d="M 40 82 A 75 75 0 0 1 160 82 L 156 87 A 70 70 0 0 0 44 87 Z"
            fill={`url(#mirror-${id})`}
          />

          {/* Scale Arc Line */}
          <path
            d="M 38 78 A 78 78 0 0 1 162 78"
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Minor Ticks */}
          {minorTicks.map((tick, i) => {
            const rad = (tick.angle - 90) * (Math.PI / 180);
            const x1 = 100 + 78 * Math.cos(rad);
            const y1 = 125 + 78 * Math.sin(rad);
            const x2 = 100 + 73 * Math.cos(rad);
            const y2 = 125 + 73 * Math.sin(rad);
            return (
              <line
                key={`min-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                strokeWidth="1"
              />
            );
          })}

          {/* Major Ticks and Values */}
          {majorTicks.map((tick, i) => {
            const rad = (tick.angle - 90) * (Math.PI / 180);
            const x1 = 100 + 78 * Math.cos(rad);
            const y1 = 125 + 78 * Math.sin(rad);
            const x2 = 100 + 68 * Math.cos(rad);
            const y2 = 125 + 68 * Math.sin(rad);
            const tx = 100 + 58 * Math.cos(rad);
            const ty = 125 + 58 * Math.sin(rad);

            return (
              <g key={`maj-${i}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#334155"
                  strokeWidth="1.75"
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="600"
                  fill="#475569"
                >
                  {tick.val}
                </text>
              </g>
            );
          })}

          {/* Meter Symbol Badge in Center */}
          <circle cx="100" cy="98" r="11" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
          <text
            x="100"
            y="99"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontFamily="sans-serif"
            fontWeight="bold"
            fill={strokeColor}
          >
            {meterSymbol}
          </text>
          <text
            x="100"
            y="112"
            textAnchor="middle"
            fontSize="5.5"
            fontFamily="monospace"
            fill="#94a3b8"
          >
            DC {type === 'ammeter' ? 'SERIES' : 'PARALLEL'}
          </text>

          {/* Moving Needle */}
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: '100px 125px',
              transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Pointer shadow */}
            <line
              x1="100"
              y1="125"
              x2="100"
              y2="42"
              stroke="#000000"
              strokeOpacity="0.15"
              strokeWidth="2.5"
              transform="translate(1, 1)"
            />
            {/* Needle shaft */}
            <line
              x1="100"
              y1="125"
              x2="100"
              y2="42"
              stroke="#dc2626"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            {/* Needle counterweight */}
            <line
              x1="100"
              y1="125"
              x2="100"
              y2="136"
              stroke="#dc2626"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Center Pivot Boss */}
          <circle cx="100" cy="125" r="5" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="100" cy="125" r="2" fill="#94a3b8" />

          {/* Polarized Binding Terminals Representation */}
          <circle cx="28" cy="128" r="4" fill="#ef4444" />
          <text x="28" y="129" textAnchor="middle" dominantBaseline="central" fontSize="5" fontWeight="bold" fill="#ffffff">+</text>

          <circle cx="172" cy="128" r="4" fill="#1e293b" />
          <text x="172" y="129" textAnchor="middle" dominantBaseline="central" fontSize="6" fontWeight="bold" fill="#ffffff">-</text>
        </svg>
      </div>

      {/* Digital Readout Strip Below Dial */}
      <div className="w-full mt-2 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 rounded-lg font-mono">
        <span className="text-[11px] text-slate-400">READING:</span>
        <span className="text-sm font-bold tracking-wider text-emerald-400">
          {isActive ? clampedValue.toFixed(type === 'ammeter' ? 3 : 2) : '0.000'}{' '}
          <span className="text-xs text-slate-300 font-normal">{unit}</span>
        </span>
      </div>
    </div>
  );
};
