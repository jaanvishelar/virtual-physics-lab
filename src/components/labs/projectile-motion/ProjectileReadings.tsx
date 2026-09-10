import React from 'react';
import { Gauge, Clock, Ruler, ArrowRight, ArrowUp, Activity, CheckCircle, Percent } from 'lucide-react';

interface ProjectileReadingsProps {
  velocity: number;
  angle: number;
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

      {/* Primary Real-Time Readout Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
        {/* Initial Velocity */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Initial Velocity (u)</span>
          <span className="text-base font-bold text-slate-900">{velocity.toFixed(1)}</span>
          <span className="text-slate-500 ml-1 text-xs">m/s</span>
        </div>

        {/* Launch Angle */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block uppercase font-sans">Launch Angle (θ)</span>
          <span className="text-base font-bold text-slate-900">{angle.toFixed(1)}°</span>
          <span className="text-slate-500 ml-1 text-xs">degrees</span>
        </div>

        {/* Elapsed Flight Timer */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block uppercase font-sans flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-500" />
            <span>Elapsed Time (t)</span>
          </span>
          <span className="text-base font-bold text-indigo-700">{currentTime.toFixed(2)}</span>
          <span className="text-slate-500 ml-1 text-xs">s</span>
        </div>

        {/* Instantaneous Speed */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block uppercase font-sans flex items-center gap-1">
            <Gauge className="w-3 h-3 text-sky-500" />
            <span>Current Speed (v)</span>
          </span>
          <span className="text-base font-bold text-sky-700">{currentSpeed.toFixed(2)}</span>
          <span className="text-slate-500 ml-1 text-xs">m/s</span>
        </div>
      </div>

      {/* Coordinate & Velocity Component Breakdown */}
      <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-mono space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-sans flex items-center gap-1">
            <ArrowRight className="w-3 h-3 text-emerald-600" />
            Horizontal Coordinate x:
          </span>
          <span className="font-bold text-slate-900">{currentX.toFixed(2)} m</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-sans flex items-center gap-1">
            <ArrowUp className="w-3 h-3 text-sky-600" />
            Vertical Coordinate y:
          </span>
          <span className="font-bold text-slate-900">{currentY.toFixed(2)} m</span>
        </div>

        <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
          <span>vₓ = u · cos(θ) = {currentVx.toFixed(2)} m/s</span>
          <span>vᵧ = u · sin(θ) - gt = {currentVy.toFixed(2)} m/s</span>
        </div>
      </div>

      {/* Theoretical Model & Calculated Results */}
      <div className="space-y-2.5 pt-1">
        <h4 className="text-xs font-bold font-sans text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5 text-indigo-600" />
          <span>Calculated Theoretical Benchmarks</span>
        </h4>

        <div className="space-y-1.5 text-xs font-mono">
          {/* Time of Flight */}
          <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <span className="text-indigo-950 font-sans text-xs">
              Time of Flight T = 2u·sin(θ)/g:
            </span>
            <span className="font-bold text-indigo-700">{timeOfFlight.toFixed(2)} s</span>
          </div>

          {/* Maximum Height */}
          <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between">
            <span className="text-amber-950 font-sans text-xs">
              Maximum Height H = u²·sin²(θ)/(2g):
            </span>
            <span className="font-bold text-amber-700">{maxHeight.toFixed(2)} m</span>
          </div>

          {/* Theoretical Range */}
          <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <span className="text-emerald-950 font-sans text-xs">
              Horizontal Range R = u²·sin(2θ)/g:
            </span>
            <span className="font-bold text-emerald-700">{theoreticalRange.toFixed(2)} m</span>
          </div>
        </div>
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
