import React, { useState } from 'react';
import { SIMPLE_PENDULUM_VIVA } from '../../../data/simplePendulumData';
import { MessageSquare, ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';

export const PendulumViva: React.FC = () => {
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
    SIMPLE_PENDULUM_VIVA.forEach((q) => {
      allOpen[q.id] = true;
    });
    setOpenIds(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenIds({});
  };

  return (
    <div id="viva-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Oral Exam &bull; Viva Voce Preparation</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Laboratory Viva Voce Practice (6 Core Questions)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Key practical questions commonly asked during internal and board practical assessments.
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

      {/* Accordion Questions List */}
      <div className="mt-6 space-y-3">
        {SIMPLE_PENDULUM_VIVA.map((item) => {
          const isOpen = !!openIds[item.id];

          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {item.id.replace('pv-', 'V')}
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                      {item.question}
                    </h4>
                    <span className="inline-block mt-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.concept}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4.5 pt-2 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                      <strong className="text-slate-900 block font-mono text-xs uppercase text-slate-500 mb-1">
                        Model Examiner Answer:
                      </strong>
                      {item.answer}
                    </div>
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
