import React, { useState } from 'react';
import { MessageSquareText, HelpCircle, AlertCircle, CheckCircle2, Send, X, Sparkles, BookOpen, Layers } from 'lucide-react';
import { DoubtDraft } from '../types';

interface MentoringPreviewProps {
  initialExperimentTopic?: string;
  isOpenModalDirectly?: boolean;
  onCloseModalDirectly?: () => void;
}

export const MentoringPreview: React.FC<MentoringPreviewProps> = ({
  initialExperimentTopic,
  isOpenModalDirectly = false,
  onCloseModalDirectly,
}) => {
  const [modalOpen, setModalOpen] = useState(isOpenModalDirectly);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  
  const [draft, setDraft] = useState<DoubtDraft>({
    studentName: '',
    studentClass: 'Class 10',
    experimentTopic: initialExperimentTopic || "Ohm's Law & Resistance",
    doubtCategory: 'Graph Interpretation',
    description: '',
  });

  // Sync if opened directly with an experiment topic
  React.useEffect(() => {
    if (isOpenModalDirectly) {
      setModalOpen(true);
      if (initialExperimentTopic) {
        setDraft(prev => ({ ...prev, experimentTopic: initialExperimentTopic }));
      }
    }
  }, [isOpenModalDirectly, initialExperimentTopic]);

  const handleClose = () => {
    setModalOpen(false);
    setSubmittedSuccess(false);
    if (onCloseModalDirectly) {
      onCloseModalDirectly();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.description.trim()) return;
    setSubmittedSuccess(true);
  };

  return (
    <section id="mentoring-section" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Bento Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-50/70 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 font-mono mb-4 border border-indigo-200/60">
              <MessageSquareText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Community Academic Support</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Physics Doubt Support
            </h2>

            {/* Required Text */}
            <p className="mt-4 text-lg sm:text-xl text-slate-700 leading-relaxed font-normal">
              Not sure why your graph looks different? Confused about a formula or observation? Students will be able to record their practical doubts and receive guidance.
            </p>

            {/* Support Guidance Note */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-mono">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Academic Mentoring: Submit practical questions and experimental doubts to receive structured guidance.</span>
            </div>

            {/* Primary CTA */}
            <div className="mt-8">
              <button
                id="cta-ask-physics-doubt"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200 transition-all text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <HelpCircle className="w-5 h-5 text-indigo-200" />
                <span>Ask a Physics Doubt</span>
              </button>
            </div>
          </div>

          {/* Common Practical Doubt Scenarios (Bento Tiles) */}
          <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
              <span className="text-xs font-mono font-bold text-indigo-700 block mb-1">01 &bull; Graph Discrepancy</span>
              <p className="text-xs text-slate-600">
                Why doesn't my V-I line pass cleanly through the origin? (Zero error or thermal drift issues).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
              <span className="text-xs font-mono font-bold text-indigo-700 block mb-1">02 &bull; Apparatus Parallax</span>
              <p className="text-xs text-slate-600">
                How do I verify if the optical needle and inverted image are moving without separation?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
              <span className="text-xs font-mono font-bold text-indigo-700 block mb-1">03 &bull; Units &amp; Significant Figures</span>
              <p className="text-xs text-slate-600">
                Converting spring constant from g/cm to standard SI N/m without losing rounding accuracy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
              <span className="text-xs font-mono font-bold text-indigo-700 block mb-1">04 &bull; Viva Voce Defense</span>
              <p className="text-xs text-slate-600">
                Explaining why simple pendulum amplitude must remain small for the standard time-period equation to remain a good approximation.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Doubt Recording Modal Preview */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="doubt-modal-title"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in-50 zoom-in-95 duration-150 relative">
            
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!submittedSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
                    Physics Doubt Submission
                  </span>
                </div>

                <h3 id="doubt-modal-title" className="text-xl font-bold text-slate-900">
                  Ask a Physics Doubt
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  Record questions regarding formula derivations, unexpected observations, or graphical slopes.
                </p>

                {/* Class & Topic row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono">
                      Student Class
                    </label>
                    <select
                      value={draft.studentClass}
                      onChange={(e) => setDraft({ ...draft, studentClass: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Class 9</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono">
                      Experiment Topic
                    </label>
                    <select
                      value={draft.experimentTopic}
                      onChange={(e) => setDraft({ ...draft, experimentTopic: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Ohm's Law & Resistance</option>
                      <option>Simple Pendulum & Gravity</option>
                      <option>Hooke's Law & Spring Constant</option>
                      <option>Convex Lens & Focal Length</option>
                      <option>Projectile Motion & Kinematics</option>
                      <option>General Practical Physics</option>
                    </select>
                  </div>
                </div>

                {/* Doubt Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono">
                    Type of Practical Query
                  </label>
                  <select
                    value={draft.doubtCategory}
                    onChange={(e) => setDraft({ ...draft, doubtCategory: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Graph Interpretation</option>
                    <option>Formula Application</option>
                    <option>Apparatus Zero Error</option>
                    <option>Observation Anomaly</option>
                    <option>Calculation Steps</option>
                    <option>General Practical Theory</option>
                  </select>
                </div>

                {/* Description input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono">
                    Describe your observation or question
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g., When increasing the resistance on the rheostat, my voltmeter reading drops unexpectedly. How do I isolate circuit contact resistance?"
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Guidance Notice */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 leading-relaxed font-mono">
                  * Note: Submissions are stored locally in your practical workbook for review and classroom discussion.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-doubt-btn"
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Doubt</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Doubt Recorded Successfully
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you! Your practical query for <strong>{draft.experimentTopic}</strong> has been logged in your local study workbook.
                </p>
                <div className="p-3 rounded-lg bg-slate-50 text-slate-500 text-[11px] font-mono border border-slate-200">
                  Topic: {draft.experimentTopic} &bull; Type: {draft.doubtCategory}
                </div>
                <button
                  onClick={handleClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Return to Laboratory
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
