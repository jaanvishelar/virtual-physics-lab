import React from 'react';
import { Timer, Calculator, CheckCircle2, Activity } from 'lucide-react';

interface PendulumReadingsProps {
  length: number;
  oscillations: number;
  targetOscillations: number;
  measuredTime: number;
  isRunning: boolean;
  isCompleted: boolean;
}

export const PendulumReadings: React.FC<PendulumReadingsProps> = ({
  length,
  oscillations,
  targetOscillations,
  measuredTime,
  isRunning,
  isCompleted
}) => {
  // Calculations derived purely from simulation state
  const hasMeasurement = measuredTime > 0 && oscillations > 0;
  
  // Single period T = t / N
  const calculatedT = hasMeasurement
    ? measuredTime / oscillations
    : null;

  // Period squared T²
  const calculatedTSquared = calculatedT !== null
    ? calculatedT * calculatedT
    : null;

  // Progress percentage toward target N oscillations
  const progressPercent = Math.min(100, Math.round((oscillations / targetOscillations) * 100));

  return (
    <div id="pendulum-readings-card" className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-slate-200">
            Live Instrument Readings
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          {isRunning ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono animate-pulse">
              <Activity className="w-3 h-3 text-emerald-400" />
              Timing Active
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
              <CheckCircle2 className="w-3 h-3 text-indigo-400" />
              N Reached
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Main Meter Readings */}
      <div className="space-y-3 font-mono text-xs">
        
        {/* 1. Digital Stopwatch */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">Total Measured Time (t):</div>
            <div className="text-[10px] text-slate-500 font-sans">High precision digital timer</div>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tracking-wider">
              {measuredTime.toFixed(3)}
            </span>
            <span className="text-xs text-slate-400 ml-1">s</span>
          </div>
        </div>

        {/* 2. Oscillation Counter & Progress */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 text-[11px]">Complete Oscillations (N):</span>
            <span className="text-base font-bold text-indigo-300 font-mono">
              {oscillations} <span className="text-xs text-slate-500">/ {targetOscillations}</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 3. Time Period (T = t / N) */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">Time Period (T = t / N):</div>
            <div className="text-[10px] text-slate-500 font-sans">Duration of 1 full cycle</div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-amber-300 font-mono">
              {calculatedT !== null ? calculatedT.toFixed(3) : '—'}
            </span>
            <span className="text-xs text-slate-400 ml-1">s</span>
          </div>
        </div>

        {/* 4. Time Period Squared (T²) */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px]">Period Squared (T²):</div>
            <div className="text-[10px] text-slate-500 font-sans">Quantity for linear regression</div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-sky-300 font-mono">
              {calculatedTSquared !== null ? calculatedTSquared.toFixed(3) : '—'}
            </span>
            <span className="text-xs text-slate-400 ml-1">s²</span>
          </div>
        </div>

      </div>

      {/* Analytical Calculation Breakdown Box */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
        <div className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase text-[10px] pb-1 border-b border-slate-800">
          <Calculator className="w-3.5 h-3.5" />
          <span>Active Step-by-Step Calculation</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Effective Length (L):</span>
          <span className="font-bold text-white">{length.toFixed(2)} m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Total Measured Time (t):</span>
          <span className="font-bold text-white">{measuredTime.toFixed(3)} s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Number of Oscillations (N):</span>
          <span className="font-bold text-white">{oscillations}</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-slate-800">
          <span className="text-slate-500">T = t / N:</span>
          <span className="font-bold text-amber-300">
            {hasMeasurement
              ? `${measuredTime.toFixed(3)} / ${oscillations} = ${(measuredTime / oscillations).toFixed(3)} s`
              : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">T²:</span>
          <span className="font-bold text-sky-300">
            {calculatedTSquared !== null ? `${calculatedTSquared.toFixed(3)} s²` : '—'}
          </span>
        </div>
      </div>

    </div>
  );
};
