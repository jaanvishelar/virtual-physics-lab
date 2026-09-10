import React from 'react';
import { HookeObservation } from '../../../types';
import { Table, Trash2, BookmarkPlus, Sparkles } from 'lucide-react';

interface HookeObservationTableProps {
  observations: HookeObservation[];
  onDeleteObservation: (id: string) => void;
  onClearObservations: () => void;
  onRecordReading: () => void;
  hasRecordedCurrent: boolean;
  currentMassGrams: number;
}

export const HookeObservationTable: React.FC<HookeObservationTableProps> = ({
  observations,
  onDeleteObservation,
  onClearObservations,
  onRecordReading,
  hasRecordedCurrent,
  currentMassGrams,
}) => {
  return (
    <div id="hooke-observation-table-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Table Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <Table className="w-3.5 h-3.5" />
            <span>Table 01 &bull; Laboratory Observation Record</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Experimental Data Table
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Tabulate applied loads (m), resulting tensile forces (F = mg), and measured extensions (x).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Record Button */}
          <button
            id="btn-table-record-hooke"
            onClick={onRecordReading}
            disabled={hasRecordedCurrent}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              !hasRecordedCurrent
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>
              {hasRecordedCurrent ? 'Current Load Recorded' : `Record ${currentMassGrams} g`}
            </span>
          </button>

          {/* Clear Observations */}
          {observations.length > 0 && (
            <button
              id="btn-clear-hooke-table"
              onClick={onClearObservations}
              className="px-3 py-2 rounded-xl text-xs font-mono font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear all recorded observations"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Table</span>
            </button>
          )}
        </div>
      </div>

      {/* Observations Count Banner */}
      <div className="py-3 flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-100 mb-4">
        <span>
          Recorded Trials: <strong className="text-slate-900">{observations.length}</strong>
        </span>
        <span className="text-slate-400">
          Linear Region Test Cases &bull; Gravity g = 9.81 m/s²
        </span>
      </div>

      {/* Table Container */}
      {observations.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700 font-mono">No Observations Recorded Yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-sans">
            Adjust the applied suspended mass slider or click standard weight presets (e.g., 50 g, 100 g, 150 g, 200 g), then click <strong className="text-indigo-600">"Record Observation"</strong> to tabulate trials.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 uppercase tracking-wider text-[11px] border-y border-slate-200">
                <th className="py-3 px-3.5 font-bold">Sr. No.</th>
                <th className="py-3 px-3.5 font-bold">Mass m (kg)</th>
                <th className="py-3 px-3.5 font-bold">Force F = mg (N)</th>
                <th className="py-3 px-3.5 font-bold">Extension x (m)</th>
                <th className="py-3 px-3.5 font-bold">k = F / x (N/m)</th>
                <th className="py-3 px-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-slate-800">
              {observations.map((obs, idx) => (
                <tr
                  key={obs.id}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="py-3 px-3.5 font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-3.5 font-semibold text-slate-900">
                    {obs.massKg.toFixed(3)}{' '}
                    <span className="text-[11px] font-normal text-slate-500">
                      ({obs.massGrams} g)
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-sky-700">
                    {obs.force.toFixed(3)}
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-emerald-700">
                    {obs.extensionMeters.toFixed(4)}{' '}
                    <span className="text-[11px] font-normal text-slate-500">
                      ({obs.extensionCm.toFixed(2)} cm)
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-bold">
                    {obs.springConstant !== null ? (
                      <span className="text-indigo-700">
                        {obs.springConstant.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">— (Zero Load)</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={() => onDeleteObservation(obs.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete this observation trial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer Notes */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <span>Force calculation: F = m &bull; 9.81 m/s²</span>
        <span>At least 2 non-zero trials required for linear regression</span>
      </div>

    </div>
  );
};
