import React, { useState } from 'react';
import { PROJECTILE_VIVA } from '../../../data/projectileMotionData';
import { MessageSquare, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export const ProjectileViva: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'pv-1': true, // Keep first open by default
  });

  const toggleQuestion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    PROJECTILE_VIVA.forEach((q) => {
      allOpen[q.id] = true;
    });
    setOpenIds(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenIds({});
  };

  return (
    <div id="projectile-viva-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Oral Exam &bull; Viva Voce Preparation</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Laboratory Viva Voce Practice ({PROJECTILE_VIVA.length} Core Questions)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Key practical questions commonly posed during senior secondary board and university entrance physics assessments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Viva Question Accordion */}
      <div className="divide-y divide-slate-100 mt-4 space-y-3">
        {PROJECTILE_VIVA.map((item, idx) => {
          const isOpen = !!openIds[item.id];

          return (
            <div key={item.id} className="pt-3 first:pt-0">
              <button
                type="button"
                onClick={() => toggleQuestion(item.id)}
                className="w-full text-left py-2.5 flex items-center justify-between gap-3 hover:text-indigo-600 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-700 text-slate-700 shrink-0">
                    V{idx + 1}
                  </span>
                  <span className="font-semibold text-slate-900 group-hover:text-indigo-600 text-sm sm:text-base">
                    {item.question}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden md:inline-block text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                    {item.concept}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="pb-3 pt-1 pl-11 pr-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-semibold text-xs font-mono">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Model Answer &bull; Examiner Notes</span>
                    </div>
                    <p className="leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
