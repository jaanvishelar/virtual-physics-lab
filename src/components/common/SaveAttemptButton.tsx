import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveExperimentSubmission } from '../../services/submissionService';
import { BookmarkCheck, CheckCircle2, AlertCircle, LogIn, ArrowRight, Loader2 } from 'lucide-react';

interface SaveAttemptButtonProps {
  experimentSlug: string;
  experimentTitle: string;
  inputs: Record<string, number | string | boolean>;
  calculatedResults: Record<string, number | string>;
  observations?: Array<Record<string, any>>;
  notes?: string;
  onSaved?: (attemptNumber: number) => void;
}

export function SaveAttemptButton({
  experimentSlug,
  experimentTitle,
  inputs,
  calculatedResults,
  observations = [],
  notes = '',
  onSaved,
}: SaveAttemptButtonProps) {
  const { user, profile, isConfigured } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [savedAttempt, setSavedAttempt] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user || !profile) {
      window.location.hash = '#login';
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const submission = await saveExperimentSubmission({
        studentId: user.uid,
        studentName: profile.displayName || user.displayName || 'Student',
        studentEmail: profile.email || user.email || '',
        classGrade: profile.classGrade || 'Class 9',
        division: profile.division || 'A',
        experimentSlug,
        experimentTitle,
        inputs,
        calculatedResults,
        observations,
        notes,
      });

      setSavedAttempt(submission.attemptNumber);
      if (onSaved) {
        onSaved(submission.attemptNumber);
      }
    } catch (err: any) {
      console.error('Failed to save attempt:', err);
      setErrorMessage(err.message || 'Failed to save experiment record to database.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Configure Firebase credentials in .env or Vercel to save live attempts to your student logbook.</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Student Authentication Required:</strong> Sign in with your verified student account to access laboratory recording and store this practical attempt.
          </span>
        </div>
        <button
          onClick={() => {
            window.location.hash = '#login';
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In to Record Attempt</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Record Attempt into Laboratory Logbook
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <strong className="text-slate-800">{profile?.displayName || user?.displayName || 'Student'}</strong> ({profile?.classGrade || 'Class 9'} Div {profile?.division || 'A'})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {savedAttempt !== null ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attempt #{savedAttempt} Saved!</span>
              <a
                href="#student-dashboard"
                className="ml-1 underline text-emerald-900 hover:text-emerald-950 inline-flex items-center gap-0.5"
              >
                View in Dashboard <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Record...</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Save Attempt to Lab Record</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
