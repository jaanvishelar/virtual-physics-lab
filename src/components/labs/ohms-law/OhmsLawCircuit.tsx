import React from 'react';
import { AnalogMeter } from './AnalogMeter';
import { ToggleLeft, ToggleRight, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OhmsLawCircuitProps {
  voltage: number;
  resistance: number;
  current: number;
  isSwitchOn: boolean;
  onToggleSwitch: () => void;
  rheostatResistance: number;
}

export const OhmsLawCircuit: React.FC<OhmsLawCircuitProps> = ({
  voltage,
  resistance,
  current,
  isSwitchOn,
  onToggleSwitch,
  rheostatResistance,
}) => {
  const activeCurrent = isSwitchOn ? current : 0;
  const activeVoltage = isSwitchOn ? voltage : 0;

  return (
    <div className="bg-slate-900/95 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-lg relative flex flex-col justify-between overflow-hidden">
      {/* Circuit Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
              Virtual Laboratory Circuit Bench
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Standard Series-Parallel Experimental Apparatus Arrangement
          </p>
        </div>

        {/* Switch Control Button & Indicator */}
        <div className="flex items-center gap-3">
          <button
            id="btn-circuit-switch"
            onClick={onToggleSwitch}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              isSwitchOn
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                : 'bg-rose-900/80 hover:bg-rose-800 text-rose-200 ring-1 ring-rose-700'
            }`}
          >
            {isSwitchOn ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-200" />
                <span>SWITCH: ON (KEY INSERTED)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-rose-300" />
                <span>SWITCH: OFF (KEY OPEN)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Circuit SVG Canvas */}
      <div className="relative my-4 w-full aspect-[16/10] max-h-[460px] bg-slate-950/90 rounded-xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 760 460"
          className="w-full h-full select-none"
          aria-label="Schematic and realistic visual of Ohm's Law circuit"
        >
          <defs>
            {/* Gradient for copper wires */}
            <linearGradient id="wire-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            
            {/* Pattern for ceramic resistor body */}
            <pattern id="resistor-stripes" width="10" height="20" patternUnits="userSpaceOnUse">
              <rect width="5" height="20" fill="#78350f" />
              <rect x="5" width="5" height="20" fill="#92400e" />
            </pattern>

            {/* Current animation style */}
            <style>
              {`
                @keyframes currentFlowClockwise {
                  from { stroke-dashoffset: 48; }
                  to { stroke-dashoffset: 0; }
                }
                .active-flow {
                  animation: currentFlowClockwise 1.2s linear infinite;
                }
              `}
            </style>
          </defs>

          {/* BACKGROUND LABORATORY GRID */}
          <g opacity="0.08">
            {Array.from({ length: 19 }).map((_, i) => (
              <line key={`gx-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="460" stroke="#94a3b8" strokeWidth="1" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`gy-${i}`} x1="0" y1={i * 40} x2="760" y2={i * 40} stroke="#94a3b8" strokeWidth="1" />
            ))}
          </g>

          {/* MAIN CIRCUIT WIRES (Base loop) */}
          {/* Coordinates:
              Top-Left: (120, 80) Battery
              Top-Center: (380, 80) Plug Key
              Top-Right: (640, 80) Ammeter
              Right-Mid: (640, 240) Rheostat
              Bottom: (640, 360) -> (120, 360) Resistor branch
              Left-Mid: (120, 360) -> (120, 80) Return to Battery
          */}
          
          {/* Base wire trace (dark background wire) */}
          <path
            d="M 170 80 L 320 80 M 420 80 L 570 80 M 670 80 L 670 190 M 670 290 L 670 370 L 480 370 M 280 370 L 120 370 L 120 120"
            fill="none"
            stroke="#334155"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Voltmeter Parallel Branch Wires */}
          <path
            d="M 290 370 L 290 280 L 330 280 M 430 280 L 470 280 L 470 370"
            fill="none"
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ACTIVE FLOWING CURRENT ANIMATION (when switch is ON) */}
          {isSwitchOn && (
            <>
              {/* Main loop flowing pulse */}
              <path
                d="M 170 80 L 320 80 M 420 80 L 570 80 M 670 80 L 670 190 M 670 290 L 670 370 L 480 370 M 280 370 L 120 370 L 120 120"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="8 8"
                className="active-flow"
                strokeLinecap="round"
              />
              {/* Voltmeter branch flowing pulse */}
              <path
                d="M 290 370 L 290 280 L 330 280 M 430 280 L 470 280 L 470 370"
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                strokeDasharray="6 6"
                className="active-flow"
                strokeLinecap="round"
              />

              {/* Directional current arrows along conductors */}
              <g fill="#38bdf8">
                {/* Top rail: moving left to right */}
                <polygon points="245,77 255,80 245,83" />
                <polygon points="505,77 515,80 505,83" />
                {/* Right rail: moving top to bottom */}
                <polygon points="667,145 670,155 673,145" />
                <polygon points="667,335 670,345 673,335" />
                {/* Bottom rail: moving right to left */}
                <polygon points="565,367 555,370 565,373" />
                <polygon points="215,367 205,370 215,373" />
                {/* Left rail: moving bottom to top */}
                <polygon points="117,245 120,235 123,245" />
              </g>
            </>
          )}

          {/* 1. DC POWER SUPPLY (Top-Left) */}
          <g id="circuit-component-powersupply" transform="translate(60, 40)">
            <rect x="0" y="0" width="110" height="80" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <rect x="8" y="8" width="94" height="24" rx="4" fill="#0f172a" />
            <text x="55" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
              {voltage.toFixed(1)} V DC
            </text>
            <text x="55" y="46" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="sans-serif" fontWeight="600">
              DC Power Supply
            </text>
            {/* Terminals */}
            <circle cx="25" cy="62" r="7" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <text x="25" y="65" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">+</text>
            <circle cx="85" cy="62" r="7" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="85" y="65" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">-</text>
            <text x="55" y="73" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
              0–12V Regulated
            </text>
          </g>

          {/* 2. PLUG KEY / SWITCH (Top-Center) */}
          <g
            id="circuit-component-switch"
            transform="translate(320, 50)"
            className="cursor-pointer group"
            onClick={onToggleSwitch}
          >
            {/* Insulated wooden block base */}
            <rect x="0" y="0" width="100" height="60" rx="8" fill="#451a03" stroke="#78350f" strokeWidth="1.5" />
            <text x="50" y="16" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
              PLUG KEY (K)
            </text>
            {/* Two brass terminal blocks */}
            <rect x="15" y="24" width="28" height="24" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1" />
            <rect x="57" y="24" width="28" height="24" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1" />
            
            {/* Plug hole / key insertion */}
            {isSwitchOn ? (
              // Closed key: metallic plug inserted in the gap
              <g>
                <circle cx="50" cy="36" r="11" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
                <circle cx="50" cy="36" r="5" fill="#451a03" />
                <rect x="44" y="28" width="12" height="16" rx="2" fill="#fcd34d" />
                <text x="50" y="55" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  [CLOSED: ON]
                </text>
              </g>
            ) : (
              // Open key: gap with plug lying beside or removed
              <g>
                <circle cx="50" cy="36" r="8" fill="#1e293b" stroke="#78350f" strokeWidth="1.5" />
                {/* Key unplugged beside block */}
                <rect x="52" y="-12" width="14" height="14" rx="3" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
                <circle cx="59" cy="-5" r="3" fill="#78350f" />
                <text x="50" y="55" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  [OPEN: OFF]
                </text>
              </g>
            )}
          </g>

          {/* 3. AMMETER (Top-Right, in Series) */}
          <g id="circuit-component-ammeter" transform="translate(570, 40)">
            <rect x="0" y="0" width="100" height="80" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="50" cy="35" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Meter Scale Arc */}
            <path d="M 33 42 A 20 20 0 0 1 67 42" fill="none" stroke="#64748b" strokeWidth="1" />
            {/* Ammeter Needle */}
            {(() => {
              const fraction = Math.min(activeCurrent / 2.5, 1);
              const angle = -45 + fraction * 90;
              const rad = (angle - 90) * (Math.PI / 180);
              const nx = 50 + 19 * Math.cos(rad);
              const ny = 40 + 19 * Math.sin(rad);
              return (
                <line x1="50" y1="40" x2={nx} y2={ny} stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
              );
            })()}
            <circle cx="50" cy="40" r="2.5" fill="#0f172a" />
            <text x="50" y="27" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">A</text>
            <text x="50" y="70" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {activeCurrent.toFixed(3)} A
            </text>
            <text x="50" y="12" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">
              AMMETER (SERIES)
            </text>
          </g>

          {/* 4. RHEOSTAT (Right-Middle) */}
          <g id="circuit-component-rheostat" transform="translate(620, 190)">
            {/* Rheostat body */}
            <rect x="0" y="0" width="100" height="100" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="50" y="15" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">
              Rheostat (Rh)
            </text>
            {/* Coiled cylinder representation */}
            <rect x="15" y="24" width="70" height="40" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
            {/* Winding coils */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`coil-${i}`} x1={20 + i * 5} y1="24" x2={20 + i * 5} y2="64" stroke="#94a3b8" strokeWidth="1.5" />
            ))}
            {/* Sliding contact bar and arrow */}
            <rect x="10" y="20" width="80" height="4" fill="#e2e8f0" />
            <polygon points="55,18 65,18 60,26" fill="#f59e0b" />
            <text x="50" y="78" textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace">
              {rheostatResistance.toFixed(0)} Ω (Fine Adjust)
            </text>
            <text x="50" y="90" textAnchor="middle" fill="#64748b" fontSize="7">
              Current Stabilizer
            </text>
          </g>

          {/* 5. VOLTMETER (Branched in Parallel, Middle-Bottom) */}
          <g id="circuit-component-voltmeter" transform="translate(330, 240)">
            <rect x="0" y="0" width="100" height="80" rx="10" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
            <circle cx="50" cy="35" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Voltmeter Scale Arc */}
            <path d="M 33 42 A 20 20 0 0 1 67 42" fill="none" stroke="#64748b" strokeWidth="1" />
            {/* Voltmeter Needle */}
            {(() => {
              const fraction = Math.min(activeVoltage / 15.0, 1);
              const angle = -45 + fraction * 90;
              const rad = (angle - 90) * (Math.PI / 180);
              const nx = 50 + 19 * Math.cos(rad);
              const ny = 40 + 19 * Math.sin(rad);
              return (
                <line x1="50" y1="40" x2={nx} y2={ny} stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
              );
            })()}
            <circle cx="50" cy="40" r="2.5" fill="#0f172a" />
            <text x="50" y="27" textAnchor="middle" fill="#4f46e5" fontSize="10" fontWeight="bold">V</text>
            <text x="50" y="70" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {activeVoltage.toFixed(2)} V
            </text>
            <text x="50" y="12" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">
              VOLTMETER (PARALLEL)
            </text>
          </g>

          {/* 6. TEST RESISTOR / RESISTANCE WIRE (Bottom-Center, across voltmeter) */}
          <g id="circuit-component-resistor" transform="translate(280, 340)">
            {/* Ceramic mounting board */}
            <rect x="0" y="0" width="200" height="60" rx="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
            <text x="100" y="14" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">
              Standard Resistance Wire / Coil (R)
            </text>
            
            {/* Resistance wire coil / zigzag representation */}
            <path
              d="M 20 30 L 40 30 L 50 20 L 70 40 L 90 20 L 110 40 L 130 20 L 150 40 L 160 30 L 180 30"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Brass binding posts on the resistor terminals */}
            <circle cx="20" cy="30" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <circle cx="180" cy="30" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />

            <text x="100" y="52" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">
              R = {resistance.toFixed(1)} Ω (Constantan)
            </text>
          </g>

          {/* Parallel junction dots */}
          <circle cx="290" cy="370" r="5" fill="#818cf8" stroke="#ffffff" strokeWidth="1" />
          <circle cx="470" cy="370" r="5" fill="#818cf8" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>

      {/* Real-time Status Callout */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          {isSwitchOn ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">Closed Circuit &bull; Steady Current Flowing</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300">Open Circuit &bull; Switch is OFF (Current I = 0.000 A)</span>
            </>
          )}
        </div>
        <div className="text-slate-400">
          Formula: <span className="text-indigo-300 font-bold">I = V / R</span> = {voltage.toFixed(1)} V / {resistance.toFixed(1)} Ω = <span className="text-emerald-400 font-bold">{activeCurrent.toFixed(3)} A</span>
        </div>
      </div>
    </div>
  );
};
