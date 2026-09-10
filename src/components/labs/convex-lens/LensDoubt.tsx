import React, { useState } from 'react';
import { CONVEX_LENS_DOUBT_CATEGORIES } from '../../../data/convexLensData';
import { HelpCircle, Send, CheckCircle2, MessageSquare, Trash2, BookOpen } from 'lucide-react';

interface StoredLensDoubt {
  id: string;
  category: string;
  question: string;
  benchObservation?: string;
  timestamp: string;
}

export const LensDoubt: React.FC = () => {
  const [category, setCategory] = useState<string>(CONVEX_LENS_DOUBT_CATEGORIES[0]);
  const [question, setQuestion] = useState<string>('');
  const [benchObservation, setBenchObservation] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedDoubts, setSubmittedDoubts] = useState<StoredLensDoubt[]>(() => {
    try {
      const saved = localStorage.getItem('vpl_convex_lens_doubts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newDoubt: StoredLensDoubt = {
      id: `lens-doubt-${Date.now()}`,
      category,
      question: question.trim(),
      benchObservation: benchObservation.trim() || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newDoubt, ...submittedDoubts];
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_convex_lens_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setQuestion('');
    setBenchObservation('');
  };

  const handleDelete = (id: string) => {
    const updated = submittedDoubts.filter((d) => d.id !== id);
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_convex_lens_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div id="lens-doubt-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Practical Inquiry</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Ask a Ray Optics Doubt &bull; Physics Journal
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Log conceptual or mathematical inquiries regarding sign convention, lens formula, screen focal adjustments, or 1/v vs 1/u graphs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Doubt Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your ray optics inquiry has been saved to your local doubt log!</span>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="font-bold underline text-emerald-800 hover:text-emerald-900 text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Doubt Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CONVEX_LENS_DOUBT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Bench Condition / Measurement (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. u = -30 cm gives v = +60 cm, or screen focus offset..."
                value={benchObservation}
                onChange={(e) => setBenchObservation(e.target.value)}
                className="w-full text-xs font-sans rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Describe Your Doubt or Calculation Query
              </label>
              <textarea
                rows={4}
                required
                placeholder="e.g., Why do we use Cartesian negative sign for object distance u in the thin-lens equation? Or how does the intercept on the 1/v axis equal 1/f?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full text-xs sm:text-sm font-sans rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-mono font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Log Inquiry</span>
            </button>
          </form>
        </div>

        {/* Local Journal History (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              Saved Doubt Journal ({submittedDoubts.length})
            </span>
          </div>

          {submittedDoubts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 text-center space-y-2">
              <p className="text-xs text-slate-500 font-sans">
                No inquiries recorded yet for Convex Lens. Post a question to preserve your laboratory study notes.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {submittedDoubts.map((doubt) => (
                <div
                  key={doubt.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[10px] font-bold">
                      {doubt.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">
                        {doubt.timestamp}
                      </span>
                      <button
                        onClick={() => handleDelete(doubt.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {doubt.benchObservation && (
                    <div className="text-[11px] font-mono text-slate-500">
                      Bench Condition: {doubt.benchObservation}
                    </div>
                  )}

                  <p className="text-slate-700 font-sans leading-relaxed">
                    {doubt.question}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
