import React from 'react';
import { ObservationReading, OhmsLawMode } from '../../../types';
import { OHMS_LAW_MODES } from '../../../data/ohmsLawData';
import { Plus, Trash2, RotateCcw, AlertTriangle, Sparkles, Layers, Clock } from 'lucide-react';

interface ObservationTableProps {
  observations: ObservationReading[];
  mode: OhmsLawMode;
  onSelectMode?: (mode: OhmsLawMode) => void;
  onAddObservation: () => void;
  onDeleteObservation: (id: string) => void;
  onClearObservations: (modeToClear: OhmsLawMode) => void;
  isSwitchOn: boolean;
  currentVoltage: number;
  currentResistance: number;
  currentCurrent: number;
  onLoadPreset: (v: number, i: number, r: number) => void;
  modeCounts?: Record<OhmsLawMode, number>;
}

export const ObservationTable: React.FC<ObservationTableProps> = ({
  observations,
  mode,
  onSelectMode,
  onAddObservation,
  onDeleteObservation,
  onClearObservations,
  isSwitchOn,
  currentVoltage,
  currentResistance,
  currentCurrent,
  onLoadPreset,
  modeCounts,
}) => {
  const currentConfig = OHMS_LAW_MODES[mode];

  // Mean calculations specific to active mode
  const meanCurrent =
    observations.length > 0
      ? (
          observations.reduce((sum, obs) => sum + obs.current, 0) /
          observations.length
        ).toFixed(3)
      : null;

  const meanResistance =
    observations.length > 0
      ? (
          observations.reduce((sum, obs) => sum + obs.resistance, 0) /
          observations.length
        ).toFixed(2)
      : null;

  const meanVoltage =
    observations.length > 0
      ? (
          observations.reduce((sum, obs) => sum + obs.voltage, 0) /
          observations.length
        ).toFixed(2)
      : null;

  return (
    <div id="observation-table-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Top Header and Mode Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
              {currentConfig.badge}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
              Formula: {currentConfig.formula}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {observations.length} {observations.length === 1 ? 'Reading' : 'Readings'} in {currentConfig.shortName}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Observation Table &mdash; {currentConfig.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Record experimental trials for {currentConfig.shortName}. Readings from different modes are preserved in dedicated partitions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-record-observation"
            onClick={onAddObservation}
            disabled={!isSwitchOn}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-xs focus:outline-none focus:ring-2 ${
              isSwitchOn
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title={isSwitchOn ? 'Record current simulation reading' : 'Turn circuit switch ON to record observation'}
          >
            <Plus className="w-4 h-4" />
            <span>Record Observation</span>
          </button>

          {observations.length > 0 && (
            <button
              id="btn-clear-observations"
              onClick={() => onClearObservations(mode)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
              title={`Clear observations for ${currentConfig.shortName}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear {currentConfig.shortName}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Navigation Tabs for Table (if onSelectMode provided) */}
      {onSelectMode && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
          {(['find-current', 'find-resistance', 'find-voltage'] as OhmsLawMode[]).map((mKey) => {
            const cfg = OHMS_LAW_MODES[mKey];
            const isSelected = mode === mKey;
            const count = modeCounts ? modeCounts[mKey] : 0;

            return (
              <button
                key={mKey}
                onClick={() => onSelectMode(mKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cfg.shortName}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Validation warning if switch is OFF */}
      {!isSwitchOn && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Circuit switch is currently open (OFF).</strong> Close the key (turn switch ON) on the virtual workbench above before recording a reading. In an open circuit, current is 0.000 A.
          </span>
        </div>
      )}

      {/* Recommended Verification Presets Bar for this mode */}
      <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-mono">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-semibold">Quick Laboratory Presets for {currentConfig.shortName}:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {currentConfig.presets.map((preset, pIdx) => (
            <button
              key={pIdx}
              onClick={() => onLoadPreset(preset.v, preset.i, preset.r)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 font-mono text-[11px] text-slate-700 hover:text-indigo-600 transition-colors shadow-2xs cursor-pointer"
              title={preset.note}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode-Adaptive Observation Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 mt-4">
        <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-mono text-xs border-b border-slate-200">
              <th className="py-3 px-4 font-bold text-center w-16">Sr. No.</th>
              
              {/* Column ordering tailored to the mode */}
              {mode === 'find-current' && (
                <>
                  <th className="py-3 px-4 font-bold">Potential Difference V (V)</th>
                  <th className="py-3 px-4 font-bold">Resistance R (Ω)</th>
                  <th className="py-3 px-4 font-bold text-emerald-700 bg-emerald-50/50">
                    Calculated Current I = V / R (A)
                  </th>
                </>
              )}

              {mode === 'find-resistance' && (
                <>
                  <th className="py-3 px-4 font-bold">Potential Difference V (V)</th>
                  <th className="py-3 px-4 font-bold">Electric Current I (A)</th>
                  <th className="py-3 px-4 font-bold text-amber-700 bg-amber-50/50">
                    Calculated Resistance R = V / I (Ω)
                  </th>
                </>
              )}

              {mode === 'find-voltage' && (
                <>
                  <th className="py-3 px-4 font-bold">Electric Current I (A)</th>
                  <th className="py-3 px-4 font-bold">Resistance R (Ω)</th>
                  <th className="py-3 px-4 font-bold text-indigo-700 bg-indigo-50/50">
                    Calculated Potential Diff V = I &times; R (V)
                  </th>
                </>
              )}

              <th className="py-3 px-4 font-bold text-slate-500">Logged Time</th>
              <th className="py-3 px-4 font-bold text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {observations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-mono text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="w-6 h-6 text-slate-300" />
                    <span>No observations recorded yet for <strong>{currentConfig.name}</strong>.</span>
                    <span className="text-slate-500">
                      Adjust input sliders or click a preset above, then click{' '}
                      <span className="font-bold text-indigo-600">"Record Observation"</span>.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              observations.map((obs, idx) => {
                const timeString = new Date(obs.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <tr
                    key={obs.id}
                    id={`obs-row-${obs.id}`}
                    className="hover:bg-indigo-50/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-slate-500 font-bold">
                      {idx + 1}
                    </td>

                    {/* Mode 1: V, R, and Calculated I */}
                    {mode === 'find-current' && (
                      <>
                        <td className="py-3 px-4 font-semibold text-indigo-900">
                          {obs.voltage.toFixed(2)} V
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {obs.resistance.toFixed(2)} Ω
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700 bg-emerald-50/30">
                          {obs.current.toFixed(3)} A
                        </td>
                      </>
                    )}

                    {/* Mode 2: V, I, and Calculated R */}
                    {mode === 'find-resistance' && (
                      <>
                        <td className="py-3 px-4 font-semibold text-indigo-900">
                          {obs.voltage.toFixed(2)} V
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">
                          {obs.current.toFixed(3)} A
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-700 bg-amber-50/30">
                          {obs.resistance.toFixed(2)} Ω
                        </td>
                      </>
                    )}

                    {/* Mode 3: I, R, and Calculated V */}
                    {mode === 'find-voltage' && (
                      <>
                        <td className="py-3 px-4 font-semibold text-emerald-700">
                          {obs.current.toFixed(3)} A
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {obs.resistance.toFixed(2)} Ω
                        </td>
                        <td className="py-3 px-4 font-bold text-indigo-700 bg-indigo-50/30">
                          {obs.voltage.toFixed(2)} V
                        </td>
                      </>
                    )}

                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {timeString}
                    </td>
                    
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteObservation(obs.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none cursor-pointer"
                        title="Delete this observation"
                        aria-label={`Delete observation ${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Observation Summary Statistics & Means */}
      {observations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="text-slate-600">
            Total {currentConfig.shortName} Trials: <span className="font-bold text-slate-900">{observations.length}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {mode === 'find-current' && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-semibold">
                Mean Current &#298; = <span className="font-bold text-emerald-700 text-sm">{meanCurrent} A</span>
              </div>
            )}

            {mode === 'find-resistance' && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-semibold">
                Mean Resistance R&#772; = <span className="font-bold text-amber-800 text-sm">{meanResistance} Ω</span>
              </div>
            )}

            {mode === 'find-voltage' && (
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 font-semibold">
                Mean Potential Diff V&#772; = <span className="font-bold text-indigo-700 text-sm">{meanVoltage} V</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
