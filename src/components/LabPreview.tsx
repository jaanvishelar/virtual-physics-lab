import React, { useState } from 'react';
import { EXPERIMENTS } from '../data/experiments';
import { ExperimentCard } from './ExperimentCard';
import { Experiment } from '../types';
import { Layers, Sparkles, Filter, Info } from 'lucide-react';

interface LabPreviewProps {
  onOpenLab: (exp: Experiment) => void;
}

export const LabPreview: React.FC<LabPreviewProps> = ({ onOpenLab }) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<'all' | '9' | '10' | '11' | '12'>('all');

  const filteredExperiments = EXPERIMENTS.filter((exp) => {
    if (selectedClassFilter === 'all') return true;
    if (selectedClassFilter === '9') return exp.classes.includes('9');
    if (selectedClassFilter === '10') return exp.classes.includes('10');
    if (selectedClassFilter === '11') return exp.classes.includes('11');
    if (selectedClassFilter === '12') return exp.classes.includes('12');
    return true;
  });

  return (
    <section id="virtual-labs-section" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 font-mono mb-3 border border-indigo-200/60">
              <Layers className="w-3.5 h-3.5" />
              <span>Experiment Catalogue</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Virtual Physics Laboratory
            </h2>
            <p className="mt-2.5 text-lg text-slate-600">
              Interactive practical learning for Classes 9–12.
            </p>
          </div>

          {/* Class Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto text-xs font-medium">
            <span className="px-2.5 py-1 text-slate-400 font-mono flex items-center gap-1 text-[11px]">
              <Filter className="w-3 h-3" /> Class:
            </span>
            {[
              { label: 'All Experiments', val: 'all' },
              { label: 'Class 9', val: '9' },
              { label: 'Class 10', val: '10' },
              { label: 'Class 11', val: '11' },
              { label: 'Class 12', val: '12' },
            ].map((tab) => (
              <button
                key={tab.val}
                id={`filter-class-${tab.val}`}
                onClick={() => setSelectedClassFilter(tab.val as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedClassFilter === tab.val
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Laboratory Notice */}
        <div className="mb-8 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs sm:text-sm flex items-start gap-3">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Explore interactive physics experiments designed for Classes 9–12.
          </p>
        </div>

        {/* 5 Experiment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredExperiments.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} onOpenLab={onOpenLab} />
          ))}
        </div>

      </div>
    </section>
  );
};
