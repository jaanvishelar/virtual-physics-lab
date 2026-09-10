import React from 'react';
import { Play, Pause, RotateCcw, PlusCircle, Compass, Gauge, ShieldCheck, Check } from 'lucide-react';

interface ProjectileControlsProps {
  velocity: number;
  onVelocityChange: (val: number) => void;
  angle: number;
  onAngleChange: (val: number) => void;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  onLaunch: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onRecordTrial: () => void;
  isDuplicate: boolean;
  hasRecordedCurrent: boolean;
}

export const ProjectileControls: React.FC<ProjectileControlsProps> = ({
  velocity,
  onVelocityChange,
  angle,
  onAngleChange,
  isRunning,
  isPaused,
  isCompleted,
  onLaunch,
  onPause,
  onResume,
  onReset,
  onRecordTrial,
  isDuplicate,
  hasRecordedCurrent,
}) => {
  const velocityPresets = [10, 20, 30, 40];
  const anglePresets = [15, 30, 45, 60, 75];

  const canEdit = !isRunning && !isPaused;

  return (
    <div id="projectile-controls-panel" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">
            Kinematic Actuator Controls
          </h3>
        </div>

        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
          Earth Gravity g = 9.81 m/s²
        </span>
      </div>

      {/* Control 1: Initial Velocity (u) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="input-velocity" className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span>Initial Velocity (u)</span>
            <span className="text-slate-400 font-normal">[5 – 50 m/s]</span>
          </label>
          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-xs">
            {velocity} m/s
          </span>
        </div>

        <input
          id="input-velocity"
          type="range"
          min="5"
          max="50"
          step="1"
          value={velocity}
          disabled={!canEdit}
          onChange={(e) => onVelocityChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Velocity Presets */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 mr-1">Presets:</span>
          {velocityPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={!canEdit}
              onClick={() => onVelocityChange(preset)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                velocity === preset
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {preset} m/s
            </button>
          ))}
        </div>
      </div>

      {/* Control 2: Launch Angle (θ) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="input-angle" className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Launch Angle (θ)</span>
            <span className="text-slate-400 font-normal">[5° – 85°]</span>
          </label>
          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
            {angle}°
          </span>
        </div>

        <input
          id="input-angle"
          type="range"
          min="5"
          max="85"
          step="1"
          value={angle}
          disabled={!canEdit}
          onChange={(e) => onAngleChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Angle Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 mr-1">Presets:</span>
          {anglePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={!canEdit}
              onClick={() => onAngleChange(preset)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                angle === preset
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {preset}° {preset === 45 && '★ Max'}
            </button>
          ))}
        </div>
      </div>

      {/* Gravity Display (Fixed Earth g) */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span className="text-slate-600 font-medium">Gravitational Field (Fixed Earth):</span>
        </div>
        <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
          g = 9.81 m/s²
        </span>
      </div>

      {/* Primary Action Buttons: Launch, Pause/Resume, Reset */}
      <div className="pt-2 grid grid-cols-3 gap-2">
        {!isRunning && !isPaused ? (
          <button
            id="btn-launch-projectile"
            type="button"
            onClick={onLaunch}
            className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Projectile</span>
          </button>
        ) : isPaused ? (
          <button
            id="btn-resume-projectile"
            type="button"
            onClick={onResume}
            className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Flight</span>
          </button>
        ) : (
          <button
            id="btn-pause-projectile"
            type="button"
            onClick={onPause}
            className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>Pause Flight</span>
          </button>
        )}

        <button
          id="btn-reset-projectile"
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
          title="Reset to origin"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Record Trial Action Button */}
      <div className="pt-1">
        <button
          id="btn-record-trial"
          type="button"
          disabled={!isCompleted || hasRecordedCurrent || isDuplicate}
          onClick={onRecordTrial}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
            hasRecordedCurrent || isDuplicate
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs animate-pulse'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          {hasRecordedCurrent || isDuplicate ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Trial Already Recorded in Table</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Record Trial to Table ({angle}°, {velocity} m/s)</span>
            </>
          )}
        </button>

        {!isCompleted && !isRunning && !isPaused && (
          <p className="text-[11px] text-slate-400 text-center mt-1.5">
            Launch and allow projectile to touch down before recording observation.
          </p>
        )}
      </div>

    </div>
  );
};
