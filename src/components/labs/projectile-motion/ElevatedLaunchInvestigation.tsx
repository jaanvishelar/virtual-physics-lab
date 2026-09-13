import React, { useState } from 'react';
import { Building2, Info, ArrowRight, Sliders, CheckCircle2 } from 'lucide-react';

interface ElevatedLaunchInvestigationProps {
  velocity: number;
  angle: number;
  currentLaunchHeight: number;
  onSetLaunchHeight: (h: number) => void;
}

export const ElevatedLaunchInvestigation: React.FC<ElevatedLaunchInvestigationProps> = ({
  currentLaunchHeight,
  onSetLaunchHeight,
}) => {
  // Fixed controlled conditions for the Main Investigation:
  const invVelocity = 20; // 20 m/s
  const invAngle = 45; // 45 degrees
  const g = 9.81; // 9.81 m/s²

  // Student can also adjust the elevated launch height in this investigation
  const [investigationHeight, setInvestigationHeight] = useState<number>(12); // Default: 12 m (approx 4th floor)

  const rad = (invAngle * Math.PI) / 180;
  const ux = invVelocity * Math.cos(rad);
  const uy = invVelocity * Math.sin(rad);

  // 1. Baseline: Ground level (h = 0 m)
  const tGround = (2 * uy) / g;
  const rangeGround = ux * tGround;
  const hMaxGround = (uy * uy) / (2 * g);

  // 2. Elevated launch: h = investigationHeight
  const disc = uy * uy + 2 * g * investigationHeight;
  const tElevated = (uy + Math.sqrt(Math.max(0, disc))) / g;
  const rangeElevated = ux * tElevated;
  const hMaxElevated = investigationHeight + (uy * uy) / (2 * g);

  // Deltas
  const deltaT = tElevated - tGround;
  const deltaRange = rangeElevated - rangeGround;
  const deltaH = hMaxElevated - hMaxGround;

  return (
    <div id="investigation-launch-height" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 text-xs font-mono font-bold uppercase mb-1 border border-amber-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>Main Investigation</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Investigation: Effect of Launch Height on Projectile Motion
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            <strong>Research question:</strong> &ldquo;How does increasing the launch height affect the time of flight and horizontal range of a projectile?&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <span className="text-slate-500">Fixed:</span>
          <span className="font-bold text-slate-800">u = 20 m/s</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-800">θ = 45°</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-800">g = 9.81 m/s²</span>
        </div>
      </div>

      {/* Physics Principles & Equation */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>General Equation for Vertical Motion (Non-Zero Elevation):</span>
        </div>
        <div className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-center font-bold text-slate-800 text-xs sm:text-sm overflow-x-auto">
          y(t) = h + u·sin(θ)·t − ½·g·t²
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          When landing occurs at ground datum (<em>y = 0</em>) from height <em>h &gt; 0</em>, the time of flight is solved from the quadratic equation:
          <span className="font-mono ml-1 font-semibold text-slate-800">t = [u·sin(θ) + √((u·sin(θ))² + 2gh)] / g</span>.
          Because the projectile continues traveling horizontally as it descends below the launch level, an elevated launch yields both a longer flight time and an extended range.
        </p>
      </div>

      {/* Interactive Height Selector for Investigation */}
      <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-950">
            <Sliders className="w-4 h-4 text-amber-700" />
            <span>Adjust Elevated Launch Height (h) for Investigation:</span>
          </div>
          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
            h = {investigationHeight} m {investigationHeight === 12 && '(Approximate 4th-floor height)'}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={investigationHeight}
          onChange={(e) => setInvestigationHeight(Number(e.target.value))}
          className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
          <span className="text-slate-500 font-sans">Quick Presets:</span>
          <button
            type="button"
            onClick={() => setInvestigationHeight(3)}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              investigationHeight === 3
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            1st floor ≈ 3 m
          </button>
          <button
            type="button"
            onClick={() => setInvestigationHeight(6)}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              investigationHeight === 6
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            2nd floor ≈ 6 m
          </button>
          <button
            type="button"
            onClick={() => setInvestigationHeight(9)}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              investigationHeight === 9
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            3rd floor ≈ 9 m
          </button>
          <button
            type="button"
            onClick={() => setInvestigationHeight(12)}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer font-bold ${
              investigationHeight === 12
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
            }`}
          >
            4th floor ≈ 12 m (Default Comparison)
          </button>
          <button
            type="button"
            onClick={() => setInvestigationHeight(20)}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              investigationHeight === 20
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            Maximum = 20 m
          </button>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          Floor heights are approximate and can be adjusted for investigation. Real buildings vary by architecture and ceiling heights.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
          Theoretical Comparison Table: Ground Level vs Elevated Launch
        </h4>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-3 px-3.5 font-bold">Launch Height (h)</th>
                <th className="py-3 px-3.5 font-bold">Initial Velocity (u)</th>
                <th className="py-3 px-3.5 font-bold">Launch Angle (θ)</th>
                <th className="py-3 px-3.5 font-bold">Time of Flight (T)</th>
                <th className="py-3 px-3.5 font-bold">Maximum Height (H_max)</th>
                <th className="py-3 px-3.5 font-bold">Horizontal Range (R)</th>
                <th className="py-3 px-3.5 font-bold">Simulator Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1: Ground Level */}
              <tr className={currentLaunchHeight === 0 ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}>
                <td className="py-3 px-3.5 font-bold text-slate-900">
                  0 m <span className="text-[10px] text-slate-500 font-sans font-normal">(Ground level)</span>
                </td>
                <td className="py-3 px-3.5 text-slate-700">{invVelocity} m/s</td>
                <td className="py-3 px-3.5 text-slate-700">{invAngle}°</td>
                <td className="py-3 px-3.5 font-bold text-indigo-700">{tGround.toFixed(2)} s</td>
                <td className="py-3 px-3.5 text-slate-700">{hMaxGround.toFixed(2)} m</td>
                <td className="py-3 px-3.5 font-bold text-indigo-700">{rangeGround.toFixed(2)} m</td>
                <td className="py-3 px-3.5">
                  {currentLaunchHeight === 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active in Sim
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSetLaunchHeight(0)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
                    >
                      Apply 0 m to Sim
                    </button>
                  )}
                </td>
              </tr>

              {/* Row 2: Elevated Launch */}
              <tr className={currentLaunchHeight === investigationHeight ? 'bg-amber-50/60' : 'hover:bg-slate-50/50'}>
                <td className="py-3 px-3.5 font-bold text-amber-900">
                  {investigationHeight} m{' '}
                  <span className="text-[10px] text-amber-700 font-sans font-normal">
                    {investigationHeight === 12 ? '(Approximate 4th-floor height)' : '(Elevated)'}
                  </span>
                </td>
                <td className="py-3 px-3.5 text-slate-700">{invVelocity} m/s</td>
                <td className="py-3 px-3.5 text-slate-700">{invAngle}°</td>
                <td className="py-3 px-3.5 font-bold text-amber-800">{tElevated.toFixed(2)} s</td>
                <td className="py-3 px-3.5 text-slate-700">{hMaxElevated.toFixed(2)} m</td>
                <td className="py-3 px-3.5 font-bold text-amber-800">{rangeElevated.toFixed(2)} m</td>
                <td className="py-3 px-3.5">
                  {currentLaunchHeight === investigationHeight ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active in Sim
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSetLaunchHeight(investigationHeight)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 cursor-pointer"
                    >
                      Apply {investigationHeight} m to Sim
                    </button>
                  )}
                </td>
              </tr>

              {/* Row 3: Physical Difference (Delta) */}
              <tr className="bg-emerald-50/40 text-emerald-950 font-bold border-t border-emerald-200/60">
                <td className="py-2.5 px-3.5">Difference (Δ)</td>
                <td className="py-2.5 px-3.5 text-slate-500 font-normal">0 m/s (Constant)</td>
                <td className="py-2.5 px-3.5 text-slate-500 font-normal">0° (Constant)</td>
                <td className="py-2.5 px-3.5 text-emerald-700">+{deltaT.toFixed(2)} s</td>
                <td className="py-2.5 px-3.5 text-emerald-700">+{deltaH.toFixed(2)} m</td>
                <td className="py-2.5 px-3.5 text-emerald-700">+{deltaRange.toFixed(2)} m</td>
                <td className="py-2.5 px-3.5 text-[11px] font-sans text-emerald-800 font-medium">
                  +{((deltaRange / rangeGround) * 100).toFixed(1)}% Range Gain
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Findings Summary */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
        <strong className="text-slate-900 font-semibold">Key Finding:</strong> At equal initial speed (20 m/s) and angle (45°), elevating the launch point by {investigationHeight} meters extends the time of flight from {tGround.toFixed(2)} s to {tElevated.toFixed(2)} s (+{deltaT.toFixed(2)} s), enabling the projectile to travel an additional {deltaRange.toFixed(2)} meters horizontally before touchdown.
      </div>
    </div>
  );
};
