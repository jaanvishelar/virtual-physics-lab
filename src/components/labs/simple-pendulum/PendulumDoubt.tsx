import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';

interface StoredDoubt {
  id: string;
  experiment: string;
  question: string;
  length?: string;
  timestamp: string;
}

export const PendulumDoubt: React.FC = () => {
  const experiment = 'Simple Pendulum — Determination of g';
  const [question, setQuestion] = useState<string>('');
  const [lengthParam, setLengthParam] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedDoubts, setSubmittedDoubts] = useState<StoredDoubt[]>(() => {
    try {
      const saved = localStorage.getItem('vpl_pendulum_doubts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newDoubt: StoredDoubt = {
      id: `doubt-${Date.now()}`,
      experiment,
      question: question.trim(),
      length: lengthParam.trim() || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newDoubt, ...submittedDoubts];
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_pendulum_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setQuestion('');
    setLengthParam('');
  };

  const handleDelete = (id: string) => {
    const updated = submittedDoubts.filter((d) => d.id !== id);
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_pendulum_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div id="ask-doubt-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Student Support System</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Ask a Doubt / Log a Lab Observation Query
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Log conceptual doubts or unexpected timing observations into your personal laboratory journal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left: Input Form (Span 7) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Pendulum Length / Experimental Condition (Optional)
            </label>
            <input
              type="text"
              value={lengthParam}
              onChange={(e) => setLengthParam(e.target.value)}
              placeholder="e.g. At L = 0.80 m, why is time period ~1.8s?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
              Describe Your Physics Question or Difficulty *
            </label>
            <textarea
              required
              rows={3}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (isSubmitted) setIsSubmitted(false);
              }}
              placeholder="e.g., Why do we use L to the center of the bob instead of just measuring the string?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
            />
          </div>

          {isSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Query recorded in your local session log below.</span>
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Save Question to Lab Log</span>
          </button>
        </form>

        {/* Right: Saved Notebook Records (Span 5) */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-xl p-4 border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-600">
              Lab Journal Questions ({submittedDoubts.length})
            </span>
            <span className="text-[10px] font-mono text-slate-400">Local Browser Session</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1">
            {submittedDoubts.length > 0 ? (
              submittedDoubts.map((d) => (
                <div key={d.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{d.timestamp}</span>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {d.length && (
                    <div className="font-mono text-[11px] text-indigo-600 font-semibold">
                      Condition: {d.length}
                    </div>
                  )}
                  <p className="text-slate-800 font-sans">{d.question}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 font-mono">
                No doubts recorded yet in this practical session.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
