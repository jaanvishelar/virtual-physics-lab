import React, { useState } from 'react';
import { SIMPLE_PENDULUM_QUIZ } from '../../../data/simplePendulumData';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

export const PendulumQuiz: React.FC = () => {
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
    SIMPLE_PENDULUM_QUIZ.forEach((q) => {
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
  const allAnswered = SIMPLE_PENDULUM_QUIZ.every((q) => selectedAnswers[q.id] !== undefined);

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
            Simple Pendulum Concept Quiz (5 Questions)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Test your understanding of time period, effective length, T² vs L regression, and small angle approximations.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono text-xs font-bold">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Score: {score} / {SIMPLE_PENDULUM_QUIZ.length} ({Math.round((score / SIMPLE_PENDULUM_QUIZ.length) * 100)}%)</span>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="mt-6 space-y-6">
        {SIMPLE_PENDULUM_QUIZ.map((q, qIndex) => {
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
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                  <span className="font-mono text-indigo-600 mr-2">Q{qIndex + 1}.</span>
                  {q.question}
                </div>
                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                {q.options.map((opt, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  const isRightAnswer = q.correctIndex === optIndex;

                  let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';

                  if (isSubmitted) {
                    if (isRightAnswer) {
                      btnStyle = 'bg-emerald-100/80 border-emerald-300 text-emerald-900 font-semibold';
                    } else if (isSelected && !isRightAnswer) {
                      btnStyle = 'bg-rose-100/80 border-rose-300 text-rose-900 line-through';
                    } else {
                      btnStyle = 'bg-slate-100/60 border-slate-200 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold ring-1 ring-indigo-300';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIndex)}
                      className={`text-left p-3 rounded-lg border text-xs sm:text-sm font-sans transition-all flex items-center justify-between ${btnStyle} ${
                        !isSubmitted ? 'cursor-pointer active:scale-99' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-slate-400 w-5">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submit */}
              {isSubmitted && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/80 text-xs text-slate-600 bg-white/60 p-3 rounded-lg">
                  <strong className="text-slate-800 font-mono">Concept Note: </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Submit Bar */}
      {!isSubmitted && (
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-500">
            {Object.keys(selectedAnswers).length} of {SIMPLE_PENDULUM_QUIZ.length} questions selected
          </span>
          <button
            onClick={() => setIsSubmitted(true)}
            disabled={!allAnswered}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-xs ${
              allAnswered
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            Submit Quiz for Evaluation
          </button>
        </div>
      )}

    </div>
  );
};
