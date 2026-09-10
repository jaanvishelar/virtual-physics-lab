import React, { useState } from 'react';
import { OHMS_LAW_QUIZ } from '../../../data/ohmsLawData';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return; // Locked after submit until reset
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    OHMS_LAW_QUIZ.forEach((q) => {
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
  const allAnswered = OHMS_LAW_QUIZ.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div id="quiz-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Formative Concept Assessment</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Laboratory Concept Quiz (5 Questions)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Test your conceptual understanding of potential difference, current, resistance, and slope interpretations.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono text-xs font-bold">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Score: {score} / {OHMS_LAW_QUIZ.length} ({Math.round((score / OHMS_LAW_QUIZ.length) * 100)}%)</span>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="mt-6 space-y-6">
        {OHMS_LAW_QUIZ.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/40 border-rose-200'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                  Question {qIndex + 1}
                </span>
                {isSubmitted && (
                  <span className={`text-xs font-mono font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-3.5">
                {q.question}
              </h4>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let optionStyles = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300';

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optionStyles = 'bg-emerald-100/90 border-emerald-300 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyles = 'bg-rose-100/90 border-rose-300 text-rose-950 line-through';
                    } else {
                      optionStyles = 'bg-white/60 border-slate-200 text-slate-400 opacity-70';
                    }
                  } else if (isSelected) {
                    optionStyles = 'bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold ring-1 ring-indigo-500';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-3 focus:outline-none ${optionStyles}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-[11px] font-mono mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown ONLY after submission) */}
              {isSubmitted && (
                <div className="mt-3.5 p-3 rounded-lg bg-white/90 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                  <span className="font-bold text-slate-900 font-mono">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-mono">
            {Object.keys(selectedAnswers).length} of {OHMS_LAW_QUIZ.length} questions answered
          </p>

          <button
            id="btn-submit-quiz"
            disabled={!allAnswered}
            onClick={() => setIsSubmitted(true)}
            className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all focus:outline-none ${
              allAnswered
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {allAnswered ? 'Submit Answers for Evaluation' : 'Select all 5 answers to submit'}
          </button>
        </div>
      )}

    </div>
  );
};
