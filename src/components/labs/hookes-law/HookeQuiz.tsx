import React, { useState } from 'react';
import { HOOKES_LAW_QUIZ } from '../../../data/hookesLawData';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

export const HookeQuiz: React.FC = () => {
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
    HOOKES_LAW_QUIZ.forEach((q) => {
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
  const allAnswered = HOOKES_LAW_QUIZ.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div id="hooke-quiz-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Formative Concept Assessment</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Hooke's Law Concept Quiz (5 Questions)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Evaluate your understanding of linear elasticity, spring constant units, F vs x graph slopes, and the elastic limit.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono text-xs font-bold">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Score: {score} / {HOOKES_LAW_QUIZ.length} ({Math.round((score / HOOKES_LAW_QUIZ.length) * 100)}%)</span>
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

      {/* Quiz Items List */}
      <div className="divide-y divide-slate-100 mt-4 space-y-6">
        {HOOKES_LAW_QUIZ.map((q, idx) => {
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
                    btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-2xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={isSubmitted}
                      className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full border border-current text-[10px] font-mono flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>

                      {isSubmitted && optIdx === q.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback / Explanation Box */}
              {isSubmitted && (
                <div
                  className={`mt-2.5 ml-8 p-3 rounded-xl text-xs leading-relaxed font-sans ${
                    isCorrect
                      ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/70 border border-amber-200 text-amber-900'
                  }`}
                >
                  <strong className="font-semibold block mb-0.5">
                    {isCorrect ? 'Correct!' : 'Incorrect — Model Explanation:'}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Submission Button */}
      {!isSubmitted && (
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            {Object.keys(selectedAnswers).length} of {HOOKES_LAW_QUIZ.length} answered
          </span>

          <button
            onClick={() => setIsSubmitted(true)}
            disabled={!allAnswered}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Submit &amp; View Explanations
          </button>
        </div>
      )}

    </div>
  );
};
