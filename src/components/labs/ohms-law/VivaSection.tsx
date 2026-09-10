import React, { useState } from 'react';
import { OHMS_LAW_VIVA } from '../../../data/ohmsLawData';
import { GraduationCap, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';

export const VivaSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div id="viva-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Oral Examination Preparation</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Laboratory Viva Voce Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Key conceptual and instrumentation questions frequently asked during practical examinations.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          6 Standard Viva Questions
        </div>
      </div>

      {/* Accordion Questions */}
      <div className="mt-6 space-y-3">
        {OHMS_LAW_VIVA.map((item, idx) => {
          const isOpen = expandedIndex === idx;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all ${
                isOpen ? 'bg-indigo-50/30 border-indigo-200 shadow-2xs' : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {item.question}
                  </span>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-indigo-100/60 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans animate-in fade-in-50 duration-150">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      Concept: {item.concept}
                    </span>
                  </div>
                  <p className="p-3.5 rounded-lg bg-white border border-slate-200/80 text-slate-800">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
