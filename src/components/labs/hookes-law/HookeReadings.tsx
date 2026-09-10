import React from 'react';
import { Gauge, Calculator, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface HookeReadingsProps {
  massGrams: number;
  massKg: number;
  force: number;
  extensionMeters: number;
  extensionCm: number;
  theoreticalK: number;
}

export const HookeReadings: React.FC<HookeReadingsProps> = ({
  massGrams,
  massKg,
  force,
  extensionMeters,
  extensionCm,
  theoreticalK,
}) => {
  const isZeroLoad = massGrams === 0;
  // Instantaneous k = F / x (only for non-zero load)
  const instantaneousK = !isZeroLoad && extensionMeters > 0
    ? force / extensionMeters
    : null;

  const isNearingLimit = massGrams > 350;

  return (
    <div id="hooke-readings-card" className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-mono font-bold tracking-wider uppercase text-slate-200">
            Live Instrument Readings &amp; Derivations
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          {isZeroLoad ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
              Zero Reference (x₀)
            </span>
          ) : isNearingLimit ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Nearing Limit
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Linear Elastic
            </span>
          )}
        </div>
      </div>

      {/* Primary Measurement Displays */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        
        {/* 1. Applied Force Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">
            Applied Force (F = mg)
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-sky-400 mt-1">
            {force.toFixed(3)}{' '}
            <span className="text-xs font-normal text-slate-400">N</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            {massGrams} g &bull; {massKg.toFixed(3)} kg &times; 9.81 m/s²
          </div>
        </div>

        {/* 2. Simulated Extension Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">
            Extension (x) from x₀
          </div>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 mt-1">
            {extensionCm.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">cm</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            x = {extensionMeters.toFixed(4)} m
          </div>
        </div>

      </div>

      {/* Instantaneous Ratio k = F / x */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-indigo-300 mb-1">
          <span className="flex items-center gap-1.5 font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Instantaneous Ratio (k = F / x)</span>
          </span>
          <span className="text-slate-400">Ref: {theoreticalK.toFixed(1)} N/m</span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div className="text-lg font-mono font-bold text-white">
            {instantaneousK !== null ? (
              <>
                {instantaneousK.toFixed(2)}{' '}
                <span className="text-xs text-indigo-300 font-normal">N/m</span>
              </>
            ) : (
              <span className="text-slate-500 text-sm italic">— (Zero Load Reference)</span>
            )}
          </div>
          <div className="text-right text-[11px] font-mono text-slate-400">
            {instantaneousK !== null ? (
              <span>{force.toFixed(3)} N &divide; {extensionMeters.toFixed(4)} m</span>
            ) : (
              <span>0 N / 0 m undefined</span>
            )}
          </div>
        </div>
      </div>

      {/* Physics Relationships Footer */}
      <div className="border-t border-slate-800 pt-3 text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
        <div>
          Governing Law: <span className="text-indigo-400 font-bold">F = k &bull; x</span>
        </div>
        <div>
          Rearranged: <span className="text-emerald-400 font-bold">k = F / x</span>
        </div>
      </div>

    </div>
  );
};
