import React from 'react';
import { ConvexLensObservation } from '../../../types';
import { Table, Trash2, ListPlus, RotateCcw, Sparkles } from 'lucide-react';

interface LensObservationTableProps {
  observations: ConvexLensObservation[];
  onDeleteReading: (id: string) => void;
  onClearTable: () => void;
  onLoadStandardTrials: () => void;
}

export const LensObservationTable: React.FC<LensObservationTableProps> = ({
  observations,
  onDeleteReading,
  onClearTable,
  onLoadStandardTrials,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Observation Table &bull; Optical Conjugates
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {observations.length} {observations.length === 1 ? 'Reading' : 'Readings'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadStandardTrials}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-mono rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
            title="Load standard laboratory benchmark trials (u = -60, -50, -40, -30 cm)"
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Load Standard Trials</span>
          </button>

          {observations.length > 0 && (
            <button
              onClick={onClearTable}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-mono rounded-lg border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
              title="Clear all recorded observations"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Table</span>
            </button>
          )}
        </div>
      </div>

      {observations.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Table className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Readings Recorded Yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Adjust the object distance control on the bench and click{' '}
            <strong className="text-slate-700 font-semibold">"Record Current Reading"</strong>, or click{' '}
            <strong className="text-indigo-600 font-semibold">"Load Standard Trials"</strong> to populate sample readings for u = -60, -50, -40, and -30 cm.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-mono border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 font-bold text-center">Trial</th>
                <th className="py-3 px-3 font-bold text-emerald-800">
                  <div>Object position</div>
                  <div className="text-[10px] font-normal text-emerald-700">u (cm)</div>
                </th>
                <th className="py-3 px-3 font-bold text-indigo-800">
                  <div>Image position</div>
                  <div className="text-[10px] font-normal text-indigo-700">v (cm)</div>
                </th>
                <th className="py-3 px-3 font-bold">1/u (cm⁻¹)</th>
                <th className="py-3 px-3 font-bold">1/v (cm⁻¹)</th>
                <th className="py-3 px-3 font-bold text-slate-900">
                  <div>Calculated focal length</div>
                  <div className="text-[10px] font-normal text-slate-600">f (cm)</div>
                </th>
                <th className="py-3 px-3 font-bold">
                  <div>Magnification</div>
                  <div className="text-[10px] font-normal text-slate-600">m = v/u</div>
                </th>
                <th className="py-3 px-3 font-bold">Image nature</th>
                <th className="py-3 px-3 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {observations.map((obs, idx) => (
                <tr key={obs.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                    #{idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">
                    {obs.u < 0 ? obs.u.toFixed(1) : `-${obs.u.toFixed(1)}`}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-indigo-700">
                    {obs.v > 0 ? `+${obs.v.toFixed(2)}` : obs.v.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {obs.oneOverU.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {obs.oneOverV > 0 ? `+${obs.oneOverV.toFixed(4)}` : obs.oneOverV.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 font-extrabold text-slate-900 bg-slate-50/50">
                    +{obs.focalLength.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-amber-800">
                    {obs.magnification.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans text-[11px]">
                    {obs.nature}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onDeleteReading(obs.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete this observation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Summary Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 pt-1">
        <span>* Focal length is calculated authoritative via f = 1 / (1/v − 1/u)</span>
        <span>Theoretical baseline: f = +20.00 cm</span>
      </div>
    </div>
  );
};
