import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, MessageSquare, Trash2, BookOpen } from 'lucide-react';

interface StoredDoubt {
  id: string;
  experiment: string;
  question: string;
  loadCondition?: string;
  timestamp: string;
}

export const HookeDoubt: React.FC = () => {
  const experiment = "Hooke's Law — Verification & Spring Constant";
  const [question, setQuestion] = useState<string>('');
  const [loadCondition, setLoadCondition] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedDoubts, setSubmittedDoubts] = useState<StoredDoubt[]>(() => {
    try {
      const saved = localStorage.getItem('vpl_hooke_doubts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newDoubt: StoredDoubt = {
      id: `hooke-doubt-${Date.now()}`,
      experiment,
      question: question.trim(),
      loadCondition: loadCondition.trim() || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newDoubt, ...submittedDoubts];
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_hooke_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setQuestion('');
    setLoadCondition('');
  };

  const handleDelete = (id: string) => {
    const updated = submittedDoubts.filter((d) => d.id !== id);
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_hooke_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div id="hooke-doubt-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Header */}
      <div className="pb-5 border-b border-slate-200 mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Student Lab Notebook &bull; Peer Mentoring</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Ask a Physics Question / Record Laboratory Observations
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-sans">
          Log conceptual doubts regarding Hooke's Law, slope evaluation, or elastic limits to your session notebook.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form (Span 7) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Suspended Load / Experimental Condition (Optional)
            </label>
            <input
              type="text"
              value={loadCondition}
              onChange={(e) => setLoadCondition(e.target.value)}
              placeholder="e.g. 150 g load (F = 1.47 N) or 'Approaching elastic limit'"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Your Physics Question or Observation Note <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (isSubmitted) setIsSubmitted(false);
              }}
              placeholder="e.g. Why does the F vs x graph pass through the origin? What would happen if we plotted x on the vertical axis and F on the horizontal axis?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-slate-400">
              Saved securely in your browser's local session
            </span>

            <button
              type="submit"
              disabled={!question.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Log Note to Notebook</span>
            </button>
          </div>

          {isSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Observation saved to your session notebook.</span>
            </div>
          )}
        </form>

        {/* Saved Session Notebook Log (Span 5) */}
        <div className="lg:col-span-5 bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 pb-2 border-b border-slate-200 mb-3">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Session Notebook Entries</span>
              </span>
              <span className="text-slate-400">{submittedDoubts.length} Notes</span>
            </div>

            {submittedDoubts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-sans">
                No session entries recorded yet. Use the form to write inquiry notes or questions.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {submittedDoubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-slate-800 line-clamp-2">
                        {doubt.question}
                      </div>
                      <button
                        onClick={() => handleDelete(doubt.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                      <span>{doubt.loadCondition ? `Cond: ${doubt.loadCondition}` : 'General Inquiry'}</span>
                      <span>{doubt.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-400 text-center">
            University CEP Student Laboratory Journal
          </div>
        </div>

      </div>

    </div>
  );
};
