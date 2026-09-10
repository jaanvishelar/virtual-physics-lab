import React from 'react';
import {
  Sliders,
  Plus,
  Minus,
  RotateCcw,
  BookmarkPlus,
  Scale,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HookeControlsProps {
  massGrams: number;
  onMassChange: (val: number) => void;
  onAddLoad: () => void;
  onRemoveLoad: () => void;
  onReset: () => void;
  onRecordReading: () => void;
  hasRecordedCurrent: boolean;
}

export const HookeControls: React.FC<HookeControlsProps> = ({
  massGrams,
  onMassChange,
  onAddLoad,
  onRemoveLoad,
  onReset,
  onRecordReading,
  hasRecordedCurrent,
}) => {
  const PRESETS = [0, 50, 100, 150, 200, 250, 300];

  return (
    <div id="hooke-controls-panel" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Experiment Controls
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Load Actuator &bull; Slotted Weights
        </span>
      </div>

      {/* 1. Applied Mass Slider (0 to 500 g) */}
      <div className="my-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Applied Suspended Mass (m)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
              {massGrams} g
            </span>
            <span className="text-xs font-mono text-slate-500">
              ({(massGrams / 1000).toFixed(3)} kg)
            </span>
          </div>
        </div>

        <input
          id="slider-applied-mass"
          type="range"
          min="0"
          max="500"
          step="10"
          value={massGrams}
          onChange={(e) => onMassChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-600 mt-1.5">
          <span>0 g (Unloaded x₀)</span>
          <span>250 g</span>
          <span>500 g (Max Range)</span>
        </div>

        {/* Preset Mass Chips */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-mono text-slate-600 block mb-2">
            Standard Lab Weight Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((val) => (
              <button
                key={val}
                id={`btn-preset-mass-${val}`}
                onClick={() => onMassChange(val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  massGrams === val
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {val === 0 ? '0 g (x₀)' : `${val} g`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Step Increments (Add / Remove Load) & Reset */}
      <div className="grid grid-cols-3 gap-2.5 my-4">
        <button
          id="btn-remove-load"
          onClick={onRemoveLoad}
          disabled={massGrams <= 0}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Decrease load by 50 g"
        >
          <Minus className="w-3.5 h-3.5" />
          <span>-50 g</span>
        </button>

        <button
          id="btn-add-load"
          onClick={onAddLoad}
          disabled={massGrams >= 500}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold font-mono bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Increase load by 50 g"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+50 g</span>
        </button>

        <button
          id="btn-reset-mass"
          onClick={onReset}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Reset to 0 g reference"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 3. Record Reading Button */}
      <div className="mt-5 pt-4 border-t border-slate-200">
        <button
          id="btn-record-hooke-reading"
          onClick={onRecordReading}
          disabled={hasRecordedCurrent}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
            hasRecordedCurrent
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-not-allowed opacity-90'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.99]'
          }`}
        >
          {hasRecordedCurrent ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Current Load Recorded in Table</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              <span>Record Observation ({massGrams} g)</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 mt-2 px-1">
          <span>{hasRecordedCurrent ? 'Load tabulated' : 'Click to tabulate observation'}</span>
          <span>F = {((massGrams / 1000) * 9.81).toFixed(3)} N</span>
        </div>
      </div>

    </div>
  );
};
