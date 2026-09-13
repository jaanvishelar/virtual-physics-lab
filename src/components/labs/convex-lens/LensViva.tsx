import React, { useState } from 'react';
import { CONVEX_LENS_VIVA_QUESTIONS } from '../../../data/convexLensData';
import { MessageSquare, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export const LensViva: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'clv-1': true, // Keep first open by default
  });

  const toggleQuestion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    CONVEX_LENS_VIVA_QUESTIONS.forEach((q) => {
      allOpen[q.id] = true;
    });
    setOpenIds(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenIds({});
  };

  return (
    <div id="lens-viva-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Oral Exam &bull; Viva Voce Preparation</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Laboratory Viva Voce Practice ({CONVEX_LENS_VIVA_QUESTIONS.length} Questions)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Key practical questions commonly posed during Class 12 Ray Optics board practical examinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Viva Question Accordions */}
      <div className="divide-y divide-slate-100 space-y-4">
        {CONVEX_LENS_VIVA_QUESTIONS.map((item, idx) => {
          const isOpen = !!openIds[item.id];

          return (
            <div key={item.id} className="pt-4 first:pt-1">
              <button
                type="button"
                onClick={() => toggleQuestion(item.id)}
                className="w-full flex items-start justify-between gap-4 text-left py-2 group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {item.question}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                      Concept: {item.concept}
                    </span>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-600 shrink-0 mt-1">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="mt-2 ml-9 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Model Examiner Answer:</span>
                  </div>
                  <p className="font-sans">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
