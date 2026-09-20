import React from 'react';
import { PendulumObservation } from '../../../types';
import { Table, Trash2, BookmarkPlus, AlertCircle, Sparkles } from 'lucide-react';

interface PendulumObservationTableProps {
  observations: PendulumObservation[];
  onDeleteObservation: (id: string) => void;
  onClearObservations: () => void;
  onRecordReading: () => void;
  isMeasurementReady: boolean;
  hasRecordedCurrent: boolean;
  currentLength: number;
  currentN: number;
  currentTime: number;
}

export const PendulumObservationTable: React.FC<PendulumObservationTableProps> = ({
  observations,
  onDeleteObservation,
  onClearObservations,
  onRecordReading,
  isMeasurementReady,
  hasRecordedCurrent,
  currentLength,
  currentN,
  currentTime
}) => {
  return (
    <div id="observation-table-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
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
            Record lengths L and measured oscillation times t to compute period T and T².
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Record Reading Button */}
          <button
            id="btn-table-record-reading"
            onClick={onRecordReading}
            disabled={!isMeasurementReady || hasRecordedCurrent}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isMeasurementReady && !hasRecordedCurrent
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95'
                : hasRecordedCurrent
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>
              {hasRecordedCurrent
                ? 'Reading Saved'
                : isMeasurementReady
                ? `Record (${currentLength.toFixed(2)}m, ${(currentTime / currentN).toFixed(2)}s)`
                : 'Run Lab to Record'}
            </span>
          </button>

          {/* Clear Observations */}
          {observations.length > 0 && (
            <button
              id="btn-clear-observations"
              onClick={onClearObservations}
              className="px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Table</span>
            </button>
          )}
        </div>
      </div>

      {/* Observation Table Content */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs sm:text-sm font-sans divide-y divide-slate-200">
          <thead className="bg-slate-50 font-mono text-xs uppercase text-slate-600 font-bold tracking-wider">
            <tr>
              <th scope="col" className="px-3 py-3.5 text-center">Sr.</th>
              <th scope="col" className="px-3.5 py-3.5">Location</th>
              <th scope="col" className="px-3 py-3.5 text-right">Height h (m)</th>
              <th scope="col" className="px-3.5 py-3.5 text-right">Length L (m)</th>
              <th scope="col" className="px-3 py-3.5 text-center">N</th>
              <th scope="col" className="px-3.5 py-3.5 text-right">Time t (s)</th>
              <th scope="col" className="px-3.5 py-3.5 text-right">T (s)</th>
              <th scope="col" className="px-3.5 py-3.5 text-right">T² (s²)</th>
              <th scope="col" className="px-3 py-3.5 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white font-mono text-xs">
            {observations.length > 0 ? (
              observations.map((obs, idx) => (
                <tr key={obs.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3 py-3 text-center text-slate-400 font-semibold">
                    {idx + 1}
                  </td>
                  <td className="px-3.5 py-3">
                    {obs.location === 'Ground' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Ground
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        4th Floor
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-600 font-semibold">
                    {obs.height}
                  </td>
                  <td className="px-3.5 py-3 text-right font-bold text-indigo-700">
                    {obs.length.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-center text-slate-700 font-semibold">
                    {obs.oscillations}
                  </td>
                  <td className="px-3.5 py-3 text-right text-emerald-700 font-semibold">
                    {obs.time.toFixed(3)}
                  </td>
                  <td className="px-3.5 py-3 text-right text-amber-700 font-bold">
                    {obs.period.toFixed(3)}
                  </td>
                  <td className="px-3.5 py-3 text-right font-extrabold text-sky-700">
                    {obs.periodSquared.toFixed(3)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => onDeleteObservation(obs.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete observation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                  <div className="max-w-md mx-auto space-y-2">
                    <p className="font-semibold text-slate-600">
                      No experimental observations recorded yet.
                    </p>
                    <p className="text-xs text-slate-500 font-sans">
                      Select an experimental location and pendulum length (e.g., 0.40 m, 0.60 m, 0.80 m), click <strong>START</strong> on the controls panel, wait for N oscillations to complete, and click <strong>Record Reading</strong>.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Status / Count Badge */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span>Logged Trials: <strong>{observations.length}</strong></span>
          <span className="text-slate-300">&bull;</span>
          <span>Requirement for Best-Fit Graph: <strong>2+ observations</strong> (3–5 recommended)</span>
        </div>

        {observations.length < 2 && (
          <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Record at least 2 different lengths to compute slope and g.</span>
          </div>
        )}
      </div>

    </div>
  );
};