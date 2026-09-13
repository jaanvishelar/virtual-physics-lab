import React from 'react';
import { Gauge, Clock, Ruler, ArrowRight, ArrowUp, Activity, CheckCircle, Info } from 'lucide-react';

interface ProjectileReadingsProps {
  velocity: number;
  angle: number;
  launchHeight?: number;
  gravity?: number;
  currentTime: number;
  currentX: number;
  currentY: number;
  currentVx: number;
  currentVy: number;
  timeOfFlight: number;
  maxHeight: number;
  theoreticalRange: number;
  isCompleted: boolean;
}

export const ProjectileReadings: React.FC<ProjectileReadingsProps> = ({
  velocity,
  angle,
  launchHeight = 0,
  gravity = 9.81,
  currentTime,
  currentX,
  currentY,
  currentVx,
  currentVy,
  timeOfFlight,
  maxHeight,
  theoreticalRange,
  isCompleted,
}) => {
  const currentSpeed = Math.sqrt(currentVx * currentVx + currentVy * currentVy);
  const rad = (angle * Math.PI) / 180;
  const ux = velocity * Math.cos(rad);
  const uy = velocity * Math.sin(rad);

  // Peak height above the launch point
  const heightAboveLaunch = (uy * uy) / (2 * gravity);

  // Numerical comparison when trial completes
  const diffRange = isCompleted ? Math.abs(currentX - theoreticalRange) : 0;
  const pctDiff = isCompleted && theoreticalRange > 0 ? (diffRange / theoreticalRange) * 100 : 0;

  return (
    <div id="projectile-readings-card" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">
            Live Instrument HUD &amp; Calculations
          </h3>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          Precision: ±0.01
        </span>
      </div>

      {/* Primary Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        {/* Initial Velocity */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Initial Velocity (u)</span>
          <span className="text-base font-bold text-slate-900">{velocity.toFixed(2)}</span>
          <span className="text-slate-500 ml-1 text-xs">m/s</span>
        </div>

        {/* Launch Angle */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Launch Angle (θ)</span>
          <span className="text-base font-bold text-slate-900">{angle.toFixed(1)}°</span>
        </div>

        {/* Launch Height */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Launch Height (h)</span>
          <span className={`text-base font-bold ${launchHeight > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
            {launchHeight.toFixed(2)}
          </span>
          <span className="text-slate-500 ml-1 text-xs">m</span>
        </div>

        {/* Gravity */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Gravity (g)</span>
          <span className="text-base font-bold text-slate-900">{gravity.toFixed(2)}</span>
          <span className="text-slate-500 ml-1 text-xs">m/s²</span>
        </div>
      </div>

      {/* Flight Dynamics (Real-Time) */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
        {/* Elapsed Flight Timer */}
        <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
          <span className="text-[10px] text-indigo-500 block uppercase font-sans flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Elapsed Time (t)</span>
          </span>
          <span className="text-base font-bold text-indigo-700">{currentTime.toFixed(2)}</span>
          <span className="text-indigo-500 ml-1 text-xs">s</span>
        </div>

        {/* Instantaneous Speed */}
        <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100">
          <span className="text-[10px] text-sky-500 block uppercase font-sans flex items-center gap-1">
            <Gauge className="w-3 h-3" />
            <span>Current Speed (v)</span>
          </span>
          <span className="text-base font-bold text-sky-700">{currentSpeed.toFixed(2)}</span>
          <span className="text-sky-500 ml-1 text-xs">m/s</span>
        </div>
      </div>

      {/* Coordinate & Velocity Component Breakdown */}
      <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-mono space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-sans flex items-center gap-1">
            <ArrowRight className="w-3 h-3 text-emerald-600" />
            Horizontal Coordinate x(t):
          </span>
          <span className="font-bold text-slate-900">{currentX.toFixed(2)} m</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-sans flex items-center gap-1">
            <ArrowUp className="w-3 h-3 text-sky-600" />
            Vertical Coordinate y(t):
          </span>
          <span className="font-bold text-slate-900">{currentY.toFixed(2)} m</span>
        </div>

        <div className="pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
          <span>uₓ = u · cos(θ) = <strong>{ux.toFixed(2)} m/s</strong> (constant)</span>
          <span>uᵧ = u · sin(θ) = <strong>{uy.toFixed(2)} m/s</strong></span>
        </div>
      </div>

      {/* Theoretical Model & Calculated Results */}
      <div className="space-y-2.5 pt-1">
        <h4 className="text-xs font-bold font-sans text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5 text-indigo-600" />
          <span>Calculated Theoretical Benchmarks</span>
        </h4>

        <div className="space-y-2 text-xs font-mono">
          {/* Time of Flight */}
          <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-indigo-950 font-sans text-xs font-semibold block">
                Time of Flight (T):
              </span>
              <span className="text-[10px] text-indigo-600">
                {launchHeight === 0
                  ? 'T = 2u·sin(θ) / g'
                  : 'T = [u·sin(θ) + √((u·sinθ)² + 2gh)] / g'}
              </span>
            </div>
            <span className="font-bold text-indigo-700 text-sm">{timeOfFlight.toFixed(2)} s</span>
          </div>

          {/* Maximum Height above Ground */}
          <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-amber-950 font-sans text-xs font-semibold block">
                Maximum Height (Above Ground Datum):
              </span>
              <span className="text-[10px] text-amber-700">
                {launchHeight === 0
                  ? 'H = (u·sinθ)² / (2g)'
                  : `H_ground = h + (u·sinθ)² / (2g) = ${launchHeight.toFixed(2)}m + ${heightAboveLaunch.toFixed(2)}m`}
              </span>
            </div>
            <span className="font-bold text-amber-700 text-sm">{maxHeight.toFixed(2)} m</span>
          </div>

          {/* Maximum Height above Launch Point */}
          {launchHeight > 0 && (
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-sans">
                Peak Height above Launch Point (H_launch):
              </span>
              <span className="font-bold text-slate-800">{heightAboveLaunch.toFixed(2)} m</span>
            </div>
          )}

          {/* Theoretical Range */}
          <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-emerald-950 font-sans text-xs font-semibold block">
                Horizontal Range (R):
              </span>
              <span className="text-[10px] text-emerald-700">
                {launchHeight === 0
                  ? 'R = u²·sin(2θ) / g'
                  : 'R = u·cos(θ) · T'}
              </span>
            </div>
            <span className="font-bold text-emerald-700 text-sm">{theoreticalRange.toFixed(2)} m</span>
          </div>
        </div>
      </div>

      {/* Educational Physics Explanations (Requirements 8 & 9) */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Physical Explanation</span>
        </div>
        <p className="leading-relaxed">
          &ldquo;When the projectile is launched from a greater height, it takes longer to reach the ground because it has a greater vertical distance to fall. This generally increases the time of flight and therefore can increase the horizontal range when the horizontal velocity is unchanged.&rdquo;
        </p>
        <p className="leading-relaxed text-slate-600 border-t border-slate-200/70 pt-2">
          &ldquo;The maximum height reported here is measured from the ground. The maximum height above the launch point is calculated separately from the projectile’s vertical motion.&rdquo;
        </p>
      </div>

      {/* Post-Flight Deviation Verification */}
      {isCompleted && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Flight Verification at Ground Contact (y = 0 m)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-emerald-950">
            <div>
              <span className="text-emerald-700 block">Simulated Range:</span>
              <span className="font-bold">{currentX.toFixed(2)} m</span>
            </div>
            <div>
              <span className="text-emerald-700 block">Difference |R_sim - R_theo|:</span>
              <span className="font-bold">{diffRange.toFixed(4)} m</span>
            </div>
          </div>
          <p className="text-[11px] text-emerald-800 font-sans pt-1 border-t border-emerald-200/60">
            Percentage Deviation: <strong className="font-mono">{pctDiff.toFixed(2)}%</strong> (reflects continuous time integration).
          </p>
        </div>
      )}

    </div>
  );
};
