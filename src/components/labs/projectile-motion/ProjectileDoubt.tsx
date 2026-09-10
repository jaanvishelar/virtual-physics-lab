import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, MessageSquare, Trash2, BookOpen } from 'lucide-react';

interface StoredDoubt {
  id: string;
  experiment: string;
  velocityCondition?: string;
  angleCondition?: string;
  question: string;
  timestamp: string;
}

export const ProjectileDoubt: React.FC = () => {
  const experiment = "Projectile Motion — Range & Trajectory";
  const [question, setQuestion] = useState<string>('');
  const [velocityCondition, setVelocityCondition] = useState<string>('20 m/s');
  const [angleCondition, setAngleCondition] = useState<string>('45°');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedDoubts, setSubmittedDoubts] = useState<StoredDoubt[]>(() => {
    try {
      const saved = localStorage.getItem('vpl_projectile_doubts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newDoubt: StoredDoubt = {
      id: `projectile-doubt-${Date.now()}`,
      experiment,
      velocityCondition: velocityCondition.trim() || undefined,
      angleCondition: angleCondition.trim() || undefined,
      question: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newDoubt, ...submittedDoubts];
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_projectile_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setQuestion('');
  };

  const handleDelete = (id: string) => {
    const updated = submittedDoubts.filter((d) => d.id !== id);
    setSubmittedDoubts(updated);
    try {
      localStorage.setItem('vpl_projectile_doubts', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div id="projectile-doubt-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Section Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-6">
        <HelpCircle className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Laboratory Inquiry &amp; Session Notebook
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Log experimental queries, physical anomalies, or conceptual doubts during your trajectory investigation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Inquiry Form (Span 7) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Experiment Title (Readonly) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Physics Experiment
              </label>
              <input
                type="text"
                readOnly
                value={experiment}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 select-none cursor-default"
              />
            </div>

            {/* Trial Conditions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-doubt-velocity" className="block text-xs font-semibold text-slate-700 mb-1">
                  Launch Velocity
                </label>
                <input
                  id="input-doubt-velocity"
                  type="text"
                  value={velocityCondition}
                  onChange={(e) => setVelocityCondition(e.target.value)}
                  placeholder="e.g. 20 m/s"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="input-doubt-angle" className="block text-xs font-semibold text-slate-700 mb-1">
                  Launch Angle (θ)
                </label>
                <input
                  id="input-doubt-angle"
                  type="text"
                  value={angleCondition}
                  onChange={(e) => setAngleCondition(e.target.value)}
                  placeholder="e.g. 45° or 60°"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Doubt Textarea */}
            <div>
              <label htmlFor="textarea-doubt-projectile" className="block text-xs font-semibold text-slate-700 mb-1">
                Your Inquiry / Observation Note
              </label>
              <textarea
                id="textarea-doubt-projectile"
                rows={3}
                required
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (isSubmitted) setIsSubmitted(false);
                }}
                placeholder="e.g. Why do 30° and 60° produce the exact same horizontal range even though 60° reaches much higher?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
              />
            </div>

            {/* Submit Button & Confirmation */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-mono">
                Saved locally to your browser session
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>

            {isSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your observation has been saved to your session notebook.</span>
              </div>
            )}
          </form>
        </div>

        {/* Notebook Entries Preview (Span 5) */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                Session Notebook ({submittedDoubts.length})
              </span>
            </div>

            {submittedDoubts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <span>No inquiry entries logged yet.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {submittedDoubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        {doubt.velocityCondition && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                            {doubt.velocityCondition}
                          </span>
                        )}
                        {doubt.angleCondition && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                            {doubt.angleCondition}
                          </span>
                        )}
                      </div>
                      <span>{doubt.timestamp}</span>
                    </div>

                    <p className="text-slate-800 text-xs leading-relaxed font-sans">
                      {doubt.question}
                    </p>

                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(doubt.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-400">
            CEP Virtual Physics Lab &bull; Kinematics Notebook
          </div>
        </div>

      </div>

    </div>
  );
};
