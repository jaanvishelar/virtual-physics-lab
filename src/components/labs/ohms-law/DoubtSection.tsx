import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface StoredDoubt {
  id: string;
  experiment: string;
  question: string;
  observation?: string;
  timestamp: string;
}

export const DoubtSection: React.FC = () => {
  const [experiment] = useState<string>("Verification of Ohm's Law & Resistance");
  const [question, setQuestion] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedDoubts, setSubmittedDoubts] = useState<StoredDoubt[]>(() => {
    try {
      const saved = localStorage.getItem('vpl_ohms_law_doubts');
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
      observation: observation.trim() || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newDoubt, ...submittedDoubts];
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_ohms_law_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setQuestion('');
    setObservation('');
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
            Ask a Physics Doubt
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Record queries or puzzling anomalies encountered while conducting this virtual practical.
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
          Laboratory Doubt Journal
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Form (Span 7) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          
          {/* Experiment Name (Read-only / Prefilled) */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
              Experiment
            </label>
            <input
              type="text"
              readOnly
              value={experiment}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/80 text-slate-800 text-xs sm:text-sm font-semibold cursor-not-allowed"
            />
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
              Your Physics Question <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Why did the current double when I doubled the voltage, but resistance remained 10 Ohms?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Optional Observation Notes */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
              Optional Observation / Meter Reading
            </label>
            <input
              type="text"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="e.g. V = 4.0 V, I = 0.400 A, selected R = 10 Ω"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="btn-submit-doubt"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Doubt</span>
            </button>
          </div>

          {/* Submission Success Confirmation */}
          {isSubmitted && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5 animate-in fade-in-50 duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Doubt successfully saved!</strong>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Your question has been logged locally in your practical workbook for your laboratory review and teacher discussion.
                </p>
              </div>
            </div>
          )}

        </form>

        {/* Right Info & Recent Local Submissions (Span 5) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold uppercase text-slate-500 mb-2">
              Laboratory Notebook Log
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 font-sans">
              Scientific inquiry begins when experimental readings prompt curiosity. Use this space to record questions for your classroom teacher or study sessions.
            </p>

            {/* List of previously logged doubts */}
            {submittedDoubts.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {submittedDoubts.slice(0, 4).map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Logged Question</span>
                      <span>{d.timestamp}</span>
                    </div>
                    <p className="font-semibold text-slate-800 line-clamp-2">
                      "{d.question}"
                    </p>
                    {d.observation && (
                      <p className="text-[11px] font-mono text-indigo-600 mt-1">
                        Observation: {d.observation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-white border border-dashed border-slate-200 text-center text-xs text-slate-400 font-mono">
                No doubts recorded yet in this browser session.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-400 font-mono">
            * Local practical log &bull; Stored in browser session
          </div>
        </div>

      </div>

    </div>
  );
};
