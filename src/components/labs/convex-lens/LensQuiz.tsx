import React, { useState } from 'react';
import { CONVEX_LENS_QUIZ_QUESTIONS } from '../../../data/convexLensData';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

export const LensQuiz: React.FC = () => {
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
    CONVEX_LENS_QUIZ_QUESTIONS.forEach((q) => {
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
  const allAnswered = CONVEX_LENS_QUIZ_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div id="lens-quiz-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Formative Concept Assessment</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Convex Lens Concept Quiz ({CONVEX_LENS_QUIZ_QUESTIONS.length} Questions)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Test your understanding of Cartesian sign convention, thin-lens formula, linear magnification, and 1/v vs 1/u graphical intercept analysis.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono text-xs font-bold">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>
                Score: {score} / {CONVEX_LENS_QUIZ_QUESTIONS.length} ({Math.round((score / CONVEX_LENS_QUIZ_QUESTIONS.length) * 100)}%)
              </span>
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

      {/* Quiz Questions List */}
      <div className="divide-y divide-slate-100 space-y-6">
        {CONVEX_LENS_QUIZ_QUESTIONS.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div key={q.id} className="pt-6 first:pt-2 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {q.question}
                </h4>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'border-rose-300 bg-rose-50 text-rose-900';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-600';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${btnStyle}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      {isSubmitted && optIdx === q.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation upon submission */}
              {isSubmitted && (
                <div className="ml-8 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="text-emerald-700">&bull; Correct Answer</span>
                    ) : (
                      <span className="text-rose-700">&bull; Explanation &amp; Physics Rationale</span>
                    )}
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Control */}
      {!isSubmitted && (
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-500">
            {Object.keys(selectedAnswers).length} of {CONVEX_LENS_QUIZ_QUESTIONS.length} questions answered
          </span>
          <button
            onClick={() => setIsSubmitted(true)}
            disabled={!allAnswered}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
              allAnswered
                ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            Submit Answers &amp; Check Score
          </button>
        </div>
      )}
    </div>
  );
};
