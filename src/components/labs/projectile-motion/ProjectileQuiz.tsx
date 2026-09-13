import React, { useState } from 'react';
import { PROJECTILE_QUIZ } from '../../../data/projectileMotionData';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

export const ProjectileQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    PROJECTILE_QUIZ.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = PROJECTILE_QUIZ.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div id="projectile-quiz-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Formative Concept Assessment</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Projectile Motion Concept Quiz ({PROJECTILE_QUIZ.length} Questions)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Evaluate your understanding of parabolic trajectories, velocity decomposition, time of flight, and optimal range angles.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono text-xs font-bold">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Score: {score} / {PROJECTILE_QUIZ.length} ({Math.round((score / PROJECTILE_QUIZ.length) * 100)}%)</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="divide-y divide-slate-100 mt-4 space-y-6">
        {PROJECTILE_QUIZ.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div key={q.id} className="pt-5 first:pt-2">
              <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-3 flex items-start gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                  Q{idx + 1}
                </span>
                <span>{q.question}</span>
              </h4>

              {/* Options */}
              <div className="space-y-2 mb-3">
                {q.options.map((option, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-700';

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-300 bg-rose-50/80 text-rose-950';
                    } else {
                      optionStyle = 'border-slate-200 opacity-60 text-slate-500';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-medium shadow-2xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-mono text-slate-500 shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isSubmitted && optIdx === q.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Rationale feedback */}
              {isSubmitted && (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed font-sans ${
                    isCorrect
                      ? 'bg-emerald-50/90 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-50/90 text-amber-950 border border-amber-200'
                  }`}
                >
                  <strong className="font-semibold block mb-0.5">
                    {isCorrect ? '✓ Correct Explanation:' : '✗ Model Explanation:'}
                  </strong>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Footer */}
      {!isSubmitted && (
        <div className="pt-6 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-mono">
            {Object.keys(selectedAnswers).length} of {PROJECTILE_QUIZ.length} questions answered
          </span>

          <button
            id="btn-submit-projectile-quiz"
            type="button"
            disabled={!allAnswered}
            onClick={() => setIsSubmitted(true)}
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              allAnswered
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            Submit &amp; View Explanations
          </button>
        </div>
      )}

    </div>
  );
};
