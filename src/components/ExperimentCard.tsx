import React from 'react';
import { ArrowRight, Beaker, Layers, Sparkles, BookOpen, Compass, Sliders } from 'lucide-react';
import { Experiment } from '../types';

interface ExperimentCardProps {
  experiment: Experiment;
  onOpenLab: (exp: Experiment) => void;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment, onOpenLab }) => {
  const isImplemented = ['ohms-law', 'simple-pendulum', 'hookes-law', 'projectile-motion', 'convex-lens'].includes(experiment.slug);

  return (
    <div 
      id={`exp-card-${experiment.slug}`}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between"
    >
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              EXP {experiment.number}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {experiment.classes}
            </span>
            {!isImplemented && (
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Coming Soon
              </span>
            )}
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            {experiment.category.split('&')[0]}
          </span>
        </div>

        {/* Experiment Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight mb-2.5">
          {experiment.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          {experiment.description}
        </p>

        {/* Physics Formula Pill */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 mb-5 font-mono text-xs text-slate-700 flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider font-sans">Formula:</span>
          <span className="font-semibold text-indigo-700">{experiment.formula.split('⇒')[0]}</span>
        </div>

        {/* Virtual Apparatus Snapshot preview */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
            <Beaker className="w-3.5 h-3.5 text-slate-400" />
            <span>Virtual Apparatus ({experiment.apparatus.length} items)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {experiment.apparatus.slice(0, 3).map((item, idx) => (
              <span 
                key={idx} 
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100/80 text-slate-600 border border-slate-200/50 truncate max-w-[200px]"
                title={item}
              >
                {item}
              </span>
            ))}
            {experiment.apparatus.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100/80 text-slate-500 font-mono">
                +{experiment.apparatus.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-mono">
          {isImplemented ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Virtual Lab
            </span>
          ) : (
            <span className="text-slate-500 font-medium">Planned Extension</span>
          )}
        </div>

        {isImplemented ? (
          <button
            id={`btn-open-lab-${experiment.slug}`}
            onClick={() => onOpenLab(experiment)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
          >
            <span>Open Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            id={`btn-open-lab-${experiment.slug}`}
            disabled
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed select-none"
          >
            <span>Coming Soon</span>
          </button>
        )}
      </div>
    </div>
  );
};
