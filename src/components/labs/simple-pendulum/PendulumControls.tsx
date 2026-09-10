import React from 'react';
import {
  Sliders,
  Play,
  Square,
  RotateCcw,
  BookmarkPlus,
  Compass,
  Repeat
} from 'lucide-react';

interface PendulumControlsProps {
  length: number;
  onLengthChange: (val: number) => void;
  initialAngle: number;
  onInitialAngleChange: (val: number) => void;
  targetOscillations: number;
  onTargetOscillationsChange: (val: number) => void;
  isRunning: boolean;
  isCompleted: boolean;
  hasRecordedCurrent: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onRecordReading: () => void;
}

export const PendulumControls: React.FC<PendulumControlsProps> = ({
  length,
  onLengthChange,
  initialAngle,
  onInitialAngleChange,
  targetOscillations,
  onTargetOscillationsChange,
  isRunning,
  isCompleted,
  hasRecordedCurrent,
  onStart,
  onStop,
  onReset,
  onRecordReading
}) => {
  const PRESET_LENGTHS = [0.40, 0.60, 0.80, 1.00];

  return (
    <div id="pendulum-controls-panel" className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Experiment Controls
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Variables &amp; Actuators
        </span>
      </div>

      {/* 1. Pendulum Length Slider (0.20m to 1.50m) */}
      <div className="my-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <span>Pendulum Length (L)</span>
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
              {length.toFixed(2)} m
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({(length * 100).toFixed(0)} cm)
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0.20"
          max="1.50"
          step="0.01"
          value={length}
          disabled={isRunning}
          onChange={(e) => onLengthChange(parseFloat(e.target.value))}
          className={`w-full h-2 bg-slate-200 rounded-lg appearance-none accent-indigo-600 focus:outline-none ${
            isRunning ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          }`}
          aria-label="Adjust pendulum length in metres"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>0.20 m</span>
          <span>0.85 m</span>
          <span>1.50 m</span>
        </div>

        {/* Fine Adjustment & Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
            <span>Presets:</span>
            {PRESET_LENGTHS.map((pLen) => (
              <button
                key={pLen}
                disabled={isRunning}
                onClick={() => onLengthChange(pLen)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  Math.abs(length - pLen) < 0.005
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
                }`}
              >
                {pLen.toFixed(2)}m
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={isRunning || length <= 0.21}
              onClick={() => onLengthChange(Math.max(0.20, Number((length - 0.05).toFixed(2))))}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold disabled:opacity-40"
              title="Decrease length by 0.05 m"
            >
              -0.05
            </button>
            <button
              disabled={isRunning || length >= 1.49}
              onClick={() => onLengthChange(Math.min(1.50, Number((length + 0.05).toFixed(2))))}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold disabled:opacity-40"
              title="Increase length by 0.05 m"
            >
              +0.05
            </button>
          </div>
        </div>
      </div>

      {/* 2. Initial Release Angle Slider (5° to 15°, default 10°) */}
      <div className="mb-5 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Initial Angular Amplitude (θ₀)</span>
          </label>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {initialAngle.toFixed(1)}°
          </span>
        </div>

        <input
          type="range"
          min="5"
          max="15"
          step="1"
          value={initialAngle}
          disabled={isRunning}
          onChange={(e) => onInitialAngleChange(parseFloat(e.target.value))}
          className={`w-full h-2 bg-slate-200 rounded-lg appearance-none accent-amber-600 focus:outline-none ${
            isRunning ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          }`}
          aria-label="Adjust initial angular amplitude in degrees"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>5° (Strict SHM)</span>
          <span>10° (Standard)</span>
          <span>15° (Max Small Angle)</span>
        </div>
      </div>

      {/* 3. Number of Oscillations Selector (5, 10, 20) */}
      <div className="mb-6 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-emerald-600" />
            <span>Number of Oscillations (N)</span>
          </label>
          <span className="text-xs font-mono text-slate-500">
            Target Count: <strong className="text-slate-800">{targetOscillations}</strong>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[5, 10, 20].map((nVal) => (
            <button
              key={nVal}
              disabled={isRunning}
              onClick={() => onTargetOscillationsChange(nVal)}
              className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
                targetOscillations === nVal
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 disabled:opacity-50'
              }`}
            >
              {nVal} Oscillations
            </button>
          ))}
        </div>
      </div>

      {/* 4. Action Buttons (START, STOP, RESET, RECORD READING) */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        
        {/* Primary Actuator Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* START button */}
          <button
            id="btn-start-pendulum"
            onClick={onStart}
            disabled={isRunning}
            className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              !isRunning
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START</span>
          </button>

          {/* STOP button */}
          <button
            id="btn-stop-pendulum"
            onClick={onStop}
            disabled={!isRunning}
            className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP</span>
          </button>

          {/* RESET button */}
          <button
            id="btn-reset-pendulum"
            onClick={onReset}
            className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-all border border-slate-200 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>

        {/* RECORD READING button */}
        <button
          id="btn-record-reading"
          onClick={onRecordReading}
          disabled={!isCompleted || hasRecordedCurrent}
          className={`w-full py-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
            isCompleted && !hasRecordedCurrent
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-98'
              : hasRecordedCurrent
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>
            {hasRecordedCurrent
              ? 'Observation Already Recorded'
              : isCompleted
              ? 'RECORD READING TO TABLE'
              : 'Complete Measurement to Record'}
          </span>
        </button>

        <p className="text-[11px] text-slate-500 font-mono text-center">
          {isRunning
            ? 'Timing in progress... Bob will oscillate until N completed.'
            : isCompleted
            ? 'Oscillations completed! Click "Record Reading" to log data.'
            : 'Press START to release bob from resting angle.'}
        </p>

      </div>

    </div>
  );
};
