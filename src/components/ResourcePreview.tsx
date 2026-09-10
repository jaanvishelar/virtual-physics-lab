import React, { useState } from 'react';
import { REFERENCE_ITEMS } from '../data/resources';
import { ReferenceItem } from '../types';
import { 
  BookOpen, FileText, Binary, ArrowLeftRight, ShieldAlert, GraduationCap, 
  ArrowRight, X, Check, Sparkles, HelpCircle 
} from 'lucide-react';

export const ResourcePreview: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ReferenceItem | null>(null);

  // Map icon strings to Lucide components
  const renderIcon = (name: string) => {
    switch (name) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'Binary':
        return <Binary className="w-5 h-5 text-emerald-600" />;
      case 'ArrowLeftRight':
        return <ArrowLeftRight className="w-5 h-5 text-amber-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <section id="resources-section" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 font-mono mb-3 border border-slate-200">
            <span>Practical References</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Physics Reference Desk
          </h2>
          <p className="mt-3 text-lg text-slate-600 leading-relaxed">
            Essential reference materials, structured experiment guides, and calculation aids supporting student practical preparation.
          </p>
        </div>

        {/* 6 Cards Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REFERENCE_ITEMS.map((item) => (
            <div
              key={item.id}
              id={`ref-card-${item.id}`}
              onClick={() => setSelectedItem(item)}
              className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-indigo-300 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {renderIcon(item.iconName)}
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight mb-1">
                  {item.title}
                </h3>

                <p className="text-xs font-mono text-indigo-600 mb-3">
                  {item.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                <span className="font-mono">Preview Reference</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Reference Scope Note */}
        <div className="mt-8 text-center text-xs text-slate-400 font-mono">
          * Reference Desk materials provide practical background notes to accompany digital simulation modules.
        </div>

      </div>

      {/* Reference Item Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close reference modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                {renderIcon(selectedItem.iconName)}
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-indigo-600 font-bold">
                  {selectedItem.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedItem.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
              {selectedItem.details.overview}
            </p>

            {/* Key Practical Points */}
            <div className="space-y-2.5 mb-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Core Reference Principles
              </h4>
              {selectedItem.details.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Sample data if present */}
            {selectedItem.details.sampleFormulasOrData && (
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Standard Laboratory Constants / SI Values
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {selectedItem.details.sampleFormulasOrData.map((row, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 text-white flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">{row.label}</span>
                      <span className="font-bold text-indigo-300">{row.value} {row.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Status: Laboratory Reference Sheet</span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
              >
                Close Reference
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
