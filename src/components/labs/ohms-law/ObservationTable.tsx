import React from 'react';
import { ObservationReading } from '../../../types';
import { Plus, Trash2, RotateCcw, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface ObservationTableProps {
  observations: ObservationReading[];
  onAddObservation: () => void;
  onDeleteObservation: (id: string) => void;
  onClearObservations: () => void;
  isSwitchOn: boolean;
  currentVoltage: number;
  currentResistance: number;
  currentCurrent: number;
  onLoadPreset: (voltage: number, resistance: number) => void;
}

export const ObservationTable: React.FC<ObservationTableProps> = ({
  observations,
  onAddObservation,
  onDeleteObservation,
  onClearObservations,
  isSwitchOn,
  currentVoltage,
  currentResistance,
  currentCurrent,
  onLoadPreset,
}) => {
  // Average calculation
  const averageResistance =
    observations.length > 0
      ? (
          observations.reduce((sum, obs) => sum + obs.resistance, 0) /
          observations.length
        ).toFixed(2)
      : null;

  return (
    <div id="observation-table-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Header and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
              Data Logging
            </span>
            <span className="text-xs font-mono text-slate-500">
              {observations.length} {observations.length === 1 ? 'Reading' : 'Readings'} Logged
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Laboratory Observation Table
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Log live meter readings from the circuit bench to verify linear proportionality and evaluate resistance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-record-observation"
            onClick={onAddObservation}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-xs focus:outline-none focus:ring-2 ${
              isSwitchOn
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
            title={isSwitchOn ? 'Record current simulation reading' : 'Turn switch ON first to record reading'}
          >
            <Plus className="w-4 h-4" />
            <span>Record Observation</span>
          </button>

          {observations.length > 0 && (
            <button
              id="btn-clear-observations"
              onClick={onClearObservations}
              className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none"
              title="Clear all recorded observations"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Validation warning if switch is OFF */}
      {!isSwitchOn && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Circuit switch is currently open (OFF).</strong> Turn the switch ON in the circuit bench above to allow current to flow before recording an observation.
          </span>
        </div>
      )}

      {/* Recommended Verification Presets Bar */}
      <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-mono">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold">Quick Laboratory Test Cases (R = 10.0 Ω):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onLoadPreset(2.0, 10.0)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 font-mono text-[11px] text-slate-700 hover:text-indigo-600 transition-colors shadow-2xs"
          >
            Case 1: V = 2V (I = 0.2A)
          </button>
          <button
            onClick={() => onLoadPreset(4.0, 10.0)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 font-mono text-[11px] text-slate-700 hover:text-indigo-600 transition-colors shadow-2xs"
          >
            Case 2: V = 4V (I = 0.4A)
          </button>
          <button
            onClick={() => onLoadPreset(6.0, 10.0)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 font-mono text-[11px] text-slate-700 hover:text-indigo-600 transition-colors shadow-2xs"
          >
            Case 3: V = 6V (I = 0.6A)
          </button>
        </div>
      </div>

      {/* Observation Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 mt-4">
        <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-mono text-xs border-b border-slate-200">
              <th className="py-3 px-4 font-bold text-center w-16">Sr. No.</th>
              <th className="py-3 px-4 font-bold">Potential Difference V (V)</th>
              <th className="py-3 px-4 font-bold">Current I (A)</th>
              <th className="py-3 px-4 font-bold">Resistance R = V / I (Ω)</th>
              <th className="py-3 px-4 font-bold text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {observations.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400 font-mono text-xs">
                  No observations recorded yet. Adjust voltage and click{' '}
                  <span className="font-bold text-indigo-600">"Record Observation"</span> to log live readings.
                </td>
              </tr>
            ) : (
              observations.map((obs, idx) => (
                <tr
                  key={obs.id}
                  id={`obs-row-${obs.id}`}
                  className="hover:bg-indigo-50/40 transition-colors"
                >
                  <td className="py-3 px-4 text-center text-slate-500 font-bold">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-indigo-900">
                    {obs.voltage.toFixed(2)} V
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">
                    {obs.current.toFixed(3)} A
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {obs.resistance.toFixed(2)} Ω
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onDeleteObservation(obs.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none"
                      title="Delete this observation"
                      aria-label={`Delete observation ${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Observation Summary Statistics */}
      {observations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="text-slate-600">
            Total Observations Recorded: <span className="font-bold text-slate-900">{observations.length}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-950 font-semibold">
            Mean Calculated Resistance R&#772; = <span className="font-bold text-indigo-700 text-sm">{averageResistance} Ω</span>
          </div>
        </div>
      )}

    </div>
  );
};
