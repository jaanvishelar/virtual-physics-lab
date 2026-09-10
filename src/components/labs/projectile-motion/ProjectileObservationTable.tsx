import React from 'react';
import { Table, Trash2, RotateCcw, Award, CheckCircle2, AlertCircle, RefreshCw, Bookmark } from 'lucide-react';
import { ProjectileObservation } from '../../../types';

interface ProjectileObservationTableProps {
  observations: ProjectileObservation[];
  onDeleteObservation: (id: string) => void;
  onClearTable: () => void;
  onLoadStandardDataset: () => void;
  bestObservation: ProjectileObservation | null;
}

export const ProjectileObservationTable: React.FC<ProjectileObservationTableProps> = ({
  observations,
  onDeleteObservation,
  onClearTable,
  onLoadStandardDataset,
  bestObservation,
}) => {
  const constantVelocityCount = observations.filter((o) => o.velocity === 20).length;
  const otherVelocityCount = observations.length - constantVelocityCount;

  return (
    <div id="projectile-observation-table-card" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
      
      {/* Table Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">
            Experimental Observation Table
          </h3>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {observations.length} {observations.length === 1 ? 'Trial' : 'Trials'}
          </span>
          {constantVelocityCount > 0 && (
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {constantVelocityCount} in Angle Study (u = 20 m/s)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            id="btn-load-standard-dataset"
            type="button"
            onClick={onLoadStandardDataset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer"
            title="Load 5 standard benchmark angle trials (15°, 30°, 45°, 60°, 75° at u = 20 m/s)"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Standard 5-Angle Dataset (u = 20 m/s)</span>
          </button>

          {observations.length > 0 && (
            <button
              id="btn-clear-table"
              type="button"
              onClick={onClearTable}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Table</span>
            </button>
          )}
        </div>
      </div>

      {/* Observation Table or Empty State */}
      {observations.length === 0 ? (
        <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">
              No Experimental Observations Recorded
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Select an initial velocity and launch angle, click <strong className="text-slate-700">[Launch Projectile]</strong>,
              and record completed flights. You can also load the standard 5-angle dataset for u = 20 m/s.
            </p>
          </div>
          <button
            type="button"
            onClick={onLoadStandardDataset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Load Standard 5-Angle Dataset (u = 20 m/s)</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3 px-3.5 font-bold">Sr. No.</th>
                <th className="py-3 px-3.5 font-bold">Velocity u (m/s)</th>
                <th className="py-3 px-3.5 font-bold">Angle θ (°)</th>
                <th className="py-3 px-3.5 font-bold">Time of Flight T (s)</th>
                <th className="py-3 px-3.5 font-bold">Max Height H (m)</th>
                <th className="py-3 px-3.5 font-bold">Horizontal Range R (m)</th>
                <th className="py-3 px-3.5 font-bold">Study Group</th>
                <th className="py-3 px-3.5 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observations.map((obs) => {
                const isConstantV = obs.velocity === 20;
                const isBest = isConstantV && bestObservation && bestObservation.id === obs.id;

                return (
                  <tr
                    key={obs.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isBest ? 'bg-amber-50/40 font-semibold' : !isConstantV ? 'bg-slate-50/40 opacity-80' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 text-slate-500">#{obs.srNo}</td>
                    <td className="py-2.5 px-3.5 text-slate-800">
                      <span className={isConstantV ? 'font-bold text-indigo-700' : 'text-slate-600'}>
                        {obs.velocity.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                        {obs.angle}°
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-700">{obs.timeOfFlight.toFixed(2)}</td>
                    <td className="py-2.5 px-3.5 text-slate-700">{obs.maxHeight.toFixed(2)}</td>
                    <td className="py-2.5 px-3.5 text-indigo-700 font-bold">
                      {obs.range.toFixed(2)}
                      {isBest && (
                        <span className="ml-1.5 inline-flex items-center text-[10px] text-amber-600 font-sans font-bold">
                          ★ Best in Angle Study
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5">
                      {isConstantV ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Included (u = 20 m/s)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-sans text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Excluded (u ≠ 20 m/s)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteObservation(obs.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete observation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Observation Summary Metrics */}
      {observations.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
          {bestObservation ? (
            <div className="flex flex-wrap items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-slate-600 font-sans">Best Recorded Angle (Constant u = 20 m/s):</span>
              <span className="font-bold text-amber-700 text-sm">{bestObservation.angle}°</span>
              <span className="text-slate-400 font-sans">yielding</span>
              <span className="font-bold text-indigo-700 text-sm">{bestObservation.range.toFixed(2)} m</span>
            </div>
          ) : (
            <span className="text-slate-500 font-sans">
              No u = 20 m/s trials recorded yet for the angle investigation.
            </span>
          )}

          {otherVelocityCount > 0 && (
            <div className="text-[11px] text-slate-500 font-sans">
              * Note: {otherVelocityCount} trial(s) at u ≠ 20 m/s are kept in table for velocity comparison but excluded from angle analysis.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
