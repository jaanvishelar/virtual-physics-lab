import React from 'react';
import { Sliders, Focus, PlusCircle, RotateCcw, Sparkles } from 'lucide-react';

interface LensControlsProps {
  uMagnitude: number;
  screenPos: number;
  onObjectDistanceChange: (dist: number) => void;
  onScreenPosChange: (pos: number) => void;
  onRecordReading: () => void;
  onReset: () => void;
  calculatedV: number;
  isVirtual: boolean;
  isAtFocus: boolean;
}

export const LensControls: React.FC<LensControlsProps> = ({
  uMagnitude,
  screenPos,
  onObjectDistanceChange,
  onScreenPosChange,
  onRecordReading,
  onReset,
  calculatedV,
  isVirtual,
  isAtFocus,
}) => {
  const handlePreset = (dist: number) => {
    onObjectDistanceChange(dist);
    // If real image, also adjust screen near focus
    const u = -dist;
    const f = 20;
    if (dist > f) {
      const v = (f * u) / (u + f);
      if (v > 0 && v <= 120) {
        onScreenPosChange(Number(v.toFixed(1)));
      }
    }
  };

  const handleAutoFocus = () => {
    if (!isVirtual && !isAtFocus && calculatedV > 0 && calculatedV <= 120) {
      onScreenPosChange(Number(calculatedV.toFixed(1)));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Optical Bench Controls
          </h3>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 transition-colors"
          title="Reset apparatus to standard starting position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Bench</span>
        </button>
      </div>

      {/* Primary Variable Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Object Distance Slider |u| */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Object Distance |u|
            </label>
            <span className="text-sm font-bold font-mono px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
              u = -{uMagnitude.toFixed(1)} cm
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="100"
            step="1"
            value={uMagnitude}
            onChange={(e) => onObjectDistanceChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>15 cm (Inside F)</span>
            <span>40 cm (2F)</span>
            <span>60 cm</span>
            <span>100 cm</span>
          </div>
        </div>

        {/* Screen Position Slider */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Screen Position (Right of Lens)
            </label>
            <span className="text-sm font-bold font-mono px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
              +{screenPos.toFixed(1)} cm
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="120"
            step="0.5"
            value={screenPos}
            onChange={(e) => onScreenPosChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>+15 cm</span>
            <span>+40 cm (2F′)</span>
            <span>+60 cm</span>
            <span>+120 cm</span>
          </div>
        </div>
      </div>

      {/* Key Pedagogical Presets */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
          Standard Pedagogical Conjugate Positions:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <button
            onClick={() => handlePreset(60)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              uMagnitude === 60
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="font-bold">Beyond 2F</div>
            <div className="text-[10px] text-slate-500">u = -60 cm &rarr; v = +30 cm</div>
          </button>

          <button
            onClick={() => handlePreset(40)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              uMagnitude === 40
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="font-bold">At 2F (Unit Mag.)</div>
            <div className="text-[10px] text-slate-500">u = -40 cm &rarr; v = +40 cm</div>
          </button>

          <button
            onClick={() => handlePreset(30)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              uMagnitude === 30
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="font-bold">Between F and 2F</div>
            <div className="text-[10px] text-slate-500">u = -30 cm &rarr; v = +60 cm</div>
          </button>

          <button
            onClick={() => handlePreset(15)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              uMagnitude === 15
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="font-bold">Inside F (Virtual)</div>
            <div className="text-[10px] text-amber-700">u = -15 cm (Magnifier)</div>
          </button>
        </div>
      </div>

      {/* Action Buttons: Auto-Focus & Record Reading */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          onClick={handleAutoFocus}
          disabled={isVirtual || isAtFocus || calculatedV <= 0 || calculatedV > 120}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
            isVirtual || isAtFocus || calculatedV <= 0 || calculatedV > 120
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 shadow-2xs hover:shadow-xs cursor-pointer'
          }`}
        >
          <Focus className="w-4 h-4" />
          <span>Auto-Focus Screen to Image (v = +{calculatedV > 0 && !isAtFocus ? calculatedV.toFixed(1) : '--'} cm)</span>
        </button>

        <button
          onClick={onRecordReading}
          disabled={isVirtual || isAtFocus}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold font-sans transition-all shadow-sm ${
            isVirtual || isAtFocus
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-200 hover:shadow-md cursor-pointer'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Current Reading</span>
        </button>
      </div>
    </div>
  );
};
